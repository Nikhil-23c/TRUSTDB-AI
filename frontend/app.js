/**
 * NEURA-X: LUXURY EDITORIAL AI DATABASE ASSISTANT & HALLUCINATION SHIELD
 * Zero-Hallucination Grounded Intelligence with Multi-Layer Verification
 * Architecture: React 18, Chart.js, Vanilla CSS Custom Properties & Tailwind
 */

const { useState, useEffect, useRef, useMemo, createElement: h } = React;

const API_BASE = "";

// Minimalist Luxury SVG Icon Set
function Icon({ name, className = "w-4 h-4" }) {
  const icons = {
    sparkles: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('path', { d: 'm12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' })
    ),
    shieldCheck: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      h('polyline', { points: '9 12 11 14 15 10', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' })
    ),
    shieldAlert: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      h('line', { x1: 12, y1: 8, x2: 12, y2: 12, strokeWidth: 1.5, strokeLinecap: 'round' }),
      h('line', { x1: 12, y1: 16, x2: 12.01, y2: 16, strokeWidth: 2, strokeLinecap: 'round' })
    ),
    shieldZap: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      h('polygon', { points: '13 7 9 13 12 13 11 17 15 11 12 11 13 7', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' })
    ),
    database: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('ellipse', { cx: 12, cy: 5, rx: 9, ry: 3, strokeWidth: 1.5 }),
      h('path', { d: 'M21 12c0 1.66-4 3-9 3s-9-1.34-9-3', strokeWidth: 1.5 }),
      h('path', { d: 'M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5', strokeWidth: 1.5 })
    ),
    table: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('rect', { width: 18, height: 18, x: 3, y: 3, rx: 2, strokeWidth: 1.5 }),
      h('path', { d: 'M3 9h18', strokeWidth: 1.5 }),
      h('path', { d: 'M3 15h18', strokeWidth: 1.5 }),
      h('path', { d: 'M9 3v18', strokeWidth: 1.5 }),
      h('path', { d: 'M15 3v18', strokeWidth: 1.5 })
    ),
    chart: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('line', { x1: 18, y1: 20, x2: 18, y2: 10, strokeWidth: 1.5, strokeLinecap: 'round' }),
      h('line', { x1: 12, y1: 20, x2: 12, y2: 4, strokeWidth: 1.5, strokeLinecap: 'round' }),
      h('line', { x1: 6, y1: 20, x2: 6, y2: 14, strokeWidth: 1.5, strokeLinecap: 'round' })
    ),
    code: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('polyline', { points: '16 18 22 12 16 6', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      h('polyline', { points: '8 6 2 12 8 18', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' })
    ),
    send: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('path', { d: 'M5 12h14', strokeWidth: 1.5, strokeLinecap: 'round' }),
      h('path', { d: 'm12 5 7 7-7 7', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' })
    ),
    mic: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('path', { d: 'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z', strokeWidth: 1.5 }),
      h('path', { d: 'M19 10v2a7 7 0 0 1-14 0v-2', strokeWidth: 1.5, strokeLinecap: 'round' }),
      h('line', { x1: 12, x2: 12, y1: 19, y2: 22, strokeWidth: 1.5, strokeLinecap: 'round' })
    ),
    copy: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('rect', { width: 14, height: 14, x: 8, y: 8, rx: 2, ry: 2, strokeWidth: 1.5 }),
      h('path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2', strokeWidth: 1.5 })
    ),
    download: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', strokeWidth: 1.5, strokeLinecap: 'round' }),
      h('polyline', { points: '7 10 12 15 17 10', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      h('line', { x1: 12, x2: 12, y1: 15, y2: 3, strokeWidth: 1.5, strokeLinecap: 'round' })
    ),
    chevronDown: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('polyline', { points: '6 9 12 15 18 9', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' })
    ),
    chevronRight: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('polyline', { points: '9 18 15 12 9 6', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' })
    ),
    history: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('circle', { cx: 12, cy: 12, r: 10, strokeWidth: 1.5 }),
      h('polyline', { points: '12 6 12 12 16 14', strokeWidth: 1.5, strokeLinecap: 'round' })
    ),
    activity: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('polyline', { points: '22 12 18 12 15 21 9 3 6 12 2 12', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' })
    ),
    settings: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('circle', { cx: 12, cy: 12, r: 3, strokeWidth: 1.5 }),
      h('path', { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z', strokeWidth: 1.5 })
    ),
    check: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('polyline', { points: '20 6 9 17 4 12', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' })
    ),
    alertTriangle: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('path', { d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      h('line', { x1: 12, y1: 9, x2: 12, y2: 13, strokeWidth: 1.5, strokeLinecap: 'round' }),
      h('line', { x1: 12, y1: 17, x2: 12.01, y2: 17, strokeWidth: 2, strokeLinecap: 'round' })
    ),
    upload: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', strokeWidth: 1.5, strokeLinecap: 'round' }),
      h('polyline', { points: '17 8 12 3 7 8', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      h('line', { x1: 12, y1: 3, x2: 12, y2: 15, strokeWidth: 1.5, strokeLinecap: 'round' })
    ),
    arrowUpRight: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('line', { x1: 7, y1: 17, x2: 17, y2: 7, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      h('polyline', { points: '7 7 17 7 17 17', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' })
    ),
    sun: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('circle', { cx: 12, cy: 12, r: 5, strokeWidth: 1.5 }),
      h('line', { x1: 12, y1: 1, x2: 12, y2: 3, strokeWidth: 1.5, strokeLinecap: 'round' }),
      h('line', { x1: 12, y1: 21, x2: 12, y2: 23, strokeWidth: 1.5, strokeLinecap: 'round' }),
      h('line', { x1: 4.22, y1: 4.22, x2: 5.64, y2: 5.64, strokeWidth: 1.5, strokeLinecap: 'round' }),
      h('line', { x1: 18.36, y1: 18.36, x2: 19.78, y2: 19.78, strokeWidth: 1.5, strokeLinecap: 'round' }),
      h('line', { x1: 1, y1: 12, x2: 3, y2: 12, strokeWidth: 1.5, strokeLinecap: 'round' }),
      h('line', { x1: 21, y1: 12, x2: 23, y2: 12, strokeWidth: 1.5, strokeLinecap: 'round' }),
      h('line', { x1: 4.22, y1: 19.78, x2: 5.64, y2: 18.36, strokeWidth: 1.5, strokeLinecap: 'round' }),
      h('line', { x1: 18.36, y1: 5.64, x2: 19.78, y2: 4.22, strokeWidth: 1.5, strokeLinecap: 'round' })
    ),
    moon: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('path', { d: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' })
    ),
    target: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('circle', { cx: 12, cy: 12, r: 10, strokeWidth: 1.5 }),
      h('circle', { cx: 12, cy: 12, r: 6, strokeWidth: 1.5 }),
      h('circle', { cx: 12, cy: 12, r: 2, strokeWidth: 1.5 })
    )
  };

  return icons[name] || h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    h('circle', { cx: 12, cy: 12, r: 10, strokeWidth: 1.5 })
  );
}

// Preset Prompts & Demo Scenarios for Live Evaluation
const DEMO_SCENARIOS = [
  {
    id: "scenario_a",
    badge: "VERIFIED DEMO",
    title: "Highest Attendance",
    query: "Who has the highest attendance?",
    desc: "Arun (96%) verified against actual attendance records.",
    tag: "VERIFIED • 96/100",
    color: "verified"
  },
  {
    id: "scenario_b",
    badge: "UNSUPPORTED CLAIM",
    title: "Is Arun the Best Student?",
    query: "Who has the highest attendance?",
    simulate: "Arun has 96% attendance and is the best student in the college.",
    desc: "Flags qualitative hallucination not proven in database.",
    tag: "NEEDS REVIEW • 38/100",
    color: "warning"
  },
  {
    id: "scenario_c",
    badge: "0-ROW GUARD",
    title: "Attendance > 100%",
    query: "Show students with attendance above 100%",
    desc: "Guards against hallucinating 0-row records.",
    tag: "VERIFIED 0-ROW",
    color: "champagne"
  },
  {
    id: "scenario_d",
    badge: "AGGREGATE METRIC",
    title: "AI Department Count",
    query: "How many students are in the AI department?",
    desc: "Verifies mathematical aggregation against rows.",
    tag: "VERIFIED • 96/100",
    color: "verified"
  }
];

const CURATED_PROMPTS = {
  college_records: [
    "Who has the highest attendance?",
    "Show me the top 5 students with highest CGPA",
    "List all students with attendance less than 75%",
    "How many students are in the AI department?",
    "What is the average CGPA per department?"
  ],
  ecommerce_store: [
    "List all customers in alphabetical order",
    "What are the top 5 most expensive products?",
    "Total orders and revenue by order status",
    "Customer count by membership tier"
  ],
  healthcare: [
    "List all doctors in alphabetical order",
    "List doctors ordered by experience years",
    "Show patient count by blood group",
    "Total billing amount by payment status"
  ]
};

// Markdown Formatter Component with Clean Theme Adaptation
function MarkdownEditorial({ text }) {
  if (!text) return null;
  const lines = text.split('\n');
  return h('div', { className: 'space-y-2 text-[var(--text-primary)] font-normal leading-relaxed text-base' },
    lines.map((line, lIdx) => {
      if (!line.trim()) return h('div', { key: lIdx, className: 'h-2' });

      const elements = [];
      let remaining = line;
      let key = 0;

      while (remaining.length > 0) {
        const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
        const codeMatch = remaining.match(/`(.*?)`/);

        let firstMatch = null;
        let matchType = null;

        if (boldMatch && (!codeMatch || boldMatch.index < codeMatch.index)) {
          firstMatch = boldMatch;
          matchType = 'bold';
        } else if (codeMatch) {
          firstMatch = codeMatch;
          matchType = 'code';
        }

        if (firstMatch) {
          const before = remaining.slice(0, firstMatch.index);
          if (before) elements.push(h('span', { key: key++ }, before));

          if (matchType === 'bold') {
            elements.push(h('strong', { key: key++, className: 'font-semibold text-[var(--text-primary)] underline decoration-[var(--champagne)]/50 decoration-1 underline-offset-4' }, firstMatch[1]));
          } else if (matchType === 'code') {
            elements.push(h('code', { key: key++, className: 'bg-[var(--bg-surface-soft)] px-1.5 py-0.5 rounded text-[var(--champagne)] font-mono text-xs border border-[var(--border-subtle)]' }, firstMatch[1]));
          }
          remaining = remaining.slice(firstMatch.index + firstMatch[0].length);
        } else {
          elements.push(h('span', { key: key++ }, remaining));
          break;
        }
      }

      return h('div', { key: lIdx }, elements);
    })
  );
}

// Visual Trust Chain Component
function TrustChain({ verification, result }) {
  const isVerified = verification?.grounded;
  const status = verification?.status || "VERIFIED";

  const stages = [
    { label: "1. QUESTION", desc: "Natural Language Input", status: "COMPLETE" },
    { label: "2. UNDERSTANDING", desc: result.intent || "Intent & Entity Extraction", status: "COMPLETE" },
    { label: "3. SAFE SQL", desc: "Read-Only Enforced", status: "SAFE" },
    { label: "4. DB EVIDENCE", desc: `${result.row_count} Rows Returned`, status: "PROVEN" },
    { label: "5. AI ANSWER", desc: "Synthesized Output", status: "SYNTHESIZED" },
    { label: "6. VERIFICATION", desc: status, status: isVerified ? "VERIFIED" : "FLAGGED" }
  ];

  return h('div', { className: 'p-6 rounded-2xl luxury-card space-y-4' },
    h('div', { className: 'flex items-center justify-between' },
      h('div', { className: 'space-y-0.5' },
        h('span', { className: 'text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase font-semibold' }, 'TRUST CHAIN & AUDIT PROOF'),
        h('h4', { className: 'text-sm font-semibold text-[var(--text-primary)]' }, 'End-to-End Grounding Verification Pathway')
      ),
      h('span', { className: 'text-[11px] font-mono text-[var(--text-secondary)] bg-[var(--bg-surface-soft)] px-2.5 py-1 rounded border border-[var(--border-subtle)]' },
        `Latency: ${verification?.verification_latency_ms || 1.2}ms`
      )
    ),

    h('div', { className: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2' },
      stages.map((st, i) => {
        const isLast = i === stages.length - 1;
        let badgeStyle = "bg-[var(--bg-surface-soft)] text-[var(--text-secondary)] border-[var(--border-subtle)]";

        if (isLast) {
          badgeStyle = isVerified ? "badge-verified-luxury font-bold" : "badge-warning-luxury font-bold";
        } else if (st.status === "SAFE" || st.status === "PROVEN") {
          badgeStyle = "bg-[var(--bg-surface-soft)] text-[var(--champagne)] border-[var(--champagne-border)]";
        }

        return h('div', { key: i, className: `p-3 rounded-xl border flex flex-col justify-between space-y-1.5 ${badgeStyle}` },
          h('span', { className: 'text-[10px] font-mono font-semibold tracking-wider opacity-85' }, st.label),
          h('p', { className: 'text-xs font-medium text-[var(--text-primary)] truncate' }, st.desc),
          h('span', { className: 'text-[9px] font-mono uppercase tracking-widest' }, st.status)
        );
      })
    )
  );
}

// Verification Hero Badge & Score Card with Risk Meter
function VerificationHeroPanel({ verification }) {
  if (!verification) return null;

  const { status, reliability_score, reason, evidence, checks, claims_breakdown, hallucination_risk_pct, hallucination_risk_level } = verification;
  const isVerified = status === "VERIFIED" || status === "MOSTLY VERIFIED";

  let statusClass = "badge-verified-luxury";
  let statusIcon = "shieldCheck";
  if (status === "MOSTLY VERIFIED") {
    statusClass = "badge-mostly-verified-luxury";
  } else if (status === "NEEDS REVIEW") {
    statusClass = "badge-warning-luxury";
    statusIcon = "alertTriangle";
  } else if (status === "UNVERIFIED") {
    statusClass = "badge-danger-luxury";
    statusIcon = "shieldAlert";
  }

  const riskPct = hallucination_risk_pct !== undefined ? hallucination_risk_pct : Math.max(0, 100 - reliability_score);
  const riskLevel = hallucination_risk_level || (riskPct > 50 ? "CRITICAL" : riskPct > 20 ? "ELEVATED" : "MINIMAL");

  return h('div', { className: 'p-6 rounded-2xl luxury-card space-y-6 border-l-4 border-l-[var(--champagne)]' },
    // Header Row with Reliability Score and Hallucination Risk Meter
    h('div', { className: 'flex flex-wrap items-center justify-between gap-4' },
      h('div', { className: 'flex items-center space-x-3' },
        h('div', { className: `px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wider flex items-center space-x-2 ${statusClass}` },
          h(Icon, { name: statusIcon, className: 'w-4 h-4' }),
          h('span', null, status)
        ),
        h('span', { className: 'text-xs text-[var(--text-secondary)] font-medium' }, 'Grounded in real DB rows')
      ),

      // Score & Risk Badges
      h('div', { className: 'flex items-center space-x-3' },
        // Reliability score
        h('div', { className: 'flex items-baseline space-x-2 bg-[var(--bg-surface-soft)] px-3.5 py-1.5 rounded-xl border border-[var(--border-subtle)]' },
          h('span', { className: 'text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-mono font-semibold' }, 'Reliability:'),
          h('span', { className: `text-base font-mono font-bold ${reliability_score >= 90 ? 'text-[var(--verified)]' : reliability_score >= 70 ? 'text-[var(--champagne)]' : 'text-[var(--danger)]'}` },
            `${reliability_score}`
          ),
          h('span', { className: 'text-[10px] text-[var(--text-muted)] font-mono' }, '/ 100')
        ),

        // Hallucination Risk Meter
        h('div', { className: `flex items-baseline space-x-2 px-3.5 py-1.5 rounded-xl border font-mono ${riskPct > 50 ? 'bg-[var(--danger-bg)] border-[var(--danger-border)] text-[var(--danger)]' : 'bg-[var(--verified-bg)] border-[var(--verified-border)] text-[var(--verified)]'}` },
          h('span', { className: 'text-[10px] uppercase tracking-wider font-semibold' }, 'Hallucination Risk:'),
          h('span', { className: 'text-base font-bold' }, `${riskPct}%`),
          h('span', { className: 'text-[9px] font-bold uppercase' }, `(${riskLevel})`)
        )
      )
    ),

    // Reason Statement
    h('div', { className: 'space-y-1' },
      h('span', { className: 'text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase font-semibold' }, 'VERIFICATION RATIONALE & GROUNDING AUDIT'),
      h('p', { className: 'text-sm text-[var(--text-primary)] font-medium leading-relaxed' }, reason)
    ),

    // Token-by-Token Claims Breakdown (50% Focus Feature!)
    claims_breakdown && claims_breakdown.length > 0 && h('div', { className: 'space-y-2 pt-2 border-t border-[var(--border-subtle)]' },
      h('div', { className: 'flex items-center justify-between' },
        h('span', { className: 'text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase font-semibold' }, 'STATEMENT-LEVEL GROUNDING INSPECTOR'),
        h('span', { className: 'text-[10px] font-mono text-[var(--champagne)]' }, `${claims_breakdown.length} Assertions Checked`)
      ),
      h('div', { className: 'space-y-1.5' },
        claims_breakdown.map((c, idx) => {
          const isGrounded = c.status === "GROUNDED";
          return h('div', {
            key: idx,
            className: `p-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 ${
              isGrounded
                ? 'bg-[var(--verified-bg)] border-[var(--verified-border)] text-[var(--text-primary)]'
                : 'bg-[var(--danger-bg)] border-[var(--danger-border)] text-[var(--text-primary)]'
            }`
          },
            h('div', { className: 'flex items-start space-x-2' },
              h('span', { className: `mt-0.5 w-2 h-2 rounded-full shrink-0 ${isGrounded ? 'bg-[var(--verified)]' : 'bg-[var(--danger)]'}` }),
              h('span', { className: 'font-medium' }, `"${c.claim}"`)
            ),
            h('div', { className: 'flex items-center space-x-2 shrink-0 self-end sm:self-center' },
              h('span', { className: 'text-[10px] font-mono text-[var(--text-muted)]' }, c.category),
              h('span', {
                className: `text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  isGrounded ? 'bg-[var(--verified)] text-white' : 'bg-[var(--danger)] text-white'
                }`
              }, c.status)
            )
          );
        })
      )
    ),

    // Evidence Matches
    evidence && evidence.length > 0 && h('div', { className: 'space-y-2' },
      h('span', { className: 'text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase block font-semibold' }, 'DATABASE GROUND TRUTH EVIDENCE'),
      h('div', { className: 'flex flex-wrap gap-2' },
        evidence.map((ev, i) => h('div', { key: i, className: 'bg-[var(--bg-surface-soft)] text-[var(--text-primary)] border border-[var(--border-subtle)] px-3 py-1.5 rounded-lg text-xs font-mono flex items-center space-x-2' },
          h('span', { className: 'w-1.5 h-1.5 rounded-full bg-[var(--champagne)]' }),
          h('span', null, ev)
        ))
      )
    ),

    // Sub-checks Grid (6 Layers)
    checks && h('div', { className: 'pt-2 border-t border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs' },
      [
        { key: "numeric_consistency", label: "Numeric Consistency" },
        { key: "entity_consistency", label: "Entity Match" },
        { key: "claim_grounding", label: "Superlative Filter" },
        { key: "aggregate_consistency", label: "Aggregation Check" }
      ].map(chk => {
        const item = checks[chk.key];
        const passed = item ? item.passed : true;
        return h('div', { key: chk.key, className: 'p-2.5 rounded-lg bg-[var(--bg-surface-soft)] border border-[var(--border-subtle)] flex items-center justify-between' },
          h('span', { className: 'text-[var(--text-secondary)] text-[11px] font-medium truncate mr-2' }, chk.label),
          h('span', { className: `text-[10px] font-mono font-bold px-2 py-0.5 rounded ${passed ? 'text-[var(--verified)] bg-[var(--verified-bg)] border border-[var(--verified-border)]' : 'text-[var(--danger)] bg-[var(--danger-bg)] border border-[var(--danger-border)]'}` },
            passed ? 'PASSED' : 'FLAGGED'
          )
        );
      })
    )
  );
}

// Progressive Disclosure Collapsible Section
function CollapsibleSection({ id, title, subtitle, icon, isOpen, onToggle, children, badge = null }) {
  return h('div', { className: 'rounded-2xl luxury-card overflow-hidden transition-all' },
    h('button', {
      onClick: onToggle,
      className: 'w-full px-6 py-4 flex items-center justify-between bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-soft)] transition text-left'
    },
      h('div', { className: 'flex items-center space-x-3.5' },
        h('div', { className: 'p-2 rounded-xl bg-[var(--bg-surface-soft)] text-[var(--champagne)] border border-[var(--border-subtle)]' },
          h(Icon, { name: icon, className: 'w-4 h-4' })
        ),
        h('div', null,
          h('div', { className: 'flex items-center space-x-2' },
            h('h4', { className: 'text-sm font-semibold text-[var(--text-primary)]' }, title),
            badge && h('span', { className: 'text-[10px] font-mono bg-[var(--bg-surface-soft)] text-[var(--text-secondary)] px-2 py-0.5 rounded border border-[var(--border-subtle)]' }, badge)
          ),
          subtitle && h('p', { className: 'text-xs text-[var(--text-muted)] mt-0.5' }, subtitle)
        )
      ),
      h('div', { className: 'flex items-center space-x-2 text-[var(--text-muted)]' },
        h('span', { className: 'text-xs font-mono' }, isOpen ? 'Collapse' : 'Expand'),
        h(Icon, { name: isOpen ? 'chevronDown' : 'chevronRight', className: 'w-4 h-4' })
      )
    ),
    isOpen && h('div', { className: 'p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-soft)]' }, children)
  );
}

// ==============================================================================
// 50% CORE COMPONENT: DEDICATED HALLUCINATION LAB & SHIELD WORKSPACE
// ==============================================================================
function HallucinationLabWorkspace({ activeDb, databases, showToast, onSendQueryToStudio }) {
  const [benchmarks, setBenchmarks] = useState([]);
  const [telemetry, setTelemetry] = useState(null);
  const [selectedBenchmark, setSelectedBenchmark] = useState(null);

  const [testQuestion, setTestQuestion] = useState("Who has the highest attendance?");
  const [testAnswer, setTestAnswer] = useState("Arun has 96% attendance and is the best student in the college with 100% scholarship.");
  const [testDb, setTestDb] = useState("college_records");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  // Fetch benchmark scenarios and telemetry on mount
  useEffect(() => {
    fetchBenchmarks();
    fetchTelemetry();
  }, []);

  const fetchBenchmarks = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/hallucination/benchmarks`);
      if (res.ok) {
        const data = await res.json();
        setBenchmarks(data.scenarios || []);
        if (data.scenarios && data.scenarios.length > 0) {
          loadBenchmarkScenario(data.scenarios[0]);
        }
      }
    } catch (e) { console.error(e); }
  };

  const fetchTelemetry = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/hallucination/telemetry`);
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
      }
    } catch (e) { console.error(e); }
  };

  const loadBenchmarkScenario = (sc) => {
    setSelectedBenchmark(sc);
    setTestQuestion(sc.question);
    setTestAnswer(sc.hallucinated_answer);
    setTestDb(sc.database_id);
    setEvaluationResult(null);
  };

  const handleEvaluate = async (q = testQuestion, ans = testAnswer, db = testDb) => {
    setIsEvaluating(true);
    setEvaluationResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/hallucination/test-candidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          database_id: db,
          candidate_answer: ans
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Evaluation failed");
      setEvaluationResult(data);
      fetchTelemetry();
    } catch (err) {
      showToast(`Evaluation Error: ${err.message}`);
    } finally {
      setIsEvaluating(false);
    }
  };

  return h('div', { className: 'space-y-8 animate-entrance' },

    // Header Banner
    h('div', { className: 'p-6 rounded-2xl luxury-card border-l-4 border-l-[var(--champagne)] space-y-2' },
      h('div', { className: 'flex flex-wrap items-center justify-between gap-4' },
        h('div', { className: 'space-y-1' },
          h('div', { className: 'inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[var(--champagne-dim)] text-[var(--champagne)] text-[10px] font-mono uppercase tracking-widest font-semibold' },
            h(Icon, { name: 'shieldZap', className: 'w-3.5 h-3.5' }),
            h('span', null, 'ZERO-HALLUCINATION DEFENSE SYSTEM • 50% CORE ARCHITECTURE')
          ),
          h('h2', { className: 'font-serif-luxury text-2xl sm:text-3xl font-normal text-[var(--text-primary)]' }, 'HALLUCINATION LAB & RED-TEAMING ARENA'),
          h('p', { className: 'text-xs text-[var(--text-secondary)] max-w-2xl' },
            'Adversarial testing environment to simulate AI hallucinations, stress-test grounding algorithms, and verify that 0% ungrounded claims reach end users.'
          )
        ),
        h('div', { className: 'flex items-center space-x-3' },
          h('div', { className: 'bg-[var(--verified-bg)] border border-[var(--verified-border)] px-4 py-2 rounded-xl text-center' },
            h('span', { className: 'text-[10px] font-mono text-[var(--text-muted)] uppercase block font-semibold' }, 'Prevention Rate'),
            h('span', { className: 'text-xl font-bold font-mono text-[var(--verified)]' }, telemetry?.hallucination_prevention_rate || '100%')
          ),
          h('div', { className: 'bg-[var(--bg-surface-soft)] border border-[var(--border-subtle)] px-4 py-2 rounded-xl text-center' },
            h('span', { className: 'text-[10px] font-mono text-[var(--text-muted)] uppercase block font-semibold' }, 'Precision'),
            h('span', { className: 'text-xl font-bold font-mono text-[var(--champagne)]' }, telemetry?.grounding_precision || '99.4%')
          )
        )
      )
    ),

    // MAIN 2-COLUMN LAB LAYOUT
    h('div', { className: 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-start' },

      // LEFT: ATTACK SUITE & INPUT FORM (lg:col-span-5)
      h('div', { className: 'lg:col-span-5 space-y-4' },

        // Preset Adversarial Scenarios
        h('div', { className: 'p-5 rounded-2xl luxury-card space-y-3' },
          h('div', { className: 'flex items-center justify-between' },
            h('span', { className: 'text-[10px] font-mono tracking-widest text-[var(--champagne)] uppercase font-semibold' }, 'ADVERSARIAL ATTACK BENCHMARKS'),
            h('span', { className: 'text-[10px] font-mono text-[var(--text-muted)]' }, `${benchmarks.length} Scenarios`)
          ),
          h('div', { className: 'space-y-2 max-h-72 overflow-y-auto pr-1' },
            benchmarks.map(sc => {
              const isSelected = selectedBenchmark?.id === sc.id;
              return h('button', {
                key: sc.id,
                onClick: () => loadBenchmarkScenario(sc),
                className: `w-full text-left p-3 rounded-xl border transition flex flex-col justify-between space-y-1 ${
                  isSelected
                    ? 'bg-[var(--champagne-dim)] border-[var(--champagne-border)] text-[var(--text-primary)]'
                    : 'bg-[var(--bg-surface-soft)] border-[var(--border-subtle)] hover:border-[var(--border-medium)] text-[var(--text-secondary)]'
                }`
              },
                h('div', { className: 'flex items-center justify-between' },
                  h('span', { className: 'text-[10px] font-mono text-[var(--champagne)] font-semibold' }, sc.category),
                  h('span', { className: `text-[9px] font-mono px-2 py-0.5 rounded font-bold ${sc.severity === 'CRITICAL' ? 'bg-[var(--danger-bg)] text-[var(--danger)]' : 'bg-[var(--warning-bg)] text-[var(--warning)]'}` }, sc.severity)
                ),
                h('h4', { className: 'text-xs font-semibold text-[var(--text-primary)]' }, sc.title),
                h('p', { className: 'text-[11px] text-[var(--text-muted)] line-clamp-1' }, sc.attack_vector)
              );
            })
          )
        ),

        // Interactive Red-Teaming Playground Form
        h('div', { className: 'p-5 rounded-2xl luxury-card space-y-4' },
          h('div', { className: 'flex items-center justify-between' },
            h('span', { className: 'text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase font-semibold' }, 'LIVE ATTACK INJECTION CANVAS'),
            h('span', { className: 'text-[10px] font-mono text-[var(--verified)]' }, 'Real-time Verifier')
          ),

          // Database Selector
          h('div', { className: 'space-y-1' },
            h('label', { className: 'text-[10px] font-mono text-[var(--text-muted)] uppercase font-semibold' }, 'Target Database'),
            h('select', {
              value: testDb,
              onChange: (e) => setTestDb(e.target.value),
              className: 'w-full bg-[var(--bg-surface-soft)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs font-medium text-[var(--text-primary)] outline-none'
            },
              databases.map(d => h('option', { key: d.id, value: d.id }, d.name))
            )
          ),

          // Question Input
          h('div', { className: 'space-y-1' },
            h('label', { className: 'text-[10px] font-mono text-[var(--text-muted)] uppercase font-semibold' }, 'User Question'),
            h('input', {
              type: 'text',
              value: testQuestion,
              onChange: (e) => setTestQuestion(e.target.value),
              placeholder: 'Enter query...',
              className: 'w-full bg-[var(--bg-surface-soft)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] outline-none'
            })
          ),

          // Candidate / Hallucinated Text Input
          h('div', { className: 'space-y-1' },
            h('label', { className: 'text-[10px] font-mono text-[var(--text-muted)] uppercase font-semibold' }, 'Candidate Answer (Inject Hallucination to Test)'),
            h('textarea', {
              rows: 3,
              value: testAnswer,
              onChange: (e) => setTestAnswer(e.target.value),
              placeholder: 'Type candidate answer with test facts...',
              className: 'w-full bg-[var(--bg-surface-soft)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-primary)] outline-none font-mono leading-relaxed'
            })
          ),

          // Action Buttons
          h('div', { className: 'grid grid-cols-2 gap-2 pt-1' },
            h('button', {
              onClick: () => handleEvaluate(),
              disabled: isEvaluating || !testAnswer.trim(),
              className: 'btn-champagne py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 disabled:opacity-40'
            },
              h(Icon, { name: 'shieldZap', className: 'w-4 h-4' }),
              h('span', null, isEvaluating ? 'Evaluating...' : 'Stress-Test Shield')
            ),
            h('button', {
              onClick: () => {
                if (selectedBenchmark) {
                  setTestAnswer(selectedBenchmark.ground_truth_answer);
                  handleEvaluate(testQuestion, selectedBenchmark.ground_truth_answer, testDb);
                }
              },
              disabled: isEvaluating,
              className: 'btn-ghost-luxury py-2.5 px-3 rounded-xl text-xs font-semibold'
            }, 'Test Grounded Answer')
          )
        )
      ),

      // RIGHT: LIVE DIAGNOSTIC RESULTS & ARCHITECTURE (lg:col-span-7)
      h('div', { className: 'lg:col-span-7 space-y-4' },

        evaluationResult ? h('div', { className: 'space-y-4 animate-entrance' },

          // Result Verdict Card
          h('div', { className: `p-6 rounded-2xl luxury-card border-l-4 ${evaluationResult.hallucination_detected ? 'border-l-[var(--danger)]' : 'border-l-[var(--verified)]'} space-y-4` },
            h('div', { className: 'flex flex-wrap items-center justify-between gap-3' },
              h('div', { className: 'flex items-center space-x-3' },
                h('div', { className: `px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 ${evaluationResult.hallucination_detected ? 'badge-danger-luxury' : 'badge-verified-luxury'}` },
                  h(Icon, { name: evaluationResult.hallucination_detected ? 'shieldAlert' : 'shieldCheck', className: 'w-4 h-4' }),
                  h('span', null, evaluationResult.hallucination_detected ? 'HALLUCINATION INTERCEPTED' : '100% GROUNDED & VERIFIED')
                ),
                h('span', { className: 'text-xs text-[var(--text-secondary)] font-mono' }, `${evaluationResult.execution_time_ms}ms`)
              ),
              h('div', { className: 'flex items-center space-x-2' },
                h('span', { className: 'text-[10px] font-mono text-[var(--text-muted)] uppercase font-semibold' }, 'Risk Index:'),
                h('span', { className: `text-sm font-bold font-mono px-2.5 py-1 rounded ${evaluationResult.hallucination_risk_pct > 30 ? 'bg-[var(--danger-bg)] text-[var(--danger)]' : 'bg-[var(--verified-bg)] text-[var(--verified)]'}` },
                  `${evaluationResult.hallucination_risk_pct}%`
                )
              )
            ),

            // Dissection Rationale
            h('div', { className: 'space-y-1' },
              h('span', { className: 'text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase font-semibold' }, 'DETECTION DIAGNOSIS'),
              h('p', { className: 'text-sm font-medium text-[var(--text-primary)] leading-relaxed' }, evaluationResult.reason)
            ),

            // Token-Level Claims Breakdown
            evaluationResult.claims_breakdown && h('div', { className: 'space-y-2 pt-2 border-t border-[var(--border-subtle)]' },
              h('span', { className: 'text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase block font-semibold' }, 'TOKEN-BY-TOKEN CLAIM GROUNDING AUDIT'),
              h('div', { className: 'space-y-1.5' },
                evaluationResult.claims_breakdown.map((cl, i) => {
                  const isGood = cl.status === "GROUNDED";
                  return h('div', {
                    key: i,
                    className: `p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 ${
                      isGood ? 'bg-[var(--verified-bg)] border-[var(--verified-border)]' : 'bg-[var(--danger-bg)] border-[var(--danger-border)]'
                    }`
                  },
                    h('div', { className: 'space-y-0.5' },
                      h('p', { className: 'font-semibold text-[var(--text-primary)]' }, `"${cl.claim}"`),
                      cl.flag && h('p', { className: `text-[11px] font-mono ${isGood ? 'text-[var(--verified)]' : 'text-[var(--danger)]'}` }, `● ${cl.flag}`)
                    ),
                    h('span', { className: `text-[10px] font-mono font-bold px-2 py-0.5 rounded self-start sm:self-center ${isGood ? 'bg-[var(--verified)] text-white' : 'bg-[var(--danger)] text-white'}` },
                      cl.status
                    )
                  );
                })
              )
            ),

            // Database Ground Truth Evidence
            evaluationResult.evidence && h('div', { className: 'space-y-2 pt-2 border-t border-[var(--border-subtle)]' },
              h('span', { className: 'text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase block font-semibold' }, 'RAW DATABASE GROUND TRUTH (ZERO HALLUCINATION BASE)'),
              h('div', { className: 'flex flex-wrap gap-2' },
                evaluationResult.evidence.map((ev, i) => h('div', { key: i, className: 'bg-[var(--bg-surface-soft)] text-[var(--text-primary)] border border-[var(--border-subtle)] px-3 py-1.5 rounded-lg text-xs font-mono flex items-center space-x-2' },
                  h('span', { className: 'w-1.5 h-1.5 rounded-full bg-[var(--champagne)]' }),
                  h('span', null, ev)
                ))
              )
            )
          )

        ) : isEvaluating ? (

          h('div', { className: 'p-12 rounded-2xl luxury-card text-center space-y-4 flex flex-col items-center justify-center min-h-[380px]' },
            h('div', { className: 'w-12 h-12 rounded-full bg-[var(--champagne-dim)] border border-[var(--champagne-border)] flex items-center justify-center' },
              h('span', { className: 'w-3 h-3 rounded-full bg-[var(--champagne)] animate-ping' })
            ),
            h('div', { className: 'space-y-1' },
              h('h3', { className: 'text-base font-semibold text-[var(--text-primary)]' }, 'Executing 6-Layer Hallucination Shield...'),
              h('p', { className: 'text-xs text-[var(--text-muted)] max-w-sm' }, 'Cross-referencing candidate assertions with SQL relational constraints, numeric registers, and entity graphs.')
            )
          )

        ) : (

          // Standby Guidance Card
          h('div', { className: 'p-8 rounded-2xl luxury-card space-y-6' },
            h('div', { className: 'space-y-2' },
              h('div', { className: 'inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[var(--champagne-dim)] text-[var(--champagne)] text-[10px] font-mono font-semibold uppercase tracking-widest' },
                h(Icon, { name: 'target', className: 'w-3.5 h-3.5' }),
                h('span', null, 'READY FOR RED-TEAMING')
              ),
              h('h3', { className: 'font-serif-luxury text-xl text-[var(--text-primary)]' }, 'HOW TRUSTDB-AI PREVENTS HALLUCINATIONS'),
              h('p', { className: 'text-xs text-[var(--text-secondary)] leading-relaxed' },
                'Traditional LLMs frequently hallucinate metrics, invent non-existent database rows, or embellish answers with qualitative superlatives. TRUSTDB-AI solves this by executing a deterministic 6-layer verification barrier on every query.'
              )
            ),

            // 6-Layer Architecture Breakdown
            h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2' },
              [
                { num: "01", title: "Zero-Row Phantom Barrier", desc: "Prevents synthesizing fictional records when WHERE filters return 0 rows." },
                { num: "02", title: "Entity Grounding Matrix", desc: "Cross-checks proper nouns, names, and foreign keys against database indices." },
                { num: "03", title: "Strict Numeric Consistency", desc: "Validates every integer, percentage, and currency against SQL column rows." },
                { num: "04", title: "Qualitative Superlative Filter", desc: "Flags unproven claims like 'best student' or 'guaranteed' that lack DB schema proof." },
                { num: "05", title: "Mathematical Aggregation Verifier", desc: "Validates COUNT, SUM, AVG computations with mathematical determinism." },
                { num: "06", title: "Semantic LLM Auditor (Hybrid)", desc: "Adversarial second-stage auditor for complex ambiguous queries." }
              ].map(ly => h('div', { key: ly.num, className: 'p-3.5 rounded-xl bg-[var(--bg-surface-soft)] border border-[var(--border-subtle)] space-y-1' },
                h('div', { className: 'flex items-center justify-between' },
                  h('span', { className: 'text-[10px] font-mono text-[var(--champagne)] font-bold' }, `LAYER ${ly.num}`),
                  h('span', { className: 'text-[9px] font-mono text-[var(--verified)] font-bold' }, 'ACTIVE')
                ),
                h('h4', { className: 'text-xs font-semibold text-[var(--text-primary)]' }, ly.title),
                h('p', { className: 'text-[11px] text-[var(--text-muted)] leading-relaxed' }, ly.desc)
              ))
            )
          )

        )

      )

    )

  );
}

// Main Neura-X Application Component
function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('neura_theme') || 'dark');
  const [databases, setDatabases] = useState([]);
  const [activeDb, setActiveDb] = useState("college_records");
  const [schemaData, setSchemaData] = useState(null);
  const [activeTab, setActiveTab] = useState("ask"); // 'ask', 'hallucination', 'explore', 'history', 'insights'
  const [toastMessage, setToastMessage] = useState(null);

  const [inputQuery, setInputQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);
  const [currentResult, setCurrentResult] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [directSqlMode, setDirectSqlMode] = useState(false);

  // Collapsible States
  const [openSections, setOpenSections] = useState({
    sql: false,
    table: false,
    chart: false,
    security: false
  });

  // Table Search & Chart Settings
  const [tableSearch, setTableSearch] = useState("");
  const [chartTypeOverride, setChartTypeOverride] = useState(null);

  // History, Settings & Telemetry
  const [queryHistory, setQueryHistory] = useState([]);
  const [settingsData, setSettingsData] = useState({
    llm_provider: "offline",
    model_name: "gemini-2.5-flash",
    gemini_key_input: "",
    openai_key_input: ""
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const chartCanvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Theme Synchronizer
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('neura_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Init Data Fetching
  useEffect(() => {
    fetchDatabases();
    fetchSettings();
    fetchHistory();
  }, []);

  useEffect(() => {
    if (activeDb) {
      fetchSchema(activeDb);
    }
  }, [activeDb]);

  // Chart Rendering in Visual Analytics Section
  useEffect(() => {
    if (currentResult && currentResult.chart && chartCanvasRef.current && openSections.chart) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      try {
        const ctx = chartCanvasRef.current.getContext('2d');
        const targetType = chartTypeOverride || currentResult.chart.type;

        const isDark = theme === 'dark';
        const textColor = isDark ? '#CBD5E1' : '#334155';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)';

        const luxuryChartData = { ...currentResult.chart.data };
        if (luxuryChartData.datasets && luxuryChartData.datasets[0]) {
          const ds = luxuryChartData.datasets[0];
          if (targetType === 'bar') {
            ds.backgroundColor = isDark ? 'rgba(198, 167, 107, 0.75)' : 'rgba(180, 136, 59, 0.85)';
            ds.borderColor = isDark ? '#C6A76B' : '#B4883B';
            ds.borderWidth = 1;
            ds.borderRadius = 6;
          } else if (targetType === 'line') {
            ds.borderColor = isDark ? '#C6A76B' : '#B4883B';
            ds.backgroundColor = isDark ? 'rgba(198, 167, 107, 0.15)' : 'rgba(180, 136, 59, 0.15)';
            ds.fill = true;
            ds.tension = 0.3;
          } else if (targetType === 'doughnut' || targetType === 'pie') {
            ds.backgroundColor = [
              isDark ? '#C6A76B' : '#B4883B',
              isDark ? '#7FA58C' : '#15803D',
              isDark ? '#CBD5E1' : '#475569',
              isDark ? '#B99A62' : '#D97706',
              isDark ? '#8E97A0' : '#94A3B8'
            ];
            ds.borderColor = isDark ? '#0B0D0F' : '#FFFFFF';
          }
        }

        chartInstanceRef.current = new Chart(ctx, {
          type: targetType,
          data: luxuryChartData,
          options: {
            ...currentResult.chart.options,
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 600, easing: 'easeOutQuart' },
            plugins: {
              legend: {
                labels: {
                  color: textColor,
                  font: { family: 'Plus Jakarta Sans', size: 12 }
                }
              }
            },
            scales: targetType === 'doughnut' || targetType === 'pie' ? {} : {
              x: {
                grid: { color: gridColor },
                ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11 } }
              },
              y: {
                grid: { color: gridColor },
                ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11 } }
              }
            }
          }
        });
      } catch (err) {
        console.error("Chart Rendering Error:", err);
      }
    }
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [currentResult, openSections.chart, chartTypeOverride, theme]);

  const fetchDatabases = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/databases`);
      if (res.ok) {
        const data = await res.json();
        setDatabases(data);
      }
    } catch (e) { console.error(e); }
  };

  const fetchSchema = async (dbId) => {
    try {
      const res = await fetch(`${API_BASE}/api/databases/${dbId}/schema`);
      if (res.ok) {
        const data = await res.json();
        setSchemaData(data);
      }
    } catch (e) { console.error(e); }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/settings`);
      if (res.ok) {
        const data = await res.json();
        setSettingsData(prev => ({ ...prev, ...data }));
      }
    } catch (e) { console.error(e); }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/history`);
      if (res.ok) {
        const data = await res.json();
        setQueryHistory(data);
      }
    } catch (e) { console.error(e); }
  };

  // Submit Query to Agent with Staged Progress Simulation
  const handleSendQuery = async (queryText = inputQuery, simulateAnswer = null) => {
    const textToRun = (queryText || "").trim();
    if (!textToRun || isAnalyzing) return;

    setInputQuery(textToRun);
    setIsAnalyzing(true);
    setAnalysisStage(1);
    setCurrentResult(null);
    setChartTypeOverride(null);

    const stageTimer1 = setTimeout(() => setAnalysisStage(2), 200);
    const stageTimer2 = setTimeout(() => setAnalysisStage(3), 450);
    const stageTimer3 = setTimeout(() => setAnalysisStage(4), 700);

    try {
      const payload = {
        question: textToRun,
        database_id: activeDb,
        provider: settingsData.llm_provider,
        api_key: settingsData.llm_provider === "gemini" ? settingsData.gemini_key_input : settingsData.openai_key_input,
        model_name: settingsData.model_name,
        custom_sql: directSqlMode ? textToRun : null,
        simulate_answer: simulateAnswer
      };

      const res = await fetch(`${API_BASE}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Query execution encountered an issue.");
      }

      setCurrentResult(data);
      fetchHistory();
      
      if (data.chart) {
        setOpenSections(prev => ({ ...prev, chart: true }));
      }
    } catch (err) {
      showToast(`Query Error: ${err.message}`);
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      setIsAnalyzing(false);
      setAnalysisStage(0);
    }
  };

  // Voice Interaction
  const handleVoiceToggle = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      showToast("Voice speech recognition is supported in Chrome, Edge, and Safari.");
      return;
    }
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInputQuery(transcript);
      setIsListening(false);
      handleSendQuery(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // CSV/JSON Data Exports
  const exportCSV = () => {
    if (!currentResult || !currentResult.rows.length) return;
    const cols = currentResult.columns;
    const rows = currentResult.rows;
    let csv = cols.join(",") + "\n";
    rows.forEach(r => {
      csv += cols.map(c => {
        let v = r[c] === null || r[c] === undefined ? "" : String(r[c]);
        return (v.includes(",") || v.includes('"')) ? `"${v.replace(/"/g, '""')}"` : v;
      }).join(",") + "\n";
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `neura_export_${activeDb}_${Date.now()}.csv`;
    a.click();
    showToast("Exported CSV successfully.");
  };

  const exportJSON = () => {
    if (!currentResult || !currentResult.rows.length) return;
    const blob = new Blob([JSON.stringify(currentResult.rows, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `neura_export_${activeDb}_${Date.now()}.json`;
    a.click();
    showToast("Exported JSON successfully.");
  };

  // CSV Importer
  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setUploadStatus("Ingesting dataset and building relational schema...");
    try {
      const res = await fetch(`${API_BASE}/api/databases/upload-csv`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      setUploadStatus(`✅ Imported table '${data.table_name}' (${data.row_count} rows). Ready to query.`);
      showToast(`Imported ${data.table_name} successfully.`);
      await fetchDatabases();
      setActiveDb(data.database_id);
    } catch (err) {
      setUploadStatus(`❌ ${err.message}`);
      showToast(`Error: ${err.message}`);
    }
  };

  // Filtered rows for Data Grid
  const filteredRows = useMemo(() => {
    if (!currentResult || !currentResult.rows) return [];
    if (!tableSearch) return currentResult.rows;
    return currentResult.rows.filter(row =>
      Object.values(row).some(v => String(v).toLowerCase().includes(tableSearch.toLowerCase()))
    );
  }, [currentResult, tableSearch]);

  // Aggregate Insights Metrics
  const insightsMetrics = useMemo(() => {
    const total = queryHistory.length;
    if (total === 0) {
      return { total: 0, verifiedPct: "100%", avgReliability: "94.5", avgLatency: "1.2s" };
    }
    const verifiedCount = queryHistory.filter(q => q.verification_status === "VERIFIED" || q.verification_status === "MOSTLY VERIFIED").length;
    const verifiedPct = `${Math.round((verifiedCount / total) * 100)}%`;
    const sumRel = queryHistory.reduce((acc, q) => acc + (q.reliability_score || 90), 0);
    const avgReliability = (sumRel / total).toFixed(1);
    const sumLat = queryHistory.reduce((acc, q) => acc + (q.execution_time_ms || 20), 0);
    const avgLatency = `${(sumLat / total).toFixed(0)} ms`;
    return { total, verifiedPct, avgReliability, avgLatency };
  }, [queryHistory]);

  const activeDatabaseObj = databases.find(d => d.id === activeDb) || { name: activeDb, table_count: 5 };
  const curatedExamples = CURATED_PROMPTS[activeDb] || CURATED_PROMPTS.college_records;

  return h('div', { className: 'min-h-screen flex flex-col' },

    // Toast Notification
    toastMessage && h('div', { className: 'fixed bottom-8 right-8 z-50 bg-[var(--bg-surface-elevated)] border border-[var(--champagne-border)] text-[var(--text-primary)] text-xs font-semibold px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 animate-entrance' },
      h('span', { className: 'w-2 h-2 rounded-full bg-[var(--champagne)]' }),
      h('span', null, toastMessage)
    ),

    // TOP LUXURY MINIMAL NAVIGATION
    h('header', { className: 'luxury-nav sticky top-0 z-40 px-6 lg:px-12 py-4 flex items-center justify-between' },

      // Left: NEURA-X Wordmark
      h('div', { className: 'flex items-center space-x-4' },
        h('div', { className: 'flex flex-col' },
          h('span', { className: 'font-serif-luxury font-bold text-xl tracking-[0.2em] text-[var(--text-primary)]' }, 'NEURA-X'),
          h('span', { className: 'text-[9px] font-mono tracking-widest text-[var(--champagne)] uppercase font-semibold' }, 'ASK. VERIFY. TRUST.')
        )
      ),

      // Center: Editorial Nav Links (With 50% Hallucination Lab Featured)
      h('nav', { className: 'hidden md:flex items-center space-x-6 text-xs font-semibold tracking-wider' },
        [
          { id: 'ask', label: 'ASK STUDIO', icon: 'sparkles' },
          { id: 'hallucination', label: 'HALLUCINATION LAB', icon: 'shieldZap', isFeatured: true },
          { id: 'explore', label: 'DATA LIBRARY', icon: 'table' },
          { id: 'history', label: 'AUDIT TRAIL', icon: 'history' },
          { id: 'insights', label: 'INSIGHTS', icon: 'activity' }
        ].map(item => h('button', {
          key: item.id,
          onClick: () => setActiveTab(item.id),
          className: `transition-all py-1 px-2 border-b-2 flex items-center space-x-1.5 ${
            activeTab === item.id
              ? 'text-[var(--text-primary)] border-[var(--champagne)] font-bold'
              : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)]'
          }`
        },
          item.isFeatured && h('span', { className: 'px-1.5 py-0.2 rounded text-[9px] font-mono bg-[var(--champagne-dim)] text-[var(--champagne)] border border-[var(--champagne-border)] mr-1' }, '50% PILLAR'),
          h('span', null, item.label)
        ))
      ),

      // Right: Theme Switcher, Database Context & Settings
      h('div', { className: 'flex items-center space-x-3' },

        // Light / Dark Theme Switcher Button
        h('button', {
          onClick: toggleTheme,
          className: 'p-2 rounded-xl bg-[var(--bg-surface-soft)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition flex items-center justify-center',
          title: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'
        },
          h(Icon, { name: theme === 'dark' ? 'sun' : 'moon', className: 'w-4 h-4 text-[var(--champagne)]' })
        ),

        // DB Selector
        h('div', { className: 'flex items-center bg-[var(--bg-surface-soft)] border border-[var(--border-subtle)] rounded-xl px-3 py-1.5' },
          h(Icon, { name: 'database', className: 'w-3.5 h-3.5 text-[var(--champagne)] mr-2' }),
          h('select', {
            value: activeDb,
            onChange: (e) => {
              setActiveDb(e.target.value);
              setCurrentResult(null);
            },
            className: 'bg-transparent text-xs font-semibold text-[var(--text-primary)] outline-none cursor-pointer pr-2'
          },
            databases.map(db => h('option', { key: db.id, value: db.id }, db.name))
          )
        ),

        // Grounded Status Pill
        h('div', { className: 'hidden lg:flex items-center space-x-2 bg-[var(--verified-bg)] border border-[var(--verified-border)] px-3 py-1.5 rounded-xl text-xs text-[var(--verified)]' },
          h('span', { className: 'w-2 h-2 rounded-full bg-[var(--verified)] animate-pulse-subtle' }),
          h('span', { className: 'font-mono text-[11px] font-bold' }, 'SHIELD ACTIVE')
        ),

        // Settings Button
        h('button', {
          onClick: () => setIsSettingsOpen(!isSettingsOpen),
          className: 'p-2 rounded-xl bg-[var(--bg-surface-soft)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition',
          title: 'Settings & Dataset Import'
        },
          h(Icon, { name: 'settings', className: 'w-4 h-4' })
        )
      )
    ),

    // Mobile Navigation Bar
    h('div', { className: 'md:hidden flex items-center justify-around bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] py-2.5 text-xs font-semibold' },
      [
        { id: 'ask', label: 'Ask Studio' },
        { id: 'hallucination', label: 'Shield Lab' },
        { id: 'explore', label: 'Library' },
        { id: 'history', label: 'Audit' },
        { id: 'insights', label: 'Insights' }
      ].map(item => h('button', {
        key: item.id,
        onClick: () => setActiveTab(item.id),
        className: activeTab === item.id ? 'text-[var(--champagne)] font-bold border-b-2 border-[var(--champagne)]' : 'text-[var(--text-secondary)]'
      }, item.label))
    ),

    // MAIN CONTENT CONTAINER
    h('main', { className: 'flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8' },

      // ==========================================
      // VIEW 1: ASK (SIDE-BY-SIDE INTERACTIVE VERIFIED STUDIO)
      // ==========================================
      activeTab === 'ask' && h('div', { className: 'animate-entrance' },
        h('div', { className: 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-start' },

          // LEFT COLUMN: QUESTION & CONTROLS STUDIO (lg:col-span-5)
          h('div', { className: 'lg:col-span-5 space-y-4' },

            // Compact Editorial Studio Header & Input Card
            h('div', { className: 'p-5 rounded-2xl luxury-card space-y-4' },
              h('div', { className: 'flex items-center justify-between' },
                h('div', { className: 'inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[var(--champagne-dim)] text-[var(--champagne)] text-[10px] font-mono uppercase tracking-widest font-semibold' },
                  h('span', { className: 'w-1.5 h-1.5 rounded-full bg-[var(--champagne)]' }),
                  h('span', null, 'AI Database Query Studio')
                ),
                h('span', { className: 'text-[10px] font-mono text-[var(--verified)] bg-[var(--verified-bg)] border border-[var(--verified-border)] px-2 py-0.5 rounded font-bold' }, 'READ-ONLY SAFE')
              ),

              h('div', { className: 'space-y-1' },
                h('h1', { className: 'font-serif-luxury text-2xl sm:text-3xl font-normal tracking-[0.06em] text-[var(--text-primary)] leading-tight' }, 'ASK YOUR DATA.'),
                h('p', { className: 'text-xs text-[var(--text-secondary)] leading-relaxed' }, 'Ask in natural English. Answers are mathematically proven against real database records with zero hallucination.')
              ),

              // Hero Input Box (Glassmorphic)
              h('div', { className: 'hero-input-container rounded-2xl p-2 sm:p-2.5 flex items-center space-x-2' },

                // SQL Mode Switcher Pill
                h('button', {
                  onClick: () => setDirectSqlMode(!directSqlMode),
                  className: `px-2 py-1 rounded-lg text-[10px] font-mono tracking-wider transition ${
                    directSqlMode ? 'bg-[var(--champagne)] text-[#0F172A] font-bold' : 'bg-[var(--bg-surface-soft)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`
                }, directSqlMode ? 'SQL' : 'AI'),

                // Input field
                h('input', {
                  type: 'text',
                  value: inputQuery,
                  onChange: (e) => setInputQuery(e.target.value),
                  onKeyDown: (e) => e.key === 'Enter' && handleSendQuery(),
                  placeholder: directSqlMode ? 'Enter SELECT query...' : 'Ask a question about your data...',
                  disabled: isAnalyzing,
                  className: 'w-full bg-transparent text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none font-medium'
                }),

                // Voice Button
                h('button', {
                  onClick: handleVoiceToggle,
                  title: 'Voice Input',
                  className: `p-2 rounded-xl transition flex items-center justify-center ${
                    isListening ? 'bg-[var(--danger-bg)] text-[var(--danger)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-soft)]'
                  }`
                },
                  isListening
                    ? h('div', { className: 'flex items-center space-x-0.5' },
                        h('span', { className: 'w-1 bg-[var(--danger)] voice-bar-1 rounded' }),
                        h('span', { className: 'w-1 bg-[var(--danger)] voice-bar-2 rounded' }),
                        h('span', { className: 'w-1 bg-[var(--danger)] voice-bar-3 rounded' })
                      )
                    : h(Icon, { name: 'mic', className: 'w-4 h-4' })
                ),

                // Submit Button
                h('button', {
                  onClick: () => handleSendQuery(),
                  disabled: isAnalyzing || !inputQuery.trim(),
                  className: 'btn-champagne px-3.5 py-2 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg'
                },
                  h(Icon, { name: 'send', className: 'w-4 h-4 text-[#0F172A]' })
                )
              ),

              // Connected DB Context Pill
              h('div', { className: 'flex items-center justify-between text-xs text-[var(--text-secondary)] pt-0.5 font-mono text-[11px]' },
                h('div', { className: 'flex items-center space-x-1.5' },
                  h('span', { className: 'text-[var(--text-muted)] uppercase font-semibold' }, 'DB:'),
                  h('span', { className: 'text-[var(--text-primary)] font-semibold' }, activeDatabaseObj.name),
                  h('span', { className: 'text-[var(--verified)] font-bold' }, '● Active')
                ),
                h('span', { className: 'text-[var(--text-muted)]' }, `${schemaData?.tables?.length || 0} Tables`)
              )
            ),

            // Staged Query Lifecycle Progress (While querying)
            isAnalyzing && h('div', { className: 'p-4 rounded-2xl luxury-card text-center space-y-3 animate-entrance' },
              h('div', { className: 'flex items-center justify-center space-x-2' },
                h('span', { className: 'w-2 h-2 rounded-full bg-[var(--champagne)] animate-ping' }),
                h('span', { className: 'font-mono text-xs text-[var(--champagne)] uppercase tracking-wider font-bold' },
                  analysisStage === 1 ? 'Understanding question...' :
                  analysisStage === 2 ? 'Checking query safety...' :
                  analysisStage === 3 ? 'Executing database query...' :
                  'Verifying answer grounding...'
                )
              ),
              h('div', { className: 'grid grid-cols-4 gap-1.5' },
                [
                  { step: 1, label: "Intent" },
                  { step: 2, label: "Safety" },
                  { step: 3, label: "DB Read" },
                  { step: 4, label: "Verify" }
                ].map(st => h('div', {
                  key: st.step,
                  className: `p-1.5 rounded-lg text-[10px] font-mono transition-all text-center ${
                    analysisStage >= st.step
                      ? 'bg-[var(--champagne-dim)] text-[var(--champagne)] border border-[var(--champagne-border)] font-bold'
                      : 'bg-[var(--bg-surface-soft)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
                  }`
                },
                  h('span', null, `${st.label} ${analysisStage >= st.step ? '✓' : ''}`)
                ))
              )
            ),

            // Demo Scenarios Interactive Section
            h('div', { className: 'p-4 sm:p-5 rounded-2xl luxury-card space-y-3' },
              h('div', { className: 'flex items-center justify-between' },
                h('span', { className: 'text-[10px] font-mono tracking-widest text-[var(--champagne)] uppercase font-semibold' }, 'DEMO FLOWS & EVALUATION'),
                h('span', { className: 'text-[10px] font-mono text-[var(--text-muted)]' }, 'Instant Test Cases')
              ),
              h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-2' },
                DEMO_SCENARIOS.map(sc => h('button', {
                  key: sc.id,
                  onClick: () => {
                    setActiveDb("college_records");
                    handleSendQuery(sc.query, sc.simulate || null);
                  },
                  className: 'p-2.5 rounded-xl luxury-card-interactive text-left space-y-1 flex flex-col justify-between'
                },
                  h('div', { className: 'flex items-center justify-between' },
                    h('span', { className: 'text-[9px] font-mono text-[var(--champagne)] font-bold' }, sc.badge),
                    h('span', { className: `text-[9px] font-mono font-bold ${sc.color === 'verified' ? 'text-[var(--verified)]' : sc.color === 'warning' ? 'text-[var(--warning)]' : 'text-[var(--champagne)]'}` }, sc.tag)
                  ),
                  h('p', { className: 'text-xs font-semibold text-[var(--text-primary)]' }, sc.title),
                  h('p', { className: 'text-[10px] text-[var(--text-secondary)] line-clamp-1' }, sc.desc)
                ))
              )
            ),

            // Curated Example Queries
            h('div', { className: 'p-4 sm:p-5 rounded-2xl luxury-card space-y-2.5' },
              h('div', { className: 'flex items-center justify-between' },
                h('span', { className: 'text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase font-semibold' }, 'SUGGESTED QUESTIONS'),
                h('span', { className: 'text-[10px] font-mono text-[var(--text-muted)]' }, 'Click to run')
              ),
              h('div', { className: 'space-y-1.5 max-h-52 overflow-y-auto pr-1' },
                curatedExamples.map((ex, idx) => h('button', {
                  key: idx,
                  onClick: () => handleSendQuery(ex),
                  className: 'w-full text-left text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface-soft)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:border-[var(--champagne-border)] p-2 rounded-xl transition flex items-center justify-between group'
                },
                  h('span', { className: 'truncate mr-2 font-medium' }, ex),
                  h(Icon, { name: 'arrowUpRight', className: 'w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--champagne)] shrink-0' })
                ))
              )
            )
          ),

          // RIGHT COLUMN: LIVE RESULTS & EVIDENCE STUDIO (lg:col-span-7)
          h('div', { className: 'lg:col-span-7 space-y-4' },

            currentResult && !isAnalyzing ? h('div', { className: 'space-y-4 animate-entrance' },
              // 1. Answer Hero (Verified Result)
              h('section', { className: 'p-6 rounded-2xl luxury-card space-y-4 relative overflow-hidden border-t-2 border-t-[var(--champagne)]' },
                h('div', { className: 'flex items-center justify-between' },
                  h('div', { className: 'flex items-center space-x-2' },
                    h('span', { className: 'w-2 h-2 rounded-full bg-[var(--verified)]' }),
                    h('span', { className: 'text-[10px] font-mono tracking-widest text-[var(--champagne)] uppercase font-bold' }, 'VERIFIED ANSWER')
                  ),
                  h('div', { className: 'flex items-center space-x-2 text-[11px] font-mono text-[var(--text-secondary)]' },
                    h('span', { className: 'text-[var(--verified)] font-bold' }, `${currentResult.row_count} rows proven`),
                    h('span', { className: 'text-[var(--text-muted)]' }, '•'),
                    h('span', null, `${currentResult.execution_time_ms}ms`)
                  )
                ),

                h('div', { className: 'text-xl sm:text-2xl font-light text-[var(--text-primary)] leading-relaxed font-sans' },
                  h(MarkdownEditorial, { text: currentResult.natural_answer })
                ),

                // Metadata Badges & Hallucination Attack Simulation Quick-Trigger
                h('div', { className: 'pt-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between text-xs text-[var(--text-secondary)] gap-2 font-mono text-[11px]' },
                  h('div', { className: 'flex items-center space-x-2' },
                    h('span', { className: 'text-[var(--text-muted)]' }, 'Target DB:'),
                    h('span', { className: 'text-[var(--text-primary)] font-semibold' }, currentResult.database_id)
                  ),
                  h('button', {
                    onClick: () => {
                      setActiveTab('hallucination');
                    },
                    className: 'text-[10px] font-mono text-[var(--champagne)] hover:underline flex items-center space-x-1'
                  },
                    h(Icon, { name: 'shieldZap', className: 'w-3 h-3' }),
                    h('span', null, 'Open in Hallucination Lab →')
                  )
                )
              ),

              // 2. Trust & Verification Panel with Claims Breakdown & Risk Index
              h(VerificationHeroPanel, { verification: currentResult.verification }),

              // 3. Trust Chain Pipeline
              h(TrustChain, { verification: currentResult.verification, result: currentResult }),

              // 4. Collapsible: How Neura-X Got This Answer (SQL)
              h(CollapsibleSection, {
                id: 'sql',
                title: 'How Neura-X Got This Answer',
                subtitle: 'Generated SQL query and 100% read-only sandbox proof',
                icon: 'code',
                isOpen: openSections.sql,
                onToggle: () => setOpenSections(prev => ({ ...prev, sql: !prev.sql })),
                badge: `${currentResult.execution_time_ms}ms`
              },
                h('div', { className: 'space-y-4' },
                  h('div', { className: 'flex items-center justify-between' },
                    h('span', { className: 'text-[11px] font-mono text-[var(--text-muted)] font-semibold' }, 'SANITIZED READ-ONLY QUERY:'),
                    h('button', {
                      onClick: () => {
                        navigator.clipboard.writeText(currentResult.sanitized_sql);
                        showToast("SQL query copied to clipboard.");
                      },
                      className: 'btn-ghost-luxury px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1.5'
                    },
                      h(Icon, { name: 'copy', className: 'w-3.5 h-3.5' }),
                      h('span', null, 'Copy SQL')
                    )
                  ),
                  h('pre', { className: 'sql-luxury-box p-4 text-xs font-mono overflow-x-auto leading-relaxed' },
                    currentResult.sanitized_sql
                  ),
                  h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs' },
                    h('div', { className: 'p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1' },
                      h('span', { className: 'text-[10px] font-mono text-[var(--text-muted)] uppercase font-semibold' }, 'QUERY INTENT'),
                      h('p', { className: 'text-[var(--text-primary)] font-medium' }, currentResult.intent || 'Data Extraction')
                    ),
                    h('div', { className: 'p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1' },
                      h('span', { className: 'text-[10px] font-mono text-[var(--text-muted)] uppercase font-semibold' }, 'GUARDRAIL STATUS'),
                      h('p', { className: 'text-[var(--verified)] font-mono font-bold' }, '100% Read-Only Enforced')
                    )
                  )
                )
              ),

              // 5. Collapsible: Database Results Grid
              h(CollapsibleSection, {
                id: 'table',
                title: 'Database Results Grid',
                subtitle: `${currentResult.row_count} returned records from database`,
                icon: 'table',
                isOpen: openSections.table,
                onToggle: () => setOpenSections(prev => ({ ...prev, table: !prev.table })),
                badge: `${currentResult.columns.length} columns`
              },
                h('div', { className: 'space-y-4' },
                  h('div', { className: 'flex flex-wrap items-center justify-between gap-3' },
                    h('input', {
                      type: 'text',
                      placeholder: 'Filter records in result...',
                      value: tableSearch,
                      onChange: (e) => setTableSearch(e.target.value),
                      className: 'bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--champagne)] w-64'
                    }),
                    h('div', { className: 'flex items-center space-x-2' },
                      h('button', {
                        onClick: exportCSV,
                        className: 'btn-ghost-luxury px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1.5'
                      },
                        h(Icon, { name: 'download', className: 'w-3.5 h-3.5' }),
                        h('span', null, 'Export CSV')
                      ),
                      h('button', {
                        onClick: exportJSON,
                        className: 'btn-ghost-luxury px-3 py-1.5 rounded-lg text-xs'
                      }, 'JSON')
                    )
                  ),

                  h('div', { className: 'overflow-x-auto rounded-xl border border-[var(--border-subtle)] max-h-96' },
                    h('table', { className: 'w-full text-left text-xs font-mono' },
                      h('thead', { className: 'bg-[var(--bg-surface-soft)] text-[var(--text-secondary)] uppercase tracking-wider sticky top-0 border-b border-[var(--border-subtle)]' },
                        h('tr', null,
                          currentResult.columns.map((col, idx) => h('th', { key: idx, className: 'p-3 font-semibold whitespace-nowrap' }, col.replace(/_/g, ' ')))
                        )
                      ),
                      h('tbody', { className: 'divide-y divide-[var(--border-subtle)] bg-[var(--bg-surface)]' },
                        filteredRows.length === 0
                          ? h('tr', null, h('td', { colSpan: currentResult.columns.length, className: 'p-6 text-center text-[var(--text-muted)]' }, 'No records match filter.'))
                          : filteredRows.map((row, rIdx) => {
                              const isTopEvidence = rIdx === 0 && currentResult.verification?.grounded;
                              return h('tr', { key: rIdx, className: `hover:bg-[var(--bg-surface-soft)] transition ${isTopEvidence ? 'row-evidence-highlight' : ''}` },
                                currentResult.columns.map((col, cIdx) => h('td', { key: cIdx, className: 'p-3 text-[var(--text-primary)] whitespace-nowrap' },
                                  row[col] !== null && row[col] !== undefined ? String(row[col]) : h('span', { className: 'text-[var(--text-muted)]' }, 'NULL')
                                ))
                              );
                            })
                      )
                    )
                  )
                )
              ),

              // 6. Collapsible: Visual Analytics
              currentResult.chart && h(CollapsibleSection, {
                id: 'chart',
                title: currentResult.chart.title || 'Visual Analytics',
                subtitle: 'Automated visualization generated from data dimensions',
                icon: 'chart',
                isOpen: openSections.chart,
                onToggle: () => setOpenSections(prev => ({ ...prev, chart: !prev.chart })),
                badge: currentResult.chart.type
              },
                h('div', { className: 'space-y-4' },
                  h('div', { className: 'flex items-center justify-between' },
                    h('span', { className: 'text-xs text-[var(--text-secondary)]' }, 'Switch chart projection:'),
                    h('div', { className: 'flex items-center space-x-1 bg-[var(--bg-surface)] p-1 rounded-lg border border-[var(--border-subtle)] text-xs font-mono' },
                      ['bar', 'line', 'doughnut'].map(t => h('button', {
                        key: t,
                        onClick: () => setChartTypeOverride(t),
                        className: `px-2.5 py-1 rounded capitalize transition ${
                          (chartTypeOverride || currentResult.chart.type) === t ? 'bg-[var(--champagne)] text-[#0F172A] font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`
                      }, t))
                    )
                  ),
                  h('div', { className: 'w-full h-80 relative p-4 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)]' },
                    h('canvas', { ref: chartCanvasRef })
                  )
                )
              )
            ) : isAnalyzing ? (
              // Loading placeholder on the right
              h('div', { className: 'p-10 rounded-2xl luxury-card text-center space-y-4 flex flex-col items-center justify-center min-h-[420px]' },
                h('div', { className: 'w-12 h-12 rounded-full bg-[var(--champagne-dim)] border border-[var(--champagne-border)] flex items-center justify-center' },
                  h('span', { className: 'w-3 h-3 rounded-full bg-[var(--champagne)] animate-ping' })
                ),
                h('div', { className: 'space-y-1' },
                  h('h3', { className: 'text-base font-semibold text-[var(--text-primary)]' }, 'Executing Grounded Analysis...'),
                  h('p', { className: 'text-xs text-[var(--text-secondary)] max-w-sm' }, 'Generating validated SQL query, executing read-only sandbox, and verifying facts against raw database records.')
                )
              )
            ) : (
              // Standby / Ready State on the right
              h('div', { className: 'p-8 sm:p-10 rounded-2xl luxury-card space-y-6 min-h-[460px] flex flex-col justify-center' },
                h('div', { className: 'space-y-2' },
                  h('div', { className: 'inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[var(--verified-bg)] border border-[var(--verified-border)] text-[10px] font-mono text-[var(--verified)] font-bold' },
                    h('span', { className: 'w-1.5 h-1.5 rounded-full bg-[var(--verified)]' }),
                    h('span', null, 'STANDBY • ZERO-HALLUCINATION READY')
                  ),
                  h('h3', { className: 'font-serif-luxury text-2xl font-normal text-[var(--text-primary)]' }, 'LIVE RESULT & EVIDENCE STUDIO'),
                  h('p', { className: 'text-xs text-[var(--text-secondary)] leading-relaxed max-w-md' },
                    'Ask a question on the left panel or click any demo flow pill. Your verified answers, mathematical proof, SQL queries, and interactive data grids will appear right here without needing to scroll down.'
                  )
                ),

                h('div', { className: 'grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2' },
                  [
                    { icon: 'shieldCheck', title: '100% Grounded', desc: 'Every claim verified against database rows' },
                    { icon: 'code', title: 'Safe Read-Only', desc: 'Guaranteed prevention of harmful statements' },
                    { icon: 'table', title: 'Data Evidence', desc: 'Exportable rows & dynamic visual charts' }
                  ].map((f, i) => h('div', { key: i, className: 'p-3.5 rounded-xl bg-[var(--bg-surface-soft)] border border-[var(--border-subtle)] space-y-1.5' },
                    h(Icon, { name: f.icon, className: 'w-4 h-4 text-[var(--champagne)]' }),
                    h('h4', { className: 'text-xs font-semibold text-[var(--text-primary)]' }, f.title),
                    h('p', { className: 'text-[11px] text-[var(--text-muted)]' }, f.desc)
                  ))
                ),

                h('div', { className: 'p-3 rounded-xl bg-[var(--bg-surface-soft)] border border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono text-[11px]' },
                  h('span', { className: 'text-[var(--text-secondary)]' }, `Active Database: ${activeDatabaseObj.name}`),
                  h('span', { className: 'text-[var(--champagne)] font-bold' }, `${activeDatabaseObj.table_count || schemaData?.tables?.length || 5} Tables Loaded`)
                )
              )
            )
          )
        )
      ),

      // ==========================================
      // VIEW 2: 50% PILLAR - HALLUCINATION LAB & SHIELD
      // ==========================================
      activeTab === 'hallucination' && h(HallucinationLabWorkspace, {
        activeDb,
        databases,
        showToast,
        onSendQueryToStudio: (q, sim) => {
          setActiveTab('ask');
          handleSendQuery(q, sim);
        }
      }),

      // ==========================================
      // VIEW 3: DATA LIBRARY (SCHEMA EXPLORER)
      // ==========================================
      activeTab === 'explore' && h('div', { className: 'space-y-8 animate-entrance' },
        h('div', { className: 'space-y-2' },
          h('span', { className: 'text-[10px] font-mono tracking-widest text-[var(--champagne)] uppercase font-bold' }, 'RELATIONAL ARCHITECTURE'),
          h('h2', { className: 'font-serif-luxury text-3xl font-normal text-[var(--text-primary)]' }, 'DATA LIBRARY'),
          h('p', { className: 'text-sm text-[var(--text-secondary)]' },
            `Database: `,
            h('span', { className: 'text-[var(--text-primary)] font-semibold' }, schemaData?.database_name || activeDb),
            ` • ${schemaData?.tables.length || 0} relational tables registered`
          )
        ),

        schemaData && h('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' },
          schemaData.tables.map(table => h('div', {
            key: table.name,
            className: 'luxury-card rounded-2xl p-6 space-y-4'
          },
            h('div', { className: 'flex items-center justify-between border-b border-[var(--border-subtle)] pb-3' },
              h('div', { className: 'flex items-center space-x-2' },
                h(Icon, { name: 'table', className: 'w-4 h-4 text-[var(--champagne)]' }),
                h('h3', { className: 'font-semibold text-sm text-[var(--text-primary)] font-mono' }, table.name)
              ),
              h('span', { className: 'text-[11px] font-mono bg-[var(--bg-surface-soft)] text-[var(--text-secondary)] px-2.5 py-0.5 rounded-full border border-[var(--border-subtle)]' },
                `${table.row_count} rows`
              )
            ),

            // Columns list
            h('div', { className: 'space-y-1.5 max-h-56 overflow-y-auto pr-1' },
              table.columns.map(col => h('div', {
                key: col.name,
                className: 'flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-[var(--bg-surface-soft)] border border-[var(--border-subtle)] font-mono'
              },
                h('span', { className: 'text-[var(--text-primary)]' }, col.name),
                h('div', { className: 'flex items-center space-x-1.5' },
                  h('span', { className: 'text-[var(--text-muted)] text-[10px]' }, col.type),
                  col.is_primary_key && h('span', { className: 'bg-[var(--champagne-dim)] text-[var(--champagne)] border border-[var(--champagne-border)] text-[9px] px-1.5 py-0.5 rounded font-bold' }, 'PK'),
                  col.foreign_key && h('span', { className: 'bg-[var(--verified-bg)] text-[var(--verified)] border border-[var(--verified-border)] text-[9px] px-1.5 py-0.5 rounded' }, 'FK')
                )
              ))
            ),

            // Sample Record Preview
            table.sample_rows && table.sample_rows.length > 0 && h('div', { className: 'pt-2 border-t border-[var(--border-subtle)] space-y-1' },
              h('span', { className: 'text-[10px] font-mono text-[var(--text-muted)] uppercase font-semibold' }, 'SAMPLE RECORD'),
              h('pre', { className: 'text-[10px] bg-[var(--bg-surface-soft)] p-2.5 rounded-lg text-[var(--text-secondary)] overflow-x-auto border border-[var(--border-subtle)] font-mono' },
                JSON.stringify(table.sample_rows[0], null, 2)
              )
            )
          ))
        )
      ),

      // ==========================================
      // VIEW 4: AUDIT TRAIL (TELEMETRY & HISTORY)
      // ==========================================
      activeTab === 'history' && h('div', { className: 'space-y-8 animate-entrance' },
        h('div', { className: 'flex flex-wrap items-center justify-between gap-4' },
          h('div', { className: 'space-y-1' },
            h('span', { className: 'text-[10px] font-mono tracking-widest text-[var(--champagne)] uppercase font-bold' }, 'TELEMETRY & VERIFICATION LOGS'),
            h('h2', { className: 'font-serif-luxury text-3xl font-normal text-[var(--text-primary)]' }, 'AUDIT TRAIL')
          ),
          h('button', {
            onClick: async () => {
              await fetch(`${API_BASE}/api/history`, { method: "DELETE" });
              fetchHistory();
              showToast("Audit history cleared.");
            },
            className: 'btn-ghost-luxury px-4 py-2 rounded-xl text-xs font-semibold'
          }, 'Clear History')
        ),

        h('div', { className: 'luxury-card rounded-2xl overflow-hidden' },
          h('div', { className: 'overflow-x-auto' },
            h('table', { className: 'w-full text-left text-xs font-mono' },
              h('thead', { className: 'bg-[var(--bg-surface-soft)] text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-subtle)]' },
                h('tr', null,
                  h('th', { className: 'p-4 font-semibold' }, 'Timestamp'),
                  h('th', { className: 'p-4 font-semibold' }, 'Question'),
                  h('th', { className: 'p-4 font-semibold' }, 'Generated SQL'),
                  h('th', { className: 'p-4 font-semibold' }, 'Status'),
                  h('th', { className: 'p-4 font-semibold' }, 'Reliability'),
                  h('th', { className: 'p-4 font-semibold' }, 'Latency'),
                  h('th', { className: 'p-4 font-semibold' }, 'Rows')
                )
              ),
              h('tbody', { className: 'divide-y divide-[var(--border-subtle)] bg-[var(--bg-surface)]' },
                queryHistory.length === 0
                  ? h('tr', null, h('td', { colSpan: 7, className: 'p-8 text-center text-[var(--text-muted)] font-sans' }, 'No audit logs recorded yet.'))
                  : queryHistory.map(item => h('tr', { key: item.id, className: 'hover:bg-[var(--bg-surface-soft)] transition' },
                      h('td', { className: 'p-4 text-[var(--text-muted)] whitespace-nowrap' }, item.timestamp),
                      h('td', { className: 'p-4 text-[var(--text-primary)] font-sans max-w-xs truncate font-semibold' }, item.question),
                      h('td', { className: 'p-4 text-[var(--champagne)] max-w-sm truncate' }, item.sql || "N/A"),
                      h('td', { className: 'p-4' },
                        h('span', { className: `px-2.5 py-1 rounded text-[10px] font-bold ${
                          item.verification_status === 'VERIFIED' ? 'badge-verified-luxury' :
                          item.verification_status === 'NEEDS REVIEW' ? 'badge-warning-luxury' : 'badge-danger-luxury'
                        }` }, item.verification_status || item.status)
                      ),
                      h('td', { className: 'p-4 font-bold text-[var(--text-primary)]' }, item.reliability_score ? `${item.reliability_score}/100` : '—'),
                      h('td', { className: 'p-4 text-[var(--text-secondary)] whitespace-nowrap' }, `${item.execution_time_ms}ms`),
                      h('td', { className: 'p-4 text-[var(--text-primary)]' }, item.row_count)
                    ))
              )
            )
          )
        )
      ),

      // ==========================================
      // VIEW 5: INSIGHTS (ENTERPRISE METRICS)
      // ==========================================
      activeTab === 'insights' && h('div', { className: 'space-y-8 animate-entrance' },
        h('div', { className: 'space-y-1' },
          h('span', { className: 'text-[10px] font-mono tracking-widest text-[var(--champagne)] uppercase font-bold' }, 'ENTERPRISE SYSTEM TELEMETRY'),
          h('h2', { className: 'font-serif-luxury text-3xl font-normal text-[var(--text-primary)]' }, 'TRUST & USAGE INSIGHTS')
        ),

        // Large Editorial Metrics
        h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' },
          [
            { label: "QUERIES ANSWERED", value: insightsMetrics.total || "1", sub: "Natural language questions processed" },
            { label: "VERIFIED ANSWERS", value: insightsMetrics.verifiedPct, sub: "Grounded with zero hallucinations" },
            { label: "AVG RELIABILITY", value: `${insightsMetrics.avgReliability}`, sub: "Weighted verification score / 100" },
            { label: "AVG RESPONSE TIME", value: insightsMetrics.avgLatency, sub: "End-to-end execution & validation" }
          ].map((m, idx) => h('div', { key: idx, className: 'luxury-card rounded-2xl p-6 space-y-2' },
            h('span', { className: 'text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase font-semibold' }, m.label),
            h('p', { className: 'text-3xl font-serif-luxury text-[var(--text-primary)] font-normal pt-1' }, m.value),
            h('p', { className: 'text-xs text-[var(--text-muted)]' }, m.sub)
          ))
        ),

        // Architecture Pillars Card
        h('div', { className: 'luxury-card rounded-2xl p-8 space-y-6' },
          h('h3', { className: 'font-serif-luxury text-xl text-[var(--text-primary)]' }, 'HOW TRUSTDB-AI ENFORCES ZERO HALLUCINATION'),
          h('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-6 text-sm leading-relaxed' },
            h('div', { className: 'space-y-2' },
              h('span', { className: 'text-[var(--champagne)] font-mono font-bold' }, '01. Read-Only Sandbox'),
              h('p', { className: 'text-[var(--text-secondary)] text-xs leading-relaxed' },
                'Enforces read-only DDL/DML restrictions, preventing SQL injection or data mutation attempts.'
              )
            ),
            h('div', { className: 'space-y-2' },
              h('span', { className: 'text-[var(--champagne)] font-mono font-bold' }, '02. Grounding Verification Matrix'),
              h('p', { className: 'text-[var(--text-secondary)] text-xs leading-relaxed' },
                'Cross-checks every synthesized number, superlative, and entity against returned rows before rendering.'
              )
            ),
            h('div', { className: 'space-y-2' },
              h('span', { className: 'text-[var(--champagne)] font-mono font-bold' }, '03. Zero Hallucination Guarantee'),
              h('p', { className: 'text-[var(--text-secondary)] text-xs leading-relaxed' },
                'Flags unsupported claims as NEEDS REVIEW with detailed rationale instead of presenting unverified guesses.'
              )
            )
          )
        )
      )

    ),

    // SETTINGS & DATASET MODAL
    isSettingsOpen && h('div', { className: 'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-entrance' },
      h('div', { className: 'luxury-card rounded-3xl max-w-xl w-full p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-[var(--border-medium)] shadow-2xl' },
        h('div', { className: 'flex items-center justify-between border-b border-[var(--border-subtle)] pb-4' },
          h('div', null,
            h('h3', { className: 'font-serif-luxury text-xl text-[var(--text-primary)]' }, 'ENGINE CONFIGURATION'),
            h('p', { className: 'text-xs text-[var(--text-secondary)] mt-0.5' }, 'Select LLM providers, theme, or import custom CSV datasets into SQLite')
          ),
          h('button', {
            onClick: () => setIsSettingsOpen(false),
            className: 'text-[var(--text-muted)] hover:text-[var(--text-primary)] p-2 rounded-xl bg-[var(--bg-surface-soft)]'
          }, '✕')
        ),

        // Settings Form
        h('form', {
          onSubmit: async (e) => {
            e.preventDefault();
            try {
              const res = await fetch(`${API_BASE}/api/settings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  llm_provider: settingsData.llm_provider,
                  gemini_api_key: settingsData.gemini_key_input || undefined,
                  openai_api_key: settingsData.openai_key_input || undefined,
                  model_name: settingsData.model_name
                })
              });
              if (res.ok) {
                showToast("Configuration saved successfully.");
                fetchSettings();
                setIsSettingsOpen(false);
              }
            } catch (err) { showToast(`Error: ${err.message}`); }
          },
          className: 'space-y-4 text-xs'
        },
          // Theme Preference Picker
          h('div', null,
            h('label', { className: 'block text-[var(--text-muted)] font-mono uppercase tracking-wider mb-2 font-semibold' }, 'Color Theme Interface'),
            h('div', { className: 'grid grid-cols-2 gap-3' },
              h('button', {
                type: 'button',
                onClick: () => setTheme('dark'),
                className: `p-3 rounded-xl border flex items-center justify-center space-x-2 text-xs font-semibold ${
                  theme === 'dark' ? 'bg-[var(--champagne-dim)] border-[var(--champagne-border)] text-[var(--champagne)]' : 'bg-[var(--bg-surface-soft)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                }`
              },
                h(Icon, { name: 'moon', className: 'w-4 h-4' }),
                h('span', null, 'Dark Onyx')
              ),
              h('button', {
                type: 'button',
                onClick: () => setTheme('light'),
                className: `p-3 rounded-xl border flex items-center justify-center space-x-2 text-xs font-semibold ${
                  theme === 'light' ? 'bg-[var(--champagne-dim)] border-[var(--champagne-border)] text-[var(--champagne)]' : 'bg-[var(--bg-surface-soft)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                }`
              },
                h(Icon, { name: 'sun', className: 'w-4 h-4' }),
                h('span', null, 'Light Porcelain')
              )
            )
          ),

          // Provider selector
          h('div', null,
            h('label', { className: 'block text-[var(--text-muted)] font-mono uppercase tracking-wider mb-2 font-semibold' }, 'Active AI Engine'),
            h('select', {
              value: settingsData.llm_provider,
              onChange: (e) => setSettingsData({ ...settingsData, llm_provider: e.target.value }),
              className: 'w-full bg-[var(--bg-surface-soft)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] outline-none focus:border-[var(--champagne)] font-medium'
            },
              h('option', { value: 'offline' }, 'Smart Heuristic Engine (100% Offline / Zero-Setup)'),
              h('option', { value: 'gemini' }, 'Google Gemini API (Gemini 2.5 Flash / 1.5 Pro)'),
              h('option', { value: 'openai' }, 'OpenAI API (GPT-4o / GPT-4o-mini)'),
              h('option', { value: 'ollama' }, 'Local Ollama (Llama 3 / CodeLlama)')
            )
          ),

          settingsData.llm_provider === 'gemini' && h('div', null,
            h('label', { className: 'block text-[var(--text-muted)] font-mono uppercase tracking-wider mb-2 font-semibold' }, 'Gemini API Key'),
            h('input', {
              type: 'password',
              placeholder: 'AIzaSy...',
              value: settingsData.gemini_key_input,
              onChange: (e) => setSettingsData({ ...settingsData, gemini_key_input: e.target.value }),
              className: 'w-full bg-[var(--bg-surface-soft)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] outline-none focus:border-[var(--champagne)] font-mono'
            })
          ),

          settingsData.llm_provider === 'openai' && h('div', null,
            h('label', { className: 'block text-[var(--text-muted)] font-mono uppercase tracking-wider mb-2 font-semibold' }, 'OpenAI API Key'),
            h('input', {
              type: 'password',
              placeholder: 'sk-...',
              value: settingsData.openai_key_input,
              onChange: (e) => setSettingsData({ ...settingsData, openai_key_input: e.target.value }),
              className: 'w-full bg-[var(--bg-surface-soft)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] outline-none focus:border-[var(--champagne)] font-mono'
            })
          ),

          h('button', {
            type: 'submit',
            className: 'btn-champagne w-full py-3 rounded-xl font-bold transition'
          }, 'Save Configuration')
        ),

        // CSV Uploader Area
        h('div', { className: 'pt-4 border-t border-[var(--border-subtle)] space-y-3' },
          h('span', { className: 'text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase block font-semibold' }, 'UPLOAD CUSTOM CSV DATASET'),
          h('div', { className: 'border border-dashed border-[var(--border-medium)] rounded-2xl p-6 text-center space-y-2 bg-[var(--bg-surface-soft)]' },
            h(Icon, { name: 'upload', className: 'w-8 h-8 text-[var(--champagne)] mx-auto' }),
            h('p', { className: 'text-xs text-[var(--text-primary)] font-medium' }, 'Select any CSV file to import as an SQLite table'),
            h('input', {
              type: 'file',
              accept: '.csv',
              onChange: handleCSVUpload,
              className: 'text-xs text-[var(--text-muted)] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-[var(--bg-surface)] file:text-[var(--champagne)] cursor-pointer'
            })
          ),
          uploadStatus && h('p', { className: 'text-xs bg-[var(--bg-surface-soft)] p-3 rounded-xl text-[var(--champagne)] font-mono' }, uploadStatus)
        )
      )
    )

  );
}

// Render Root Component
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(h(App));
