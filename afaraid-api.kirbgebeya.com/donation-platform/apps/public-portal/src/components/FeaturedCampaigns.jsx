import {
  FaHeart,
  FaUsers,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaArrowRight,
  FaPaw,
  FaStar,
  FaFire,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocalization } from "../contexts/LocalizationContext";
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

const CampaignCard = ({ campaign, index }) => {
  const progressPercentage = (campaign.raised / campaign.goal) * 100;
  const [isHovered, setIsHovered] = useState(false);
  const [showGoatAnimation, setShowGoatAnimation] = useState(false);
  const { t } = useLocalization();

  useEffect(() => {
    if (isHovered) {
      setShowGoatAnimation(true);
      const timer = setTimeout(() => setShowGoatAnimation(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isHovered]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateY: -15 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative">
        <motion.img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-48 object-cover rounded-t-2xl"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />

        {/* Status Badge */}
        <motion.div
          className="absolute top-3 left-3"
          whileHover={{ scale: 1.05 }}
        >
          <span className="bg-green-600 text-white px-2.5 py-1 rounded-full text-xs font-medium">
            {campaign.status}
          </span>
        </motion.div>

        {/* Hot Badge */}
        {campaign.isHot && (
          <motion.div
            className="absolute top-3 right-3"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
              <FaFire className="h-3 w-3" />
              <span>HOT</span>
            </div>
          </motion.div>
        )}

        {/* Goat Animation */}
        <AnimatePresence>
          {showGoatAnimation && (
            <motion.div
              className="absolute top-3 right-3"
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: [0, 1, 1.2, 1],
                rotate: [0, 360],
                y: [0, -10, 0],
              }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 1.5 }}
            >
              <FaPaw className="h-5 w-5 text-green-500" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-5">
          <motion.h3 className="text-lg font-semibold text-gray-900 mb-2">
            {campaign.title}
          </motion.h3>
          <motion.p
            className="text-gray-600 mb-4 text-sm line-clamp-2"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
          >
            {campaign.description}
          </motion.p>

          {/* Meta Info */}
          <div className="space-y-2 mb-4">
            <motion.div
              className="flex items-center text-xs text-gray-500"
              whileHover={{ x: 2 }}
            >
              <FaMapMarkerAlt className="h-3 w-3 mr-1.5 text-green-500" />
              <span>{campaign.location}</span>
            </motion.div>
            <motion.div
              className="flex items-center text-xs text-gray-500"
              whileHover={{ x: 2 }}
            >
              <FaUsers className="h-3 w-3 mr-1.5 text-blue-500" />
              <span>{campaign.beneficiaries} families</span>
            </motion.div>
            <motion.div
              className="flex items-center text-xs text-gray-500"
              whileHover={{ x: 2 }}
            >
              <FaCalendarAlt className="h-3 w-3 mr-1.5 text-purple-500" />
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
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1.5">
              <span>Progress</span>
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.5 }}
              >
                {progressPercentage.toFixed(1)}%
              </motion.span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="bg-green-500 h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <motion.p
                className="text-xl font-bold text-gray-900"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {formatAmount(campaign.raised, campaign.currency)}
              </motion.p>
              <p className="text-xs text-gray-500">
                of {formatAmount(campaign.goal, campaign.currency)} goal
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Donors</p>
              <motion.p
                className="text-sm font-medium text-gray-900"
                animate={{ color: ["#111827", "#10b981", "#111827"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {campaign.donors}
              </motion.p>
            </div>
          </div>

          {/* Donate Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to={`/campaigns/${campaign.title}`}
              state={{ id: campaign.id }}
              className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center justify-center space-x-1.5 text-sm"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FaHeart className="h-3 w-3" />
              </motion.div>
              <span>Donate Now</span>
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <FaArrowRight className="h-3 w-3" />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturedCampaigns = () => {
  const { t } = useLocalization();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const response = await campaignsService.getFeaturedCampaigns();
        const formatted = (
          Array.isArray(response.data) ? response.data : [response.data]
        ).map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          image: c.detail?.image || "https://via.placeholder.com/500x300",
          location: c.detail?.location || "Unknown",
          beneficiaries: c.detail?.beneficiaries || 0,
          endDate: c.detail?.endDate || "TBA",
          raised: c.detail?.raisedAmount || 0,
          goal: c.detail?.goalAmount || 0,
          donors: c.detail?.donors || 0,
          status: c.status || "Active",
          isHot: c.isHot || false,
          currency: c.detail?.currency || "USD",
        }));
        setCampaigns(formatted);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {t("home.featuredCampaigns")}
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Join our active campaigns and make a direct impact on families in
            need.
          </motion.p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {!loading &&
            campaigns.map((campaign, index) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                index={index}
              />
            ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/campaigns"
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
            >
              <span>View All Campaigns</span>
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <FaArrowRight className="h-4 w-4" />
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCampaigns;
