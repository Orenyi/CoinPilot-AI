import React from "react";
import {
  FiSearch,
  FiTrendingUp,
  FiMessageSquare,
  FiStar,
} from "react-icons/fi";
import StepCard from "./StepCard";

const steps = [
  {
    step: "1",
    title: "Search any coin",
    description:
      "Find any cryptocurrency in seconds using our powerful search.",
    icon: <FiSearch />,
  },

  {
    step: "2",
    title: "View live market data",
    description: "Explore real-time prices, charts, and market metrics.",
    icon: <FiTrendingUp />,
  },

  {
    step: "3",
    title: "Ask AI for explanation",
    description:
      "Get AI-powered insights and explanations about market movements.",
    icon: <FiMessageSquare />,
  },

  {
    step: "4",
    title: "Save to watchlist",
    description:
      "Save your favorite coins and track them easily in your watchlist.",
    icon: <FiStar />,
  },
];

const HowItWorks = () => {
  return (
    <section className="relative overflow-hidden bg-[var(--app-bg)] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-[var(--color-primary-2)]/5 blur-[120px]" />

      <div className="relative mx-auto max-w-[var(--container-width)]">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-primary-2)]">
            Process
          </p>

          <h2 className="[font-family:var(--font-heading)] text-3xl font-bold text-[var(--app-text)] sm:text-4xl">
            How It Works
          </h2>
        </div>

        {/* Mobile */}
        <div className="space-y-4 lg:hidden">
          {steps.map((step) => (
            <StepCard key={step.step} {...step} mobile />
          ))}
        </div>

        {/* Desktop */}
        <div className="hidden grid-cols-4 gap-6  lg:grid">
          {steps.map((step) => (
            <StepCard key={step.step} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
