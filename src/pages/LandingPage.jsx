import React from "react";
import Hero from "../components/landing/Hero";
import MarketPreview from "../components/landing/MarketPreview";
import Features from "../components/landing/Features";
import CTA from "../components/landing/CTA";
import HowItWorks from "../components/landing/HowItWorks";
import Footer from "../components/layout/Footer";

const LandingPage = () => {
  return (
    <main>
      <Hero />
      <MarketPreview />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
};

export default LandingPage;
