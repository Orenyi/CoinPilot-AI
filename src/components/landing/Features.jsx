import React from "react";
import {
  FiTrendingUp,
  FiMessageCircle,
  FiStar,
  FiPieChart,
  FiBarChart2,
  FiFileText,
} from "react-icons/fi";

import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: <FiTrendingUp />,
    title: "Live Market Prices",
    description: "Get real-time prices, charts and market updates instantly.",
    color: "#2563eb",
  },
  {
    icon: <FiMessageCircle />,
    title: "AI Crypto Assistant",
    description:
      "Ask anything about crypto and receive smart AI-powered answers.",
    color: "#7c3aed",
  },
  {
    icon: <FiStar />,
    title: "Watchlist",
    description: "Track your favorite coins and receive instant market alerts.",
    color: "#10b981",
  },
  {
    icon: <FiPieChart />,
    title: "Portfolio Tracker",
    description: "Monitor holdings, profit and performance in real-time.",
    color: "#ef4444",
  },
  {
    icon: <FiBarChart2 />,
    title: "Advanced Charts",
    description: "Analyze market movements using interactive trading charts.",
    color: "#22d3ee",
  },
  {
    icon: <FiFileText />,
    title: "Crypto News",
    description: "Stay updated with the latest crypto news and AI insights.",
    color: "#8b5cf6",
  },
];

const Features = () => {
  return (
    <section className="relative overflow-hidden bg-[var(--app-bg)] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-[var(--color-primary-2)]/5 blur-[150px]" />

      <div className="relative mx-auto max-w-[var(--container-width)]">
        <div className="mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-primary-2)]">
            Features
          </p>

          <h2 className="[font-family:var(--font-heading)] text-3xl font-bold text-[var(--app-text)] sm:text-4xl">
            Powerful features for every crypto user
          </h2>
        </div>

        {/* Mobile */}
        <div className="grid gap-4 sm:hidden">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        {/* Tablet */}
        <div className="hidden grid-cols-2 gap-5 sm:grid lg:hidden">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        {/* Desktop */}
        <div className="hidden gap-6 lg:grid lg:grid-cols-3 ">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
