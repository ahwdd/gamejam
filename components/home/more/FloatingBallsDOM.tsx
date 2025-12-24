// components/home/more/FloatingBallsDOM.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CONFIG } from '@/config/siteConfig';

type Ball = {
  key: string;
  hex: string;
  rgb: string;
  outerAlpha: number;
  innerAlpha: number;
  size: number;
  left: string;
  top: string;
  duration: number;
  delay: number;
  horizAmp: number;
  vertAmp: number;
  rotate: number;
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}
function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  if (h.length !== 6) return '255,255,255';
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r},${g},${b}`;
}
function extractHexesFromConfig(obj: any): string[] {
  const result = new Set<string>();
  const rx = /#([0-9a-fA-F]{6})/g;
  const walk = (value: any) => {
    if (typeof value === 'string') {
      let m;
      while ((m = rx.exec(value)) !== null) {
        result.add('#' + m[1].toUpperCase());
      }
    } else if (Array.isArray(value)) {
      value.forEach(walk);
    } else if (value && typeof value === 'object') {
      Object.values(value).forEach(walk);
    }
  };
  walk(obj);
  return Array.from(result);
}

export default function FloatingBallsDOM({ countMin = 6, countMax = 10 }: { countMin?: number; countMax?: number }) {
  const palette = useMemo(() => {
    const agendaColors: string[] = (CONFIG?.agenda?.dayColors ?? []) as string[];
    const extracted = extractHexesFromConfig(CONFIG);
    const set = new Set<string>([...agendaColors.map((c) => c.toUpperCase()), ...extracted]);
    const arr = Array.from(set);
    if (arr.length === 0) return ['#C9A05C', '#4A90E2', '#E94B3C', '#C8A47F', '#BC3E2B', '#364746'];
    return arr;
  }, []);

  const [balls, setBalls] = useState<Ball[] | null>(null);

  useEffect(() => {
    const count = Math.floor(rand(countMin, countMax + 1));
    const generated: Ball[] = Array.from({ length: count }).map((_, i) => {
      const hex = pick(palette);
      const rgb = hexToRgb(hex);
      const outerAlpha = clamp(rand(0.40, 0.65), 0.4, 0.65);
      const innerAlpha = clamp(rand(0.75, 1), 0.75, 1);

      const size = Math.round(rand(10, 36));
      const left = `${rand(4, 96).toFixed(2)}%`;
      const top = `${rand(2, 94).toFixed(2)}%`;
      const duration = Number(rand(8, 20).toFixed(2));
      const delay = Number(rand(0, 8).toFixed(2));
      const horizAmp = Number(rand(6, 36).toFixed(2));
      const vertAmp = Number(rand(6, 36).toFixed(2));
      const rotate = Number(rand(-12, 12).toFixed(2));

      return { key: `${i}-${hex}-${size}`, hex, rgb, outerAlpha, innerAlpha, size, left, top, duration, delay, horizAmp, vertAmp, rotate };
    });

    setBalls(generated);

  }, [countMin, countMax, palette]);

  if (!balls) return null;

  return (
    <>
      {balls.map((b) => (
        <motion.div aria-hidden key={b.key}
          className="absolute rounded-full pointer-events-none z-0 blur-sm saturate-150"
          initial={{ opacity: 0 }}
          animate={{
            x: [0, b.horizAmp, -b.horizAmp * 0.6, 0],
            y: [0, -b.vertAmp, b.vertAmp * 0.6, 0],
            rotate: [0, b.rotate, -b.rotate * 0.6, 0],
            opacity: [0.75, 1, 0.7],
          }}
          transition={{
            duration: b.duration,
            ease: [0.22, 1, 0.36, 1],
            repeat: Infinity,
            repeatType: 'mirror',
            delay: b.delay,
          }}
          style={{ left: b.left, top: b.top, width: b.size, height: b.size,
            backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,255,255,${b.innerAlpha}) 0%, rgba(${b.rgb},${b.outerAlpha}) 40%, rgba(${b.rgb},0) 70%)`,
            opacity: clamp(rand(0.65, 0.95), 0.45, 1),
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </>
  );
}
