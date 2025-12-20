// components/GameathonBadge.tsx
import React from "react";

type BadgeProps = { children?: React.ReactNode; className?: string };

export default function GameathonBadge({ children = "Badge", className = "" }: BadgeProps) {
  return (
    <div className={`flex justify-center mb-6 ${className}`}>
      <span className="inline-flex items-center gap-2 md:px-6 px-3 md:py-3 py-1 tracking-wider
        bg-(--gameathon-gold-light)/20 border-(--gameathon-gold-light)/30 text-(--gameathon-gold-light)/85 border-solid border rounded-full">
        {children}
      </span>
    </div>
  );
}
