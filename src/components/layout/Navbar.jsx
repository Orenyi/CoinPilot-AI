import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { navLinks } from "../../data/navLinks";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--app-border)] bg-[var(--app-bg)]/95 backdrop-blur-2xl">
        <nav className="mx-auto flex h-[72px] max-w-[var(--container-width)] items-center justify-between px-4 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex shrink-0 items-center">
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
          </NavLink>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className="text-sm font-medium text-[var(--app-soft)] transition hover:text-[var(--color-primary-2)]"
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <NavLink to="/login">
              <button className="rounded-xl border border-[var(--app-border)] px-7 py-3 text-sm font-medium text-[var(--app-text)] transition hover:border-[var(--color-primary-2)] hover:shadow-[var(--glow-purple)]">
                Log In
              </button>
            </NavLink>

            <NavLink to="/register">
              <button className="rounded-xl bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#9333ea] px-7 py-3 text-sm font-medium text-white shadow-[0_0_28px_rgba(124,58,237,0.35)] transition hover:-translate-y-0.5">
                Get Started
              </button>
            </NavLink>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <ThemeToggle />

            <button
              onClick={() => setMenuOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--app-border)] text-[var(--app-text)]"
            >
              <FiMenu size={24} />
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu isOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />
    </>
  );
};

export default Navbar;
