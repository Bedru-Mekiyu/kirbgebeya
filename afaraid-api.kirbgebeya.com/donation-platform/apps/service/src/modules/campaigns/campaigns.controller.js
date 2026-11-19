import campaignsService from "./campaigns.service.js";

class CampaignsController {
  async createCampaign(req, res) {
    try {
      const campaign = await campaignsService.createCampaign(req.body);
      res.status(201).json({ success: true, data: campaign });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async getAllCampaigns(req, res) {
    try {
      const campaigns = await campaignsService.getAllCampaigns();
      res.json({ success: true, data: campaigns });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async getCampaignById(req, res) {
    try {
      const campaign = await campaignsService.getCampaignById(req.params.id);
      res.json({ success: true, data: campaign });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  async updateCampaign(req, res) {
    try {
      const campaign = await campaignsService.updateCampaign(
        req.params.id,
        req.body
      );
      res.json({ success: true, data: campaign });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async deleteCampaign(req, res) {
    try {
      const campaign = await campaignsService.deleteCampaign(req.params.id);
      res.json({ success: true, data: campaign });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  async getActiveCampaigns(req, res) {
    try {
      const campaigns = await campaignsService.getActiveCampaigns();
      res.json({ success: true, data: campaigns });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async getFeaturedCampaigns(req, res) {
    try {
      const campaigns = await campaignsService.getFeaturedCampaigns();
      res.json({ success: true, data: campaigns });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async getRecentDonations(req, res) {
    try {
      const campaignId = req.params.id;
      const donations = await campaignsService.getRecentDonations(campaignId);
      res.json({ success: true, data: donations });
    } catch (err) {
      console.error("Failed to fetch recent donations:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

export default new CampaignsController();
