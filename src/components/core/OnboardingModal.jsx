import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const GLASS = {
  modal: {
    bg: 'rgba(18, 22, 30, 0.88)',
    blur: 'blur(60px) saturate(175%)',
    radius: '28px',
    border: '1px solid rgba(255,255,255,0.12)',
    innerGlow: 'inset 0 1px 0 rgba(255,255,255,0.10)'
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
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)'
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
                background: 'radial-gradient(ellipse at 50% 100%, rgba(110, 160, 255, 0.10) 0%, transparent 70%)',
                pointerEvents: 'none',
                filter: 'blur(30px)'
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
                  className="space-y-4 mb-8 text-gray-300 text-[15px] leading-relaxed"
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
                        className="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors duration-200"
                        style={{
                          borderColor: isChecked ? 'rgba(110, 160, 255, 0.60)' : 'rgba(255,255,255,0.25)',
                          background: isChecked 
                            ? 'linear-gradient(135deg, rgba(110, 160, 255, 0.30) 0%, rgba(80, 140, 235, 0.25) 100%)'
                            : 'rgba(255,255,255,0.05)'
                        }}
                        whileHover={{ 
                          borderColor: isChecked ? 'rgba(110, 160, 255, 0.80)' : 'rgba(255,255,255,0.40)',
                          scale: 1.05
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
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
                      ? 'linear-gradient(135deg, rgba(110, 160, 255, 0.85) 0%, rgba(80, 140, 235, 0.80) 100%)'
                      : 'rgba(255,255,255,0.08)',
                    color: isChecked ? '#ffffff' : 'rgba(255,255,255,0.30)',
                    cursor: isChecked ? 'pointer' : 'not-allowed',
                    border: isChecked ? '1px solid rgba(110, 160, 255, 0.40)' : '1px solid rgba(255,255,255,0.10)',
                    boxShadow: isChecked && isHoveringCTA
                      ? '0 12px 40px -15px rgba(110, 160, 255, 0.50), inset 0 1px 0 rgba(255,255,255,0.20)'
                      : isChecked
                      ? '0 8px 30px -12px rgba(110, 160, 255, 0.35), inset 0 1px 0 rgba(255,255,255,0.15)'
                      : 'none'
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