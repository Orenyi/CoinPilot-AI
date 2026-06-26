import React from "react";

import ThemeToggle from "../components/layout/ThemeToggle";
import LoginCard from "../components/auth/LoginCard";

const LoginPage = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--app-bg)]">
      {/* Background Glow */}
      <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-[#2563eb]/10 blur-[140px]" />

      <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-[#7c3aed]/10 blur-[140px]" />

      {/* Grid */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.03]
          [background-image:linear-gradient(var(--app-border)_1px,transparent_1px),linear-gradient(90deg,var(--app-border)_1px,transparent_1px)]
          [background-size:60px_60px]
        "
      />

      {/* Theme Toggle */}
      <div className="absolute right-6 top-6 z-20">
        <ThemeToggle />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <LoginCard />
      </div>
    </section>
  );
};

export default LoginPage;
