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
            bg-[var(--app-card)]
            p-8
            lg:p-12
          "
        >
          {/* Glow Effects */}
          <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-[var(--color-primary)]/10 blur-[120px]" />
          <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-[var(--color-primary-2)]/10 blur-[120px]" />

          <div className="relative text-center">
            <div className="mb-4 inline-flex rounded-full border border-[var(--app-border)] bg-[var(--app-bg)] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-2)]">
              Start Your Journey
            </div>

            <h2 className="[font-family:var(--font-heading)] mx-auto max-w-3xl text-3xl font-bold text-[var(--app-text)] sm:text-4xl lg:text-5xl">
              Trade smarter with AI-powered crypto insights
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--app-soft)] sm:text-lg">
              Track markets, manage your portfolio, discover opportunities, and
              get AI-powered analysis — all in one platform.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <button
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-gradient-to-r
                  from-[#2563eb]
                  via-[#7c3aed]
                  to-[#9333ea]
                  px-8
                  py-4
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_0_30px_rgba(124,58,237,0.35)]
                "
              >
                Create Free Account
                <FiArrowRight />
              </button>

              <button
                className="
                  rounded-2xl
                  border
                  border-[var(--app-border)]
                  px-8
                  py-4
                  font-semibold
                  text-[var(--app-text)]
                  transition-all
                  duration-300
                  hover:border-[var(--color-primary-2)]
                "
              >
                Explore Markets
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[var(--app-muted)]">
              <FiCheckCircle className="text-[var(--color-success)]" />
              No credit card required
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
