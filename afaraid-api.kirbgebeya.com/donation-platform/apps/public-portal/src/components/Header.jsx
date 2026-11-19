import { useState, useEffect } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaPaw,
  FaHandHoldingUsd,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import CurrencySelector from "./CurrencySelector";
import LanguageSelector from "./LanguageSelector";
import { useLocalization } from "../contexts/LocalizationContext";
import { donationsService } from "../services/donationsService";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showGoatAnimation, setShowGoatAnimation] = useState(false);
  const [showIdentityPopup, setShowIdentityPopup] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [popupError, setPopupError] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const location = useLocation();
  const { t } = useLocalization();
  const { donorIdentityNumber } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGoatAnimation(true);
      setTimeout(() => setShowGoatAnimation(false), 2000);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const navigation = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.campaigns"), href: "/campaigns" },
    { name: t("nav.about"), href: "/about" },
    { name: t("nav.contact"), href: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  const dashboardHref = donorIdentityNumber
    ? `/donor-dashboard/${donorIdentityNumber}`
    : "/donor-dashboard";

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

  return (
    <>
      <motion.header
        className={`bg-white/95 backdrop-blur-md sticky top-0 z-50 transition-all duration-500 ${
          isScrolled ? "shadow-2xl bg-white/98 backdrop-blur-lg" : ""
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Link to="/" className="flex items-center space-x-3">
                <motion.div
                  className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl relative shadow-lg"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <FaHandHoldingUsd className="h-7 w-7 text-white" />
                  <AnimatePresence>
                    {showGoatAnimation && (
                      <motion.div
                        className="absolute -top-1 -right-1"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{
                          scale: [0, 1, 1.2, 1],
                          rotate: [0, 360],
                          y: [0, -5, 0],
                        }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ duration: 1.5 }}
                      >
                        <FaPaw className="h-5 w-5 text-green-400" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <motion.span
                  className="text-2xl font-bold text-gray-900"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    background:
                      "linear-gradient(90deg, #111827, #10b981, #111827)",
                    backgroundSize: "200% 100%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  AfarAid
                </motion.span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    to={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 relative group ${
                      isActive(item.href)
                        ? "text-green-600 bg-green-50 shadow-sm"
                        : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="relative z-10">{item.name}</span>
                    {isActive(item.href) && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-green-100 to-green-50 rounded-lg"
                        layoutId="activeTab"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-100 to-green-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.05 }}
                    />
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-50 rounded-lg p-1">
                  <CurrencySelector />
                </div>
                <div className="bg-gray-50 rounded-lg p-1">
                  <LanguageSelector />
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={() => setShowIdentityPopup(true)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaUser className="h-4 w-4" />
                  </motion.div>
                  <span className="text-sm font-medium">
                    {t("nav.myDonations")}
                  </span>
                </button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/donate"
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl relative overflow-hidden"
                >
                  <motion.span
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative z-10"
                  >
                    {t("nav.donate")}
                  </motion.span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.1 }}
                  />
                </Link>
              </motion.div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-green-600 focus:outline-none focus:text-green-600 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaTimes className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaBars className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden"
              >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-md border-t border-gray-200 rounded-b-xl shadow-lg">
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        to={item.href}
                        className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                          isActive(item.href)
                            ? "text-green-600 bg-green-50 shadow-sm"
                            : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                  <motion.div
                    className="pt-4 space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <div className="flex items-center space-x-2 px-4 py-2">
                      <div className="flex-1">
                        <CurrencySelector />
                      </div>
                      <div className="flex-1">
                        <LanguageSelector />
                      </div>
                    </div>

                    {/* ← Mobile: open popup */}
                    <button
                      onClick={() => {
                        setShowIdentityPopup(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-3 text-gray-700 hover:text-green-600 transition-colors rounded-lg hover:bg-gray-50"
                    >
                      <FaUser className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {t("nav.myDonations")}
                      </span>
                    </button>

                    <Link
                      to="/donate"
                      className="block bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-colors font-semibold text-center mx-4 shadow-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("nav.donate")}
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

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
    </>
  );
};

export default Header;
