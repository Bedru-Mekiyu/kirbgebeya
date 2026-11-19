import { useEffect, useState, useMemo } from "react";
import {
    FiDollarSign,
    FiCreditCard,
    FiSearch,
    FiRefreshCw,
    FiEye,
    FiTrendingUp,
    FiUsers,
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiDownload,
    FiFileText,
    FiArrowUpRight,
    FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import DataTable from "react-data-table-component";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import paymentsService from "@/services/paymentsService";
import { Tooltip } from "react-tooltip";

interface Payment {
    id: string;
    donationId: string;
    paymentMethod: string;
    cardNumber?: string;
    expiryDate?: string;
    nameOnCard?: string;
    amount: number;
    status: "pending" | "completed" | "failed" | "refunded";
    transactionId?: string;
    tx_ref?: string;
    createdAt: string;
    updatedAt: string;
    donation?: {
        id: string;
        totalAmount: number;
        donationType: "goats" | "amount";
        dedication?: string;
        anonymous: boolean;
        donor?: {
            firstName: string;
            lastName: string;
            email: string;
            donorIdentityNumber: string;
        };
        campaign?: {
            title: string;
        };
    };
}

interface PaymentStats {
    totalPayments: number;
    completedPayments: number;
    pendingPayments: number;
    failedPayments: number;
    totalAmount: number;
    averageAmount: number;
    refundedAmount: number;
}

const PaymentDetailsModal = ({
    isOpen,
    onClose,
    payment,
}: {
    isOpen: boolean;
    onClose: () => void;
    payment: Payment | null;
}) => {
    if (!payment) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "pending":
                return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
            case "failed":
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            case "refunded":
                return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <FiCheckCircle className="text-green-600 dark:text-green-400" size={20} />;
            case "pending":
                return <FiClock className="text-amber-600 dark:text-amber-400" size={20} />;
            case "failed":
                return <FiXCircle className="text-red-600 dark:text-red-400" size={20} />;
            case "refunded":
                return <FiArrowUpRight className="text-purple-600 dark:text-purple-400" size={20} />;
            default:
                return <FiClock className="text-gray-600 dark:text-gray-400" size={20} />;
        }
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
                        className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 mx-4 max-w-2xl w-full shadow-2xl border border-gray-200 dark:border-gray-700"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Payment Details
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
                                        {payment.amount.toFixed(2)} ETB
                                    </div>
                                    <div className="text-sm text-blue-600 dark:text-blue-400">
                                        Amount
                                    </div>
                                </div>
                                <div className={`p-4 rounded-xl ${getStatusColor(payment.status)}`}>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(payment.status)}
                                        <div className="text-lg font-bold capitalize">
                                            {payment.status}
                                        </div>
                                    </div>
                                    <div className="text-sm opacity-75">Status</div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <FiCreditCard size={16} />
                                    Payment Information
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <div className="text-gray-500 dark:text-gray-400">
                                            Payment Method
                                        </div>
                                        <div className="font-medium text-gray-900 dark:text-white capitalize">
                                            {payment.paymentMethod}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 dark:text-gray-400">
                                            Transaction ID
                                        </div>
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {payment.tx_ref || "N/A"}
                                        </div>
                                    </div>
                                    {payment.cardNumber && (
                                        <div>
                                            <div className="text-gray-500 dark:text-gray-400">
                                                Card Number
                                            </div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                **** {payment.cardNumber.slice(-4)}
                                            </div>
                                        </div>
                                    )}
                                    {payment.expiryDate && (
                                        <div>
                                            <div className="text-gray-500 dark:text-gray-400">
                                                Expiry Date
                                            </div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {payment.expiryDate}
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <div className="text-gray-500 dark:text-gray-400">
                                            Created
                                        </div>
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {new Date(payment.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 dark:text-gray-400">
                                            Last Updated
                                        </div>
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {new Date(payment.updatedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Donation Information */}
                            {payment.donation && (
                                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <FiDollarSign size={16} />
                                        Donation Information
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <div className="text-gray-500 dark:text-gray-400">
                                                Donation Type
                                            </div>
                                            <div className="font-medium text-gray-900 dark:text-white capitalize">
                                                {payment.donation.donationType}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 dark:text-gray-400">
                                                Donation Amount
                                            </div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {payment.donation.totalAmount.toFixed(2)} ETB
                                            </div>
                                        </div>
                                        {payment.donation.campaign && (
                                            <div className="col-span-2">
                                                <div className="text-gray-500 dark:text-gray-400">
                                                    Campaign
                                                </div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {payment.donation.campaign.title}
                                                </div>
                                            </div>
                                        )}
                                        {payment.donation.dedication && (
                                            <div className="col-span-2">
                                                <div className="text-gray-500 dark:text-gray-400">
                                                    Dedication
                                                </div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {payment.donation.dedication}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Donor Information */}
                            {payment.donation?.donor && (
                                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <FiUsers size={16} />
                                        Donor Information
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <div className="text-gray-500 dark:text-gray-400">
                                                Name
                                            </div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {payment.donation.anonymous
                                                    ? "Anonymous"
                                                    : `${payment.donation.donor.firstName} ${payment.donation.donor.lastName}`
                                                }
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 dark:text-gray-400">
                                                Donor ID
                                            </div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {payment.donation.donor.donorIdentityNumber}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-gray-500 dark:text-gray-400">
                                                Email
                                            </div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {payment.donation.donor.email}
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
                                onClick={() => paymentsService.downloadReceipt(payment.id)}
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

export default function Payments() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [stats, setStats] = useState<PaymentStats>({
        totalPayments: 0,
        completedPayments: 0,
        pendingPayments: 0,
        failedPayments: 0,
        totalAmount: 0,
        averageAmount: 0,
        refundedAmount: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<
        "all" | "completed" | "pending" | "failed" | "refunded"
    >("all");
    const [methodFilter, setMethodFilter] = useState("all");
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    useEffect(() => {
        fetchPayments();
        fetchPaymentStats();
    }, [refreshTrigger]);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const response = await paymentsService.getAllPayments();
            console.log("Fetched payments:", response);
            setPayments(response || []);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to load payments");
        } finally {
            setLoading(false);
        }
    };

    const fetchPaymentStats = async () => {
        try {
            const response = await paymentsService.getPaymentStats();
            setStats(response || {
                totalPayments: 0,
                completedPayments: 0,
                pendingPayments: 0,
                failedPayments: 0,
                totalAmount: 0,
                averageAmount: 0,
                refundedAmount: 0,
            });
        } catch (err: any) {
            console.error("Failed to load payment stats:", err.message);
        }
    };

    const filteredPayments = useMemo(() => {
        return payments.filter((payment) => {
            const matchesSearch =
                payment.donation?.donor?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.donation?.donor?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.donation?.donor?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.donation?.donor?.donorIdentityNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.tx_ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.donation?.campaign?.title?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "all" || payment.status === statusFilter;

            const matchesMethod =
                methodFilter === "all" || payment.paymentMethod === methodFilter;

            return matchesSearch && matchesStatus && matchesMethod;
        });
    }, [payments, searchTerm, statusFilter, methodFilter]);

    const paymentMethods = useMemo(() => {
        const uniqueMethods = [...new Set(payments.map(payment => payment.paymentMethod))];
        return uniqueMethods.sort();
    }, [payments]);

    const columns = [
        {
            name: "No",
            selector: (_, i) => i + 1,
            width: "70px",
            center: true,
            sortable: false,
        },
        {
            name: "Transaction",
            selector: (row: Payment) => row.tx_ref || row.tx_ref,
            sortable: true,
            minWidth: "200px",
            cell: (row: Payment) => (
                <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                        {row.tx_ref || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(row.createdAt).toLocaleDateString()}
                    </div>
                </div>
            ),
        },
        {
            name: "Donor",
            selector: (row: Payment) =>
                row.donation?.donor
                    ? `${row.donation.donor.firstName} ${row.donation.donor.lastName}`
                    : "Unknown",
            sortable: true,
            minWidth: "180px",
            cell: (row: Payment) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                        {row.donation?.anonymous
                            ? "Anonymous"
                            : row.donation?.donor
                                ? `${row.donation.donor.firstName} ${row.donation.donor.lastName}`
                                : "Unknown"}
                    </div>
                    {row.donation?.donor && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {row.donation.donor.donorIdentityNumber}
                        </div>
                    )}
                </div>
            ),
        },
        {
            name: "Amount",
            selector: (row: Payment) => row.amount,
            sortable: true,
            width: "120px",
            cell: (row: Payment) => (
                <div className="font-bold text-green-600 dark:text-green-400">
                    {row.amount.toFixed(2)} ETB
                </div>
            ),
        },
        {
            name: "Method",
            selector: (row: Payment) => row.paymentMethod,
            sortable: true,
            width: "100px",
            cell: (row: Payment) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${row.paymentMethod === "card"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : row.paymentMethod === "paypal"
                            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                        }`}
                >
                    {row.paymentMethod}
                </span>
            ),
        },
        {
            name: "Status",
            selector: (row: Payment) => row.status,
            sortable: true,
            width: "120px",
            cell: (row: Payment) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${row.status === "completed"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : row.status === "pending"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : row.status === "failed"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                        }`}
                >
                    {row.status}
                </span>
            ),
        },
        {
            name: "Campaign",
            selector: (row: Payment) => row.donation?.campaign?.title || "-",
            sortable: true,
            minWidth: "150px",
        },
        {
            name: "Date",
            selector: (row: Payment) => row.createdAt,
            sortable: true,
            width: "120px",
            cell: (row: Payment) => (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(row.createdAt).toLocaleDateString()}
                </div>
            ),
        },
        {
            name: "Actions",
            cell: (row: Payment) => (
                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            setSelectedPayment(row);
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
                        onClick={() => paymentsService.downloadReceipt(row.id)}
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
                title="Payments Management | Afar Aid"
                description="Comprehensive payments management panel with transaction tracking, filtering, and payment insights for Afar Aid platform administrators."
            />
            <PageBreadcrumb pageTitle="Payments Management" />

            <div className="space-y-6">
                <ComponentCard
                    title={
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Payments Management
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Monitor and manage all payment transactions with comprehensive analytics and controls
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
                                        placeholder="Search payments by donor, email, transaction ID, or campaign..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>

                                {/* Filters */}
                                <div className="flex gap-2">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value as any)}
                                        className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="completed">Completed</option>
                                        <option value="pending">Pending</option>
                                        <option value="failed">Failed</option>
                                        <option value="refunded">Refunded</option>
                                    </select>

                                    <select
                                        value={methodFilter}
                                        onChange={(e) => setMethodFilter(e.target.value)}
                                        className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    >
                                        <option value="all">All Methods</option>
                                        {paymentMethods.map(method => (
                                            <option key={method} value={method}>
                                                {method.charAt(0).toUpperCase() + method.slice(1)}
                                            </option>
                                        ))}
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
                        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <FiDollarSign
                                            className="text-blue-600 dark:text-blue-400"
                                            size={20}
                                        />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stats.totalPayments}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Total Payments
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                        <FiCheckCircle
                                            className="text-green-600 dark:text-green-400"
                                            size={20}
                                        />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            {stats.completedPayments}
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
                                        <FiClock
                                            className="text-amber-600 dark:text-amber-400"
                                            size={20}
                                        />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                            {stats.pendingPayments}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Pending
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                        <FiXCircle
                                            className="text-red-600 dark:text-red-400"
                                            size={20}
                                        />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                            {stats.failedPayments}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Failed
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        <FiTrendingUp
                                            className="text-purple-600 dark:text-purple-400"
                                            size={20}
                                        />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                            {stats.totalAmount.toFixed(2)} ETB
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Total Amount
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                        <FiFileText
                                            className="text-orange-600 dark:text-orange-400"
                                            size={20}
                                        />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                            {stats.averageAmount.toFixed(2)} ETB
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Average
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                        <FiArrowUpRight
                                            className="text-indigo-600 dark:text-indigo-400"
                                            size={20}
                                        />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                            {stats.refundedAmount.toFixed(2)} ETB
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Refunded
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
                                data={filteredPayments}
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

            <PaymentDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                payment={selectedPayment}
            />
        </>
    );
}