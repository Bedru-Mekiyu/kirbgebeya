import Donor from "./donor.model.js";
import Donation from "./donation.model.js";
import Payment from "./payment.model.js";
import Campaign from "../../campaigns/models/campaigns.model.js";
import setupDonationAssociations from "./donation.associations.js";
import Notification from "./notification.model.js";
import GoatPricing from "./goatPricing.model.js";

const models = {
  Donor,
  Donation,
  Payment,
  Campaign,
  GoatPricing,
  Notification,
};

setupDonationAssociations(models);

export default models;
