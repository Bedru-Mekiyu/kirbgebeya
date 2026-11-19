import { Router } from "express";
import * as paymentController from "./payment.controller.js";

const router = Router();

router.post("/webhook/payment-status", paymentController.handleChapaWebhook);

router.get("/all", paymentController.getAllPayments);
router.get("/stats", paymentController.getPaymentStats);
router.get("/recent", paymentController.getRecentPayments);
router.get("/search", paymentController.searchPayments);
router.get("/:id", paymentController.getPaymentById);
router.patch("/:id/status", paymentController.updatePaymentStatus);
router.post("/:id/refund", paymentController.processRefund);
router.get("/:id/receipt", paymentController.downloadReceipt);

export default router;