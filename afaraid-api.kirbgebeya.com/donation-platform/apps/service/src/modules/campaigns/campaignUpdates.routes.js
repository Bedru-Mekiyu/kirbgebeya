import { Router } from "express";
import campaignUpdatesController from "./campaignUpdates.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/campaign/:campaignId", campaignUpdatesController.getUpdatesByCampaign);

router.use(authMiddleware.verifyToken);

router.post(
    "/",
    authMiddleware.authorizePermissions("create", "campaigns"),
    campaignUpdatesController.createUpdate
);

router.get(
    "/:id",
    authMiddleware.authorizePermissions("read", "campaigns"),
    campaignUpdatesController.getUpdateById
);

router.patch(
    "/:id",
    authMiddleware.authorizePermissions("update", "campaigns"),
    campaignUpdatesController.updateUpdate
);

router.delete(
    "/:id",
    authMiddleware.authorizePermissions("delete", "campaigns"),
    campaignUpdatesController.deleteUpdate
);

export default router;
