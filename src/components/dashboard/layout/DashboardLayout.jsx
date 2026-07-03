import React from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import BottomNavbar from "./BottomNavbar";

import useSidebar from "../../../hooks/useSidebar";

const DashboardLayout = ({ children, onRefresh, refreshing }) => {
  const { collapsed } = useSidebar();

  return (
    <section className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}

        <aside
          className={`
            hidden
            lg:block
            shrink-0
            border-r
            border-[var(--app-border)]
            bg-[var(--app-surface)]
            transition-all
            duration-300
            ease-in-out
            ${collapsed ? "w-[84px]" : "w-[270px]"}
          `}
        >
          <Sidebar />
        </aside>

        {/* Main Content */}

        <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
          {/* Topbar */}

          <header
            className="
              sticky
              top-0
              z-40
              border-b
              border-[var(--app-border)]
              bg-[var(--app-bg)]/90
              backdrop-blur-xl
            "
          >
            <Topbar onRefresh={onRefresh} refreshing={refreshing} />
          </header>

          {/* Page */}

          <main
            className="
              flex-1
              overflow-y-auto
              px-4
              py-5
              pb-24
              sm:px-6
              lg:px-8
              lg:pb-8
              xl:px-10
            "
          >
            <div className="mx-auto w-full max-w-[1600px]">{children}</div>
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}

      <div
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-50
          border-t
          border-[var(--app-border)]
          bg-[var(--app-surface)]/95
          backdrop-blur-xl
          lg:hidden
        "
      >
        <BottomNavbar />
      </div>
    </section>
  );
};

export default DashboardLayout;
