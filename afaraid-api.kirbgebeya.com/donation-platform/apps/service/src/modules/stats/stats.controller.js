import * as statsService from "./stats.service.js";

export const getStats = async (req, res) => {
    try {
        const stats = await statsService.getStats();
        res.json({ success: true, data: stats });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateStats = async (req, res) => {
    try {
        const stats = await statsService.updateStats(req.body);
        res.json({ success: true, data: stats });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
