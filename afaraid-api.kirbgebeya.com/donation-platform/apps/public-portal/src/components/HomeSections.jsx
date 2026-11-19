import {
  FaHeart,
  FaShieldAlt,
  FaUsers,
  FaChartLine,
  FaHandHoldingHeart,
  FaGlobe,
  FaPaw,
  FaStar,
} from "react-icons/fa";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const steps = [
    {
      icon: FaHeart,
      title: "Choose Campaign",
      description:
        "Browse our active campaigns and select one that resonates with you.",
      color: "green",
    },
    {
      icon: FaHandHoldingHeart,
      title: "Make Donation",
      description:
        "Contribute any amount towards providing goats for affected families.",
      color: "blue",
    },
    {
      icon: FaUsers,
      title: "Family Selection",
      description:
        "Our field officers identify and verify families in need of support.",
      color: "purple",
    },
    {
      icon: FaShieldAlt,
      title: "Livestock Delivery",
      description:
        "Three goats are delivered to each verified family household.",
      color: "orange",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50 relative overflow-hidden">
      {/* Background Graphics */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-18 h-18 bg-yellow-200 rounded-full opacity-20 animate-bounce"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-6 shadow-lg"
          >
            <FaPaw className="h-10 w-10 text-white" />
          </motion.div>
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            How It Works
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Our transparent process ensures your donations reach families who
            need them most, with full tracking and verification at every step.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              className="text-center group"
            >
              <motion.div
                className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-${step.color}-100 to-${step.color}-200 mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <step.icon className={`h-10 w-10 text-${step.color}-600`} />
              </motion.div>
              <motion.h3
                className="text-xl font-bold text-gray-900 mb-3"
                whileHover={{ scale: 1.05 }}
              >
                {step.title}
              </motion.h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>

              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-green-200 to-blue-200 transform translate-x-4"></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ImpactStats = () => {
  const stats = [
    {
      icon: FaUsers,
      title: "Families Supported",
      value: "1,250+",
      description: "Households receiving sustainable livestock",
    },
    {
      icon: FaChartLine,
      title: "Success Rate",
      value: "98%",
      description: "Families successfully maintaining livestock",
    },
    {
      icon: FaGlobe,
      title: "Communities",
      value: "25+",
      description: "Different regions across the country",
    },
    {
      icon: FaHeart,
      title: "Donors",
      value: "500+",
      description: "Generous supporters making a difference",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white to-blue-50 relative overflow-hidden">
      {/* Background Graphics */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-40 w-24 h-24 bg-green-100 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-40 left-40 w-28 h-28 bg-purple-100 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-36 h-36 bg-yellow-100 rounded-full opacity-15 animate-bounce"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-6 shadow-lg"
          >
            <FaChartLine className="h-10 w-10 text-white" />
          </motion.div>
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our Impact
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Together, we're making a measurable difference in the lives of
            families affected by natural disasters and economic hardship.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-50"></div>

              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl mb-6 shadow-lg relative z-10"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <stat.icon className="h-8 w-8 text-green-600" />
              </motion.div>

              <motion.h3
                className="text-4xl font-bold text-gray-900 mb-3 relative z-10"
                whileHover={{ scale: 1.05 }}
              >
                {stat.value}
              </motion.h3>
              <h4 className="text-lg font-bold text-gray-700 mb-3 relative z-10">
                {stat.title}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed relative z-10">
                {stat.description}
              </p>

              {/* Floating Sparkles */}
              <div className="absolute top-4 right-4 opacity-20">
                <FaPaw className="h-4 w-4 text-yellow-500 animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Donor",
      content:
        "I've been donating to AfarAid for two years. The transparency and impact reports make me confident that my contributions are making a real difference.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    },
    {
      name: "Maria Rodriguez",
      role: "Field Officer",
      content:
        "Seeing families receive their goats and watching them build sustainable livelihoods is incredibly rewarding. This program truly transforms lives.",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
    {
      name: "Ahmed Hassan",
      role: "Beneficiary",
      content:
        "The three goats we received have provided milk for our children and income through breeding. We're now self-sufficient and grateful for this opportunity.",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50 relative overflow-hidden">
      {/* Background Graphics */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-24 h-24 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-30 right-30 w-20 h-20 bg-blue-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-30 left-30 w-28 h-28 bg-purple-200 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-22 h-22 bg-yellow-200 rounded-full opacity-20 animate-bounce"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full mb-6 shadow-lg"
          >
            <FaStar className="h-10 w-10 text-white" />
          </motion.div>
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            What People Say
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Hear from donors, field officers, and beneficiaries about the impact
            of our goat donation program.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-30"></div>

              <div className="flex items-center mb-6 relative z-10">
                <motion.img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mr-4 shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600 font-medium">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <div className="relative z-10">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="h-4 w-4 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>

              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10">
                <FaHeart className="h-8 w-8 text-green-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { HowItWorks, ImpactStats, Testimonials };
