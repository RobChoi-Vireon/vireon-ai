import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function OriBotAvatar({ size = 16, className = "" }) {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const scheduleBlink = () => {
      const delay = 2500 + Math.random() * 3000;
      return setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          scheduleBlink();
        }, 150);
      }, delay);
    };
    const t = scheduleBlink();
    return () => clearTimeout(t);
  }, []);

  const s = size;

  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Antenna */}
      <motion.line
        x1="16" y1="2" x2="16" y2="7"
        stroke="#4DA3FF" strokeWidth="1.8" strokeLinecap="round"
        animate={{ scaleY: [1, 1.15, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: '16px 7px' }}
      />
      <motion.circle
        cx="16" cy="2" r="1.5"
        fill="#4DA3FF"
        animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.2, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: '16px 2px' }}
      />

      {/* Head */}
      <rect x="6" y="7" width="20" height="16" rx="5" ry="5"
        fill="rgba(77, 163, 255, 0.12)"
        stroke="#4DA3FF"
        strokeWidth="1.4"
      />

      {/* Eyes */}
      <motion.rect
        x="10" y="12"
        width="4" height={blink ? 0.8 : 4}
        rx="2"
        fill="#4DA3FF"
        animate={{ height: blink ? 0.8 : 4 }}
        transition={{ duration: 0.08 }}
        style={{ transformOrigin: '12px 14px' }}
      />
      <motion.rect
        x="18" y="12"
        width="4" height={blink ? 0.8 : 4}
        rx="2"
        fill="#4DA3FF"
        animate={{ height: blink ? 0.8 : 4 }}
        transition={{ duration: 0.08 }}
        style={{ transformOrigin: '20px 14px' }}
      />

      {/* Mouth — subtle smile */}
      <path
        d="M12 20 Q16 23 20 20"
        stroke="#4DA3FF"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Ear bolts */}
      <circle cx="6" cy="15" r="1.5" fill="#4DA3FF" opacity="0.5" />
      <circle cx="26" cy="15" r="1.5" fill="#4DA3FF" opacity="0.5" />
    </svg>
  );
}