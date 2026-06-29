import React from "react";

const tabs = ["All", "Top Gainers", "Top Losers"];

const TableTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`
            rounded-xl
            px-4
            py-2
            text-sm
            font-medium
            transition-all
            duration-300
            ${
              activeTab === tab
                ? "bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#9333ea] text-white shadow-[0_8px_24px_rgba(124,58,237,.25)]"
                : "border border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-soft)] hover:border-[var(--color-primary-2)] hover:text-[var(--app-text)]"
            }
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TableTabs;
