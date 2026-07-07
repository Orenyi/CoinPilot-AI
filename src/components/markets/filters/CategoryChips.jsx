import React from "react";
import {
  FiCpu,
  FiLayers,
  FiShield,
  FiSmile,
  FiPlay,
  FiDatabase,
  FiBox,
  FiGlobe,
  FiHexagon,
} from "react-icons/fi";

const iconMap = {
  all: FiGlobe,
  "artificial-intelligence": FiCpu,
  "layer-1": FiLayers,
  "layer-2": FiLayers,
  "decentralized-finance-defi": FiShield,
  gaming: FiPlay,
  "meme-token": FiSmile,
  "real-world-assets-rwa": FiDatabase,
  stablecoins: FiBox,
  "centralized-exchange-token-cex": FiHexagon,
  exchange: FiHexagon,
  "non-fungible-tokens-nft": FiBox,
};

const CategoryChips = ({
  categories = [],
  activeCategory = "all",
  onChange,
}) => {
  const chips = [
    {
      id: "all",
      name: "All",
      icon: FiGlobe,
    },
    ...categories,
  ];

  return (
    <section
      className="hide-scrollbar
    flex
    gap-3
    overflow-x-auto
    whitespace-nowrap
    scroll-smooth"
    >
      <div className="flex min-w-max gap-3 lg:flex-wrap">
        {chips.map(({ id, name }) => {
          const Icon = iconMap[id] || FiGlobe;
          const active = activeCategory === id;

          return (
            <button
              key={id}
              onClick={() => onChange?.(id)}
              className={`
                flex
                items-center
                gap-2
                whitespace-nowrap
                rounded-full
                border
                px-4
                py-2.5
                text-sm
                font-medium
                transition-all
                duration-300
                ${
                  active
                    ? "border-transparent bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#9333ea] text-white shadow-lg"
                    : "border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-soft)] hover:border-[var(--color-primary-2)] hover:text-[var(--app-text)]"
                }
              `}
            >
              <Icon size={16} />
              {name}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryChips;
