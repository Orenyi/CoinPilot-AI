import React from "react";

import ThemeToggle from "../components/layout/ThemeToggle";
import ForgotPasswordCard from "../components/auth/ForgotPasswordCard";

const ForgotPasswordPage = () => {
  return (
    <section className="relative h-screen overflow-hidden bg-[var(--app-bg)]">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,.08),transparent_55%)]" />

      {/* Theme Toggle */}
      <div className="absolute right-6 top-6 z-50">
        <ThemeToggle />
      </div>

      {/* Content */}
      <div className="relative flex h-full items-center justify-center px-6">
        <div className="w-full max-w-[440px]">
          <ForgotPasswordCard />
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
