
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Eye, TrendingUp, Bell, AlertCircle, Plus, Download, Newspaper, Search, MessageSquare, X, Calendar, BookOpen, Brain, Globe, Activity } from "lucide-react";
import { FeatureFlagsProvider, useFeatureFlags } from "./components/core/FeatureFlags";
import { MiniSheetProvider, useMiniSheet } from './components/core/MiniSheetProvider';
import { AccessibilityProvider } from "./components/core/AccessibilityProvider";
import { ThemeProvider, useTheme } from "./components/core/ThemeProvider";
import LabsToggle from "./components/core/LabsToggle";
import SearchOmni from "./components/global/SearchOmni";
import LiveCommentary from "./components/live-feed/LiveCommentary";
import LyraChatbot from "./components/core/LyraChatbot";
import UserMenu from "./components/core/UserMenu";
import { motion, AnimatePresence } from 'framer-motion';
import NetworkErrorBoundary from "./components/core/NetworkErrorBoundary";

const NavLink = ({ href, icon: Icon, title, isActive, theme }) => (
  <Link
    to={href}
    className={`
      group relative flex items-center space-x-3.5
      px-4 py-3.5 rounded-2xl
      text-[15px] font-medium tracking-[-0.01em]
      transition-all duration-300 ease-out
      min-h-[44px]
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
      ${isActive
        ? 'bg-gradient-to-r from-white/[0.12] to-white/[0.08] text-white shadow-lg shadow-black/20 border border-white/10'
        : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
      }
      ${!isActive && 'hover:scale-[1.02]'}
      body.reduce-motion:hover:scale-100
    `}
  >
    <Icon className={`w-[18px] h-[18px] transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
    <span className="font-semibold tracking-[-0.005em]">{title}</span>
    {isActive && (
      <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-400" />
    )}
  </Link>
);

// Official Vireon Brain Logo Component - Updated with accurate brain shape
// This component is no longer used for the main logos, but kept in case other parts of the app use it.
const VireonBrainLogo = ({ className = "w-9 h-9" }) => (
  <svg 
    viewBox="0 0 80 80" 
    fill="none" 
    className={className}
  >
    <defs>
      <linearGradient id="vireon-left-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00E5FF" />
        <stop offset="40%" stopColor="#40E0D0" />
        <stop offset="80%" stopColor="#4A90E2" />
        <stop offset="100%" stopColor="#6B73FF" />
      </linearGradient>
      
      <linearGradient id="vireon-right-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6B73FF" />
        <stop offset="30%" stopColor="#9932CC" />
        <stop offset="70%" stopColor="#BA55D3" />
        <stop offset="100%" stopColor="#FF6EC7" />
      </linearGradient>
      
      <linearGradient id="vireon-connection-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#40E0D0" stopOpacity="0.9" />
        <stop offset="50%" stopColor="#7B68EE" stopOpacity="1" />
        <stop offset="100%" stopColor="#BA55D3" stopOpacity="0.9" />
      </linearGradient>
    </defs>
    
    <path 
      d="M 8 35 Q 8 20 18 15 Q 25 12 32 15 Q 38 18 40 25 Q 40 30 38 35 Q 40 40 40 45 Q 38 50 35 55 Q 32 62 25 65 Q 18 68 12 62 Q 8 55 10 48 Q 12 40 8 35 Z" 
      stroke="url(#vireon-left-gradient)" 
      strokeWidth="1.5" 
      fill="none"
    />
    
    <path 
      d="M 72 35 Q 72 20 62 15 Q 55 12 48 15 Q 42 18 40 25 Q 40 30 42 35 Q 40 40 40 45 Q 42 50 45 55 Q 48 62 55 65 Q 62 68 68 62 Q 72 55 70 48 Q 68 40 72 35 Z" 
      stroke="url(#vireon-right-gradient)" 
      strokeWidth="1.5" 
      fill="none"
    />
    
    <g stroke="url(#vireon-left-gradient)" strokeWidth="1" fill="none">
      <line x1="25" y1="35" x2="18" y2="25" />
      <line x1="25" y1="35" x2="32" y2="25" />
      <line x1="25" y1="35" x2="35" y2="32" />
      <line x1="25" y1="35" x2="35" y2="45" />
      <line x1="25" y1="35" x2="30" y2="55" />
      <line x1="25" y1="35" x2="18" y2="50" />
      <line x1="25" y1="35" x2="15" y2="40" />
      
      <line x1="18" y1="25" x2="32" y2="25" />
      <line x1="32" y1="25" x2="35" y2="32" />
      <line x1="35" y1="32" x2="35" y1="45" />
      <line x1="35" y1="45" x2="30" y2="55" />
      <line x1="30" y1="55" x2="18" y2="50" />
      <line x1="18" y1="50" x2="15" y2="40" />
      <line x1="15" y1="40" x2="18" y2="25" />
      
      <line x1="22" y1="30" x2="28" y2="40" />
      <line x1="20" y1="45" x2="30" y2="48" />
      <line x1="12" y1="35" x2="22" y2="42" />
    </g>
    
    <g stroke="url(#vireon-right-gradient)" strokeWidth="1" fill="none">
      <line x1="55" y1="35" x2="62" y2="25" />
      <line x1="55" y1="35" x2="48" y2="25" />
      <line x1="55" y1="35" x2="45" y2="32" />
      <line x1="55" y1="35" x2="45" y2="45" />
      <line x1="55" y1="35" x2="50" y2="55" />
      <line x1="55" y1="35" x2="62" y2="50" />
      <line x1="55" y1="35" x2="65" y2="40" />
      
      <line x1="62" y1="25" x2="48" y2="25" />
      <line x1="48" y1="25" x2="45" y2="32" />
      <line x1="45" y1="32" x2="45" y1="45" />
      <line x1="45" y1="45" x2="50" y2="55" />
      <line x1="50" y1="55" x2="62" y2="50" />
      <line x1="62" y1="50" x2="65" y1="40" />
      <line x1="65" y1="40" x2="62" y1="25" />
      
      <line x1="58" y1="30" x2="52" y2="40" />
      <line x1="60" y1="45" x2="50" y2="48" />
      <line x1="68" y1="35" x2="58" y2="42" />
    </g>
    
    <g fill="url(#vireon-left-gradient)">
      <circle cx="25" cy="35" r="2.5" />
      <circle cx="18" cy="25" r="1.8" />
      <circle cx="32" cy="25" r="1.8" />
      <circle cx="35" cy="32" r="1.8" />
      <circle cx="35" cy="45" r="1.8" />
      <circle cx="30" cy="55" r="1.8" />
      <circle cx="18" cy="50" r="1.8" />
      <circle cx="15" cy="40" r="1.8" />
      <circle cx="22" cy="30" r="1.2" />
      <circle cx="28" cy="40" r="1.2" />
      <circle cx="20" cy="45" r="1.2" />
      <circle cx="30" cy="48" r="1.2" />
      <circle cx="12" cy="35" r="1.2" />
      <circle cx="22" cy="42" r="1.2" />
    </g>
    
    <g fill="url(#vireon-right-gradient)">
      <circle cx="55" cy="35" r="2.5" />
      <circle cx="62" cy="25" r="1.8" />
      <circle cx="48" cy="25" r="1.8" />
      <circle cx="45" cy="32" r="1.8" />
      <circle cx="45" cy="45" r="1.8" />
      <circle cx="50" cy="55" r="1.8" />
      <circle cx="62" cy="50" r="1.8" />
      <circle cx="65" cy="40" r="1.8" />
      <circle cx="58" cy="30" r="1.2" />
      <circle cx="52" cy="40" r="1.2" />
      <circle cx="60" cy="45" r="1.2" />
      <circle cx="50" cy="48" r="1.2" />
      <circle cx="68" cy="35" r="1.2" />
      <circle cx="58" cy="42" r="1.2" />
    </g>
    
    <g stroke="url(#vireon-connection-gradient)" strokeWidth="1.2" fill="none">
      <line x1="38" y1="32" x2="42" y2="32" />
      <line x1="38" y1="38" x2="42" y2="38" />
      <line x1="38" y1="45" x2="42" y2="45" />
      <line x1="35" y1="40" x2="45" y2="40" />
    </g>
    
    <g fill="url(#vireon-connection-gradient)">
      <circle cx="40" cy="32" r="1" />
      <circle cx="40" cy="38" r="1" />
      <circle cx="40" cy="45" r="1" />
      <circle cx="40" cy="40" r="1.5" />
    </g>
  </svg>
);

function LayoutContent({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCommentaryOpen, setIsCommentaryOpen] = useState(false);
  const { theme, toggleTheme } = useTheme(); // Use theme hook (though theme is fixed to 'dark' for UI)
  const { isEnabled } = useFeatureFlags();

  // State for the new disclaimer
  const [isDisclaimerVisible, setIsDisclaimerVisible] = useState(false);

  // Pinch-to-close gesture state for alerts and other modals
  const [initialPinchDistance, setInitialPinchDistance] = useState(null);
  const [isPinching, setIsPinching] = useState(false);

  useEffect(() => {
    // If the user is at the root path, redirect them to Macro Signals as the primary landing page.
    if (location.pathname === '/') {
      navigate(createPageUrl('MacroSignals'), { replace: true });
    }
  }, [location.pathname, navigate]);
  
  // Check localStorage to see if disclaimer was dismissed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('vireon-disclaimer-dismissed');
      if (!dismissed) {
        setIsDisclaimerVisible(true);
      }
    }
  }, []);

  // Apply transitions class after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      document.documentElement.classList.add('transitions-enabled');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcuts for alerts drawer, search, and commentary
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

  // Pinch-to-close gesture handler for any open modal
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
        e.preventDefault(); // Prevent scrolling/zooming while pinching
        
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
          // Close whichever modal is currently open
          if (isAlertsOpen) setIsAlertsOpen(false);
          if (isSearchOpen) setIsSearchOpen(false);
          if (isCommentaryOpen) setIsCommentaryOpen(false);

          setIsPinching(false);
          setInitialPinchDistance(null);
        }
      }
    };

    const handleTouchEnd = (e) => {
      // If the number of touches drops below 2, stop pinching
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

  // Reorganized navigation following investor's top-down workflow
  const navItems = [
    { id: 'macrosignals', title: 'Macro Signals', href: createPageUrl('MacroSignals'), icon: Globe },
    { id: 'home', title: 'Market Pulse', href: createPageUrl('Home'), icon: Activity },
    { id: 'insights', title: 'AI Insights', href: createPageUrl('Insights'), icon: Brain },
    { id: 'watchlist', title: 'Watchlist', href: createPageUrl('Watchlist'), icon: Eye },
    { id: 'livefeed', title: 'Live Feed', href: createPageUrl('LiveFeed'), icon: Newspaper },
    { id: 'capitalvault', title: 'Capital Vault', href: createPageUrl('CapitalVault'), icon: BookOpen },
  ];

  // Ensure the current tab detection works properly with the new order
  const currentTab = navItems.find(item => location.pathname === item.href);
  const pageTitle = currentPageName === 'Me' ? 'My Profile' : (currentTab?.title || 'Vireon');


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        /* Global Z-Index Scale */
        :root {
          --z-app: 10;
          --z-popover: 40;
          --z-tooltip: 45;
          --z-modal: 50;
          --z-toast: 60;
          --z-devtools: 70;
          --header-h: 72px;
          /* Premium OLED Dark Mode - Only Theme */
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
        
        /* Disable transitions on all elements initially to prevent flashes */
        html:not(.transitions-enabled) * {
          transition: none !important;
        }
        
        /* Once the app is ready, enable transitions on specific, animatable properties */
        html.transitions-enabled * {
          transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease, opacity 200ms ease, transform 200ms ease, box-shadow 200ms ease !important;
        }
        
        /* Base background color set on html */
        html { background-color: #0B0E13; }
        
        /* Portal container styles */
        .vireon-portal-container {
          position: relative;
          z-index: var(--z-modal);
        }
        
        /* Drawer overlay styles */
        .drawer-overlay {
          position: fixed;
          inset: 0;
          z-index: var(--z-modal);
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        
        /* Drawer panel styles */
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
        
        /* Prevent background scroll when drawer is open */
        body.drawer-open {
          overflow: hidden;
          position: fixed;
          width: 100%;
        }
        
        /* Elevation tokens */
        .elevation-0 {
          background: var(--bg);
        }
        
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

        /* Accessibility: Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            transform: none !important;
          }
        }

        /* Enhanced focus styles for keyboard navigation */
        *:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
          z-index: calc(var(--z-modal) + 2);
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          * {
            border-color: currentColor !important;
          }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar { 
          width: 6px; 
        }
        ::-webkit-scrollbar-track { 
          background: transparent; 
        }
        ::-webkit-scrollbar-thumb {
          background: var(--muted);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: var(--text-tertiary);
        }

        /* Safe area handling for iOS */
        @supports (padding: max(0px)) {
          .drawer-panel-bottom {
            padding-bottom: max(env(safe-area-inset-bottom), 16px);
          }
          
          .drawer-panel-top {
            top: max(var(--header-h), env(safe-area-inset-top));
          }
        }

        /* PWA optimizations */
        .animate-shimmer {
          background: linear-gradient(
            90deg,
            var(--card) 0%,
            var(--border) 50%,
            var(--card) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.3s infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        /* Card hover effects */
        .card-hover {
          transition: transform 150ms ease-out, box-shadow 150ms ease-out;
        }
        
        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px var(--shadow);
        }
        
        @media (prefers-reduced-motion: reduce) {
          .card-hover:hover {
            transform: none;
          }
        }

        /* Tap highlight removal for better mobile experience */
        .tap-highlight-transparent {
          -webkit-tap-highlight-color: transparent;
        }
        
        /* Text sizing for readability */
        body {
          font-size: 15px;
          line-height: 1.5;
          color: var(--text-primary);
          background: var(--bg);
        }
        
        @media (max-width: 768px) {
          :root {
            --header-h: 60px;
          }
          
          body {
            font-size: 14px;
            line-height: 1.55;
          }
        }
        
        /* Success/error toast styling */
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
        <div className={`flex h-screen transition-all duration-500 ease-out elevation-0`}>

          {/* Desktop Sidebar */}
          <aside className={`
            hidden md:flex flex-col w-[280px] elevation-1 p-8 space-y-10
          `}>

            {/* Logo - ENHANCED SIZE FOR PROMINENCE */}
            <Link to={createPageUrl('MacroSignals')} className="flex items-center gap-3 px-1 group">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68943f7eb0fb9393bf9a8069/ea91941d0_Asset61xtransparent.png" 
                alt="Vireon Logo" 
                className="w-10 h-10 rounded-lg transition-transform duration-200 ease-out group-hover:scale-105"
                style={{ 
                  boxShadow: '0 0 12px rgba(86, 180, 255, 0.4)'
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

            {/* Navigation */}
            <nav className="flex flex-col space-y-2 px-1">
              {navItems.map(item => (
                <NavLink key={item.id} {...item} isActive={location.pathname === item.href} theme="dark" />
              ))}
            </nav>

            {/* Status Indicator */}
            <div className="px-5 py-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping opacity-75" />
                </div>
                <div>
                  <p className={`text-xs font-semibold`} style={{ color: 'var(--bull)' }}>
                    Market Open
                  </p>
                  <p className={`text-[11px]`} style={{ color: 'var(--text-tertiary)' }}>
                    Live data streaming
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header - Mobile Optimized - ENHANCED Z-INDEX */}
            <header className={`
              flex-shrink-0 sticky top-0 z-[250] flex items-center justify-between h-[60px] md:h-[72px] px-4 sm:px-6 md:px-8
              elevation-1 relative
            `}>

              {/* Mobile Logo - ENHANCED SIZE FOR PROMINENCE */}
              <Link to={createPageUrl('MacroSignals')} className="flex md:hidden items-center gap-2.5 group">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68943f7eb0fb9393bf9a8069/ea91941d0_Asset61xtransparent.png" 
                  alt="Vireon Logo"
                  className="w-9 h-9 rounded-lg transition-transform duration-200 ease-out group-hover:scale-105"
                  style={{ 
                    boxShadow: '0 0 12px rgba(86, 180, 255, 0.4)'
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

              {/* Desktop Page Title */}
              <div className="hidden md:block">
                <h1 className={`text-2xl font-bold tracking-[-0.02em]`} style={{ color: 'var(--text-primary)' }}>
                  {pageTitle}
                </h1>
              </div>

              {/* Actions - Mobile Optimized - ENHANCED POSITIONING */}
              <div className="flex items-center space-x-2 relative z-[260]">
                {/* Search Button - Labs Module */}
                {isEnabled('labs_modules') && (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className={`
                      relative group w-9 h-9 md:min-w-[44px] md:min-h-[44px] rounded-lg md:rounded-xl flex items-center justify-center
                      transition-all duration-200 hover:scale-105 elevation-1 hover:elevation-2 card-hover
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                      z-[260]
                    `}
                    aria-label="Search stocks and market data"
                  >
                    <Search className="relative z-10 w-4 h-4 md:w-5 md:h-5 text-[var(--text-secondary)] group-hover:text-white transition-colors" strokeWidth={2} />
                  </button>
                )}

                {/* Live Commentary Toggle - Labs Module */}
                {isEnabled('labs_modules') && (
                  <button
                    onClick={() => setIsCommentaryOpen(!isCommentaryOpen)}
                    className={`
                      relative group w-9 h-9 md:min-w-[44px] md:min-h-[44px] rounded-lg md:rounded-xl flex items-center justify-center
                      transition-all duration-200 hover:scale-105 card-hover
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                      z-[260]
                      ${isCommentaryOpen
                        ? 'bg-blue-500 text-white'
                        : 'elevation-1 hover:elevation-2'
                      }
                    `}
                    aria-label={`${isCommentaryOpen ? 'Close' : 'Open'} live commentary`}
                  >
                    <MessageSquare className={`relative z-10 w-4 h-4 md:w-5 md:h-5 transition-colors ${isCommentaryOpen ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'}`} strokeWidth={2} />
                    {isCommentaryOpen && (
                      <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white dark:border-gray-900" />
                    )}
                  </button>
                )}

                {/* Labs Toggle */}
                <div className="relative z-[260] group">
                  <LabsToggle />
                </div>

                <button
                  onClick={() => setIsAlertsOpen(true)}
                  className={`
                    relative group w-9 h-9 md:min-w-[44px] md:min-h-[44px] rounded-lg md:rounded-xl flex items-center justify-center
                    transition-all duration-200 hover:scale-105 elevation-1 hover:elevation-2 card-hover
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                    z-[260]
                  `}
                  aria-label="View alerts"
                >
                  <Bell className="relative z-10 w-4 h-4 md:w-5 h-5 text-[var(--text-secondary)] group-hover:text-white transition-colors" strokeWidth={2} />
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white dark:border-gray-900" />
                </button>

                {/* User Menu */}
                <div className="relative z-[260] group">
                  <UserMenu theme="dark" toggleTheme={() => {}} />
                </div>
              </div>
            </header>

            {/* Main Content - Mobile Optimized */}
            <main className={`
              flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 md:py-8 pb-24 md:pb-8 
              relative
              ${isCommentaryOpen && isEnabled('labs_modules') ? 'md:pr-[340px]' : ''}
            `}>
              {/* Disclaimer Banner */}
              <AnimatePresence>
                {isDisclaimerVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className={`
                      flex items-center justify-between gap-4 p-4 mb-6 rounded-2xl
                      border backdrop-blur-xl
                      ${theme === 'dark' 
                        ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20' 
                        : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <AlertCircle className={`w-5 h-5 flex-shrink-0 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Welcome to Vireon. Please note this is a prototype using mock data for demonstration purposes.
                      </p>
                    </div>
                    <button
                      onClick={handleDismissDisclaimer}
                      className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                      aria-label="Dismiss disclaimer"
                    >
                      <X className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="max-w-[1400px] mx-auto">
                {children}
              </div>
            </main>
          </div>

          {/* Mobile Bottom Nav - Updated with new order */}
          <nav className={`
            md:hidden fixed bottom-0 left-0 right-0 z-50
            elevation-1 px-2 py-2 border-t border-white/[0.08]
          `}>
            <div className="flex justify-around items-center">
              {navItems.map(item => (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`
                    flex flex-col items-center space-y-1 p-2 rounded-xl w-16 min-h-[52px]
                    transition-all duration-300
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                    ${location.pathname === item.href
                      ? 'text-white bg-white/10 scale-105'
                      : ''
                    }
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

          {/* Alerts Drawer */}
          {isAlertsOpen && (
            <div 
              className={`fixed inset-0 z-50 backdrop-blur-sm`}
              style={{ backgroundColor: 'var(--scrim)' }}
              onClick={() => setIsAlertsOpen(false)}
            >
              <div
                className={`
                  fixed top-0 right-0 h-full w-full max-w-md elevation-3 p-8 flex flex-col
                `}
                style={{ 
                  transform: isPinching && initialPinchDistance ? 'scale(0.95)' : 'scale(1)',
                  transition: 'transform 0.1s ease-out',
                  touchAction: 'none'
                }}
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className={`text-2xl font-bold tracking-[-0.02em]`} style={{ color: 'var(--text-primary)' }}>
                    Alerts
                  </h2>
                  <div className="flex items-center space-x-2">
                    {/* Pinch hint for mobile */}
                    <div className="md:hidden text-xs text-gray-500">👌</div>
                    <button
                      onClick={() => setIsAlertsOpen(false)}
                      className={`min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 hover:bg-white/10`}
                      aria-label="Close alerts"
                    >
                      <X className="w-6 h-6" style={{ color: 'var(--text-tertiary)' }} />
                    </button>
                  </div>
                </div>

                <div className={`
                  flex-1 rounded-2xl flex items-center justify-center text-center
                  border-2 border-dashed elevation-1
                `}>
                  <div className="space-y-4">
                    <Bell className={`w-12 h-12 mx-auto`} style={{ color: 'var(--text-tertiary)' }} strokeWidth={1.5} />
                    <div>
                      <p className={`text-lg font-semibold`} style={{ color: 'var(--text-primary)' }}>
                        No New Alerts
                      </p>
                      <p className={`text-sm mt-1`} style={{ color: 'var(--text-secondary)' }}>
                        Your market alerts will appear here
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Live Commentary Panel - Labs Module */}
          {isEnabled('labs_modules') && (
            <LiveCommentary
              isOpen={isCommentaryOpen}
              onClose={() => setIsCommentaryOpen(false)}
              theme="dark" // Always pass dark theme
            />
          )}

          {/* Omni Search Modal - Labs Module */}
          {isEnabled('labs_modules') && (
            <SearchOmni isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} theme="dark" />
          )}
        </div>

        {/* Lyra Chatbot */}
        <LyraChatbot />
      </NetworkErrorBoundary>
    </>
  );
}

export default function Layout({ children, currentPageName }) {
  // Inject theme script immediately to prevent flash
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const themeScript = document.createElement('script');
    themeScript.id = 'vireon-theme-script'; // Add an ID to prevent re-injection
    themeScript.innerHTML = `
      (function() {
        try {
          // Always apply dark theme
          document.documentElement.classList.add('dark');
        } catch (e) {
          console.error("Failed to apply initial theme:", e);
        }
      })();
    `;
    
    if (!document.getElementById('vireon-theme-script')) {
      document.head.prepend(themeScript);
    }
    
    // PWA registration could go here
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
