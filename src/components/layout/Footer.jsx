import React from "react";
import { FiGithub, FiLinkedin, FiTwitter, FiSend } from "react-icons/fi";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--app-border)] bg-[var(--app-bg)]">
      {/* Glow */}
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[var(--color-primary)]/5 blur-[120px]" />
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[var(--color-primary-2)]/5 blur-[120px]" />

      <div className="relative mx-auto max-w-[var(--container-width)] px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          {/* logo */}
          <div>
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

            <p className="mt-5 max-w-sm text-sm leading-7 text-[var(--app-soft)]">
              CoinPilot AI helps investors track markets, manage portfolios,
              monitor watchlists and gain AI-powered crypto insights.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-full border border-[var(--app-border)]
                  bg-[var(--app-card)]
                  text-[var(--app-soft)]
                  transition-all duration-300
                  hover:border-[var(--color-primary-2)]
                  hover:text-[var(--color-primary-2)]
                "
              >
                <FiGithub size={18} />
              </a>

              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-full border border-[var(--app-border)]
                  bg-[var(--app-card)]
                  text-[var(--app-soft)]
                  transition-all duration-300
                  hover:border-[var(--color-primary-2)]
                  hover:text-[var(--color-primary-2)]
                "
              >
                <FiLinkedin size={18} />
              </a>

              <a
                href="https://x.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-full border border-[var(--app-border)]
                  bg-[var(--app-card)]
                  text-[var(--app-soft)]
                  transition-all duration-300
                  hover:border-[var(--color-primary-2)]
                  hover:text-[var(--color-primary-2)]
                "
              >
                <FiTwitter size={18} />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="mb-5 font-semibold text-[var(--app-text)]">
              Platform
            </h3>

            <ul className="space-y-3 text-sm text-[var(--app-soft)]">
              <li>
                <a href="#" className="hover:text-[var(--app-text)]">
                  Markets
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-[var(--app-text)]">
                  Watchlist
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-[var(--app-text)]">
                  Portfolio
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-[var(--app-text)]">
                  AI Assistant
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-5 font-semibold text-[var(--app-text)]">
              Resources
            </h3>

            <ul className="space-y-3 text-sm text-[var(--app-soft)]">
              <li>
                <a href="#" className="hover:text-[var(--app-text)]">
                  News & Insights
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-[var(--app-text)]">
                  API Docs
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-[var(--app-text)]">
                  Help Center
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-[var(--app-text)]">
                  Guides
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-3 font-semibold text-[var(--app-text)]">
              Newsletter
            </h3>

            <p className="mb-5 text-sm leading-7 text-[var(--app-soft)]">
              Get weekly crypto insights, market trends and AI-powered updates.
            </p>

            <div
              className="
                overflow-hidden
                rounded-2xl
                border border-[var(--app-border)]
                bg-[var(--app-card)]
              "
            >
              <div className="flex items-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="
                    flex-1
                    bg-transparent
                    px-4
                    py-4
                    text-sm
                    text-[var(--app-text)]
                    placeholder:text-[var(--app-muted)]
                    outline-none
                  "
                />

                <button
                  className="
                    mr-2
                    flex h-10 w-10 items-center justify-center
                    rounded-xl
                    bg-gradient-to-r
                    from-[#2563eb]
                    via-[#7c3aed]
                    to-[#9333ea]
                    text-white
                    transition-all duration-300
                    hover:scale-105
                  "
                >
                  <FiSend />
                </button>
              </div>
            </div>

            <p className="mt-3 text-xs text-[var(--app-muted)]">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 border-t border-[var(--app-border)] pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row">
            <p className="text-sm text-[var(--app-muted)]">
              © 2026 CoinPilot AI. All rights reserved.
            </p>

            <div className="flex items-center gap-6 text-sm text-[var(--app-muted)]">
              <a href="#" className="hover:text-[var(--app-text)]">
                Privacy Policy
              </a>

              <a href="#" className="hover:text-[var(--app-text)]">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
