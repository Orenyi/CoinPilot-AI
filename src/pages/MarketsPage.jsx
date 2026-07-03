import React from "react";

import DashboardLayout from "../components/dashboard/layout/DashboardLayout";

import MarketsHeader from "../components/markets/header/MarketsHeader";
import MarketsStats from "../components/markets/header/MarketsStats";

import SearchBar from "../components/markets/filters/SearchBar";
import FilterTabs from "../components/markets/filters/FilterTabs";
import CategoryChips from "../components/markets/filters/CategoryChips";
import SortDropdown from "../components/markets/filters/SortDropdown";

import MarketsTable from "../components/markets/table/MarketsTable";
import Pagination from "../components/markets/table/Pagination";

const MarketsPage = () => {
  return (
    <DashboardLayout>
      {/* ================= Header ================= */}

      <MarketsHeader />

      {/* ================= Market Stats ================= */}

      <section className="mt-6">
        <MarketsStats />
      </section>

      {/* ================= Search ================= */}

      <section className="mt-8">
        <SearchBar />
      </section>

      {/* ================= Filter Tabs ================= */}

      <section className="mt-6">
        <FilterTabs />
      </section>

      {/* ================= Categories ================= */}

      <section className="mt-5">
        <CategoryChips />
      </section>

      {/* ================= Sort ================= */}

      <section className="mt-6 flex justify-end">
        <SortDropdown />
      </section>

      {/* ================= Table ================= */}

      <section className="mt-6">
        <MarketsTable />
      </section>

      {/* ================= Pagination ================= */}

      <section className="mt-8">
        <Pagination />
      </section>
    </DashboardLayout>
  );
};

export default MarketsPage;
