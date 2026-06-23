import React from "react";

const FeatureCard = ({ icon, title, description, color }) => {
  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-[var(--app-border)]
        bg-[var(--app-card)]
        p-6
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-[var(--color-primary-2)]
        hover:shadow-[0_0_40px_rgba(124,58,237,0.12)]
        cursor-pointer
      "
    >
      {/* Hover Glow */}
      <div
        className="absolute -right-10 -top-10 h-24 w-24 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
        style={{
          backgroundColor: color,
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative">
        <div
          className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
          style={{
            backgroundColor: `${color}15`,
            color,
          }}
        >
          {icon}
        </div>

        <h3 className="mb-3 text-lg font-semibold text-[var(--app-text)]">
          {title}
        </h3>

        <p className="text-sm leading-7 text-[var(--app-soft)]">
          {description}
        </p>
      </div>
    </article>
  );
};

export default FeatureCard;
