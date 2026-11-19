import Stats from "./models/stats.model.js";
import models from "../donations/models/donation.models.js";
import GoatPricing from "../donations/models/goatPricing.model.js";

const { Donation } = models;

const recalculateStats = async (stats) => {
  const goatDonations = await Donation.findAll({
    where: { donationType: "goats" },
    attributes: ["totalAmount", "campaignId"],
  });

  let totalGoats = 0;

  const campaignTotals = {};

  goatDonations.forEach(({ totalAmount, campaignId }) => {
    if (!campaignTotals[campaignId || "default"]) {
      campaignTotals[campaignId || "default"] = 0;
    }
    campaignTotals[campaignId || "default"] += parseFloat(totalAmount || 0);
  });

  for (const key in campaignTotals) {
    const amount = campaignTotals[key];

    let goatPricing;
    if (key !== "default") {
      goatPricing = await GoatPricing.findOne({ where: { campaignId: key } });
    }
    if (!goatPricing) {
      goatPricing = await GoatPricing.findOne({ where: { isActive: true } });
    }

    const goatPrice = parseFloat(goatPricing?.goatPrice || 50);
    totalGoats += Math.floor(amount / goatPrice);
  }

  const familiesSupported = Math.floor(totalGoats / 3);

  const fundsRaised = (await Donation.sum("totalAmount")) || 0;

  await stats.update({
    familiesSupported,
    fundsRaised,
    goatsDistributed: totalGoats,
  });

  return stats;
};

export const getStats = async () => {
  let stats = await Stats.findOne();

  if (!stats) {
    stats = await Stats.create({});
  }
  return await recalculateStats(stats);
};

export const updateStats = async (data) => {
  let stats = await Stats.findOne();
  if (!stats) {
    stats = await Stats.create(data);
  } else {
    await stats.update(data);
  }
  return await recalculateStats(stats);
};
