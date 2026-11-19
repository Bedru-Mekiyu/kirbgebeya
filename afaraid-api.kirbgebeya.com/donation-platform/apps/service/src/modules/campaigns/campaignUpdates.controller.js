import campaignUpdatesService from "./campaignUpdates.service.js";

class CampaignUpdatesController {
    async createUpdate(req, res) {
        try {
            const update = await campaignUpdatesService.createUpdate(req.body);
            res.status(201).json({ success: true, data: update });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }

    async getUpdatesByCampaign(req, res) {
        try {
            const updates = await campaignUpdatesService.getUpdatesByCampaign(req.params.campaignId);
            res.json({ success: true, data: updates });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }

    async getUpdateById(req, res) {
        try {
            const update = await campaignUpdatesService.getUpdateById(req.params.id);
            res.json({ success: true, data: update });
        } catch (err) {
            res.status(404).json({ success: false, message: err.message });
        }
    }

    async updateUpdate(req, res) {
        try {
            const update = await campaignUpdatesService.updateUpdate(req.params.id, req.body);
            res.json({ success: true, data: update });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }

    async deleteUpdate(req, res) {
        try {
            const update = await campaignUpdatesService.deleteUpdate(req.params.id);
            res.json({ success: true, data: update });
        } catch (err) {
            res.status(404).json({ success: false, message: err.message });
        }
    }
}

export default new CampaignUpdatesController();
