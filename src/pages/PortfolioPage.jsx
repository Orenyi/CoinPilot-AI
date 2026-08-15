import React, { useState } from "react";

import DashboardLayout from "../components/dashboard/layout/DashboardLayout";

import PortfolioOverview from "../components/portfolio/PortfolioOverview";
import PortfolioInsights from "../components/portfolio/PortfolioInsights";
import PortfolioAllocation from "../components/portfolio/PortfolioAllocation";
import PortfolioTable from "../components/portfolio/PortfolioTable";
import EmptyPortfolio from "../components/portfolio/PortfolioEmpty";
import LoadingPortfolio from "../components/portfolio/LoadingPortfolio";
import AddAssetModal from "../components/portfolio/AddAssetModal";

import { usePortfolio } from "../hooks/usePortfolio";
import useCoins from "../hooks/useCoins";

const PortfolioPage = () => {
  const {
    portfolio,
    loading,
    addAsset,
    updateAsset,
    deleteAsset,
    refreshPortfolio,
  } = usePortfolio();

  const { coins } = useCoins();

  const [showModal, setShowModal] = useState(false);

  if (loading) {
    return (
      <DashboardLayout
        title="Portfolio Tracker"
        subtitle="Track and manage your cryptocurrency investments."
      >
        <LoadingPortfolio />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Portfolio Tracker"
      subtitle="Track and manage your cryptocurrency investments."
    >
      <div className="mt-8 flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="
            rounded-xl
            bg-gradient-to-r
            from-[#2563eb]
            via-[#7c3aed]
            to-[#9333ea]
            px-5
            py-3
            font-semibold
            text-white
            transition-all
            duration-300
            hover:scale-[1.02]
            hover:shadow-lg
            hover:shadow-violet-500/20
          "
        >
          + Add Asset
        </button>
      </div>

      {!portfolio || portfolio.assets.length === 0 ? (
        <div className="mt-8">
          <EmptyPortfolio onAddAsset={() => setShowModal(true)} />
        </div>
      ) : (
        <>
          <div className="mt-8">
            <PortfolioOverview portfolio={portfolio} />
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <PortfolioInsights portfolio={portfolio} />

            <PortfolioAllocation portfolio={portfolio} />
          </div>

          <div className="mt-8">
            <PortfolioTable
              portfolio={portfolio}
              coins={coins}
              onUpdateAsset={updateAsset}
              onDeleteAsset={deleteAsset}
            />
          </div>
        </>
      )}

      <AddAssetModal
        open={showModal}
        onClose={() => setShowModal(false)}
        coins={coins}
        onAddAsset={async (asset) => {
          console.log("Asset received:", asset);

          try {
            await addAsset(asset);

            console.log("Asset saved");

            await refreshPortfolio();

            setShowModal(false);
          } catch (err) {
            console.error(err);
          }
        }}
      />
    </DashboardLayout>
  );
};

export default PortfolioPage;
