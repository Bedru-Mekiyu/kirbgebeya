import models from "./models/campaign.models.js";
const { CampaignUpdate } = models;

class CampaignUpdatesService {
    async createUpdate(data) {
        const update = await CampaignUpdate.create(data);
        return update;
    }

    async getUpdatesByCampaign(campaignId) {
        return await CampaignUpdate.findAll({
            where: { campaignId },
            order: [["date", "DESC"]],
        });
    }

    async getUpdateById(id) {
        const update = await CampaignUpdate.findByPk(id);
        if (!update) throw new Error("Campaign update not found");
        return update;
    }

    async updateUpdate(id, data) {
        const update = await CampaignUpdate.findByPk(id);
        if (!update) throw new Error("Campaign update not found");
        await update.update(data);
        return update;
    }

    async deleteUpdate(id) {
        const update = await CampaignUpdate.findByPk(id);
        if (!update) throw new Error("Campaign update not found");
        await update.destroy();
        return update;
    }
}

export default new CampaignUpdatesService();
