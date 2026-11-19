import { Router } from "express";
import campaignsController from "./campaigns.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/active", campaignsController.getActiveCampaigns);
router.get("/", campaignsController.getAllCampaigns);
router.get("/featured", campaignsController.getFeaturedCampaigns);
router.get("/:id", campaignsController.getCampaignById);

router.get("/:id/donations/recent", campaignsController.getRecentDonations);

router.use(authMiddleware.verifyToken);

router.post(
  "/",
  authMiddleware.authorizePermissions("create", "campaigns"),
  campaignsController.createCampaign
);

router.patch(
  "/:id",
  authMiddleware.authorizePermissions("update", "campaigns"),
  campaignsController.updateCampaign
);

router.delete(
  "/:id",
  authMiddleware.authorizePermissions("delete", "campaigns"),
  campaignsController.deleteCampaign
);

export default router;
