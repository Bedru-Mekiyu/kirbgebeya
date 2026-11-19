import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaPaw, FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";

const ParticleEffect = ({ isActive, type = "hearts" }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 100,
        delay: i * 0.1,
        duration: 3 + Math.random() * 2,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const getParticleIcon = () => {
    switch (type) {
      case "hearts":
        return FaHeart;
      case "goats":
        return FaPaw;
      case "sparkles":
        return FaStar;
      case "stars":
        return FaStar;
      default:
        return FaHeart;
    }
  };

  const ParticleIcon = getParticleIcon();

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{
                x: particle.x,
                y: particle.y,
                opacity: 0,
                scale: 0,
                rotate: 0,
              }}
              animate={{
                y: -100,
                opacity: [0, 1, 1, 0],
                scale: [0, 1, 1.2, 0],
                rotate: 360,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: "easeOut",
              }}
              className="absolute text-green-500 text-2xl"
            >
              <ParticleIcon />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

const ConfettiEffect = ({ isActive }) => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (isActive) {
      const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];
      const newConfetti = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -50,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
        delay: i * 0.05,
        duration: 3 + Math.random() * 2,
      }));
      setConfetti(newConfetti);

      const timer = setTimeout(() => {
        setConfetti([]);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {confetti.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{
                x: piece.x,
                y: piece.y,
                opacity: 0,
                scale: 0,
                rotate: 0,
              }}
              animate={{
                y: window.innerHeight + 100,
                opacity: [0, 1, 1, 0],
                scale: [0, 1, 1, 0],
                rotate: 720,
                x: piece.x + (Math.random() - 0.5) * 200,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: piece.duration,
                delay: piece.delay,
                ease: "easeOut",
              }}
              className="absolute"
              style={{
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                borderRadius: "50%",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

const RippleEffect = ({ isActive, x, y }) => {
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    if (isActive && x && y) {
      const newRipple = {
        id: Date.now(),
        x,
        y,
        size: 0,
      };
      setRipples([newRipple]);

      const timer = setTimeout(() => {
        setRipples([]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isActive, x, y]);

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              initial={{
                x: ripple.x - 0,
                y: ripple.y - 0,
                scale: 0,
                opacity: 1,
              }}
              animate={{
                scale: 4,
                opacity: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1,
                ease: "easeOut",
              }}
              className="absolute w-4 h-4 border-2 border-green-500 rounded-full"
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

const FloatingElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-green-200 rounded-full opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

const LoadingSpinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} border-4 border-gray-200 border-t-green-600 rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};

const PulseEffect = ({ children, isActive = true }) => {
  return (
    <motion.div
      animate={
        isActive
          ? {
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 0 0 rgba(16, 185, 129, 0.4)",
                "0 0 0 10px rgba(16, 185, 129, 0)",
                "0 0 0 0 rgba(16, 185, 129, 0)",
              ],
            }
          : {}
      }
      transition={{ duration: 2, repeat: Infinity }}
    >
      {children}
    </motion.div>
  );
};

const ShimmerEffect = ({ children, isActive = true }) => {
  return (
    <motion.div
      className="relative overflow-hidden"
      animate={
        isActive
          ? {
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }
          : {}
      }
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      style={{
        background:
          "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
        backgroundSize: "200% 100%",
      }}
    >
      {children}
    </motion.div>
  );
};

export {
  ParticleEffect,
  ConfettiEffect,
  RippleEffect,
  FloatingElements,
  LoadingSpinner,
  PulseEffect,
  ShimmerEffect,
};
