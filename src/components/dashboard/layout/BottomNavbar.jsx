import React from "react";
import { NavLink } from "react-router-dom";
import { FiGrid, FiBarChart2, FiCpu, FiStar, FiMenu } from "react-icons/fi";

const navItems = [
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
    name: "AI",
    path: "/ai-assistant",
    icon: FiCpu,
  },
  {
    name: "Watchlist",
    path: "/watchlist",
    icon: FiStar,
  },
  {
    name: "More",
    path: "/more",
    icon: FiMenu,
  },
];

const BottomNavbar = () => {
  return (
    <nav
      className="
        grid
        h-[72px]
        grid-cols-5
        border-t
        border-[var(--app-border)]
        bg-[var(--app-surface)]/95
        backdrop-blur-xl
        lg:hidden
      "
    >
      {navItems.map(({ name, path, icon: Icon }) => (
        <NavLink
          key={name}
          to={path}
          className={({ isActive }) =>
            `
            flex
            flex-col
            items-center
            justify-center
            gap-1
            transition-all
            duration-300
            ${
              isActive
                ? "text-[var(--color-primary-2)]"
                : "text-[var(--app-muted)] hover:text-[var(--app-text)]"
            }
          `
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  transition-all
                  duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-r from-[#2563eb]/20 to-[#7c3aed]/20"
                      : ""
                  }
                `}
              >
                <Icon size={20} />
              </div>

              <span className="text-[10px] font-medium">{name}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNavbar;
