import React from "react";
import Dropdown from "../../common/Dropdown/Dropdown";

const sortOptions = [
  { value: "market_cap_desc", label: "Market Cap ↓" },
  { value: "market_cap_asc", label: "Market Cap ↑" },
  { value: "price_desc", label: "Price ↓" },
  { value: "price_asc", label: "Price ↑" },
  { value: "change_desc", label: "24h Change ↓" },
  { value: "change_asc", label: "24h Change ↑" },
  { value: "volume_desc", label: "Volume ↓" },
  { value: "volume_asc", label: "Volume ↑" },
  { value: "name_asc", label: "Name (A-Z)" },
  { value: "name_desc", label: "Name (Z-A)" },
];

const SortDropdown = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm font-medium text-[var(--app-soft)] sm:block">
        Sort By
      </span>

      <Dropdown value={value} options={sortOptions} onChange={onChange} />
    </div>
  );
};

export default SortDropdown;
