import { useEffect, useState, useMemo } from "react";
import {
  FiUser,
  FiMapPin,
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiTrendingUp,
  FiUsers,
  FiGift,
  FiDollarSign,
  FiAward,
  FiArrowLeft,
  FiList,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import DataTable from "react-data-table-component";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import donorsService from "@/services/donorsService";
import { Tooltip } from "react-tooltip";

interface Donor {
  id: string;
  donorIdentityNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  donations?: {
    totalAmount: number;
    count: number;
    lastDonation: string;
    donations?: Array<{
      id: string;
      amount: number;
      type: string;
      campaign: string;
      campaignId?: string;
      status: string;
      paymentMethod?: string;
      date: string;
      dedication?: string;
      anonymous: boolean;
    }>;
  };
}

interface DonorStats {
  totalDonors: number;
  activeDonors: number;
  totalDonations: number;
  averageDonation: number;
  topDonors: Donor[];
}

interface DonationHistory {
  id: string;
  amount: number;
  type: string;
  campaign: string;
  campaignId?: string;
  status: string;
  paymentMethod?: string;
  date: string;
  dedication?: string;
  anonymous: boolean;
}

const DonorDetailsModal = ({
  isOpen,
  onClose,
  donor,
  onViewDonations,
}: {
  isOpen: boolean;
  onClose: () => void;
  donor: Donor | null;
  onViewDonations: (donor: Donor) => void;
}) => {
  if (!donor) return null;

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
                Donor Details
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
              {/* Donor Identity */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl">
                <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                  Donor ID
                </div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {donor.donorIdentityNumber}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Created: {new Date(donor.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Personal Information */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FiUser size={16} />
                  Personal Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">
                      First Name
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {donor.firstName}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">
                      Last Name
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {donor.lastName}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-gray-500 dark:text-gray-400">
                      Email
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {donor.email}
                    </div>
                  </div>
                  {donor.phone && (
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">
                        Phone
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {donor.phone}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Information */}
              {(donor.address || donor.city || donor.state) && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <FiMapPin size={16} />
                    Address Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {donor.address && (
                      <div className="col-span-2">
                        <div className="text-gray-500 dark:text-gray-400">
                          Address
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {donor.address}
                        </div>
                      </div>
                    )}
                    {donor.city && (
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">
                          City
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {donor.city}
                        </div>
                      </div>
                    )}
                    {donor.state && (
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">
                          State
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {donor.state}
                        </div>
                      </div>
                    )}
                    {donor.zipCode && (
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">
                          ZIP Code
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {donor.zipCode}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">
                        Country
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {donor.country}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Donation Statistics */}
              {donor.donations && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <FiTrendingUp size={16} />
                    Donation History
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-gray-500 dark:text-gray-400">
                        Total Donations
                      </div>
                      <div className="font-bold text-2xl text-blue-600 dark:text-blue-400">
                        {donor.donations.count}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-500 dark:text-gray-400">
                        Total Amount
                      </div>
                      <div className="font-bold text-2xl text-green-600 dark:text-green-400">
                        {donor.donations.totalAmount.toFixed(2)} ETB
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-500 dark:text-gray-400">
                        Average
                      </div>
                      <div className="font-bold text-2xl text-purple-600 dark:text-purple-400">
                        {(
                          donor.donations.totalAmount / donor.donations.count
                        ).toFixed(2)}{" "}
                        ETB
                      </div>
                    </div>
                    {donor.donations.lastDonation && (
                      <div className="col-span-3 text-center pt-2 border-t border-gray-200 dark:border-gray-600">
                        <div className="text-gray-500 dark:text-gray-400">
                          Last Donation
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {new Date(
                            donor.donations.lastDonation
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    )}
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
                onClick={() => onViewDonations(donor)}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FiList size={18} />
                View Donation History
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const DonationHistoryModal = ({
  isOpen,
  onClose,
  donor,
  donations,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  donor: Donor | null;
  donations: DonationHistory[];
  loading: boolean;
}) => {
  if (!donor) return null;

  const donationColumns = [
    {
      name: "Date",
      selector: (row: DonationHistory) => row.date,
      sortable: true,
      width: "120px",
      cell: (row: DonationHistory) => (
        <div className="text-sm text-gray-900 dark:text-white">
          {new Date(row.date).toLocaleDateString()}
        </div>
      ),
    },
    {
      name: "Amount",
      selector: (row: DonationHistory) => row.amount,
      sortable: true,
      width: "120px",
      cell: (row: DonationHistory) => (
        <div className="font-bold text-green-600 dark:text-green-400">
          {row.amount.toFixed(2)} ETB
        </div>
      ),
    },
    {
      name: "Type",
      selector: (row: DonationHistory) => row.type,
      sortable: true,
      width: "100px",
      cell: (row: DonationHistory) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
            row.type === "goats"
              ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          }`}
        >
          {row.type}
        </span>
      ),
    },
    {
      name: "Campaign",
      selector: (row: DonationHistory) => row.campaign,
      sortable: true,
      minWidth: "150px",
      cell: (row: DonationHistory) => (
        <div className="text-sm text-gray-900 dark:text-white">
          {row.campaign}
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row: DonationHistory) => row.status,
      sortable: true,
      width: "120px",
      cell: (row: DonationHistory) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
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
      name: "Payment Method",
      selector: (row: DonationHistory) => row.paymentMethod,
      sortable: true,
      width: "130px",
      cell: (row: DonationHistory) => (
        <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
          {row.paymentMethod || "N/A"}
        </div>
      ),
    },
    {
      name: "Dedication",
      selector: (row: DonationHistory) => row.dedication,
      sortable: false,
      width: "150px",
      cell: (row: DonationHistory) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {row.dedication || "-"}
        </div>
      ),
    },
  ];

  const donationCustomStyles = {
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
      },
    },
    headCells: {
      style: {
        fontWeight: "600",
        fontSize: "14px",
        color: "#374151",
        backgroundColor: "transparent",
        paddingLeft: "8px",
        paddingRight: "8px",
      },
    },
    cells: {
      style: {
        fontSize: "14px",
        color: "#4b5563",
        paddingLeft: "8px",
        paddingRight: "8px",
      },
    },
    rows: {
      style: {
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #f1f5f9",
        minHeight: "60px",
        "&:not(:last-of-type)": {
          borderBottomWidth: "1px",
          borderBottomColor: "#f1f5f9",
        },
        "&:hover": {
          backgroundColor: "#f8fafc",
        },
      },
    },
  };

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
            className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 mx-4 max-w-7xl w-full shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FiArrowLeft size={20} />
                </button>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Donation History
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {donor.firstName} {donor.lastName} •{" "}
                    {donor.donorIdentityNumber}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  Total: {donor.donations?.totalAmount.toFixed(2) || "0.00"} ETB
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {donations.length} donations
                </div>
              </div>
            </div>

            {/* Donation History Table */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <DataTable
                columns={donationColumns}
                data={donations}
                progressPending={loading}
                highlightOnHover
                pagination
                responsive
                customStyles={donationCustomStyles}
                noHeader
                persistTableHead
                striped
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 25, 50]}
              />
            </div>

            {/* Summary */}
            {donations.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="font-semibold text-blue-600 dark:text-blue-400">
                    {donations.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}{" "}
                    ETB
                  </div>
                  <div className="text-blue-600 dark:text-blue-400">
                    Total Given
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="font-semibold text-green-600 dark:text-green-400">
                    {donations.filter((d) => d.status === "completed").length}
                  </div>
                  <div className="text-green-600 dark:text-green-400">
                    Completed
                  </div>
                </div>
                <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <div className="font-semibold text-amber-600 dark:text-amber-400">
                    {donations.filter((d) => d.type === "goats").length}
                  </div>
                  <div className="text-amber-600 dark:text-amber-400">
                    Goat Donations
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="font-semibold text-purple-600 dark:text-purple-400">
                    {new Set(donations.map((d) => d.campaign)).size}
                  </div>
                  <div className="text-purple-600 dark:text-purple-400">
                    Campaigns
                  </div>
                </div>
              </div>
            )}

            {/* Close Button */}
            <div className="flex justify-end mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function Donors() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [stats, setStats] = useState<DonorStats>({
    totalDonors: 0,
    activeDonors: 0,
    totalDonations: 0,
    averageDonation: 0,
    topDonors: [],
  });
  const [loading, setLoading] = useState(true);
  const [donationHistoryLoading, setDonationHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [activityFilter, setActivityFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDonationHistoryModalOpen, setIsDonationHistoryModalOpen] =
    useState(false);
  const [donationHistory, setDonationHistory] = useState<DonationHistory[]>([]);

  useEffect(() => {
    fetchDonors();
    fetchDonorStats();
  }, [refreshTrigger]);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const response = await donorsService.getAllDonors();
      setDonors(response || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load donors");
    } finally {
      setLoading(false);
    }
  };

  const fetchDonorStats = async () => {
    try {
      const response = await donorsService.getDonorStats();
      setStats(
        response || {
          totalDonors: 0,
          activeDonors: 0,
          totalDonations: 0,
          averageDonation: 0,
          topDonors: [],
        }
      );
    } catch (err: any) {
      console.error("Failed to load donor stats:", err.message);
    }
  };

  const fetchDonationHistory = async (donorId: string) => {
    try {
      setDonationHistoryLoading(true);
      const response = await donorsService.getDonorDonations(donorId);
      setDonationHistory(response || []);
    } catch (err: any) {
      console.error("Failed to load donation history:", err.message);
      setDonationHistory([]);
    } finally {
      setDonationHistoryLoading(false);
    }
  };

  const handleViewDonations = async (donor: Donor) => {
    setSelectedDonor(donor);
    setIsDetailsModalOpen(false);
    setIsDonationHistoryModalOpen(true);
    await fetchDonationHistory(donor.id);
  };

  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      const matchesSearch =
        donor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.donorIdentityNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCountry =
        countryFilter === "all" || donor.country === countryFilter;

      const matchesActivity =
        activityFilter === "all" ||
        (activityFilter === "active" &&
          donor.donations &&
          donor.donations.count > 0) ||
        (activityFilter === "inactive" &&
          (!donor.donations || donor.donations.count === 0));

      return matchesSearch && matchesCountry && matchesActivity;
    });
  }, [donors, searchTerm, countryFilter, activityFilter]);

  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(donors.map((donor) => donor.country))];
    return uniqueCountries.sort();
  }, [donors]);

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
      selector: (row: Donor) => `${row.firstName} ${row.lastName}`,
      sortable: true,
      minWidth: "220px",
      cell: (row: Donor) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {`${row.firstName[0]}${row.lastName[0]}`}
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {`${row.firstName} ${row.lastName}`}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {row.donorIdentityNumber}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500">
              Joined: {new Date(row.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Contact",
      selector: (row: Donor) => row.email,
      sortable: true,
      minWidth: "200px",
      cell: (row: Donor) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {row.email}
          </div>
          {row.phone && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {row.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Location",
      selector: (row: Donor) => `${row.city || ""} ${row.state || ""}`.trim(),
      sortable: true,
      width: "150px",
      cell: (row: Donor) => (
        <div className="text-sm">
          {row.city && (
            <div className="text-gray-900 dark:text-white">{row.city}</div>
          )}
          {row.state && (
            <div className="text-gray-500 dark:text-gray-400">{row.state}</div>
          )}
          <div className="text-xs text-gray-400 dark:text-gray-500">
            {row.country}
          </div>
        </div>
      ),
    },
    {
      name: "Donations",
      selector: (row: Donor) => row.donations?.count || 0,
      sortable: true,
      width: "120px",
      cell: (row: Donor) => (
        <div className="text-center">
          <div className="font-bold text-blue-600 dark:text-blue-400">
            {row.donations?.count || 0}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            donations
          </div>
        </div>
      ),
    },
    {
      name: "Total Given",
      selector: (row: Donor) => row.donations?.totalAmount || 0,
      sortable: true,
      width: "130px",
      cell: (row: Donor) => (
        <div>
          <div className="font-bold text-green-600 dark:text-green-400">
            {(row.donations?.totalAmount || 0).toFixed(2)} ETB
          </div>
          {row.donations?.count > 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              avg:{" "}
              {(
                (row.donations?.totalAmount || 0) / row.donations?.count
              ).toFixed(2)}{" "}
              ETB
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row: Donor) =>
        (row.donations?.count || 0) > 0 ? "active" : "inactive",
      sortable: true,
      width: "100px",
      cell: (row: Donor) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
            (row.donations?.count || 0) > 0
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
          }`}
        >
          {(row.donations?.count || 0) > 0 ? "Active" : "New"}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row: Donor) => (
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setSelectedDonor(row);
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
            onClick={() => handleViewDonations(row)}
            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30"
            title="View donation history"
          >
            <FiList size={16} />
          </motion.button>
        </div>
      ),
      width: "100px",
      center: true,
      sortable: false,
    },
  ];

  const customStyles = {
    // ... (same custom styles as before)
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
        title="Donors Management | Afar Aid"
        description="Manage and analyze donor information. Donors are automatically created when they make their first donation."
      />
      <PageBreadcrumb pageTitle="Donors Management" />

      <div className="space-y-6">
        <ComponentCard
          title={
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Donors Management
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage and analyze donor information. Donors are automatically
                  created when they make their first donation.
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
                    placeholder="Search donors by name, email, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="all">All Countries</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>

                  <select
                    value={activityFilter}
                    onChange={(e) => setActivityFilter(e.target.value as any)}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="all">All Donors</option>
                    <option value="active">Active Donors</option>
                    <option value="inactive">New Donors</option>
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
                      {stats.totalDonors}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Total Donors
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <FiUser
                      className="text-green-600 dark:text-green-400"
                      size={20}
                    />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {stats.activeDonors}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Active Donors
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <FiGift
                      className="text-purple-600 dark:text-purple-400"
                      size={20}
                    />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {stats.totalDonations}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Total Donations
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <FiDollarSign
                      className="text-orange-600 dark:text-orange-400"
                      size={20}
                    />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {stats.averageDonation.toFixed(2)} ETB
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Average Donation
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <FiAward
                      className="text-indigo-600 dark:text-indigo-400"
                      size={20}
                    />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {stats.topDonors.length}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Top Donors
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
                data={filteredDonors}
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

      <DonorDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        donor={selectedDonor}
        onViewDonations={handleViewDonations}
      />

      <DonationHistoryModal
        isOpen={isDonationHistoryModalOpen}
        onClose={() => setIsDonationHistoryModalOpen(false)}
        donor={selectedDonor}
        donations={donationHistory}
        loading={donationHistoryLoading}
      />
    </>
  );
}
