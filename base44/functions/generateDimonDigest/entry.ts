import { createClientFromRequest } from 'npm:@base44/sdk@0.5.0';

// This function now acts as a deterministic mock data generator.
// It returns a stable, schema-correct JSON object for UI validation.
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    if (!(await base44.auth.isAuthenticated())) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { targetDate } = await req.json();
    const runId = `mock-${targetDate}-0500`;

    // Mock data built to the exact spec provided.
    const mockData = {
      run_id: runId,
      prepared_at: new Date(targetDate + 'T09:00:00Z').toISOString(), // 05:00 ET
      target_date: targetDate,
      model_version: 'mock-v1.0',
      sources_hash: 'sha256:mock-digest-hash-stable-seed',
      executive_takeaway: [
        {
          type: "Policy",
          icon: "Scale",
          headline: "DC tone hardens on big tech, raising compliance costs.",
          insight: "Antitrust commentary from regulatory bodies suggests a higher probability of enforcement actions in the next 6-12 months, impacting projected legal and operational expenditures for mega-cap technology firms."
        },
        {
          type: "Markets",
          icon: "DollarSign",
          headline: "Industrial deal flow slows as EM credit stress builds.",
          insight: "A contraction in emerging market credit availability is tightening financial conditions, leading to postponed M&A activities and signaling a risk-off sentiment in the industrial sector."
        },
        {
          type: "Global",
          icon: "Globe",
          headline: "China outlook implies softer external demand into 2026.",
          insight: "Weakening PMI data and property market instability in China point towards a structural deceleration, which is expected to reduce demand for exports from key trading partners in Europe and Southeast Asia."
        }
      ],
      consensus_score: 66,
      synthesis: {
        consensus: [
          {
            claim: "Regulatory scrutiny on large-cap tech intensifying",
            evidence_urls: ["https://example.com/wapo/1", "https://example.com/nyt/1", "https://example.com/ft/1"],
            confidence: 0.74,
            macro_tags: ["Regulation", "Tech"],
            rationale: "Three sources reference hearings or rulemaking acceleration."
          }
        ],
        divergences: [
          {
            type: "coverage_gap",
            topic: "EM credit pockets under stress",
            present_in: ["ft"],
            missing_in: ["nyt", "wapo"],
            evidence_urls: ["https://example.com/ft/2"],
            confidence: 0.63,
            macro_tags: ["Credit", "EM"],
            rationale: "Only FT mentions syndication delays and spread decompression."
          }
        ],
        us_global_split: [
          {
            topic: "China growth trajectory",
            us_view: "contained slowdown",
            global_view: "structural deceleration",
            evidence_urls_us: ["https://example.com/nyt/2"],
            evidence_urls_global: ["https://example.com/ft/3"],
            confidence: 0.71
          }
        ]
      },
      sources: [
        {"source":"wapo","topline":"Tech oversight takes center stage","policy":"Committee signals broader enforcement","market_macro":"Bank capital debate resurfaces","tones":["cautionary"],"risk_flags":["regulatory"]},
        {"source":"nyt","topline":"Green industry narrative builds","policy":"Subsidy momentum remains intact","market_macro":"Household spend mixed","tones":["neutral","supportive"],"risk_flags":["policy","labor"]},
        {"source":"wsj","topline":"Industrial M&A pipeline warming","policy":"Higher-for-longer priced by CFOs","market_macro":"EM corporate debt pockets tighten","tones":["neutral","cautionary"],"risk_flags":["credit","rates"]},
        {"source":"ft","topline":"China slowdown and EM FX pressure","policy":"Issuance shifts to longer tenors","market_macro":"Dollar strength weighs on EM","tones":["cautionary"],"risk_flags":["fx","growth","rates"]}
      ],
      strategic_implications: [
        { text: "Compliance cycle tightening = ↑ costs, ↓ innovation runway.", type: 'risk' },
        { text: "EM credit stress = higher financing costs for exporters.", type: 'risk' },
        { text: "China slowdown → softer global demand into 2026.", type: 'opportunity' }
      ],
      status: 'ok',
      missing_sources: [],
      sla_adherence: true
    };
    
    const existing = await base44.entities.DimonDigestRun.filter({ run_id: runId });
    if (existing.length > 0) {
      await base44.entities.DimonDigestRun.update(existing[0].id, mockData);
    } else {
      await base44.entities.DimonDigestRun.create(mockData);
    }

    return new Response(JSON.stringify({ 
      status: 'success', 
      run_id: runId,
      digest: mockData 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error generating mock Dimon digest:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate mock digest',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});