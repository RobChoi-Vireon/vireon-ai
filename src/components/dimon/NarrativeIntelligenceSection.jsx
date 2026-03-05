import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Diamond, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const TOKENS = {
  font: {
    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif'
  },
  color: {
    text_primary: '#D5DCE5',
    text_secondary: '#9AA6B2',
    text_tertiary: '#7E8798',
    bg_glass: 'rgba(20,25,35,0.30)',
    border: 'rgba(255,255,255,0.06)',
  }
};

const getBadgeColor = (badge) => {
  if (!badge) return { bg: 'rgba(255,255,255,0.06)', text: '#9AA6B2' };
  const lower = badge.toLowerCase();
  if (lower.includes('strongly bullish')) return { bg: 'rgba(88,227,164,0.15)', text: '#58E3A4' };
  if (lower.includes('mildly bullish') || lower.includes('bullish')) return { bg: 'rgba(132,242,195,0.15)', text: '#84F2C3' };
  if (lower.includes('neutral')) return { bg: 'rgba(160,174,192,0.15)', text: '#A0AEC0' };
  if (lower.includes('mildly cautious') || lower.includes('cautious')) return { bg: 'rgba(255,193,7,0.15)', text: '#FFC107' };
  if (lower.includes('strongly cautious')) return { bg: 'rgba(255,152,0,0.15)', text: '#FF9800' };
  return { bg: 'rgba(255,255,255,0.06)', text: '#9AA6B2' };
};

const getDirectionColor = (direction) => {
  if (!direction) return '#A0AEC0';
  const lower = direction.toLowerCase();
  if (lower.includes('positive')) return '#58E3A4';
  if (lower.includes('negative')) return '#FF6A7A';
  return '#A0AEC0';
};

const getIcon = (iconType) => {
  switch (iconType) {
    case 'diamond':
      return <Diamond className="w-4 h-4" />;
    case 'arrow-up-right':
      return <TrendingUp className="w-4 h-4" />;
    case 'arrow-down-right':
      return <TrendingDown className="w-4 h-4" />;
    case 'minus':
      return <Minus className="w-4 h-4" />;
    default:
      return null;
  }
};

const NarrativePulseCard = ({ data, timestamp }) => {
  if (!data) return null;

  const badgeStyle = getBadgeColor(data.badge);
  const primary = data.sentiment?.primary;
  const secondary = data.sentiment?.secondary;
  const primaryPct = primary?.percentage || 0;
  const secondaryPct = secondary?.percentage || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-[20px] p-6 overflow-hidden relative"
      style={{
        background: 'rgba(30,40,60,0.18)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 0 40px rgba(0,0,0,0.30)'
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontFamily: TOKENS.font.family, fontSize: '20px', fontWeight: 600, color: TOKENS.color.text_primary, margin: 0, maxWidth: '80%', lineHeight: 1.3 }}>
            {data.headline}
          </h3>
          {data.badge && (
            <div style={{
              fontFamily: TOKENS.font.family,
              padding: '6px 12px',
              borderRadius: '8px',
              background: badgeStyle.bg,
              color: badgeStyle.text,
              fontSize: '11px',
              fontWeight: 600,
              whiteSpace: 'nowrap'
            }}>
              {data.badge}
            </div>
          )}
        </div>
        {data.summary && (
          <p style={{ fontFamily: TOKENS.font.family, fontSize: '14px', fontWeight: 400, color: TOKENS.color.text_secondary, margin: 0, lineHeight: 1.45 }}>
            {data.summary}
          </p>
        )}
      </div>

      {(primary || secondary) && (
        <div style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', height: '6px', borderRadius: '999px', overflow: 'hidden', background: 'rgba(255,255,255,0.08)' }}>
            {primary && (
              <div style={{ width: `${primaryPct}%`, background: '#6AC7F7', transition: 'all 0.6s ease' }} />
            )}
            {secondary && (
              <div style={{ width: `${secondaryPct}%`, background: '#C9B46B', transition: 'all 0.6s ease' }} />
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', fontFamily: TOKENS.font.family, fontWeight: 500 }}>
            {primary && (
              <span style={{ color: '#6AC7F7' }}>
                {primary.label} {primaryPct}%
              </span>
            )}
            {secondary && (
              <span style={{ color: '#C9B46B' }}>
                {secondary.label} {secondaryPct}%
              </span>
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px', paddingBottom: '16px', borderBottom: `1px solid ${TOKENS.color.border}` }}>
        {data.outlets_count !== undefined && (
          <div>
            <div style={{ fontSize: '10px', fontFamily: TOKENS.font.family, fontWeight: 600, color: TOKENS.color.text_tertiary, textTransform: 'uppercase' }}>Sources</div>
            <div style={{ fontSize: '14px', fontFamily: TOKENS.font.family, fontWeight: 600, color: TOKENS.color.text_primary }}>
              {data.outlets_count}
            </div>
          </div>
        )}
        {data.time_window && (
          <div>
            <div style={{ fontSize: '10px', fontFamily: TOKENS.font.family, fontWeight: 600, color: TOKENS.color.text_tertiary, textTransform: 'uppercase' }}>Window</div>
            <div style={{ fontSize: '14px', fontFamily: TOKENS.font.family, fontWeight: 600, color: TOKENS.color.text_primary }}>
              {data.time_window}
            </div>
          </div>
        )}
        {data.confidence_label && (
          <div>
            <div style={{ fontSize: '10px', fontFamily: TOKENS.font.family, fontWeight: 600, color: TOKENS.color.text_tertiary, textTransform: 'uppercase' }}>Confidence</div>
            <div style={{ fontSize: '14px', fontFamily: TOKENS.font.family, fontWeight: 600, color: TOKENS.color.text_primary }}>
              {data.confidence_label}
            </div>
          </div>
        )}
      </div>

      {timestamp && (
        <p style={{ fontFamily: TOKENS.font.family, fontSize: '11px', color: TOKENS.color.text_tertiary, margin: 0 }}>
          Updated {timestamp}
        </p>
      )}
    </motion.div>
  );
};

const NarrativeDriversSection = ({ drivers = [] }) => {
  if (!drivers || drivers.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {drivers.slice(0, 4).map((driver, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${TOKENS.color.border}`
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.08)',
              fontFamily: TOKENS.font.family,
              fontSize: '14px',
              fontWeight: 600,
              color: TOKENS.color.text_primary,
              flexShrink: 0
            }}>
              {idx + 1}
            </div>
            <p style={{ fontFamily: TOKENS.font.family, fontSize: '14px', fontWeight: 500, color: TOKENS.color.text_primary, margin: 0 }}>
              {driver.label}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const ImpactIntelligenceCards = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {items.slice(0, 3).map((item, idx) => {
          const iconColor = getDirectionColor(item.direction);
          return (
            <div
              key={idx}
              style={{
                padding: '20px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${TOKENS.color.border}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                {item.icon && (
                  <div style={{ color: iconColor, flexShrink: 0, marginTop: '2px' }}>
                    {getIcon(item.icon)}
                  </div>
                )}
                <h4 style={{ fontFamily: TOKENS.font.family, fontSize: '16px', fontWeight: 600, color: TOKENS.color.text_primary, margin: 0, lineHeight: 1.3 }}>
                  {item.signal}
                </h4>
              </div>
              {item.description && (
                <p style={{ fontFamily: TOKENS.font.family, fontSize: '13px', fontWeight: 400, color: TOKENS.color.text_secondary, margin: 0, lineHeight: 1.45 }}>
                  {item.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

const IntelligenceSourcesTable = ({ sources = [] }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {sources.slice(0, 7).map((source, idx) => {
          const sentimentColor = source.sentiment === 'Positive' ? '#58E3A4' : source.sentiment === 'Negative' ? '#FF6A7A' : '#A0AEC0';
          return (
            <div
              key={idx}
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${TOKENS.color.border}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <h5 style={{ fontFamily: TOKENS.font.family, fontSize: '14px', fontWeight: 600, color: TOKENS.color.text_primary, margin: 0 }}>
                    {source.name}
                  </h5>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: sentimentColor }} />
                  {source.sentiment && (
                    <span style={{ fontFamily: TOKENS.font.family, fontSize: '11px', fontWeight: 500, color: sentimentColor, textTransform: 'capitalize' }}>
                      {source.sentiment}
                    </span>
                  )}
                </div>
              </div>
              {source.category && (
                <div style={{ marginBottom: '8px' }}>
                  <span style={{
                    fontFamily: TOKENS.font.family,
                    fontSize: '10px',
                    fontWeight: 500,
                    color: TOKENS.color.text_tertiary,
                    background: 'rgba(255,255,255,0.06)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    display: 'inline-block'
                  }}>
                    {source.category}
                  </span>
                </div>
              )}
              {source.primary_topic && (
                <p style={{ fontFamily: TOKENS.font.family, fontSize: '13px', fontWeight: 500, color: TOKENS.color.text_primary, margin: '6px 0', lineHeight: 1.4 }}>
                  {source.primary_topic}
                </p>
              )}
              {source.coverage_context && (
                <p style={{ fontFamily: TOKENS.font.family, fontSize: '12px', fontWeight: 400, color: TOKENS.color.text_secondary, margin: '6px 0 0 0' }}>
                  {source.coverage_context}
                </p>
              )}
              {source.latest_headline && (
                <div style={{
                  marginTop: '10px',
                  paddingTop: '10px',
                  borderTop: `1px solid ${TOKENS.color.border}`,
                  fontFamily: TOKENS.font.family,
                  fontSize: '12px',
                  fontWeight: 400,
                  color: TOKENS.color.text_secondary,
                  fontStyle: 'italic'
                }}>
                  "{source.latest_headline}"
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default function NarrativeIntelligenceSection({ narrative_intelligence, timestamp_display }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!narrative_intelligence) return null;

  const tabs = [
    { label: 'Narrative Pulse', content: <NarrativePulseCard data={narrative_intelligence.narrative_pulse} timestamp={timestamp_display} /> },
    { label: 'Drivers', content: <NarrativeDriversSection drivers={narrative_intelligence.narrative_drivers} /> },
    { label: 'Impact Intelligence', content: <ImpactIntelligenceCards items={narrative_intelligence.impact_intelligence} /> },
    { label: 'Sources', content: <IntelligenceSourcesTable sources={narrative_intelligence.intelligence_sources} /> }
  ];

  return (
    <div style={{ marginTop: '32px' }}>
      <div style={{ marginBottom: '20px', paddingLeft: '8px' }}>
        <h2 style={{ fontFamily: TOKENS.font.family, fontSize: '22px', fontWeight: 600, color: 'rgba(226,232,240,0.95)', margin: 0, marginBottom: '6px', lineHeight: 1.15 }}>
          Narrative Intelligence
        </h2>
        <p style={{ fontFamily: TOKENS.font.family, fontSize: '13px', fontWeight: 400, color: 'rgba(213,220,229,0.65)', margin: 0, lineHeight: 1.35 }}>
          Curated synthesis from trusted financial outlets.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: `1px solid ${TOKENS.color.border}`, paddingBottom: '12px' }}>
        {tabs.map((tab, idx) => (
          <motion.button
            key={idx}
            onClick={() => setActiveTab(idx)}
            style={{
              padding: '10px 16px',
              fontFamily: TOKENS.font.family,
              fontSize: '14px',
              fontWeight: 500,
              border: 'none',
              background: activeTab === idx ? 'rgba(255,255,255,0.10)' : 'transparent',
              color: activeTab === idx ? TOKENS.color.text_primary : TOKENS.color.text_secondary,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            whileHover={{ background: 'rgba(255,255,255,0.06)' }}
            whileTap={{ scale: 0.98 }}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {tabs[activeTab].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}