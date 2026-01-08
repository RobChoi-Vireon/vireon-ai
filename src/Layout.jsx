import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Eye, TrendingUp, Bell, AlertCircle, Plus, Download, Newspaper, Search, MessageSquare, X, Calendar, BookOpen, Brain, Globe, Activity, User } from "lucide-react";
import { FeatureFlagsProvider, useFeatureFlags } from "./components/core/FeatureFlags";
import { MiniSheetProvider, useMiniSheet } from './components/core/MiniSheetProvider';
import { AccessibilityProvider } from "./components/core/AccessibilityProvider";
import { ThemeProvider, useTheme } from "./components/core/ThemeProvider";
import LabsToggle from "./components/core/LabsToggle";
import SearchOmni from "./components/global/SearchOmni";
import LiveCommentary from "./components/live-feed/LiveCommentary";
import LyraChatbot from "./components/core/LyraChatbot";
import UserMenu from "./components/core/UserMenu";
import GlassIconButton from "./components/core/GlassIconButton";
import OnboardingModal from "./components/core/OnboardingModal";
import UtilityTrayPill from "./components/core/UtilityTrayPill";
import { motion, AnimatePresence } from 'framer-motion';
import NetworkErrorBoundary from "./components/core/NetworkErrorBoundary";
import { base44 } from "@/api/base44Client";

const HORIZON_SPRING = { type: "spring", stiffness: 320, damping: 82, mass: 1 };
const HORIZON_EASE = [0.26, 0.11, 0.26, 1.0];

const NavLink = ({ href, icon: Icon, title, isActive }) => (
  <Link
    to={href}
    className="group relative flex items-center tap-highlight-transparent"
    style={{ textDecoration: 'none' }}
  >
    <motion.div
      className="relative w-full rounded-[22px] overflow-hidden"
      style={{
        padding: '13px 18px',
        minHeight: '52px',
        display: 'flex',
        alignItems: 'center',
        background: isActive 
          ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.12) 100%)'
          : 'linear-gradient(180deg, rgba(255, 255, 255, 0.068) 0%, rgba(255, 255, 255, 0.045) 100%)',
        backdropFilter: isActive ? 'blur(32px) saturate(168%)' : 'blur(28px) saturate(165%)',
        WebkitBackdropFilter: isActive ? 'blur(32px) saturate(168%)' : 'blur(28px) saturate(165%)',
        border: isActive ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: isActive 
          ? `
            inset 0 1.5px 0 rgba(255,255,255,0.20),
            inset 0 0 32px rgba(110, 185, 255, 0.22),
            0 4px 16px rgba(0,0,0,0.12),
            0 0 34px rgba(110, 185, 255, 0.14)
          `
          : `
            inset 0 0.5px 1px rgba(255,255,255,0.05),
            0 2px 8px rgba(0,0,0,0.05)
          `
      }}
      whileHover={!isActive ? {
        y: -1,
        scale: 1.008,
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.095) 0%, rgba(255, 255, 255, 0.065) 100%)',
        boxShadow: `
          inset 0 1px 2px rgba(255,255,255,0.10),
          0 4px 14px rgba(0,0,0,0.10),
          0 0 20px rgba(100, 180, 255, 0.05)
        `,
        transition: { duration: 0.13, ease: 'easeOut' }
      } : {}}
      whileTap={{ scale: 0.98, transition: { duration: 0.08 } }}
      animate={isActive ? { 
        scale: 1.01,
        transition: { duration: 0.2, ease: HORIZON_EASE }
      } : { scale: 1 }}
    >
      {isActive && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '16%',
          right: '16%',
          height: '1.5px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.24), transparent)',
          pointerEvents: 'none',
          zIndex: 10
        }} />
      )}

      {!isActive && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '18%',
          right: '18%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
          pointerEvents: 'none'
        }} />
      )}

      {isActive && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 35%, rgba(110, 185, 255, 0.12) 0%, transparent 72%)',
          borderRadius: '22px',
          pointerEvents: 'none'
        }} />
      )}

      <div className="flex items-center space-x-3.5 relative z-10">
        <Icon 
          className="w-[18px] h-[18px]" 
          style={{ 
            color: isActive ? '#D7E3FF' : '#9BA3B0',
            strokeWidth: 1.5,
            filter: isActive ? 'drop-shadow(0 0 12px rgba(110, 185, 255, 0.55)) brightness(1.12)' : 'none',
            transition: 'filter 0.13s ease-out'
          }} 
        />
        <span 
          className="font-medium tracking-[-0.005em]"
          style={{
            fontSize: '15px',
            color: isActive ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.70)',
            transition: 'color 0.13s ease-out'
          }}
        >
          {title}
        </span>
      </div>
    </motion.div>
  </Link>
);

function LayoutContent({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCommentaryOpen, setIsCommentaryOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isEnabled } = useFeatureFlags();

  const [isDisclaimerVisible, setIsDisclaimerVisible] = useState(false);
  const [initialPinchDistance, setInitialPinchDistance] = useState(null);
  const [isPinching, setIsPinching] = useState(false);
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    if (location.pathname === '/') {
      navigate(createPageUrl('MacroSignals'), { replace: true });
    }
  }, [location.pathname, navigate]);

  // Check if user has accepted risk disclaimer
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const user = await base44.auth.me();
        if (user) {
          const prefs = await base44.entities.UserPreference.filter({ created_by: user.email });
          if (prefs.length > 0 && prefs[0].accepted_risk_disclaimer) {
            setShowOnboarding(false);
          } else {
            setShowOnboarding(true);
          }
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setIsCheckingOnboarding(false);
      }
    };
    checkOnboarding();
  }, []);

  const handleOnboardingAccept = async () => {
    try {
      const user = await base44.auth.me();
      if (user) {
        const prefs = await base44.entities.UserPreference.filter({ created_by: user.email });
        if (prefs.length > 0) {
          await base44.entities.UserPreference.update(prefs[0].id, { accepted_risk_disclaimer: true });
        } else {
          await base44.entities.UserPreference.create({ accepted_risk_disclaimer: true });
        }
      }
      setShowOnboarding(false);
    } catch (error) {
      console.error('Error saving onboarding acceptance:', error);
    }
  };
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('vireon-disclaimer-dismissed');
      if (!dismissed) {
        setIsDisclaimerVisible(true);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      document.documentElement.classList.add('transitions-enabled');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isAlertsOpen) {
          setIsAlertsOpen(false);
        } else if (isSearchOpen) {
          setIsSearchOpen(false);
        } else if (isCommentaryOpen) {
          setIsCommentaryOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAlertsOpen, isSearchOpen, isCommentaryOpen]);

  useEffect(() => {
    const isAnyModalOpen = isAlertsOpen || isSearchOpen || isCommentaryOpen;
    if (!isAnyModalOpen) return;

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + 
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        setInitialPinchDistance(distance);
        setIsPinching(true);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && isPinching && initialPinchDistance) {
        e.preventDefault();
        
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + 
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        
        const pinchRatio = currentDistance / initialPinchDistance;
        
        if (pinchRatio < 0.8) {
          if (navigator.vibrate) {
            navigator.vibrate([25, 50, 25]);
          }
          if (isAlertsOpen) setIsAlertsOpen(false);
          if (isSearchOpen) setIsSearchOpen(false);
          if (isCommentaryOpen) setIsCommentaryOpen(false);

          setIsPinching(false);
          setInitialPinchDistance(null);
        }
      }
    };

    const handleTouchEnd = (e) => {
      if (e.touches.length < 2) {
        setIsPinching(false);
        setInitialPinchDistance(null);
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isAlertsOpen, isSearchOpen, isCommentaryOpen, isPinching, initialPinchDistance]);

  const handleDismissDisclaimer = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vireon-disclaimer-dismissed', 'true');
    }
    setIsDisclaimerVisible(false);
  };

  const navItems = [
    { id: 'macrosignals', title: 'Macro Signals', href: createPageUrl('MacroSignals'), icon: Globe },
    { id: 'home', title: 'Market Pulse', href: createPageUrl('Home'), icon: Activity },
    { id: 'insights', title: 'AI Insights', href: createPageUrl('Insights'), icon: Brain },
    { id: 'watchlist', title: 'Watchlist', href: createPageUrl('Watchlist'), icon: Eye },
    { id: 'livefeed', title: 'Live Feed', href: createPageUrl('LiveFeed'), icon: Newspaper },
    { id: 'capitalvault', title: 'Capital Vault', href: createPageUrl('CapitalVault'), icon: BookOpen },
  ];

  const currentTab = navItems.find(item => location.pathname === item.href);
  const pageTitle = currentPageName === 'Me' ? 'My Profile' : (currentTab?.title || 'Vireon');


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        :root {
          --z-app: 10;
          --z-popover: 40;
          --z-tooltip: 45;
          --z-modal: 50;
          --z-toast: 60;
          --z-devtools: 70;
          --header-h: 72px;
          --bg: #0B0E13;
          --card: rgba(18, 20, 28, 0.65);
          --border: #2C2F36;
          --shadow: rgba(0, 0, 0, 0.45);
          --text-primary: #F3F5F7;
          --text-secondary: #B6BDCB;
          --text-tertiary: #7E8798;
          --muted: #5B6170;
          --accent: #4DA3FF;
          --bull: #58E3A4;
          --bear: #FF6A7A;
          --neutral: #A8B3C7;
          --chart-bg: #0F1115;
          --chart-grid: #242833;
          --chart-text: #B6BDCB;
          --scrim: rgba(0, 0, 0, 0.55);
        }
        
        html:not(.transitions-enabled) * {
          transition: none !important;
        }
        
        html.transitions-enabled * {
          transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease, opacity 200ms ease, transform 200ms ease, box-shadow 200ms ease !important;
        }
        
        html { background-color: #0B0E13; }
        
        .vireon-portal-container {
          position: relative;
          z-index: var(--z-modal);
        }
        
        .drawer-overlay {
          position: fixed;
          inset: 0;
          z-index: var(--z-modal);
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        
        .drawer-panel {
          position: fixed;
          z-index: calc(var(--z-modal) + 1);
          background: rgba(18, 20, 25, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
          overscroll-behavior: contain;
        }
        
        body.drawer-open {
          overflow: hidden;
          position: fixed;
          width: 100%;
        }
        
        .elevation-0 { background: var(--bg); }
        .elevation-1 {
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: 0 2px 12px var(--shadow);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .elevation-2 {
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: 0 8px 32px var(--shadow);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .elevation-3 {
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: 0 16px 64px var(--shadow);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            transform: none !important;
          }
        }

        *:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
          z-index: calc(var(--z-modal) + 2);
        }

        @media (prefers-contrast: high) {
          * {
            border-color: currentColor !important;
          }
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb {
          background: var(--muted);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: var(--text-tertiary);
        }

        @supports (padding: max(0px)) {
          .drawer-panel-bottom {
            padding-bottom: max(env(safe-area-inset-bottom), 16px);
          }
          .drawer-panel-top {
            top: max(var(--header-h), env(safe-area-inset-top));
          }
        }

        .animate-shimmer {
          background: linear-gradient(90deg, var(--card) 0%, var(--border) 50%, var(--card) 100%);
          background-size: 200% 100%;
          animation: shimmer 1.3s infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .card-hover {
          transition: transform 150ms ease-out, box-shadow 150ms ease-out;
        }
        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px var(--shadow);
        }
        @media (prefers-reduced-motion: reduce) {
          .card-hover:hover { transform: none; }
        }

        .tap-highlight-transparent {
          -webkit-tap-highlight-color: transparent;
        }
        
        body {
          font-size: 15px;
          line-height: 1.5;
          color: var(--text-primary);
          background: var(--bg);
        }
        
        @media (max-width: 768px) {
          :root { --header-h: 60px; }
          body {
            font-size: 14px;
            line-height: 1.55;
          }
        }
        
        .toast-success {
          background: rgba(43, 190, 118, 0.08);
          border: 1px solid rgba(43, 190, 118, 0.15);
          color: var(--bull);
        }
        .toast-error {
          background: rgba(227, 63, 95, 0.08);
          border: 1px solid rgba(227, 63, 95, 0.15);
          color: var(--bear);
        }
      `}</style>

      <NetworkErrorBoundary>
        <div className="flex h-screen transition-all duration-500 ease-out elevation-0">

          {/* Desktop Sidebar */}
          <aside className="hidden md:flex flex-col w-[280px] p-8 relative">
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `
                linear-gradient(180deg, 
                  rgba(19, 21, 26, 0.90) 0%, 
                  rgba(15, 17, 21, 0.94) 50%,
                  rgba(11, 13, 17, 0.96) 100%)
              `,
              backdropFilter: 'blur(32px) saturate(165%)',
              WebkitBackdropFilter: 'blur(32px) saturate(165%)',
              borderRight: '1px solid rgba(255,255,255,0.05)',
              boxShadow: `
                inset 0 0 1px rgba(255,255,255,0.04),
                2px 0 50px rgba(0,0,0,0.22)
              `,
              pointerEvents: 'none'
            }} />

            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '35%',
              background: 'linear-gradient(180deg, rgba(155, 140, 200, 0.020) 0%, transparent 100%)',
              pointerEvents: 'none'
            }} />

            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '35%',
              background: 'linear-gradient(0deg, rgba(90, 115, 145, 0.020) 0%, transparent 100%)',
              pointerEvents: 'none'
            }} />

            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              width: '140px',
              height: '80px',
              background: 'radial-gradient(ellipse at 50% 50%, rgba(130, 150, 255, 0.035) 0%, transparent 70%)',
              filter: 'blur(35px)',
              pointerEvents: 'none',
              mixBlendMode: 'soft-light',
              zIndex: 1
            }} />

            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: HORIZON_EASE }}
              style={{ marginBottom: '28px', position: 'relative', zIndex: 10 }}
            >
              <Link 
                to={createPageUrl('MacroSignals')} 
                className="flex items-center gap-3 px-1 group relative"
                style={{
                  paddingTop: '6px',
                  paddingBottom: '6px',
                  minHeight: '56px'
                }}
              >
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68943f7eb0fb9393bf9a8069/ea91941d0_Asset61xtransparent.png" 
                  alt="Vireon Logo" 
                  className="w-10 h-10 rounded-lg transition-transform duration-200 ease-out group-hover:scale-105"
                  style={{ 
                    boxShadow: '0 0 18px rgba(110, 150, 255, 0.46), 0 0 9px rgba(110, 150, 255, 0.30)'
                  }}
                />
                <span 
                  className="font-semibold text-xl tracking-tight"
                  style={{
                    background: 'linear-gradient(to right, #A774FF, #4EC8FF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Vireon
                </span>
              </Link>
            </motion.div>

            <nav className="flex flex-col space-y-2.5 px-1 relative z-10">
              {navItems.map(item => (
                <NavLink key={item.id} {...item} isActive={location.pathname === item.href} />
              ))}
            </nav>

            <div className="relative z-10" style={{ marginTop: 'auto' }}>
              <div 
                className="text-[10px] font-medium uppercase tracking-wider mb-3 px-1"
                style={{ 
                  color: 'rgba(255,255,255,0.48)',
                  letterSpacing: '0.06em',
                  fontWeight: 500
                }}
              >
                Market Status
              </div>

              <div style={{
                position: 'absolute',
                top: '-16px',
                left: '10%',
                right: '10%',
                height: '12px',
                background: 'linear-gradient(to bottom, rgba(50, 194, 136, 0.04) 0%, transparent 100%)',
                filter: 'blur(8px)',
                pointerEvents: 'none'
              }} />

              <motion.div 
                className="relative rounded-[20px] overflow-hidden"
                style={{
                  padding: '14px 18px',
                  background: 'linear-gradient(135deg, rgba(50, 194, 136, 0.11) 0%, rgba(40, 174, 116, 0.09) 100%)',
                  backdropFilter: 'blur(32px) saturate(168%)',
                  WebkitBackdropFilter: 'blur(32px) saturate(168%)',
                  border: '1px solid rgba(50, 194, 136, 0.18)',
                  boxShadow: `
                    inset 0 1.5px 0 rgba(255,255,255,0.12),
                    inset 0 0 22px rgba(50, 194, 136, 0.09),
                    0 4px 16px rgba(0,0,0,0.08),
                    0 26px 30px -8px rgba(0,0,0,0.08)
                  `
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, ...HORIZON_SPRING }}
              >
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.030) 0%, rgba(0,0,0,0.030) 100%)',
                  borderRadius: '20px',
                  pointerEvents: 'none'
                }} />

                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '15%',
                  right: '15%',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
                  pointerEvents: 'none'
                }} />

                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(ellipse at 50% 30%, rgba(50, 194, 136, 0.08) 0%, transparent 70%)',
                  borderRadius: '20px',
                  pointerEvents: 'none'
                }} />

                <div className="flex items-center space-x-3 relative z-10">
                  <div className="relative">
                    <motion.div 
                      className="w-2.5 h-2.5 rounded-full relative"
                      style={{
                        background: 'linear-gradient(135deg, rgba(88, 227, 164, 1) 0%, rgba(50, 194, 136, 0.95) 100%)',
                        boxShadow: `
                          0 0 16px rgba(88, 227, 164, 0.55),
                          inset 0 1px 1px rgba(255,255,255,0.38),
                          inset 0 -1px 2px rgba(0,0,0,0.22)
                        `
                      }}
                      animate={{ 
                        boxShadow: [
                          '0 0 16px rgba(88, 227, 164, 0.55), inset 0 1px 1px rgba(255,255,255,0.38), inset 0 -1px 2px rgba(0,0,0,0.22)',
                          '0 0 22px rgba(88, 227, 164, 0.65), inset 0 1px 1px rgba(255,255,255,0.38), inset 0 -1px 2px rgba(0,0,0,0.22)',
                          '0 0 16px rgba(88, 227, 164, 0.55), inset 0 1px 1px rgba(255,255,255,0.38), inset 0 -1px 2px rgba(0,0,0,0.22)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '0.5px',
                        left: '0.5px',
                        width: '3.5px',
                        height: '3.5px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.58)',
                        filter: 'blur(0.5px)',
                        pointerEvents: 'none'
                      }} />
                    </motion.div>

                    <motion.div 
                      className="absolute inset-0 w-2.5 h-2.5 rounded-full"
                      style={{
                        background: 'rgba(88, 227, 164, 0.30)',
                        boxShadow: '0 0 10px rgba(88, 227, 164, 0.45)'
                      }}
                      animate={{ scale: [1, 1.8, 1], opacity: [0.7, 0, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: '#58E3A4' }}>
                      Market Open
                    </p>
                    <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.56)', marginTop: '1px' }}>
                      Live data streaming
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </aside>

          <div className="flex-1 flex flex-col overflow-hidden">
            {/* OS Horizon V2 Utility Tray — Dynamic Scroll-Reactive HUD */}
            <UtilityTrayPill isOverlayOpen={isAlertsOpen || isSearchOpen || isCommentaryOpen}>
              {/* OS Horizon V3 Semantic Grouping: Cluster A (Search + Commentary) */}
              {isEnabled('labs_modules') && (
                <div className="flex items-center" style={{ gap: '12px', marginRight: '16px' }}>
                  <GlassIconButton
                    onClick={() => setIsSearchOpen(true)}
                    icon={Search}
                    label="Search"
                    subtitle="Tickers, news, macro data"
                    shortcut="⌘K"
                  />

                  <GlassIconButton
                    onClick={() => setIsCommentaryOpen(!isCommentaryOpen)}
                    icon={MessageSquare}
                    label="Live Commentary"
                    subtitle="Real-time market tape"
                    shortcut="⌥C"
                    isActive={isCommentaryOpen}
                  />
                </div>
              )}

              {/* OS Horizon V3 Semantic Grouping: Cluster B (Labs + Notifications) */}
              <div className="flex items-center" style={{ gap: '12px', marginRight: '16px' }}>
                <div className="relative z-[260] group">
                  <LabsToggle />
                </div>

                <GlassIconButton
                  onClick={() => setIsAlertsOpen(true)}
                  icon={Bell}
                  label="Alerts"
                  subtitle="Signals & notifications"
                  shortcut="⌥A"
                  hasNotification={true}
                  notificationCount={3}
                />
              </div>

              {/* OS Horizon V3 Semantic Grouping: Cluster C (Account) */}
              <div className="relative z-[260]">
                <GlassIconButton
                  onClick={() => {/* Open account menu */}}
                  icon={User}
                  label="Account"
                  subtitle="Profile, settings, logout"
                />
              </div>
            </UtilityTrayPill>

            {/* Mobile Logo Header — Not Sticky */}
            <div className="md:hidden flex items-center justify-between px-4 py-4">
              <Link to={createPageUrl('MacroSignals')} className="flex items-center gap-2.5 group">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68943f7eb0fb9393bf9a8069/ea91941d0_Asset61xtransparent.png" 
                  alt="Vireon Logo"
                  className="w-9 h-9 rounded-lg transition-transform duration-200 ease-out group-hover:scale-105"
                  style={{ boxShadow: '0 0 12px rgba(86, 180, 255, 0.4)' }}
                />
                <span 
                  className="font-semibold text-xl tracking-tight"
                  style={{
                    background: 'linear-gradient(to right, #A774FF, #4EC8FF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Vireon
                </span>
              </Link>
            </div>

            <main className={`
              flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 md:py-8 pb-24 md:pb-8 
              relative
              ${isCommentaryOpen && isEnabled('labs_modules') ? 'md:pr-[340px]' : ''}
            `}>
              <AnimatePresence>
                {isDisclaimerVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="flex items-center justify-between gap-4 p-4 mb-6 rounded-2xl border backdrop-blur-xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(80, 140, 255, 0.10) 0%, rgba(120, 90, 255, 0.08) 100%)',
                      borderColor: 'rgba(80, 140, 255, 0.20)'
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 text-blue-400" />
                      <p className="text-sm font-medium text-gray-300">
                        Welcome to Vireon. Please note this is a prototype using mock data for demonstration purposes.
                      </p>
                    </div>
                    <button
                      onClick={handleDismissDisclaimer}
                      className="p-2 rounded-lg transition-colors hover:bg-white/10"
                      aria-label="Dismiss disclaimer"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="max-w-[1400px] mx-auto">
                {children}
              </div>
            </main>
          </div>

          <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-2 py-2 border-t border-white/[0.08] elevation-1">
            <div className="flex justify-around items-center">
              {navItems.map(item => (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`
                    flex flex-col items-center space-y-1 p-2 rounded-xl w-16 min-h-[52px]
                    transition-all duration-300
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                    ${location.pathname === item.href ? 'text-white bg-white/10 scale-105' : ''}
                  `}
                  style={{ 
                    color: location.pathname === item.href 
                      ? 'var(--text-primary)'
                      : 'var(--text-tertiary)'
                  }}
                  aria-label={item.title}
                >
                  <item.icon className="w-5 h-5" strokeWidth={2} />
                  <span className="text-[10px] font-medium tracking-[-0.01em] leading-tight text-center">
                    {item.title.split(' ')[0]}
                  </span>
                </Link>
              ))}
            </div>
          </nav>

          {isAlertsOpen && (
            <div 
              className="fixed inset-0 z-50 backdrop-blur-sm"
              style={{ backgroundColor: 'var(--scrim)' }}
              onClick={() => setIsAlertsOpen(false)}
            >
              <div
                className="fixed top-0 right-0 h-full w-full max-w-md elevation-3 p-8 flex flex-col"
                style={{ 
                  transform: isPinching && initialPinchDistance ? 'scale(0.95)' : 'scale(1)',
                  transition: 'transform 0.1s ease-out',
                  touchAction: 'none'
                }}
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold tracking-[-0.02em]" style={{ color: 'var(--text-primary)' }}>
                    Alerts
                  </h2>
                  <div className="flex items-center space-x-2">
                    <div className="md:hidden text-xs text-gray-500">👌</div>
                    <button
                      onClick={() => setIsAlertsOpen(false)}
                      className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 hover:bg-white/10"
                      aria-label="Close alerts"
                    >
                      <X className="w-6 h-6" style={{ color: 'var(--text-tertiary)' }} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 rounded-2xl flex items-center justify-center text-center border-2 border-dashed elevation-1">
                  <div className="space-y-4">
                    <Bell className="w-12 h-12 mx-auto" style={{ color: 'var(--text-tertiary)' }} strokeWidth={1.5} />
                    <div>
                      <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                        No New Alerts
                      </p>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                        Your market alerts will appear here
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isEnabled('labs_modules') && (
            <LiveCommentary
              isOpen={isCommentaryOpen}
              onClose={() => setIsCommentaryOpen(false)}
              theme="dark"
            />
          )}

          {isEnabled('labs_modules') && (
            <SearchOmni isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} theme="dark" />
          )}
        </div>

        <LyraChatbot />

        <OnboardingModal isOpen={showOnboarding && !isCheckingOnboarding} onAccept={handleOnboardingAccept} />
        </NetworkErrorBoundary>
        </>
        );
        }

export default function Layout({ children, currentPageName }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const themeScript = document.createElement('script');
    themeScript.id = 'vireon-theme-script';
    themeScript.innerHTML = `
      (function() {
        try {
          document.documentElement.classList.add('dark');
        } catch (e) {
          console.error("Failed to apply initial theme:", e);
        }
      })();
    `;
    
    if (!document.getElementById('vireon-theme-script')) {
      document.head.prepend(themeScript);
    }
    
    if ('serviceWorker' in navigator) {
      console.log('PWA features enabled.');
    }
  }, []);

  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <FeatureFlagsProvider>
          <MiniSheetProvider>
            <LayoutContent children={children} currentPageName={currentPageName} />
          </MiniSheetProvider>
        </FeatureFlagsProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  );
}