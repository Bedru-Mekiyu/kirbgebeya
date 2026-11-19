import models from "./models/campaign.models.js";
const {
  Campaign,
  CampaignDetail,
  CampaignUpdate,
  GoatPricing,
  Donation,
  Donor,
} = models;

class CampaignsService {
  async createCampaign(data) {
    const { details, updates, ...campaignData } = data;

    if (details && Array.isArray(details)) {
      for (const detail of details) {
        if (detail.goatPricing?.useCustomPrice) {
          campaignData.hasSpecificGoatPricing = true;
          break;
        }
      }
    }

    const campaign = await Campaign.create(campaignData);

    if (details && Array.isArray(details)) {
      for (const detail of details) {
        await CampaignDetail.create({ ...detail, campaignId: campaign.id });

        if (detail.goatPricing?.useCustomPrice) {
          await GoatPricing.create({
            goatPrice: detail.goatPricing.customGoatPrice,
            currency: detail.currency || "ETB",
            campaignId: campaign.id,
          });
        }
      }
    }

    if (updates && Array.isArray(updates)) {
      for (const update of updates) {
        await CampaignUpdate.create({ ...update, campaignId: campaign.id });
      }
    }

    return await this.getCampaignById(campaign.id);
  }

  async getAllCampaigns() {
    return await Campaign.findAll({
      include: [
        { model: CampaignDetail, as: "detail" },
        { model: CampaignUpdate, as: "updates" },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async getCampaignById(id) {
    const campaign = await Campaign.findByPk(id, {
      include: [
        { model: CampaignDetail, as: "detail" },
        { model: CampaignUpdate, as: "updates" },
      ],
    });
    if (!campaign) throw new Error("Campaign not found");
    return campaign;
  }

  async updateCampaign(id, data) {
    const campaign = await Campaign.findByPk(id);
    if (!campaign) throw new Error("Campaign not found");
    await campaign.update(data);
    return await this.getCampaignById(id);
  }

  async deleteCampaign(id) {
    const campaign = await Campaign.findByPk(id);
    if (!campaign) throw new Error("Campaign not found");
    await campaign.destroy();
    return campaign;
  }

  async getActiveCampaigns() {
    return await Campaign.findAll({
      where: { status: "Active" },
      include: [
        { model: CampaignDetail, as: "detail" },
        { model: CampaignUpdate, as: "updates" },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async getFeaturedCampaigns() {
    return await Campaign.findAll({
      where: { isHot: true, status: "Active" },
      include: [
        { model: CampaignDetail, as: "detail" },
        { model: CampaignUpdate, as: "updates" },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async calculateGoatsFromDonation(donation) {
    const goatPrice = await getGoatPriceForCampaign(donation.campaignId);

    if (donation.donationType === "goat" && donation.goatDetails?.quantity) {
      return donation.goatDetails.quantity;
    }

    if (donation.totalAmount) {
      return Math.floor(parseFloat(donation.totalAmount) / goatPrice);
    }

    return 0;
  }

  async getGoatPriceForCampaign(campaignId) {
    const campaignPricing = await GoatPricing.findOne({
      where: { campaignId, isActive: true },
    });

    if (campaignPricing) {
      return parseFloat(campaignPricing.goatPrice);
    }

    const globalPricing = await GoatPricing.findOne({
      where: { campaignId: null, isActive: true },
    });

    if (globalPricing) {
      return parseFloat(globalPricing.goatPrice);
    }

    return 50.0;
  }

  async getRecentDonations(campaignId, limit = 10) {
    const donations = await Donation.findAll({
      where: { campaignId },
      include: [
        {
          model: Donor,
          as: "donor",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
    });

    const goatPrice = await this.getGoatPriceForCampaign(campaignId);

    return donations.map((d) => {
      let goatsDonated = 0;

      if (d.donationType === "goats" && d.goatDetails?.quantity) {
        goatsDonated = d.goatDetails.quantity;
      } else if (d.totalAmount) {
        goatsDonated = Math.floor(parseFloat(d.totalAmount) / goatPrice);
      }

      return {
        id: d.id,
        donorName: d.anonymous
          ? "Anonymous"
          : `${d.donor?.firstName || ""} ${d.donor?.lastName || ""}`.trim(),
        amount: d.totalAmount,
        currency: "ETB",
        message: d.dedication || "",
        timestamp: d.createdAt.toISOString(),
        anonymous: d.anonymous,
        goatsDonated,
        donorBadge: d.donorBadge || null,
      };
    });
  }
}

export default new CampaignsService();
