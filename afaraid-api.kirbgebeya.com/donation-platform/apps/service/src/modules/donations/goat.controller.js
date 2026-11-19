import * as goatService from "./goat.service.js";

export const getGoatPricing = async (req, res) => {
  try {
    const pricing = await goatService.getGoatPricing();
    res.json(pricing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getGoatPricingByCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const pricing = await goatService.getGoatPricingByCampaign(campaignId);
    res.json(pricing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateGoatPricing = async (req, res) => {
  try {
    const pricing = await goatService.updateGoatPricing(req.body);
    res.json(pricing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getGoatAnalytics = async (req, res) => {
  try {
    const analytics = await goatService.getGoatAnalytics();
    res.json(analytics);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const calculateGoats = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Valid amount is required" });
    }
    const calculation = await goatService.calculateGoats(amount);
    res.json(calculation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getGoatTrends = async (req, res) => {
  try {
    const { period } = req.query;
    const trends = await goatService.getGoatTrends(period);
    res.json(trends);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getImpactReport = async (req, res) => {
  try {
    const report = await goatService.getImpactReport();
    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
