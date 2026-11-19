import * as paymentService from "./payment.service.js";
import crypto from "crypto";


export const getAllPayments = async (req, res) => {
    try {
        const payments = await paymentService.getAllPayments();
        res.json(payments);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


export const handleChapaWebhook = async (req, res) => {
    try {
        const chapaSignature = req.headers["x-chapa-signature"];
        const secret = process.env.CHAPA_WEBHOOK_SECRET;

        if (!chapaSignature) {
            return res.status(400).json({ success: false, message: "Missing signature" });
        }

        const computedSignature = crypto
            .createHmac("sha256", secret)
            .update(JSON.stringify(req.body))
            .digest("hex");


        if (computedSignature !== chapaSignature) {
            return res.status(401).json({
                success: false,
                message: "Invalid signature",
            });
        }

        const { tx_ref, status } = req.body;

        if (!tx_ref) {
            return res.status(400).json({ success: false, message: "tx_ref is required" });
        }

        const result = await paymentService.processChapaWebhook(req.body);

        return res.status(200).json(result);
    } catch (err) {
        console.error("Chapa Webhook Error:", err);
        return res.status(500).json({ success: false, message: "Internal server error", error: err.message || err, });
    }
};


export const getPaymentById = async (req, res) => {
    try {
        const payment = await paymentService.getPaymentById(req.params.id);
        if (!payment) return res.status(404).json({ error: "Payment not found" });
        res.json(payment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getPaymentStats = async (req, res) => {
    try {
        const stats = await paymentService.getPaymentStats();
        res.json(stats);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const updatePaymentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const payment = await paymentService.updatePaymentStatus(req.params.id, status);
        res.json(payment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const processRefund = async (req, res) => {
    try {
        const { amount } = req.body;
        const refund = await paymentService.processRefund(req.params.id, amount);
        res.json(refund);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const downloadReceipt = async (req, res) => {
    try {
        const receipt = await paymentService.downloadReceipt(req.params.id);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=payment-receipt-${req.params.id}.pdf`);

        receipt.pipe(res);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const searchPayments = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: "Search query is required" });
        }
        const payments = await paymentService.searchPayments(query);
        res.json(payments);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getRecentPayments = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 10;
        const payments = await paymentService.getRecentPayments(limit);
        res.json(payments);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};