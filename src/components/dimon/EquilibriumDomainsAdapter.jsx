/**
 * Binds raw equilibrium.domains array data to the expected domain format.
 * Maps 4 array items to: data.equilibrium.domains[0|1|2|3]
 */

const DOMAIN_IDS = ['rates', 'fx', 'growth', 'geopolitics'];

const MOCK_DOMAINS_FALLBACK = [
  {
    id: "rates",
    title: "Rates Markets",
    posture: "hawkish",
    trend: "Rising pressure",
    confidence_pct: 78,
    strength: 0.82,
    confidence_label: "Strong signal",
    summary: "The Federal Reserve is staying tough on inflation because prices keep rising. This means borrowing costs will stay high or go higher.",
    insight: "Interest rates holding steady while banks and companies adjust to the new normal.",
    downstream_effects: [
      { title: "Borrowing costs rising for companies", tags: ["Credit", "High Yield", "Investment Grade"], link: "/credit" },
      { title: "Tech stock valuations under pressure", tags: ["Tech", "Large-Cap Growth"], link: "/equities/tech" },
      { title: "Emerging markets paying more to borrow", tags: ["Emerging Markets", "Currency Funding"], link: "/em" }
    ],
    actionable: {
      horizon: "1–3 months",
      conviction: "High",
      directives: [
        "Favor short-term bonds and avoid stocks that are sensitive to interest rates.",
        "Protect against rising rates and hold dollars instead of emerging market currencies."
      ]
    },
    footer: {
      primary_cta: { label: "View detailed analysis", route: "/rates" },
      secondary_link: { label: "View timeline", route: "/timeline/rates" }
    },
    sparkline: [0.72, 0.74, 0.76, 0.75, 0.78, 0.80, 0.79, 0.81, 0.82],
    confidenceDelta: 2
  },
  {
    id: "fx",
    title: "FX Markets",
    posture: "stable",
    trend: "Steady trend",
    confidence_pct: 65,
    strength: 0.58,
    confidence_label: "Moderate signal",
    summary: "Currency markets are settling down as interest rates around the world become more similar. Money is moving less between countries as investors become more cautious.",
    insight: "Money flows between countries are stabilizing. Investors are becoming less aggressive.",
    downstream_effects: [
      { title: "Emerging market currencies steadying", tags: ["Currencies", "Emerging Markets", "Volatility"], link: "/fx/em" },
      { title: "Energy import costs staying flat", tags: ["Commodities", "Trade"], link: "/commodities" },
      { title: "Bond interest rates tightening together", tags: ["Fixed Income", "Rates"], link: "/bonds" }
    ],
    actionable: {
      horizon: "2–4 weeks",
      conviction: "Moderate",
      directives: [
        "Watch for interest rate differences between countries—they could shift currency bets.",
        "Stick with US investments until market swings pick up again."
      ]
    },
    footer: {
      primary_cta: { label: "View detailed analysis", route: "/fx" },
      secondary_link: { label: "View timeline", route: "/timeline/fx" }
    },
    sparkline: [0.60, 0.59, 0.58, 0.57, 0.58, 0.59, 0.58, 0.57, 0.58],
    confidenceDelta: -3
  },
  {
    id: "growth",
    title: "Growth Markets",
    posture: "softening",
    trend: "Mild slowdown",
    confidence_pct: 71,
    strength: 0.68,
    confidence_label: "Moderate signal",
    summary: "China's economy is slowing, which is reducing demand worldwide. The US economy is still holding up but showing signs of cooling across different industries.",
    insight: "Investors are shifting toward safer, more defensive investments as growth slows.",
    downstream_effects: [
      { title: "Raw material prices falling", tags: ["Commodities", "Energy", "Materials"], link: "/commodities" },
      { title: "Money moving to safer stocks", tags: ["Equities", "Defensive", "Utilities"], link: "/equities/defensive" },
      { title: "Service businesses holding steady", tags: ["Services", "Labor", "Domestic"], link: "/sectors/services" }
    ],
    actionable: {
      horizon: "1–2 weeks",
      conviction: "Strong",
      directives: [
        "Shift toward defensive stocks and companies that can raise prices easily.",
        "Watch commodity prices for more signs of weakening demand."
      ]
    },
    footer: {
      primary_cta: { label: "View detailed analysis", route: "/growth" },
      secondary_link: { label: "View timeline", route: "/timeline/growth" }
    },
    sparkline: [0.75, 0.74, 0.72, 0.70, 0.69, 0.68, 0.67, 0.68, 0.68],
    confidenceDelta: -1
  },
  {
    id: "geopolitics",
    title: "Geopolitics Markets",
    posture: "tightening",
    trend: "Rising tension",
    confidence_pct: 58,
    strength: 0.72,
    confidence_label: "Moderate signal",
    summary: "Countries are trading less with each other, forcing companies to rebuild supply chains. Concerns about energy security are increasing tensions in key regions.",
    insight: "Political tensions are building, creating more uncertainty in specific parts of the world.",
    downstream_effects: [
      { title: "Energy prices staying high", tags: ["Energy", "Oil", "Gas"], link: "/energy" },
      { title: "Companies moving factories back home", tags: ["Industrials", "Supply Chain", "Domestic"], link: "/industrials" },
      { title: "Countries forming closer trading groups", tags: ["Geopolitics", "Trade", "Policy"], link: "/geopolitics" }
    ],
    actionable: {
      horizon: "3–6 months",
      conviction: "Moderate",
      directives: [
        "Focus on US companies and energy investments that can handle disruptions.",
        "Spread your investments across multiple countries to reduce risk."
      ]
    },
    footer: {
      primary_cta: { label: "View detailed analysis", route: "/geopolitics" },
      secondary_link: { label: "View timeline", route: "/timeline/geopolitics" }
    },
    sparkline: [0.65, 0.66, 0.68, 0.70, 0.71, 0.72, 0.71, 0.72, 0.72],
    confidenceDelta: 4
  }
];

export function adaptEquilibriumDomains(equilibriumData) {
  if (!equilibriumData?.domains) {
    return MOCK_DOMAINS_FALLBACK;
  }

  const domainsArray = Array.isArray(equilibriumData.domains) ? equilibriumData.domains : [];
  
  if (domainsArray.length === 0) {
    return MOCK_DOMAINS_FALLBACK;
  }

  // Map 4 array items to domain format
  return domainsArray.slice(0, 4).map((d, idx) => {
    const id = d.id || DOMAIN_IDS[idx] || `domain-${idx}`;
    const mock = MOCK_DOMAINS_FALLBACK.find(m => m.id === id) || MOCK_DOMAINS_FALLBACK[idx];
    
    const strength = typeof d.strength === 'number' ? Math.min(Math.max(d.strength / 100, 0), 1) : (mock?.strength ?? 0.5);
    
    return {
      id,
      title: d.title || mock?.title || 'Domain',
      posture: d.posture || mock?.posture || 'stable',
      trend: d.trend || mock?.trend || 'Stable',
      confidence_pct: typeof d.confidence === 'number' ? d.confidence : mock?.confidence_pct ?? 50,
      strength: strength,
      confidence_label: d.confidence_label || (d.confidence >= 70 ? 'Strong signal' : d.confidence >= 40 ? 'Moderate signal' : 'Weak signal'),
      summary: d.summary || d.posture || mock?.summary || 'No summary available',
      insight: d.insight || mock?.insight || 'No insight available',
      downstream_effects: (d.signals && Array.isArray(d.signals)) 
        ? d.signals.map(sig => ({ 
            title: sig.headline || '', 
            tags: Array.isArray(sig.tags) ? sig.tags : [], 
            link: '#' 
          })) 
        : (mock?.downstream_effects || []),
      actionable: d.actions 
        ? { 
            horizon: d.action_timeframe || '', 
            conviction: d.action_urgency || 'Moderate', 
            directives: Array.isArray(d.actions) ? d.actions : [] 
          } 
        : (mock?.actionable || { horizon: '1–3 weeks', conviction: 'Moderate', directives: [] }),
      footer: { 
        primary_cta: { label: 'View detailed analysis', route: `/${id}` }, 
        secondary_link: { label: 'View timeline', route: `/timeline/${id}` }, 
        timestamp: new Date().toISOString() 
      },
      last_updated_iso: new Date().toISOString(),
      sparkline: mock?.sparkline || [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
      confidenceDelta: typeof d.confidence_delta === 'number' ? d.confidence_delta : (mock?.confidenceDelta ?? 0)
    };
  });
}