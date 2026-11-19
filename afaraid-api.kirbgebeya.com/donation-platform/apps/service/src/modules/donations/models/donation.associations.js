export default function setupDonationAssociations(models) {
  const { Donor, Donation, Payment, Campaign, GoatPricing } = models;

  if (!Donor || !Donation || !Payment || !Campaign || !GoatPricing) return;

  if (!Donor.associations?.donations) {
    Donor.hasMany(Donation, {
      foreignKey: "donorId",
      as: "donations",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }

  if (!Donation.associations?.donor) {
    Donation.belongsTo(Donor, {
      foreignKey: "donorId",
      as: "donor",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }

  if (!Donation.associations?.payment) {
    Donation.hasOne(Payment, {
      foreignKey: "donationId",
      as: "payment",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }

  if (!Payment.associations?.donation) {
    Payment.belongsTo(Donation, {
      foreignKey: "donationId",
      as: "donation",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }

  if (!Campaign.associations?.donations) {
    Campaign.hasMany(Donation, {
      foreignKey: "campaignId",
      as: "donations",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }

  if (!Donation.associations?.campaign) {
    Donation.belongsTo(Campaign, {
      foreignKey: "campaignId",
      as: "campaign",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }

  if (!Campaign.associations?.goatPricings) {
    Campaign.hasMany(GoatPricing, {
      foreignKey: "campaignId",
      as: "goatPricings",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  }

  if (!GoatPricing.associations?.campaign) {
    GoatPricing.belongsTo(Campaign, {
      foreignKey: "campaignId",
      as: "campaign",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  }
}
