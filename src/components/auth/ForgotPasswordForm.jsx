import React, { useState } from "react";
import { FiMail, FiArrowRight } from "react-icons/fi";

import { forgotPassword } from "../../services/authService";
import toast from "react-hot-toast";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Please enter your email.");
    }

    try {
      setLoading(true);

      await forgotPassword(email);
      toast.success("Password reset email sent.");

      setSuccess(true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-green-500/20
          bg-green-500/10
          p-6
          text-center
        "
      >
        <h3 className="text-lg font-semibold text-[var(--app-text)]">
          Check your email
        </h3>

        <p className="mt-2 text-sm leading-7 text-[var(--app-soft)]">
          If an account exists for
          <span className="font-semibold text-[var(--app-text)]"> {email}</span>
          , we've sent a password reset link.
        </p>
      </div>
    );
  }

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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

      {/* Button */}

      <button
        type="submit"
        disabled={loading}
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
    disabled:cursor-not-allowed
    disabled:opacity-70
  "
      >
        {loading ? "Sending..." : "Send Reset Link"}

        {!loading && (
          <FiArrowRight className="transition group-hover:translate-x-1" />
        )}
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
