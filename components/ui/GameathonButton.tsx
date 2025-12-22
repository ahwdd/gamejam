import React from 'react';
import Link from 'next/link';

interface GameathonButtonProps {
  href?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary';
  external?: boolean;
}

export default function GameathonButton({ href, children, size = 'medium', variant = 'primary', external = false }: GameathonButtonProps) {
  const baseClasses =
    'relative inline-flex items-center justify-center font-bold rounded-lg overflow-hidden group ' +
    'transition-all duration-300 ease-out select-none';

  const sizeClasses = {
    small: 'px-6 py-2.5 text-sm',
    medium: 'px-8 py-3 text-base',
    large: 'px-10 py-4 text-lg',
  };

  const variantClasses = {
    primary: `bg-(--gameathon-gold) text-white shadow-[0_6px_20px_rgba(201,160,92,0.25)] hover:shadow-[0_0_40px_rgba(201,160,92,0.6)]`,
    secondary: `bg-(--gameathon-bg-card) text-white border border-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]`,
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`;

  const content = (
    <>
      <span aria-hidden 
      className="absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"/>

      <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">
        {children}
      </span>

      <span aria-hidden
        className="absolute inset-0 bg-(--gameathon-gold-light) opacity-0 group-hover:opacity-10 transition-opacity"/>
    </>
  );

  if (external) {
    return (
      <a href={href??''} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href??''} className={classes}>
      {content}
    </Link>
  );
}
