import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Target, Activity, Sparkles, AlertCircle, ShieldCheck, ArrowRight, Clock, Zap } from 'lucide-react';

// ============================================================================
// OS HORIZON V2 — U.S. FRONT PAGE SIGNALS DRAWER
// CEP Information Architecture: Centerpiece → Essentials → Proof
// ============================================================================

const HORIZON = {
  glass: {
    base: 'rgba(24, 26, 29, 0.55)',
    border: 'rgba(255, 255, 255, 0.06)',
    radius: 20,
    blur: 26,
    shadow: '0 20px 60px rgba(0, 0, 0, 0.40)',
  },
  motion: {
    ease: [0.18, 0.82, 0.23, 1],
    dur: { open: 260, close: 260, fast: 180 },
  },
  color: {
    risk: '#F26A6A',
    opportunity: '#2ECF8D',
    neutral: '#5EA7FF',
    accent: '#7DD3FC',
  },
};

// Affected Asset Pill
const AssetPill = ({ text, tone = 'neutral' }) => {
  const styles = {
    risk: { bg: 'rgba(255, 60, 60, 0.12)', fg: '#F26A6A', border: 'rgba(255, 60, 60, 0.25)' },
    opportunity: { bg: 'rgba(46, 207, 141, 0.12)', fg: '#2ECF8D', border: 'rgba(46, 207, 141, 0.25)' },
    neutral: { bg: 'rgba(94, 167, 255, 0.12)', fg: '#5EA7FF', border: 'rgba(94, 167, 255, 0.25)' },
  };
  const style = styles[tone] || styles.neutral;

  return (
    <span
      className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold"
      style={{
        background: style.bg,
        color: style.fg,
        border: `1px solid ${style.border}`,
      }}
    >
      {text}
    </span>
  );
};

// Tempo Tag
const TempoTag = ({ tempo }) => {
  const tempoStyles = {
    'Breaking': { bg: 'rgba(255, 60, 60, 0.15)', fg: '#FF6B6B', icon: Zap },
    'Developing': { bg: 'rgba(255, 180, 60, 0.15)', fg: '#FFB43C', icon: Activity },
    'Confirmed': { bg: 'rgba(46, 207, 141, 0.15)', fg: '#2ECF8D', icon: Target },
    'Market-Moving': { bg: 'rgba(138, 100, 223, 0.15)', fg: '#8A64DF', icon: Activity },
    'Risk-Off Catalyst': { bg: 'rgba(255, 60, 60, 0.15)', fg: '#FF6B6B', icon: AlertCircle },
  };

  const style = tempoStyles[tempo] || tempoStyles['Developing'];
  const Icon = style.icon;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
      style={{ background: style.bg, color: style.fg }}
    >
      <Icon className="w-3 h-3" />
      {tempo}
    </span>
  );
};

// Correlated Signal Chip
const CorrelatedChip = ({ signal, onNavigate }) => (
  <button 
    className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150"
    style={{
      background: 'rgba(255, 255, 255, 0.06)',
      color: 'rgba(255, 255, 255, 0.85)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
    }}
    onClick={() => onNavigate?.(signal.id)}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
      e.currentTarget.style.transform = 'translateY(-1px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    {signal.label}
  </button>
);

// Generate CEP content for each signal type
const getCEPContent = (signal) => {
  switch (signal.tag) {
    case 'Policy Shock':
      return {
        // CENTERPIECE: One sentence, clear summary
        centerpiece: 'New U.S. regulations will increase costs for companies using AI tools, reducing profits and making tech stocks less attractive.',
        
        // ESSENTIALS: Three bullets only
        essentials: {
          whatHappened: 'The U.S. government announced stricter content and safety requirements for companies using artificial intelligence.',
          whyItMatters: 'Tech companies will spend more on lawyers and compliance teams, leaving less money for growth and innovation.',
          marketImpact: 'Technology stocks may fall as investors expect lower profits; safer investments like government bonds may benefit.',
        },
        
        // AFFECTED ASSETS
        affectedAssets: [
          { text: 'Tech Stocks', tone: 'risk' },
          { text: 'Government Bonds', tone: 'opportunity' },
          { text: 'U.S. Dollar', tone: 'opportunity' },
        ],
        
        // TEMPO
        tempo: 'Market-Moving',
        
        // DETAILED VIEW CONTENT
        summary: 'New AI regulations will force large technology companies to spend significantly more on compliance. This reduces their profit margins and makes their stocks less attractive to investors. The Federal Reserve may keep interest rates higher for longer as a result.',
        
        whyItMattersExpanded: 'Technology companies that use AI tools—including search engines, social media platforms, and cloud services—will need to hire more compliance staff and lawyers. This directly reduces their profits. Smaller companies may struggle to afford the new requirements, potentially reducing competition. Investors who own tech stocks may see lower returns.',
        
        inSimpleTerms: 'Imagine a restaurant now needs expensive new kitchen equipment to stay open. They have to raise prices or make less money. That is what is happening to tech companies with these new rules.',
        
        whatHappenedFull: 'The U.S. government announced a new regulatory framework requiring companies that develop or deploy artificial intelligence to meet stricter safety, transparency, and content moderation standards. The rules take effect in 90 days.',
        
        impactSnapshot: {
          whatChanges: 'Compliance costs rise 40-60% for major tech companies; legal and safety teams expand significantly',
          whosAffected: 'Large tech companies (Apple, Google, Meta, Microsoft), AI startups, cloud service providers',
          marketImpact: 'Tech stock valuations may decline; investors may rotate to safer assets like bonds',
        },
        
        rippleEffects: 'Smaller AI companies may struggle to afford compliance costs, potentially reducing innovation. Some companies may delay new product launches. International tech companies may face similar rules in Europe and Asia.',
        
        howInvestorsMayRespond: 'Investors may reduce holdings in high-growth tech stocks and increase positions in established, profitable companies. Some may move money to government bonds or dividend-paying stocks. Caution around AI-focused investments is likely to increase.',
        
        downside: {
          text: 'If regulations tighten faster than expected, tech companies may see sharper profit declines. Stock prices could fall significantly.',
          confidence: 85,
        },
        
        upside: {
          text: 'Companies that adapt quickly may gain competitive advantages. Stronger regulations could reduce fraud and build consumer trust long-term.',
          confidence: 60,
        },
        
        relatedSignals: [
          { id: 1, label: 'Fed Rate Decision' },
          { id: 2, label: 'Tech Earnings' },
          { id: 3, label: 'EU Data Privacy' },
        ],
      };
    
    case 'Credit Stress':
      return {
        centerpiece: 'Borrowing costs for emerging market companies are rising sharply, creating financial stress and increasing the risk of payment problems.',
        
        essentials: {
          whatHappened: 'Interest rates on loans for companies in developing countries increased this week, and fewer new bonds are being issued.',
          whyItMatters: 'Companies with existing debt now face higher costs to refinance, which may force them to cut jobs, sell assets, or default.',
          marketImpact: 'Emerging market bonds are falling in value; investors are moving money to safer U.S. assets.',
        },
        
        affectedAssets: [
          { text: 'Emerging Market Bonds', tone: 'risk' },
          { text: 'U.S. Dollar', tone: 'opportunity' },
          { text: 'Safe Haven Bonds', tone: 'opportunity' },
        ],
        
        tempo: 'Developing',
        
        summary: 'Companies in developing countries like Argentina, Turkey, and South Africa are finding it harder and more expensive to borrow money. This creates a ripple effect that can hurt global markets.',
        
        whyItMattersExpanded: 'When borrowing costs rise, companies with existing loans face tough choices. They may need to lay off workers, sell parts of their business, or even fail to pay back their loans. This stress can spread to banks and investors worldwide who have money invested in these markets.',
        
        inSimpleTerms: 'Imagine you have a credit card and suddenly the interest rate doubles. You might struggle to pay your bills. The same thing is happening to companies in developing countries.',
        
        whatHappenedFull: 'Over the past week, the cost for emerging market companies to borrow money has increased by approximately 0.5 percentage points. New bond sales have dropped significantly as investors become more cautious.',
        
        impactSnapshot: {
          whatChanges: 'Borrowing costs up 50+ basis points; new bond issuance down sharply',
          whosAffected: 'Companies in emerging markets, banks with international exposure, export-focused U.S. companies',
          marketImpact: 'Emerging market bonds losing value; U.S. dollar strengthening; safe assets gaining',
        },
        
        rippleEffects: 'U.S. companies that sell products overseas may see weaker demand. Banks with loans to emerging market companies may face losses. The stress could spread if major companies default on their debts.',
        
        howInvestorsMayRespond: 'Investors may sell emerging market bonds and stocks, moving money to U.S. government bonds and large U.S. companies. Currency hedging may increase. Focus on companies with low debt may grow.',
        
        downside: {
          text: 'If stress worsens, major defaults could trigger a broader financial crisis affecting global markets.',
          confidence: 72,
        },
        
        upside: {
          text: 'Patient investors may find opportunities to buy quality assets at discounted prices if the stress proves temporary.',
          confidence: 55,
        },
        
        relatedSignals: [
          { id: 1, label: 'Dollar Strength' },
          { id: 2, label: 'Fed Policy' },
          { id: 3, label: 'China Economy' },
        ],
      };
    
    case 'Tech Disruption':
      return {
        centerpiece: 'A quantum computing breakthrough could eventually break current digital security systems, but the immediate market impact is limited.',
        
        essentials: {
          whatHappened: 'Researchers demonstrated that quantum computers are getting closer to being able to decode the encryption that protects most digital data.',
          whyItMatters: 'Banks, governments, and tech companies will eventually need to upgrade their security systems, which will cost billions.',
          marketImpact: 'Cybersecurity stocks may benefit long-term; immediate market reaction is muted due to the multi-year timeline.',
        },
        
        affectedAssets: [
          { text: 'Cybersecurity Stocks', tone: 'opportunity' },
          { text: 'Tech Infrastructure', tone: 'neutral' },
          { text: 'Financial Services', tone: 'neutral' },
        ],
        
        tempo: 'Developing',
        
        summary: 'Quantum computers are getting more powerful. Eventually, they could break the security codes that protect everything from your bank account to government secrets. Companies will need to upgrade their systems.',
        
        whyItMattersExpanded: 'Most online security today uses math problems that are easy for regular computers to create but nearly impossible to solve. Quantum computers work differently and could eventually solve these problems quickly. This means companies and governments will need new security systems.',
        
        inSimpleTerms: 'Think of current encryption like a lock with trillions of possible key combinations. Regular computers would take centuries to try them all. Quantum computers could try them all in minutes.',
        
        whatHappenedFull: 'A research team published findings showing significant progress toward quantum computers that can break current encryption standards. Full capability is still estimated to be 5-10 years away.',
        
        impactSnapshot: {
          whatChanges: 'Long-term need for security upgrades; increased R&D spending on quantum-resistant encryption',
          whosAffected: 'Banks, tech companies, government agencies, healthcare organizations',
          marketImpact: 'Cybersecurity sector may see increased investment; timeline is long-term',
        },
        
        rippleEffects: 'Companies developing quantum-resistant security may become acquisition targets. Government spending on cybersecurity may increase. The race to achieve "quantum supremacy" may accelerate between the U.S. and China.',
        
        howInvestorsMayRespond: 'Long-term investors may gradually increase positions in cybersecurity companies. Short-term traders are unlikely to react significantly due to the extended timeline. Focus on companies already developing quantum-resistant solutions.',
        
        downside: {
          text: 'If quantum computing advances faster than expected, companies may face emergency upgrade costs and potential security breaches.',
          confidence: 45,
        },
        
        upside: {
          text: 'Companies leading in quantum-resistant security could see strong demand and revenue growth over the next decade.',
          confidence: 68,
        },
        
        relatedSignals: [
          { id: 1, label: 'Cybersecurity Spending' },
          { id: 2, label: 'Cloud Security' },
          { id: 3, label: 'Tech Infrastructure' },
        ],
      };
    
    case 'Geopolitical Risk':
      return {
        centerpiece: 'Trade tensions between major economies are disrupting supply chains, raising costs for manufacturers and potentially increasing consumer prices.',
        
        essentials: {
          whatHappened: 'The U.S., China, and other countries announced new tariffs and trade restrictions affecting electronics, cars, and industrial goods.',
          whyItMatters: 'Companies that import parts from overseas will pay more, which may lead to higher prices for consumers and lower profits.',
          marketImpact: 'Manufacturing and retail stocks are under pressure; companies focused on U.S. production may benefit.',
        },
        
        affectedAssets: [
          { text: 'Manufacturing Stocks', tone: 'risk' },
          { text: 'Consumer Goods', tone: 'risk' },
          { text: 'U.S. Domestic Companies', tone: 'opportunity' },
        ],
        
        tempo: 'Risk-Off Catalyst',
        
        summary: 'When countries tax each other\'s products (tariffs), it becomes more expensive for companies to make and sell things. This can mean higher prices at stores and less money for companies.',
        
        whyItMattersExpanded: 'Many products—from phones to cars to appliances—are made with parts from multiple countries. When tariffs make those parts more expensive, companies either raise prices (bad for shoppers) or accept lower profits (bad for investors). Some companies may also face delays getting the parts they need.',
        
        inSimpleTerms: 'Imagine if every ingredient at a restaurant suddenly cost 25% more because it came from another country. The restaurant would need to raise menu prices or make less money. That is what tariffs do to manufacturers.',
        
        whatHappenedFull: 'Several rounds of new tariffs were announced this week, affecting approximately $200 billion in traded goods. Retaliatory measures are expected. Supply chain disruptions are already being reported.',
        
        impactSnapshot: {
          whatChanges: 'Import costs rising 10-25%; supply chain delays increasing; some production shifting',
          whosAffected: 'Manufacturers, retailers, automakers, electronics companies, consumers',
          marketImpact: 'International stocks falling; domestic-focused companies gaining; consumer prices may rise',
        },
        
        rippleEffects: 'Companies may accelerate plans to move production to other countries or back to the U.S. Consumers may see higher prices on certain goods. Some products may become temporarily unavailable.',
        
        howInvestorsMayRespond: 'Investors may reduce exposure to companies heavily dependent on imports and increase holdings in U.S.-focused manufacturers. Defensive sectors like utilities may attract more interest. Currency hedging may increase.',
        
        downside: {
          text: 'If tensions escalate further, severe supply disruptions could cause production shutdowns and sharp stock declines.',
          confidence: 78,
        },
        
        upside: {
          text: 'U.S. companies that manufacture domestically may capture market share as imports become less competitive.',
          confidence: 62,
        },
        
        relatedSignals: [
          { id: 1, label: 'China Relations' },
          { id: 2, label: 'Tariff Policy' },
          { id: 3, label: 'Supply Chain' },
        ],
      };
    
    case 'Energy Transition':
      return {
        centerpiece: 'A breakthrough in renewable energy technology could significantly reduce clean energy costs, accelerating the shift away from fossil fuels.',
        
        essentials: {
          whatHappened: 'Scientists announced a major improvement in solar panel efficiency that could make renewable energy much cheaper to produce.',
          whyItMatters: 'Cheaper clean energy means faster adoption by businesses and consumers, changing which energy companies succeed or struggle.',
          marketImpact: 'Renewable energy stocks may rise; traditional oil and gas companies may face increased pressure.',
        },
        
        affectedAssets: [
          { text: 'Renewable Energy Stocks', tone: 'opportunity' },
          { text: 'Oil & Gas Companies', tone: 'risk' },
          { text: 'Electric Utilities', tone: 'opportunity' },
        ],
        
        tempo: 'Developing',
        
        summary: 'When renewable energy becomes cheaper, more people and businesses switch to it. This is good for solar and wind companies but challenging for oil and gas companies.',
        
        whyItMattersExpanded: 'The main barrier to clean energy adoption has been cost. When that barrier drops significantly, the pace of change accelerates. Companies selling fossil fuels may see declining demand, while those in solar, wind, and batteries may grow rapidly.',
        
        inSimpleTerms: 'Imagine if electric cars suddenly cost less than gas cars to buy and run. Many more people would switch. The same principle applies when solar power becomes cheaper than coal or gas.',
        
        whatHappenedFull: 'Researchers published results showing a 30% improvement in solar panel efficiency using new materials. The technology is expected to reach commercial production within 2-3 years.',
        
        impactSnapshot: {
          whatChanges: 'Solar energy costs potentially falling 20-30%; adoption timelines accelerating',
          whosAffected: 'Renewable energy companies, oil and gas producers, utilities, automakers',
          marketImpact: 'Clean energy stocks rising; fossil fuel stocks under pressure; infrastructure spending increasing',
        },
        
        rippleEffects: 'Countries may accelerate clean energy goals. Jobs may shift from fossil fuel industries to renewable sectors. Electric vehicle adoption may speed up as charging becomes cheaper.',
        
        howInvestorsMayRespond: 'Investors may increase positions in solar, wind, and battery companies while reducing exposure to oil and gas. Infrastructure and utility companies with clean energy plans may attract interest.',
        
        downside: {
          text: 'Traditional energy companies may see declining revenue and stock prices as clean energy becomes more competitive.',
          confidence: 65,
        },
        
        upside: {
          text: 'Companies leading in renewable technology could see strong growth as global adoption accelerates.',
          confidence: 72,
        },
        
        relatedSignals: [
          { id: 1, label: 'Climate Policy' },
          { id: 2, label: 'Battery Technology' },
          { id: 3, label: 'Electric Vehicles' },
        ],
      };
    
    case 'Social Unrest':
      return {
        centerpiece: 'Protests over high living costs are spreading across Europe, potentially leading to policy changes and economic disruption.',
        
        essentials: {
          whatHappened: 'Large protests over rising food, housing, and energy costs are occurring in major cities across France, the UK, and Spain.',
          whyItMatters: 'Governments may respond with emergency spending or price controls, affecting business profits and market stability.',
          marketImpact: 'European stocks are under pressure; investors are moving money to safer assets like U.S. bonds.',
        },
        
        affectedAssets: [
          { text: 'European Stocks', tone: 'risk' },
          { text: 'Consumer Spending', tone: 'risk' },
          { text: 'Safe Haven Bonds', tone: 'opportunity' },
        ],
        
        tempo: 'Breaking',
        
        summary: 'When many people cannot afford basic necessities, they demand action from their governments. This can lead to policy changes that affect businesses and markets.',
        
        whyItMattersExpanded: 'High inflation makes everyday life harder—groceries, rent, and energy bills all cost more. When people struggle, they protest. Governments often respond with spending programs or price controls. These responses can help people but may also hurt business profits or increase government debt.',
        
        inSimpleTerms: 'When your paycheck does not stretch as far as it used to, you might complain to your employer or look for a better job. On a national scale, people protest to their government for help.',
        
        whatHappenedFull: 'Protests involving hundreds of thousands of people have occurred in Paris, London, and Madrid over the past week. Demonstrators are demanding government action on living costs. Some disruptions to business and transportation have been reported.',
        
        impactSnapshot: {
          whatChanges: 'Government spending likely to increase; potential price controls; business disruptions',
          whosAffected: 'European retailers, consumer goods companies, energy providers, tourists',
          marketImpact: 'European markets volatile; safe haven assets gaining; euro currency under pressure',
        },
        
        rippleEffects: 'Governments may announce emergency relief measures. Some businesses may close temporarily. Tourism may decline in affected cities. Political pressure on leaders may increase.',
        
        howInvestorsMayRespond: 'Investors may reduce exposure to European consumer-facing companies. Safe haven assets like U.S. government bonds may attract inflows. Defensive sectors like healthcare and utilities may outperform.',
        
        downside: {
          text: 'If unrest intensifies, severe economic disruption could spread across Europe, hurting global markets.',
          confidence: 68,
        },
        
        upside: {
          text: 'Government relief measures may stabilize the situation quickly. Inflation may ease faster than expected, calming tensions.',
          confidence: 52,
        },
        
        relatedSignals: [
          { id: 1, label: 'Inflation Data' },
          { id: 2, label: 'Energy Prices' },
          { id: 3, label: 'Government Policy' },
        ],
      };
    
    default:
      return {
        centerpiece: signal.text,
        essentials: {
          whatHappened: 'A significant market development has occurred.',
          whyItMatters: 'This may affect investment decisions and market sentiment.',
          marketImpact: 'Multiple asset classes could see impacts depending on how the situation develops.',
        },
        affectedAssets: [
          { text: 'Global Markets', tone: 'neutral' },
        ],
        tempo: 'Developing',
        summary: 'Market conditions are evolving in ways that may affect investment decisions.',
        whyItMattersExpanded: 'This development may influence how investors view risk and opportunity.',
        inSimpleTerms: 'Changes are happening that could affect investments.',
        whatHappenedFull: signal.text,
        impactSnapshot: {
          whatChanges: 'To be determined based on developments',
          whosAffected: 'Various market participants',
          marketImpact: 'Situation developing',
        },
        rippleEffects: 'Watch for related developments.',
        howInvestorsMayRespond: 'Investors may adjust positions based on their risk tolerance.',
        downside: { text: 'Uncertainty may increase market volatility.', confidence: 60 },
        upside: { text: 'Markets may adapt to new conditions.', confidence: 55 },
        relatedSignals: [{ id: 1, label: 'Related Signal' }],
      };
  }
};

// ============================================================================
// MAIN DRAWER COMPONENT
// ============================================================================
export default function FrontPageSignalDrawer({ isOpen, onClose, signal, onNavigate }) {
  const [viewMode, setViewMode] = useState('simplified');
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const containerRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsAnimatingIn(true));
    } else {
      setIsAnimatingIn(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      setViewMode('simplified');

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose?.();
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
        if (previousFocusRef.current?.focus) previousFocusRef.current.focus();
      };
    }
  }, [isOpen, onClose, onNavigate]);

  if (!isOpen || !signal) return null;

  const content = getCEPContent(signal);
  const sentiment = signal.urgency === 'critical' ? 'risk' : signal.urgency === 'high' ? 'risk' : 'neutral';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <style>{`
            .fps-drawer-backdrop {
              position: fixed;
              inset: 0;
              z-index: 80;
              background: rgba(24, 26, 29, 0.55);
              backdrop-filter: blur(26px) saturate(1.3);
              -webkit-backdrop-filter: blur(26px) saturate(1.3);
              opacity: 0;
              transition: opacity 280ms cubic-bezier(0.19, 1, 0.22, 1);
              mask-image: linear-gradient(to bottom, transparent 0, black calc(72px + 8px));
              -webkit-mask-image: linear-gradient(to bottom, transparent 0, black calc(72px + 8px));
            }
            
            .fps-drawer-backdrop--open { opacity: 1; }
            
            .fps-header-scrim {
              position: fixed;
              inset-inline: 0;
              top: 0;
              height: 72px;
              z-index: 95;
              pointer-events: none;
              background: linear-gradient(to bottom, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0) 100%);
              opacity: 0;
              transition: opacity 280ms cubic-bezier(0.19, 1, 0.22, 1);
            }
            
            .fps-header-scrim--open { opacity: 1; }
            
            .fps-drawer {
              position: fixed;
              z-index: 90;
              left: 0;
              right: 0;
              margin-inline: auto;
              top: calc(72px + 14px);
              max-width: min(720px, 90vw);
              border: 1px solid rgba(255, 255, 255, 0.06);
              background: linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(0,0,0,0.12));
              box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45);
              border-radius: 24px;
              overflow: hidden;
              transform: translateY(8px) scale(0.96);
              opacity: 0;
              transition: transform 280ms cubic-bezier(0.19, 1, 0.22, 1), opacity 280ms cubic-bezier(0.19, 1, 0.22, 1);
            }
            
            .fps-drawer--open {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
            
            .fps-section {
              margin-bottom: 24px;
              opacity: 0;
              transform: translateY(4px);
            }
            
            .fps-drawer--open .fps-section {
              animation: fpsFadeUp 320ms cubic-bezier(0.19, 1, 0.22, 1) forwards;
            }
            
            .fps-drawer--open .fps-section:nth-of-type(1) { animation-delay: 0ms; }
            .fps-drawer--open .fps-section:nth-of-type(2) { animation-delay: 60ms; }
            .fps-drawer--open .fps-section:nth-of-type(3) { animation-delay: 120ms; }
            .fps-drawer--open .fps-section:nth-of-type(4) { animation-delay: 180ms; }
            .fps-drawer--open .fps-section:nth-of-type(5) { animation-delay: 240ms; }
            
            @keyframes fpsFadeUp {
              from { opacity: 0; transform: translateY(4px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            .fps-details {
              overflow: clip;
              max-height: 0;
              opacity: 0;
              transition: max-height 280ms cubic-bezier(0.4, 0, 0.2, 1), opacity 280ms cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .fps-drawer--detailed .fps-details {
              max-height: 1500px;
              opacity: 1;
            }
            
            .fps-divider {
              height: 1px;
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
              margin: 20px 0;
            }
            
            @media (prefers-reduced-motion: reduce) {
              .fps-drawer, .fps-drawer-backdrop, .fps-header-scrim, .fps-section, .fps-details {
                transition: none !important;
                animation: none !important;
              }
              .fps-drawer--open .fps-section { opacity: 1 !important; transform: none !important; }
            }
          `}</style>

          <div className={`fps-header-scrim ${isAnimatingIn ? 'fps-header-scrim--open' : ''}`} aria-hidden="true" />

          <div
            className={`fps-drawer-backdrop ${isAnimatingIn ? 'fps-drawer-backdrop--open' : ''}`}
            onClick={onClose}
            role="presentation"
          />

          <aside
            ref={containerRef}
            className={`fps-drawer ${isAnimatingIn ? 'fps-drawer--open' : ''} ${viewMode === 'detailed' ? 'fps-drawer--detailed' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="U.S. Front Page Signal Analysis"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-h-[88vh]" style={{ overflow: 'hidden' }}>
              {/* HEADER */}
              <div className="relative z-10 p-6 pb-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="px-3 py-1.5 text-sm font-bold rounded-full"
                        style={{
                          background: 'linear-gradient(135deg, rgba(0,0,0,0.55), rgba(40,40,40,0.35))',
                          border: '1px solid rgba(255, 255, 255, 0.35)',
                          color: '#FFFFFF',
                        }}
                      >
                        {signal.tag}
                      </span>
                      {signal.source && (
                        <span className="text-xs uppercase tracking-wider" style={{ color: 'rgba(200, 210, 220, 0.8)' }}>
                          {signal.source}
                        </span>
                      )}
                      <TempoTag tempo={content.tempo} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate?.('prev')}
                      className="p-2 rounded-lg transition-all"
                      style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#D7DBE0' }}
                      aria-label="Previous signal"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onNavigate?.('next')}
                      className="p-2 rounded-lg transition-all"
                      style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#D7DBE0' }}
                      aria-label="Next signal"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={onClose}
                      className="p-2 rounded-lg ml-1 transition-all"
                      style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#D7DBE0' }}
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* BODY */}
              <div
                className="relative z-10 overflow-y-auto"
                style={{ maxHeight: 'calc(88vh - 100px)', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255, 255, 255, 0.18) rgba(255, 255, 255, 0.04)' }}
              >
                <div className="p-6 pt-5">
                  {/* ========== SIMPLIFIED VIEW ========== */}
                  
                  {/* 1. CENTERPIECE HEADLINE */}
                  <section className="fps-section">
                    <p
                      className="text-xl font-semibold leading-relaxed"
                      style={{ color: 'rgba(255, 255, 255, 0.95)', lineHeight: '1.5', letterSpacing: '-0.01em' }}
                    >
                      {content.centerpiece}
                    </p>
                  </section>

                  <div className="fps-divider" />

                  {/* 2. ESSENTIALS LAYER (CEP → Essentials) */}
                  <section className="fps-section">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Target className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: HORIZON.color.accent }} />
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            What Happened
                          </span>
                          <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.55' }}>
                            {content.essentials.whatHappened}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: HORIZON.color.accent }} />
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            Why It Matters
                          </span>
                          <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.55' }}>
                            {content.essentials.whyItMatters}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Activity className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: HORIZON.color.accent }} />
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            Market Impact
                          </span>
                          <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.55' }}>
                            {content.essentials.marketImpact}
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <div className="fps-divider" />

                  {/* 3. AFFECTED ASSETS */}
                  <section className="fps-section">
                    <span className="text-xs font-semibold uppercase tracking-wide block mb-3" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      Affected Assets
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {content.affectedAssets.map((asset, i) => (
                        <AssetPill key={i} text={asset.text} tone={asset.tone} />
                      ))}
                    </div>
                  </section>

                  <div className="fps-divider" />

                  {/* 4. DOWNSIDE RISK / UPSIDE POTENTIAL */}
                  <section className="fps-section">
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className="p-4 rounded-xl"
                        style={{
                          background: 'rgba(255, 60, 60, 0.08)',
                          border: '1px solid rgba(255, 60, 60, 0.20)',
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-4 h-4" style={{ color: HORIZON.color.risk }} />
                          <span className="text-xs font-semibold uppercase" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            Downside Risk
                          </span>
                        </div>
                        <p className="text-sm mb-2" style={{ color: 'rgba(255, 255, 255, 0.82)', lineHeight: '1.5' }}>
                          {content.downside.text}
                        </p>
                        <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          Confidence: <span style={{ color: HORIZON.color.risk, fontWeight: 600 }}>{content.downside.confidence}%</span>
                        </span>
                      </div>

                      <div
                        className="p-4 rounded-xl"
                        style={{
                          background: 'rgba(46, 207, 141, 0.08)',
                          border: '1px solid rgba(46, 207, 141, 0.20)',
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <ShieldCheck className="w-4 h-4" style={{ color: HORIZON.color.opportunity }} />
                          <span className="text-xs font-semibold uppercase" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            Upside Potential
                          </span>
                        </div>
                        <p className="text-sm mb-2" style={{ color: 'rgba(255, 255, 255, 0.82)', lineHeight: '1.5' }}>
                          {content.upside.text}
                        </p>
                        <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          Confidence: <span style={{ color: HORIZON.color.opportunity, fontWeight: 600 }}>{content.upside.confidence}%</span>
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* VIEW MODE TOGGLE */}
                  <div className="flex justify-center mb-4">
                    <button
                      onClick={() => setViewMode(prev => prev === 'detailed' ? 'simplified' : 'detailed')}
                      className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
                      style={{
                        background: viewMode === 'detailed' ? 'rgba(94, 167, 255, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                        border: viewMode === 'detailed' ? '1px solid rgba(94, 167, 255, 0.30)' : '1px solid rgba(255, 255, 255, 0.08)',
                        color: viewMode === 'detailed' ? '#5EA7FF' : 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      {viewMode === 'detailed' ? '← Show Less' : 'Show More Details →'}
                    </button>
                  </div>

                  {/* ========== DETAILED VIEW (EXPANDED) ========== */}
                  <div className="fps-details">
                    <div className="fps-divider" />

                    {/* 1. SUMMARY (expanded) */}
                    <section className="mb-6">
                      <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        <Sparkles className="w-4 h-4" style={{ color: HORIZON.color.accent }} />
                        Summary
                      </h3>
                      <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.6' }}>
                        {content.summary}
                      </p>
                    </section>

                    <div className="fps-divider" />

                    {/* 2. WHY IT MATTERS (expanded) */}
                    <section className="mb-6">
                      <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        <Sparkles className="w-4 h-4" style={{ color: HORIZON.color.accent }} />
                        Why It Matters
                      </h3>
                      <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.6' }}>
                        {content.whyItMattersExpanded}
                      </p>
                    </section>

                    <div className="fps-divider" />

                    {/* 3. IN SIMPLE TERMS */}
                    <section className="mb-6">
                      <div
                        className="p-5 rounded-xl"
                        style={{
                          background: 'rgba(255, 255, 255, 0.025)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                        }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-3.5 h-3.5" style={{ color: 'rgba(255, 255, 255, 0.55)' }} />
                          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'rgba(255, 255, 255, 0.55)' }}>
                            In Simple Terms
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.82)', lineHeight: '1.55' }}>
                          {content.inSimpleTerms}
                        </p>
                      </div>
                    </section>

                    <div className="fps-divider" />

                    {/* 4. WHAT HAPPENED — FULL VERSION */}
                    <section className="mb-6">
                      <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        <Target className="w-4 h-4" style={{ color: HORIZON.color.accent }} />
                        What Happened — Full Details
                      </h3>
                      <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.6' }}>
                        {content.whatHappenedFull}
                      </p>
                    </section>

                    <div className="fps-divider" />

                    {/* 5. IMPACT SNAPSHOT (3-column) */}
                    <section className="mb-6">
                      <h3 className="text-xs font-semibold uppercase tracking-wide mb-4 flex items-center gap-2" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        <Activity className="w-4 h-4" style={{ color: HORIZON.color.accent }} />
                        Impact Snapshot
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <span className="text-xs font-semibold block mb-1" style={{ color: 'rgba(255, 255, 255, 0.45)' }}>
                            What Changes
                          </span>
                          <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.75)', lineHeight: '1.5' }}>
                            {content.impactSnapshot.whatChanges}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs font-semibold block mb-1" style={{ color: 'rgba(255, 255, 255, 0.45)' }}>
                            Who's Affected
                          </span>
                          <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.75)', lineHeight: '1.5' }}>
                            {content.impactSnapshot.whosAffected}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs font-semibold block mb-1" style={{ color: 'rgba(255, 255, 255, 0.45)' }}>
                            Market Impact
                          </span>
                          <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.75)', lineHeight: '1.5' }}>
                            {content.impactSnapshot.marketImpact}
                          </p>
                        </div>
                      </div>
                    </section>

                    <div className="fps-divider" />

                    {/* 6. RIPPLE EFFECTS */}
                    <section className="mb-6">
                      <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        <Activity className="w-4 h-4" style={{ color: HORIZON.color.accent }} />
                        Ripple Effects
                      </h3>
                      <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.6' }}>
                        {content.rippleEffects}
                      </p>
                    </section>

                    <div className="fps-divider" />

                    {/* 7. HOW INVESTORS MAY RESPOND */}
                    <section className="mb-6">
                      <div
                        className="p-5 rounded-xl"
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                        }}
                      >
                        <h3 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'rgba(255, 255, 255, 0.55)' }}>
                          How Investors May Respond
                        </h3>
                        <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.82)', lineHeight: '1.55' }}>
                          {content.howInvestorsMayRespond}
                        </p>
                      </div>
                    </section>
                  </div>

                  {/* 8. RELATED SIGNALS (always last) */}
                  <section className="fps-section">
                    <div
                      className="flex items-center gap-3 p-4 rounded-xl"
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <span className="text-sm font-semibold" style={{ color: 'rgba(255, 255, 255, 0.88)' }}>
                        Related Signals
                      </span>
                      <div className="flex gap-2 flex-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                        {content.relatedSignals.map((s) => (
                          <CorrelatedChip key={s.id} signal={s} onNavigate={(id) => console.log('Navigate to:', id)} />
                        ))}
                      </div>
                      <ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}
    </AnimatePresence>
  );
}