import React from "react";

const PortfolioTableHeader = ({
  SORT_FIELDS,
  sortField,
  onSort,
  renderSortIcon,
}) => {
  const columns = [
    {
      label: "Asset",
      field: SORT_FIELDS.NAME,
      align: "left",
    },
    {
      label: "Holdings",
      field: SORT_FIELDS.HOLDINGS,
      align: "right",
    },
    {
      label: "Price",
      field: SORT_FIELDS.PRICE,
      align: "right",
    },
    {
      label: "Value",
      field: SORT_FIELDS.VALUE,
      align: "right",
    },
    {
      label: "Profit / Loss",
      field: SORT_FIELDS.PNL,
      align: "right",
    },
    {
      label: "24H",
      field: SORT_FIELDS.CHANGE,
      align: "right",
    },
    {
      label: "Allocation",
      field: SORT_FIELDS.ALLOCATION,
      align: "right",
    },
  ];

  return (
    <thead
      className="
        border-b
        border-[var(--app-border)]
        bg-[var(--app-bg)]
      "
    >
      <tr>
        {columns.map((column) => {
          const active = sortField === column.field;

          return (
            <th
              key={column.field}
              className={`
                px-6
                py-5
                text-xs
                font-semibold
                uppercase
                tracking-[0.12em]
                ${column.align === "right" ? "text-right" : "text-left"}
              `}
            >
              <button
                type="button"
                onClick={() => onSort(column.field)}
                className={`
                  inline-flex
                  items-center
                  gap-2
                  transition-all
                  duration-300

                  ${column.align === "right" ? "ml-auto" : ""}

                  ${
                    active
                      ? "text-[var(--color-primary-2)]"
                      : "text-[var(--app-muted)] hover:text-[var(--app-text)]"
                  }
                `}
              >
                <span>{column.label}</span>

                <span
                  className={`
                    transition-transform
                    duration-300
                    ${active ? "scale-100" : "scale-90 opacity-60"}
                  `}
                >
                  {renderSortIcon(column.field)}
                </span>
              </button>
            </th>
          );
        })}

        <th
          className="
            px-6
            py-5
            text-right
            text-xs
            font-semibold
            uppercase
            tracking-[0.12em]
            text-[var(--app-muted)]
          "
        >
          Actions
        </th>
      </tr>
    </thead>
  );
};

export default PortfolioTableHeader;
