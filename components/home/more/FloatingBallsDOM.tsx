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
    const vw = window.innerWidth;

    const breakpointPercent = vw >= 1024 ? 5 : vw >= 768 ? 6 : 8;

    const maxPx = vw >= 768 ? 96 : 40;

    const rawFramePx = (vw * breakpointPercent) / 100;
    const framePx = Math.min(rawFramePx, maxPx);
    const effectiveFramePercent = (framePx / vw) * 100;
    const leftBoundPct = effectiveFramePercent;
    const rightBoundPct = effectiveFramePercent;
    const availablePct = Math.max(0, 100 - leftBoundPct - rightBoundPct);

    const count = Math.floor(rand(countMin, countMax + 1));
    const generated: Ball[] = Array.from({ length: count }).map((_, i) => {
      const hex = pick(palette);
      const rgb = hexToRgb(hex);
      const outerAlpha = clamp(rand(0.40, 0.65), 0.4, 0.65);
      const innerAlpha = clamp(rand(0.75, 1), 0.75, 1);

      const size = Math.round(rand(30, 50));
      const sizePct = (size / vw) * 100;
      const maxOffsetForBall = Math.max(0, availablePct - sizePct);
      const leftPct = leftBoundPct + rand(0, maxOffsetForBall);
      const topPct = rand(2, 94);

      const duration = Number(rand(8, 20).toFixed(2));
      const delay = Number(rand(0, 8).toFixed(2));
      const horizAmp = Number(rand(6, 36).toFixed(2));
      const vertAmp = Number(rand(6, 36).toFixed(2));
      const rotate = Number(rand(-12, 12).toFixed(2));

      return { key: `${i}-${hex}-${size}`, hex, rgb, outerAlpha, innerAlpha, size, left: `${leftPct.toFixed(2)}%`, 
      top: `${topPct.toFixed(2)}%`, duration, delay, horizAmp, vertAmp, rotate };
    });

    setBalls(generated);
    
    const onResize = () => {
      setBalls(null);
      setTimeout(() => {
        const vwNow = window.innerWidth;
        const breakpointPercentNow = vwNow >= 1024 ? 5 : vwNow >= 768 ? 6 : 8;
        const maxPxNow = vwNow >= 768 ? 96 : 40;
        const rawFramePxNow = (vwNow * breakpointPercentNow) / 100;
        const framePxNow = Math.min(rawFramePxNow, maxPxNow);
        const effFramePctNow = (framePxNow / vwNow) * 100;
        const leftBoundPctNow = effFramePctNow;
        const rightBoundPctNow = effFramePctNow;
        const availablePctNow = Math.max(0, 100 - leftBoundPctNow - rightBoundPctNow);

        const newGen: Ball[] = Array.from({ length: count }).map((_, i) => {
          const hex2 = pick(palette);
          const rgb2 = hexToRgb(hex2);
          const outerAlpha2 = clamp(rand(0.40, 0.65), 0.4, 0.65);
          const innerAlpha2 = clamp(rand(0.75, 1), 0.75, 1);
          const size2 = Math.round(rand(30, 50));
          const sizePct2 = (size2 / vwNow) * 100;
          const maxOffsetForBall2 = Math.max(0, availablePctNow - sizePct2);
          const leftPct2 = leftBoundPctNow + rand(0, maxOffsetForBall2);
          const topPct2 = rand(2, 94);
          const duration2 = Number(rand(8, 20).toFixed(2));
          const delay2 = Number(rand(0, 8).toFixed(2));
          const horizAmp2 = Number(rand(6, 36).toFixed(2));
          const vertAmp2 = Number(rand(6, 36).toFixed(2));
          const rotate2 = Number(rand(-12, 12).toFixed(2));
          return { key: `${i}-${hex2}-${size2}`, hex: hex2, rgb: rgb2, outerAlpha: outerAlpha2, innerAlpha: innerAlpha2, 
          size: size2, left: `${leftPct2.toFixed(2)}%`, top: `${topPct2.toFixed(2)}%`, duration: duration2, delay: delay2, 
          horizAmp: horizAmp2, vertAmp: vertAmp2, rotate: rotate2 } as Ball;
        });
        setBalls(newGen);
      }, 80);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
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
            backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,255,255,${b.innerAlpha}) 0%, rgba(${b.rgb},.5) 40%, rgba(${b.rgb},0) 70%)`,
            opacity: clamp(rand(0.65, 0.95), 0.45, 1),
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </>
  );
}
