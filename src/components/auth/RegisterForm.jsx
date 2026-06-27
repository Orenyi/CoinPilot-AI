import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
} from "react-icons/fi";

import { signUp } from "../../services/authService";
import toast from "react-hot-toast";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return toast.error("Please fill in all fields.");
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    if (!formData.agree) {
      return toast.error("Please accept the Terms & Privacy Policy.");
    }

    try {
      setLoading(true);

      await signUp({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      toast.success(
        "Account created successfully! Check your email to verify your account.",
      );

      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Full Name */}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--app-text)]">
          Full Name
        </label>

        <div className="group flex items-center gap-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-bg)] px-4 py-3.5 transition-all duration-300 focus-within:border-[var(--color-primary-2)] focus-within:shadow-[0_0_0_4px_rgba(124,58,237,0.08)]">
          <FiUser className="text-base text-[var(--app-muted)]" />

          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full bg-transparent text-[15px] text-[var(--app-text)] outline-none"
          />
        </div>
      </div>

      {/* Email */}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--app-text)]">
          Email Address
        </label>

        <div className="group flex items-center gap-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-bg)] px-4 py-3.5 transition-all duration-300 focus-within:border-[var(--color-primary-2)] focus-within:shadow-[0_0_0_4px_rgba(124,58,237,0.08)]">
          <FiMail className="text-base text-[var(--app-muted)]" />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full bg-transparent text-[15px] text-[var(--app-text)] outline-none"
          />
        </div>
      </div>

      {/* Password */}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--app-text)]">
          Password
        </label>

        <div className="group flex items-center gap-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-bg)] px-4 py-3.5 transition-all duration-300 focus-within:border-[var(--color-primary-2)] focus-within:shadow-[0_0_0_4px_rgba(124,58,237,0.08)]">
          <FiLock className="text-base text-[var(--app-muted)]" />

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full bg-transparent text-[15px] text-[var(--app-text)] outline-none"
          />

          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--app-text)]">
          Confirm Password
        </label>

        <div className="group flex items-center gap-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-bg)] px-4 py-3.5 transition-all duration-300 focus-within:border-[var(--color-primary-2)] focus-within:shadow-[0_0_0_4px_rgba(124,58,237,0.08)]">
          <FiLock className="text-base text-[var(--app-muted)]" />

          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full bg-transparent text-[15px] text-[var(--app-text)] outline-none"
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
          </button>
        </div>
      </div>

      {/* Terms */}

      <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--app-soft)]">
        <input
          type="checkbox"
          name="agree"
          checked={formData.agree}
          onChange={handleChange}
          className="mt-1 h-4 w-4 accent-[var(--color-primary-2)]"
        />

        <span>
          I agree to the{" "}
          <NavLink
            to="/terms"
            className="font-medium text-[var(--color-primary-2)]"
          >
            Terms
          </NavLink>{" "}
          and{" "}
          <NavLink
            to="/privacy"
            className="font-medium text-[var(--color-primary-2)]"
          >
            Privacy Policy
          </NavLink>
        </span>
      </label>

      {/* Register */}

      <button
        type="submit"
        disabled={loading}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#9333ea] py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(124,58,237,0.30)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Creating Account..." : "Create Account"}

        {!loading && (
          <FiArrowRight className="transition group-hover:translate-x-1" />
        )}
      </button>
    </form>
  );
};

export default RegisterForm;
