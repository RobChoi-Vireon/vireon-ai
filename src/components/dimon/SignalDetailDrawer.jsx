import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Target, Activity, Sparkles, AlertCircle, ShieldCheck, Link2, ArrowRight, Clock, TrendingUp } from 'lucide-react';

// ============================================================================
// HORIZON OS TOKENS + LIVING INTELLIGENCE
// ============================================================================
const HORIZON = {
  glass: {
    base: 'rgba(24, 26, 29, 0.55)',
    tint: 'rgba(10, 10, 10, 0.42)',
    border: 'rgba(255, 255, 255, 0.06)',
    subsurface: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.12) 100%)',
    radius: 20,
    blur: 26,
    shadow: '0 20px 60px rgba(0, 0, 0, 0.40)',
  },
  type: {
    h1: { size: 22, weight: 600, tracking: -0.03, opacity: 0.92 },
    h2: { size: 18, weight: 600, tracking: -0.02, opacity: 0.88 },
    body: { size: 15, weight: 400, lh: 1.55, opacity: 0.82 },
    meta: { size: 12, weight: 500, tracking: 0.06, opacity: 0.60 },
    label: { size: 13, weight: 600, tracking: 0.04, opacity: 0.70 },
  },
  motion: {
    ease: [0.18, 0.82, 0.23, 1],
    ease_io: [0.4, 0, 0.2, 1],
    dur: { open: 260, close: 260, toggle: 250, fast: 180 },
  },
  color: {
    risk: '#F26A6A',
    opportunity: '#2ECF8D',
    neutral: '#5EA7FF',
    accent: '#7DD3FC',
  },
  ri: {
    gapLg: '28px',
    gapMd: '14px',
    riskTint: 'rgba(255, 60, 60, 0.08)',
    opptyTint: 'rgba(60, 220, 160, 0.08)',
    neutralTint: 'rgba(140, 170, 200, 0.06)',
    riskRim: '0 0 0 1px rgba(255,90,90,0.35), 0 8px 30px rgba(255,60,60,0.20)',
    opptyRim: '0 0 0 1px rgba(70,230,170,0.35), 0 8px 30px rgba(60,220,160,0.18)',
  },
  li: {
    haloRisk: 'rgba(255,75,75,0.25)',
    haloOppty: 'rgba(60,240,180,0.25)',
    haloNeutral: 'rgba(160,190,230,0.2)',
    aiVoice: 'rgba(90,150,255,0.35)',
  }
};

// ============================================================================
// CONFIDENCE RING COMPONENT (WITH BREATHING)
// ============================================================================
const ConfidenceRing = ({ value, color, size = 42, sentiment = 'neutral' }) => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div 
      className={`relative inline-flex confidence-ring ${!shouldReduceMotion ? 'hzn-confidence-ring' : ''}`} 
      style={{ width: size, height: size }}
      data-sentiment={sentiment}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="3"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: shouldReduceMotion ? offset : offset,
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  duration: 0.8,
                  ease: HORIZON.motion.ease,
                  delay: 0.4,
                }
          }
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          fontSize: 14,
          fontWeight: 700,
          color,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </div>
    </div>
  );
};

// ============================================================================
// NARRATIVE LINK (VISUAL CONNECTOR)
// ============================================================================
const NarrativeLink = () => (
  <div 
    className="li-link"
    aria-hidden="true"
    style={{
      position: 'relative',
      margin: '16px 0',
      height: '1px',
      background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.15), rgba(255,255,255,0))',
    }}
  />
);

// ============================================================================
// SENTIMENT CHIP
// ============================================================================
const SentimentChip = ({ sentiment }) => {
  const styles = {
    risk: { bg: HORIZON.ri.riskTint, fg: HORIZON.color.risk, label: 'Policy Shock / Risk' },
    opportunity: { bg: HORIZON.ri.opptyTint, fg: HORIZON.color.opportunity, label: 'Opportunity Signal' },
    neutral: { bg: HORIZON.ri.neutralTint, fg: HORIZON.color.neutral, label: 'Market Signal' },
  };

  const style = styles[sentiment] || styles.neutral;

  return (
    <div
      className="inline-flex items-center px-3 py-1.5 rounded-full"
      style={{
        background: style.bg,
        color: style.fg,
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: '0.02em',
      }}
    >
      {style.label}
    </div>
  );
};

// ============================================================================
// IMPACT CHIP
// ============================================================================
const ImpactChip = ({ text, tone = 'neutral' }) => {
  const styles = {
    risk: { bg: HORIZON.ri.riskTint, fg: HORIZON.color.risk },
    opportunity: { bg: HORIZON.ri.opptyTint, fg: HORIZON.color.opportunity },
    neutral: { bg: HORIZON.ri.neutralTint, fg: HORIZON.color.neutral },
  };

  const style = styles[tone] || styles.neutral;

  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
      style={{
        background: style.bg,
        color: style.fg,
        fontSize: 13,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

// ============================================================================
// CONTEXT TAGS (TEMPORAL AWARENESS)
// ============================================================================
const ContextTags = ({ signalAge, durationBias }) => (
  <div className="li-meta-tags flex items-center gap-2 mb-3">
    <span className="li-tag flex items-center gap-1.5">
      <Clock className="w-3 h-3" />
      Signal Age • {signalAge}
    </span>
    <span className="li-tag flex items-center gap-1.5">
      <TrendingUp className="w-3 h-3" />
      Duration Bias • {durationBias}
    </span>
  </div>
);

// ============================================================================
// CORRELATED SIGNAL CHIP WITH PREVIEW
// ============================================================================
const CorrelatedChip = ({ signal, onNavigate }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="relative inline-block">
      <button 
        className="ri-chip" 
        onMouseEnter={() => setShowPreview(true)}
        onMouseLeave={() => setShowPreview(false)}
        onClick={() => onNavigate?.(signal.id)}
      >
        {signal.label}
      </button>
      {showPreview && (
        <div 
          className="li-preview absolute bottom-full left-0 mb-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap"
          style={{
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          }}
        >
          Related to current signal
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN DRAWER COMPONENT
// ============================================================================
export default function SignalDetailDrawer({ isOpen, onClose, signal, onNavigate }) {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [viewMode, setViewMode] = useState('simplified');
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const containerRef = useRef(null);
  const previousFocusRef = useRef(null);
  const beamRef = useRef(null);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);

    const handler = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (showHint) {
      const timer = setTimeout(() => setShowHint(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showHint, isOpen]);

  // Handle liquid silk opening animation - responsive + luxurious
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setIsAnimatingIn(true);
      });
    } else {
      setIsAnimatingIn(false);
    }
  }, [isOpen]);

  // Focus management and body scroll lock
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      
      setShowHint(true);
      setViewMode('simplified');

      setTimeout(() => {
        const firstFocusable = containerRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }, 100);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose?.();
        }
        if ((e.metaKey || e.ctrlKey) && e.key === 'ArrowLeft') {
          e.preventDefault();
          onNavigate?.('prev');
        }
        if ((e.metaKey || e.ctrlKey) && e.key === 'ArrowRight') {
          e.preventDefault();
          onNavigate?.('next');
        }
        if (e.key === 'd' && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          setViewMode(prev => prev === 'detailed' ? 'simplified' : 'detailed');
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
        
        if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose, onNavigate]);

  // Light beam scroll dampening
  useEffect(() => {
    const drawer = containerRef.current?.querySelector('.overflow-y-auto');
    if (!drawer || !beamRef.current) return;

    const handleScroll = () => {
      if (beamRef.current && viewMode === 'detailed') {
        beamRef.current.style.opacity = '0.02';
        clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
          if (beamRef.current && viewMode === 'detailed') {
            beamRef.current.style.opacity = '0.035';
          }
        }, 350);
      }
    };

    drawer.addEventListener('scroll', handleScroll);
    return () => {
      drawer.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [viewMode]);

  if (!isOpen || !signal) return null;

  // Extract signal metadata
  const sentiment = signal.urgency === 'critical' ? 'risk' : signal.urgency === 'high' ? 'risk' : 'neutral';
  const primarySector = 'Technology';
  const ageLabel = '2h ago';
  const durationBias = 'Short-term risk-off';
  const confOverall = 78;

  // Generate content based on signal type - CEP ENGINE FORMAT
  const getContentForSignal = () => {
    switch (signal.tag) {
      case 'Policy Shock':
        return {
          // 1. SUMMARY - Core event + immediate significance
          summary: 'The U.S. government introduced new AI regulations that will increase costs for tech companies. This is expected to reduce profits and make tech stocks less attractive.',
          // 2. CONFIDENCE - kept as confOverall variable
          // 3. WHY IT MATTERS - Direct market effect
          why: 'Tech companies will spend more on compliance, reducing profits and potentially lowering stock prices.',
          // 4. IN SIMPLE TERMS - 8th grade reading level
          translation: 'Big tech companies now have to follow stricter rules, which costs money and hurts their bottom line.',
          // 5. WHAT HAPPENED - Factual only
          what: 'The U.S. government announced new rules requiring companies that use AI tools to meet stricter safety and content standards.',
          // 6. IMPACT SNAPSHOT - Ordered by magnitude
          impacts: [
            { text: 'Tech Stocks', tone: 'risk' },
            { text: 'Government Bonds', tone: 'opportunity' },
            { text: 'U.S. Dollar', tone: 'opportunity' },
            { text: 'Corporate Bonds', tone: 'risk' },
          ],
          // 7. DOWNSIDE RISK
          downside: {
            text: 'If rules get stricter than expected, investors may sell tech stocks and other risky investments quickly.',
            confidence: 85,
          },
          // 8. UPSIDE POTENTIAL
          upside: {
            text: 'Established, profitable companies may become more attractive as investors move away from high-risk growth stocks.',
            confidence: 60,
          },
          // 9. RIPPLE EFFECTS
          rippleImpact: 'Other countries may follow with similar rules. Tech companies may delay new products while adjusting to requirements.',
          // 10. CONTEXT QUOTE
          quote: 'This is the biggest change in tech oversight in over 20 years.',
          // 11. MARKET RELEVANCE
          relevance: {
            impacts: 'Company profits, stock valuations, interest rate expectations',
            sectors: 'Technology (negative), Banks (neutral), Manufacturing (slightly negative)',
            assetClasses: 'Growth stocks (negative), Short-term bonds (positive), Dollar (positive)',
          },
          // 12. HOW INVESTORS MAY RESPOND
          strategy: 'Consider moving some money from high-growth tech stocks to stable, profitable companies. Short-term bonds may offer better protection against rate changes.',
          // 13. RELATED SIGNALS
          correlated: [
            { id: 1, label: 'Fed Decision' },
            { id: 2, label: 'Tech Earnings' },
            { id: 3, label: 'EU Privacy Rules' },
            { id: 4, label: 'AI Regulation' },
          ]
        };
      
      case 'Credit Stress':
        return {
          summary: 'Companies in developing countries are finding it harder and more expensive to borrow money. This financial stress could spread if it continues.',
          why: 'Higher borrowing costs squeeze company profits and increase the risk of missed payments.',
          translation: 'When loans get expensive, companies with debt struggle to pay their bills.',
          what: 'Borrowing costs for companies in emerging markets jumped this week, and fewer companies are getting approved for new loans.',
          impacts: [
            { text: 'Emerging Market Bonds', tone: 'risk' },
            { text: 'U.S. Dollar', tone: 'opportunity' },
            { text: 'Safe Investments', tone: 'opportunity' },
            { text: 'International Stocks', tone: 'risk' },
          ],
          downside: {
            text: 'If more companies struggle to repay loans, it could shake confidence in global markets and hurt investors worldwide.',
            confidence: 72,
          },
          upside: {
            text: 'U.S. investments and the dollar may benefit as investors seek safer options.',
            confidence: 55,
          },
          rippleImpact: 'U.S. companies that sell overseas may see weaker demand. Banks with international loans face higher risks.',
          quote: null,
          relevance: {
            impacts: 'Global lending, investor confidence, currency values',
            sectors: 'International businesses (negative), U.S.-focused companies (positive)',
            assetClasses: 'Emerging market bonds (negative), U.S. bonds (positive), Dollar (positive)',
          },
          strategy: 'Consider reducing investments in emerging markets and increasing U.S.-focused holdings. Companies with low debt are safer bets.',
          correlated: [
            { id: 1, label: 'Dollar Strength' },
            { id: 2, label: 'Fed Policy' },
            { id: 3, label: 'China Economy' },
            { id: 4, label: 'Bond Stress' },
          ]
        };
      
      case 'Tech Disruption':
        return {
          summary: 'A quantum computing breakthrough could eventually threaten current digital security systems. The impact is long-term, not immediate.',
          why: 'Companies and governments will need to upgrade security systems over time, creating new spending priorities.',
          translation: 'New super-fast computers might one day crack today\'s security codes, so everyone will need better protection.',
          what: 'Researchers showed that quantum computers are getting closer to breaking the encryption that protects most online data.',
          impacts: [
            { text: 'Cybersecurity Stocks', tone: 'opportunity' },
            { text: 'Tech Infrastructure', tone: 'neutral' },
            { text: 'Financial Services', tone: 'neutral' },
            { text: 'Government Bonds', tone: 'neutral' },
          ],
          downside: {
            text: 'If this technology advances faster than expected, companies may face surprise costs to upgrade security.',
            confidence: 45,
          },
          upside: {
            text: 'Security companies building quantum-proof protection could see strong growth over the next decade.',
            confidence: 68,
          },
          rippleImpact: 'Banks and governments will likely increase security budgets. New security standards may become required.',
          quote: null,
          relevance: {
            impacts: 'Security spending, technology priorities, data protection rules',
            sectors: 'Cybersecurity (positive), Cloud services (neutral), Banks (neutral)',
            assetClasses: 'Tech stocks (mixed), Infrastructure investments (neutral)',
          },
          strategy: 'This is a long-term trend. Gradually adding cybersecurity investments may pay off over several years.',
          correlated: [
            { id: 1, label: 'Security Spending' },
            { id: 2, label: 'Cloud Security' },
            { id: 3, label: 'Privacy Rules' },
            { id: 4, label: 'Tech Investment' },
          ]
        };
      
      case 'Geopolitical Risk':
        return {
          summary: 'Trade tensions between major countries are making it harder and more expensive for companies to get supplies and sell products globally.',
          why: 'Higher costs for materials and shipping reduce company profits and can lead to higher prices for consumers.',
          translation: 'Countries are making it harder to trade with each other, which raises costs for everyone.',
          what: 'The U.S., China, and other major economies announced new tariffs and trade restrictions affecting many industries.',
          impacts: [
            { text: 'Manufacturing Stocks', tone: 'risk' },
            { text: 'Consumer Goods', tone: 'risk' },
            { text: 'U.S. Companies', tone: 'opportunity' },
            { text: 'Shipping Costs', tone: 'risk' },
          ],
          downside: {
            text: 'Worsening tensions could disrupt supply chains severely, forcing production shutdowns and product shortages.',
            confidence: 78,
          },
          upside: {
            text: 'Companies that make products in the U.S. may gain business as others look for alternatives to foreign suppliers.',
            confidence: 62,
          },
          rippleImpact: 'Consumer prices may rise. Some products could become harder to find. Companies may move manufacturing.',
          quote: null,
          relevance: {
            impacts: 'Product prices, supply availability, manufacturing costs',
            sectors: 'Manufacturing (negative), Retail (negative), Domestic producers (positive)',
            assetClasses: 'International stocks (negative), U.S. stocks (mixed), Commodities (volatile)',
          },
          strategy: 'Consider favoring companies that produce domestically over those heavily dependent on imports.',
          correlated: [
            { id: 1, label: 'China Relations' },
            { id: 2, label: 'Tariff News' },
            { id: 3, label: 'Supply Chain' },
            { id: 4, label: 'Manufacturing' },
          ]
        };
      
      case 'Energy Transition':
        return {
          summary: 'A clean energy breakthrough could make solar and wind power significantly cheaper, speeding up the shift away from oil and gas.',
          why: 'Cheaper renewable energy attracts more investment and puts pressure on traditional energy companies.',
          translation: 'New technology is making clean energy cheaper, which is bad for oil companies but good for solar and wind.',
          what: 'Scientists announced a major improvement in renewable energy technology that could cut production costs significantly.',
          impacts: [
            { text: 'Renewable Stocks', tone: 'opportunity' },
            { text: 'Oil & Gas', tone: 'risk' },
            { text: 'Utilities', tone: 'opportunity' },
            { text: 'Battery Tech', tone: 'opportunity' },
          ],
          downside: {
            text: 'Traditional energy companies may see falling demand and stock prices as renewables become cheaper.',
            confidence: 65,
          },
          upside: {
            text: 'Solar, wind, and battery companies could see strong growth as more people switch to clean energy.',
            confidence: 72,
          },
          rippleImpact: 'Electric car adoption may speed up. Home solar installations could increase. Energy bills may eventually fall.',
          quote: null,
          relevance: {
            impacts: 'Energy prices, climate policy, infrastructure spending',
            sectors: 'Renewables (positive), Oil & gas (negative), Utilities (positive)',
            assetClasses: 'Clean energy stocks (positive), Oil stocks (negative), Infrastructure bonds (positive)',
          },
          strategy: 'Consider gradually shifting energy investments from traditional oil and gas toward renewable companies.',
          correlated: [
            { id: 1, label: 'Climate Policy' },
            { id: 2, label: 'Battery Tech' },
            { id: 3, label: 'Electric Cars' },
            { id: 4, label: 'Utilities' },
          ]
        };
      
      case 'Social Unrest':
        return {
          summary: 'Protests over high living costs are spreading across Europe, which could force governments to change policies and disrupt businesses.',
          why: 'Political instability and policy changes can hurt business confidence and reduce consumer spending.',
          translation: 'People are protesting because everything costs more, and governments may have to respond with new policies.',
          what: 'Large protests over inflation and high prices are happening in major cities across France, the UK, and Spain.',
          impacts: [
            { text: 'European Stocks', tone: 'risk' },
            { text: 'Consumer Spending', tone: 'risk' },
            { text: 'Safe Bonds', tone: 'opportunity' },
            { text: 'Political Risk', tone: 'risk' },
          ],
          downside: {
            text: 'Growing unrest could lead to business disruptions, emergency government policies, or reduced consumer confidence.',
            confidence: 68,
          },
          upside: {
            text: 'Government spending programs to calm unrest could boost economic growth, and inflation may ease as energy costs fall.',
            confidence: 52,
          },
          rippleImpact: 'European retailers and restaurants may see fewer customers. Governments may announce emergency support programs.',
          quote: null,
          relevance: {
            impacts: 'Consumer spending, political stability, government policy',
            sectors: 'European retail (negative), Luxury goods (negative), Utilities (neutral)',
            assetClasses: 'European stocks (negative), Safe haven bonds (positive), U.S. assets (positive)',
          },
          strategy: 'Consider reducing exposure to European consumer businesses and increasing safer investments.',
          correlated: [
            { id: 1, label: 'Inflation Data' },
            { id: 2, label: 'Energy Prices' },
            { id: 3, label: 'Government Policy' },
            { id: 4, label: 'Consumer Mood' },
          ]
        };
      
      default:
        return {
          summary: `${signal.text} This event may shift market sentiment.`,
          why: 'Market conditions are changing, which could affect investment decisions.',
          translation: 'Something important happened that investors are watching closely.',
          what: signal.text,
          impacts: [
            { text: 'Global Markets', tone: 'neutral' },
            { text: 'Investor Mood', tone: 'neutral' },
          ],
          downside: {
            text: 'Uncertainty may cause investors to be more cautious, leading to market swings.',
            confidence: 60,
          },
          upside: {
            text: 'Markets often adapt to new situations, creating opportunities for prepared investors.',
            confidence: 55,
          },
          rippleImpact: 'Watch for follow-up news and how markets react over the next few days.',
          quote: null,
          relevance: {
            impacts: 'Market mood, investor confidence, risk appetite',
            sectors: 'Various sectors may be affected',
            assetClasses: 'Multiple investment types may see changes',
          },
          strategy: 'Stay informed and consider how this fits with your investment goals and risk comfort.',
          correlated: [
            { id: 1, label: 'Related News' },
            { id: 2, label: 'Market Trends' },
          ]
        };
    }
  };

  const content = getContentForSignal();
  
  // CEP ENGINE content mapping
  const summary = content.summary;
  const translation = content.translation;
  const rippleImpact = content.rippleImpact;

  const analysis = {
    what: content.what,
    why: content.why,
    impacts: content.impacts,
    quote: content.quote,
    relevance: content.relevance,
    downside: content.downside,
    upside: content.upside,
    strategy: content.strategy,
    correlated: content.correlated
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <style>{`
            /* ============================================================================
               HORIZON OS DRAWER - LIQUID SILK MOTION (SWEET SPOT)
            ============================================================================ */
            
            :root {
              --hzn-dur-open: 280ms;
              --hzn-dur-close: 200ms;
              --hzn-dur-stagger: 60ms;
              --hzn-ease-silk: cubic-bezier(0.19, 1, 0.22, 1);
              --hzn-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
              --hzn-ease-io: cubic-bezier(0.4, 0, 0.2, 1);
              --hzn-open-scale: 0.96;
              --hzn-open-translate: 8px;
              
              --ri-gap-lg: 28px;
              --ri-gap-md: 14px;
              --ri-dur: 280ms;
              --ri-dur-fast: 180ms;
              --ri-ease-weight: cubic-bezier(0.18, 0.82, 0.23, 1);
              
              --li-duration: 280ms;
              --li-ease: cubic-bezier(0.4, 0, 0.2, 1);
              --li-halo-risk: rgba(255,75,75,0.25);
              --li-halo-oppty: rgba(60,240,180,0.25);
              --li-halo-neutral: rgba(160,190,230,0.2);
              --li-ai-voice: rgba(105,160,255,0.60);
              
              --mp-radius: 16px;
              --mp-border: 1px solid rgba(255,255,255,0.06);
              --mp-shadow-soft: 0 8px 24px rgba(0,0,0,0.25);
              --mp-risk-rim: inset 0 0 0 1px rgba(255,90,90,0.38), 0 0 22px rgba(255,60,60,0.22);
              --mp-up-rim: inset 0 0 0 1px rgba(60,220,160,0.34), 0 0 22px rgba(60,220,160,0.20);
              --mp-gap: 12px;
              --mp-dur: 260ms;
              --mp-ease: cubic-bezier(0.4,0,0.2,1);
            }
            
            /* Frosted Backdrop */
            .hzn-frosted-backdrop {
              position: fixed;
              inset: 0;
              z-index: 80;
              background: rgba(24, 26, 29, 0.55);
              backdrop-filter: blur(26px) saturate(1.3) brightness(1.15);
              -webkit-backdrop-filter: blur(26px) saturate(1.3) brightness(1.15);
              opacity: 0;
              transition: opacity var(--hzn-dur-open) var(--hzn-ease-silk),
                          filter var(--li-duration) var(--li-ease),
                          backdrop-filter var(--li-duration) var(--li-ease);
              will-change: opacity, filter, backdrop-filter;
              contain: paint;
              mask-image: linear-gradient(to bottom, transparent 0, black calc(72px + 8px));
              -webkit-mask-image: linear-gradient(to bottom, transparent 0, black calc(72px + 8px));
            }
            
            .hzn-frosted-backdrop--open {
              opacity: 1;
            }
            
            .hzn-frosted-backdrop::after {
              content: "";
              position: absolute;
              inset: -2%;
              pointer-events: none;
              background: radial-gradient(70% 60% at 50% 40%, rgba(255,255,255,0.02), rgba(0,0,0,0.22) 70%, rgba(0,0,0,0.30) 100%), linear-gradient(to top right, transparent 60%, rgba(90, 150, 255, 0.06));
              mix-blend-mode: soft-light;
              mask-image: radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 42%, black 100%);
              -webkit-mask-image: radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 42%, black 100%);
            }
            
            /* Header Scrim */
            .hzn-header-scrim {
              position: fixed;
              inset-inline: 0;
              top: 0;
              height: 72px;
              z-index: 95;
              pointer-events: none;
              background: linear-gradient(to bottom, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.22) 35%, rgba(0, 0, 0, 0.00) 100%);
              box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.05);
              mix-blend-mode: normal;
              opacity: 0;
              transition: opacity var(--hzn-dur-open) var(--hzn-ease-silk);
              will-change: opacity;
            }
            
            .hzn-header-scrim--open {
              opacity: 1;
            }
            
            /* Priority Drawer */
            .hzn-drawer {
              position: fixed;
              z-index: 90;
              left: 0;
              right: 0;
              margin-inline: auto;
              top: calc(72px + 14px);
              max-width: min(820px, 90vw);
              border: 1px solid rgba(255, 255, 255, 0.06);
              background: linear-gradient(to bottom, rgba(35, 38, 42, 0.75), rgba(28, 31, 35, 0.82));
              backdrop-filter: blur(32px) saturate(165%);
              -webkit-backdrop-filter: blur(32px) saturate(165%);
              box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45);
              border-radius: 24px;
              overflow: hidden;
              
              transform: translateY(var(--hzn-open-translate)) scale(var(--hzn-open-scale));
              opacity: 0;
              will-change: transform, opacity;
              transition: 
                transform var(--hzn-dur-open) var(--hzn-ease-silk),
                opacity var(--hzn-dur-open) var(--hzn-ease-silk);
            }
            
            .hzn-drawer--open {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
            
            .hzn-drawer::before {
              content: "";
              position: absolute;
              left: 0;
              right: 0;
              top: 0;
              height: 18px;
              pointer-events: none;
              background: linear-gradient(to bottom, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.05) 40%, rgba(255, 255, 255, 0.00) 100%);
              mix-blend-mode: screen;
              opacity: 0.6;
              z-index: 1;
            }
            
            .hzn-drawer::after {
              content: "";
              position: absolute;
              left: 12px;
              right: 12px;
              top: 0;
              height: 1px;
              pointer-events: none;
              background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.08), transparent);
              opacity: 0.9;
              z-index: 1;
            }
            
            /* Center Light Beam */
            .li-beam {
              position: absolute;
              inset: 0;
              pointer-events: none;
              background: linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0) 40%), linear-gradient(to bottom, rgba(255,255,255,0) 60%, rgba(255,255,255,0.04) 100%);
              mask-image: linear-gradient(to right, transparent 48.5%, black 50%, transparent 51.5%);
              -webkit-mask-image: linear-gradient(to right, transparent 48.5%, black 50%, transparent 51.5%);
              opacity: 0;
              transition: opacity var(--mp-dur) var(--mp-ease);
            }
            
            .drawer--detailed .li-beam {
              opacity: 0.035;
            }
            
            @media (prefers-reduced-motion: no-preference) {
              .drawer--detailed .li-beam {
                animation: liBeamBreath 8s ease-in-out infinite;
              }
            }
            
            @keyframes liBeamBreath {
              0%, 100% { opacity: 0.028; }
              50% { opacity: 0.045; }
            }
            
            /* Narrative Link */
            .li-link {
              animation: liPulseLine 3s ease-in-out infinite;
            }
            
            @keyframes liPulseLine {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 0.7; }
            }
            
            /* Micro-Transitions */
            .ri-section {
              margin-bottom: var(--ri-gap-lg);
              line-height: 1.55;
              opacity: 0;
              transform: translateY(4px);
              transition: opacity var(--li-duration) var(--li-ease), 
                          transform var(--li-duration) var(--li-ease);
            }
            
            .hzn-drawer--open .ri-section {
              animation: giFadeUp 320ms var(--hzn-ease-silk) forwards;
            }
            
            .hzn-drawer--open .ri-section:nth-of-type(1) { animation-delay: calc(var(--hzn-dur-stagger) * 0); }
            .hzn-drawer--open .ri-section:nth-of-type(2) { animation-delay: calc(var(--hzn-dur-stagger) * 1); }
            .hzn-drawer--open .ri-section:nth-of-type(3) { animation-delay: calc(var(--hzn-dur-stagger) * 2); }
            .hzn-drawer--open .ri-section:nth-of-type(4) { animation-delay: calc(var(--hzn-dur-stagger) * 3); }
            .hzn-drawer--open .ri-section:nth-of-type(5) { animation-delay: calc(var(--hzn-dur-stagger) * 4); }
            .hzn-drawer--open .ri-section:nth-of-type(6) { animation-delay: calc(var(--hzn-dur-stagger) * 5); }
            
            @keyframes giFadeUp {
              from { opacity: 0; transform: translateY(4px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            /* Auto-reveal Details */
            .ri-details {
              overflow: clip;
              max-height: 0;
              opacity: 0;
              transform: translateY(6px);
              transition: max-height var(--ri-dur) var(--ri-ease-io), 
                          opacity var(--ri-dur) var(--ri-ease-io), 
                          transform var(--ri-dur) var(--ri-ease-io);
            }
            
            .drawer--detailed .ri-details {
              max-height: 1200px;
              opacity: 1;
              transform: translateY(0);
            }
            
            /* Confidence Ring Breathing */
            .confidence-ring {
              transition: box-shadow var(--li-duration) var(--li-ease);
            }
            
            .confidence-ring[data-sentiment="risk"] {
              animation: confidenceBreathe 5s ease-in-out infinite;
              box-shadow: 0 0 0 0 var(--li-halo-risk);
            }
            
            .confidence-ring[data-sentiment="opportunity"] {
              animation: confidenceBreathe 5s ease-in-out infinite;
              box-shadow: 0 0 0 0 var(--li-halo-oppty);
            }
            
            .confidence-ring[data-sentiment="neutral"] {
              animation: confidenceBreathe 5s ease-in-out infinite;
              box-shadow: 0 0 0 0 var(--li-halo-neutral);
            }
            
            @keyframes confidenceBreathe {
              0%, 100% { box-shadow: 0 0 0 0 currentColor; }
              50% { box-shadow: 0 0 0 8px currentColor; }
            }
            
            /* Confidence Row */
            .ri-confidence-inline {
              display: flex;
              align-items: center;
              gap: 10px;
              line-height: 1.2;
              transform: translateY(-1px);
            }
            
            /* Context Tags */
            .li-meta-tags {
              display: flex;
              align-items: center;
              flex-wrap: wrap;
            }
            
            .li-tag {
              background: rgba(255, 255, 255, 0.06);
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 10px;
              padding: 4px 10px;
              font-size: 12px;
              color: rgba(255, 255, 255, 0.65);
              display: inline-flex;
              align-items: center;
            }
            
            /* AI Voice Tone */
            .ai-voice {
              color: var(--li-ai-voice);
              font-style: italic;
              font-weight: 500;
              letter-spacing: -0.01em;
              font-size: 14px;
              margin-bottom: 12px;
              display: flex;
              align-items: center;
            }
            
            .li-ai-voice-dot {
              display: inline-block;
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: var(--li-ai-voice);
              margin-right: 8px;
              animation: pulseAI 2s ease-in-out infinite;
            }
            
            @keyframes pulseAI {
              0%, 100% { opacity: 0.4; }
              50% { opacity: 1; }
            }
            
            /* Grid for Risk/Upside Cards */
            .ri-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 16px;
              overflow: visible;
            }
            
            /* Luminous Cards */
            .ri-card {
              border-radius: var(--mp-radius);
              padding: 20px;
              background: rgba(255, 255, 255, 0.02);
              border: var(--mp-border);
              box-shadow: var(--mp-shadow-soft);
              overflow: visible;
              transition: box-shadow var(--ri-dur) var(--ri-ease-io), background var(--ri-dur) var(--ri-ease-io);
            }
            
            .ri-card.active.risk {
              box-shadow: var(--mp-risk-rim), var(--mp-shadow-soft);
              background: linear-gradient(180deg, rgba(255, 60, 60, 0.08), transparent);
              filter: drop-shadow(0 10px 18px rgba(120,20,20,0.25));
            }
            
            .ri-card.active.oppty {
              box-shadow: var(--mp-up-rim), var(--mp-shadow-soft);
              background: linear-gradient(180deg, rgba(60, 220, 160, 0.08), transparent);
              filter: drop-shadow(0 10px 18px rgba(14,70,52,0.22));
            }
            
            .ri-card p {
              margin-bottom: 10px;
            }
            
            /* Quote Block */
            blockquote.ri-section-body {
              border-left: 2px solid rgba(90,150,255,0.50);
              padding-left: 12px;
              margin: 10px 0 6px;
            }
            
            /* Correlated Signals */
            .ri-next {
              display: flex;
              align-items: center;
              gap: var(--mp-gap);
              padding: 14px 16px;
              border-radius: 14px;
              border: 1px solid rgba(255, 255, 255, 0.08);
              background: rgba(255, 255, 255, 0.04);
              transition: transform var(--ri-dur-fast) var(--ri-ease-io), filter var(--ri-dur-fast) var(--ri-ease-io);
            }
            
            .ri-carousel {
              display: flex;
              gap: var(--mp-gap);
              overflow-x: auto;
              scrollbar-width: none;
              flex: 1;
              padding-right: 6px;
            }
            
            .ri-carousel::-webkit-scrollbar {
              display: none;
            }
            
            .ri-chip {
              padding: 6px 10px;
              border-radius: 999px;
              background: rgba(255, 255, 255, 0.06);
              white-space: nowrap;
              font-size: 13px;
              font-weight: 500;
              color: rgba(255, 255, 255, 0.85);
              border: 1px solid rgba(255, 255, 255, 0.08);
              cursor: pointer;
              transition: background var(--ri-dur-fast) var(--ri-ease-io), 
                          transform var(--ri-dur-fast) var(--ri-ease-io);
            }
            
            .ri-chip:hover {
              background: rgba(255, 255, 255, 0.10);
              transform: translateY(-1px);
            }
            
            .li-preview {
              z-index: 100;
              pointer-events: none;
            }
            
            /* Header Controls */
            .hzn-drawer .drawer-controls [data-icon] {
              opacity: 0;
              transform: scale(0.96);
            }
            
            .hzn-drawer--open .drawer-controls [data-icon] {
              animation: hznControlsIn 260ms var(--hzn-ease-silk) 120ms forwards;
            }
            
            @keyframes hznControlsIn {
              to { opacity: 1; transform: scale(1); }
            }
            
            /* Confidence Ring */
            .hzn-confidence-ring {
              opacity: 0;
              transform: scale(0.92);
            }
            
            .hzn-drawer--open .hzn-confidence-ring {
              animation: hznRingIn 320ms var(--hzn-ease-silk) 180ms forwards;
            }
            
            @keyframes hznRingIn {
              to { opacity: 1; transform: scale(1); }
            }
            
            /* Typography */
            .ri-section-title {
              font-size: 13px;
              font-weight: 600;
              letter-spacing: -0.01em;
              text-transform: uppercase;
              color: #AAB1B8;
              opacity: 0.70;
              margin-bottom: 6px;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            
            .ri-section-body {
              font-size: 15px;
              font-weight: 400;
              line-height: 1.55;
              color: #FFFFFF;
              opacity: 0.82;
            }
            
            .ri-section-body strong {
              font-weight: 600;
              opacity: 0.92;
            }
            
            [data-icon]:hover {
              transform: translateY(-1px);
              filter: brightness(1.1);
              transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), filter 180ms cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            /* Performance */
            .hzn-drawer,
            .hzn-frosted-backdrop,
            .hzn-header-scrim {
              transform: translateZ(0);
              backface-visibility: hidden;
              perspective: 1000px;
            }
            
            /* Reduced Motion */
            @media (prefers-reduced-motion: reduce) {
              .hzn-drawer,
              .hzn-frosted-backdrop,
              .hzn-header-scrim,
              .ri-section,
              .ri-details,
              .li-beam,
              .drawer-controls [data-icon],
              .hzn-confidence-ring,
              .confidence-ring,
              .li-link,
              .li-ai-voice-dot {
                transition: none !important;
                animation: none !important;
                transform: none !important;
                filter: none !important;
              }
              
              .drawer--detailed .ri-details {
                max-height: none !important;
                opacity: 1 !important;
              }
              
              .hzn-drawer--open .ri-section,
              .hzn-drawer--open .drawer-controls [data-icon],
              .hzn-drawer--open .hzn-confidence-ring {
                opacity: 1 !important;
                transform: none !important;
              }
            }
          `}</style>

          {/* Header Scrim */}
          <div
            className={`hzn-header-scrim ${isAnimatingIn ? 'hzn-header-scrim--open' : ''}`}
            aria-hidden="true"
          />

          {/* Frosted Backdrop */}
          <div
            data-sentiment={sentiment}
            className={`hzn-frosted-backdrop ${isAnimatingIn ? 'hzn-frosted-backdrop--open' : ''}`}
            onClick={onClose}
            role="presentation"
            aria-hidden={!isOpen}
          />

          {/* Priority Drawer Panel */}
          <aside
            ref={containerRef}
            data-sentiment={sentiment}
            className={`hzn-drawer ${isAnimatingIn ? 'hzn-drawer--open' : ''} ${viewMode === 'detailed' ? 'drawer--detailed' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Priority Signal Analysis"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Center Light Beam */}
            <div ref={beamRef} className="li-beam" aria-hidden="true" />

            <div className="relative w-full max-h-[88vh]" style={{ overflow: 'hidden' }}>
              {/* Keyboard Hints */}
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full text-xs"
                    style={{
                      background: 'rgba(0, 0, 0, 0.75)',
                      backdropFilter: 'blur(16px)',
                      color: '#AAB1B8',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      fontSize: 11,
                      fontWeight: 500,
                    }}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: HORIZON.motion.ease }}
                  >
                    ⌘ ← / → to navigate • D to toggle details • Esc to close
                  </motion.div>
                )}
              </AnimatePresence>

              {/* HEADER */}
              <div
                className="relative z-10 p-8 pb-6"
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div className="flex items-start justify-between gap-6 mb-4">
                  <div className="flex-1 min-w-0">
                    <h1
                      className="mb-2"
                      style={{
                        fontSize: HORIZON.type.h1.size,
                        fontWeight: HORIZON.type.h1.weight,
                        letterSpacing: `${HORIZON.type.h1.tracking}em`,
                        color: '#FFFFFF',
                        opacity: HORIZON.type.h1.opacity,
                      }}
                    >
                      Priority Signal Analysis
                    </h1>
                    <p
                      className="mb-3"
                      style={{
                        fontSize: HORIZON.type.meta.size,
                        fontWeight: HORIZON.type.meta.weight,
                        color: '#AAB1B8',
                        opacity: HORIZON.type.meta.opacity,
                        textTransform: 'uppercase',
                        letterSpacing: `${HORIZON.type.meta.tracking}em`,
                      }}
                    >
                      Sector: {primarySector} • Source: {signal.source?.toUpperCase()}
                    </p>
                    
                    <ContextTags signalAge={ageLabel} durationBias={durationBias} />
                    
                    <SentimentChip sentiment={sentiment} />
                  </div>

                  {/* Navigation Controls */}
                  <div className="drawer-controls flex items-center gap-2">
                    <button
                      onClick={() => onNavigate?.('prev')}
                      className="p-2.5 rounded-xl transition-all duration-180"
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#D7DBE0',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
                        e.currentTarget.style.transform = 'scale(1.03)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      aria-label="Previous signal"
                    >
                      <ChevronLeft className="w-5 h-5" data-icon />
                    </button>

                    <button
                      onClick={() => onNavigate?.('next')}
                      className="p-2.5 rounded-xl transition-all duration-180"
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#D7DBE0',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
                        e.currentTarget.style.transform = 'scale(1.03)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      aria-label="Next signal"
                    >
                      <ChevronRight className="w-5 h-5" data-icon />
                    </button>

                    <button
                      onClick={onClose}
                      className="p-2.5 rounded-xl ml-2 transition-all duration-180"
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#D7DBE0',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
                        e.currentTarget.style.transform = 'scale(1.03)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      aria-label="Close"
                    >
                      <X className="w-6 h-6" data-icon />
                    </button>

                    <button
                      onClick={() => setViewMode(prev => prev === 'detailed' ? 'simplified' : 'detailed')}
                      className="p-2.5 rounded-xl ml-2 transition-all duration-180"
                      style={{
                        background: viewMode === 'detailed' ? 'rgba(94, 167, 255, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                        border: viewMode === 'detailed' ? '1px solid rgba(94, 167, 255, 0.30)' : '1px solid rgba(255, 255, 255, 0.08)',
                        color: viewMode === 'detailed' ? '#5EA7FF' : '#D7DBE0',
                        fontSize: 12,
                        fontWeight: 600,
                        padding: '8px 14px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = viewMode === 'detailed' ? 'rgba(94, 167, 255, 0.20)' : 'rgba(255, 255, 255, 0.10)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = viewMode === 'detailed' ? 'rgba(94, 167, 255, 0.15)' : 'rgba(255, 255, 255, 0.06)';
                      }}
                      aria-label={viewMode === 'detailed' ? 'Switch to simplified view' : 'Switch to detailed view'}
                    >
                      {viewMode === 'detailed' ? 'Simplified' : 'Detailed'}
                    </button>
                  </div>
                </div>
              </div>

              {/* BODY */}
              <div
                className="relative z-10 overflow-y-auto"
                style={{
                  maxHeight: 'calc(88vh - 180px)',
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(255, 255, 255, 0.18) rgba(255, 255, 255, 0.04)',
                }}
              >
                <style>{`
                  .overflow-y-auto::-webkit-scrollbar {
                    width: 6px;
                  }
                  .overflow-y-auto::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.04);
                    border-radius: 6px;
                  }
                  .overflow-y-auto::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.18);
                    border-radius: 6px;
                  }
                  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.25);
                  }
                `}</style>

                <div className="p-8 pt-6">
                  {/* ============================================================
                      SIMPLIFIED VIEW: Summary, Confidence, Why It Matters, In Simple Terms
                      These 4 sections appear in BOTH views
                  ============================================================ */}
                  
                  {/* 1. SUMMARY */}
                  <section className="ri-section mb-6">
                    <h3 className="ri-section-title">
                      <Sparkles className="w-4 h-4" style={{ color: HORIZON.color.accent }} />
                      Summary
                    </h3>
                    <p className="ri-section-body mb-4">{summary}</p>
                    
                    {/* 2. CONFIDENCE */}
                    <div className="ri-confidence-inline">
                      <span className="text-xs font-medium uppercase tracking-wide" style={{ color: '#AAB1B8', opacity: 0.7 }}>
                        Confidence
                      </span>
                      <ConfidenceRing value={confOverall} color={HORIZON.color.neutral} size={42} sentiment={sentiment} />
                    </div>
                  </section>

                  <NarrativeLink />

                  {/* 3. WHY IT MATTERS */}
                  <section className="ri-section">
                    <h3 className="ri-section-title">
                      <Sparkles className="w-4 h-4" style={{ color: HORIZON.color.accent }} />
                      Why It Matters
                    </h3>
                    <p className="ri-section-body">
                      {analysis.why}
                    </p>
                  </section>

                  <NarrativeLink />

                  {/* 4. IN SIMPLE TERMS */}
                  {translation && (
                    <section className="ri-section">
                      <div 
                        className="p-5 rounded-[16px] border relative"
                        style={{
                          background: 'rgba(255, 255, 255, 0.025)',
                          borderColor: 'rgba(255, 255, 255, 0.08)',
                          backdropFilter: 'blur(18px)',
                        }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-3.5 h-3.5" style={{ color: 'rgba(255, 255, 255, 0.55)' }} />
                          <span 
                            className="text-[11px] font-semibold uppercase tracking-wide"
                            style={{ color: 'rgba(255, 255, 255, 0.55)' }}
                          >
                            In Simple Terms
                          </span>
                        </div>
                        <p 
                          className="text-[14px] font-normal leading-relaxed"
                          style={{ 
                            color: 'rgba(255, 255, 255, 0.82)',
                            lineHeight: '1.55'
                          }}
                        >
                          {translation}
                        </p>
                      </div>
                    </section>
                  )}

                  {/* ============================================================
                      DETAILED VIEW ONLY: Everything below only shows when detailed
                      What Happened, Impact Snapshot, Risk/Upside, Ripple Effects,
                      Market Relevance, How Investors May Respond, Related Signals
                  ============================================================ */}
                  <div className="ri-details">
                    <NarrativeLink />

                    {/* 5. WHAT HAPPENED (Detailed only) */}
                    <section className="ri-section">
                      <h3 className="ri-section-title">
                        <Target className="w-4 h-4" style={{ color: HORIZON.color.accent }} />
                        What Happened
                      </h3>
                      <p className="ri-section-body">{analysis.what}</p>
                    </section>

                    <NarrativeLink />

                    {/* 6. IMPACT SNAPSHOT (Detailed only) */}
                    <section className="ri-section">
                      <h3 className="ri-section-title">
                        <Activity className="w-4 h-4" style={{ color: HORIZON.color.accent }} />
                        Impact Snapshot
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.impacts.map((impact, i) => (
                          <ImpactChip key={i} text={impact.text} tone={impact.tone} />
                        ))}
                      </div>
                    </section>

                    <NarrativeLink />

                    {/* 7 & 8. DOWNSIDE RISK / UPSIDE POTENTIAL (Detailed only) */}
                    <section className="ri-section">
                      <div className="ri-grid mb-2">
                        <div className={`ri-card ${sentiment === 'risk' ? 'active risk' : ''}`}>
                          <div className="flex items-center gap-3 mb-3">
                            <AlertCircle className="w-5 h-5" style={{ color: HORIZON.color.risk }} />
                            <h4 className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#AAB1B8', margin: 0 }}>
                              Downside Risk
                            </h4>
                          </div>
                          <p className="text-sm mb-3" style={{ color: '#D7DBE0', lineHeight: 1.6, opacity: 0.82 }}>
                            {analysis.downside.text}
                          </p>
                          <div className="text-xs" style={{ color: '#AAB1B8' }}>
                            Confidence: <span style={{ color: HORIZON.color.risk, fontWeight: 700 }}>
                              {analysis.downside.confidence}%
                            </span>
                          </div>
                        </div>

                        <div className={`ri-card ${sentiment === 'opportunity' ? 'active oppty' : ''}`}>
                          <div className="flex items-center gap-3 mb-3">
                            <ShieldCheck className="w-5 h-5" style={{ color: HORIZON.color.opportunity }} />
                            <h4 className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#AAB1B8', margin: 0 }}>
                              Upside Potential
                            </h4>
                          </div>
                          <p className="text-sm mb-3" style={{ color: '#D7DBE0', lineHeight: 1.6, opacity: 0.82 }}>
                            {analysis.upside.text}
                          </p>
                          <div className="text-xs" style={{ color: '#AAB1B8' }}>
                            Confidence: <span style={{ color: HORIZON.color.opportunity, fontWeight: 700 }}>
                              {analysis.upside.confidence}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </section>

                    <NarrativeLink />

                    {/* 9. RIPPLE EFFECTS (Detailed only) */}
                    {rippleImpact && (
                      <>
                        <section className="ri-section">
                          <h3 className="ri-section-title">
                            <Activity className="w-4 h-4" style={{ color: HORIZON.color.accent }} />
                            Ripple Effects
                          </h3>
                          <p className="ri-section-body">{rippleImpact}</p>
                        </section>
                        <NarrativeLink />
                      </>
                    )}

                    {/* 10. CONTEXT QUOTE (Detailed only, optional) */}
                    {analysis.quote && (
                      <>
                        <blockquote
                          className="ri-section-body mb-6 pl-4 italic"
                          style={{
                            borderLeft: `2px solid ${HORIZON.color.accent}`,
                            opacity: 0.85,
                          }}
                        >
                          "{analysis.quote}"
                        </blockquote>
                        <NarrativeLink />
                      </>
                    )}

                    {/* 11. MARKET RELEVANCE (Detailed only) */}
                    <div className="mb-6">
                      <h4 className="ri-section-title">Market Relevance</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-xs font-semibold mb-1" style={{ color: '#AAB1B8', opacity: 0.6 }}>
                            What Changes
                          </div>
                          <p className="text-sm" style={{ color: '#D7DBE0', lineHeight: 1.5, opacity: 0.82 }}>
                            {analysis.relevance.impacts}
                          </p>
                        </div>
                        <div>
                          <div className="text-xs font-semibold mb-1" style={{ color: '#AAB1B8', opacity: 0.6 }}>
                            Sectors Affected
                          </div>
                          <p className="text-sm" style={{ color: '#D7DBE0', lineHeight: 1.5, opacity: 0.82 }}>
                            {analysis.relevance.sectors}
                          </p>
                        </div>
                        <div>
                          <div className="text-xs font-semibold mb-1" style={{ color: '#AAB1B8', opacity: 0.6 }}>
                            Investment Types
                          </div>
                          <p className="text-sm" style={{ color: '#D7DBE0', lineHeight: 1.5, opacity: 0.82 }}>
                            {analysis.relevance.assetClasses}
                          </p>
                        </div>
                      </div>
                    </div>

                    <NarrativeLink />

                    {/* 12. HOW INVESTORS MAY RESPOND (Detailed only) */}
                    <div
                      className="ri-card mb-6"
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Link2 className="w-4 h-4" style={{ color: HORIZON.color.accent }} />
                        <h4 className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#AAB1B8', margin: 0 }}>
                          How Investors May Respond
                        </h4>
                      </div>
                      <p className="ai-voice">
                        <span className="li-ai-voice-dot" />
                        Based on this signal:
                      </p>
                      <p className="text-sm" style={{ color: '#D7DBE0', lineHeight: 1.6, opacity: 0.82 }}>
                        {analysis.strategy}
                      </p>
                    </div>

                    {/* 13. RELATED SIGNALS (Detailed only) */}
                    <section className="ri-section">
                      <div className="ri-next">
                        <strong style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.88)' }}>
                          Related Signals
                        </strong>
                        <div className="ri-carousel">
                          {analysis.correlated.map((s) => (
                            <CorrelatedChip 
                              key={s.id} 
                              signal={s} 
                              onNavigate={(id) => console.log('Navigate to signal:', id)} 
                            />
                          ))}
                        </div>
                        <ArrowRight className="w-4 h-4" style={{ color: 'rgba(255, 255, 255, 0.6)', flexShrink: 0 }} />
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}
    </AnimatePresence>
  );
}