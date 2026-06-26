import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO:
    // Supabase Login
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email */}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--app-text)]">
          Email Address
        </label>

        <div
          className="
            group
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-[var(--app-border)]
            bg-[var(--app-bg)]
            px-4
            py-3.5
            transition-all
            duration-300
            focus-within:border-[var(--color-primary-2)]
            focus-within:shadow-[0_0_0_4px_rgba(124,58,237,0.08)]
          "
        >
          <FiMail className="text-base text-[var(--app-muted)] transition group-focus-within:text-[var(--color-primary-2)]" />

          <input
            type="email"
            placeholder="you@example.com"
            className="
              w-full
              bg-transparent
              text-[15px]
              text-[var(--app-text)]
              placeholder:text-[var(--app-muted)]
              outline-none
            "
          />
        </div>
      </div>

      {/* Password */}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--app-text)]">
          Password
        </label>

        <div
          className="
            group
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-[var(--app-border)]
            bg-[var(--app-bg)]
            px-4
            py-3.5
            transition-all
            duration-300
            focus-within:border-[var(--color-primary-2)]
            focus-within:shadow-[0_0_0_4px_rgba(124,58,237,0.08)]
          "
        >
          <FiLock className="text-base text-[var(--app-muted)] transition group-focus-within:text-[var(--color-primary-2)]" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="
              w-full
              bg-transparent
              text-[15px]
              text-[var(--app-text)]
              placeholder:text-[var(--app-muted)]
              outline-none
            "
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="
              text-[var(--app-muted)]
              transition
              hover:text-[var(--app-text)]
            "
          >
            {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
          </button>
        </div>
      </div>

      {/* Remember & Forgot */}

      <div className="flex items-center justify-between pt-1">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--app-soft)]">
          <input
            type="checkbox"
            className="h-4 w-4 accent-[var(--color-primary-2)]"
          />
          Remember me
        </label>

        <NavLink
          to="/forgot-password"
          className="
            text-sm
            font-medium
            text-[var(--color-primary-2)]
            transition
            hover:underline
          "
        >
          Forgot Password?
        </NavLink>
      </div>

      {/* Login */}

      <button
        type="submit"
        className="
          group
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-gradient-to-r
          from-[#2563eb]
          via-[#7c3aed]
          to-[#9333ea]
          py-3.5
          font-semibold
          text-white
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:shadow-[0_14px_30px_rgba(124,58,237,0.30)]
          active:translate-y-0
        "
      >
        Login
        <FiArrowRight className="transition group-hover:translate-x-1" />
      </button>
    </form>
  );
};

export default LoginForm;
