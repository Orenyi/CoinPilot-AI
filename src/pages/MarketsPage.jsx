import React, { useState } from "react";

import DashboardLayout from "../components/dashboard/layout/DashboardLayout";

import MarketsStats from "../components/markets/header/MarketsStats";

import SearchBar from "../components/markets/filters/SearchBar";
import FilterTabs from "../components/markets/filters/FilterTabs";
import CategoryChips from "../components/markets/filters/CategoryChips";
import SortDropdown from "../components/markets/filters/SortDropdown";

import MarketsTable from "../components/markets/table/MarketsTable";
import Pagination from "../components/markets/table/Pagination";
import useCoins from "../hooks/useCoins";
import EmptyMarkets from "../components/markets/common/EmptyMarkets";

const MarketsPage = () => {
  const {
    globalMarket,
    coins,
    trendingCoins,

    loading,
    refreshing,
    error,
    refresh,

    search,
    setSearch,

    filter,
    setFilter,

    category,
    setCategory,

    sort,
    setSort,

    page,
    setPage,

    categories,
    pagination,
  } = useCoins();

  const filteredCoins = coins.filter((coin) => {
    const query = search.toLowerCase();

    return (
      coin.name.toLowerCase().includes(query) ||
      coin.symbol.toLowerCase().includes(query)
    );
  });

  const sortedCoins = [...filteredCoins].sort((a, b) => {
    switch (sort) {
      case "market_cap_desc":
        return b.market_cap - a.market_cap;

      case "market_cap_asc":
        return a.market_cap - b.market_cap;

      case "price_desc":
        return b.current_price - a.current_price;

      case "price_asc":
        return a.current_price - b.current_price;

      case "change_desc":
        return b.price_change_percentage_24h - a.price_change_percentage_24h;

      case "change_asc":
        return a.price_change_percentage_24h - b.price_change_percentage_24h;

      case "volume_desc":
        return b.total_volume - a.total_volume;

      case "volume_asc":
        return a.total_volume - b.total_volume;

      case "name_asc":
        return a.name.localeCompare(b.name);

      case "name_desc":
        return b.name.localeCompare(a.name);

      default:
        return 0;
    }
  });

  const displayedCoins = (() => {
    switch (filter) {
      case "trending":
        return trendingCoins;

      case "gainers":
        return [...sortedCoins].sort(
          (a, b) =>
            b.price_change_percentage_24h - a.price_change_percentage_24h,
        );

      case "losers":
        return [...sortedCoins].sort(
          (a, b) =>
            a.price_change_percentage_24h - b.price_change_percentage_24h,
        );

      case "new":
        return [...sortedCoins].sort(
          (a, b) => b.market_cap_rank - a.market_cap_rank,
        );

      case "watchlist":
        return []; // placeholder

      default:
        return sortedCoins;
    }
  })();

  return (
    <DashboardLayout
      title="Markets"
      subtitle="Discover, compare and analyze live cryptocurrency markets."
      onRefresh={refresh}
      refreshing={refreshing}
    >
      {/* ================= Market Stats ================= */}

      <section className="mt-6">
        <MarketsStats
          globalMarket={globalMarket}
          trendingCoins={trendingCoins}
        />
      </section>

      {/* ================= Search ================= */}

      <section className="mt-8">
        <SearchBar value={search} onChange={setSearch} />
      </section>

      {/* ================= Filter Tabs ================= */}

      <section className="mt-6">
        <FilterTabs activeTab={filter} onChange={setFilter} />
      </section>

      {/* ================= Categories ================= */}

      <section className="mt-5">
        <CategoryChips
          categories={categories}
          activeCategory={category}
          onChange={setCategory}
        />
      </section>

      {/* ================= Sort ================= */}

      <section className="mt-6 flex justify-end">
        <SortDropdown value={sort} onChange={setSort} />
      </section>

      {/* ================= Table ================= */}

      <section className="mt-6">
        {displayedCoins.length === 0 ? (
          <EmptyMarkets
            title="No cryptocurrencies found"
            message="Try another search or filter."
          />
        ) : (
          <MarketsTable coins={displayedCoins} loading={loading} />
        )}
      </section>

      {/* ================= Pagination ================= */}

      <section className="mt-8">
        <Pagination
          currentPage={pagination?.page ?? 1}
          totalPages={pagination?.totalPages ?? 1}
          onPageChange={setPage}
        />
      </section>
    </DashboardLayout>
  );
};

export default MarketsPage;
