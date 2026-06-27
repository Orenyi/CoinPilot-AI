import React from "react";
import { NavLink } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import ResetPasswordForm from "./ResetPasswordForm";

const ResetPasswordCard = () => {
  return (
    <div className="relative">
      {/* Logo */}
      <div className="flex justify-center">
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
          Reset Password
        </h1>

        <p className="mt-3 text-[15px] leading-7 text-[var(--app-soft)]">
          Enter your new password below.
        </p>
      </div>

      {/* Form */}
      <div className="mt-8">
        <ResetPasswordForm />
      </div>

      {/* Back */}
      <div className="mt-8 text-center">
        <NavLink
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary-2)] hover:underline"
        >
          <FiArrowLeft />
          Back to Login
        </NavLink>
      </div>
    </div>
  );
};

export default ResetPasswordCard;
