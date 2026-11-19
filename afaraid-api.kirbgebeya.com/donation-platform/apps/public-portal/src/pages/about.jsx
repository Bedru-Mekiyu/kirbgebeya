import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  FaHeart,
  FaUsers,
  FaShieldAlt,
  FaChartLine,
  FaHandHoldingHeart,
  FaGlobe,
  FaCheckCircle,
  FaArrowRight,
  FaPaw,
  FaStar,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FloatingElements } from "../components/Animations";

const About = () => {
  const values = [
    {
      icon: FaHeart,
      title: "Compassion",
      description:
        "We believe every family deserves dignity, hope, and the opportunity to build a better future.",
    },
    {
      icon: FaShieldAlt,
      title: "Transparency",
      description:
        "Every donation is tracked, every goat is accounted for, and every family's story is documented.",
    },
    {
      icon: FaUsers,
      title: "Community",
      description:
        "We work with local communities to ensure sustainable solutions that respect cultural values.",
    },
    {
      icon: FaChartLine,
      title: "Impact",
      description:
        "We measure success not just in numbers, but in transformed lives and thriving communities.",
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: "Campaign Creation",
      description:
        "We identify communities in need and create targeted campaigns with clear goals and timelines.",
    },
    {
      step: 2,
      title: "Family Verification",
      description:
        "Our field officers work with local leaders to identify and verify families who would benefit most.",
    },
    {
      step: 3,
      title: "Livestock Selection",
      description:
        "We carefully select healthy, productive goats from trusted local suppliers and breeders.",
    },
    {
      step: 4,
      title: "Distribution & Training",
      description:
        "Families receive their goats along with training on proper care, feeding, and breeding practices.",
    },
    {
      step: 5,
      title: "Ongoing Support",
      description:
        "We provide follow-up support and veterinary care to ensure the long-term success of each family.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Executive Director",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
      bio: "Sarah has over 15 years of experience in international development and sustainable agriculture.",
    },
    {
      name: "Ahmed Hassan",
      role: "Field Operations Manager",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      bio: "Ahmed leads our field operations and has helped distribute livestock to over 1,000 families.",
    },
    {
      name: "Maria Rodriguez",
      role: "Community Relations",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      bio: "Maria builds relationships with local communities and ensures cultural sensitivity in all our programs.",
    },
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Graphics */}
      <div className="fixed inset-0 pointer-events-none">
        <FloatingElements />
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-100 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-yellow-100 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-purple-100 rounded-full opacity-25 animate-bounce"></div>
      </div>

      <Header />
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20 relative overflow-hidden">
          {/* Background Graphics */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-20 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-30 animate-bounce"></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-25 animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-18 h-18 bg-yellow-200 rounded-full opacity-20 animate-bounce"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-8 shadow-lg"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <FaPaw className="h-12 w-12 text-white" />
                </motion.div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                  About
                  <span className="text-green-600 block">AfarAid</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                  We're a nonprofit organization dedicated to providing
                  sustainable livestock solutions to families affected by
                  natural disasters and economic hardship.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  To support affected families by providing three goats per
                  household, improving both immediate nutrition and long-term
                  livelihood opportunities. We believe that sustainable
                  livestock can transform lives and build resilient communities.
                </p>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Our initiative operates through targeted donation campaigns,
                  allowing donors to contribute toward specific relief efforts
                  while ensuring complete transparency and accountability in
                  every step of the process.
                </p>
                <Link
                  to="/campaigns"
                  className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <span>View Our Campaigns</span>
                  <FaArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <img
                  src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop"
                  alt="Goat farming family"
                  className="rounded-xl shadow-lg"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <FaHeart className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">1,250+</p>
                      <p className="text-sm text-gray-600">Families Helped</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Values
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These core values guide everything we do and shape how we
                approach our mission.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How We Work
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our systematic approach ensures that every donation reaches
                families who need it most, with complete transparency and
                accountability.
              </p>
            </div>

            <div className="space-y-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex flex-col ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } items-center gap-8`}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {step.step}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  <div className="flex-1">
                    <img
                      src={`https://images.unsplash.com/photo-${
                        1559827260 + index * 100000
                      }?w=500&h=300&fit=crop`}
                      alt={`Step ${step.step}`}
                      className="rounded-xl shadow-lg w-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our dedicated team works tirelessly to ensure that every
                donation makes the maximum impact.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center bg-white p-6 rounded-xl shadow-lg"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-green-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Impact
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Together, we've made a measurable difference in communities
                around the world.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center p-8 bg-green-50 rounded-xl"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">
                  1,250+
                </h3>
                <p className="text-lg text-gray-600 mb-2">Families Supported</p>
                <p className="text-sm text-gray-500">
                  Families have received sustainable livestock and are building
                  better futures.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center p-8 bg-blue-50 rounded-xl"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaHeart className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">
                  3,750+
                </h3>
                <p className="text-lg text-gray-600 mb-2">Goats Distributed</p>
                <p className="text-sm text-gray-500">
                  Healthy goats have been provided to families in need across
                  multiple regions.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center p-8 bg-purple-50 rounded-xl"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaGlobe className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">25+</h3>
                <p className="text-lg text-gray-600 mb-2">
                  Communities Reached
                </p>
                <p className="text-sm text-gray-500">
                  Different communities have benefited from our sustainable
                  livestock programs.
                </p>
              </motion.div>
            </div>

            <div className="text-center">
              <Link
                to="/donate"
                className="inline-flex items-center space-x-2 bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg"
              >
                <FaHandHoldingHeart className="h-5 w-5" />
                <span>Join Our Mission</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
