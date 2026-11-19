export default function campaignAssociations(models) {
  const { Campaign, CampaignDetail, CampaignUpdate } = models;

  if (!Campaign || !CampaignDetail || !CampaignUpdate) return;

  if (!Campaign.associations?.detail) {
    Campaign.hasOne(CampaignDetail, {
      foreignKey: "campaignId",
      as: "detail",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }

  if (!CampaignDetail.associations?.campaign) {
    CampaignDetail.belongsTo(Campaign, {
      foreignKey: "campaignId",
      as: "campaign",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }

  if (!Campaign.associations?.updates) {
    Campaign.hasMany(CampaignUpdate, {
      foreignKey: "campaignId",
      as: "updates",
    });
  }

  if (!CampaignUpdate.associations?.campaign) {
    CampaignUpdate.belongsTo(Campaign, {
      foreignKey: "campaignId",
      as: "campaign",
    });
  }
}
