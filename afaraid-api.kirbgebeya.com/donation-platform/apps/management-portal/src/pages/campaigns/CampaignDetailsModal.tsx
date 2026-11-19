import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiGlobe,
  FiStar,
  FiTrendingUp,
  FiClock,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import { Modal } from "../../components/ui/modal";
import Button from "@/components/ui/button/Button";
import type {
  Campaign,
  CampaignDetail,
  CampaignUpdate,
} from "@/services/campaignService";
import campaignService from "@/services/campaignsService";
import { motion } from "framer-motion";
import goatsService from "@/services/goatsService";

interface CampaignDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign & { detail?: CampaignDetail; updates?: CampaignUpdate[] };
  onUpdateDelete?: (campaignId: string, updateId: string) => void;
  refreshCampaign?: () => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    Active: {
      color: "from-green-500 to-emerald-600",
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-400",
    },
    Completed: {
      color: "from-blue-500 to-cyan-600",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-400",
    },
    Cancelled: {
      color: "from-red-500 to-rose-600",
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-400",
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.Active;

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}
    >
      {status}
    </span>
  );
};

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(progress, 100)}%` }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className={`h-3 rounded-full ${progress >= 100
        ? "bg-gradient-to-r from-green-500 to-emerald-600"
        : progress >= 75
          ? "bg-gradient-to-r from-blue-500 to-cyan-600"
          : progress >= 50
            ? "bg-gradient-to-r from-amber-500 to-orange-600"
            : "bg-gradient-to-r from-red-500 to-rose-600"
        }`}
    />
  </div>
);

const formatCurrency = (amount: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getDaysRemaining = (endDate: string) => {
  const end = new Date(endDate);
  const today = new Date();
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

const GoatPricing = ({
  price,
  currency = "USD",
}: {
  price: number;
  currency?: string;
}) => (
  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-800 rounded-full flex items-center justify-center">
          <span className="text-amber-600 dark:text-amber-400 text-lg">🐐</span>
        </div>
        <div>
          <h4 className="font-semibold text-amber-900 dark:text-amber-100">
            Goat Price
          </h4>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Cost per goat
          </p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
          {formatCurrency(price, currency)}
        </div>
        <div className="text-sm text-amber-700 dark:text-amber-300">
          per goat
        </div>
      </div>
    </div>
  </div>
);

export default function CampaignDetailsModal({
  isOpen,
  onClose,
  campaign,
  onUpdateDelete,
  refreshCampaign,
}: CampaignDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "updates">(
    "overview"
  );
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    updateId: string;
    updateTitle: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [goatPrice, setGoatPrice] = useState<number | null>(null);
  const [goatPriceing, setGoatPricing] = useState<number | null>(null);

  const [loadingGoatPrice, setLoadingGoatPrice] = useState(false);

  if (!campaign.detail) return null;

  const progress =
    campaign.detail.goalAmount > 0
      ? (campaign.detail.raisedAmount / campaign.detail.goalAmount) * 100
      : 0;

  const daysRemaining = getDaysRemaining(campaign.detail.endDate);

  const displayGoatPrice = goatPriceing?.price || 75;

  const handleDeleteClick = (updateId: string, updateTitle: string) => {
    setDeleteConfirm({ show: true, updateId, updateTitle });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;

    setIsDeleting(true);
    try {
      if (onUpdateDelete) {
        await onUpdateDelete(campaign.id, deleteConfirm.updateId);
      } else {
        await campaignService.deleteCampaignUpdate(deleteConfirm.updateId);
        window.location.reload();

        if (refreshCampaign) {
          refreshCampaign();
        }
      }

      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete update:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  useEffect(() => {
    const fetchGoatPrice = async () => {
      try {
        setLoadingGoatPrice(true);
        if (campaign.hasSpecificGoatPricing) {
          try {
            const campaignPricing = await goatsService.getGoatPricingByCampaign(
              campaign.id
            );

            if (campaignPricing && campaignPricing.goatPrice) {
              setGoatPricing({
                price: campaignPricing.goatPrice,
              });
              return;
            }
          } catch (error) {
            console.log(
              "Campaign has specific pricing flag but no pricing found, falling back to common..."
            );
          }
        }
        const pricingData = await goatsService.getGoatPricing();
        if (pricingData && pricingData.goatPrice) {
          setGoatPrice(pricingData.goatPrice);
          setGoatPricing({
            price: pricingData.goatPrice,
          });
        }
      } catch (error) {
        console.error("Failed to fetch goat pricing:", error);
        if (campaign.detail?.goatPrice) {
          setGoatPrice(campaign.detail.goatPrice);
        }
      } finally {
        setLoadingGoatPrice(false);
      }
    };

    if (isOpen) {
      fetchGoatPrice();
    }
  }, [isOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl m-4">
        <div className="relative w-full bg-white dark:bg-gray-900 rounded-3xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="relative">
            {campaign.detail.image ? (
              <img
                src={campaign.detail.image}
                alt={campaign.title}
                className="w-full h-48 object-cover rounded-t-3xl"
              />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-3xl flex items-center justify-center">
                <div className="text-white text-4xl font-bold">
                  {campaign.title[0]}
                </div>
              </div>
            )}

            {/* Featured Badge */}
            {campaign.isHot && (
              <div className="absolute top-4 right-4">
                <div className="bg-amber-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold">
                  <FiStar size={14} />
                  Featured
                </div>
              </div>
            )}

            {/* Status Badge */}
            <div className="absolute top-4 left-4">
              <StatusBadge status={campaign.status} />
            </div>
          </div>

          <div className="p-6">
            {/* Title and Basic Info */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {campaign.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {campaign.description}
              </p>

              {/* Location and Dates */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                {campaign.detail.location && (
                  <div className="flex items-center gap-1">
                    <FiMapPin size={16} />
                    {campaign.detail.location}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <FiCalendar size={16} />
                  {formatDate(campaign.detail.startDate)} -{" "}
                  {formatDate(campaign.detail.endDate)}
                </div>
                <div className="flex items-center gap-1">
                  <FiClock size={16} />
                  {daysRemaining} days remaining
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(
                      campaign.detail.raisedAmount,
                      campaign.detail.currency
                    )}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Raised
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(
                      campaign.detail.goalAmount,
                      campaign.detail.currency
                    )}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Goal
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {progress.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Progress
                  </div>
                </div>
              </div>
              <ProgressBar progress={progress} />
            </div>

            {!loadingGoatPrice && displayGoatPrice > 0 && (
              <GoatPricing
                price={displayGoatPrice}
                currency={campaign.detail.currency}
              />
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
                <FiUsers
                  className="mx-auto text-blue-600 dark:text-blue-400 mb-1"
                  size={20}
                />
                <div className="font-semibold text-gray-900 dark:text-white">
                  {campaign.detail.donors}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Donors
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
                <FiUsers
                  className="mx-auto text-green-600 dark:text-green-400 mb-1"
                  size={20}
                />
                <div className="font-semibold text-gray-900 dark:text-white">
                  {campaign.detail.beneficiaries}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Beneficiaries
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
                <FiGlobe
                  className="mx-auto text-purple-600 dark:text-purple-400 mb-1"
                  size={20}
                />
                <div className="font-semibold text-gray-900 dark:text-white">
                  {campaign.detail.currency}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Currency
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
                <FiTrendingUp
                  className="mx-auto text-amber-600 dark:text-amber-400 mb-1"
                  size={20}
                />
                <div className="font-semibold text-gray-900 dark:text-white">
                  {campaign.updates?.length || 0}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Updates
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "overview"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("updates")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "updates"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                >
                  Updates ({campaign.updates?.length || 0})
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px]">
              {activeTab === "overview" && (
                <div className="prose dark:prose-invert max-w-none">
                  {campaign.detail.longDescription ? (
                    <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {campaign.detail.longDescription}
                    </div>
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                      No detailed description available.
                    </div>
                  )}
                </div>
              )}

              {activeTab === "updates" && (
                <div className="space-y-4">
                  {campaign.updates && campaign.updates.length > 0 ? (
                    campaign.updates.map((update, index) => (
                      <motion.div
                        key={update.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors relative"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white pr-8">
                            {update.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(update.date)}
                            </span>
                            <button
                              onClick={() =>
                                handleDeleteClick(update.id, update.title)
                              }
                              className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 transition-all duration-200"
                              title="Delete update"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                          {update.content}
                        </p>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <FiEdit size={32} className="mx-auto mb-2 opacity-50" />
                      <p>No updates available for this campaign.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <Modal
          isOpen={deleteConfirm.show}
          onClose={handleCancelDelete}
          className="max-w-md"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <FiTrash2
                  className="text-red-600 dark:text-red-400"
                  size={32}
                />
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Delete Update
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  "{deleteConfirm.updateTitle}"
                </span>
                ? This action cannot be undone.
              </p>

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-700 dark:text-red-300">
                  <strong>Warning:</strong> Once deleted, this update cannot be
                  recovered.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-rose-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 flex items-center justify-center gap-2"
              >
                <FiTrash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
