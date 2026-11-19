import { Router } from "express";
import * as donationController from "./donation.controller.js";

const router = Router();

router.post("/", donationController.createDonation);
router.get("/", donationController.getAllDonations);
router.get("/recent", donationController.getRecentDonations);
router.get("/:id", donationController.getDonationById);
router.put("/:id", donationController.updateDonation);
router.delete("/:id", donationController.deleteDonation);
router.get(
  "/dashboard/:donorIdentityNumber",
  donationController.getDashboardByIdentity
);
router.get(
  "/validate/:donorIdentityNumber",
  donationController.validateDonorIdentity
);

router.get("/donors/all", donationController.getAllDonors);
router.get("/donors/stats", donationController.getDonorStats);
router.get("/donors/search", donationController.searchDonors);
router.get("/donors/:donorId", donationController.getDonorById);
router.get("/donors/:donorId/donations", donationController.getDonorDonations);

export default router;
