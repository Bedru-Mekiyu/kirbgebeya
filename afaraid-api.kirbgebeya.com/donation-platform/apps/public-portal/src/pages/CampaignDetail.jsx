import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  FaHeart,
  FaUsers,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaShare,
  FaArrowLeft,
  FaCheckCircle,
  FaPaw,
  FaCopy,
  FaCheck,
  FaUserCircle,
  FaFire,
  FaCrown,
  FaMedal,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalization } from "../contexts/LocalizationContext";
import { campaignsService, goatsService } from "../services";
import ProgressCard from "../components/ProgressCard";

const formatAmount = (amount, currency = "ETB") => {
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
const getTimeAgo = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now - time) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
};

const CampaignDetail = () => {
  const location = useLocation();
  const id = location.state?.id;
  const { t } = useLocalization();

  const [campaign, setCampaign] = useState(null);
  const [selectedGoats, setSelectedGoats] = useState({});
  const [goatTypes, setGoatTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pricesLoading, setPricesLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [recentDonations, setRecentDonations] = useState([]);
  const [donationsLoading, setDonationsLoading] = useState(true);
  const [showAllDonations, setShowAllDonations] = useState(false);
  const [remainingGoats, setRemainingGoats] = useState(0);

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true);
      try {
        const response = await campaignsService.getCampaignById(id);
        const data = response.data;
        setCampaign(data);
      } catch (error) {
        console.error("Failed to fetch campaign:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id, t]);

  useEffect(() => {
    const fetchRecentDonations = async () => {
      setDonationsLoading(true);
      try {
        const response = await campaignsService.getRecentDonations(id);
        setRecentDonations(response.data || []);
      } catch (error) {
        console.error("Failed to fetch recent donations:", error);
        setRecentDonations([
          {
            id: 1,
            donorName: "Sarah Johnson",
            amount: 200,
            currency: "ETB",
            message: "Hope this helps the families rebuild their lives! 🐐",
            timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            anonymous: false,
            goatsDonated: 1,
            isTopDonor: true,
            donorBadge: "top",
          },
          {
            id: 2,
            donorName: "Anonymous",
            amount: 450,
            currency: "ETB",
            message: "",
            timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
            anonymous: true,
            goatsDonated: 3,
          },
          {
            id: 3,
            donorName: "Michael Chen",
            amount: 150,
            currency: "ETB",
            message: "Blessings to all the families in need",
            timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            anonymous: false,
            goatsDonated: 1,
            donorBadge: "recurring",
          },
          {
            id: 4,
            donorName: "Emma Wilson",
            amount: 600,
            currency: "ETB",
            message: "For sustainable change and hope 🌟",
            timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
            anonymous: false,
            goatsDonated: 4,
            donorBadge: "generous",
          },
          {
            id: 5,
            donorName: "Robert Taylor",
            amount: 300,
            currency: "ETB",
            message: "Happy to support this important cause",
            timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
            anonymous: false,
            goatsDonated: 2,
          },
          {
            id: 6,
            donorName: "Lisa Martinez",
            amount: 750,
            currency: "ETB",
            message: "In memory of those affected by the disaster",
            timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
            anonymous: false,
            goatsDonated: 5,
            donorBadge: "major",
          },
          {
            id: 7,
            donorName: "Anonymous",
            amount: 100,
            currency: "ETB",
            message: "Every little helps!",
            timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
            anonymous: true,
            goatsDonated: 1,
          },
          {
            id: 8,
            donorName: "David Kim",
            amount: 400,
            currency: "ETB",
            message: "Keep up the great work!",
            timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
            anonymous: false,
            goatsDonated: 2,
            donorBadge: "supporter",
          },
        ]);
      } finally {
        setDonationsLoading(false);
      }
    };

    if (campaign) {
      fetchRecentDonations();
    }
  }, [campaign, id]);

  useEffect(() => {
    const loadGoatPrices = async () => {
      setPricesLoading(true);
      try {
        const response = await await goatsService.getGoatTypesByCampaign(id);

        if (response.types && response.types.length > 0) {
          setGoatTypes(response.types);
        } else {
          throw new Error("No goat types returned from API");
        }
      } catch (error) {
        console.error("Failed to load goat prices from database:", error);
        setGoatTypes([
          {
            id: "young",
            name: t("goatTypes.young"),
            age: t("goatTypes.youngAge"),
            description: t("goatTypes.youngDesc"),
            prices: { USD: 150, ETB: 4500, AED: 550 },
            impact: "Perfect for families starting their livestock journey",
          },
          {
            id: "adult",
            name: t("goatTypes.adult"),
            age: t("goatTypes.adultAge"),
            description: t("goatTypes.adultDesc"),
            prices: { USD: 200, ETB: 6000, AED: 730 },
            impact: "Ready for breeding and milk production",
          },
        ]);
      } finally {
        setPricesLoading(false);
      }
    };

    loadGoatPrices();
  }, [t]);

  const getTotalSelectedGoats = () => {
    return Object.values(selectedGoats).reduce((sum, count) => sum + count, 0);
  };

  const canSelectMoreGoats = (goatTypeId, increment = 1) => {
    const currentSelected = getTotalSelectedGoats();
    const newTotal = currentSelected + increment;
    return newTotal <= remainingGoats;
  };

  const handleGoatSelection = (type, count) => {
    const currentTypeCount = selectedGoats[type] || 0;
    const difference = count - currentTypeCount;

    if (difference > 0 && !canSelectMoreGoats(type, difference)) {
      console.warn(`Cannot select more than ${remainingGoats} total goats`);
      return;
    }
    setSelectedGoats((prev) => ({
      ...prev,
      [type]: count,
    }));
  };

  const calculateTotal = () => {
    let total = 0;
    Object.entries(selectedGoats).forEach(([type, count]) => {
      const goatType = goatTypes.find((gt) => gt.id === type);
      if (goatType && count > 0) {
        const price =
          goatType.prices[campaign.detail.currency] || goatType.prices.USD;
        total += price * count;
      }
    });
    return total;
  };

  const shareUrl = window.location.href;
  const shareText = `Join this vital humanitarian initiative: ${campaign?.title} - Restoring livelihoods in Ethiopia's Afar region`;
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOnFacebook = () => {
    const quote = `Join me in supporting this critical humanitarian effort: "${campaign?.title}" - Providing three goats per household to 2,131 families in Ethiopia's Afar region to restore nutrition, livelihood, and hope after recent disasters`;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}&quote=${encodeURIComponent(quote)}`;
    window.open(url, "_blank", "width=600,height=400");
    setShowShareMenu(false);
  };

  const shareOnTwitter = () => {
    const text = `🚜 Humanitarian Relief Initiative: "${campaign?.title}"
  
Providing 3 goats per household to 2,131 families in Ethiopia's Afar region to restore nutrition and livelihoods post-disaster.

Join this vital recovery effort.

#HumanitarianAid #SustainableDevelopment #Ethiopia #LivestockRelief`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}`;
    window.open(url, "_blank", "width=600,height=400");
    setShowShareMenu(false);
  };

  const shareOnLinkedIn = () => {
    const summary = `Strategic Humanitarian Intervention: ${campaign?.title}. Supporting 2,131 families in Ethiopia's Afar region through sustainable livestock distribution. This initiative provides three goats per household to restore nutritional security and economic stability following recent disasters, creating lasting impact through agricultural empowerment.`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(url, "_blank", "width=600,height=400");
    setShowShareMenu(false);
  };

  const shareViaEmail = () => {
    const subject = `Urgent Humanitarian Initiative: ${campaign?.title}`;
    const body = `Dear Colleague,

I'm writing to share a critical humanitarian initiative that addresses urgent needs in Ethiopia's Afar region following recent disasters.

Campaign: ${campaign?.title}
Objective: Provide three goats per household to 2,131 families to restore nutrition, livelihood, and hope

This strategic intervention focuses on:
• Immediate nutritional support through livestock distribution
• Sustainable livelihood restoration for affected families
• Long-term economic stability in the Afar region
• Community resilience building post-disaster

The program represents a comprehensive approach to humanitarian relief, combining immediate aid with sustainable development principles.

For detailed information and participation opportunities, please visit the campaign page.

Your consideration of this meaningful initiative would be greatly appreciated.

Best regards`;
    const url = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
    setShowShareMenu(false);
  };

  const shareViaWhatsApp = () => {
    const text = `🌍 URGENT: Afar Region Humanitarian Relief

"${campaign?.title}"

• Providing 3 goats to 2,131 families
• Restoring nutrition & livelihoods
• Ethiopia's Afar region disaster recovery
• Creating sustainable food security

Join this critical initiative.

#EmergencyRelief #AfarRecovery #LivestockAid`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "width=600,height=400");
    setShowShareMenu(false);
  };

  const shareViaTelegram = () => {
    const text = `🆘 Humanitarian Crisis Response: "${campaign?.title}"

📍 Ethiopia's Afar Region
👨‍👩‍👧‍👦 2,131 Families Impacted
🐐 3 Goats per Household
🎯 Restoring Nutrition & Livelihoods

This initiative provides critical support to families affected by recent disasters, offering both immediate relief and sustainable recovery through livestock distribution.

Join this vital humanitarian effort.`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "width=600,height=400");
    setShowShareMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showShareMenu && !event.target.closest(".share-menu-container")) {
        setShowShareMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showShareMenu]);

  useEffect(() => {
    if (campaign?.detail) {
      const goalAmount = campaign.detail.goalAmount || 0;
      const raisedAmount = campaign.detail.raisedAmount || 0;
      const remainingAmount = Math.max(0, goalAmount - raisedAmount);

      let remainingGoatsCount = 0;
      if (goatTypes.length > 0) {
        const cheapestGoatPrice = Math.min(
          ...goatTypes.map(
            (goat) => goat.prices[campaign.detail.currency] || goat.prices.USD
          )
        );
        remainingGoatsCount = Math.ceil(remainingAmount / cheapestGoatPrice);
      } else {
        const averageGoatPrice = 5000;
        remainingGoatsCount = Math.ceil(remainingAmount / averageGoatPrice);
      }

      setRemainingGoats(remainingGoatsCount);
    }
  }, [campaign, goatTypes]);

  const DonorBadge = ({ badgeType }) => {
    const badges = {
      top: {
        icon: FaCrown,
        color: "text-yellow-500",
        bg: "bg-yellow-50",
        label: "Top Donor",
      },
      recurring: {
        icon: FaMedal,
        color: "text-blue-500",
        bg: "bg-blue-50",
        label: "Regular Supporter",
      },
      generous: {
        icon: FaHeart,
        color: "text-red-500",
        bg: "bg-red-50",
        label: "Generous Heart",
      },
      major: {
        icon: FaFire,
        color: "text-orange-500",
        bg: "bg-orange-50",
        label: "Major Donor",
      },
      supporter: {
        icon: FaUsers,
        color: "text-green-500",
        bg: "bg-green-50",
        label: "Campaign Supporter",
      },
    };

    const badge = badges[badgeType];
    if (!badge) return null;

    const IconComponent = badge.icon;

    return (
      <span
        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.color}`}
      >
        <IconComponent className="h-3 w-3" />
        <span>{badge.label}</span>
      </span>
    );
  };

  const DonationItem = ({ donation, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-transparent hover:border-green-100 group"
    >
      {/* Donor Avatar */}
      <div className="flex-shrink-0 relative">
        {donation.anonymous ? (
          <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-sm">
            <FaUserCircle className="h-6 w-6 text-white" />
          </div>
        ) : (
          <div className="relative">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                donation.donorName
              )}&background=10b981&color=fff&bold=true&size=128`}
              alt={donation.donorName}
              className="w-12 h-12 rounded-full shadow-sm ring-2 ring-white"
            />
            {donation.isTopDonor && (
              <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1 shadow-lg">
                <FaCrown className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Donation Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <p className="font-semibold text-gray-900 truncate">
              {donation.anonymous ? "Anonymous" : donation.donorName}
            </p>
            {donation.donorBadge && (
              <DonorBadge badgeType={donation.donorBadge} />
            )}
          </div>
          <div className="text-right flex-shrink-0 ml-2">
            <p className="text-lg font-bold text-green-600">
              {formatAmount(donation.amount, donation.currency)}
            </p>
            {donation.goatsDonated > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                🐐 {donation.goatsDonated} goat
                {donation.goatsDonated > 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        {donation.message && (
          <div className="bg-blue-50 rounded-lg p-3 mb-2 group-hover:bg-blue-100 transition-colors">
            <p className="text-sm text-gray-700 leading-relaxed">
              "{donation.message}"
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            {getTimeAgo(donation.timestamp)}
          </p>
          {index === 0 && (
            <span className="inline-flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              <FaFire className="h-3 w-3" />
              <span>Most Recent</span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );

  const DonationsSummary = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Community Impact</h3>
        <div className="bg-white bg-opacity-20 rounded-full p-2">
          <FaUsers className="h-5 w-5" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-2xl font-bold">{recentDonations.length}</p>
          <p className="text-green-100 text-sm">Supporters</p>
        </div>
        <div>
          <p className="text-2xl font-bold">
            {recentDonations.reduce(
              (sum, donation) => sum + donation.goatsDonated,
              0
            )}
          </p>
          <p className="text-green-100 text-sm">Goats Donated</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-green-400">
        <div className="flex items-center justify-between text-sm">
          <span>Total Raised</span>
          <span className="font-bold text-lg">
            {formatAmount(
              recentDonations.reduce(
                (sum, donation) => sum + donation.amount,
                0
              ),
              "ETB"
            )}
          </span>
        </div>
      </div>
    </motion.div>
  );

  const donationsToShow = showAllDonations
    ? recentDonations
    : recentDonations.slice(0, 3);

  if (loading || !campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{t("common.loading")}</p>
      </div>
    );
  }

  const progressPercentage =
    (campaign.detail.raisedAmount / campaign.detail.goalAmount) * 100;
  const totalAmount = calculateTotal();
  const totalGoats = Object.values(selectedGoats).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              to="/campaigns"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <FaArrowLeft className="h-4 w-4" />
              <span>Back to Campaigns</span>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Campaign Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <img
                  src={
                    campaign.detail.image ||
                    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop"
                  }
                  alt={campaign.title}
                  className="w-full h-64 md:h-96 object-cover rounded-xl"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {campaign.status}
                  </span>
                </div>
              </motion.div>

              {/* Campaign Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {campaign.title}
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {campaign.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center space-x-3">
                    <FaMapMarkerAlt className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold text-gray-900">
                        {campaign.detail.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaUsers className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Beneficiaries</p>
                      <p className="font-semibold text-gray-900">
                        {campaign.detail.beneficiaries} families
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(campaign.detail.endDate).toDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 share-menu-container relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <FaShare className="h-4 w-4" />
                    <span>Share</span>
                  </button>

                  {/* Share Dropdown Menu */}
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                    >
                      <div className="p-3">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">
                          Share this campaign
                        </h3>

                        {/* Copy Link */}
                        <button
                          onClick={copyToClipboard}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors mb-2"
                        >
                          {copied ? (
                            <FaCheck className="h-4 w-4 text-green-600" />
                          ) : (
                            <FaCopy className="h-4 w-4 text-gray-500" />
                          )}
                          <span>{copied ? "Copied!" : "Copy link"}</span>
                        </button>

                        <div className="border-t border-gray-200 my-2"></div>

                        {/* Social Media Options */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={shareOnFacebook}
                            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            <span className="w-5 h-5 bg-blue-600 text-white rounded flex items-center justify-center text-xs font-bold">
                              f
                            </span>
                            <span>Facebook</span>
                          </button>

                          <button
                            onClick={shareOnTwitter}
                            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            <span className="w-5 h-5 bg-blue-400 text-white rounded flex items-center justify-center text-xs font-bold">
                              𝕏
                            </span>
                            <span>Twitter</span>
                          </button>

                          <button
                            onClick={shareOnLinkedIn}
                            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            <span className="w-5 h-5 bg-blue-700 text-white rounded flex items-center justify-center text-xs font-bold">
                              in
                            </span>
                            <span>LinkedIn</span>
                          </button>

                          <button
                            onClick={shareViaWhatsApp}
                            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-green-50 rounded-md transition-colors"
                          >
                            <span className="w-5 h-5 bg-green-500 text-white rounded flex items-center justify-center text-xs"></span>
                            <span>WhatsApp</span>
                          </button>

                          <button
                            onClick={shareViaTelegram}
                            className="flex items-center space-x-2 px-2 py-3 text-sm text-gray-700 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            <span className="w-5 h-5 bg-blue-500 text-white rounded flex items-center justify-center text-xs font-bold">
                              T
                            </span>
                            <span className="text-xs">Telegram</span>
                          </button>

                          {/* Email */}
                          <button
                            onClick={shareViaEmail}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors mt-2"
                          >
                            <span className="w-5 h-5 bg-gray-600 text-white rounded flex items-center justify-center text-xs">
                              @
                            </span>
                            <span>Email</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Supporters ({recentDonations.length})
                    </h2>
                    <div className="flex items-center space-x-2 text-green-600">
                      <FaFire className="h-5 w-5" />
                      <span className="font-semibold">Live Updates</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">
                    Join these amazing supporters making a difference
                  </p>
                </div>

                {donationsLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                ) : (
                  <>
                    {/* Donations Summary */}
                    <div className="px-6 pt-4">
                      <DonationsSummary />
                    </div>

                    {/* Donations List */}
                    <div className="divide-y divide-gray-100">
                      <AnimatePresence>
                        {donationsToShow.map((donation, index) => (
                          <DonationItem
                            key={donation.id}
                            donation={donation}
                            index={index}
                          />
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Show More/Less Button */}
                    {recentDonations.length > 3 && (
                      <div className="p-6 border-t border-gray-100 bg-gray-50">
                        <button
                          onClick={() => setShowAllDonations(!showAllDonations)}
                          className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                        >
                          <span>
                            {showAllDonations
                              ? "Show Less"
                              : `Show All ${recentDonations.length} Supporters`}
                          </span>
                        </button>
                      </div>
                    )}

                    {/* Empty State */}
                    {recentDonations.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaUsers className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No donations yet
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Be the first to support this important cause!
                        </p>
                      </div>
                    )}
                  </>
                )}
              </motion.div>

              {/* Long Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About This Campaign
                </h2>
                <div className="prose prose-gray max-w-none">
                  {campaign.detail.longDescription
                    .split("\n\n")
                    .map((paragraph, idx) => (
                      <p
                        key={idx}
                        className="text-gray-600 leading-relaxed mb-4"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>
              </motion.div>

              {/* Updates */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Campaign Updates
                </h2>
                <div className="space-y-4">
                  {campaign.updates.map((update) => (
                    <div
                      key={update.id}
                      className="border-l-4 border-green-600 pl-4"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <FaCheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-500">
                          {new Date(update.date).toDateString()}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {update.title}
                      </h3>
                      <p className="text-gray-600">{update.content}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Goat Donation Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white p-6 rounded-xl shadow-lg sticky top-24"
              >
                <div className="text-center mb-6">
                  <motion.div
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <FaPaw className="h-8 w-8 text-green-600" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {t("donation.donateGoats")}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t("donation.selectGoats")}
                  </p>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <ProgressCard
                    campaign={campaign}
                    formatAmount={formatAmount}
                  />
                </div>

                {/* Goat Selection */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    {t("donation.selectGoatsToDonate")}
                  </h4>
                  {goatTypes.map((goatType, index) => (
                    <motion.div
                      key={goatType.id}
                      className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 mb-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 text-sm">
                            {goatType.name}
                          </h5>
                          <p className="text-xs text-gray-600">
                            {goatType.age}
                          </p>
                        </div>
                        <div className="text-right ml-3 text-lg font-bold text-green-600">
                          {formatAmount(
                            goatType.prices[campaign.detail.currency] ||
                              goatType.prices.USD,
                            campaign.detail.currency
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() =>
                              handleGoatSelection(
                                goatType.id,
                                Math.max(
                                  0,
                                  (selectedGoats[goatType.id] || 0) - 1
                                )
                              )
                            }
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors text-gray-600 font-bold"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {selectedGoats[goatType.id] || 0}
                          </span>
                          <button
                            onClick={() =>
                              handleGoatSelection(
                                goatType.id,
                                (selectedGoats[goatType.id] || 0) + 1
                              )
                            }
                            className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors font-bold"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-xs text-gray-500">
                          {selectedGoats[goatType.id] || 0}{" "}
                          {t("donation.goats")}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Total Summary */}
                {totalGoats > 0 && (
                  <motion.div
                    className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {t("donation.totalGoatsSelected")}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {totalGoats} {t("donation.goats")}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">
                          {formatAmount(totalAmount, campaign.detail.currency)}
                        </div>
                        <p className="text-xs text-gray-600">
                          {t("donation.totalAmount")}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <Link
                  to={
                    totalGoats > 0
                      ? `/donate?campaign=${
                          campaign.title
                        }&goats=${encodeURIComponent(
                          JSON.stringify(selectedGoats)
                        )}`
                      : "#"
                  }
                  state={
                    totalGoats > 0
                      ? { id: campaign.id, goats: selectedGoats }
                      : {}
                  }
                  onClick={(e) => {
                    if (totalGoats <= 0) {
                      e.preventDefault();
                    }
                  }}
                  className={`w-full py-3 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2 mb-4 ${
                    totalGoats > 0
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <FaHeart className="h-4 w-4" />
                  <span>{t("nav.donate")}</span>
                </Link>

                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">
                    <FaPaw className="inline h-3 w-3 mr-1" />
                    {t("donation.secureTransaction")}
                  </p>
                  <p className="text-xs text-gray-400">
                    {t("donation.impactMessage", { count: totalGoats })}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CampaignDetail;
