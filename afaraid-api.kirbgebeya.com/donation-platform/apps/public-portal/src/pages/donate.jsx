import { useState, useEffect } from "react";
import {
  FaHeart,
  FaCreditCard,
  FaShieldAlt,
  FaCheckCircle,
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaw,
  FaCoins,
  FaGift,
  FaStar,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCurrency } from "../contexts/CurrencyContext";
import { useLocalization } from "../contexts/LocalizationContext";
import { goatsService, donationsService, paymentService } from "../services";

const Donate = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const campaignId = location.state?.id;
  const presetAmount = searchParams.get("amount");
  const presetGoats = searchParams.get("goats");
  const [showIdentityPopup, setShowIdentityPopup] = useState(false);
  const [goatPricing, setGoatPricing] = useState({});

  const { currentCurrency, formatAmount, convertAmount } = useCurrency();
  const { t } = useLocalization();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    donationType: "goats",
    phoneNumber: "",
    goatSelection: {},
    totalAmount: presetAmount || "",
    paymentMethod: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    anonymous: false,
    newsletter: true,
    dedication: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGoatSelector, setShowGoatSelector] = useState(true);
  const [selectedGoats, setSelectedGoats] = useState({});
  const [particleAnimation, setParticleAnimation] = useState(false);
  const [goatTypes, setGoatTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [popupError, setPopupError] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleIdentitySubmit = async (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim().toUpperCase();

    if (!trimmed) {
      setPopupError(t("nav.emptyDonorId") || "Please enter a Donor ID");
      return;
    }

    if (!/^DON-[A-Z0-9]{6,8}$/.test(trimmed)) {
      setPopupError(
        t("nav.invalidFormat") || "Invalid format. Use: DON‑AB12CD"
      );
      return;
    }

    setPopupError(null);
    setIsChecking(true);

    try {
      await donationsService.validateDonorIdentity(trimmed);

      setShowIdentityPopup(false);
      setInputValue("");
      navigate(`/donor-dashboard/${trimmed}`);
    } catch (err) {
      setPopupError(
        t("nav.donorNotFound") ||
          "Donor ID not found. Please check and try again."
      );
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    const loadGoatTypes = async () => {
      setLoading(true);
      try {
        const response = await goatsService.getGoatTypesByCampaign(campaignId);
        setGoatTypes(response.types || []);
      } catch (error) {
        console.error("Failed to load goat types:", error);
        setGoatTypes([
          {
            id: "young",
            name: t("goatTypes.young"),
            age: t("goatTypes.youngAge"),
            description: t("goatTypes.youngDesc"),
            prices: { USD: 150, ETB: 4500 },
            impact: "Perfect for families starting their livestock journey",
          },
          {
            id: "adult",
            name: t("goatTypes.adult"),
            age: t("goatTypes.adultAge"),
            description: t("goatTypes.adultDesc"),
            prices: { USD: 200, ETB: 6000 },
            impact: "Ready for breeding and milk production",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadGoatTypes();
  }, [t]);

  useEffect(() => {
    if (presetGoats) {
      try {
        const parsedGoats = JSON.parse(decodeURIComponent(presetGoats));
        setSelectedGoats(parsedGoats);
      } catch (error) {
        console.error("Failed to parse preset goats:", error);
      }
    }
  }, [presetGoats]);

  useEffect(() => {
    const fetchGoatPricing = async () => {
      try {
        const pricing = await goatsService.getGoatPricing();
        setGoatPricing(pricing);
      } catch (error) {
        console.error("Failed to fetch goat pricing:", error);
        setGoatPricing({
          goatPrice: 50,
          currency: "USD",
        });
      }
    };

    fetchGoatPricing();
  }, []);

  useEffect(() => {
    const loadGoatTypes = async () => {
      setLoading(true);
      try {
        const response = await goatsService.getGoatTypesByCampaign(campaignId);
        setGoatTypes(response.types || []);
      } catch (error) {
        console.error("Failed to load goat types:", error);
        const defaultPrice = goatPricing.goatPrice || 50;
        setGoatTypes([
          {
            id: "goat",
            name: t("goatTypes.goat") || "Goat",
            age: t("goatTypes.goatAge") || "6 months - 3 years",
            description:
              t("goatTypes.goatDesc") ||
              "Healthy goat perfect for supporting families",
            prices: {
              USD: defaultPrice,
              ETB: Math.round(defaultPrice * 85), // Convert to ETB
              AED: Math.round(defaultPrice * 3.67), // Convert to AED
            },
            impact: "Provides sustainable livelihood for families",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadGoatTypes();
  }, [t, goatPricing]);

  const getCurrentGoatPrice = () => {
    if (goatTypes.length > 0) {
      const goatType = goatTypes[0];
      return goatType.prices[currentCurrency] || goatType.prices.USD;
    }
    return goatPricing.goatPrice || 50;
  };
  const donationAmounts = [25, 50, 100, 250, 500];

  const calculateTotal = () => {
    if (formData.donationType === "goats") {
      let total = 0;
      Object.entries(selectedGoats).forEach(([type, count]) => {
        const goatType = goatTypes.find((gt) => gt.id === type);
        if (goatType && count > 0) {
          const price = goatType.prices[currentCurrency] || goatType.prices.USD;
          total += price * count;
        }
      });
      return total;
    }
    return parseFloat(formData.totalAmount) || 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGoatSelection = (goatType, count) => {
    setSelectedGoats((prev) => ({
      ...prev,
      [goatType]: count,
    }));
    setFormData((prev) => ({
      ...prev,
      totalAmount: calculateTotal().toString(),
    }));
  };

  const handleAmountSelect = (amount) => {
    setFormData((prev) => ({
      ...prev,
      totalAmount: amount.toString(),
      donationType: "amount",
    }));
    setSelectedGoats({});
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setParticleAnimation(true);

    try {
      const donationPayload = {
        donor: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        donation: {
          campaignId: campaignId,
          donationType: formData.donationType,
          goatSelection: formData.donationType === "goats" ? selectedGoats : {},
          totalAmount: calculateTotal(),
          dedication: formData.dedication,
          anonymous: formData.anonymous,
          newsletter: formData.newsletter,
        },
        payment: {
          phoneNumber: formData.phoneNumber,
          method: formData.paymentMethod,
          provider: formData.paymentMethod,
          cardNumber: formData.cardNumber,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
          nameOnCard: formData.nameOnCard,
          status: "pending",
        },
      };

      const response = await donationsService.createDonation(donationPayload);
      if (!response || !response.success) {
        throw new Error(response?.message || "Failed to process donation");
      }

      setCurrentStep(4);

      setTimeout(() => {
        setParticleAnimation(false);
        window.open(response.payment.metadata.data.checkout_url, "_blank");
      }, 3000);
    } catch (error) {
      console.error("Donation submission failed:", error);
      alert(error.message || "Failed to complete donation. Please try again.");
      setParticleAnimation(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\s/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const formatExpiryDate = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(.{2})/, "$1/")
      .substring(0, 5);
  };

  const totalAmount = calculateTotal();

  const ParticleEffect = () => (
    <AnimatePresence>
      {particleAnimation && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 100,
                opacity: 1,
                scale: 0,
              }}
              animate={{
                y: -100,
                opacity: 0,
                scale: 1,
                rotate: 360,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 3,
                delay: i * 0.1,
                ease: "easeOut",
              }}
              className="absolute text-green-500 text-2xl"
            >
              <FaHeart />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ParticleEffect />
      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with advanced animation */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Link
              to="/campaigns"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-all duration-300 hover:scale-105 mb-4"
            >
              <motion.div
                animate={{ x: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FaArrowLeft className="h-4 w-4" />
              </motion.div>
              <span>Back to Campaigns</span>
            </Link>
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Make a <span className="text-gradient">Donation</span>
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Your contribution helps provide sustainable livestock to families
              in need
            </motion.p>
          </motion.div>

          {/* Progress Steps with advanced animation */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((step) => (
                <motion.div
                  key={step}
                  className="flex items-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 + step * 0.1 }}
                >
                  <motion.div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step
                        ? "bg-green-600 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                    animate={
                      currentStep >= step
                        ? {
                            scale: [1, 1.1, 1],
                            boxShadow: [
                              "0 0 0 0 rgba(16, 185, 129, 0.4)",
                              "0 0 0 10px rgba(16, 185, 129, 0)",
                              "0 0 0 0 rgba(16, 185, 129, 0)",
                            ],
                          }
                        : {}
                    }
                    transition={{ duration: 0.6 }}
                  >
                    {step}
                  </motion.div>
                  {step < 3 && (
                    <motion.div
                      className={`w-16 h-1 mx-2 ${
                        currentStep > step ? "bg-green-600" : "bg-gray-300"
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: currentStep > step ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center space-x-16 mt-2">
              <span className="text-sm text-gray-600">Selection</span>
              <span className="text-sm text-gray-600">Details</span>
              <span className="text-sm text-gray-600">Payment</span>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <motion.div
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {/* Step 1: Donation Selection */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-8"
                >
                  <motion.h2
                    className="text-2xl font-bold text-gray-900 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {t("donation.donateGoats")}
                  </motion.h2>

                  {/* Goat Selection Only */}
                  <div className="text-center mb-8">
                    <motion.div
                      className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <FaPaw className="h-10 w-10 text-green-600" />
                    </motion.div>
                    <p className="text-gray-600 mb-4">
                      {t("donation.selectGoats")}
                    </p>
                    <div className="text-sm text-green-600 font-medium">
                      {t("donation.startingAt")}{" "}
                      {formatAmount(
                        goatTypes.length > 0
                          ? Math.min(
                              ...goatTypes.map(
                                (gt) =>
                                  gt.prices[currentCurrency] || gt.prices.USD
                              )
                            )
                          : 150
                      )}{" "}
                      {t("donation.perGoat")}
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {t("donation.selectGoatsToDonate")}
                    </h3>

                    {/* Pre-selected goats indicator */}
                    {presetGoats &&
                      Object.values(selectedGoats).some(
                        (count) => count > 0
                      ) && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
                        >
                          <div className="flex items-center space-x-3">
                            <FaPaw className="h-5 w-5 text-blue-600" />
                            <div>
                              <h4 className="font-semibold text-blue-900 text-sm">
                                Pre-selected from Campaign
                              </h4>
                              <p className="text-xs text-blue-700">
                                {Object.entries(selectedGoats)
                                  .filter(([_, count]) => count > 0)
                                  .map(([type, count]) => {
                                    const goatType = goatTypes.find(
                                      (gt) => gt.id === type
                                    );
                                    return `${count} ${goatType?.name || type}`;
                                  })
                                  .join(", ")}{" "}
                                selected
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {goatTypes.map((goatType, index) => (
                        <motion.div
                          key={goatType.id}
                          className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200 hover:border-green-400 transition-all duration-300"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.5,
                            delay: 0.5 + index * 0.1,
                          }}
                          whileHover={{ scale: 1.02, y: -5 }}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-lg mb-2">
                                {goatType.name}
                              </h4>
                              <p className="text-sm text-gray-600 mb-1">
                                {goatType.age}
                              </p>
                              <p className="text-xs text-gray-500 mb-3">
                                {goatType.description}
                              </p>
                              <div className="bg-green-200 rounded-full px-3 py-1 inline-block">
                                <span className="text-xs font-medium text-green-800">
                                  {goatType.impact}
                                </span>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <div className="text-2xl font-bold text-green-600 mb-2">
                                {formatAmount(
                                  goatType.prices[currentCurrency] ||
                                    goatType.prices.USD
                                )}
                              </div>
                              <div className="flex items-center space-x-3">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleGoatSelection(
                                      goatType.id,
                                      Math.max(
                                        0,
                                        (selectedGoats[goatType.id] || 0) - 1
                                      )
                                    )
                                  }
                                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors text-gray-600 font-bold"
                                >
                                  -
                                </button>
                                <span className="w-12 text-center font-bold text-lg">
                                  {selectedGoats[goatType.id] || 0}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleGoatSelection(
                                      goatType.id,
                                      (selectedGoats[goatType.id] || 0) + 1
                                    )
                                  }
                                  className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors font-bold"
                                >
                                  +
                                </button>
                              </div>
                              <div className="text-xs text-gray-500 mt-2">
                                {selectedGoats[goatType.id] || 0}{" "}
                                {t("donation.goats")}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Total Calculation */}
                    <motion.div
                      className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {t("donation.totalGoatsSelected")}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {Object.values(selectedGoats).reduce(
                              (sum, count) => sum + count,
                              0
                            )}{" "}
                            {t("donation.goats")}
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            Target: 6,393 goats for 2,131 families in Afar
                            region
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {formatAmount(totalAmount)}
                          </div>
                          <p className="text-sm text-gray-600">
                            {t("donation.totalAmount")}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Dedication Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mb-6"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("donation.dedicationMessage")}
                    </label>
                    <textarea
                      name="dedication"
                      value={formData.dedication}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder={t("donation.dedicationPlaceholder")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    />
                  </motion.div>

                  <div className="flex items-center space-x-2 mb-6">
                    <input
                      type="checkbox"
                      id="anonymous"
                      name="anonymous"
                      checked={formData.anonymous}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="anonymous"
                      className="text-sm text-gray-700"
                    >
                      {t("donation.anonymousDonation")}
                    </label>
                  </div>

                  <motion.button
                    type="button"
                    onClick={handleNext}
                    disabled={!totalAmount}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    Continue
                  </motion.button>
                </motion.div>
              )}

              {/* Step 2: Personal Details */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-8"
                >
                  <motion.h2
                    className="text-2xl font-bold text-gray-900 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {t("donation.yourInformation")}
                  </motion.h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("donation.firstName")} *
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("donation.lastName")} *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      />
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("donation.email")} *
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("donation.phone")}
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="mb-6"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.9 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.0 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.1 }}
                    className="flex items-center space-x-2 mb-6"
                  >
                    <input
                      type="checkbox"
                      id="newsletter"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="newsletter"
                      className="text-sm text-gray-700"
                    >
                      {t("donation.newsletter")}
                    </label>
                  </motion.div>

                  <div className="flex space-x-4">
                    <motion.button
                      type="button"
                      onClick={handlePrevious}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.2 }}
                    >
                      Previous
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.3 }}
                    >
                      Continue
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-8"
                >
                  <motion.h2
                    className="text-2xl font-bold text-gray-900 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    Payment Information
                  </motion.h2>

                  {/* Payment Method Selection */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="mb-8"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Select Payment Method *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Credit Card */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                          formData.paymentMethod === "card"
                            ? "border-green-500 bg-green-50 shadow-md"
                            : "border-gray-300 bg-white hover:border-green-300"
                        }`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            paymentMethod: "card",
                          }))
                        }
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              formData.paymentMethod === "card"
                                ? "border-green-500 bg-green-500"
                                : "border-gray-400"
                            }`}
                          >
                            {formData.paymentMethod === "card" && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-white rounded-full"
                              />
                            )}
                          </div>

                          <img
                            src="/credit-card-logo.png"
                            alt="Credit Card"
                            className="w-8 h-8 object-contain"
                          />

                          <span className="font-medium text-gray-900">
                            Credit Card
                          </span>
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                          formData.paymentMethod === "chapa"
                            ? "border-green-500 bg-green-50 shadow-md"
                            : "border-gray-300 bg-white hover:border-green-300"
                        }`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            paymentMethod: "chapa",
                          }))
                        }
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              formData.paymentMethod === "chapa"
                                ? "border-green-500 bg-green-500"
                                : "border-gray-400"
                            }`}
                          >
                            {formData.paymentMethod === "chapa" && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-white rounded-full"
                              />
                            )}
                          </div>

                          <img
                            src="/chapa_logo.png"
                            alt="Chapa"
                            className="w-10 h-10 rounded object-contain"
                          />

                          <span className="font-medium text-gray-900">
                            Chapa
                          </span>
                        </div>
                      </motion.div>

                      {/* Telebirr */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                          formData.paymentMethod === "telebirr"
                            ? "border-green-500 bg-green-50 shadow-md"
                            : "border-gray-300 bg-white hover:border-green-300"
                        }`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            paymentMethod: "telebirr",
                          }))
                        }
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              formData.paymentMethod === "telebirr"
                                ? "border-green-500 bg-green-500"
                                : "border-gray-400"
                            }`}
                          >
                            {formData.paymentMethod === "telebirr" && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-white rounded-full"
                              />
                            )}
                          </div>

                          <img
                            src="/TeleBirr-Logo.png"
                            alt="Telebirr"
                            className="w-10 h-10 rounded object-contain"
                          />

                          <span className="font-medium text-gray-900">
                            Telebirr
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Credit Card Form */}
                  {formData.paymentMethod === "card" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mb-6"
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <div className="relative">
                          <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                cardNumber: formatCardNumber(e.target.value),
                              }))
                            }
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                expiryDate: formatExpiryDate(e.target.value),
                              }))
                            }
                            placeholder="MM/YY"
                            maxLength="5"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        >
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            maxLength="4"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                          />
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="mb-6"
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name on Card *
                        </label>
                        <input
                          type="text"
                          name="nameOnCard"
                          value={formData.nameOnCard}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                        />
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Chapa Payment Method */}
                  {formData.paymentMethod === "chapa" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6"
                      >
                        <div className="flex items-center space-x-3 mb-4">
                          <img
                            src="/chapa_logo.png"
                            alt="Chapa"
                            className="w-12 h-12 rounded-lg object-contain"
                          />

                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              Pay with Chapa
                            </h3>
                            <p className="text-sm text-gray-600">
                              Secure mobile payment
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleInputChange}
                              placeholder="+251 9x xxx xxxx"
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            />
                          </div>

                          <div className="bg-purple-100 border border-purple-300 rounded-lg p-4">
                            <div className="flex items-center space-x-2 text-purple-800 mb-2">
                              <FaShieldAlt className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                How it works
                              </span>
                            </div>
                            <ul className="text-sm text-purple-700 space-y-1">
                              <li>
                                • Enter your phone number registered with Chapa
                              </li>
                              <li>• You'll receive a confirmation prompt</li>
                              <li>
                                • Confirm payment to complete your donation
                              </li>
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Telebirr Payment Method */}
                  {formData.paymentMethod === "telebirr" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6"
                      >
                        <div className="flex items-center space-x-3 mb-4">
                          <img
                            src="/TeleBirr-Logo.png"
                            alt="Telebirr"
                            className="w-12 h-12 rounded-lg object-contain"
                          />

                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              Pay with Telebirr
                            </h3>
                            <p className="text-sm text-gray-600">
                              Fast & secure Ethio Telecom payment
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Telebirr Phone Number *
                            </label>
                            <input
                              type="tel"
                              placeholder="+251 9x xxx xxxx"
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                            />
                          </div>

                          <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                            <div className="flex items-center space-x-2 text-green-800 mb-2">
                              <FaShieldAlt className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                How it works
                              </span>
                            </div>
                            <ul className="text-sm text-green-700 space-y-1">
                              <li>
                                • Enter your Telebirr registered phone number
                              </li>
                              <li>
                                • Open your Telebirr app to confirm payment
                              </li>
                              <li>• Authorize the transaction to complete</li>
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
                  >
                    <div className="flex items-center space-x-2 text-green-800">
                      <FaShieldAlt className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Secure Payment
                      </span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Your payment information is encrypted and secure. We never
                      store your card details.
                    </p>
                  </motion.div>

                  <div className="flex space-x-4">
                    <motion.button
                      type="button"
                      onClick={handlePrevious}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      Previous
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.9 }}
                    >
                      {isProcessing ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="rounded-full h-4 w-4 border-b-2 border-white"
                          />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <FaHeart className="h-4 w-4" />
                          <span>Complete Donation</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="p-8 text-center"
                >
                  <motion.div
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <FaCheckCircle className="h-10 w-10 text-green-600" />
                    </motion.div>
                  </motion.div>

                  <motion.h2
                    className="text-3xl font-bold text-gray-900 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    Thank You!
                  </motion.h2>

                  <motion.p
                    className="text-gray-600 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    Your donation of{" "}
                    <span className="font-semibold text-green-600">
                      {totalAmount} ETB
                    </span>{" "}
                    has been processed successfully. You will receive a
                    confirmation email shortly.
                  </motion.p>

                  {formData.donationType === "goats" && (
                    <motion.div
                      className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Your Goat Donation Summary
                      </h3>
                      <div className="space-y-2">
                        {Object.entries(selectedGoats).map(
                          ([type, count]) =>
                            count > 0 && (
                              <div
                                key={type}
                                className="flex justify-between text-sm"
                              >
                                <span>
                                  {goatTypes.find((gt) => gt.id === type)
                                    ?.name || type}{" "}
                                  x {count}
                                </span>
                                <span className="font-semibold">
                                  {formatAmount(getCurrentGoatPrice() * count)}
                                </span>
                              </div>
                            )
                        )}
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    {/* <button
                      onClick={() => setShowIdentityPopup(true)}
                      className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      View My Donations
                    </button> */}
                    <div>
                      <Link
                        to="/campaigns"
                        className="text-gray-600 hover:text-green-600 transition-colors"
                      >
                        Browse More Campaigns
                      </Link>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </form>
        </div>
        <AnimatePresence>
          {showIdentityPopup && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowIdentityPopup(false)}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full"
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t("nav.enterDonorId") || "Enter Your Donor ID"}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {t("nav.donorIdHelp") ||
                    "This is usually on your receipt or email."}
                </p>

                <form onSubmit={handleIdentitySubmit}>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g. DON-AB12CD"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    autoFocus
                    disabled={isChecking}
                  />

                  {popupError && (
                    <p className="mt-2 text-sm text-red-600">{popupError}</p>
                  )}

                  {isChecking && (
                    <p className="mt-2 text-sm text-gray-600 flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Checking Donor ID…
                    </p>
                  )}

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowIdentityPopup(false);
                        setInputValue("");
                        setPopupError(null);
                      }}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      disabled={isChecking}
                    >
                      {t("common.cancel") || "Cancel"}
                    </button>
                    <button
                      type="submit"
                      disabled={isChecking}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md disabled:opacity-70"
                    >
                      {isChecking
                        ? t("common.checking") || "Checking…"
                        : t("common.submit") || "Go to Dashboard"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default Donate;
