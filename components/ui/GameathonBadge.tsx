// components/GameathonBadge.tsx
import React from "react";

type BadgeVariant = "primary" | "secondary";

type BadgeProps = {
  children?: React.ReactNode;
  className?: string;
  variant?: BadgeVariant;
};

export default function GameathonBadge({
  children = "Badge",
  className = "",
  variant = "primary",
}: BadgeProps) {
  const baseClasses =
    "inline-flex items-center gap-2 md:px-6 px-3 md:py-3 py-1 tracking-wider rounded-full";

  const variants: Record<BadgeVariant, string> = {
    primary: "bg-(--gameathon-gold-light)/20 border-(--gameathon-gold-light)/30 text-(--gameathon-gold-light)/85 border border-solid",
    secondary: "bg-white/10 text-white border-none",
  };

  return (
    <div className={`flex justify-center mb-6 ${className}`}>
      <span className={`${baseClasses} ${variants[variant]}`}>
        {children}
      </span>
    </div>
  );
}
