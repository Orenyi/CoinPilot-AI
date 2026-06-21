import React from "react";
import { NavLink } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { navLinks } from "../../data/navLinks";

const MobileMenu = ({ isOpen, closeMenu }) => {
  return (
    <div
      className={`fixed inset-0 z-[999] min-h-screen bg-[var(--app-bg)] px-5 py-5 transition-all duration-300 lg:hidden ${
        isOpen
          ? "visible translate-x-0 opacity-100"
          : "invisible translate-x-full opacity-0"
      }`}
    >
      <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-5">
        <NavLink to="/" onClick={closeMenu}>
          <img
            src="/logo_darkmode.png"
            alt="CoinPilot AI"
            className="logo-dark h-9 w-auto"
          />
          <img
            src="/logo_lightmode.png"
            alt="CoinPilot AI"
            className="logo-light h-9 w-auto"
          />
        </NavLink>

        <button
          onClick={closeMenu}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--app-border)] text-[var(--app-text)]"
        >
          <IoClose size={28} />
        </button>
      </div>

      <nav className="mt-10 flex flex-col gap-6">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            onClick={closeMenu}
            className="text-2xl font-bold text-[var(--app-text)] transition hover:text-[var(--color-primary-2)]"
          >
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="mt-10 grid gap-4">
        <button className="rounded-xl border border-[var(--app-border)] px-6 py-4 font-bold text-[var(--app-text)]  hover:border-[var(--color-primary-2)] hover:shadow-[var(--glow-purple)]">
          Log In
        </button>

        <button className="rounded-xl bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#9333ea] px-6 py-4 font-bold text-white shadow-[0_0_28px_rgba(124,58,237,0.35)]">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default MobileMenu;
