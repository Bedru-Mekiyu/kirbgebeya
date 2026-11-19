import { Router } from "express";

import donationsRoutes from "../modules/donations/donation.routes.js";
import paymentsRoutes from "../modules/donations/payment.routes.js";
import goatsRoutes from "../modules/donations/goat.routes.js";

import campaignsRoutes from "../modules/campaigns/campaigns.routes.js";
import campaignUpdatesRoutes from "../modules/campaigns/campaignUpdates.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import statsRoutes from "../modules/stats/stats.routes.js";

const router = Router();

router.use("/donations", donationsRoutes);
router.use("/campaigns", campaignsRoutes);
router.use("/campaign-updates", campaignUpdatesRoutes);
router.use("/payments", paymentsRoutes);
router.use("/goats", goatsRoutes);
router.use("/auth", authRoutes);
router.use("/stats", statsRoutes);

export default router;
