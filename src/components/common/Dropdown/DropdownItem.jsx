import React from "react";
import { Listbox } from "@headlessui/react";
import { FiCheck } from "react-icons/fi";

const DropdownItem = ({ option }) => {
  return (
    <Listbox.Option value={option.value}>
      {({ active, selected }) => (
        <div
          className={`
            flex
            cursor-pointer
            items-center
            justify-between
            rounded-xl
            px-4
            py-3
            text-sm
            transition-all
            duration-200
            ${
              active
                ? "bg-[var(--color-primary-2)]/10 text-[var(--color-primary-2)]"
                : "text-[var(--app-text)]"
            }
          `}
        >
          <span>{option.label}</span>

          {selected && <FiCheck className="text-[var(--color-primary-2)]" />}
        </div>
      )}
    </Listbox.Option>
  );
};

export default DropdownItem;
