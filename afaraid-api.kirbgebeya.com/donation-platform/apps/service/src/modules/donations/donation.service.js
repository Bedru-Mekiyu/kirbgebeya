import models from "./models/donation.models.js";
import sequelize from "../../config/db.js";
const { Donor, Donation, Payment, Campaign, GoatPricing } = models;
import { Chapa } from "chapa-nodejs";
import { v4 as uuidv4 } from "uuid";
import CampaignDetail from "../campaigns/models/campaignDetail.model.js";
import Stats from "../stats/models/stats.model.js";
import { createNotification } from "./notification.service.js";
const chapa = new Chapa({
  secretKey: process.env.CHAPA_SECRET_KEY,
});

let socketHandlers = null;

export const setSocketHandlers = (handlers) => {
  if (handlers && typeof handlers.handleNewDonation === "function") {
    socketHandlers = handlers;
    console.log("✅ Socket handlers set successfully in donation service");
  } else {
    console.warn("⚠️ Invalid socket handlers provided");
    socketHandlers = null;
  }
};

const validateSocketHandlers = () => {
  if (!socketHandlers) {
    console.log("⚠️ Socket handlers not available");
    return false;
  }

  const requiredMethods = [
    "handleNewDonation",
    "handleStatsUpdate",
    "handleCampaignsUpdate",
    "handleDonorsUpdate",
    "handlePaymentsUpdate",
    "handleGoatsUpdate",
  ];

  for (const method of requiredMethods) {
    if (typeof socketHandlers[method] !== "function") {
      console.warn(`⚠️ Socket handlers missing method: ${method}`);
      return false;
    }
  }

  return true;
};
export const createDonation = async (donorData, donationData, paymentData) => {
  const transaction = await sequelize.transaction();
  try {
    let donor;
    let isFirstTimeDonor = false;

    donor = await Donor.findOne({
      where: { email: donorData.email },
      transaction,
    });

    if (!donor) {
      isFirstTimeDonor = true;
      const donationId = uuidv4();
      const donorIdentityNumber = `DON-${donationId.slice(
        0,
        4
      )}${donationId.slice(-2)}`;

      donor = await Donor.create(
        {
          ...donorData,
          donorIdentityNumber,
        },
        { transaction }
      );
    }

    if (donationData.donationType === "goats" && !donationData.goatDetails) {
      donationData.goatDetails = [];
    }

    const donation = await Donation.create(
      {
        ...donationData,
        donorId: donor.id,
      },
      { transaction }
    );

    let payment;
    let checkoutUrl = null;
    switch (paymentData.provider) {
      case "chapa": {
        const tx_ref = await chapa.genTxRef();

        let chapaResponse;

        try {
          chapaResponse = await chapa.initialize({
            first_name: donor.firstName,
            last_name: donor.lastName,
            email: donor.email,
            phone_number: paymentData.phoneNumber || "0911000000",
            currency: "ETB",
            amount: donationData.totalAmount.toString(),
            tx_ref,
            callback_url: `${process.env.BASE_URL}/api/payments/verify`,
            return_url: `${process.env.APP_URL}/payment/success?tx_ref=${tx_ref}`,
            customization: {
              title: "AfarAid Donation",
              description: `Donation for ${
                donationData.campaignId ? "Campaign" : "General Fund"
              }`,
            },
          });
        } catch (error) {
          console.error("Chapa initialization failed:", error);
          throw new Error(
            "Failed to initialize payment. Please try again later."
          );
        }

        payment = await Payment.create(
          {
            donationId: donation.id,
            provider: "chapa",
            paymentMethod: paymentData.method || "card",
            amount: donationData.totalAmount,
            currency: "ETB",
            tx_ref,
            status: "pending",
            metadata: chapaResponse,
          },
          { transaction }
        );

        checkoutUrl = chapaResponse.data.checkout_url;
        break;
      }

      default:
        throw new Error(
          `Unsupported payment provider: ${paymentData.provider}`
        );
    }

    if (donationData.campaignId) {
      const campaignDetail = await CampaignDetail.findOne({
        where: { campaignId: donationData.campaignId },
        transaction,
      });

      if (campaignDetail) {
        const updatedRaisedAmount =
          (campaignDetail.raisedAmount || 0) + (donationData.totalAmount || 0);
        const updatedDonors = (campaignDetail.donors || 0) + 1;

        await campaignDetail.update(
          {
            raisedAmount: updatedRaisedAmount,
            donors: updatedDonors,
          },
          { transaction }
        );
      }
    }

    await transaction.commit();
    await triggerRealTimeUpdates(donation, donor, isFirstTimeDonor);

    await createNotification({
      recipientType: "donor",
      recipientId: donor.id,
      title: isFirstTimeDonor
        ? "Welcome & Donation Received"
        : "Donation Received",
      message: isFirstTimeDonor
        ? `Thank you for your donation of ${donationData.totalAmount} ETB. Your Donor Identity Number is ${donor.donorIdentityNumber}.`
        : `Thank you for your donation of ${donationData.totalAmount} ETB. Please continue using your Donor Identity Number: ${donor.donorIdentityNumber}.`,
      type: "donation",
      channel: ["email"],
      isFirstTimeDonor,
      donationData,
    });

    return { donor, donation, payment, checkoutUrl };
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    throw error;
  }
};

const triggerRealTimeUpdates = async (donation, donor, isFirstTimeDonor) => {
  if (!validateSocketHandlers()) {
    console.log(
      "⏩ Skipping real-time updates - socket handlers not available"
    );
    return;
  }

  try {
    const donationForBroadcast = await Donation.findByPk(donation.id, {
      include: [
        {
          model: Donor,
          as: "donor",
          attributes: ["firstName", "lastName", "email"],
        },
        {
          model: Campaign,
          as: "campaign",
          attributes: ["title"],
        },
        {
          model: Payment,
          as: "payment",
          attributes: ["amount", "status", "paymentMethod"],
        },
      ],
    });

    socketHandlers.handleNewDonation(
      formatDonationForBroadcast(donationForBroadcast)
    );
    const donorStats = await getDonorStats();
    socketHandlers.handleDonorsUpdate(donorStats);

    if (donation.campaignId) {
      const campaigns = await getAllCampaignsForBroadcast();
      socketHandlers.handleCampaignsUpdate(campaigns);
    }

    const stats = await getUpdatedStats();
    socketHandlers.handleStatsUpdate(stats);

    const paymentStats = await getPaymentStats();
    socketHandlers.handlePaymentsUpdate(paymentStats);

    if (donation.donationType === "goats") {
      const goatAnalytics = await getGoatAnalytics();
      socketHandlers.handleGoatsUpdate(goatAnalytics);
    }
  } catch (error) {
    console.error("❌ Error triggering real-time updates:", error);
  }
};

const formatDonationForBroadcast = (donation) => {
  return {
    id: donation.id,
    donor: donation.donor || "Anonymous",
    campaign: donation.campaign || "General Donation",
    totalAmount: donation.totalAmount || 0,
    status: donation.status || "Pending",
    method: donation.payment?.paymentMethod || "N/A",
    date: donation.createdAt.toISOString(),
    createdAt: donation.createdAt.toISOString(),
  };
};

const getAllCampaignsForBroadcast = async () => {
  try {
    const campaigns = await Campaign.findAll({
      include: [
        {
          model: CampaignDetail,
          as: "detail",
          attributes: [
            "goalAmount",
            "raisedAmount",
            "donors",
            "location",
            "currency",
          ],
        },
      ],
      attributes: ["id", "title", "status"],
    });

    return campaigns.map((campaign) => ({
      id: campaign.id,
      title: campaign.title,
      status: campaign.status,
      detail: campaign.detail,
    }));
  } catch (error) {
    console.error("Error fetching campaigns for broadcast:", error);
    return [];
  }
};

const getUpdatedStats = async () => {
  try {
    const totalRaisedResult = await Donation.findOne({
      attributes: [
        [sequelize.fn("SUM", sequelize.col("totalAmount")), "totalRaised"],
      ],
      raw: true,
    });

    const totalDonations = await Donation.count();

    const totalDonors = await Donor.count();

    const goatsDistributed = Math.floor(
      (totalRaisedResult.totalRaised || 0) / 2500
    );

    const familiesSupported = Math.floor(goatsDistributed / 3);

    return {
      familiesSupported,
      fundsRaised: totalRaisedResult.totalRaised || 0,
      goatsDistributed,
      totalDonations,
      totalDonors,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error calculating stats:", error);
    return {
      familiesSupported: 0,
      fundsRaised: 0,
      goatsDistributed: 0,
      totalDonations: 0,
      totalDonors: 0,
      updatedAt: new Date().toISOString(),
    };
  }
};

const getPaymentStats = async () => {
  try {
    const paymentStats = await Payment.findOne({
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "totalPayments"],
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
        [sequelize.fn("AVG", sequelize.col("amount")), "averageAmount"],
      ],
      where: { status: "completed" },
      raw: true,
    });

    const completedPayments = await Payment.count({
      where: { status: "completed" },
    });

    const pendingPayments = await Payment.count({
      where: { status: "pending" },
    });

    const failedPayments = await Payment.count({
      where: { status: "failed" },
    });

    return {
      totalPayments: paymentStats.totalPayments || 0,
      completedPayments,
      pendingPayments,
      failedPayments,
      totalAmount: paymentStats.totalAmount || 0,
      averageAmount: paymentStats.averageAmount || 0,
      refundedAmount: 0,
    };
  } catch (error) {
    console.error("Error calculating payment stats:", error);
    return {
      totalPayments: 0,
      completedPayments: 0,
      pendingPayments: 0,
      failedPayments: 0,
      totalAmount: 0,
      averageAmount: 0,
      refundedAmount: 0,
    };
  }
};

const getGoatAnalytics = async () => {
  try {
    const goatDonations = await Donation.findAll({
      where: {
        donationType: "goats",
        status: "completed",
      },
      include: [
        {
          model: Campaign,
          as: "campaign",
          attributes: ["title"],
        },
      ],
    });

    const totalGoatsDonated = goatDonations.reduce((sum, donation) => {
      return sum + (donation.goatDetails?.length || 1);
    }, 0);

    const familiesSupported = Math.floor(totalGoatsDonated / 3);

    const campaignMap = {};
    goatDonations.forEach((donation) => {
      const campaignName = donation.campaign?.title || "General Donation";
      if (!campaignMap[campaignName]) {
        campaignMap[campaignName] = 0;
      }
      campaignMap[campaignName] += donation.goatDetails?.length || 1;
    });

    const popularCampaigns = Object.entries(campaignMap)
      .map(([name, goatCount]) => ({
        name,
        goatCount,
        percentage:
          totalGoatsDonated > 0 ? (goatCount / totalGoatsDonated) * 100 : 0,
      }))
      .sort((a, b) => b.goatCount - a.goatCount)
      .slice(0, 5);

    return {
      totalGoatsDonated,
      totalFamiliesSupported: familiesSupported,
      goatsDonated: totalGoatsDonated,
      monthlyTrend: 0,
      popularCampaigns,
      recentDonations: goatDonations.slice(0, 10).map((donation) => ({
        id: donation.id,
        donorName: "Anonymous",
        quantity: donation.goatDetails?.length || 1,
        amount: donation.totalAmount,
        date: donation.createdAt.toISOString(),
        campaign: donation.campaign?.title || null,
      })),
      currency: "ETB",
    };
  } catch (error) {
    console.error("Error calculating goat analytics:", error);
    return {
      totalGoatsDonated: 0,
      totalFamiliesSupported: 0,
      goatsDonated: 0,
      monthlyTrend: 0,
      popularCampaigns: [],
      recentDonations: [],
      currency: "ETB",
    };
  }
};

export const getRecentDonations = async (limit = 10) => {
  try {
    const donations = await Donation.findAll({
      include: [
        {
          model: Donor,
          as: "donor",
          attributes: ["firstName", "lastName", "email"],
        },
        {
          model: Campaign,
          as: "campaign",
          attributes: ["title"],
        },
        {
          model: Payment,
          as: "payment",
          attributes: ["amount", "status", "paymentMethod"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
    });

    return donations.map((donation) => ({
      id: donation.id,
      donor: donation.donor || "Anonymous",
      email: donation.email || "N/A",
      campaign: donation.campaign || "General Donation",
      totalAmount: donation.totalAmount || 0,
      donationType: donation.donationType,
      status: donation.status || "Pending",
      method: donation.method || "N/A",
      date: donation.date || new Date().toISOString().split("T")[0],
    }));
  } catch (error) {
    throw new Error(`Failed to fetch recent donations: ${error.message}`);
  }
};

export const getDashboardByIdentity = async (donorIdentityNumber) => {
  const donor = await Donor.findOne({
    where: { donorIdentityNumber },
    attributes: ["id"],
  });
  if (!donor) throw new Error("Donor not found");

  const donorId = donor.id;

  const donations = await Donation.findAll({
    where: { donorId },
    attributes: [
      "id",
      "campaignId",
      "totalAmount",
      "createdAt",
      [sequelize.col("payment.status"), "paymentStatus"],
    ],
    include: [
      {
        model: Payment,
        as: "payment",
        attributes: ["status", "tx_ref", "paymentMethod"],
      },
      {
        model: Campaign,
        as: "campaign",
        attributes: ["title"],
      },
      {
        model: Donor,
        as: "donor",
        attributes: [
          "donorIdentityNumber",
          "firstName",
          "lastName",
          "email",
          "phone",
          "city",
          "country",
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  const totalDonated = donations.reduce(
    (sum, d) => sum + (d.totalAmount || 0),
    0
  );
  const totalDonations = donations.length;
  const uniqueCampaigns = new Set(
    donations.map((d) => d.campaignId).filter(Boolean)
  ).size;
  const lastDonation =
    donations[0]?.createdAt?.toISOString().split("T")[0] || null;

  let totalGoats = 0;

  for (const donation of donations) {
    const campaignId = donation.campaignId;
    let goatPrice = 50;

    if (campaignId) {
      const campaignPricing = await GoatPricing.findOne({
        where: {
          campaignId,
          isActive: true,
        },
        order: [["createdAt", "DESC"]],
      });

      if (campaignPricing) {
        goatPrice = parseFloat(campaignPricing.goatPrice);
      } else {
        const generalPricing = await GoatPricing.findOne({
          where: {
            campaignId: null,
            isActive: true,
          },
          order: [["createdAt", "DESC"]],
        });

        if (generalPricing) {
          goatPrice = parseFloat(generalPricing.goatPrice);
        }
      }
    } else {
      const generalPricing = await GoatPricing.findOne({
        where: {
          campaignId: null,
          isActive: true,
        },
        order: [["createdAt", "DESC"]],
      });

      if (generalPricing) {
        goatPrice = parseFloat(generalPricing.goatPrice);
      }
    }

    const goatsFromThisDonation = Math.floor(donation.totalAmount / goatPrice);
    totalGoats += goatsFromThisDonation;
  }

  const goatsProvided = totalGoats;
  const familiesHelped = Math.floor(totalGoats / 3);
  const communitiesReached = uniqueCampaigns;

  const enrichedDonations = donations.map((d) => {
    const rawStatus = d.payment.status;
    let status = "Unknown";

    if (rawStatus) {
      status =
        rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();
    }
    return {
      id: d.id,
      campaignId: d.campaignId,
      campaignTitle: d.campaign?.title || "General Donation",
      donorIdentityNumber: d.donor.donorIdentityNumber,
      paymentMethod: d.payment?.paymentMethod || "N/A",
      amount: d.totalAmount,
      date: d.createdAt.toISOString().split("T")[0],
      status,
      tx_ref: d.payment?.tx_ref || null,
      receipt: `receipt_${d.id}.pdf`,
    };
  });

  return {
    totalDonated,
    totalDonations,
    campaignsSupported: uniqueCampaigns,
    lastDonation,
    donations: enrichedDonations,
    impact: {
      familiesHelped,
      goatsProvided,
      communitiesReached,
    },
  };
};

export const getDonationById = async (id) => {
  return Donation.findOne({
    where: { id },
    include: [
      { model: Donor, as: "donor" },
      { model: Payment, as: "payment" },
      { model: Campaign, as: "campaign" },
    ],
  });
};

export const validateDonorIdentity = async (donorIdentityNumber) => {
  const donor = await Donor.findOne({
    where: { donorIdentityNumber },
    attributes: ["id"],
  });
  return donor;
};

export const getAllDonations = async () => {
  return Donation.findAll({
    include: [
      { model: Donor, as: "donor" },
      { model: Payment, as: "payment" },
      { model: Campaign, as: "campaign" },
    ],
  });
};

export const updateDonation = async (id, donationData) => {
  const donation = await Donation.findByPk(id);
  if (!donation) throw new Error("Donation not found");

  return donation.update(donationData);
};

export const deleteDonation = async (id) => {
  const donation = await Donation.findByPk(id);
  if (!donation) throw new Error("Donation not found");

  return donation.destroy();
};

export const getAllDonors = async () => {
  try {
    const donors = await Donor.findAll({
      attributes: [
        "id",
        "donorIdentityNumber",
        "firstName",
        "lastName",
        "email",
        "phone",
        "address",
        "city",
        "state",
        "zipCode",
        "country",
        "createdAt",
        "updatedAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    const donorsWithStats = await Promise.all(
      donors.map(async (donor) => {
        const donations = await Donation.findAll({
          where: { donorId: donor.id },
          attributes: ["totalAmount", "createdAt"],
          order: [["createdAt", "DESC"]],
        });

        const donationStats = {
          count: donations.length,
          totalAmount: donations.reduce(
            (sum, donation) => sum + (donation.totalAmount || 0),
            0
          ),
          lastDonation: donations[0]?.createdAt || null,
        };

        return {
          ...donor.toJSON(),
          donations: donationStats,
        };
      })
    );

    return donorsWithStats;
  } catch (error) {
    throw new Error(`Failed to fetch donors: ${error.message}`);
  }
};

export const getDonorById = async (donorId) => {
  try {
    const donor = await Donor.findByPk(donorId, {
      attributes: [
        "id",
        "donorIdentityNumber",
        "firstName",
        "lastName",
        "email",
        "phone",
        "address",
        "city",
        "state",
        "zipCode",
        "country",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!donor) {
      throw new Error("Donor not found");
    }

    const donations = await Donation.findAll({
      where: { donorId },
      include: [
        {
          model: Campaign,
          as: "campaign",
          attributes: ["title"],
        },
        {
          model: Payment,
          as: "payment",
          attributes: ["status", "paymentMethod"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const donationStats = {
      count: donations.length,
      totalAmount: donations.reduce(
        (sum, donation) => sum + (donation.totalAmount || 0),
        0
      ),
      lastDonation: donations[0]?.createdAt || null,
      donations: donations.map((donation) => ({
        id: donation.id,
        amount: donation.totalAmount,
        type: donation.donationType,
        campaign: donation.campaign?.title || "General Donation",
        status: donation.payment?.status || "unknown",
        date: donation.createdAt,
      })),
    };

    return {
      ...donor.toJSON(),
      donations: donationStats,
    };
  } catch (error) {
    throw new Error(`Failed to fetch donor: ${error.message}`);
  }
};

export const getDonorStats = async () => {
  try {
    const totalDonors = await Donor.count();

    const donations = await Donation.findAll({
      attributes: ["donorId", "totalAmount", "createdAt"],
      include: [
        {
          model: Donor,
          as: "donor",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
    });

    const donorStats = {};
    let totalDonations = 0;
    let totalAmount = 0;

    donations.forEach((donation) => {
      totalDonations++;
      totalAmount += donation.totalAmount || 0;

      const donorId = donation.donorId;
      if (!donorStats[donorId]) {
        donorStats[donorId] = {
          donor: donation.donor,
          count: 0,
          totalAmount: 0,
          lastDonation: null,
        };
      }

      donorStats[donorId].count++;
      donorStats[donorId].totalAmount += donation.totalAmount || 0;

      const donationDate = new Date(donation.createdAt);
      if (
        !donorStats[donorId].lastDonation ||
        donationDate > new Date(donorStats[donorId].lastDonation)
      ) {
        donorStats[donorId].lastDonation = donation.createdAt;
      }
    });

    const activeDonors = Object.keys(donorStats).length;
    const averageDonation =
      totalDonations > 0 ? totalAmount / totalDonations : 0;

    const topDonors = Object.values(donorStats)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5)
      .map((stat) => ({
        ...stat.donor.toJSON(),
        donations: {
          count: stat.count,
          totalAmount: stat.totalAmount,
          lastDonation: stat.lastDonation,
        },
      }));

    return {
      totalDonors,
      activeDonors,
      totalDonations,
      averageDonation,
      topDonors,
    };
  } catch (error) {
    throw new Error(`Failed to fetch donor statistics: ${error.message}`);
  }
};

export const searchDonors = async (query) => {
  try {
    const donors = await Donor.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${query}%` } },
          { lastName: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } },
          { donorIdentityNumber: { [Op.iLike]: `%${query}%` } },
        ],
      },
      attributes: [
        "id",
        "donorIdentityNumber",
        "firstName",
        "lastName",
        "email",
        "phone",
        "city",
        "state",
        "country",
        "createdAt",
      ],
    });

    // Get donation stats for searched donors
    const donorsWithStats = await Promise.all(
      donors.map(async (donor) => {
        const donations = await Donation.findAll({
          where: { donorId: donor.id },
          attributes: ["totalAmount", "createdAt"],
        });

        const donationStats = {
          count: donations.length,
          totalAmount: donations.reduce(
            (sum, donation) => sum + (donation.totalAmount || 0),
            0
          ),
          lastDonation: donations[0]?.createdAt || null,
        };

        return {
          ...donor.toJSON(),
          donations: donationStats,
        };
      })
    );

    return donorsWithStats;
  } catch (error) {
    throw new Error(`Failed to search donors: ${error.message}`);
  }
};

export const getDonorDonations = async (donorId) => {
  try {
    const donations = await Donation.findAll({
      where: { donorId },
      include: [
        {
          model: Campaign,
          as: "campaign",
          attributes: ["title", "id"],
        },
        {
          model: Payment,
          as: "payment",
          attributes: ["status", "paymentMethod", "createdAt"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return donations.map((donation) => ({
      id: donation.id,
      amount: donation.totalAmount,
      type: donation.donationType,
      campaign: donation.campaign?.title || "General Donation",
      campaignId: donation.campaign?.id,
      status: donation.payment?.status || "unknown",
      paymentMethod: donation.payment?.paymentMethod,
      date: donation.createdAt,
      dedication: donation.dedication,
      anonymous: donation.anonymous,
    }));
  } catch (error) {
    throw new Error(`Failed to fetch donor donations: ${error.message}`);
  }
};
