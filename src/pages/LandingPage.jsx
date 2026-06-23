import React from "react";
import Hero from "../components/landing/Hero";
import MarketPreview from "../components/landing/MarketPreview";
import Features from "../components/landing/Features";
import CTA from "../components/landing/CTA";
import HowItWorks from "../components/landing/HowItWorks";

const LandingPage = () => {
  return (
    <main>
      <Hero />
      <MarketPreview />
      <Features />
      <HowItWorks />
      <CTA />
    </main>
  );
};

export default LandingPage;
