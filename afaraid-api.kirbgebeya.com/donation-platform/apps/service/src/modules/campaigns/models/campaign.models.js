import Campaign from "./campaigns.model.js";
import CampaignDetail from "./campaignDetail.model.js";
import CampaignUpdate from "./campaignUpdate.model.js";
import campaignAssociations from "./campaign.associations.js";
import GoatPricing from "../../donations/models/goatPricing.model.js";
import Donation from "../../donations/models/donation.model.js";
import Donor from "../../donations/models/donor.model.js";

const models = {
  Campaign,
  CampaignDetail,
  CampaignUpdate,
  GoatPricing,
  Donation,
  Donor,
};

campaignAssociations(models);

export default models;
