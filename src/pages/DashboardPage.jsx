import React from "react";

import DashboardLayout from "../components/dashboard/layout/DashboardLayout";

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <section className="space-y-6">
        {/* Welcome */}

        {/* Temporary Grid */}

        <div className="grid gap-6 lg:grid-cols-4 mt-5">
          <div
            className="
              h-40
              rounded-2xl
              border
              border-[var(--app-border)]
              bg-[var(--app-surface)]
            "
          />

          <div
            className="
              h-40
              rounded-2xl
              border
              border-[var(--app-border)]
              bg-[var(--app-surface)]
            "
          />

          <div
            className="
              h-40
              rounded-2xl
              border
              border-[var(--app-border)]
              bg-[var(--app-surface)]
            "
          />

          <div
            className="
              h-40
              rounded-2xl
              border
              border-[var(--app-border)]
              bg-[var(--app-surface)]
            "
          />
        </div>

        {/* Coin Table Placeholder */}

        <div
          className="
            h-[420px]
            rounded-2xl
            border
            border-[var(--app-border)]
            bg-[var(--app-surface)]
          "
        />

        {/* Bottom Grid */}

        <div className="grid gap-6 xl:grid-cols-2">
          <div
            className="
              h-[280px]
              rounded-2xl
              border
              border-[var(--app-border)]
              bg-[var(--app-surface)]
            "
          />

          <div
            className="
              h-[280px]
              rounded-2xl
              border
              border-[var(--app-border)]
              bg-[var(--app-surface)]
            "
          />
        </div>
      </section>
    </DashboardLayout>
  );
};

export default DashboardPage;
