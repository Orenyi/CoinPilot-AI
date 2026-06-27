import React from "react";

import ThemeToggle from "../components/layout/ThemeToggle";
import RegisterCard from "../components/auth/RegisterCard";

const RegisterPage = () => {
  return (
    <section className="relative h-screen overflow-hidden bg-[var(--app-bg)]">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,.08),transparent_55%)]" />

      {/* Theme Toggle */}
      <div className="absolute right-6 top-6 z-50">
        <ThemeToggle />
      </div>

      {/* Register Card */}
      <div className="relative flex h-full items-center justify-center px-6">
        <div className="w-full max-w-[440px]">
          <RegisterCard />
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
