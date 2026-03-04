import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Globe, Zap, CheckCircle, GitCommit, Info } from 'lucide-react';

const EASE = [0.26, 0.11, 0.26, 1.0];

// ─── Design tokens ────────────────────────────────────────────────────────────

const OUTER = {
  background: 'linear-gradient(180deg, rgba(16,20,32,0.64) 0%, rgba(10,13,22,0.74) 100%)',
  backdropFilter: 'blur(52px) saturate(172%)',
  WebkitBackdropFilter: 'blur(52px) saturate(172%)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.07), 0 12px 48px rgba(0,0,0,0.30)',
  borderRadius: '26px',
  overflow: 'hidden',
};

const CARD = {
  background: 'linear-gradient(180deg, rgba(255,255,255,0.056) 0%, rgba(255,255,255,0.028) 100%)',
  backdropFilter: 'blur(44px) saturate(168%)',
  WebkitBackdropFilter: 'blur(44px) saturate(168%)',
  border: '1px solid rgba(255,255,255,0.09)',
  boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.09), 0 8px 32px rgba(0,0,0,0.18)',
  borderRadius: '20px',
  overflow: 'hidden',
  position: 'relative',
};

// ─── Primitives ───────────────────────────────────────────────────────────────

const Specular = () => (
  <div style={{
    position: 'absolute', top: 0, left: '10%', right: '10%', height: '1.5px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.13), transparent)',
    pointerEvents: 'none', zIndex: 1,
  }} />
);

const SectionLabel = ({ title, sub, icon: Icon, color }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="p-2 rounded-[10px] flex-shrink-0" style={{ background: `${color}14`, border: `1px solid ${color}28` }}>
      <Icon className="w-3.5 h-3.5" style={{ color, strokeWidth: 2 }} />
    </div>
    <div>
      <p className="text-[13px] font-bold" style={{ color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.01em' }}>{title}</p>
      <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.36)' }}>{sub}</p>
    </div>
  </div>
);

const StrengthBar = ({ pct, color, delay = 0 }) => (
  <div style={{ height: '6px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.20)', width: '100%' }}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${pct}%` }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      style={{ height: '100%', borderRadius: '4px', background: `linear-gradient(90deg, ${color}, ${color.replace(/[\d.]+\)$/, '0.52)')})`, boxShadow: `0 0 10px ${color.replace(/[\d.]+\)$/, '0.38)')}`, position: 'relative' }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'rgba(255,255,255,0.16)', borderRadius: '4px 4px 0 0' }} />
    </motion.div>
  </div>
);

const MiniSparkline = ({ data = [60, 58, 62, 61, 65, 67, 66], color, delay = 0 }) => {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 44},${12 - ((v - min) / range) * 12}`).join(' ');
  const [lx, ly] = pts.split(' ').pop().split(',').map(Number);
  return (
    <svg width="44" height="14" style={{ overflow: 'visible', flexShrink: 0 }}>
      <motion.polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.82 }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      />
      <motion.circle cx={lx} cy={ly} r="2" fill={color} initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.9 }} style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
    </svg>
  );
};

const MomentumTag = ({ pts }) => {
  const n = typeof pts === 'number' ? pts : (parseFloat(pts) || 0);
  const up = n >= 0;
  const color = up ? 'rgba(88,227,164,0.80)' : 'rgba(255,106,122,0.80)';
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span className="flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded-full" style={{ color, background: up ? 'rgba(88,227,164,0.08)' : 'rgba(255,106,122,0.08)' }}>
      <Icon className="w-3 h-3" strokeWidth={2.5} />
      {up ? '+' : ''}{n} pts
    </span>
  );
};

const ConfidencePill = ({ level }) => {
  const map = { High: { bg: 'rgba(88,227,164,0.12)', border: 'rgba(88,227,164,0.22)', color: 'rgba(88,227,164,0.88)' }, Medium: { bg: 'rgba(255,200,80,0.10)', border: 'rgba(255,200,80,0.20)', color: 'rgba(255,200,80,0.85)' }, Low: { bg: 'rgba(255,106,122,0.10)', border: 'rgba(255,106,122,0.20)', color: 'rgba(255,106,122,0.85)' } };
  const s = map[level] || map.Medium;
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>{level}</span>;
};

const HoverLift = ({ children, glow = 'rgba(255,255,255,0.08)', style = {} }) => {
  const [hov, setHov] = React.useState(false);
  return (
    <motion.div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      animate={{ y: hov ? -3 : 0, boxShadow: hov ? `inset 0 1.5px 0 rgba(255,255,255,0.12), 0 16px 44px rgba(0,0,0,0.26), 0 0 28px ${glow}` : CARD.boxShadow }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      style={{ ...CARD, ...style }}
    >
      <Specular />
      {children}
    </motion.div>
  );
};

// ─── Jump nav ─────────────────────────────────────────────────────────────────

const JumpNav = ({ refs }) => {
  const scroll = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const links = [
    { label: 'Consensus', ref: refs.consensus },
    { label: 'Divergences', ref: refs.divergences },
    { label: 'US vs Global', ref: refs.usGlobal },
    { label: 'Changing', ref: refs.changing },
  ];
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {links.map((l, i) => (
        <React.Fragment key={l.label}>
          <button onClick={() => scroll(l.ref)} className="text-[12px] font-medium transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.42)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            {l.label}
          </button>
          {i < links.length - 1 && <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: '10px' }}>•</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

// ─── Section A — Consensus ────────────────────────────────────────────────────

const ConsensusSection = ({ items }) => {
  if (!items?.length) return <EmptyCard label="consensus" />;
  return (
    <div className="space-y-3">
      {items.slice(0, 5).map((item, i) => {
        const pct = Math.round((item.confidence || 0) * 100);
        const momentum = item.momentum_pts ?? item.momentum ?? 0;
        const drivers = item.drivers || [];
        const breakConds = item.break_conditions || item.break_triggers || [];
        const sources = item.sources_count ?? item.sources ?? 0;
        const level = item.confidence_level || (pct >= 70 ? 'High' : pct >= 45 ? 'Medium' : 'Low');
        const spark = item.sparkline || [pct - 8, pct - 5, pct - 6, pct - 3, pct - 2, pct, pct];

        return (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i, duration: 0.38, ease: EASE }}>
            <HoverLift glow="rgba(88,227,164,0.12)" style={{ padding: '22px' }}>
              <div className="relative z-10">
                {/* Signal-first header */}
                <div className="flex items-start gap-5 mb-4">
                  <div className="flex-shrink-0 text-center">
                    <div className="text-[42px] font-black leading-none" style={{ color: 'rgba(88,227,164,0.94)', letterSpacing: '-0.04em' }}>{pct}%</div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.07em' }}>Strength</div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-2">
                      <ConfidencePill level={level} />
                      {sources > 0 && <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.38)', border: '1px solid rgba(255,255,255,0.07)' }}>{sources} sources</span>}
                    </div>
                    <p className="text-[14px] font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.90)', letterSpacing: '-0.015em' }}>{item.claim}</p>
                  </div>
                </div>

                <StrengthBar pct={pct} color="rgba(88,227,164,0.75)" delay={0.1 + 0.06 * i} />

                {(drivers.length > 0 || breakConds.length > 0) && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {drivers.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.30)', letterSpacing: '0.07em' }}>Drivers</p>
                        <ul className="space-y-1.5">
                          {drivers.slice(0, 3).map((d, j) => (
                            <li key={j} className="flex items-start gap-2 text-[12px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                              <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(88,227,164,0.60)' }} />{d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {breakConds.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,106,122,0.48)', letterSpacing: '0.07em' }}>What breaks this</p>
                        <ul className="space-y-1.5">
                          {breakConds.slice(0, 2).map((b, j) => (
                            <li key={j} className="flex items-start gap-2 text-[12px]" style={{ color: 'rgba(255,255,255,0.58)' }}>
                              <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(255,106,122,0.48)' }} />{b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-3 mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <MiniSparkline data={spark} color="rgba(88,227,164,0.78)" delay={0.5 + 0.06 * i} />
                  <MomentumTag pts={momentum} />
                  <span className="text-[10px] ml-auto" style={{ color: 'rgba(255,255,255,0.24)' }}>7d trend</span>
                </div>
              </div>
            </HoverLift>
          </motion.div>
        );
      })}
    </div>
  );
};

// ─── Section B — Divergences ──────────────────────────────────────────────────

const DivergencesSection = ({ items }) => {
  if (!items?.length) return <EmptyCard label="divergence" />;
  return (
    <div className="space-y-3">
      {items.slice(0, 4).map((item, i) => {
        const domPct = Math.round((item.confidence || 0.62) * 100);
        const ctrPct = 100 - domPct;
        const domMom = item.dominant_momentum ?? item.momentum_pts ?? 0;
        const ctrMom = item.counter_momentum ?? -domMom;
        const interpretation = item.interpretation || item.summary || '';
        const resolution = item.resolution_triggers || item.break_conditions || [];
        const domSpark = item.dominant_sparkline || [domPct - 6, domPct - 4, domPct - 5, domPct - 2, domPct - 1, domPct, domPct];
        const ctrSpark = item.counter_sparkline || [ctrPct + 6, ctrPct + 4, ctrPct + 5, ctrPct + 2, ctrPct + 1, ctrPct, ctrPct];
        const counter = item.counter_narrative || item.counter || 'Counter narrative';

        return (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i, duration: 0.38, ease: EASE }}>
            <HoverLift glow="rgba(180,120,255,0.12)" style={{ background: 'linear-gradient(180deg, rgba(147,51,234,0.07) 0%, rgba(120,40,200,0.09) 100%)', border: '1px solid rgba(180,120,255,0.14)', padding: '22px' }}>
              <div className="relative z-10">
                <div className="grid grid-cols-2 gap-0 relative">
                  {/* Glow divider */}
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px', background: 'linear-gradient(180deg, transparent, rgba(180,120,255,0.28), rgba(180,120,255,0.18), transparent)', transform: 'translateX(-50%)', pointerEvents: 'none' }} />

                  {/* Dominant */}
                  <div className="pr-6 space-y-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(180,120,255,0.72)', letterSpacing: '0.06em' }}>Dominant</p>
                    <div className="text-[36px] font-black leading-none" style={{ color: 'rgba(180,120,255,0.94)', letterSpacing: '-0.04em' }}>{domPct}%</div>
                    <p className="text-[13px] font-bold leading-snug" style={{ color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em' }}>{item.topic}</p>
                    <StrengthBar pct={domPct} color="rgba(180,120,255,0.75)" delay={0.1 + 0.06 * i} />
                    <div className="flex items-center gap-2"><MiniSparkline data={domSpark} color="rgba(180,120,255,0.78)" delay={0.45 + 0.06 * i} /><MomentumTag pts={domMom} /></div>
                  </div>

                  {/* Counter */}
                  <div className="pl-6 space-y-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(200,160,255,0.55)', letterSpacing: '0.06em' }}>Counter</p>
                    <div className="text-[36px] font-black leading-none" style={{ color: 'rgba(200,160,255,0.76)', letterSpacing: '-0.04em' }}>{ctrPct}%</div>
                    <p className="text-[13px] font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.76)', letterSpacing: '-0.01em' }}>{counter}</p>
                    <StrengthBar pct={ctrPct} color="rgba(200,160,255,0.55)" delay={0.1 + 0.06 * i} />
                    <div className="flex items-center gap-2"><MiniSparkline data={ctrSpark} color="rgba(200,160,255,0.65)" delay={0.45 + 0.06 * i} /><MomentumTag pts={ctrMom} /></div>
                  </div>
                </div>

                {interpretation && (
                  <div className="mt-4 p-3.5 rounded-[14px]" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.28)', letterSpacing: '0.07em' }}>Interpretation</p>
                    <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.68)' }}>"{interpretation}"</p>
                  </div>
                )}

                {resolution.length > 0 && (
                  <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.26)', letterSpacing: '0.07em' }}>What would resolve this</p>
                    <ul className="space-y-1.5">
                      {resolution.slice(0, 2).map((r, j) => (
                        <li key={j} className="flex items-start gap-2 text-[12px]" style={{ color: 'rgba(255,255,255,0.58)' }}>
                          <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(200,160,255,0.48)' }} />{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </HoverLift>
          </motion.div>
        );
      })}
    </div>
  );
};

// ─── Section C — US vs Global ─────────────────────────────────────────────────

const USGlobalSection = ({ items }) => {
  if (!items?.length) return <EmptyCard label="US vs Global" />;
  return (
    <div className="space-y-3">
      {items.slice(0, 4).map((item, i) => {
        const usPct = Math.round((item.confidence || 0.71) * 100);
        const glbPct = 100 - usPct;
        const usMom = item.us_momentum ?? item.momentum_pts ?? 0;
        const glbMom = item.global_momentum ?? -usMom;
        const usFlip = item.us_flip_trigger || item.flip_trigger || null;
        const glbFlip = item.global_flip_trigger || null;
        const usView = item.us_view_rationale || item.us_view_detail || null;
        const glbView = item.global_view_rationale || item.global_view_detail || null;
        const usSpark = item.us_sparkline || [usPct - 4, usPct - 2, usPct - 3, usPct, usPct - 1, usPct + 1, usPct];
        const glbSpark = item.global_sparkline || [glbPct + 4, glbPct + 2, glbPct + 3, glbPct, glbPct + 1, glbPct - 1, glbPct];

        return (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i, duration: 0.38, ease: EASE }}>
            <div style={{ ...CARD, overflow: 'hidden', padding: 0 }}>
              <Specular />
              {/* Glow center divider */}
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px', background: 'linear-gradient(180deg, transparent 5%, rgba(94,167,255,0.18) 30%, rgba(94,167,255,0.12) 70%, transparent 95%)', transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 2 }} />

              <div className="grid grid-cols-2 relative z-10">
                {/* US */}
                <div className="p-5 space-y-3" style={{ background: 'rgba(94,167,255,0.03)' }}>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" style={{ color: 'rgba(94,167,255,0.82)', filter: 'drop-shadow(0 0 4px rgba(94,167,255,0.38))' }} strokeWidth={2} />
                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(94,167,255,0.76)', letterSpacing: '0.06em' }}>US Tilt</span>
                  </div>
                  <div className="text-[38px] font-black leading-none" style={{ color: 'rgba(94,167,255,0.92)', letterSpacing: '-0.04em' }}>{usPct}%</div>
                  <p className="text-[13px] font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.01em' }}>"{item.us_view}"</p>
                  <StrengthBar pct={usPct} color="rgba(94,167,255,0.72)" delay={0.1 + 0.06 * i} />
                  <div className="flex items-center gap-2"><MiniSparkline data={usSpark} color="rgba(94,167,255,0.78)" delay={0.4 + 0.06 * i} /><MomentumTag pts={usMom} /></div>
                  {usView && <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.50)', fontStyle: 'italic' }}>View: "{usView}"</p>}
                  {usFlip && (
                    <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.24)', letterSpacing: '0.06em' }}>What flips it</p>
                      <div className="flex items-start gap-2 text-[11px]" style={{ color: 'rgba(255,255,255,0.56)' }}><div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(94,167,255,0.52)' }} />{usFlip}</div>
                    </div>
                  )}
                </div>

                {/* Global */}
                <div className="p-5 space-y-3" style={{ background: 'rgba(150,190,255,0.02)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" style={{ color: 'rgba(150,190,255,0.75)' }} strokeWidth={2} />
                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(150,190,255,0.65)', letterSpacing: '0.06em' }}>Global Tilt</span>
                  </div>
                  <div className="text-[38px] font-black leading-none" style={{ color: 'rgba(150,190,255,0.76)', letterSpacing: '-0.04em' }}>{glbPct}%</div>
                  <p className="text-[13px] font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.76)', letterSpacing: '-0.01em' }}>"{item.global_view}"</p>
                  <StrengthBar pct={glbPct} color="rgba(150,190,255,0.55)" delay={0.1 + 0.06 * i} />
                  <div className="flex items-center gap-2"><MiniSparkline data={glbSpark} color="rgba(150,190,255,0.70)" delay={0.4 + 0.06 * i} /><MomentumTag pts={glbMom} /></div>
                  {glbView && <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.44)', fontStyle: 'italic' }}>View: "{glbView}"</p>}
                  {glbFlip && (
                    <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.24)', letterSpacing: '0.06em' }}>What flips it</p>
                      <div className="flex items-start gap-2 text-[11px]" style={{ color: 'rgba(255,255,255,0.52)' }}><div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(150,190,255,0.48)' }} />{glbFlip}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// ─── Section D — Changing ─────────────────────────────────────────────────────

const ChangingSection = ({ items }) => {
  if (!items?.length) return <EmptyCard label="changing narrative" />;
  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const pts = item.momentum_pts ?? item.momentum ?? 0;
        const rising = (typeof pts === 'number' ? pts : parseFloat(pts) || 0) >= 0;
        const accent = rising ? 'rgba(255,190,80,0.88)' : 'rgba(255,106,122,0.88)';
        const bg = rising ? 'rgba(255,190,80,0.07)' : 'rgba(255,106,122,0.07)';
        const border = rising ? 'rgba(255,190,80,0.16)' : 'rgba(255,106,122,0.16)';
        const whyChanged = item.why_changed || item.drivers || [];
        const watchNext = item.watch_next || item.what_to_watch || null;
        const sources = item.sources_count ?? item.sources ?? 0;
        const spark = item.sparkline || (rising ? [40, 44, 48, 52, 57, 62, 67] : [67, 62, 57, 52, 48, 44, 40]);

        return (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i, duration: 0.38, ease: EASE }}>
            <HoverLift glow={rising ? 'rgba(255,190,80,0.10)' : 'rgba(255,106,122,0.10)'} style={{ background: `linear-gradient(180deg, ${bg} 0%, rgba(255,255,255,0.018) 100%)`, border: `1px solid ${border}`, padding: '22px' }}>
              <div className="relative z-10 space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[14px] font-semibold leading-snug flex-1" style={{ color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.015em' }}>{item.claim || item.title || item.narrative}</p>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: bg, border: `1px solid ${border}`, color: accent }}>{rising ? '↑ Rising' : '↓ Falling'}</span>
                    <MomentumTag pts={pts} />
                  </div>
                </div>
                <MiniSparkline data={spark} color={accent} delay={0.3 + 0.06 * i} />
                {whyChanged.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.28)', letterSpacing: '0.07em' }}>Why it changed</p>
                    <ul className="space-y-1.5">{(Array.isArray(whyChanged) ? whyChanged : [whyChanged]).slice(0, 2).map((w, j) => (
                      <li key={j} className="flex items-start gap-2 text-[12px]" style={{ color: 'rgba(255,255,255,0.65)' }}><div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: accent }} />{w}</li>
                    ))}</ul>
                  </div>
                )}
                {watchNext && (
                  <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.24)', letterSpacing: '0.07em' }}>What to watch next</p>
                    <div className="flex items-start gap-2 text-[12px]" style={{ color: 'rgba(255,255,255,0.58)' }}><div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.30)' }} />{watchNext}</div>
                  </div>
                )}
                <div className="flex items-center gap-2 pt-1">
                  {sources > 0 && <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.36)', border: '1px solid rgba(255,255,255,0.07)' }}>{sources} sources</span>}
                </div>
              </div>
            </HoverLift>
          </motion.div>
        );
      })}
    </div>
  );
};

// ─── Empty card ───────────────────────────────────────────────────────────────

const EmptyCard = ({ label }) => (
  <div className="relative flex flex-col items-center justify-center py-14 text-center rounded-[20px]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.032) 0%, rgba(255,255,255,0.016) 100%)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
    <Specular />
    <div className="relative mb-4">
      <motion.div animate={{ opacity: [0.4, 1, 0.4], scale: [0.85, 1.12, 0.85] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="w-2 h-2 rounded-full mx-auto" style={{ background: 'rgba(255,255,255,0.28)', boxShadow: '0 0 8px rgba(255,255,255,0.18)' }} />
      <motion.div animate={{ opacity: [0.12, 0, 0.12], scale: [1, 2.4, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-0 w-2 h-2 rounded-full mx-auto" style={{ background: 'rgba(255,255,255,0.18)' }} />
    </div>
    <Info className="w-7 h-7 mb-3 mx-auto" strokeWidth={1.4} style={{ color: 'rgba(255,255,255,0.20)' }} />
    <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.28)' }}>No {label} data available yet.</p>
  </div>
);

// ─── Divider between sections ─────────────────────────────────────────────────

const SectionDivider = () => (
  <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)', margin: '4px 0' }} />
);

// ─── Main export ─────────────────────────────────────────────────────────────

export default function NarrativeMap({ synthesis, density }) {
  const refs = {
    consensus: useRef(null),
    divergences: useRef(null),
    usGlobal: useRef(null),
    changing: useRef(null),
  };

  if (!synthesis) return null;

  const { consensus = [], divergences = [], us_global_split = [] } = synthesis;

  const allItems = [
    ...consensus.map(i => ({ ...i, _src: 'consensus' })),
    ...divergences.map(i => ({ ...i, _src: 'divergences' })),
    ...us_global_split.map(i => ({ ...i, _src: 'us_global' })),
  ];
  const changingItems = allItems
    .filter(i => i.momentum_pts !== undefined || i.momentum !== undefined)
    .sort((a, b) => Math.abs(b.momentum_pts ?? b.momentum ?? 0) - Math.abs(a.momentum_pts ?? a.momentum ?? 0))
    .slice(0, 6);

  return (
    <motion.section
      aria-labelledby="narrative-map-heading"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {/* Module header */}
      <div className="flex items-start justify-between mb-6 px-1">
        <div>
          <h2 id="narrative-map-heading" className="text-[26px] font-bold" style={{ color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.028em' }}>
            Narrative Map
          </h2>
          <p className="text-[12px] mt-1.5" style={{ color: 'rgba(255,255,255,0.34)' }}>
            Connecting the macro dots.
          </p>
        </div>
        <div className="mt-2">
          <JumpNav refs={refs} />
          <p className="text-[10px] mt-2 text-right" style={{ color: 'rgba(255,255,255,0.22)', fontStyle: 'italic', maxWidth: '200px' }}>
            Narratives summarize how markets are being interpreted, not guaranteed predictions.
          </p>
        </div>
      </div>

      {/* Unified intelligence surface */}
      <div style={OUTER}>
        {/* Top light band */}
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.09), transparent)', pointerEvents: 'none', zIndex: 2 }} />

        <div className="p-5 space-y-8">

          {/* A — Consensus */}
          <div ref={refs.consensus}>
            <SectionLabel title="Market Consensus" sub="Where the Street agrees" icon={CheckCircle} color="rgba(88,227,164,0.85)" />
            <ConsensusSection items={consensus} />
          </div>

          <SectionDivider />

          {/* B — Divergences */}
          <div ref={refs.divergences}>
            <SectionLabel title="Narrative Divergences" sub="Where narratives fracture" icon={GitCommit} color="rgba(180,120,255,0.85)" />
            <DivergencesSection items={divergences} />
          </div>

          <SectionDivider />

          {/* C — US vs Global */}
          <div ref={refs.usGlobal}>
            <SectionLabel title="Narrative Geography" sub="Regional interpretation" icon={Globe} color="rgba(94,167,255,0.85)" />
            <USGlobalSection items={us_global_split} />
          </div>

          <SectionDivider />

          {/* D — Changing */}
          <div ref={refs.changing}>
            <SectionLabel title="Narrative Shifts" sub="Narratives changing this week" icon={Zap} color="rgba(255,190,80,0.85)" />
            <ChangingSection items={changingItems} />
          </div>

        </div>
      </div>
    </motion.section>
  );
}