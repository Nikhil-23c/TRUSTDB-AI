/**
 * NEURA-X: TRUSTED AI DATABASE ASSISTANT
 * PS7: Natural-Language Database Question Answering (100% Offline)
 * PS2: Hallucination Detection & Reliability Scoring
 *
 * Architecture: ASK → PROTECT → QUERY → VERIFY → TRUST
 */

const { useState, useEffect, useRef, useMemo, useCallback, createElement: h } = React;

const API_BASE = "";

// =============================================================================
// ICON LIBRARY
// =============================================================================
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
    trophy: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('path', { d: 'M6 9H4.5a2.5 2.5 0 0 1 0-5H6', strokeWidth: 1.5 }),
      h('path', { d: 'M18 9h1.5a2.5 2.5 0 0 0 0-5H18', strokeWidth: 1.5 }),
      h('path', { d: 'M4 22h16', strokeWidth: 1.5 }),
      h('path', { d: 'M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34', strokeWidth: 1.5 }),
      h('path', { d: 'M18 4H6v7a6 6 0 0 0 12 0V4Z', strokeWidth: 1.5 })
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
    chevronLeft: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('polyline', { points: '15 18 9 12 15 6', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' })
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
    checkCircle: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      h('polyline', { points: '22 4 12 14.01 9 11.01', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' })
    ),
    xCircle: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('circle', { cx: 12, cy: 12, r: 10, strokeWidth: 1.5 }),
      h('line', { x1: 15, y1: 9, x2: 9, y2: 15, strokeWidth: 1.5, strokeLinecap: 'round' }),
      h('line', { x1: 9, y1: 9, x2: 15, y2: 15, strokeWidth: 1.5, strokeLinecap: 'round' })
    ),
    arrowUpRight: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('line', { x1: 7, y1: 17, x2: 17, y2: 7, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      h('polyline', { points: '7 7 17 7 17 17', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' })
    ),
    search: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('circle', { cx: 11, cy: 11, r: 8, strokeWidth: 1.5 }),
      h('path', { d: 'm21 21-4.35-4.35', strokeWidth: 1.5, strokeLinecap: 'round' })
    ),
    alertTriangle: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('path', { d: 'm10.29 3.86-8.37 14.5A2 2 0 0 0 3.63 21H20.37a2 2 0 0 0 1.71-3.02l-8.37-14.5a2 2 0 0 0-3.42.38z', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      h('line', { x1: 12, y1: 9, x2: 12, y2: 13, strokeWidth: 1.5, strokeLinecap: 'round' }),
      h('line', { x1: 12, y1: 17, x2: 12.01, y2: 17, strokeWidth: 2, strokeLinecap: 'round' })
    ),
    flask: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('path', { d: 'M10 2v7.31l-3.7 5.39A4 4 0 0 0 9.53 21h4.94a4 4 0 0 0 3.23-6.3L14 9.31V2', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      h('line', { x1: 8.5, y1: 2, x2: 15.5, y2: 2, strokeWidth: 1.5, strokeLinecap: 'round' })
    ),
    upload: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', strokeWidth: 1.5, strokeLinecap: 'round' }),
      h('polyline', { points: '17 8 12 3 7 8', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      h('line', { x1: 12, x2: 12, y1: 3, y2: 15, strokeWidth: 1.5, strokeLinecap: 'round' })
    ),
  };
  return icons[name] || h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    h('circle', { cx: 12, cy: 12, r: 10, strokeWidth: 1.5 })
  );
}

// =============================================================================
// CONSTANTS
// =============================================================================
const DEMO_QUESTIONS = [
  { label: "Section A Tutor", query: "Who is the tutor of section A?" },
  { label: "Dept Count", query: "How many students are in the AI department?" },
  { label: "0-Row Guard", query: "Show students with attendance above 100%." },
  { label: "Highest Attendance", query: "Who has the highest attendance?" },
  { label: "Tutors Initial A", query: "List the tutors who have names starting with A." },
];

const CURATED_PROMPTS = {
  college_records: [
    "Who is the tutor of section A?",
    "How many students are in the AI department?",
    "Show students with attendance above 100%.",
    "Who has the highest attendance?",
    "List the tutors who have names starting with A.",
  ],
  ecommerce_store: [
    "List all customers in alphabetical order",
    "What are the top 5 most expensive products?",
    "Total orders and revenue by order status",
    "Customer count by membership tier",
  ],
  healthcare: [
    "List all doctors in alphabetical order",
    "List doctors ordered by experience years",
    "Show patient count by blood group",
    "Total billing amount by payment status",
  ],
};

const PAGE_SIZE = 20;

// =============================================================================
// MARKDOWN RENDERER (lightweight)
// =============================================================================
function MarkdownEditorial({ text }) {
  if (!text) return null;
  const lines = text.split('\n');
  return h('div', { className: 'space-y-1.5 text-[var(--text-primary)] font-normal leading-relaxed' },
    lines.map((line, lIdx) => {
      if (!line.trim()) return h('div', { key: lIdx, className: 'h-1' });
      const elements = [];
      let remaining = line;
      let key = 0;
      while (remaining.length > 0) {
        const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
        const codeMatch = remaining.match(/`(.*?)`/);
        let firstMatch = null;
        let matchType = null;
        if (boldMatch && (!codeMatch || boldMatch.index < codeMatch.index)) {
          firstMatch = boldMatch; matchType = 'bold';
        } else if (codeMatch) {
          firstMatch = codeMatch; matchType = 'code';
        }
        if (firstMatch) {
          const before = remaining.slice(0, firstMatch.index);
          if (before) elements.push(h('span', { key: key++ }, before));
          if (matchType === 'bold') elements.push(h('strong', { key: key++, className: 'font-semibold text-[var(--text-primary)]' }, firstMatch[1]));
          else if (matchType === 'code') elements.push(h('code', { key: key++, className: 'bg-[var(--bg-surface-soft)] px-1.5 py-0.5 rounded text-[var(--champagne)] font-mono text-xs border border-[var(--border-subtle)]' }, firstMatch[1]));
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

// =============================================================================
// VERIFICATION BADGE — compact, single instance
// =============================================================================
function VerificationBadge({ verification }) {
  if (!verification) return null;
  const { status, reliability_score, reason, grounded } = verification;

  let badgeClass = 'badge-verified-luxury';
  let icon = 'shieldCheck';
  if (status === 'MOSTLY VERIFIED') { badgeClass = 'badge-mostly-verified-luxury'; icon = 'shieldCheck'; }
  else if (status === 'NEEDS REVIEW') { badgeClass = 'badge-warning-luxury'; icon = 'alertTriangle'; }
  else if (status === 'UNVERIFIED') { badgeClass = 'badge-danger-luxury'; icon = 'shieldAlert'; }

  const scoreColor = reliability_score >= 90
    ? 'text-[var(--verified)]'
    : reliability_score >= 70
    ? 'text-[var(--champagne)]'
    : 'text-[var(--danger)]';

  return h('div', { className: 'space-y-2' },
    h('div', { className: 'flex flex-wrap items-center gap-2' },
      h('div', { className: `inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${badgeClass}` },
        h(Icon, { name: icon, className: 'w-3.5 h-3.5' }),
        h('span', null, status)
      ),
      h('div', { className: 'flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface-soft)] border border-[var(--border-subtle)]' },
        h('span', { className: 'text-[10px] font-mono text-[var(--text-muted)] uppercase font-semibold' }, 'Reliability'),
        h('span', { className: `text-sm font-bold font-mono ${scoreColor}` }, `${reliability_score}`),
        h('span', { className: 'text-[10px] text-[var(--text-muted)] font-mono' }, '/100')
      ),
      h('div', { className: 'flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[var(--verified-bg)] border border-[var(--verified-border)]' },
        h('span', { className: 'w-1.5 h-1.5 rounded-full bg-[var(--verified)]' }),
        h('span', { className: 'text-[10px] font-mono font-bold text-[var(--verified)] uppercase' }, 'READ-ONLY SAFE')
      )
    ),
    reason && h('p', { className: 'text-xs text-[var(--text-secondary)] leading-relaxed pl-1' }, reason)
  );
}

// =============================================================================
// DATA TABLE — bordered, sticky header, paginated, searchable
// =============================================================================
function DataTable({ columns, rows, highlightFirst = false }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Reset page when rows/search change
  useEffect(() => { setPage(1); }, [rows, search]);

  const filtered = useMemo(() => {
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter(row =>
      Object.values(row).some(v => String(v ?? '').toLowerCase().includes(q))
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return h('div', { className: 'space-y-2' },

    // Search + meta row
    h('div', { className: 'flex flex-wrap items-center justify-between gap-2' },
      h('div', { className: 'relative' },
        h('div', { className: 'absolute inset-y-0 left-2.5 flex items-center pointer-events-none' },
          h(Icon, { name: 'search', className: 'w-3.5 h-3.5 text-[var(--text-muted)]' })
        ),
        h('input', {
          id: 'table-search',
          type: 'text',
          placeholder: 'Search records...',
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: 'pl-7 pr-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--champagne)] w-44 sm:w-56 font-medium transition'
        })
      ),
      h('span', { className: 'text-[11px] font-mono text-[var(--text-muted)]' },
        search
          ? `${filtered.length} of ${rows.length} rows`
          : `${rows.length} row${rows.length !== 1 ? 's' : ''}`
      )
    ),

    // Table container
    h('div', { className: 'rounded-xl border border-[var(--border-medium)] overflow-hidden shadow-inner' },
      h('div', { className: 'overflow-x-auto overflow-y-auto', style: { maxHeight: '280px' } },
        h('table', { className: 'w-full text-left text-xs font-mono border-collapse' },
          h('thead', null,
            h('tr', { className: 'bg-[var(--bg-surface-soft)] border-b border-[var(--border-medium)] sticky top-0 z-10' },
              columns.map((col, idx) =>
                h('th', {
                  key: idx,
                  className: 'px-3 py-2.5 font-semibold text-[var(--text-secondary)] uppercase tracking-wider whitespace-nowrap text-[10px]',
                  style: { borderRight: idx < columns.length - 1 ? '1px solid var(--border-subtle)' : 'none' }
                }, col.replace(/_/g, ' '))
              )
            )
          ),
          h('tbody', { className: 'bg-[var(--bg-surface)] divide-y divide-[var(--border-subtle)]' },
            paged.length === 0
              ? h('tr', null,
                  h('td', { colSpan: columns.length, className: 'px-3 py-8 text-center text-[var(--text-muted)] font-sans' },
                    search ? 'No records match your search.' : 'No data returned.'
                  )
                )
              : paged.map((row, rIdx) => {
                  const isFirst = rIdx === 0 && (page === 1) && highlightFirst;
                  return h('tr', {
                    key: rIdx,
                    className: `hover:bg-[var(--bg-surface-soft)] transition-colors ${isFirst ? 'row-evidence-highlight' : ''}`
                  },
                    columns.map((col, cIdx) =>
                      h('td', {
                        key: cIdx,
                        className: 'px-3 py-2.5 text-[var(--text-primary)] whitespace-nowrap font-medium',
                        style: { borderRight: cIdx < columns.length - 1 ? '1px solid var(--border-subtle)' : 'none' }
                      },
                        row[col] !== null && row[col] !== undefined
                          ? String(row[col])
                          : h('span', { className: 'text-[var(--text-muted)] italic' }, 'NULL')
                      )
                    )
                  );
                })
          )
        )
      )
    ),

    // Pagination
    totalPages > 1 && h('div', { className: 'flex items-center justify-between pt-1' },
      h('button', {
        onClick: () => setPage(p => Math.max(1, p - 1)),
        disabled: page === 1,
        className: 'flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold btn-ghost-luxury disabled:opacity-40 disabled:cursor-not-allowed'
      },
        h(Icon, { name: 'chevronLeft', className: 'w-3.5 h-3.5' }),
        h('span', null, 'Prev')
      ),
      h('div', { className: 'flex items-center space-x-1' },
        Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pg = i + 1;
          if (totalPages > 5) {
            if (page <= 3) pg = i + 1;
            else if (page >= totalPages - 2) pg = totalPages - 4 + i;
            else pg = page - 2 + i;
          }
          return h('button', {
            key: pg,
            onClick: () => setPage(pg),
            className: `w-7 h-7 rounded text-xs font-mono font-semibold transition ${
              page === pg
                ? 'bg-[var(--champagne)] text-[#0F172A]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface-soft)]'
            }`
          }, pg);
        })
      ),
      h('button', {
        onClick: () => setPage(p => Math.min(totalPages, p + 1)),
        disabled: page === totalPages,
        className: 'flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold btn-ghost-luxury disabled:opacity-40 disabled:cursor-not-allowed'
      },
        h('span', null, 'Next'),
        h(Icon, { name: 'chevronRight', className: 'w-3.5 h-3.5' })
      )
    )
  );
}

// =============================================================================
// TRUST PIPELINE — compact collapsible
// =============================================================================
function TrustPipelineDrawer({ trustPipeline, isOpen, onToggle }) {
  if (!trustPipeline || trustPipeline.length === 0) return null;
  const allPassed = trustPipeline.every(s => s.status !== 'ERROR' && s.status !== 'FAILED');
  return h('div', { className: 'rounded-xl border border-[var(--border-subtle)] overflow-hidden' },
    h('button', {
      onClick: onToggle,
      className: 'w-full px-4 py-2.5 flex items-center justify-between bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-soft)] transition text-left'
    },
      h('div', { className: 'flex items-center space-x-2' },
        h(Icon, { name: 'shieldCheck', className: 'w-3.5 h-3.5 text-[var(--champagne)]' }),
        h('span', { className: 'text-xs font-semibold text-[var(--text-primary)]' }, 'Trust Pipeline'),
        h('span', { className: `text-[10px] font-mono px-2 py-0.5 rounded font-bold ${allPassed ? 'text-[var(--verified)] bg-[var(--verified-bg)]' : 'text-[var(--warning)] bg-[var(--warning-bg)]'}` },
          `${trustPipeline.length} checks`
        )
      ),
      h(Icon, { name: isOpen ? 'chevronDown' : 'chevronRight', className: 'w-3.5 h-3.5 text-[var(--text-muted)]' })
    ),
    isOpen && h('div', { className: 'px-4 py-3 bg-[var(--bg-surface-soft)] border-t border-[var(--border-subtle)] space-y-1.5' },
      trustPipeline.map((step, i) => {
        const ok = step.status !== 'ERROR' && step.status !== 'FAILED' && step.status !== 'BLOCKED';
        return h('div', { key: i, className: 'flex items-start space-x-2.5 text-xs' },
          h('div', { className: `mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold ${ok ? 'bg-[var(--verified-bg)] text-[var(--verified)]' : 'bg-[var(--danger-bg)] text-[var(--danger)]'}` },
            ok ? '✓' : '!'
          ),
          h('div', { className: 'flex-1 min-w-0' },
            h('div', { className: 'flex items-center space-x-2' },
              h('span', { className: 'font-semibold text-[var(--text-primary)]' }, step.name),
              h('span', { className: `text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${ok ? 'text-[var(--verified)]' : 'text-[var(--danger)]'}` }, step.status)
            ),
            h('p', { className: 'text-[var(--text-muted)] text-[11px] leading-relaxed truncate' }, step.description)
          )
        );
      })
    )
  );
}

// =============================================================================
// SQL DRAWER — collapsible
// =============================================================================
function SQLDrawer({ sql, intent, executionTimeMs, isOpen, onToggle, showToast }) {
  if (!sql) return null;
  return h('div', { className: 'rounded-xl border border-[var(--border-subtle)] overflow-hidden' },
    h('button', {
      onClick: onToggle,
      className: 'w-full px-4 py-2.5 flex items-center justify-between bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-soft)] transition text-left'
    },
      h('div', { className: 'flex items-center space-x-2' },
        h(Icon, { name: 'code', className: 'w-3.5 h-3.5 text-[var(--champagne)]' }),
        h('span', { className: 'text-xs font-semibold text-[var(--text-primary)]' }, 'Generated SQL'),
        h('span', { className: 'text-[10px] font-mono text-[var(--text-muted)]' }, `${executionTimeMs}ms`)
      ),
      h(Icon, { name: isOpen ? 'chevronDown' : 'chevronRight', className: 'w-3.5 h-3.5 text-[var(--text-muted)]' })
    ),
    isOpen && h('div', { className: 'px-4 py-3 bg-[var(--bg-surface-soft)] border-t border-[var(--border-subtle)] space-y-3' },
      h('div', { className: 'flex items-center justify-between' },
        h('span', { className: 'text-[10px] font-mono text-[var(--text-muted)] uppercase font-semibold' }, `Intent: ${intent || 'Data Retrieval'}`),
        h('button', {
          onClick: () => { navigator.clipboard.writeText(sql); showToast('SQL copied.'); },
          className: 'flex items-center space-x-1.5 text-[10px] font-mono text-[var(--champagne)] hover:underline'
        },
          h(Icon, { name: 'copy', className: 'w-3 h-3' }),
          h('span', null, 'Copy')
        )
      ),
      h('pre', { className: 'sql-luxury-box p-3.5 text-xs font-mono overflow-x-auto leading-relaxed text-[var(--champagne)] rounded-xl' }, sql)
    )
  );
}

// =============================================================================
// VERIFICATION CLAIMS DRAWER — collapsible PS2 detail
// =============================================================================
function VerificationDetailDrawer({ verification, isOpen, onToggle }) {
  if (!verification) return null;
  const { claims_breakdown, checks, evidence, hallucination_risk_pct, hallucination_risk_level } = verification;
  const hasClaims = claims_breakdown && claims_breakdown.length > 0;
  const hasChecks = checks && Object.keys(checks).length > 0;
  const hasEvidence = evidence && evidence.length > 0;

  return h('div', { className: 'rounded-xl border border-[var(--border-subtle)] overflow-hidden' },
    h('button', {
      onClick: onToggle,
      className: 'w-full px-4 py-2.5 flex items-center justify-between bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-soft)] transition text-left'
    },
      h('div', { className: 'flex items-center space-x-2' },
        h(Icon, { name: 'shieldZap', className: 'w-3.5 h-3.5 text-[var(--champagne)]' }),
        h('span', { className: 'text-xs font-semibold text-[var(--text-primary)]' }, 'Verification Detail'),
        hallucination_risk_pct !== undefined && h('span', {
          className: `text-[10px] font-mono px-2 py-0.5 rounded font-bold ${hallucination_risk_pct > 30 ? 'text-[var(--danger)] bg-[var(--danger-bg)]' : 'text-[var(--verified)] bg-[var(--verified-bg)]'}`
        }, `${hallucination_risk_pct}% risk`)
      ),
      h(Icon, { name: isOpen ? 'chevronDown' : 'chevronRight', className: 'w-3.5 h-3.5 text-[var(--text-muted)]' })
    ),
    isOpen && h('div', { className: 'px-4 py-3 bg-[var(--bg-surface-soft)] border-t border-[var(--border-subtle)] space-y-4' },

      // Evidence snippets
      hasEvidence && h('div', { className: 'space-y-2' },
        h('span', { className: 'text-[10px] font-mono text-[var(--text-muted)] uppercase font-semibold' }, 'DB Evidence Snippets'),
        h('div', { className: 'flex flex-wrap gap-1.5' },
          evidence.map((ev, i) =>
            h('div', { key: i, className: 'bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-2.5 py-1.5 rounded-lg text-[11px] font-mono flex items-center space-x-1.5' },
              h('span', { className: 'w-1.5 h-1.5 rounded-full bg-[var(--champagne)] shrink-0' }),
              h('span', { className: 'text-[var(--text-secondary)]' }, ev)
            )
          )
        )
      ),

      // Claims breakdown
      hasClaims && h('div', { className: 'space-y-2' },
        h('span', { className: 'text-[10px] font-mono text-[var(--text-muted)] uppercase font-semibold' }, `Statement Analysis — ${claims_breakdown.length} claims`),
        h('div', { className: 'space-y-1.5' },
          claims_breakdown.map((c, idx) => {
            const ok = c.status === 'GROUNDED';
            return h('div', {
              key: idx,
              className: `p-2.5 rounded-xl border flex items-center justify-between text-xs gap-2 ${ok ? 'bg-[var(--verified-bg)] border-[var(--verified-border)]' : 'bg-[var(--danger-bg)] border-[var(--danger-border)]'}`
            },
              h('div', { className: 'flex items-center space-x-2 min-w-0' },
                h('span', { className: `w-1.5 h-1.5 rounded-full shrink-0 ${ok ? 'bg-[var(--verified)]' : 'bg-[var(--danger)]'}` }),
                h('span', { className: 'font-medium text-[var(--text-primary)] truncate' }, `"${c.claim}"`)
              ),
              h('span', { className: `text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0 ${ok ? 'bg-[var(--verified)] text-white' : 'bg-[var(--danger)] text-white'}` }, c.status)
            );
          })
        )
      ),

      // Sub-checks grid
      hasChecks && h('div', { className: 'space-y-2' },
        h('span', { className: 'text-[10px] font-mono text-[var(--text-muted)] uppercase font-semibold' }, 'Grounding Checks'),
        h('div', { className: 'grid grid-cols-2 gap-2' },
          [
            { key: "numeric_consistency", label: "Numeric Consistency" },
            { key: "entity_consistency", label: "Entity Match" },
            { key: "claim_grounding", label: "Superlative Filter" },
            { key: "aggregate_consistency", label: "Aggregation Check" }
          ].map(chk => {
            const item = checks[chk.key];
            const passed = item ? item.passed : true;
            return h('div', { key: chk.key, className: 'p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between' },
              h('span', { className: 'text-[var(--text-secondary)] text-[10px] font-medium truncate mr-2' }, chk.label),
              h('span', { className: `text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${passed ? 'text-[var(--verified)] bg-[var(--verified-bg)]' : 'text-[var(--danger)] bg-[var(--danger-bg)]'}` },
                passed ? 'PASS' : 'FLAG'
              )
            );
          })
        )
      )
    )
  );
}

// =============================================================================
// RESULT PANEL — the most important component
// =============================================================================
function ResultPanel({ result, activeQuery, exportCSV, exportJSON, showToast, theme }) {
  const [openDrawer, setOpenDrawer] = useState(null); // 'sql' | 'verification' | 'trust'
  const chartCanvasRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [showChart, setShowChart] = useState(false);

  const toggleDrawer = (name) => setOpenDrawer(prev => prev === name ? null : name);

  // Chart rendering
  useEffect(() => {
    if (showChart && result?.chart && chartCanvasRef.current) {
      if (chartInstanceRef.current) chartInstanceRef.current.destroy();
      try {
        const ctx = chartCanvasRef.current.getContext('2d');
        const isDark = theme === 'dark';
        const textColor = isDark ? '#CBD5E1' : '#334155';
        const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
        const cd = { ...result.chart.data };
        if (cd.datasets?.[0]) {
          const ds = cd.datasets[0];
          const t = result.chart.type;
          if (t === 'bar') { ds.backgroundColor = 'rgba(198,167,107,0.75)'; ds.borderColor = '#C6A76B'; ds.borderWidth = 1; ds.borderRadius = 6; }
          else if (t === 'line') { ds.borderColor = '#C6A76B'; ds.backgroundColor = 'rgba(198,167,107,0.15)'; ds.fill = true; ds.tension = 0.3; }
          else if (t === 'doughnut' || t === 'pie') { ds.backgroundColor = ['#C6A76B','#7FA58C','#CBD5E1','#B99A62','#8E97A0']; ds.borderColor = isDark ? '#0B0D0F' : '#fff'; }
        }
        chartInstanceRef.current = new Chart(ctx, {
          type: result.chart.type,
          data: cd,
          options: {
            responsive: true, maintainAspectRatio: false,
            animation: { duration: 500 },
            plugins: { legend: { labels: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11 } } } },
            scales: result.chart.type === 'doughnut' || result.chart.type === 'pie' ? {} : {
              x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } },
              y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } }
            }
          }
        });
      } catch (err) { console.error('Chart error:', err); }
    }
    return () => { if (chartInstanceRef.current) { chartInstanceRef.current.destroy(); chartInstanceRef.current = null; } };
  }, [showChart, result, theme]);

  if (!result) return null;

  const { question, natural_answer, verification, columns, rows, row_count, sanitized_sql,
          execution_time_ms, database_id, intent, trust_pipeline, chart } = result;

  // The question displayed is always the activeQuery (the one that was submitted)
  const displayQuestion = activeQuery || question;

  const isEmpty = row_count === 0;

  return h('div', { className: 'space-y-0 animate-entrance' },

    // ── CARD ─────────────────────────────────────────────────────────────────
    h('div', { className: 'rounded-2xl luxury-card overflow-hidden border border-[var(--border-subtle)]' },

      // ── SECTION 1: USER QUESTION ────────────────────────────────────────
      h('div', { className: 'px-5 pt-5 pb-3 border-b border-[var(--border-subtle)]' },
        h('div', { className: 'flex items-center space-x-2 mb-1.5' },
          h('span', { className: 'text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase font-semibold' }, 'USER QUESTION')
        ),
        h('p', { className: 'text-sm font-semibold text-[var(--text-primary)] leading-snug' },
          `"${displayQuestion}"`
        ),
        h('div', { className: 'mt-2 flex items-center space-x-2 text-[11px] font-mono text-[var(--text-muted)]' },
          h(Icon, { name: 'database', className: 'w-3 h-3 text-[var(--champagne)]' }),
          h('span', null, database_id),
          h('span', null, '·'),
          h('span', null, `${execution_time_ms}ms`)
        )
      ),

      // ── SECTION 2: TRUSTED ANSWER ───────────────────────────────────────
      h('div', { className: 'px-5 py-4 border-b border-[var(--border-subtle)]' },
        h('div', { className: 'flex items-center space-x-2 mb-2' },
          h('span', { className: 'text-[10px] font-mono tracking-widest text-[var(--champagne)] uppercase font-semibold' }, 'TRUSTED ANSWER')
        ),
        isEmpty
          ? h('div', { className: 'flex items-center space-x-3 py-2' },
              h('div', { className: 'p-2 rounded-lg bg-[var(--bg-surface-soft)] text-[var(--text-muted)]' },
                h(Icon, { name: 'alertTriangle', className: 'w-4 h-4' })
              ),
              h('div', null,
                h('p', { className: 'text-sm font-semibold text-[var(--text-primary)]' }, 'No Matching Data'),
                h('p', { className: 'text-xs text-[var(--text-secondary)]' }, "We couldn't find any records matching this question.")
              )
            )
          : h('div', { className: 'text-sm font-light text-[var(--text-primary)] leading-relaxed' },
              h(MarkdownEditorial, { text: natural_answer })
            )
      ),

      // ── SECTION 3: VERIFICATION STATUS ─────────────────────────────────
      h('div', { className: 'px-5 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-soft)]' },
        h(VerificationBadge, { verification })
      ),

      // ── SECTION 4: EVIDENCE TABLE ───────────────────────────────────────
      !isEmpty && h('div', { className: 'px-5 py-4 border-b border-[var(--border-subtle)]' },
        h('div', { className: 'flex items-center justify-between mb-3' },
          h('div', { className: 'flex items-center space-x-2' },
            h('span', { className: 'text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase font-semibold' }, 'EVIDENCE'),
            h('span', { className: 'text-[10px] font-mono bg-[var(--bg-surface-soft)] text-[var(--text-secondary)] border border-[var(--border-subtle)] px-2 py-0.5 rounded font-semibold' },
              `${row_count} row${row_count !== 1 ? 's' : ''}`
            )
          ),
          h('div', { className: 'flex items-center space-x-1.5' },
            h('button', {
              onClick: exportCSV,
              className: 'flex items-center space-x-1 btn-ghost-luxury px-2.5 py-1.5 rounded-lg text-[11px] font-semibold'
            },
              h(Icon, { name: 'download', className: 'w-3 h-3' }),
              h('span', null, 'CSV')
            ),
            h('button', {
              onClick: exportJSON,
              className: 'btn-ghost-luxury px-2.5 py-1.5 rounded-lg text-[11px] font-semibold'
            }, 'JSON'),
            chart && h('button', {
              onClick: () => setShowChart(v => !v),
              className: `flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition ${showChart ? 'bg-[var(--champagne)] text-[#0F172A]' : 'btn-ghost-luxury'}`
            },
              h(Icon, { name: 'chart', className: 'w-3 h-3' }),
              h('span', null, 'Chart')
            )
          )
        ),

        // Chart (optional)
        showChart && chart && h('div', { className: 'mb-3 w-full h-56 relative p-3 bg-[var(--bg-surface-soft)] rounded-xl border border-[var(--border-subtle)]' },
          h('canvas', { ref: chartCanvasRef })
        ),

        h(DataTable, {
          columns,
          rows,
          highlightFirst: verification?.grounded
        })
      ),

      // ── SECTION 5: EXPANDABLE TECHNICAL DRAWERS ─────────────────────────
      h('div', { className: 'px-5 py-3 space-y-2' },
        h(SQLDrawer, {
          sql: sanitized_sql,
          intent,
          executionTimeMs: execution_time_ms,
          isOpen: openDrawer === 'sql',
          onToggle: () => toggleDrawer('sql'),
          showToast
        }),
        h(VerificationDetailDrawer, {
          verification,
          isOpen: openDrawer === 'verification',
          onToggle: () => toggleDrawer('verification')
        }),
        h(TrustPipelineDrawer, {
          trustPipeline: trust_pipeline,
          isOpen: openDrawer === 'trust',
          onToggle: () => toggleDrawer('trust')
        })
      )
    )
  );
}

// =============================================================================
// LOADING STATE PANEL
// =============================================================================
function LoadingPanel({ stage }) {
  const stages = [
    { id: 1, label: 'Analyzing question' },
    { id: 2, label: 'Checking safety' },
    { id: 3, label: 'Querying database' },
    { id: 4, label: 'Verifying answer' },
  ];
  return h('div', { className: 'rounded-2xl luxury-card p-8 text-center space-y-5 animate-entrance' },
    h('div', { className: 'flex justify-center' },
      h('div', { className: 'w-10 h-10 rounded-full bg-[var(--champagne-dim)] border border-[var(--champagne-border)] flex items-center justify-center' },
        h('span', { className: 'w-3 h-3 rounded-full bg-[var(--champagne)] animate-ping' })
      )
    ),
    h('div', { className: 'space-y-1' },
      h('h3', { className: 'text-sm font-semibold text-[var(--text-primary)]' }, 'Processing your question...'),
      h('p', { className: 'text-xs text-[var(--text-muted)]' }, 'NL Question → Safe SQL → Database Execution → Grounding Verification')
    ),
    h('div', { className: 'grid grid-cols-4 gap-1.5' },
      stages.map(st =>
        h('div', {
          key: st.id,
          className: `p-2 rounded-lg text-[10px] font-mono text-center transition-all ${
            stage >= st.id
              ? 'bg-[var(--champagne-dim)] text-[var(--champagne)] border border-[var(--champagne-border)] font-bold'
              : 'bg-[var(--bg-surface-soft)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
          }`
        }, `${st.label}${stage > st.id ? ' ✓' : stage === st.id ? '...' : ''}`)
      )
    )
  );
}

// =============================================================================
// IDLE/WELCOME STATE PANEL
// =============================================================================
function WelcomePanel({ dbName }) {
  return h('div', { className: 'rounded-2xl luxury-card p-8 space-y-6 flex flex-col justify-center min-h-[340px]' },
    h('div', { className: 'space-y-2' },
      h('div', { className: 'inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[var(--verified-bg)] border border-[var(--verified-border)] text-[10px] font-mono text-[var(--verified)] font-bold' },
        h('span', { className: 'w-1.5 h-1.5 rounded-full bg-[var(--verified)] animate-pulse-subtle' }),
        h('span', null, 'READY TO QUERY')
      ),
      h('h2', { className: 'font-serif-luxury text-2xl font-normal text-[var(--text-primary)]' }, 'ASK YOUR DATA'),
      h('p', { className: 'text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm' },
        'Ask a question in plain English and get an answer grounded in your database. Every claim is verified against actual query results.'
      )
    ),
    h('div', { className: 'grid grid-cols-3 gap-3' },
      [
        { icon: 'sparkles', label: 'Natural Language', desc: 'Ask in plain English' },
        { icon: 'shieldCheck', label: 'Evidence Grounded', desc: 'Verified against database evidence' },
        { icon: 'database', label: 'Local Database', desc: 'Direct SQL execution' },
      ].map((f, i) =>
        h('div', { key: i, className: 'p-3.5 rounded-xl bg-[var(--bg-surface-soft)] border border-[var(--border-subtle)] space-y-1.5 text-center' },
          h('div', { className: 'flex justify-center' },
            h(Icon, { name: f.icon, className: 'w-4 h-4 text-[var(--champagne)]' })
          ),
          h('p', { className: 'text-[11px] font-semibold text-[var(--text-primary)]' }, f.label),
          h('p', { className: 'text-[10px] text-[var(--text-muted)]' }, f.desc)
        )
      )
    ),
    h('div', { className: 'flex items-center space-x-2 text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-surface-soft)] px-3 py-2 rounded-lg border border-[var(--border-subtle)]' },
      h(Icon, { name: 'database', className: 'w-3.5 h-3.5 text-[var(--champagne)]' }),
      h('span', null, 'Connected: '),
      h('span', { className: 'text-[var(--text-primary)] font-semibold' }, dbName)
    )
  );
}

// =============================================================================
// ERROR STATE PANEL
// =============================================================================
function ErrorPanel({ message, onRetry }) {
  const [showDetail, setShowDetail] = useState(false);
  return h('div', { className: 'rounded-2xl luxury-card p-6 space-y-3 border-l-4 border-l-[var(--danger)] animate-entrance' },
    h('div', { className: 'flex items-center space-x-3' },
      h(Icon, { name: 'xCircle', className: 'w-5 h-5 text-[var(--danger)]' }),
      h('h3', { className: 'font-semibold text-sm text-[var(--text-primary)]' }, 'Unable to process this question')
    ),
    h('p', { className: 'text-xs text-[var(--text-secondary)] leading-relaxed' }, 'The system could not generate or execute a safe query for your question. Try rephrasing it.'),
    h('div', { className: 'flex items-center space-x-2' },
      onRetry && h('button', {
        onClick: onRetry,
        className: 'btn-champagne px-3.5 py-1.5 rounded-lg text-xs font-bold'
      }, 'Try Again'),
      h('button', {
        onClick: () => setShowDetail(v => !v),
        className: 'btn-ghost-luxury px-3 py-1.5 rounded-lg text-xs font-semibold'
      }, showDetail ? 'Hide detail' : 'View technical detail')
    ),
    showDetail && message && h('pre', { className: 'sql-luxury-box p-3 text-[11px] font-mono overflow-x-auto text-[var(--danger)] rounded-xl' }, message)
  );
}

// =============================================================================
// DEMO LAB — collapsible, still calls backend
// =============================================================================
function DemoLab({ onRunQuery }) {
  const [isOpen, setIsOpen] = useState(false);
  return h('div', { className: 'rounded-xl border border-[var(--border-subtle)] overflow-hidden' },
    h('button', {
      onClick: () => setIsOpen(v => !v),
      className: 'w-full px-4 py-3 flex items-center justify-between bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-soft)] transition text-left'
    },
      h('div', { className: 'flex items-center space-x-2' },
        h(Icon, { name: 'flask', className: 'w-3.5 h-3.5 text-[var(--champagne)]' }),
        h('span', { className: 'text-xs font-semibold text-[var(--text-primary)]' }, 'Demo Lab'),
        h('span', { className: 'text-[10px] font-mono text-[var(--text-muted)]' }, `${DEMO_QUESTIONS.length} scenarios`)
      ),
      h(Icon, { name: isOpen ? 'chevronDown' : 'chevronRight', className: 'w-3.5 h-3.5 text-[var(--text-muted)]' })
    ),
    isOpen && h('div', { className: 'px-4 py-3 bg-[var(--bg-surface-soft)] border-t border-[var(--border-subtle)] space-y-1.5' },
      h('p', { className: 'text-[10px] text-[var(--text-muted)] font-mono pb-1' }, 'Click to run against live backend →'),
      DEMO_QUESTIONS.map((d, i) =>
        h('button', {
          key: i,
          onClick: () => onRunQuery(d.query),
          className: 'w-full text-left flex items-center justify-between px-2.5 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--champagne-border)] hover:bg-[var(--bg-surface-hover)] transition group text-xs'
        },
          h('div', { className: 'flex items-center space-x-2 min-w-0' },
            h('span', { className: 'text-[10px] font-mono text-[var(--champagne)] font-bold shrink-0' }, `#${i + 1}`),
            h('span', { className: 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] truncate font-medium' }, d.query)
          ),
          h(Icon, { name: 'arrowUpRight', className: 'w-3 h-3 text-[var(--text-muted)] group-hover:text-[var(--champagne)] shrink-0 ml-2' })
        )
      )
    )
  );
}

// =============================================================================
// HALLUCINATION LAB (PS2 Red-Teaming) — kept as separate tab
// =============================================================================
function HallucinationLabWorkspace({ activeDb, databases, showToast }) {
  const [benchmarks, setBenchmarks] = useState([]);
  const [telemetry, setTelemetry] = useState(null);
  const [selectedBenchmark, setSelectedBenchmark] = useState(null);
  const [testQuestion, setTestQuestion] = useState("Who has the highest attendance?");
  const [testAnswer, setTestAnswer] = useState("Arun has 96% attendance and is the best student in the college with 100% scholarship.");
  const [testDb, setTestDb] = useState("college_records");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/hallucination/benchmarks`).then(r => r.ok ? r.json() : null).then(d => {
      if (d?.scenarios) { setBenchmarks(d.scenarios); if (d.scenarios[0]) loadBenchmark(d.scenarios[0]); }
    }).catch(() => {});
    fetch(`${API_BASE}/api/hallucination/telemetry`).then(r => r.ok ? r.json() : null).then(d => { if (d) setTelemetry(d); }).catch(() => {});
  }, []);

  const loadBenchmark = (sc) => { setSelectedBenchmark(sc); setTestQuestion(sc.question); setTestAnswer(sc.hallucinated_answer); setTestDb(sc.database_id); setEvaluationResult(null); };

  const handleEvaluate = async () => {
    setIsEvaluating(true); setEvaluationResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/hallucination/test-candidate`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: testQuestion, database_id: testDb, candidate_answer: testAnswer })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Evaluation failed");
      setEvaluationResult(data);
    } catch (err) { showToast(`Error: ${err.message}`); } finally { setIsEvaluating(false); }
  };

  return h('div', { className: 'space-y-6 animate-entrance' },
    h('div', { className: 'p-5 rounded-2xl luxury-card border-l-4 border-l-[var(--champagne)] space-y-1' },
      h('div', { className: 'inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-[var(--champagne-dim)] text-[var(--champagne)] text-[10px] font-mono font-semibold uppercase tracking-widest' },
        h(Icon, { name: 'shieldZap', className: 'w-3 h-3' }),
        h('span', null, 'VERIFICATION LAB')
      ),
      h('h2', { className: 'font-serif-luxury text-2xl font-normal text-[var(--text-primary)]' }, 'HALLUCINATION TEST LAB'),
      h('p', { className: 'text-xs text-[var(--text-secondary)]' }, 'Submit a question + candidate answer. The verification shield audits whether candidate claims are grounded in actual database evidence.')
    ),

    h('div', { className: 'grid grid-cols-1 lg:grid-cols-5 gap-6' },

      // Left: form
      h('div', { className: 'lg:col-span-2 space-y-4' },
        benchmarks.length > 0 && h('div', { className: 'luxury-card rounded-2xl p-4 space-y-2' },
          h('span', { className: 'text-[10px] font-mono text-[var(--champagne)] uppercase font-bold' }, `${benchmarks.length} Attack Benchmarks`),
          h('div', { className: 'space-y-1.5 max-h-52 overflow-y-auto' },
            benchmarks.map(sc =>
              h('button', {
                key: sc.id,
                onClick: () => loadBenchmark(sc),
                className: `w-full text-left p-2.5 rounded-xl border transition text-xs ${selectedBenchmark?.id === sc.id ? 'bg-[var(--champagne-dim)] border-[var(--champagne-border)]' : 'bg-[var(--bg-surface-soft)] border-[var(--border-subtle)] hover:border-[var(--border-medium)]'}`
              },
                h('div', { className: 'flex items-center justify-between' },
                  h('span', { className: 'font-semibold text-[var(--text-primary)]' }, sc.title),
                  h('span', { className: `text-[9px] font-mono font-bold px-1.5 rounded ${sc.severity === 'CRITICAL' ? 'bg-[var(--danger-bg)] text-[var(--danger)]' : 'bg-[var(--warning-bg)] text-[var(--warning)]'}` }, sc.severity)
                )
              )
            )
          )
        ),

        h('div', { className: 'luxury-card rounded-2xl p-4 space-y-3' },
          h('span', { className: 'text-[10px] font-mono text-[var(--text-muted)] uppercase font-semibold' }, 'Test Input'),
          h('div', { className: 'space-y-1' },
            h('label', { className: 'text-[10px] font-mono text-[var(--text-muted)] uppercase font-semibold' }, 'Database'),
            h('select', { value: testDb, onChange: e => setTestDb(e.target.value), className: 'w-full bg-[var(--bg-surface-soft)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs font-medium text-[var(--text-primary)] outline-none' },
              databases.filter(d => d.id === 'college_records').concat(databases.filter(d => d.id !== 'college_records' && !d.id.startsWith('csv_'))).map(d => h('option', { key: d.id, value: d.id }, d.name))
            )
          ),
          h('div', { className: 'space-y-1' },
            h('label', { className: 'text-[10px] font-mono text-[var(--text-muted)] uppercase font-semibold' }, 'Question'),
            h('input', { type: 'text', value: testQuestion, onChange: e => setTestQuestion(e.target.value), className: 'w-full bg-[var(--bg-surface-soft)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] outline-none' })
          ),
          h('div', { className: 'space-y-1' },
            h('label', { className: 'text-[10px] font-mono text-[var(--text-muted)] uppercase font-semibold' }, 'Candidate Answer (may contain hallucination)'),
            h('textarea', { rows: 3, value: testAnswer, onChange: e => setTestAnswer(e.target.value), className: 'w-full bg-[var(--bg-surface-soft)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-primary)] outline-none font-mono leading-relaxed resize-none' })
          ),
          h('button', { onClick: handleEvaluate, disabled: isEvaluating || !testAnswer.trim(), className: 'btn-champagne w-full py-2.5 rounded-xl text-xs font-bold disabled:opacity-40' },
            isEvaluating ? 'Running shield...' : 'Run Hallucination Shield'
          )
        )
      ),

      // Right: result
      h('div', { className: 'lg:col-span-3' },
        evaluationResult ? h('div', { className: 'luxury-card rounded-2xl p-5 space-y-4 animate-entrance' },
          h('div', { className: `flex items-center space-x-3 p-3 rounded-xl border ${evaluationResult.hallucination_detected ? 'bg-[var(--danger-bg)] border-[var(--danger-border)]' : 'bg-[var(--verified-bg)] border-[var(--verified-border)]'}` },
            h(Icon, { name: evaluationResult.hallucination_detected ? 'shieldAlert' : 'shieldCheck', className: `w-5 h-5 ${evaluationResult.hallucination_detected ? 'text-[var(--danger)]' : 'text-[var(--verified)]'}` }),
            h('div', null,
              h('p', { className: 'text-sm font-bold text-[var(--text-primary)]' }, evaluationResult.hallucination_detected ? 'Hallucination Intercepted' : 'Grounded & Verified in Evidence'),
              h('p', { className: 'text-[11px] font-mono text-[var(--text-muted)]' }, `Risk: ${evaluationResult.hallucination_risk_pct}% • ${evaluationResult.execution_time_ms}ms`)
            )
          ),
          h('p', { className: 'text-xs text-[var(--text-primary)] leading-relaxed' }, evaluationResult.reason),
          evaluationResult.claims_breakdown?.length > 0 && h('div', { className: 'space-y-1.5' },
            h('span', { className: 'text-[10px] font-mono text-[var(--text-muted)] uppercase font-semibold' }, 'Claim Analysis'),
            evaluationResult.claims_breakdown.map((cl, i) => {
              const ok = cl.status === 'GROUNDED';
              return h('div', { key: i, className: `p-2.5 rounded-xl border text-xs flex items-center justify-between ${ok ? 'bg-[var(--verified-bg)] border-[var(--verified-border)]' : 'bg-[var(--danger-bg)] border-[var(--danger-border)]'}` },
                h('span', { className: 'font-medium text-[var(--text-primary)] truncate mr-2' }, `"${cl.claim}"`),
                h('span', { className: `text-[10px] font-mono font-bold px-2 rounded ${ok ? 'bg-[var(--verified)] text-white' : 'bg-[var(--danger)] text-white'}` }, cl.status)
              );
            })
          )
        ) : isEvaluating ? h('div', { className: 'luxury-card rounded-2xl p-12 text-center space-y-3 flex flex-col items-center' },
          h('div', { className: 'w-10 h-10 rounded-full bg-[var(--champagne-dim)] border border-[var(--champagne-border)] flex items-center justify-center' },
            h('span', { className: 'w-3 h-3 rounded-full bg-[var(--champagne)] animate-ping' })
          ),
          h('p', { className: 'text-sm font-semibold text-[var(--text-primary)]' }, 'Running 6-layer hallucination shield...')
        ) : h('div', { className: 'luxury-card rounded-2xl p-8 space-y-4 text-center' },
          h(Icon, { name: 'shieldZap', className: 'w-8 h-8 text-[var(--champagne)] mx-auto' }),
          h('h3', { className: 'font-serif-luxury text-lg text-[var(--text-primary)]' }, 'HOW THE SHIELD INTERCEPTS HALLUCINATIONS'),
          h('div', { className: 'grid grid-cols-2 gap-2 text-left' },
            [
              { num: '01', title: 'Zero-Row Guard', desc: 'Blocks invented records when DB returns 0 rows' },
              { num: '02', title: 'Entity Grounding', desc: 'Verifies names against actual DB entries' },
              { num: '03', title: 'Numeric Consistency', desc: 'Validates all numbers against SQL columns' },
              { num: '04', title: 'Superlative Filter', desc: 'Flags unproven qualitative claims' },
              { num: '05', title: 'Aggregation Check', desc: 'Validates COUNT, SUM, AVG computations' },
              { num: '06', title: 'Semantic Auditor', desc: 'LLM-hybrid check for complex queries' },
            ].map(l =>
              h('div', { key: l.num, className: 'p-2.5 rounded-lg bg-[var(--bg-surface-soft)] border border-[var(--border-subtle)] space-y-0.5' },
                h('span', { className: 'text-[10px] font-mono text-[var(--champagne)] font-bold' }, `LAYER ${l.num}`),
                h('p', { className: 'text-[11px] font-semibold text-[var(--text-primary)]' }, l.title),
                h('p', { className: 'text-[10px] text-[var(--text-muted)]' }, l.desc)
              )
            )
          )
        )
      )
    )
  );
}

// =============================================================================
// MAIN APP
// =============================================================================
function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('neura_theme') || 'dark');
  const [databases, setDatabases] = useState([]);
  const [activeDb, setActiveDb] = useState("college_records");
  const [schemaData, setSchemaData] = useState(null);
  const [activeTab, setActiveTab] = useState("ask");
  const [toastMessage, setToastMessage] = useState(null);

  const [inputQuery, setInputQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [directSqlMode, setDirectSqlMode] = useState(false);

  // Query state model: 'idle' | 'loading' | 'success' | 'empty' | 'error'
  const [queryState, setQueryState] = useState('idle');
  const [analysisStage, setAnalysisStage] = useState(0);
  const [currentResult, setCurrentResult] = useState(null);
  const [activeQuery, setActiveQuery] = useState(null); // Question tied to currentResult
  const [queryError, setQueryError] = useState(null);

  // Race condition guard: only apply the result that belongs to the latest request
  const activeRequestRef = useRef(0);

  const [queryHistory, setQueryHistory] = useState([]);
  const [settingsData, setSettingsData] = useState({
    llm_provider: "offline",
    model_name: "gemini-2.5-flash",
    gemini_key_input: "",
    openai_key_input: ""
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  // Theme sync
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('neura_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Init
  useEffect(() => { fetchDatabases(); fetchSettings(); fetchHistory(); }, []);
  useEffect(() => { if (activeDb) fetchSchema(activeDb); }, [activeDb]);

  const fetchDatabases = async () => {
    try { const r = await fetch(`${API_BASE}/api/databases`); if (r.ok) setDatabases(await r.json()); } catch (e) { console.error(e); }
  };
  const fetchSchema = async (dbId) => {
    try { const r = await fetch(`${API_BASE}/api/databases/${dbId}/schema`); if (r.ok) setSchemaData(await r.json()); } catch (e) { console.error(e); }
  };
  const fetchSettings = async () => {
    try { const r = await fetch(`${API_BASE}/api/settings`); if (r.ok) { const d = await r.json(); setSettingsData(prev => ({ ...prev, ...d })); } } catch (e) { console.error(e); }
  };
  const fetchHistory = async () => {
    try { const r = await fetch(`${API_BASE}/api/history`); if (r.ok) setQueryHistory(await r.json()); } catch (e) { console.error(e); }
  };

  // ==========================================================================
  // QUERY SUBMISSION — with race condition guard
  // ==========================================================================
  const handleSendQuery = useCallback(async (queryText, targetDbOverride) => {
    const textToRun = (queryText !== undefined ? queryText : inputQuery || "").trim();
    if (!textToRun) return;

    const dbToUse = targetDbOverride || activeDb;

    // Claim this request slot
    const requestId = ++activeRequestRef.current;

    // Immediately clear old state, set the question we're answering
    setActiveQuery(textToRun);
    setInputQuery(textToRun);
    setCurrentResult(null);
    setQueryError(null);
    setQueryState('loading');
    setAnalysisStage(1);

    const t1 = setTimeout(() => setAnalysisStage(2), 200);
    const t2 = setTimeout(() => setAnalysisStage(3), 450);
    const t3 = setTimeout(() => setAnalysisStage(4), 700);

    try {
      const payload = {
        question: textToRun,
        database_id: dbToUse,
        provider: settingsData.llm_provider,
        api_key: settingsData.llm_provider === "gemini"
          ? settingsData.gemini_key_input
          : settingsData.openai_key_input,
        model_name: settingsData.model_name,
        custom_sql: directSqlMode ? textToRun : null,
      };

      const res = await fetch(`${API_BASE}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      // Discard stale responses — only the latest request wins
      if (requestId !== activeRequestRef.current) return;

      if (!res.ok) throw new Error(data.detail || "Query execution failed.");

      setCurrentResult(data);
      setQueryState(data.row_count === 0 ? 'empty' : 'success');
      fetchHistory();
    } catch (err) {
      if (requestId !== activeRequestRef.current) return;
      setQueryError(err.message);
      setQueryState('error');
      showToast(`Error: ${err.message}`);
    } finally {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      if (requestId === activeRequestRef.current) {
        setAnalysisStage(0);
        setQueryState(s => s === 'loading' ? 'idle' : s);
      }
    }
  }, [inputQuery, activeDb, settingsData, directSqlMode]);

  // Voice input
  const handleVoiceToggle = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      showToast("Voice input is supported in Chrome, Edge, and Safari.");
      return;
    }
    if (isListening) { setIsListening(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = 'en-US';
    rec.onstart = () => setIsListening(true);
    rec.onresult = (e) => { const t = e.results[0][0].transcript; setInputQuery(t); setIsListening(false); handleSendQuery(t); };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    rec.start();
  };

  // Export
  const exportCSV = () => {
    if (!currentResult?.rows?.length) return;
    const { columns, rows } = currentResult;
    let csv = columns.join(",") + "\n";
    rows.forEach(r => { csv += columns.map(c => { let v = r[c] === null || r[c] === undefined ? "" : String(r[c]); return (v.includes(",") || v.includes('"')) ? `"${v.replace(/"/g, '""')}"` : v; }).join(",") + "\n"; });
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = `neura_${activeDb}_${Date.now()}.csv`; a.click();
    showToast("Exported CSV.");
  };
  const exportJSON = () => {
    if (!currentResult?.rows?.length) return;
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(currentResult.rows, null, 2)], { type: "application/json" })); a.download = `neura_${activeDb}_${Date.now()}.json`; a.click();
    showToast("Exported JSON.");
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const fd = new FormData(); fd.append("file", file);
    setUploadStatus("Importing dataset...");
    try {
      const r = await fetch(`${API_BASE}/api/databases/upload-csv`, { method: "POST", body: fd });
      const d = await r.json(); if (!r.ok) throw new Error(d.detail);
      setUploadStatus(`✅ Imported '${d.table_name}' (${d.row_count} rows)`);
      showToast(`Imported ${d.table_name}.`);
      await fetchDatabases(); setActiveDb(d.database_id);
    } catch (err) { setUploadStatus(`❌ ${err.message}`); }
  };

  // Aggregate insights
  const insightsMetrics = useMemo(() => {
    const total = queryHistory.length;
    if (!total) return { total: 0, verifiedPct: "—", avgReliability: "—", avgLatency: "—" };
    const vc = queryHistory.filter(q => q.verification_status === "VERIFIED" || q.verification_status === "MOSTLY VERIFIED").length;
    return {
      total,
      verifiedPct: `${Math.round(vc / total * 100)}%`,
      avgReliability: (queryHistory.reduce((a, q) => a + (q.reliability_score || 90), 0) / total).toFixed(1),
      avgLatency: `${Math.round(queryHistory.reduce((a, q) => a + (q.execution_time_ms || 20), 0) / total)} ms`,
    };
  }, [queryHistory]);

  const CANONICAL_DB_IDS = ['college_records', 'ecommerce_store', 'healthcare'];
  const canonicalDatabases = databases.filter(d => CANONICAL_DB_IDS.includes(d.id));
  const visibleDatabases = canonicalDatabases.length > 0
    ? canonicalDatabases
    : [
        { id: 'college_records', name: 'College & Student Records' },
        { id: 'ecommerce_store', name: 'E-Commerce Online Store' },
        { id: 'healthcare', name: 'Hospital & Healthcare Records' }
      ];

  const activeDatabaseObj = visibleDatabases.find(d => d.id === activeDb) || visibleDatabases[0];
  const curatedExamples = CURATED_PROMPTS[activeDb] || CURATED_PROMPTS.college_records;

  // ============================================================================
  // RENDER
  // ============================================================================
  return h('div', { className: 'min-h-screen flex flex-col' },

    // Toast
    toastMessage && h('div', { className: 'fixed bottom-6 right-6 z-50 bg-[var(--bg-surface-elevated)] border border-[var(--champagne-border)] text-[var(--text-primary)] text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 animate-entrance' },
      h('span', { className: 'w-2 h-2 rounded-full bg-[var(--champagne)]' }),
      h('span', null, toastMessage)
    ),

    // ── NAVIGATION ──────────────────────────────────────────────────────────
    h('header', { className: 'luxury-nav sticky top-0 z-40 px-5 lg:px-10 py-3 flex items-center justify-between' },

      // Logo
      h('div', { className: 'flex items-center space-x-2.5' },
        h('div', { className: 'flex flex-col' },
          h('span', { className: 'font-serif-luxury font-bold text-lg tracking-[0.16em] text-[var(--text-primary)]' }, 'NEURA-X'),
          h('span', { className: 'text-[8px] font-mono tracking-widest text-[var(--champagne)] uppercase font-semibold' }, 'TRUSTED AI DATABASE ASSISTANT')
        )
      ),

      // Desktop nav
      h('nav', { className: 'hidden lg:flex items-center space-x-1' },
        [
          { id: 'ask', label: 'ASK', icon: 'sparkles' },
          { id: 'explore', label: 'DATA LIBRARY', icon: 'database' },
          { id: 'history', label: 'AUDIT TRAIL', icon: 'history' },
          { id: 'insights', label: 'INSIGHTS', icon: 'activity' },
        ].map(item =>
          h('button', {
            key: item.id,
            id: `nav-${item.id}`,
            onClick: () => setActiveTab(item.id),
            className: `px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all flex items-center space-x-1.5 ${
              activeTab === item.id
                ? 'bg-[var(--champagne-dim)] text-[var(--champagne)] border border-[var(--champagne-border)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-soft)]'
            }`
          },
            h(Icon, { name: item.icon, className: 'w-3.5 h-3.5' }),
            h('span', null, item.label)
          )
        )
      ),

      // Right controls
      h('div', { className: 'flex items-center space-x-2' },
        h('button', {
          id: 'theme-toggle',
          onClick: toggleTheme,
          className: 'p-2 rounded-lg bg-[var(--bg-surface-soft)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--champagne)] transition',
          title: theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'
        }, h(Icon, { name: theme === 'dark' ? 'sun' : 'moon', className: 'w-4 h-4' })),

        h('div', { className: 'flex items-center space-x-1.5 bg-[var(--bg-surface-soft)] border border-[var(--border-subtle)] rounded-lg px-2.5 py-1.5' },
          h('span', { className: 'text-[9px] font-mono font-bold text-[var(--text-muted)] uppercase mr-1' }, 'DATABASE'),
          h('select', {
            id: 'db-selector',
            value: activeDb,
            onChange: (e) => { setActiveDb(e.target.value); setCurrentResult(null); setQueryState('idle'); setActiveQuery(null); },
            className: 'bg-transparent text-xs font-semibold text-[var(--text-primary)] outline-none cursor-pointer'
          }, visibleDatabases.map(db => h('option', { key: db.id, value: db.id }, db.name)))
        ),

        h('div', { className: 'hidden sm:flex items-center space-x-1.5 bg-[var(--verified-bg)] border border-[var(--verified-border)] px-2.5 py-1.5 rounded-lg' },
          h('span', { className: 'w-1.5 h-1.5 rounded-full bg-[var(--verified)] animate-pulse-subtle' }),
          h('span', { className: 'text-[9px] font-mono font-bold text-[var(--verified)] uppercase' }, 'ACTIVE')
        ),

        h('button', {
          id: 'settings-btn',
          onClick: () => setIsSettingsOpen(!isSettingsOpen),
          className: 'p-2 rounded-lg bg-[var(--bg-surface-soft)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition',
          title: 'Settings'
        }, h(Icon, { name: 'settings', className: 'w-4 h-4' }))
      )
    ),

    // Mobile nav
    h('div', { className: 'lg:hidden flex items-center justify-around bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] py-1.5 text-[10px] font-semibold overflow-x-auto' },
      [
        { id: 'ask', label: 'Ask' },
        { id: 'explore', label: 'Data Library' },
        { id: 'history', label: 'Audit Trail' },
        { id: 'insights', label: 'Insights' },
      ].map(item =>
        h('button', {
          key: item.id,
          onClick: () => setActiveTab(item.id),
          className: `px-3 py-1.5 transition whitespace-nowrap ${activeTab === item.id ? 'text-[var(--champagne)] font-bold border-b-2 border-[var(--champagne)]' : 'text-[var(--text-secondary)]'}`
        }, item.label)
      )
    ),

    // ── MAIN CONTENT ────────────────────────────────────────────────────────
    h('main', { className: 'flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5' },

      // =======================================================================
      // ASK WORKSPACE
      // =======================================================================
      activeTab === 'ask' && h('div', { className: 'animate-entrance h-full' },
        h('div', { className: 'grid grid-cols-1 lg:grid-cols-12 gap-5 items-start' },

          // LEFT: Question + Controls
          h('div', { className: 'lg:col-span-4 space-y-3' },

            // Brand + Input card
            h('div', { className: 'p-5 rounded-2xl luxury-card space-y-4' },
              h('div', { className: 'space-y-0.5' },
                h('h1', { className: 'font-serif-luxury text-xl font-normal tracking-[0.06em] text-[var(--text-primary)]' }, 'ASK YOUR DATA.'),
                h('p', { className: 'text-[11px] text-[var(--text-secondary)] leading-relaxed' }, 'Ask in plain English. Get a verified answer from your database.')
              ),

              // Input box
              h('div', { className: 'hero-input-container rounded-xl p-2 flex items-center space-x-2' },
                h('button', {
                  onClick: () => setDirectSqlMode(!directSqlMode),
                  title: directSqlMode ? 'Switch to AI mode' : 'Switch to SQL mode',
                  className: `px-2 py-1 rounded-lg text-[10px] font-mono tracking-wider transition shrink-0 ${directSqlMode ? 'bg-[var(--champagne)] text-[#0F172A] font-bold' : 'bg-[var(--bg-surface-soft)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`
                }, directSqlMode ? 'SQL' : 'AI'),

                h('input', {
                  id: 'query-input',
                  type: 'text',
                  value: inputQuery,
                  onChange: (e) => setInputQuery(e.target.value),
                  onKeyDown: (e) => e.key === 'Enter' && handleSendQuery(),
                  placeholder: directSqlMode ? 'Enter SELECT query...' : 'Ask your database anything...',
                  disabled: queryState === 'loading',
                  className: 'flex-1 min-w-0 bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none font-medium'
                }),

                h('button', {
                  onClick: handleVoiceToggle,
                  title: 'Voice input',
                  className: `p-1.5 rounded-lg transition shrink-0 ${isListening ? 'bg-[var(--danger-bg)] text-[var(--danger)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-soft)]'}`
                },
                  isListening
                    ? h('div', { className: 'flex items-center space-x-0.5' },
                        h('span', { className: 'w-0.5 h-3 bg-[var(--danger)] voice-bar-1 rounded' }),
                        h('span', { className: 'w-0.5 h-3 bg-[var(--danger)] voice-bar-2 rounded' }),
                        h('span', { className: 'w-0.5 h-3 bg-[var(--danger)] voice-bar-3 rounded' })
                      )
                    : h(Icon, { name: 'mic', className: 'w-4 h-4' })
                ),

                h('button', {
                  id: 'submit-query',
                  onClick: () => handleSendQuery(),
                  disabled: queryState === 'loading' || !inputQuery.trim(),
                  className: 'btn-champagne px-3 py-2 rounded-lg flex items-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed'
                }, h(Icon, { name: 'send', className: 'w-4 h-4 text-[#0F172A]' }))
              ),

              // DB status
              h('div', { className: 'flex items-center justify-between text-[11px] font-mono' },
                h('div', { className: 'flex items-center space-x-1.5 text-[var(--text-muted)]' },
                  h('span', { className: 'uppercase font-semibold' }, 'DB:'),
                  h('span', { className: 'text-[var(--text-primary)] font-semibold' }, activeDatabaseObj.name),
                  h('span', { className: 'text-[var(--verified)] font-bold' }, '● Active')
                ),
                h('span', { className: 'text-[var(--text-muted)]' }, `${schemaData?.tables?.length || 0} tables`)
              )
            ),

            // Suggested queries
            h('div', { className: 'rounded-xl border border-[var(--border-subtle)] overflow-hidden' },
              h('div', { className: 'px-4 py-2.5 flex items-center justify-between bg-[var(--bg-surface)] border-b border-[var(--border-subtle)]' },
                h('span', { className: 'text-[10px] font-mono text-[var(--text-muted)] uppercase font-semibold' }, 'Suggested Queries'),
                h('span', { className: 'text-[10px] font-mono text-[var(--text-muted)]' }, 'Click to run')
              ),
              h('div', { className: 'p-2 space-y-1 bg-[var(--bg-surface-soft)]' },
                curatedExamples.map((ex, idx) =>
                  h('button', {
                    key: idx,
                    onClick: () => handleSendQuery(ex),
                    className: 'w-full text-left text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-transparent hover:border-[var(--champagne-border)] px-2.5 py-2 rounded-lg transition flex items-center justify-between group'
                  },
                    h('span', { className: 'truncate mr-2 font-medium' }, ex),
                    h(Icon, { name: 'arrowUpRight', className: 'w-3 h-3 text-[var(--text-muted)] group-hover:text-[var(--champagne)] shrink-0' })
                  )
                )
              )
            ),

            // Demo Lab (collapsed by default)
            h(DemoLab, { onRunQuery: (q) => { setActiveDb("college_records"); handleSendQuery(q, "college_records"); } })
          ),

          // RIGHT: Result area
          h('div', { className: 'lg:col-span-8' },

            // Loading
            queryState === 'loading' && h(LoadingPanel, { stage: analysisStage }),

            // Success or empty
            (queryState === 'success' || queryState === 'empty') && currentResult &&
              h(ResultPanel, {
                result: currentResult,
                activeQuery,
                exportCSV,
                exportJSON,
                showToast,
                theme
              }),

            // Error
            queryState === 'error' &&
              h(ErrorPanel, { message: queryError, onRetry: () => handleSendQuery(activeQuery) }),

            // Idle (welcome)
            queryState === 'idle' && h(WelcomePanel, { dbName: activeDatabaseObj.name })
          )
        )
      ),

      // =======================================================================
      // DATA LIBRARY
      // =======================================================================
      activeTab === 'explore' && h('div', { className: 'space-y-6 animate-entrance' },
        h('div', { className: 'space-y-1' },
          h('h2', { className: 'font-serif-luxury text-2xl font-normal text-[var(--text-primary)]' }, 'DATA LIBRARY'),
          h('p', { className: 'text-sm text-[var(--text-secondary)]' },
            `${schemaData?.database_name || activeDb} · ${schemaData?.tables?.length || 0} tables`
          )
        ),
        schemaData && h('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' },
          schemaData.tables.map(table =>
            h('div', { key: table.name, className: 'luxury-card rounded-2xl p-5 space-y-3' },
              h('div', { className: 'flex items-center justify-between border-b border-[var(--border-subtle)] pb-3' },
                h('div', { className: 'flex items-center space-x-2' },
                  h(Icon, { name: 'table', className: 'w-4 h-4 text-[var(--champagne)]' }),
                  h('h3', { className: 'font-semibold text-sm text-[var(--text-primary)] font-mono' }, table.name)
                ),
                h('span', { className: 'text-[11px] font-mono bg-[var(--bg-surface-soft)] text-[var(--text-secondary)] px-2 py-0.5 rounded border border-[var(--border-subtle)]' }, `${table.row_count} rows`)
              ),
              h('div', { className: 'space-y-1 max-h-48 overflow-y-auto' },
                table.columns.map(col =>
                  h('div', { key: col.name, className: 'flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-[var(--bg-surface-soft)] border border-[var(--border-subtle)] font-mono' },
                    h('span', { className: 'text-[var(--text-primary)]' }, col.name),
                    h('div', { className: 'flex items-center space-x-1' },
                      h('span', { className: 'text-[var(--text-muted)] text-[10px]' }, col.type),
                      col.is_primary_key && h('span', { className: 'badge-ps7 text-[9px] px-1.5 py-0.5 rounded' }, 'PK'),
                      col.foreign_key && h('span', { className: 'badge-ps2 text-[9px] px-1.5 py-0.5 rounded' }, 'FK')
                    )
                  )
                )
              ),
              table.sample_rows?.length > 0 && h('div', { className: 'pt-2 border-t border-[var(--border-subtle)]' },
                h('span', { className: 'text-[10px] font-mono text-[var(--text-muted)] uppercase font-semibold' }, 'SAMPLE'),
                h('pre', { className: 'mt-1 text-[10px] bg-[var(--bg-surface-soft)] p-2 rounded-lg text-[var(--text-secondary)] overflow-x-auto border border-[var(--border-subtle)] font-mono' },
                  JSON.stringify(table.sample_rows[0], null, 2)
                )
              )
            )
          )
        )
      ),

      // =======================================================================
      // AUDIT TRAIL
      // =======================================================================
      activeTab === 'history' && h('div', { className: 'space-y-5 animate-entrance' },
        h('div', { className: 'flex flex-wrap items-center justify-between gap-4' },
          h('div', { className: 'space-y-0.5' },
            h('h2', { className: 'font-serif-luxury text-2xl font-normal text-[var(--text-primary)]' }, 'AUDIT TRAIL'),
            h('p', { className: 'text-xs text-[var(--text-secondary)]' }, `${queryHistory.length} query records`)
          ),
          h('button', {
            onClick: async () => { await fetch(`${API_BASE}/api/history`, { method: "DELETE" }); fetchHistory(); showToast("Audit history cleared."); },
            className: 'btn-ghost-luxury px-4 py-2 rounded-xl text-xs font-semibold'
          }, 'Clear History')
        ),
        h('div', { className: 'luxury-card rounded-2xl overflow-hidden' },
          h('div', { className: 'overflow-x-auto' },
            h('table', { className: 'w-full text-left text-xs font-mono' },
              h('thead', { className: 'bg-[var(--bg-surface-soft)] text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-subtle)]' },
                h('tr', null,
                  h('th', { className: 'p-3.5 font-semibold text-[10px]' }, 'Time'),
                  h('th', { className: 'p-3.5 font-semibold text-[10px]' }, 'Question'),
                  h('th', { className: 'p-3.5 font-semibold text-[10px]' }, 'SQL'),
                  h('th', { className: 'p-3.5 font-semibold text-[10px]' }, 'Status'),
                  h('th', { className: 'p-3.5 font-semibold text-[10px]' }, 'Score'),
                  h('th', { className: 'p-3.5 font-semibold text-[10px]' }, 'ms'),
                  h('th', { className: 'p-3.5 font-semibold text-[10px]' }, 'Rows')
                )
              ),
              h('tbody', { className: 'divide-y divide-[var(--border-subtle)] bg-[var(--bg-surface)]' },
                queryHistory.length === 0
                  ? h('tr', null, h('td', { colSpan: 7, className: 'p-8 text-center text-[var(--text-muted)] font-sans' }, 'No audit records yet.'))
                  : queryHistory.map(item =>
                      h('tr', { key: item.id, className: 'hover:bg-[var(--bg-surface-soft)] transition' },
                        h('td', { className: 'p-3.5 text-[var(--text-muted)] whitespace-nowrap text-[11px]' }, item.timestamp),
                        h('td', { className: 'p-3.5 text-[var(--text-primary)] font-sans max-w-xs truncate font-semibold text-[11px]' }, item.question),
                        h('td', { className: 'p-3.5 text-[var(--champagne)] max-w-xs truncate text-[11px]' }, item.sql || '—'),
                        h('td', { className: 'p-3.5' },
                          h('span', { className: `px-2 py-0.5 rounded text-[9px] font-bold ${item.verification_status === 'VERIFIED' ? 'badge-verified-luxury' : item.verification_status === 'NEEDS REVIEW' ? 'badge-warning-luxury' : 'badge-danger-luxury'}` },
                            item.verification_status || item.status
                          )
                        ),
                        h('td', { className: 'p-3.5 font-bold text-[var(--text-primary)] text-[11px]' }, item.reliability_score ? `${item.reliability_score}/100` : '—'),
                        h('td', { className: 'p-3.5 text-[var(--text-secondary)] text-[11px]' }, item.execution_time_ms),
                        h('td', { className: 'p-3.5 text-[var(--text-primary)] text-[11px]' }, item.row_count)
                      )
                    )
              )
            )
          )
        )
      ),

      // =======================================================================
      // INSIGHTS
      // =======================================================================
      activeTab === 'insights' && h('div', { className: 'space-y-6 animate-entrance' },
        h('div', { className: 'space-y-1' },
          h('h2', { className: 'font-serif-luxury text-2xl font-normal text-[var(--text-primary)]' }, 'TRUST & USAGE INSIGHTS')
        ),
        h('div', { className: 'grid grid-cols-2 lg:grid-cols-4 gap-5' },
          [
            { label: "QUERIES ANSWERED", value: String(insightsMetrics.total || '0'), sub: "Natural language questions" },
            { label: "VERIFIED RATE", value: insightsMetrics.verifiedPct, sub: "Grounded database answers" },
            { label: "AVG RELIABILITY", value: insightsMetrics.avgReliability, sub: "Score out of 100" },
            { label: "AVG RESPONSE TIME", value: insightsMetrics.avgLatency, sub: "End-to-end with verification" },
          ].map((m, i) =>
            h('div', { key: i, className: 'luxury-card rounded-2xl p-5 space-y-2' },
              h('span', { className: 'text-[9px] font-mono tracking-widest text-[var(--text-muted)] uppercase font-semibold' }, m.label),
              h('p', { className: 'text-3xl font-serif-luxury text-[var(--text-primary)] font-normal pt-1' }, m.value),
              h('p', { className: 'text-[11px] text-[var(--text-muted)]' }, m.sub)
            )
          )
        ),
        h('div', { className: 'luxury-card rounded-2xl p-6 space-y-4' },
          h('h3', { className: 'font-serif-luxury text-lg text-[var(--text-primary)]' }, 'HOW NEURA-X VERIFIES GROUNDING'),
          h('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-5 text-xs' },
            [
              { num: '01', title: 'Read-Only Local Sandbox', desc: 'All SQL is enforced read-only. No writes, DDL, or data modifications ever execute.' },
              { num: '02', title: 'Grounding Verification Matrix', desc: 'Every number, entity, and aggregate in the answer is cross-checked against returned rows.' },
              { num: '03', title: 'Evidence-Grounded Defense', desc: 'Unsupported claims are flagged with transparent, mathematically verifiable audit rationale.' },
            ].map(l =>
              h('div', { key: l.num, className: 'space-y-1.5' },
                h('span', { className: 'text-[var(--champagne)] font-mono font-bold text-[11px]' }, `${l.num}. ${l.title}`),
                h('p', { className: 'text-[var(--text-secondary)] leading-relaxed' }, l.desc)
              )
            )
          )
        )
      ),

      // =======================================================================
      // VERIFICATION LAB
      // =======================================================================
      activeTab === 'hallucination' && h(HallucinationLabWorkspace, {
        activeDb,
        databases,
        showToast,
      })

    ),

    // ── SETTINGS MODAL ───────────────────────────────────────────────────────
    isSettingsOpen && h('div', { className: 'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-entrance' },
      h('div', { className: 'luxury-card rounded-2xl max-w-md w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto border border-[var(--border-medium)] shadow-2xl' },
        h('div', { className: 'flex items-center justify-between border-b border-[var(--border-subtle)] pb-4' },
          h('div', null,
            h('h3', { className: 'font-serif-luxury text-lg text-[var(--text-primary)]' }, 'CONFIGURATION'),
            h('p', { className: 'text-xs text-[var(--text-secondary)] mt-0.5' }, 'Engine settings, theme, verification tools')
          ),
          h('button', { onClick: () => setIsSettingsOpen(false), className: 'text-[var(--text-muted)] hover:text-[var(--text-primary)] p-2 rounded-lg bg-[var(--bg-surface-soft)] text-lg leading-none' }, '✕')
        ),

        h('form', {
          onSubmit: async (e) => {
            e.preventDefault();
            try {
              const r = await fetch(`${API_BASE}/api/settings`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ llm_provider: settingsData.llm_provider, gemini_api_key: settingsData.gemini_key_input || undefined, openai_api_key: settingsData.openai_key_input || undefined, model_name: settingsData.model_name })
              });
              if (r.ok) { showToast("Configuration saved."); fetchSettings(); setIsSettingsOpen(false); }
            } catch (err) { showToast(`Error: ${err.message}`); }
          },
          className: 'space-y-4 text-xs'
        },

          h('div', null,
            h('label', { className: 'block text-[var(--text-muted)] font-mono uppercase tracking-wider mb-2 font-semibold text-[10px]' }, 'Theme'),
            h('div', { className: 'grid grid-cols-2 gap-2' },
              [{ v: 'dark', icon: 'moon', label: 'Dark' }, { v: 'light', icon: 'sun', label: 'Light' }].map(t =>
                h('button', { key: t.v, type: 'button', onClick: () => setTheme(t.v), className: `p-2.5 rounded-xl border flex items-center justify-center space-x-2 text-xs font-semibold ${theme === t.v ? 'bg-[var(--champagne-dim)] border-[var(--champagne-border)] text-[var(--champagne)]' : 'bg-[var(--bg-surface-soft)] border-[var(--border-subtle)] text-[var(--text-secondary)]'}` },
                  h(Icon, { name: t.icon, className: 'w-3.5 h-3.5' }),
                  h('span', null, t.label)
                )
              )
            )
          ),

          h('div', null,
            h('label', { className: 'block text-[var(--text-muted)] font-mono uppercase tracking-wider mb-2 font-semibold text-[10px]' }, 'AI Engine'),
            h('select', { value: settingsData.llm_provider, onChange: e => setSettingsData({ ...settingsData, llm_provider: e.target.value }), className: 'w-full bg-[var(--bg-surface-soft)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[var(--text-primary)] outline-none focus:border-[var(--champagne)] font-medium' },
              h('option', { value: 'offline' }, 'Smart Heuristic Engine (Offline Local Engine)'),
              h('option', { value: 'gemini' }, 'Google Gemini API'),
              h('option', { value: 'openai' }, 'OpenAI API'),
              h('option', { value: 'ollama' }, 'Local Ollama')
            )
          ),

          settingsData.llm_provider === 'gemini' && h('div', null,
            h('label', { className: 'block text-[var(--text-muted)] font-mono uppercase tracking-wider mb-2 font-semibold text-[10px]' }, 'Gemini API Key'),
            h('input', { type: 'password', placeholder: 'AIzaSy...', value: settingsData.gemini_key_input, onChange: e => setSettingsData({ ...settingsData, gemini_key_input: e.target.value }), className: 'w-full bg-[var(--bg-surface-soft)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[var(--text-primary)] outline-none focus:border-[var(--champagne)] font-mono' })
          ),

          settingsData.llm_provider === 'openai' && h('div', null,
            h('label', { className: 'block text-[var(--text-muted)] font-mono uppercase tracking-wider mb-2 font-semibold text-[10px]' }, 'OpenAI API Key'),
            h('input', { type: 'password', placeholder: 'sk-...', value: settingsData.openai_key_input, onChange: e => setSettingsData({ ...settingsData, openai_key_input: e.target.value }), className: 'w-full bg-[var(--bg-surface-soft)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[var(--text-primary)] outline-none focus:border-[var(--champagne)] font-mono' })
          ),

          h('button', { type: 'submit', className: 'btn-champagne w-full py-2.5 rounded-xl font-bold' }, 'Save Configuration'),

          h('div', { className: 'pt-2' },
            h('button', {
              type: 'button',
              onClick: () => { setActiveTab('hallucination'); setIsSettingsOpen(false); },
              className: 'w-full py-2.5 px-3 rounded-xl border border-[var(--champagne-border)] bg-[var(--champagne-dim)] text-[var(--champagne)] font-semibold text-xs flex items-center justify-center space-x-2 hover:bg-[var(--champagne-border)] transition'
            },
              h(Icon, { name: 'shieldZap', className: 'w-3.5 h-3.5' }),
              h('span', null, 'Open Verification Lab')
            )
          )
        ),

        // CSV upload
        h('div', { className: 'pt-4 border-t border-[var(--border-subtle)] space-y-3' },
          h('span', { className: 'text-[10px] font-mono text-[var(--text-muted)] uppercase block font-semibold' }, 'IMPORT CSV DATASET'),
          h('div', { className: 'border border-dashed border-[var(--border-medium)] rounded-xl p-5 text-center space-y-2 bg-[var(--bg-surface-soft)]' },
            h(Icon, { name: 'upload', className: 'w-6 h-6 text-[var(--champagne)] mx-auto' }),
            h('p', { className: 'text-xs text-[var(--text-primary)] font-medium' }, 'Upload any CSV file as a queryable table'),
            h('input', { type: 'file', accept: '.csv', onChange: handleCSVUpload, className: 'text-xs text-[var(--text-muted)] file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-[var(--bg-surface)] file:text-[var(--champagne)] cursor-pointer' })
          ),
          uploadStatus && h('p', { className: 'text-xs bg-[var(--bg-surface-soft)] p-3 rounded-xl text-[var(--champagne)] font-mono' }, uploadStatus)
        )
      )
    )
  );
}

// Bootstrap
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(h(App));
