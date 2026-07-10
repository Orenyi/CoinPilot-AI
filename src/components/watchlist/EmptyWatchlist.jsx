import React from "react";
import { FiStar, FiPlus } from "react-icons/fi";

const EmptyWatchlist = ({ onAddCoin }) => {
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
        bg-[var(--app-surface)]
        px-6
        py-20
        text-center
      "
    >
      {/* Icon */}

      <div
        className="
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-full
          bg-gradient-to-br
          from-[#2563eb]/10
          via-[#7c3aed]/10
          to-[#9333ea]/10
        "
      >
        <FiStar size={36} className="text-[var(--color-primary-2)]" />
      </div>

      {/* Heading */}

      <h2 className="mt-8 text-2xl font-bold text-[var(--app-text)]">
        Your watchlist is empty
      </h2>

      {/* Description */}

      <p className="mt-3 max-w-md text-[15px] leading-7 text-[var(--app-muted)]">
        Start tracking your favorite cryptocurrencies by adding them to your
        watchlist. Stay updated with live prices and market movements.
      </p>

      {/* Button */}

      <button
        onClick={onAddCoin}
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
          px-6
          py-3
          font-semibold
          text-white
          transition-all
          duration-300
          hover:scale-[1.02]
          hover:shadow-xl
        "
      >
        <FiPlus size={18} />
        Add Your First Coin
      </button>
    </section>
  );
};

export default EmptyWatchlist;
