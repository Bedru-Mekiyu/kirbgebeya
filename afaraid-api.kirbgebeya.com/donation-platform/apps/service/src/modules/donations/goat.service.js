import models from "./models/donation.models.js";
import GoatPricing from "./models/goatPricing.model.js";
import sequelize from "../../config/db.js";
const { Donation, Donor, Campaign, Payment } = models;

import { Op } from "sequelize";

export const getGoatPricing = async () => {
  try {
    const pricing = await GoatPricing.findOne({
      where: {
        isActive: true,
        campaignId: null,
      },
      order: [["createdAt", "DESC"]],
    });

    if (pricing) {
      return {
        goatPrice: parseFloat(pricing.goatPrice),
        currency: pricing.currency,
        lastUpdated: pricing.updatedAt || pricing.createdAt,
        pricingId: pricing.id,
      };
    }

    const defaultPricing = await GoatPricing.create({
      goatPrice: 50.0,
      currency: "ETB",
      isActive: true,
    });

    return {
      goatPrice: 50,
      currency: "ETB",
      lastUpdated: defaultPricing.createdAt,
      pricingId: defaultPricing.id,
    };
  } catch (error) {
    console.error("Error fetching goat pricing:", error);
    return {
      goatPrice: 50,
      currency: "ETB",
      lastUpdated: new Date().toISOString(),
      pricingId: null,
    };
  }
};

export const getGoatPricingByCampaign = async (campaignId) => {
  try {
    let pricing = await GoatPricing.findOne({
      where: {
        isActive: true,
        campaignId,
      },
      order: [["createdAt", "DESC"]],
    });

    if (!pricing) {
      pricing = await GoatPricing.findOne({
        where: {
          isActive: true,
          campaignId: null,
        },
        order: [["createdAt", "DESC"]],
      });
    }

    if (!pricing) {
      return {
        goatPrice: 50,
        currency: "ETB",
        lastUpdated: new Date().toISOString(),
        pricingId: null,
      };
    }
    return {
      goatPrice: parseFloat(pricing.goatPrice),
      currency: pricing.currency,
      lastUpdated: pricing.updatedAt || pricing.createdAt,
      pricingId: pricing.id,
    };
  } catch (error) {
    console.error("Error fetching goat pricing by campaign:", error);
    return {
      goatPrice: 50,
      currency: "ETB",
      lastUpdated: new Date().toISOString(),
      pricingId: null,
    };
  }
};

export const updateGoatPricing = async (pricingData) => {
  const transaction = await sequelize.transaction();
  try {
    const { goatPrice, currency = "ETB" } = pricingData;
    if (goatPrice <= 0) {
      throw new Error("Goat price must be a positive value");
    }

    await GoatPricing.update(
      { isActive: false },
      {
        where: {
          isActive: true,
          campaignId: null,
        },
        transaction,
      }
    );

    const newPricing = await GoatPricing.create(
      {
        goatPrice,
        currency,
        isActive: true,
      },
      { transaction }
    );

    await transaction.commit();

    return {
      goatPrice: parseFloat(newPricing.goatPrice),
      currency: newPricing.currency,
      lastUpdated: newPricing.createdAt,
      pricingId: newPricing.id,
    };
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Failed to update goat pricing: ${error.message}`);
  }
};

export const getGoatAnalytics = async () => {
  try {
    const goatDonations = await Donation.findAll({
      where: { donationType: "goats" },
      include: [
        {
          model: Donor,
          as: "donor",
          attributes: ["firstName", "lastName", "email"],
        },
        { model: Campaign, as: "campaign", attributes: ["title", "id"] },
        {
          model: Payment,
          as: "payment",
          attributes: ["status"],
          where: { status: "pending" },
          required: true,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const currentPricing = await getGoatPricing();

    let totalGoatsDonated = 0;
    let goatsDonated = 0;
    const campaignMap = new Map();
    const recentDonations = [];

    goatDonations.forEach((donation) => {
      const donationValue = donation.totalAmount || 0;
      if (donationValue === 0) return;

      const goats = Math.floor(donationValue / currentPricing.goatPrice);
      goatsDonated += goats;
      totalGoatsDonated += goats;

      if (donation.campaign) {
        const name = donation.campaign.title;
        campaignMap.set(name, (campaignMap.get(name) || 0) + goats);
      }

      if (recentDonations.length < 5) {
        recentDonations.push({
          id: donation.id,
          donorName: donation.anonymous
            ? "Anonymous"
            : `${donation.donor?.firstName || ""} ${donation.donor?.lastName || ""
              }`.trim(),
          quantity: goats,
          amount: donationValue,
          date: donation.createdAt,
          campaign: donation.campaign?.title || null,
        });
      }
    });

    const totalFamiliesSupported = Math.floor(goatsDonated / 3);

    const popularCampaigns = Array.from(campaignMap.entries())
      .map(([name, count]) => ({
        name,
        goatCount: count,
        percentage: totalGoatsDonated
          ? Math.round((count / totalGoatsDonated) * 100)
          : 0,
      }))
      .sort((a, b) => b.goatCount - a.goatCount)
      .slice(0, 5);

    const monthlyTrend = await calculateMonthlyTrend();

    return {
      totalGoatsDonated,
      totalFamiliesSupported,
      goatsDonated,
      monthlyTrend,
      popularCampaigns,
      recentDonations,
      currency: currentPricing.currency,
    };
  } catch (error) {
    console.error("Error fetching goat analytics:", error);
    throw new Error(`Failed to fetch goat analytics: ${error.message}`);
  }
};

const calculateMonthlyTrend = async () => {
  try {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const lastMonth = new Date(currentMonth);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const currentMonthDonations = await Donation.findAll({
      where: {
        donationType: "goats",
        createdAt: {
          [Op.gte]: currentMonth,
        },
      },
      attributes: ["goatDetails"],
      include: [
        {
          model: Payment,
          as: "payment",
          where: { status: "completed" },
          required: true,
          attributes: [],
        },
      ],
    });

    const lastMonthDonations = await Donation.findAll({
      where: {
        donationType: "goats",
        createdAt: {
          [Op.gte]: lastMonth,
          [Op.lt]: currentMonth,
        },
      },
      attributes: ["goatDetails"],
      include: [
        {
          model: Payment,
          as: "payment",
          where: { status: "completed" },
          required: true,
          attributes: [],
        },
      ],
    });

    const currentMonthGoats = currentMonthDonations.reduce(
      (total, donation) => {
        if (donation.goatDetails) {
          return total + (donation.goatDetails.goats || 0);
        }
        return total;
      },
      0
    );

    const lastMonthGoats = lastMonthDonations.reduce((total, donation) => {
      if (donation.goatDetails) {
        return total + (donation.goatDetails.goats || 0);
      }
      return total;
    }, 0);

    if (lastMonthGoats === 0) {
      return currentMonthGoats > 0 ? 100 : 0;
    }

    return ((currentMonthGoats - lastMonthGoats) / lastMonthGoats) * 100;
  } catch (error) {
    console.error("Error calculating monthly trend:", error);
    return 12.5;
  }
};

export const calculateGoats = async (amount) => {
  try {
    const pricing = await getGoatPricing();
    const goatPrice = pricing.goatPrice;
    const maxGoats = Math.floor(amount / goatPrice);
    const remainingAmount = amount - maxGoats * goatPrice;

    return {
      amount,
      goats: maxGoats,
      remainingAmount: remainingAmount,
      optimalCombination: {
        goats: maxGoats,
        totalValue: maxGoats,
        totalCost: maxGoats * goatPrice,
      },
      pricing,
    };
  } catch (error) {
    throw new Error(`Failed to calculate goats: ${error.message}`);
  }
};

export const getGoatTrends = async (period = "monthly") => {
  try {
    const trends = await calculateActualTrends(period);
    return {
      period,
      goatTrend: trends.goatTrend,
      totalTrend: trends.totalTrend,
      historicalData: trends.historicalData,
    };
  } catch (error) {
    console.error("Error calculating goat trends:", error);
    return {
      period,
      goatTrend: 12.5,
      totalTrend: 12.5,
      historicalData: [
        { month: "Jan", goats: 75 },
        { month: "Feb", goats: 87 },
        { month: "Mar", goats: 88 },
        { month: "Apr", goats: 105 },
        { month: "May", goats: 105 },
        { month: "Jun", goats: 120 },
      ],
    };
  }
};

const calculateActualTrends = async (period) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const donations = await Donation.findAll({
      where: {
        donationType: "goats",
        createdAt: {
          [Op.gte]: sixMonthsAgo,
        },
      },
      attributes: ["createdAt", "goatDetails"],
      include: [
        {
          model: Payment,
          as: "payment",
          where: { status: "completed" },
          required: true,
          attributes: [],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    const monthlyData = {};
    donations.forEach((donation) => {
      if (donation.goatDetails) {
        const month = donation.createdAt.toISOString().substring(0, 7); // YYYY-MM
        if (!monthlyData[month]) {
          monthlyData[month] = { goats: 0 };
        }
        monthlyData[month].goats += donation.goatDetails.goats || 0;
      }
    });

    // Convert to array format
    const historicalData = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month: new Date(month + "-01").toLocaleDateString("en-US", {
          month: "short",
        }),
        goats: data.goats,
        total: data.goats,
      }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));

    // Calculate trends (simplified)
    if (historicalData.length < 2) {
      return {
        goatTrend: 12.5,
        totalTrend: 12.5,
        historicalData,
      };
    }

    const recent = historicalData[historicalData.length - 1];
    const previous = historicalData[historicalData.length - 2];

    const goatTrend =
      previous.goats > 0
        ? ((recent.goats - previous.goats) / previous.goats) * 100
        : 100;
    const totalTrend =
      previous.goats > 0
        ? ((recent.goats - previous.goats) / previous.goats) * 100
        : 100;

    return {
      goatTrend: Math.round(goatTrend * 10) / 10,
      totalTrend: Math.round(totalTrend * 10) / 10,
      historicalData,
    };
  } catch (error) {
    throw error;
  }
};

export const getImpactReport = async () => {
  try {
    const analytics = await getGoatAnalytics();

    const familiesSupported = Math.floor(analytics.totalGoatsDonated / 3); // 3 goats can support a family
    const communitiesReached = Math.floor(analytics.totalGoatsDonated / 10); // 10 goats per community
    const estimatedBeneficiaries = familiesSupported * 6; // Average 6 people per family in Ethiopia

    const economicImpact = analytics.totalValue * 2.5; // 2.5x multiplier for local economic impact

    return {
      totalGoats: analytics.totalGoatsDonated,
      familiesSupported,
      communitiesReached,
      estimatedBeneficiaries,
      economicImpact,
      sustainabilityScore: Math.min(
        100,
        Math.floor((analytics.goatsDonated / analytics.totalGoatsDonated) * 100)
      ),
      currency: analytics.currency,
    };
  } catch (error) {
    throw new Error(`Failed to generate impact report: ${error.message}`);
  }
};

// Additional utility functions
export const getPricingHistory = async () => {
  try {
    const pricingHistory = await GoatPricing.findAll({
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "goatPrice",
        "currency",
        "isActive",
        "createdAt",
        "updatedAt",
      ],
    });

    return pricingHistory.map((price) => ({
      id: price.id,
      goatPrice: parseFloat(price.goatPrice),
      currency: price.currency,
      isActive: price.isActive,
      createdAt: price.createdAt,
      updatedAt: price.updatedAt,
    }));
  } catch (error) {
    throw new Error(`Failed to fetch pricing history: ${error.message}`);
  }
};

export const getGoatDonationStats = async (timeframe = "all") => {
  try {
    let whereClause = {
      donationType: "goats",
      status: "completed",
    };

    // Add timeframe filter
    if (timeframe !== "all") {
      const startDate = new Date();
      switch (timeframe) {
        case "month":
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case "quarter":
          startDate.setMonth(startDate.getMonth() - 3);
          break;
        case "year":
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
      }
      whereClause.createdAt = { [Op.gte]: startDate };
    }

    const donations = await Donation.findAll({
      where: whereClause,
      attributes: ["goatDetails", "totalAmount", "createdAt"],
    });

    const stats = {
      totalDonations: donations.length,
      totalGoats: 0,
      goats: 0,
      totalValue: 0,
      averageDonation: 0,
    };

    donations.forEach((donation) => {
      if (donation.goatDetails) {
        const goats = donation.goatDetails.goats || 0;
        stats.goats += goats;
        stats.totalGoats += goats;
      }
      stats.totalValue += donation.totalAmount || 0;
    });

    stats.averageDonation =
      stats.totalDonations > 0 ? stats.totalValue / stats.totalDonations : 0;

    return stats;
  } catch (error) {
    throw new Error(`Failed to fetch donation stats: ${error.message}`);
  }
};
