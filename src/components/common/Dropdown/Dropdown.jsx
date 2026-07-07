import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { FiCheck, FiChevronDown } from "react-icons/fi";

const Dropdown = ({ value, options = [], onChange, className = "" }) => {
  const selected = options.find((item) => item.value === value) || options[0];

  return (
    <div className={`relative w-60 ${className}`}>
      <Listbox value={value} onChange={onChange}>
        <Listbox.Button
          className="
            flex h-11 w-full items-center justify-between
            rounded-xl border border-[var(--app-border)]
            bg-[var(--app-surface)] px-4 text-sm font-medium
            text-[var(--app-text)] transition-all duration-200
            hover:border-[var(--color-primary-2)]
          "
        >
          <span>{selected?.label}</span>
          <FiChevronDown className="text-[var(--app-muted)]" />
        </Listbox.Button>

        <Transition
          as={Fragment}
          enter="transition duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Listbox.Options
            className="
              absolute right-0 z-50 mt-2 w-full
              rounded-2xl border border-[var(--app-border)]
              bg-[var(--app-surface)] p-2
              shadow-2xl backdrop-blur-xl
              focus:outline-none
            "
          >
            {options.map((option) => (
              <Listbox.Option key={option.value} value={option.value}>
                {({ active, selected }) => (
                  <div
                    className={`
                      flex cursor-pointer items-center justify-between
                      rounded-xl px-4 py-3 text-sm transition
                      ${active ? "bg-[var(--color-primary-2)]/15" : ""}
                    `}
                  >
                    <span
                      className={
                        selected
                          ? "font-semibold text-[var(--color-primary-2)]"
                          : "text-[var(--app-text)]"
                      }
                    >
                      {option.label}
                    </span>

                    {selected && (
                      <FiCheck className="text-[var(--color-primary-2)]" />
                    )}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
};

export default Dropdown;
