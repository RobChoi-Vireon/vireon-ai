/**
 * 🔒 DESIGN-LOCKED COMPONENTS REFERENCE
 * 
 * Last Updated: 2025-01-20
 * Design System: OS Horizon V4.0
 * Theme: OLED Dark (only theme)
 * 
 * ============================================================================
 * MODIFICATION POLICY
 * ============================================================================
 * 
 * ❌ DO NOT MODIFY these components without explicit assignment
 * ✅ ALLOWED: Data integration, backend wiring, performance optimization
 * ⚠️  IF CHANGES NEEDED: Document reason, test all breakpoints, update this file
 * 
 * ============================================================================
 * LOCKED SECTIONS
 * ============================================================================
 * 
 * 1. MACRO SIGNALS SECTION
 *    - components/dimon/GlobalHolographicMap.jsx (Equilibrium)
 *    - components/dimon/EquilibriumPulse.jsx
 * 
 * 2. GLOBAL SIGNALS OVERVIEW
 *    - components/dimon/ConsensusMeter.jsx (Consensus donut)
 *    - components/dimon/DivergenceReport.jsx (Divergence cards)
 *    - components/dimon/SentimentDrawer.jsx (Street Alignment modal)
 *    - components/dimon/SegmentDetailDrawer.jsx (Policy/Credit/Equities/Global)
 * 
 * 3. US FRONT PAGE SIGNALS
 *    - components/dimon/PrioritySignalStrip.jsx (Signal cards)
 *    - components/dimon/SignalDetailDrawer.jsx (Signal detail modal)
 * 
 * 4. US BUSINESS & MARKETS
 *    - components/dimon/ExecutiveTakeaway.jsx (Takeaway cards)
 *    - components/dimon/MemoDrawer.jsx (Detailed analysis modal)
 * 
 * ============================================================================
 * DESIGN STANDARDS — OS HORIZON V4.0
 * ============================================================================
 * 
 * TYPOGRAPHY:
 * - Section Headers:     18-24px, Bold (700), 95% opacity, 1.25 line-height
 * - Subsection Headers:  16px, Semi-bold (600), 92% opacity, 1.4 line-height
 * - Body Text:           14-15px, Regular (400), 85-90% opacity, 1.5-1.6 line-height
 * - Explanations:        13-14px, Regular (400), 75-82% opacity, 1.55 line-height
 * - Captions:            10-12px, Medium (500-600), 70% opacity, 1.4 line-height
 * - Chips/Tags:          10px, Semi-bold (600), 85-90% opacity, 1.2 line-height
 * 
 * MOTION:
 * - horizonIn:  [0.22, 0.61, 0.36, 1]  // 120ms ease-in
 * - horizonOut: [0.4, 0.0, 0.2, 1]     // 180ms ease-out
 * - Fast:       120ms
 * - Base:       180ms
 * - Slow:       240ms
 * 
 * COLORS (SEGMENTS):
 * - Policy:    #5EA7FF (Blue)
 * - Credit:    #C084FC (Purple)
 * - Equities:  #2ECF8D (Green)
 * - Global:    #FFB020 (Amber)
 * 
 * GLASS MATERIAL:
 * - Background: rgba(24, 28, 33, 0.45)
 * - Blur:       22px
 * - Border:     rgba(255,255,255,0.12)
 * - Shadow:     0 0 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)
 * 
 * SPACING:
 * - Section gaps:        24-32px
 * - Card gaps:           12-16px
 * - Internal padding:    16-20px
 * - Chip letter-spacing: 0.05em
 * 
 * ============================================================================
 * COMPONENT-SPECIFIC STANDARDS
 * ============================================================================
 * 
 * CONSENSUS METER:
 * - Gauge radius: 58px
 * - Glow filter: 15% enhanced (stdDeviation 3.5)
 * - Label: "Overall Street Alignment" above score
 * - Zone labels: Bearish (<40), Mildly Bullish (40-70), Bullish (>70)
 * - Footer: "Based on X sources • Updated Xm ago" (12px, 70% opacity)
 * 
 * DIVERGENCE CARDS:
 * - Vertical spacing: 12px (space-y-3)
 * - Padding: 16px (px-4 py-3.5)
 * - Corner radius: 16px (rounded-2xl)
 * - Risk chip: 10px uppercase, HIGH/MODERATE/LOW color-coded
 * - Metadata hover: confidence % + source count
 * 
 * SEGMENT TILES (MODAL):
 * - Structure: 3 rows (Icon+Title+Weight / Description / Chips+Bar)
 * - Padding: 16px
 * - Gap: 12px between tiles
 * - Chips: Stress (High/Moderate/Stable) + Trend (Worsening/Rising/Stable)
 * - Bar height: 1.5px
 * 
 * POLICY DRAWER (SEGMENT DETAIL):
 * - TL;DR format (no quotes)
 * - Glowing bar dividers above sections
 * - Bolded noun phrases in drivers
 * - Grouped asset impact modules with micro underlines
 * - Two-line outlook format
 * 
 * ============================================================================
 * 
 * This reference file exists to document locked components.
 * It is never imported — purely for documentation.
 * 
 */

export default null;