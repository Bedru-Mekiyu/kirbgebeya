import { useEffect, useState, useMemo } from "react";
import {
  FiDollarSign,
  FiUser,
  FiSearch,
  FiRefreshCw,
  FiDownload,
  FiEye,
  FiCalendar,
  FiTrendingUp,
  FiUsers,
  FiGift,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import DataTable from "react-data-table-component";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import donationsService from "@/services/donationsService";
import { Tooltip } from "react-tooltip";

interface Donation {
  id: string;
  donorId: string;
  campaignId?: string;
  donationType: "goats" | "amount";
  goatDetails?: any;
  totalAmount: number;
  dedication?: string;
  anonymous: boolean;
  newsletter: boolean;
  status: "pending" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
  donor?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  campaign?: {
    title: string;
  };
  payment?: {
    paymentMethod: string;
    status: string;
  };
}

const DonationDetailsModal = ({
  isOpen,
  onClose,
  donation,
}: {
  isOpen: boolean;
  onClose: () => void;
  donation: Donation | null;
}) => {
  if (!donation) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 mx-4 max-w-2xl w-full shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Donation Details
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Amount & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {donation.totalAmount.toFixed(2)} ETB
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    Amount
                  </div>
                </div>
                <div
                  className={`p-4 rounded-xl ${
                    donation.status === "completed"
                      ? "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
                      : donation.status === "pending"
                      ? "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20"
                      : "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20"
                  }`}
                >
                  <div
                    className={`text-lg font-bold capitalize ${
                      donation.status === "completed"
                        ? "text-green-600 dark:text-green-400"
                        : donation.status === "pending"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {donation.status}
                  </div>
                  <div className="text-sm opacity-75">Status</div>
                </div>
              </div>

              {/* Donor Information */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FiUser size={16} />
                  Donor Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Name</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {donation.anonymous
                        ? "Anonymous"
                        : `${donation.donor?.firstName} ${donation.donor?.lastName}`}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">
                      Email
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {donation.donor?.email}
                    </div>
                  </div>
                  {donation.donor?.phone && (
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">
                        Phone
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {donation.donor.phone}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Donation Details */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FiGift size={16} />
                  Donation Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Type</div>
                    <div className="font-medium text-gray-900 dark:text-white capitalize">
                      {donation.donationType}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Date</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {new Date(donation.date).toLocaleDateString()}
                    </div>
                  </div>
                  {donation.campaign && (
                    <div className="col-span-2">
                      <div className="text-gray-500 dark:text-gray-400">
                        Campaign
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {donation.campaign.title}
                      </div>
                    </div>
                  )}
                  {donation.dedication && (
                    <div className="col-span-2">
                      <div className="text-gray-500 dark:text-gray-400">
                        Dedication
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {donation.dedication}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              {donation.payment && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <FiDollarSign size={16} />
                    Payment Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">
                        Method
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white capitalize">
                        {donation.payment.paymentMethod}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">
                        Payment Status
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white capitalize">
                        {donation.payment.status}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Download receipt logic
                  donationsService.downloadDonationReceipt(donation.id);
                }}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FiDownload size={18} />
                Download Receipt
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function Donations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "pending" | "failed"
  >("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "goats" | "amount">(
    "all"
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, [refreshTrigger]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await donationsService.getRecentDonations(100);
      setDonations(response || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  const filteredDonations = useMemo(() => {
    return donations.filter((donation) => {
      const matchesSearch =
        donation.donor?.firstName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        donation.donor?.lastName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        donation.donor?.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        donation.campaign?.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || donation.status === statusFilter;

      const matchesType =
        typeFilter === "all" || donation.donationType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [donations, searchTerm, statusFilter, typeFilter]);

  const stats = useMemo(() => {
    const total = donations.length;
    const completed = donations.filter((d) => d.status === "Completed").length;
    const pending = donations.filter((d) => d.status === "Pending").length;
    const totalAmount = donations
      .filter((d) => d.status === "Pending")
      .reduce((sum, d) => sum + d.totalAmount, 0);
    const averageAmount = completed > 0 ? totalAmount / completed : 0;

    return { total, completed, pending, totalAmount, averageAmount };
  }, [donations]);

  const columns = [
    {
      name: "No",
      selector: (_, i) => i + 1,
      width: "70px",
      center: true,
      sortable: false,
    },
    {
      name: "Donor",
      selector: (row: Donation) =>
        row.donor ? `${row.donor.firstName} ${row.donor.lastName}` : "Unknown",
      sortable: true,
      minWidth: "200px",
      cell: (row: Donation) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {row.anonymous
              ? "A"
              : row.donor
              ? `${row.donor.firstName[0]}${row.donor.lastName[0]}`
              : "U"}
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {row.anonymous
                ? "Anonymous"
                : row.donor
                ? `${row.donor.firstName} ${row.donor.lastName}`
                : "Unknown"}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {row.donor?.email || "No email"}
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Amount",
      selector: (row: Donation) => row.totalAmount,
      sortable: true,
      width: "120px",
      cell: (row: Donation) => (
        <div className="font-bold text-green-600 dark:text-green-400">
          {row.totalAmount.toFixed(2)} ETB
        </div>
      ),
    },
    {
      name: "Type",
      selector: (row: Donation) => row.donationType,
      sortable: true,
      width: "100px",
      cell: (row: Donation) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
            row.donationType === "goats"
              ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          }`}
        >
          {row.donationType}
        </span>
      ),
    },
    {
      name: "Campaign",
      selector: (row: Donation) => row.campaign?.title || "-",
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Status",
      selector: (row: Donation) => row.status,
      sortable: true,
      width: "120px",
      cell: (row: Donation) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
            row.status === "completed"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : row.status === "pending"
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Date",
      selector: (row: Donation) => row.createdAt,
      sortable: true,
      width: "120px",
      cell: (row: Donation) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(row.date).toLocaleDateString()}
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row: Donation) => (
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setSelectedDonation(row);
              setIsDetailsModalOpen(true);
            }}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30"
            title="View details"
          >
            <FiEye size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => donationsService.downloadDonationReceipt(row.id)}
            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30"
            title="Download receipt"
          >
            <FiDownload size={16} />
          </motion.button>
        </div>
      ),
      width: "100px",
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
        minHeight: "70px",
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

  return (
    <>
      <PageMeta
        title="Donations Dashboard | Afar Aid"
        description="Comprehensive donations management panel with analytics, filtering, and donor insights for Afar Aid platform administrators."
      />
      <PageBreadcrumb pageTitle="Donations Management" />

      <div className="space-y-6">
        <ComponentCard
          title={
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Donations Management
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Monitor and manage all donations with comprehensive analytics
                  and controls
                </p>
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
                    placeholder="Search donations by donor, email, or campaign..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>

                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as any)}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="all">All Types</option>
                    <option value="goats">Goats</option>
                    <option value="amount">Amount</option>
                  </select>
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
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FiUsers
                      className="text-blue-600 dark:text-blue-400"
                      size={20}
                    />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.total}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Total Donations
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <FiCheck
                      className="text-green-600 dark:text-green-400"
                      size={20}
                    />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {stats.completed}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Completed
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <FiCalendar
                      className="text-amber-600 dark:text-amber-400"
                      size={20}
                    />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {stats.pending}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Pending
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <FiDollarSign
                      className="text-purple-600 dark:text-purple-400"
                      size={20}
                    />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {stats.totalAmount.toFixed(2)} ETB
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Total Raised
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <FiTrendingUp
                      className="text-indigo-600 dark:text-indigo-400"
                      size={20}
                    />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {stats.averageAmount.toFixed(2)} ETB
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Average
                    </div>
                  </div>
                </div>
              </div>
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
                data={filteredDonations}
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

      <DonationDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        donation={selectedDonation}
      />
    </>
  );
}
