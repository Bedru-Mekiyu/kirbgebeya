import { Router } from "express";
import * as goatController from "./goat.controller.js";

const router = Router();

router.get("/pricing", goatController.getGoatPricing);
router.get("/pricing/:campaignId", goatController.getGoatPricingByCampaign);
router.put("/pricing", goatController.updateGoatPricing);
router.get("/analytics", goatController.getGoatAnalytics);
router.post("/calculate", goatController.calculateGoats);
router.get("/trends", goatController.getGoatTrends);
router.get("/impact-report", goatController.getImpactReport);

export default router;
