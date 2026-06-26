import React from "react";
import { NavLink } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

import LoginForm from "./LoginForm";

const LoginCard = () => {
  return (
    <div
      className="
        relative

      "
    >
      {/* Glow */}

      {/* Logo */}

      <div className="relative z-10 flex justify-center">
        <div
          className="
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-3xl
            border
            border-[var(--app-border)]
            bg-[var(--app-bg)]
            shadow-[0_0_30px_rgba(124,58,237,0.15)]
          "
        >
          <NavLink to="/">
            <img
              src="/favicon.png"
              alt="CoinPilot AI"
              className="h-11 w-11 object-contain"
            />
          </NavLink>
        </div>
      </div>

      {/* Heading */}

      <div className="mt-8 text-center">
        <h1 className="[font-family:var(--font-heading)] text-4xl font-bold text-[var(--app-text)]">
          Welcome Back
        </h1>

        <p className="mt-3 text-[15px] leading-7 text-[var(--app-soft)]">
          Sign in to continue to
          <span className="font-semibold text-[var(--app-text)]">
            {" "}
            CoinPilot AI
          </span>
        </p>
      </div>

      {/* Google */}

      <button
        type="button"
        className="
          mt-10
          flex
          w-full
          items-center
          justify-center
          gap-3
          rounded-2xl
          border
          border-[var(--app-border)]
          bg-[var(--app-bg)]
          py-4
          font-medium
          text-[var(--app-text)]
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:border-[var(--color-primary-2)]
          hover:shadow-[0_8px_30px_rgba(124,58,237,0.15)]
        "
      >
        <FcGoogle size={22} />
        Continue with Google
      </button>

      {/* Divider */}

      <div className="my-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-[var(--app-border)]" />

        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--app-muted)]">
          OR
        </span>

        <div className="h-px flex-1 bg-[var(--app-border)]" />
      </div>

      {/* Login Form */}

      <LoginForm />

      {/* Footer */}

      <div className="mt-8 text-center text-sm text-[var(--app-soft)]">
        Don't have an account?{" "}
        <NavLink
          to="/register"
          className="
            font-semibold
            text-[var(--color-primary-2)]
            transition-colors
            hover:text-[#9333ea]
          "
        >
          Create Account
        </NavLink>
      </div>
    </div>
  );
};

export default LoginCard;
