import React from "react";
import { NavLink } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

import { signInWithGoogle } from "../../services/authService";
import RegisterForm from "./RegisterForm";

const RegisterCard = () => {
  const handleGoogleRegister = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="relative">
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
          Create Account
        </h1>

        <p className="mt-3 text-[15px] leading-7 text-[var(--app-soft)]">
          Join
          <span className="font-semibold text-[var(--app-text)]">
            {" "}
            CoinPilot AI
          </span>{" "}
          and start tracking the crypto market smarter.
        </p>
      </div>

      {/* Google */}

      <button
        type="button"
        onClick={handleGoogleRegister}
        className="
          mt-8
          flex
          w-full
          items-center
          justify-center
          gap-3
          rounded-2xl
          border
          border-[var(--app-border)]
          bg-[var(--app-bg)]
          py-3.5
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

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-[var(--app-border)]" />

        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--app-muted)]">
          OR
        </span>

        <div className="h-px flex-1 bg-[var(--app-border)]" />
      </div>

      {/* Register Form */}

      <RegisterForm />

      {/* Footer */}

      <div className="mt-6 text-center text-sm text-[var(--app-soft)]">
        Already have an account?{" "}
        <NavLink
          to="/login"
          className="
            font-semibold
            text-[var(--color-primary-2)]
            transition-colors
            hover:text-[#9333ea]
          "
        >
          Sign In
        </NavLink>
      </div>
    </div>
  );
};

export default RegisterCard;
