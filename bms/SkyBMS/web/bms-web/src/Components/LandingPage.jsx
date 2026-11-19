import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import SmoothScroll from "smooth-scroll";
import "./Landing Page Components/Landing.css";
import JsonData from "./Landing Page Components/data/data.json";
import { Features } from "./Landing Page Components/features";
import { Header } from "./Landing Page Components/header";
import { Navigation } from "./Landing Page Components/navigation";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const LandingPage = () => {
  const { t } = useTranslation();
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <div>
      <Helmet>
        <title>SkyBMS - {t("title.index")}</title>
      </Helmet>
      <Navigation />
      <Header data={landingPageData.Header} />
      <Features data={landingPageData.Features} />
      {/* <About data={landingPageData.About} />
      <Services data={landingPageData.Services} />
      <Gallery data={landingPageData.Gallery} />
      <Testimonials data={landingPageData.Testimonials} />
      <Team data={landingPageData.Team} />
      <Contact data={landingPageData.Contact} /> */}
    </div>
  );
};

export default LandingPage;
