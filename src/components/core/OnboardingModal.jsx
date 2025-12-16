import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const GLASS = {
  modal: {
    bg: 'linear-gradient(135deg, rgba(18, 26, 46, 0.72) 0%, rgba(12, 18, 32, 0.68) 100%)',
    blur: 'blur(80px) saturate(165%)',
    radius: '28px',
    border: '1px solid rgba(255,255,255,0.10)',
    innerGlow: 'inset 0 0 60px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.10)'
  }
};

export default function OnboardingModal({ isOpen, onAccept }) {
  const [isChecked, setIsChecked] = useState(false);
  const [isHoveringCTA, setIsHoveringCTA] = useState(false);

  const handleAccept = () => {
    if (isChecked) {
      onAccept();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999]"
            style={{
              background: 'rgba(0, 0, 0, 0.55)',
              backdropFilter: 'blur(20px) saturate(120%)',
              WebkitBackdropFilter: 'blur(20px) saturate(120%)'
            }}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-xl pointer-events-auto"
              style={{
                background: GLASS.modal.bg,
                backdropFilter: GLASS.modal.blur,
                WebkitBackdropFilter: GLASS.modal.blur,
                borderRadius: GLASS.modal.radius,
                border: GLASS.modal.border,
                boxShadow: `${GLASS.modal.innerGlow}, 0 25px 80px -20px rgba(0,0,0,0.65)`
              }}
            >
              {/* Top specular edge */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '12%',
                right: '12%',
                height: '1.5px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)',
                pointerEvents: 'none',
                borderRadius: '28px 28px 0 0'
              }} />

              {/* Ambient glow */}
              <div style={{
                position: 'absolute',
                top: '-40px',
                left: '20%',
                width: '60%',
                height: '100px',
                background: 'radial-gradient(ellipse at 50% 100%, rgba(110, 160, 255, 0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
                filter: 'blur(35px)'
              }} />

              {/* Noise grain texture */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                opacity: 0.020,
                mixBlendMode: 'overlay',
                borderRadius: '28px',
                pointerEvents: 'none'
              }} />

              {/* Vertical gradient depth */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 40%, rgba(0,0,0,0.08) 100%)',
                borderRadius: '28px',
                pointerEvents: 'none'
              }} />

              <div className="relative z-10 p-10">
                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="text-3xl font-bold tracking-tight text-white mb-6"
                >
                  Before You Start
                </motion.h2>

                {/* Body Text */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="space-y-4 mb-8 text-gray-200 text-[15px] leading-relaxed"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}
                >
                  <p>
                    Vireon provides AI-generated market insights for educational and informational purposes only.
                  </p>
                  <p>
                    Vireon does not provide investment advice, financial recommendations, or guarantees of future outcomes.
                  </p>
                  <p>
                    Financial markets are unpredictable. Any insights, interpretations, or probability-based explanations shown in Vireon may be incorrect and should not be relied on as the sole basis for investment decisions.
                  </p>
                  <p>
                    You are fully responsible for your investment decisions. Always do your own research or consult a licensed financial professional.
                  </p>
                </motion.div>

                {/* Checkbox */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mb-8"
                >
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex-shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                        className="sr-only"
                      />
                      <motion.div
                        className="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors duration-200 relative overflow-hidden"
                        style={{
                          borderColor: isChecked ? 'rgba(110, 160, 255, 0.60)' : 'rgba(255,255,255,0.20)',
                          background: isChecked 
                            ? 'linear-gradient(135deg, rgba(110, 160, 255, 0.28) 0%, rgba(80, 140, 235, 0.22) 100%)'
                            : 'rgba(255,255,255,0.04)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          boxShadow: isChecked 
                            ? 'inset 0 1px 0 rgba(255,255,255,0.15), 0 0 15px rgba(110, 160, 255, 0.15)'
                            : 'inset 0 1px 0 rgba(255,255,255,0.08)'
                        }}
                        whileHover={{ 
                          borderColor: isChecked ? 'rgba(110, 160, 255, 0.80)' : 'rgba(255,255,255,0.35)',
                          scale: 1.05
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {/* Checkbox specular */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: '15%',
                          right: '15%',
                          height: '1px',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)',
                          pointerEvents: 'none'
                        }} />
                        <AnimatePresence>
                          {isChecked && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Check className="w-4 h-4 text-white" strokeWidth={3} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                    <span className="text-[15px] font-medium text-gray-200 group-hover:text-white transition-colors">
                      I understand and agree
                    </span>
                  </label>
                </motion.div>

                {/* CTA Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  onClick={handleAccept}
                  disabled={!isChecked}
                  onMouseEnter={() => setIsHoveringCTA(true)}
                  onMouseLeave={() => setIsHoveringCTA(false)}
                  className="w-full relative overflow-hidden rounded-2xl py-4 font-semibold text-[15px] transition-all duration-300"
                  style={{
                    background: isChecked
                      ? 'linear-gradient(135deg, rgba(110, 160, 255, 0.78) 0%, rgba(80, 140, 235, 0.72) 100%)'
                      : 'rgba(255,255,255,0.06)',
                    backdropFilter: isChecked ? 'blur(20px) saturate(150%)' : 'blur(15px)',
                    WebkitBackdropFilter: isChecked ? 'blur(20px) saturate(150%)' : 'blur(15px)',
                    color: isChecked ? '#ffffff' : 'rgba(255,255,255,0.28)',
                    cursor: isChecked ? 'pointer' : 'not-allowed',
                    border: isChecked ? '1px solid rgba(110, 160, 255, 0.38)' : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: isChecked && isHoveringCTA
                      ? '0 12px 40px -15px rgba(110, 160, 255, 0.45), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 0 30px rgba(110, 160, 255, 0.10)'
                      : isChecked
                      ? '0 8px 30px -12px rgba(110, 160, 255, 0.32), inset 0 1px 0 rgba(255,255,255,0.14)'
                      : 'inset 0 1px 0 rgba(255,255,255,0.05)'
                  }}
                  whileHover={isChecked ? { y: -2, scale: 1.01 } : {}}
                  whileTap={isChecked ? { scale: 0.98 } : {}}
                >
                  {/* Top specular for button */}
                  {isChecked && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: '15%',
                      right: '15%',
                      height: '1px',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
                      pointerEvents: 'none'
                    }} />
                  )}
                  Continue to Vireon
                </motion.button>

                {/* Secondary Link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mt-6 text-center"
                >
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      // Add link to terms page when available
                    }}
                    className="text-xs text-gray-500 hover:text-gray-400 transition-colors underline"
                  >
                    View full Terms & Risk Disclosure
                  </a>
                </motion.div>

                {/* Micro Disclaimer */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="mt-4 text-center text-[11px] text-gray-600"
                >
                  For informational purposes only. Not investment advice.
                </motion.p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}