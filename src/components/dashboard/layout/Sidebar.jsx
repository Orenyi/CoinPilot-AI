import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiBarChart2,
  FiStar,
  FiBriefcase,
  FiCpu,
  FiFileText,
  FiBell,
  FiSettings,
} from "react-icons/fi";

import { HiOutlineUserCircle } from "react-icons/hi2";
import { LuPanelLeft } from "react-icons/lu";

import useSidebar from "../../../hooks/useSidebar";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: FiGrid,
  },
  {
    name: "Markets",
    path: "/markets",
    icon: FiBarChart2,
  },
  {
    name: "Watchlist",
    path: "/watchlist",
    icon: FiStar,
  },
  {
    name: "Portfolio",
    path: "/portfolio",
    icon: FiBriefcase,
  },
  {
    name: "AI Assistant",
    path: "/ai-assistant",
    icon: FiCpu,
  },
  {
    name: "News",
    path: "/news",
    icon: FiFileText,
  },
  {
    name: "Alerts",
    path: "/alerts",
    icon: FiBell,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: FiSettings,
  },
];

const Sidebar = () => {
  const { collapsed, toggleSidebar } = useSidebar();

  return (
    <aside className="flex h-full flex-col overflow-hidden">
      {/* ================= Header ================= */}

      <div
        className={`
    flex
    h-[76px]
    items-center
    justify-between
    border-b
    border-[var(--app-border)]
    transition-all
    duration-300
   ${collapsed ? "justify-center px-0" : "justify-between px-5"}
  `}
      >
        {/* Logo */}

        <div
          onClick={collapsed ? toggleSidebar : undefined}
          className={`
    flex
    cursor-pointer
    items-center
    ${collapsed ? "justify-center w-full" : ""}
  `}
        >
          {collapsed ? (
            <img
              src="/favicon.png"
              alt="CoinPilot AI"
              className="h-9 w-9 object-contain transition-all duration-300"
            />
          ) : (
            <>
              <img
                src="/logo_darkmode.png"
                alt="CoinPilot AI"
                className="logo-dark h-10 w-auto"
              />

              <img
                src="/logo_lightmode.png"
                alt="CoinPilot AI"
                className="logo-light h-10 w-auto"
              />
            </>
          )}
        </div>

        {/* Collapse Button */}

        {!collapsed && (
          <button
            onClick={toggleSidebar}
            className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            text-[var(--app-soft)]
            transition-all
            duration-300
            hover:bg-[var(--app-bg)]
            hover:text-[var(--app-text)]
          "
          >
            <LuPanelLeft size={20} />
          </button>
        )}
      </div>

      {/* ================= Navigation ================= */}

      <nav className="flex-1 px-3 py-5">
        <ul className="space-y-1.5">
          {menuItems.map(({ name, path, icon: Icon }) => (
            <li key={name}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `
                  group
                  flex
                  items-center
                  rounded-xl
                  transition-all
                  duration-300
                  ${collapsed ? "justify-center h-12" : "gap-3 px-4 h-12"}
                  ${
                    isActive
                      ? "bg-gradient-to-r from-[#2563eb]/15 via-[#7c3aed]/15 to-[#9333ea]/15 text-[var(--color-primary-2)]"
                      : "text-[var(--app-soft)] hover:bg-[var(--app-bg)] hover:text-[var(--app-text)]"
                  }
                `
                }
              >
                <Icon
                  size={20}
                  className="shrink-0 transition-transform duration-300 group-hover:scale-110"
                />

                {!collapsed && (
                  <span
                    className="
                      whitespace-nowrap
                      text-sm
                      font-medium
                    "
                  >
                    {name}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {/* ================= User ================= */}

      <div className="border-t border-[var(--app-border)] p-3">
        <button
          className={`
            group
            flex
            w-full
            items-center
            rounded-xl
            transition-all
            duration-300
            hover:bg-[var(--app-bg)]
            ${collapsed ? "justify-center h-12" : "gap-3 px-3 py-3"}
          `}
        >
          {/* User Icon */}

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-gradient-to-r
              from-[#2563eb]
              to-[#9333ea]
              text-white
            "
          >
            <HiOutlineUserCircle size={22} />
          </div>

          {/* User Info */}

          {!collapsed && (
            <div className="min-w-0 flex-1 text-left">
              <h4 className="truncate text-sm font-semibold text-[var(--app-text)]">
                John Doe
              </h4>

              <p className="truncate text-xs text-[var(--app-muted)]">
                johndoe@gmail.com
              </p>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
