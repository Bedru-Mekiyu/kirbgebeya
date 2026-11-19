import {
  FaHeart,
  FaUsers,
  FaDollarSign,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import statsService from "../services/stats.Service";

const Counter = ({ end, duration = 2, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [end, duration]);

  const formatNumber = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <span>
      {suffix === "$" ? suffix : ""}
      {formatNumber(count)}
      {suffix === "$" ? "" : suffix}
    </span>
  );
};

const HeroSection = () => {
  const [stats, setStats] = useState([
    { icon: FaUsers, value: 0, label: "Families Supported", suffix: "" },
    { icon: FaDollarSign, value: 0, label: "Funds Raised", suffix: "M+" },
    { icon: FaCheckCircle, value: 0, label: "Goats Distributed", suffix: "" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await statsService.getStats();
        const data = response?.data || response;

        let fundsValue;
        let fundsSuffix;

        if (data.fundsRaised >= 1000000) {
          fundsValue = Number((data.fundsRaised / 1000000).toFixed(1));
          fundsSuffix = "M ETB";
        } else {
          fundsValue = data.fundsRaised;
          fundsSuffix = " ETB";
        }

        setStats([
          {
            icon: FaUsers,
            value: data.familiesSupported || 0,
            label: "Families Supported",
            suffix: "",
          },
          {
            icon: FaDollarSign,
            value: fundsValue,
            label: "Funds Raised",
            suffix: fundsSuffix,
          },
          {
            icon: FaCheckCircle,
            value: data.goatsDistributed || 0,
            label: "Goats Donated",
            suffix: "",
          },
        ]);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center text-center py-28 px-6 overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-green-50/80 to-amber-50/70 backdrop-blur-[1px]" />

      {/* Floating Graphics */}
      <motion.div
        className="absolute w-72 h-72 bg-green-300/20 rounded-full blur-3xl top-10 left-10"
        animate={{ y: [0, 25, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-64 h-64 bg-amber-300/20 rounded-full blur-3xl bottom-10 right-10"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Text Content */}
      <div className="relative z-10 max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-extrabold text-green-900 leading-tight mb-6 drop-shadow-sm"
        >
          Supporting Afar Families Through{" "}
          <span className="text-amber-600">Sustainable Livestock</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-lg md:text-xl text-green-900/90 leading-relaxed mb-10 max-w-2xl mx-auto"
        >
          Join our mission to provide <strong>three goats per household</strong>{" "}
          to <strong>2,131 families</strong> families in the Afar region —
          helping restore <em>nutrition, livelihood, and hope</em> after the
          recent disaster.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
        >
          <Link
            to="/donate"
            className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-xl text-lg font-semibold text-white flex items-center justify-center gap-2 shadow-md hover:shadow-xl transition-transform hover:scale-105"
          >
            <FaHeart className="animate-pulse" /> Donate Now
          </Link>

          <Link
            to="/campaigns"
            className="border-2 border-green-700 text-green-800 hover:bg-green-700 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 shadow-sm transition-transform hover:scale-105"
          >
            View Campaigns <FaArrowRight />
          </Link>
        </motion.div>
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-white/70 backdrop-blur-md border border-green-100 p-6 rounded-2xl shadow-md"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-200 text-green-800 mx-auto mb-3">
              <stat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-green-900">
              {stat.icon === FaDollarSign ? (
                <>
                  <Counter end={stat.value} />
                  {stat.suffix}
                </>
              ) : (
                <Counter end={stat.value} suffix={stat.suffix} />
              )}
            </h3>
            <p className="text-green-800/80">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default HeroSection;
