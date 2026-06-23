import React from "react";
import { FiArrowRight } from "react-icons/fi";

const StepCard = ({ step, title, description, icon, mobile = false }) => {
  if (mobile) {
    return (
      <article className="flex gap-4 rounded-3xl border border-[var(--app-border)] bg-[var(--app-card)] p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white">
          {step}
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-[var(--app-text)]">{title}</h3>

          <p className="text-sm leading-6 text-[var(--app-soft)]">
            {description}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative">
      <div
        className="
        h-full
        min-h-[260px]
        rounded-3xl
        border
        border-[var(--app-border)]
        bg-[var(--app-card)]
        p-6
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-[var(--color-primary-2)]
        hover:shadow-[0_0_30px_rgba(124,58,237,0.12)]
        flex
        flex-col
        "
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed] font-bold text-white">
            {step}
          </div>

          <div className="text-xl text-[var(--color-primary-2)]">{icon}</div>
        </div>

        <h3 className="mb-3 min-h-[64px] font-semibold text-[var(--app-text)]">
          {title}
        </h3>

        <p className="flex-1 text-sm leading-7 text-[var(--app-soft)]">
          {description}
        </p>
      </div>

      {step !== "4" && (
        <div className="absolute left-full top-1/2 hidden -translate-y-1/2 text-[var(--color-primary-2)] xl:block">
          <FiArrowRight size={22} />
        </div>
      )}
    </article>
  );
};

export default StepCard;
