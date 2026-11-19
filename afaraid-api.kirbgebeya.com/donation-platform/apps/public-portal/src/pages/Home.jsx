import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import FeaturedCampaigns from "../components/FeaturedCampaigns";
import {
  HowItWorks,
  ImpactStats,
  Testimonials,
} from "../components/HomeSections";
import { FloatingElements, ParticleEffect } from "../components/Animations";
import { useState, useEffect } from "react";

const Home = () => {
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    setShowParticles(true);
    const timer = setTimeout(() => setShowParticles(false), 3000);
    return () => clearTimeout(timer);
  }, []);

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
        <HeroSection />
        <FeaturedCampaigns />
        <HowItWorks />
        <ImpactStats />
        <Testimonials />
      </main>
      <Footer />

      {/* Particle Effects */}
      {showParticles && (
        <ParticleEffect isActive={showParticles} type="hearts" />
      )}
    </div>
  );
};

export default Home;
