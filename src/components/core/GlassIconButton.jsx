import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GlassIconButton = ({ 
  onClick, 
  icon: Icon, 
  label, 
  subtitle,
  shortcut,
  isActive = false, 
  hasNotification = false,
  notificationCount = 0,
  className = "" 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleHoverStart = () => {
    setIsHovered(true);
    setShowTooltip(true);
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
    setShowTooltip(false);
  };

  return (
    <div className="relative inline-flex">
      <motion.button
        onClick={onClick}
        onFocus={() => { setIsFocused(true); setShowTooltip(true); }}
        onBlur={() => { setIsFocused(false); setShowTooltip(false); }}
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        className={`relative rounded-full flex items-center justify-center group ${className}`}
        style={{
          width: '44px',
          height: '44px',
          padding: '10px',
          background: isActive
            ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.115) 0%, rgba(255, 255, 255, 0.092) 100%)'
            : 'linear-gradient(180deg, rgba(255, 255, 255, 0.082) 0%, rgba(255, 255, 255, 0.062) 100%)',
          backdropFilter: 'blur(22px) saturate(175%)',
          WebkitBackdropFilter: 'blur(22px) saturate(175%)',
          border: isActive 
            ? '1px solid rgba(255,255,255,0.14)'
            : '1px solid rgba(255,255,255,0.10)',
          boxShadow: isActive
            ? `
              0 8px 24px rgba(0,0,0,0.35),
              0 22px 60px rgba(0,0,0,0.55),
              inset 0 0 0 0.5px rgba(255,255,255,0.06),
              inset 0 1.5px 0 rgba(255,255,255,0.12)
            `
            : `
              0 4px 16px rgba(0,0,0,0.28),
              0 12px 36px rgba(0,0,0,0.42),
              inset 0 0 0 0.5px rgba(0,0,0,0.24),
              inset 0 1px 0 rgba(255,255,255,0.08)
            `
        }}
        whileHover={{
          y: -1,
          scale: 1.02,
          backdropFilter: 'blur(24px) saturate(178%)',
          WebkitBackdropFilter: 'blur(24px) saturate(178%)',
          boxShadow: isActive
            ? `
              0 10px 28px rgba(0,0,0,0.38),
              0 24px 64px rgba(0,0,0,0.58),
              inset 0 0 0 0.5px rgba(255,255,255,0.08),
              inset 0 1.5px 0 rgba(255,255,255,0.14)
            `
            : `
              0 6px 20px rgba(0,0,0,0.32),
              0 16px 42px rgba(0,0,0,0.48),
              inset 0 0 0 0.5px rgba(0,0,0,0.20),
              inset 0 1.5px 0 rgba(255,255,255,0.11)
            `,
          transition: { duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }
        }}
        whileTap={{ 
          scale: 0.98,
          y: 0,
          transition: { duration: 0.08, ease: [0.32, 0.08, 0.24, 1] }
        }}
        aria-label={`${label}${subtitle ? `: ${subtitle}` : ''}`}
      >
        {/* Material grain */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            opacity: 0.018,
            mixBlendMode: 'overlay'
          }}
        />

        {/* Focus Ring */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.16 }}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                boxShadow: '0 0 0 3px rgba(94, 167, 255, 0.35), 0 0 12px rgba(94, 167, 255, 0.25)',
              }}
            />
          )}
        </AnimatePresence>

        {/* Active State Ring */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              boxShadow: 'inset 0 0 0 1.5px rgba(94, 167, 255, 0.32), 0 0 16px rgba(94, 167, 255, 0.20)'
            }}
          />
        )}

        {/* Icon */}
        <motion.div 
          className="relative z-10 flex items-center justify-center"
          animate={{
            y: isPressed ? 0.5 : (isHovered ? -0.5 : 0),
            opacity: isActive ? 1.00 : (isHovered ? 0.95 : 0.85)
          }}
          transition={{ 
            duration: 0.16, 
            ease: [0.26, 0.11, 0.26, 1.0]
          }}
        >
          <Icon 
            className="w-5 h-5 relative" 
            style={{ 
              color: isActive ? '#E5EEFF' : '#B8C5D6',
              strokeWidth: 2.0,
              filter: isActive ? 'drop-shadow(0 0 6px rgba(94, 167, 255, 0.25))' : 'none'
            }} 
          />
        </motion.div>

        {/* Notification Badge */}
        {hasNotification && (
          <motion.div
            className="absolute"
            style={{
              top: '2px',
              right: '2px',
              width: notificationCount > 0 ? 'auto' : '8px',
              height: '8px',
              minWidth: '8px',
              padding: notificationCount > 0 ? '0 4px' : '0',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, rgba(148, 110, 233, 0.95) 0%, rgba(128, 90, 213, 0.92) 100%)',
              border: '1.5px solid rgba(0, 0, 0, 0.32)',
              boxShadow: '0 0 10px rgba(138, 100, 223, 0.40), inset 0 0.5px 1px rgba(255,255,255,0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '-0.02em'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: [0.90, 0.98, 0.90],
            }}
            transition={{
              scale: { duration: 0.2, ease: [0.22, 0.61, 0.36, 1] },
              opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            {notificationCount > 0 && <span>{notificationCount > 9 ? '9+' : notificationCount}</span>}
            
            {/* Badge highlight */}
            <div
              className="absolute top-0 left-1/4 w-1/2 h-1/2 rounded-full pointer-events-none"
              style={{
                background: 'rgba(255,255,255,0.38)',
                filter: 'blur(1px)'
              }}
            />
          </motion.div>
        )}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.16, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute pointer-events-none z-[300]"
            style={{
              top: 'calc(100% + 12px)',
              left: '50%',
              transform: 'translateX(-50%)',
              minWidth: '160px',
              maxWidth: '220px',
              whiteSpace: 'nowrap'
            }}
          >
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                padding: '10px 14px',
                background: 'linear-gradient(180deg, rgba(28, 32, 38, 0.96) 0%, rgba(22, 26, 31, 0.98) 100%)',
                backdropFilter: 'blur(20px) saturate(165%)',
                WebkitBackdropFilter: 'blur(20px) saturate(165%)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: `
                  0 8px 24px rgba(0,0,0,0.45),
                  0 20px 56px rgba(0,0,0,0.65),
                  inset 0 0 0 0.5px rgba(0,0,0,0.28),
                  inset 0 1px 0 rgba(255,255,255,0.10)
                `
              }}
            >
              {/* Grain */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  opacity: 0.022,
                  mixBlendMode: 'overlay'
                }}
              />

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-3 mb-0.5">
                  <span 
                    className="font-semibold"
                    style={{ 
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.95)',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    {label}
                  </span>
                  {shortcut && (
                    <div
                      className="rounded-md px-1.5 py-0.5"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.10)',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'rgba(255,255,255,0.65)',
                        letterSpacing: '0.02em'
                      }}
                    >
                      {shortcut}
                    </div>
                  )}
                </div>
                {subtitle && (
                  <p 
                    style={{ 
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.72)',
                      lineHeight: 1.4,
                      margin: 0
                    }}
                  >
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Arrow */}
              <div
                className="absolute"
                style={{
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderBottom: '6px solid rgba(28, 32, 38, 0.96)',
                  filter: 'drop-shadow(0 -1px 0 rgba(255,255,255,0.08))'
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlassIconButton;