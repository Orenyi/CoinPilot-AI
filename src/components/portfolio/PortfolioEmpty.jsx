import React from "react";
import { FiBriefcase, FiPlus } from "react-icons/fi";

const PortfolioEmpty = ({ onAddAsset }) => {
  return (
    <section
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-dashed
        border-[var(--app-border)]
        bg-[var(--app-card)]
        px-6
        py-16
        text-center
        sm:px-10
        sm:py-20
      "
    >
      {/* Icon */}

      <div
        className="
          relative
          flex
          h-24
          w-24
          items-center
          justify-center
          rounded-full
          bg-gradient-to-br
          from-[#2563eb]/10
          via-[#7c3aed]/10
          to-[#9333ea]/10
        "
      >
        <div
          className="
            absolute
            inset-0
            rounded-full
            bg-gradient-to-br
            from-[#2563eb]/20
            via-[#7c3aed]/10
            to-[#9333ea]/20
            blur-xl
          "
        />

        <FiBriefcase
          size={40}
          className="relative text-[var(--color-primary-2)]"
        />
      </div>

      {/* Heading */}

      <h2 className="mt-8 text-2xl font-bold text-[var(--app-text)] sm:text-3xl">
        Your portfolio is empty
      </h2>

      {/* Description */}

      <p
        className="
          mt-4
          max-w-xl
          text-[15px]
          leading-7
          text-[var(--app-muted)]
          sm:text-base
        "
      >
        Start building your crypto portfolio by adding your first asset.
        CoinPilot AI will automatically calculate your portfolio value, profit &
        loss, allocation, and performance insights in real time.
      </p>

      {/* CTA */}

      <button
        onClick={onAddAsset}
        className="
          mt-8
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-gradient-to-r
          from-[#2563eb]
          via-[#7c3aed]
          to-[#9333ea]
          px-7
          py-3.5
          font-semibold
          text-white
          shadow-[0_0_28px_rgba(124,58,237,0.25)]
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:shadow-[0_0_35px_rgba(124,58,237,0.35)]
        "
      >
        <FiPlus size={18} />
        Add Your First Asset
      </button>

      {/* Features */}

      <div
        className="
          mt-10
          grid
          w-full
          max-w-3xl
          gap-4
          text-left
          sm:grid-cols-2
          xl:grid-cols-3
        "
      >
        {[
          "Track your total portfolio value",
          "Monitor profit & loss in real time",
          "Get AI-powered portfolio insights",
        ].map((item) => (
          <div
            key={item}
            className="
              rounded-2xl
              border
              border-[var(--app-border)]
              bg-[var(--app-bg)]
              p-5
            "
          >
            <div className="mb-3 h-2 w-2 rounded-full bg-[var(--color-primary-2)]" />

            <p className="text-sm leading-6 text-[var(--app-soft)]">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PortfolioEmpty;
