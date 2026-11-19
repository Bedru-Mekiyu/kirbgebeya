import { useEffect, useState, useMemo } from "react";
import {
    FiDollarSign,
    FiTrendingUp,
    FiUsers,
    FiShoppingCart,
    FiSettings,
    FiRefreshCw,
    FiTarget,
    FiCalendar,
    FiSave,
    FiX,
    FiInfo,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import goatsService from "@/services/goatsService";
import { Tooltip } from "react-tooltip";

interface GoatPricing {
    goatPrice: number;
    lastUpdated: string;
}

interface GoatAnalytics {
    totalGoatsDonated: number;
    totalFamiliesSupported: number;
    goatsDonated: number;
    totalValue: number;
    monthlyTrend: number;
    popularCampaigns: Array<{
        name: string;
        goatCount: number;
        percentage: number;
    }>;
    recentDonations: Array<{
        id: string;
        donorName: string;
        goatType: string;
        quantity: number;
        amount: number;
        date: string;
    }>;
}


const PriceSettingsModal = ({
    isOpen,
    onClose,
    pricing,
    onSave,
}: {
    isOpen: boolean;
    onClose: () => void;
    pricing: GoatPricing;
    onSave: (pricing: GoatPricing) => void;
}) => {
    const [formData, setFormData] = useState({
        goatPrice: pricing.goatPrice,
    });

    const handleSave = () => {
        onSave({
            ...formData,
            lastUpdated: new Date().toISOString(),
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25 }}
                        className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 mx-4 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Goat Pricing Settings
                            </h3>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Goat Price (ETB)
                                </label>
                                <input
                                    type="number"
                                    value={formData.goatPrice}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        goatPrice: parseFloat(e.target.value) || 0
                                    }))}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                                <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
                                    <FiInfo size={16} />
                                    <span className="text-sm font-medium">Note</span>
                                </div>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                    Changing prices will affect all future goat donation calculations and analytics.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <FiSave size={18} />
                                Save Changes
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default function Goats() {
    const [pricing, setPricing] = useState<GoatPricing>({
        goatPrice: 50,
        lastUpdated: new Date().toISOString(),
    });
    const [analytics, setAnalytics] = useState<GoatAnalytics>({
        totalFamiliesSupported: 0,
        goatsDonated: 0,
        totalValue: 0,
        monthlyTrend: 0,
        popularCampaigns: [],
        recentDonations: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    useEffect(() => {
        fetchGoatData();
    }, [refreshTrigger]);

    const fetchGoatData = async () => {
        try {
            setLoading(true);
            const [pricingData, analyticsData] = await Promise.all([
                goatsService.getGoatPricing(),
                goatsService.getGoatAnalytics(),
            ]);

            if (pricingData) setPricing(pricingData);
            if (analyticsData) setAnalytics(analyticsData);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to load goat data");
        } finally {
            setLoading(false);
        }
    };

    const handleSavePricing = async (newPricing: GoatPricing) => {
        try {
            await goatsService.updateGoatPricing(newPricing);
            setPricing(newPricing);
            setIsSettingsModalOpen(false);
            setRefreshTrigger(prev => prev + 1);
        } catch (err: any) {
            setError(err.message || "Failed to update pricing");
        }
    };

    const stats = useMemo(() => {
        const goatValue = analytics.goatsDonated * pricing.goatPrice;
        const totalTheoreticalValue = goatValue;

        return {
            goatValue,
            totalTheoreticalValue,
            averagePerGoat: analytics.totalGoatsDonated > 0 ? totalTheoreticalValue / analytics.totalGoatsDonated : 0,
        };
    }, [analytics, pricing]);

    return (
        <>
            <PageMeta
                title="Goat Management | Afar Aid"
                description="Manage goat pricing, track donations, and analyze goat distribution impact for Afar Aid platform."
            />
            <PageBreadcrumb pageTitle="Goat Management" />

            <div className="space-y-6">
                <ComponentCard
                    title={
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Goat Management
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Manage goat pricing, track donations, and analyze impact of goat distributions
                                </p>
                            </div>
                            <div className="flex gap-3">

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsSettingsModalOpen(true)}
                                    className="px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    <FiSettings size={18} />
                                    Pricing
                                </motion.button>
                            </div>
                        </div>
                    }
                >
                    {/* Current Pricing Overview */}
                    <div className="mb-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Current Goat Pricing
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-green-200 dark:border-green-700">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                <FiDollarSign className="text-green-600 dark:text-green-400" size={20} />
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                    {pricing.goatPrice} ETB
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    Goat Price
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                <FiCalendar className="text-blue-600 dark:text-blue-400" size={20} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                                    Last Updated
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(pricing.lastUpdated).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ rotate: 90, scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setRefreshTrigger(prev => prev + 1)}
                                className="p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
                                data-tooltip-id="refreshTip"
                                data-tooltip-content="Refresh data"
                            >
                                <FiRefreshCw size={18} className={loading ? "animate-spin" : ""} />
                            </motion.button>
                            <Tooltip id="refreshTip" place="bottom" />
                        </div>
                    </div>

                    {/* Analytics Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                    <FiUsers className="text-purple-600 dark:text-purple-400" size={20} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {analytics.totalFamiliesSupported}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Total Families Supported
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <FiTarget className="text-green-600 dark:text-green-400" size={20} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {analytics.goatsDonated}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Goats Donated
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <FiTrendingUp className="text-blue-600 dark:text-blue-400" size={20} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {stats.totalTheoreticalValue.toFixed(2)} ETB
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Total Value
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Analytics */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Value Distribution */}
                        <ComponentCard title="Value Distribution">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Goats
                                    </span>
                                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                        {stats.goatValue.toFixed(2)} ETB
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-green-600 h-2 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${stats.totalTheoreticalValue > 0 ? (stats.goatValue / stats.totalTheoreticalValue) * 100 : 0}%`,
                                        }}
                                    ></div>
                                </div>

                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Average per Goat
                                        </span>
                                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                            {stats.averagePerGoat.toFixed(2)} ETB
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </ComponentCard>

                        {/* Popular Campaigns */}
                        <ComponentCard title="Popular Campaigns">
                            <div className="space-y-3">
                                {analytics.popularCampaigns.map((campaign, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {campaign.name}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {campaign.goatCount} goats
                                            </div>
                                        </div>
                                        <div className="text-sm font-bold text-purple-600 dark:text-purple-400">
                                            {campaign.percentage}%
                                        </div>
                                    </div>
                                ))}
                                {analytics.popularCampaigns.length === 0 && (
                                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                                        No campaign data available
                                    </div>
                                )}
                            </div>
                        </ComponentCard>
                    </div>

                    {/* Recent Donations */}
                    <ComponentCard title="Recent Goat Donations" className="mt-6">
                        <div className="space-y-3">
                            {analytics.recentDonations.map((donation, index) => (
                                <div key={donation.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400`}>
                                            <FiShoppingCart size={18} />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {donation.donorName}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {donation.quantity} goat(s)
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-green-600 dark:text-green-400">
                                            {donation.amount.toFixed(2)} ETB
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(donation.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {analytics.recentDonations.length === 0 && (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <FiShoppingCart size={32} className="mx-auto mb-2 opacity-50" />
                                    <p>No recent goat donations</p>
                                </div>
                            )}
                        </div>
                    </ComponentCard>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400"
                        >
                            {error}
                        </motion.div>
                    )}
                </ComponentCard>
            </div>

            <PriceSettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                pricing={pricing}
                onSave={handleSavePricing}
            />
        </>
    );
}