import React, { useState } from "react";

import { FiAlertTriangle, FiX } from "react-icons/fi";

const DeleteAssetModal = ({ open, onClose, asset, onDeleteAsset }) => {
  const [loading, setLoading] = useState(false);

  if (!open || !asset) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);

      await onDeleteAsset(asset.id);

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white shadow-2xl dark:bg-[#0f172a]">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
              <FiAlertTriangle className="h-8 w-8" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Delete Asset
              </h2>

              <p className="text-sm text-slate-500">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}

        <div className="space-y-6 p-6">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
              You're about to permanently remove{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {asset.name}
              </span>{" "}
              from your portfolio.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Quantity</span>

              <span className="font-semibold text-slate-900 dark:text-white">
                {asset.quantity}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-slate-500">Average Buy</span>

              <span className="font-semibold text-slate-900 dark:text-white">
                ${Number(asset.buy_price).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-300 px-5 py-3 font-medium transition hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              {loading ? "Deleting..." : "Delete Asset"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAssetModal;
