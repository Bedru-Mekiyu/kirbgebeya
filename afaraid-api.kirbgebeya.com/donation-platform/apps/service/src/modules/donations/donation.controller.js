import * as donationService from "./donation.service.js";

export const createDonation = async (req, res) => {
  try {
    const { donor, donation, payment } = await donationService.createDonation(
      req.body.donor,
      req.body.donation,
      req.body.payment
    );
    res.status(201).json({
      success: true,
      message: "Donation processed successfully",
      donor,
      donation,
      payment,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getRecentDonations = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const donations = await donationService.getRecentDonations(limit);
    res.json(donations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const validateDonorIdentity = async (req, res) => {
  try {
    const { donorIdentityNumber } = req.params;

    const donor = await donationService.validateDonorIdentity(
      donorIdentityNumber
    );

    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    res.json({ valid: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getDonationById = async (req, res) => {
  try {
    const donation = await donationService.getDonationById(req.params.id);
    if (!donation) return res.status(404).json({ error: "Donation not found" });
    res.json(donation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllDonations = async (_req, res) => {
  try {
    const donations = await donationService.getAllDonations();
    res.json(donations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getDashboardByIdentity = async (req, res) => {
  try {
    const { donorIdentityNumber } = req.params;
    const dashboard = await donationService.getDashboardByIdentity(
      donorIdentityNumber
    );
    res.json(dashboard);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateDonation = async (req, res) => {
  try {
    const donation = await donationService.updateDonation(
      req.params.id,
      req.body
    );
    res.json(donation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteDonation = async (req, res) => {
  try {
    await donationService.deleteDonation(req.params.id);
    res.json({ message: "Donation deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// New donor-specific controller methods
export const getAllDonors = async (req, res) => {
  try {
    const donors = await donationService.getAllDonors();
    res.json(donors);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getDonorById = async (req, res) => {
  try {
    const donor = await donationService.getDonorById(req.params.donorId);
    if (!donor) return res.status(404).json({ error: "Donor not found" });
    res.json(donor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getDonorStats = async (req, res) => {
  try {
    const stats = await donationService.getDonorStats();
    res.json(stats);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const searchDonors = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }
    const donors = await donationService.searchDonors(query);
    res.json(donors);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getDonorDonations = async (req, res) => {
  try {
    const { donorId } = req.params;
    const donations = await donationService.getDonorDonations(donorId);
    res.json(donations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
