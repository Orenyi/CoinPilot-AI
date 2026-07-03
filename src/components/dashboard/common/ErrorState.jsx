import React from "react";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

const ErrorState = ({
  title = "Unable to load data",
  message = "Something went wrong while fetching the latest market data.",
  onRetry,
}) => {
  return (
    <section
      className="
        flex
        min-h-[60vh]
        items-center
        justify-center
      "
    >
      <div
        className="
          w-full
          max-w-lg
          rounded-3xl
          border
          border-red-500/20
          bg-[var(--app-surface)]
          p-8
          text-center
          shadow-lg
        "
      >
        {/* Icon */}

        <div
          className="
            mx-auto
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-full
            bg-red-500/10
            text-red-500
          "
        >
          <FiAlertTriangle size={38} />
        </div>

        {/* Title */}

        <h2 className="mt-6 text-2xl font-bold text-[var(--app-text)]">
          {title}
        </h2>

        {/* Message */}

        <p className="mt-3 leading-7 text-[var(--app-soft)]">{message}</p>

        {/* Retry */}

        {onRetry && (
          <button
            onClick={onRetry}
            className="
              mt-8
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-[#2563eb]
              via-[#7c3aed]
              to-[#9333ea]
              px-6
              py-3
              font-semibold
              text-white
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-[0_14px_30px_rgba(124,58,237,0.30)]
            "
          >
            <FiRefreshCw size={18} />
            Retry
          </button>
        )}
      </div>
    </section>
  );
};

export default ErrorState;
