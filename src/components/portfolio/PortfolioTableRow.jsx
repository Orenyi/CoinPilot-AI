import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const PortfolioTableRow = ({
  asset,
  currency,
  formatCurrency,
  onEdit,
  onDelete,
}) => {
  const positivePnL = asset.profit_loss >= 0;
  const positive24h = asset.price_change_percentage_24h >= 0;

  return (
    <tr
      className="
        border-b
        border-[var(--app-border)]
        transition-all
        duration-300
        hover:bg-[var(--app-bg)]
      "
    >
      {/* Asset */}

      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <img
            src={asset.image}
            alt={asset.name}
            className="
              h-12
              w-12
              rounded-full
              ring-2
              ring-transparent
              transition-all
              duration-300
              group-hover:ring-[var(--color-primary-2)]/20
            "
          />

          <div>
            <h3 className="font-semibold text-[var(--app-text)]">
              {asset.name}
            </h3>

            <p className="mt-1 text-xs uppercase tracking-wide text-[var(--app-muted)]">
              {asset.symbol}
            </p>
          </div>
        </div>
      </td>

      {/* Holdings */}

      <td className="px-6 py-5 text-right">
        <p className="font-semibold text-[var(--app-text)]">
          {Number(asset.quantity).toLocaleString()}
        </p>
      </td>

      {/* Current Price */}

      <td className="px-6 py-5 text-right">
        <p className="font-medium text-[var(--app-text)]">
          {formatCurrency(asset.current_price, currency)}
        </p>
      </td>

      {/* Current Value */}

      <td className="px-6 py-5 text-right">
        <p className="font-bold text-[var(--app-text)]">
          {formatCurrency(asset.current_value, currency)}
        </p>
      </td>

      {/* Profit & Loss */}

      <td className="px-6 py-5 text-right">
        <p
          className={`font-bold ${
            positivePnL
              ? "text-[var(--color-success)]"
              : "text-[var(--color-danger)]"
          }`}
        >
          {positivePnL ? "+" : ""}
          {formatCurrency(asset.profit_loss, currency)}
        </p>

        <p
          className={`mt-1 text-xs font-medium ${
            positivePnL
              ? "text-[var(--color-success)]"
              : "text-[var(--color-danger)]"
          }`}
        >
          {positivePnL ? "+" : ""}
          {asset.profit_loss_percentage.toFixed(2)}%
        </p>
      </td>

      {/* 24h */}

      <td className="px-6 py-5 text-right">
        <span
          className={`
            inline-flex
            rounded-full
            px-3
            py-1.5
            text-xs
            font-semibold

            ${
              positive24h
                ? "bg-green-500/10 text-[var(--color-success)]"
                : "bg-red-500/10 text-[var(--color-danger)]"
            }
          `}
        >
          {positive24h ? "+" : ""}
          {asset.price_change_percentage_24h.toFixed(2)}%
        </span>
      </td>

      {/* Allocation */}

      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div
            className="
              h-2
              flex-1
              overflow-hidden
              rounded-full
              bg-[var(--app-border)]
            "
          >
            <div
              className="
                h-full
                rounded-full
                bg-gradient-to-r
                from-[#2563eb]
                via-[#7c3aed]
                to-[#9333ea]
              "
              style={{
                width: `${asset.allocation_percentage}%`,
              }}
            />
          </div>

          <span
            className="
              min-w-[55px]
              text-right
              text-sm
              font-semibold
              text-[var(--app-text)]
            "
          >
            {asset.allocation_percentage.toFixed(1)}%
          </span>
        </div>
      </td>

      {/* Actions */}

      <td className="px-6 py-5">
        <div className="flex justify-end gap-2">
          <button
            onClick={onEdit}
            title="Edit Asset"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-[var(--app-border)]
              bg-[var(--app-bg)]
              text-[var(--app-muted)]
              transition-all
              duration-300
              hover:border-blue-500/40
              hover:bg-blue-500/10
              hover:text-[var(--color-primary)]
            "
          >
            <FiEdit2 size={18} />
          </button>

          <button
            onClick={onDelete}
            title="Delete Asset"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-[var(--app-border)]
              bg-[var(--app-bg)]
              text-[var(--app-muted)]
              transition-all
              duration-300
              hover:border-red-500/40
              hover:bg-red-500/10
              hover:text-red-500
            "
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default PortfolioTableRow;
