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

const categories = [
  {
    id: "all",
    label: "All",
    icon: FiGlobe,
  },
  {
    id: "ai",
    label: "AI",
    icon: FiCpu,
  },
  {
    id: "layer-1",
    label: "Layer 1",
    icon: FiLayers,
  },
  {
    id: "layer-2",
    label: "Layer 2",
    icon: FiLayers,
  },
  {
    id: "defi",
    label: "DeFi",
    icon: FiShield,
  },
  {
    id: "gaming",
    label: "Gaming",
    icon: FiPlay,
  },
  {
    id: "meme",
    label: "Meme",
    icon: FiSmile,
  },
  {
    id: "rwa",
    label: "RWA",
    icon: FiDatabase,
  },
  {
    id: "stablecoins",
    label: "Stablecoins",
    icon: FiBox,
  },
  {
    id: "exchange",
    label: "Exchange",
    icon: FiHexagon,
  },
  {
    id: "nft",
    label: "NFT",
    icon: FiBox,
  },
];

const CategoryChips = ({ activeCategory = "all", onChange }) => {
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
        {categories.map(({ id, label, icon: Icon }) => {
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
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryChips;
