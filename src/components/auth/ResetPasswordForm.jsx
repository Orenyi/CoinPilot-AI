import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";

import { updatePassword } from "../../services/authService";

const ResetPasswordForm = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      return toast.error("Please fill in all fields.");
    }

    if (formData.password.length < 8) {
      return toast.error("Password must be at least 8 characters.");
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      setLoading(true);

      await updatePassword(formData.password);

      toast.success("Password updated successfully.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* New Password */}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--app-text)]">
          New Password
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
            name="password"
            value={formData.password}
            onChange={handleChange}
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
            className="text-[var(--app-muted)] hover:text-[var(--app-text)]"
          >
            {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--app-text)]">
          Confirm Password
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
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
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
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-[var(--app-muted)] hover:text-[var(--app-text)]"
          >
            {showConfirmPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
          </button>
        </div>
      </div>

      {/* Submit */}

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
        {loading ? "Updating..." : "Update Password"}

        {!loading && (
          <FiArrowRight className="transition group-hover:translate-x-1" />
        )}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
