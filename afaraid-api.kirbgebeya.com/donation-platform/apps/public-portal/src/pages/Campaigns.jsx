import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  FaHeart,
  FaUsers,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaArrowRight,
  FaFilter,
  FaSearch,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import campaignsService from "../services/campaignsService";

const formatAmount = (amount, currency = "USD") => {
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: currency,
      currencyDisplay: "symbol",
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${currency}`;
  }
};

const CampaignCard = ({ campaign }) => {
  const progressPercentage =
    campaign.goal > 0 ? (campaign.raised / campaign.goal) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="relative">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              campaign.status === "Active"
                ? "bg-green-600 text-white"
                : campaign.status === "Completed"
                ? "bg-blue-600 text-white"
                : "bg-gray-600 text-white"
            }`}
          >
            {campaign.status}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {campaign.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {campaign.description}
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <FaMapMarkerAlt className="h-4 w-4 mr-2" />
            <span>{campaign.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <FaUsers className="h-4 w-4 mr-2" />
            <span>{campaign.beneficiaries} families</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <FaCalendarAlt className="h-4 w-4 mr-2" />
            <span>
              {campaign.endDate
                ? `Ends ${new Date(campaign.endDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}`
                : "No end date"}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progressPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Amounts */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {formatAmount(campaign.raised, campaign.currency)}
            </p>
            <p className="text-sm text-gray-500">
              of {formatAmount(campaign.goal, campaign.currency)} goal
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Donors</p>
            <p className="text-lg font-semibold text-gray-900">
              {campaign.donors}
            </p>
          </div>
        </div>

        <Link
          to={`/campaigns/${campaign.title}`}
          state={{ id: campaign.id }}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
        >
          <FaHeart className="h-4 w-4" />
          <span>View Details</span>
          <FaArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
};

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const response = await campaignsService.getAllCampaigns();
        const formatted = (
          Array.isArray(response.data) ? response.data : [response.data]
        ).map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          image: c.detail?.image || "https://via.placeholder.com/500x300",
          location: c.detail?.location || "Unknown",
          beneficiaries: c.detail?.beneficiaries || 0,
          endDate: c.detail?.endDate || null,
          raised: c.detail?.raisedAmount || 0,
          goal: c.detail?.goalAmount || 0,
          donors: c.detail?.donors || 0,
          currency: c.detail?.currency || "USD",
          status: c.status || "Active",
        }));
        setCampaigns(formatted);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-50 to-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Active Campaigns
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Browse our current campaigns and find the cause that speaks to
                your heart. Every donation makes a real difference.
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-4">
                <FaFilter className="h-4 w-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Campaigns Grid */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-12 text-gray-500 text-lg">
                Loading campaigns...
              </div>
            ) : filteredCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                  No campaigns found matching your criteria.
                </div>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("All");
                  }}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Campaigns;
