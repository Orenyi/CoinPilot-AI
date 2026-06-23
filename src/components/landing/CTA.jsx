import React from "react";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";

const CTA = () => {
  return (
    <section className="relative overflow-hidden bg-[var(--app-bg)] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[var(--container-width)]">
        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-[var(--app-border)]
            bg-gradient-to-r
            from-[#2563eb]
            via-[#7c3aed]
            to-[#9333ea]
            p-6
            shadow-[0_0_60px_rgba(124,58,237,0.18)]
            sm:p-8
            lg:p-10
          "
        >
          {/* Background Glow */}
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-black/10 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            {/* Left */}
            <div className="flex flex-col items-center gap-5 text-center lg:flex-row lg:text-left">
              <div
                className="
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  backdrop-blur-md
                "
              >
                <span className="text-4xl">🚀</span>
              </div>

              <div>
                <h2 className="[font-family:var(--font-heading)] text-3xl font-bold text-white">
                  Start tracking crypto with AI today.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                  Join thousands of traders using CoinPilot AI to make smarter
                  crypto decisions with real-time data, AI insights and
                  portfolio tracking.
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col items-center gap-4">
              <button
                className="
                  flex
                  items-center
                  gap-2
                  rounded-2xl
                  bg-white
                  px-8
                  py-4
                  font-semibold
                  text-[#7c3aed]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-xl
                "
              >
                Create Free Account
                <FiArrowRight />
              </button>

              <div className="flex items-center gap-2 text-sm text-white/80">
                <FiCheckCircle />
                No credit card required
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
