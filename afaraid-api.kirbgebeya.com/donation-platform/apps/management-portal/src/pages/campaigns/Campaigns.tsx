import { useEffect, useState, useMemo, useCallback } from "react";
import {
  FiEdit,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiCalendar,
  FiMapPin,
  FiAlertTriangle,
  FiEye,
  FiStar,
  FiMessageSquare,
} from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import { motion, AnimatePresence } from "framer-motion";
import DataTable from "react-data-table-component";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import type {
  Campaign,
  CampaignDetail,
  CampaignUpdate,
} from "@/services/campaignsService";
import campaignService from "@/services/campaignsService";

import AddCampaignModal from "./AddCampaignModal";
import EditCampaignModal from "./EditCampaignModal";
import CampaignDetailsModal from "./CampaignDetailsModal";
import AddUpdateModal from "./AddCampaignUpdateModal";
import AddCampaignUpdateModal from "./AddCampaignUpdateModal";

// Types
interface CampaignWithDetails extends Campaign {
  detail?: CampaignDetail;
  updates?: CampaignUpdate[];
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  campaign,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  campaign: CampaignWithDetails | null;
}) => {
  return (
    <AnimatePresence>
      {isOpen && campaign && (
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
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <FiAlertTriangle
                  className="text-red-600 dark:text-red-400"
                  size={32}
                />
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Delete Campaign
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {campaign.title}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-700 dark:text-red-300">
                  <strong>Warning:</strong> All campaign data including updates
                  and details will be permanently removed.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-rose-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 flex items-center justify-center gap-2"
              >
                <FiTrash2 size={18} />
                Delete Campaign
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

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
      className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
    >
      {status}
    </span>
  );
};

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(progress, 100)}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`h-2 rounded-full ${progress >= 100
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

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<CampaignWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "Active" | "Completed" | "Cancelled"
  >("all");
  const [featuredFilter, setFeaturedFilter] = useState<
    "all" | "featured" | "regular"
  >("all");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [selectedCampaign, setSelectedCampaign] =
    useState<CampaignWithDetails | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    campaign: CampaignWithDetails | null;
  }>({
    isOpen: false,
    campaign: null,
  });

  useEffect(() => {
    fetchCampaigns();
  }, [refreshTrigger]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await campaignService.getAllCampaigns({
        include: "detail,updates",
      });
      setCampaigns(response);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = useMemo(() => {
    return campaigns?.filter((campaign) => {
      const matchesSearch =
        campaign?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign?.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        campaign?.detail?.location
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || campaign?.status === statusFilter;
      const matchesFeatured =
        featuredFilter === "all" ||
        (featuredFilter === "featured" && campaign?.isHot) ||
        (featuredFilter === "regular" && !campaign?.isHot);

      return matchesSearch && matchesStatus && matchesFeatured;
    });
  }, [campaigns, searchTerm, statusFilter, featuredFilter]);

  const addCampaignToList = (campaign: CampaignWithDetails) =>
    setCampaigns((prev) => [...prev, campaign]);

  const updateCampaignInList = (updatedCampaign: CampaignWithDetails) =>
    setCampaigns((prev) =>
      prev.map((c) => (c?.id === updatedCampaign?.id ? updatedCampaign : c))
    );

  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      await campaignService.deleteCampaign(campaignId);
      setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
      setDeleteModal({ isOpen: false, campaign: null });
    } catch (err: any) {
      alert(err.message || "Failed to delete campaign");
    }
  };

  const openDeleteModal = (campaign: CampaignWithDetails) => {
    setDeleteModal({ isOpen: true, campaign });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, campaign: null });
  };

  const toggleFeaturedStatus = async (campaign: CampaignWithDetails) => {
    try {
      const updated = await campaignService.updateCampaign(campaign.id, {
        isHot: !campaign.isHot,
      });
      updateCampaignInList(updated);
    } catch (err: any) {
      alert(err.message || "Failed to update featured status");
    }
  };

  const calculateProgress = (campaign: CampaignWithDetails) => {
    if (!campaign.detail?.goalAmount || campaign.detail.goalAmount === 0)
      return 0;
    return (campaign.detail.raisedAmount / campaign.detail.goalAmount) * 100;
  };

  const formatCurrency = (amount: number, currency: string = "ETB") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleUpdateAdded = useCallback(() => {
    setRefreshTrigger((v) => v + 1);
  }, []);

  const columns = [
    {
      name: "No",
      selector: (_, i) => i + 1,
      width: "70px",
      center: true,
      sortable: false,
    },
    {
      name: "Campaign",
      selector: (row: CampaignWithDetails) => row.title,
      sortable: true,
      minWidth: "250px",
      cell: (row: CampaignWithDetails) => {
        const [expanded, setExpanded] = useState(false);
        const description = row.description || "";
        const shouldTruncate = description.length > 120;
        const displayText = expanded
          ? description
          : shouldTruncate
            ? description.slice(0, 120) + "..."
            : description;

        return (
          <div className="flex items-start gap-3">
            {row.detail?.image ? (
              <img
                src={row.detail.image}
                alt={row.title}
                className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {row.title[0]}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white break-words">
                  {row.title}
                </h3>
                {row.isHot && (
                  <FiStar className="text-amber-500 flex-shrink-0" size={16} />
                )}
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words mt-1">
                {displayText}
                {shouldTruncate && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="ml-1 text-blue-500 hover:underline text-xs"
                  >
                    {expanded ? "Read less" : "Read more"}
                  </button>
                )}
              </p>

              {row.detail?.location && (
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <FiMapPin size={12} />
                  {row.detail.location}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      name: "Progress",
      selector: (row: CampaignWithDetails) => calculateProgress(row),
      sortable: true,
      minWidth: "180px",
      cell: (row: CampaignWithDetails) => {
        const progress = calculateProgress(row);
        return (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>{progress.toFixed(1)}%</span>
              <span>
                {formatCurrency(
                  row.detail?.raisedAmount || 0,
                  row.detail?.currency
                )}{" "}
                /{" "}
                {formatCurrency(
                  row.detail?.goalAmount || 0,
                  row.detail?.currency
                )}
              </span>
            </div>
            <ProgressBar progress={progress} />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{row.detail?.donors || 0} donors</span>
              <span>{row.detail?.beneficiaries || 0} beneficiaries</span>
            </div>
          </div>
        );
      },
    },
    {
      name: "Status",
      selector: (row: CampaignWithDetails) => row.status,
      sortable: true,
      width: "130px",
      center: true,
      cell: (row: CampaignWithDetails) => <StatusBadge status={row.status} />,
    },
    {
      name: "Duration",
      selector: (row: CampaignWithDetails) => row.detail?.startDate,
      sortable: true,
      width: "150px",
      cell: (row: CampaignWithDetails) => (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1 justify-center">
            <FiCalendar size={12} />
            {row.detail?.startDate
              ? new Date(row.detail.startDate).toLocaleDateString()
              : "N/A"}
          </div>
          <div className="text-xs mt-1">
            to{" "}
            {row.detail?.endDate
              ? new Date(row.detail.endDate).toLocaleDateString()
              : "N/A"}
          </div>
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row: CampaignWithDetails) => (
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setSelectedCampaign(row);
              setIsDetailsModalOpen(true);
            }}
            className="p-3 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-xl transition-all duration-200 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30 shadow-sm hover:shadow-md"
            title="View details"
          >
            <FiEye size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setSelectedCampaign(row);
              setIsUpdateModalOpen(true);
            }}
            className="p-3 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-xl transition-all duration-200 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-900/30 shadow-sm hover:shadow-md"
            title="Add update"
            data-tooltip-id="updateTip"
            data-tooltip-content="Add campaign update"
          >
            <FiMessageSquare size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setSelectedCampaign(row);
              setIsEditModalOpen(true);
            }}
            className="p-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30 shadow-sm hover:shadow-md"
            title="Edit campaign"
          >
            <FiEdit size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => openDeleteModal(row)}
            className="p-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-all duration-200 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30 shadow-sm hover:shadow-md"
            title="Delete campaign"
          >
            <FiTrash2 size={18} />
          </motion.button>
        </div>
      ),
      width: "200px",
      center: true,
      sortable: false,
    },
  ];

  const customStyles = {
    table: {
      style: {
        backgroundColor: "transparent",
      },
    },
    headRow: {
      style: {
        backgroundColor: "transparent",
        borderBottomWidth: "1px",
        borderBottomColor: "#e2e8f0",
        fontWeight: "600",
        fontSize: "14px",
        color: "#374151",
        backdropFilter: "blur(8px)",
      },
    },
    headCells: {
      style: {
        fontWeight: "600",
        fontSize: "14px",
        color: "#374151",
        backgroundColor: "transparent",
        paddingLeft: "16px",
        paddingRight: "16px",
        "&:first-of-type": {
          paddingLeft: "24px",
        },
        "&:last-of-type": {
          paddingRight: "24px",
        },
      },
    },
    cells: {
      style: {
        fontSize: "14px",
        color: "#4b5563",
        paddingLeft: "16px",
        paddingRight: "16px",
        "&:first-of-type": {
          paddingLeft: "24px",
        },
        "&:last-of-type": {
          paddingRight: "24px",
        },
      },
    },
    rows: {
      style: {
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #f1f5f9",
        minHeight: "80px",
        "&:not(:last-of-type)": {
          borderBottomWidth: "1px",
          borderBottomColor: "#f1f5f9",
        },
        "&:hover": {
          backgroundColor: "#f8fafc",
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        },
      },
      highlightOnHoverStyle: {
        backgroundColor: "#eff6ff",
        borderBottomColor: "#dbeafe",
        outline: "2px solid #dbeafe",
        transform: "translateY(-1px)",
        boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)",
      },
    },
    pagination: {
      style: {
        backgroundColor: "transparent",
        borderTop: "1px solid #e2e8f0",
        fontSize: "14px",
        color: "#64748b",
      },
      pageButtonsStyle: {
        borderRadius: "8px",
        height: "40px",
        width: "40px",
        padding: "8px",
        margin: "0 4px",
        color: "#64748b",
        fill: "#64748b",
        backgroundColor: "transparent",
        "&:disabled": {
          color: "#cbd5e1",
          fill: "#cbd5e1",
        },
        "&:hover:not(:disabled)": {
          backgroundColor: "#e2e8f0",
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
        "&:focus": {
          backgroundColor: "#e2e8f0",
          outline: "none",
        },
      },
    },
  };

  const stats = useMemo(() => {
    const totalRaised = campaigns?.reduce(
      (sum, campaign) => sum + (campaign?.detail?.raisedAmount || 0),
      0
    );
    const totalGoal = campaigns?.reduce(
      (sum, campaign) => sum + (campaign?.detail?.goalAmount || 0),
      0
    );
    const totalDonors = campaigns?.reduce(
      (sum, campaign) => sum + (campaign?.detail?.donors || 0),
      0
    );
    const totalBeneficiaries = campaigns?.reduce(
      (sum, campaign) => sum + (campaign?.detail?.beneficiaries || 0),
      0
    );

    return {
      totalRaised,
      totalGoal,
      totalDonors,
      totalBeneficiaries,
      overallProgress: totalGoal > 0 ? (totalRaised / totalGoal) * 100 : 0,
      activeCampaigns: campaigns?.filter((c) => c?.status === "Active").length,
      featuredCampaigns: campaigns?.filter((c) => c?.isHot).length,
    };
  }, [campaigns]);

  return (
    <>
      <PageMeta
        title="Campaigns Dashboard | Afar Aid"
        description="Advanced campaign management panel with real-time tracking, filtering, and analytics for Afar Aid platform administrators."
      />
      <PageBreadcrumb pageTitle="Campaigns Management" />

      <div className="space-y-6">
        <ComponentCard
          title={
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Campaigns Management
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage and monitor all fundraising campaigns with advanced
                  controls
                </p>
              </div>
              <div className="flex gap-3">
                <AddCampaignModal addCampaignToList={addCampaignToList} onUpdateAdded={updateCampaignInList} />
              </div>
            </div>
          }
        >
          {/* Advanced Controls */}
          <div className="mb-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <FiSearch
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search campaigns by title, description, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${statusFilter === "all"
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-blue-500"
                      }`}
                  >
                    <FiFilter size={16} />
                    All Status
                  </button>

                  <button
                    onClick={() => setStatusFilter("Active")}
                    className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${statusFilter === "Active"
                      ? "bg-green-600 text-white shadow-lg shadow-green-500/25"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-green-500"
                      }`}
                  >
                    Active
                  </button>

                  <button
                    onClick={() => setStatusFilter("Completed")}
                    className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${statusFilter === "Completed"
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-blue-500"
                      }`}
                  >
                    Completed
                  </button>
                </div>
              </div>

              {/* Refresh Button */}
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setRefreshTrigger((prev) => prev + 1)}
                className="p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
                data-tooltip-id="refreshTip"
                data-tooltip-content="Refresh data"
              >
                <FiRefreshCw
                  size={18}
                  className={loading ? "animate-spin" : ""}
                />
              </motion.button>
              <Tooltip id="refreshTip" place="bottom" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {campaigns?.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Campaigns
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.activeCampaigns}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Active
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {stats.featuredCampaigns}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Featured
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.totalRaised && formatCurrency(stats.totalRaised)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Raised
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.totalGoal && formatCurrency(stats.totalGoal)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Goal
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                  {stats.totalDonors}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Donors
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.totalBeneficiaries}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Beneficiaries
                </div>
              </div>
            </div>

            {/* Overall Progress */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Overall Progress
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.overallProgress.toFixed(1)}% Complete
                </span>
              </div>
              <ProgressBar progress={stats.overallProgress} />
            </div>
          </div>

          {/* Data Table */}
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <DataTable
                columns={columns}
                data={filteredCampaigns}
                progressPending={loading}
                highlightOnHover
                pagination
                responsive
                customStyles={customStyles}
                noHeader
                persistTableHead
                striped
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
              />
            </motion.div>
          </AnimatePresence>

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

      <AnimatePresence>
        {selectedCampaign && (
          <>
            <EditCampaignModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              campaign={selectedCampaign}
              updateCampaignInList={updateCampaignInList}
            />
            <CampaignDetailsModal
              isOpen={isDetailsModalOpen}
              onClose={() => setIsDetailsModalOpen(false)}
              campaign={selectedCampaign}
            />

            <AddCampaignUpdateModal
              isOpen={isUpdateModalOpen}
              onClose={() => setIsUpdateModalOpen(false)}
              campaign={selectedCampaign!}
              onUpdateAdded={handleUpdateAdded}
              addCampaignToList={addCampaignToList}
            />
          </>
        )}
      </AnimatePresence>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() =>
          deleteModal.campaign && handleDeleteCampaign(deleteModal.campaign.id)
        }
        campaign={deleteModal.campaign}
      />
    </>
  );
}
