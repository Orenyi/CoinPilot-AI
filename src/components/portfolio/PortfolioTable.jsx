import React, { useMemo, useState } from "react";

import { FiArrowUp, FiArrowDown } from "react-icons/fi";

import useCurrency from "../../hooks/useCurrency";

import { formatCurrency } from "../../utils/formatCurrency";

import PortfolioTableHeader from "./PortfolioTableHeader";
import PortfolioTableRow from "./PortfolioTableRow";
import EditAssetModal from "./EditAssetModal";
import DeleteAssetModal from "./DeleteAssetModal";

const SORT_FIELDS = {
  NAME: "name",
  HOLDINGS: "holdings",
  PRICE: "price",
  VALUE: "value",
  PNL: "pnl",
  CHANGE: "change",
  ALLOCATION: "allocation",
};

const PortfolioTable = ({ portfolio, coins, onUpdateAsset, onDeleteAsset }) => {
  const { currency } = useCurrency();

  const [sortField, setSortField] = useState(SORT_FIELDS.VALUE);

  const [sortDirection, setSortDirection] = useState("desc");

  const [selectedAsset, setSelectedAsset] = useState(null);

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));

      return;
    }

    setSortField(field);

    setSortDirection("desc");
  };

  const sortedAssets = useMemo(() => {
    if (!portfolio?.assets?.length) return [];

    const assets = [...portfolio.assets];

    assets.sort((a, b) => {
      let first;
      let second;

      switch (sortField) {
        case SORT_FIELDS.NAME:
          first = a.name?.toLowerCase() ?? "";
          second = b.name?.toLowerCase() ?? "";
          break;

        case SORT_FIELDS.HOLDINGS:
          first = a.quantity;
          second = b.quantity;
          break;

        case SORT_FIELDS.PRICE:
          first = a.current_price;
          second = b.current_price;
          break;

        case SORT_FIELDS.VALUE:
          first = a.current_value;
          second = b.current_value;
          break;

        case SORT_FIELDS.PNL:
          first = a.profit_loss;
          second = b.profit_loss;
          break;

        case SORT_FIELDS.CHANGE:
          first = a.price_change_percentage_24h;
          second = b.price_change_percentage_24h;
          break;

        case SORT_FIELDS.ALLOCATION:
          first = a.allocation_percentage;
          second = b.allocation_percentage;
          break;

        default:
          first = a.current_value;
          second = b.current_value;
      }

      if (typeof first === "string") {
        return sortDirection === "asc"
          ? first.localeCompare(second)
          : second.localeCompare(first);
      }

      return sortDirection === "asc" ? first - second : second - first;
    });

    return assets;
  }, [portfolio, sortField, sortDirection]);

  const openEditModal = (asset) => {
    setSelectedAsset(asset);
    setIsEditOpen(true);
  };

  const openDeleteModal = (asset) => {
    setSelectedAsset(asset);
    setIsDeleteOpen(true);
  };

  const closeEditModal = () => {
    setSelectedAsset(null);
    setIsEditOpen(false);
  };

  const closeDeleteModal = () => {
    setSelectedAsset(null);
    setIsDeleteOpen(false);
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;

    return sortDirection === "asc" ? (
      <FiArrowUp className="h-4 w-4" />
    ) : (
      <FiArrowDown className="h-4 w-4" />
    );
  };
  return (
    <>
      <div
        className="
        overflow-hidden
        rounded-3xl
        border
        border-[var(--app-border)]
        bg-[var(--app-card)]
        shadow-[var(--shadow-card)]
      "
      >
        <div className="overflow-x-auto ">
          <table className="min-w-full">
            <PortfolioTableHeader
              sortField={sortField}
              renderSortIcon={renderSortIcon}
              onSort={handleSort}
              SORT_FIELDS={SORT_FIELDS}
            />

            <tbody className="divide-y divide-[var(--app-border)]">
              {sortedAssets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-20">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div
                        className="
                          mb-6
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-9 w-9 text-[var(--color-primary-2)]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.8}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 7h18M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2m-9 5h4m-7 5h10a2 2 0 002-2V7H4v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>

                      <h3 className="text-2xl font-bold text-[var(--app-text)]">
                        No Assets Yet
                      </h3>

                      <p className="mt-3 max-w-md text-[15px] leading-7 text-[var(--app-muted)]">
                        Add your first cryptocurrency to start tracking your
                        portfolio, profit & loss, allocation and performance.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedAssets.map((asset, index) => (
                  <PortfolioTableRow
                    index={index}
                    key={asset.id}
                    asset={asset}
                    currency={currency}
                    formatCurrency={formatCurrency}
                    onEdit={() => openEditModal(asset)}
                    onDelete={() => openDeleteModal(asset)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EditAssetModal
        open={isEditOpen}
        onClose={closeEditModal}
        asset={selectedAsset}
        coins={coins}
        onUpdateAsset={onUpdateAsset}
      />
      <DeleteAssetModal
        open={isDeleteOpen}
        onClose={closeDeleteModal}
        asset={selectedAsset}
        onDeleteAsset={onDeleteAsset}
      />
    </>
  );
};

export default PortfolioTable;
