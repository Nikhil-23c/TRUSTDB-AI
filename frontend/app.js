const { useState, useEffect, useRef, createElement: h } = React;

const API_BASE = "";

// High-Fidelity SVG Icons Helper
function Icon({ name, className = "w-4 h-4" }) {
  const iconPaths = {
    bot: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('rect', { x: 3, y: 11, width: 18, height: 10, rx: 3, strokeWidth: 2 }),
      h('circle', { cx: 12, cy: 5, r: 2, strokeWidth: 2 }),
      h('path', { d: 'M12 7v4', strokeWidth: 2, strokeLinecap: 'round' }),
      h('line', { x1: 8, y1: 16, x2: 8, y2: 16, strokeWidth: 3, strokeLinecap: 'round' }),
      h('line', { x1: 16, y1: 16, x2: 16, y2: 16, strokeWidth: 3, strokeLinecap: 'round' })
    ),
    user: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('path', { d: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2', strokeWidth: 2, strokeLinecap: 'round' }),
      h('circle', { cx: 12, cy: 7, r: 4, strokeWidth: 2 })
    ),
    sparkles: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('path', { d: 'm12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' })
    ),
    database: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('ellipse', { cx: 12, cy: 5, rx: 9, ry: 3, strokeWidth: 2 }),
      h('path', { d: 'M21 12c0 1.66-4 3-9 3s-9-1.34-9-3', strokeWidth: 2 }),
      h('path', { d: 'M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5', strokeWidth: 2 })
    ),
    table: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('rect', { width: 18, height: 18, x: 3, y: 3, rx: 2, strokeWidth: 2 }),
      h('path', { d: 'M3 9h18', strokeWidth: 2 }),
      h('path', { d: 'M3 15h18', strokeWidth: 2 }),
      h('path', { d: 'M9 3v18', strokeWidth: 2 }),
      h('path', { d: 'M15 3v18', strokeWidth: 2 })
    ),
    chart: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('line', { x1: 18, y1: 20, x2: 18, y2: 10, strokeWidth: 2, strokeLinecap: 'round' }),
      h('line', { x1: 12, y1: 20, x2: 12, y2: 4, strokeWidth: 2, strokeLinecap: 'round' }),
      h('line', { x1: 6, y1: 20, x2: 6, y2: 14, strokeWidth: 2, strokeLinecap: 'round' })
    ),
    code: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('polyline', { points: '16 18 22 12 16 6', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      h('polyline', { points: '8 6 2 12 8 18', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' })
    ),
    terminal: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('polyline', { points: '4 17 10 11 4 5', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      h('line', { x1: 12, x2: 20, y1: 19, y2: 19, strokeWidth: 2, strokeLinecap: 'round' })
    ),
    send: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('line', { x1: 22, y1: 2, x2: 11, y2: 13, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      h('polygon', { points: '22 2 15 22 11 13 2 9 22 2', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' })
    ),
    mic: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('path', { d: 'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z', strokeWidth: 2 }),
      h('path', { d: 'M19 10v2a7 7 0 0 1-14 0v-2', strokeWidth: 2, strokeLinecap: 'round' }),
      h('line', { x1: 12, x2: 12, y1: 19, y2: 22, strokeWidth: 2, strokeLinecap: 'round' })
    ),
    copy: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('rect', { width: 14, height: 14, x: 8, y: 8, rx: 2, ry: 2, strokeWidth: 2 }),
      h('path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2', strokeWidth: 2 })
    ),
    download: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', strokeWidth: 2, strokeLinecap: 'round' }),
      h('polyline', { points: '7 10 12 15 17 10', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      h('line', { x1: 12, x2: 12, y1: 15, y2: 3, strokeWidth: 2, strokeLinecap: 'round' })
    ),
    chevronDown: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('polyline', { points: '6 9 12 15 18 9', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' })
    ),
    chevronRight: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('polyline', { points: '9 18 15 12 9 6', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' })
    ),
    trash: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('path', { d: 'M3 6h18', strokeWidth: 2, strokeLinecap: 'round' }),
      h('path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6', strokeWidth: 2, strokeLinecap: 'round' }),
      h('path', { d: 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2', strokeWidth: 2, strokeLinecap: 'round' })
    ),
    settings: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('circle', { cx: 12, cy: 12, r: 3, strokeWidth: 2 }),
      h('path', { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z', strokeWidth: 2 })
    ),
    history: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('circle', { cx: 12, cy: 12, r: 10, strokeWidth: 2 }),
      h('polyline', { points: '12 6 12 12 16 14', strokeWidth: 2, strokeLinecap: 'round' })
    ),
    shieldCheck: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      h('polyline', { points: '9 12 11 14 15 10', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' })
    ),
    zap: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('polygon', { points: '13 2 3 14 12 14 11 22 21 10 12 10 13 2', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' })
    ),
    check: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('polyline', { points: '20 6 9 17 4 12', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' })
    ),
    upload: h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', strokeWidth: 2, strokeLinecap: 'round' }),
      h('polyline', { points: '17 8 12 3 7 8', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      h('line', { x1: 12, y1: 3, x2: 12, y2: 15, strokeWidth: 2, strokeLinecap: 'round' })
    )
  };

  return iconPaths[name] || h('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    h('circle', { cx: 12, cy: 12, r: 10, strokeWidth: 2 })
  );
}

// Markdown Parser Helper Component
function MarkdownText({ text }) {
  if (!text) return null;
  const lines = text.split('\n');
  return h('div', { className: 'space-y-1.5 font-normal leading-relaxed text-slate-100' },
    lines.map((line, lIdx) => {
      if (!line.trim()) return h('div', { key: lIdx, className: 'h-1.5' });
      
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
            elements.push(h('strong', { key: key++, className: 'font-bold text-cyan-300' }, firstMatch[1]));
          } else if (matchType === 'code') {
            elements.push(h('code', { key: key++, className: 'bg-slate-900 px-1.5 py-0.5 rounded text-cyan-300 font-mono text-xs border border-slate-800' }, firstMatch[1]));
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

// Preset Prompts Catalog
const PROMPTS = {
  college_records: [
    { title: "Students Alphabetical", query: "Show all student names in alphabetical order", icon: "user" },
    { title: "Top 5 CGPA", query: "Show me the top 5 students with highest CGPA", icon: "sparkles" },
    { title: "Attendance < 75%", query: "List all students with attendance less than 75%", icon: "zap" },
    { title: "Avg CGPA by Dept", query: "What is the average CGPA per department?", icon: "chart" },
    { title: "Faculty by Salary", query: "List all faculty ordered by salary", icon: "table" }
  ],
  ecommerce_store: [
    { title: "Customer Names", query: "List all customers in alphabetical order", icon: "user" },
    { title: "Top 5 Products", query: "What are the top 5 most expensive products?", icon: "sparkles" },
    { title: "Revenue by Order Status", query: "Total orders and revenue by order status", icon: "chart" },
    { title: "Memberships Breakdown", query: "Customer count by membership tier", icon: "table" }
  ],
  healthcare: [
    { title: "Doctor Names", query: "List all doctors in alphabetical order", icon: "user" },
    { title: "Doctor Experience", query: "List doctors ordered by experience years", icon: "sparkles" },
    { title: "Patient Blood Groups", query: "Show patient count by blood group", icon: "chart" },
    { title: "Billing Totals", query: "Total billing amount by payment status", icon: "table" }
  ]
};

function App() {
  const [databases, setDatabases] = useState([]);
  const [activeDb, setActiveDb] = useState("college_records");
  const [schemaData, setSchemaData] = useState(null);
  const [activeView, setActiveView] = useState("agent"); // 'agent', 'schema', 'history', 'settings'
  const [canvasTab, setCanvasTab] = useState("visuals"); // 'visuals', 'table', 'sql'
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Multi-Turn Chat Messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "agent",
      timestamp: "Just now",
      text: "Hello! I am your **Neura X Database Intelligence Agent**.\n\nAsk me any question in plain English about your connected databases, and I'll generate schema-validated SQL, execute it safely in a read-only sandbox, and visualize the findings.",
      isInitial: true
    }
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [directSqlMode, setDirectSqlMode] = useState(false);
  const [expandedReasoning, setExpandedReasoning] = useState({});
  const [tableSearch, setTableSearch] = useState("");
  const [chartTypeOverride, setChartTypeOverride] = useState(null);

  // Settings & History
  const [queryHistory, setQueryHistory] = useState([]);
  const [settingsData, setSettingsData] = useState({
    llm_provider: "offline",
    has_gemini_key: false,
    has_openai_key: false,
    model_name: "gemini-2.5-flash",
    gemini_key_input: "",
    openai_key_input: ""
  });
  const [uploadStatus, setUploadStatus] = useState(null);

  const chatBottomRef = useRef(null);
  const chartCanvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Init Data
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

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAnalyzing]);

  // Chart Rendering in Canvas
  useEffect(() => {
    if (currentResult && currentResult.chart && chartCanvasRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      try {
        const ctx = chartCanvasRef.current.getContext('2d');
        const targetType = chartTypeOverride || currentResult.chart.type;
        chartInstanceRef.current = new Chart(ctx, {
          type: targetType,
          data: currentResult.chart.data,
          options: {
            ...currentResult.chart.options,
            animation: { duration: 500 },
            responsive: true,
            maintainAspectRatio: false
          }
        });
      } catch (err) {
        console.error("Canvas Chart Render Error:", err);
      }
    }
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [currentResult, canvasTab, chartTypeOverride, activeView]);

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

  // Submit Query to Agent
  const handleSendQuery = async (queryText = inputQuery) => {
    const textToRun = (queryText || "").trim();
    if (!textToRun || isAnalyzing) return;

    const userMsgId = Date.now();
    const userMsg = {
      id: userMsgId,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: textToRun
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery("");
    setIsAnalyzing(true);
    setChartTypeOverride(null);

    try {
      const payload = {
        question: textToRun,
        database_id: activeDb,
        provider: settingsData.llm_provider,
        api_key: settingsData.llm_provider === "gemini" ? settingsData.gemini_key_input : settingsData.openai_key_input,
        model_name: settingsData.model_name,
        custom_sql: directSqlMode ? textToRun : null
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
      setExpandedReasoning(prev => ({ ...prev, [userMsgId + 1]: true }));

      const agentMsg = {
        id: userMsgId + 1,
        sender: "agent",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: data.natural_answer,
        result: data
      };

      setMessages(prev => [...prev, agentMsg]);
      fetchHistory();
    } catch (err) {
      const errorMsg = {
        id: userMsgId + 1,
        sender: "agent",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
        text: `⚠️ **Agent Error**: ${err.message}`
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsAnalyzing(false);
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

  // Exports
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
    a.download = `dataset_${activeDb}_${Date.now()}.csv`;
    a.click();
    showToast("Exported CSV successfully!");
  };

  const exportJSON = () => {
    if (!currentResult || !currentResult.rows.length) return;
    const blob = new Blob([JSON.stringify(currentResult.rows, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dataset_${activeDb}_${Date.now()}.json`;
    a.click();
    showToast("Exported JSON successfully!");
  };

  // CSV Importer
  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setUploadStatus("Importing CSV into SQLite engine with type inference...");
    try {
      const res = await fetch(`${API_BASE}/api/databases/upload-csv`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      setUploadStatus(`✅ Imported table '${data.table_name}' (${data.row_count} rows). Ready to query!`);
      showToast(`Imported ${data.table_name} successfully!`);
      await fetchDatabases();
      setActiveDb(data.database_id);
    } catch (err) {
      setUploadStatus(`❌ ${err.message}`);
      showToast(`Error: ${err.message}`);
    }
  };

  const activePresets = PROMPTS[activeDb] || (schemaData && schemaData.tables && schemaData.tables.length > 0 ? [
    { title: "Overview Query", query: `Show all records from ${schemaData.tables[0].name}`, icon: "table" },
    { title: "Count Records", query: `How many total records are in ${schemaData.tables[0].name}?`, icon: "sparkles" },
    { title: "Top 5 Records", query: `Show top 5 records from ${schemaData.tables[0].name}`, icon: "zap" }
  ] : PROMPTS.college_records);

  const studioFilteredRows = currentResult && currentResult.rows
    ? currentResult.rows.filter(row => {
        if (!tableSearch) return true;
        return Object.values(row).some(v => String(v).toLowerCase().includes(tableSearch.toLowerCase()));
      })
    : [];

  return h('div', { className: 'min-h-screen flex flex-col bg-[#05070d] text-slate-100 bg-grid-pattern selection:bg-cyan-500 selection:text-white relative' },
    
    // Toast Notification
    toastMessage && h('div', { className: 'fixed bottom-6 right-6 z-50 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center space-x-2 border border-cyan-400/40 animate-message' },
      h(Icon, { name: 'check', className: 'w-4 h-4 text-emerald-300' }),
      h('span', null, toastMessage)
    ),

    // Top Command Navigation Header
    h('header', { className: 'glass-nav sticky top-0 z-50 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 shadow-lg' },
      
      // Brand
      h('div', { className: 'flex items-center space-x-3.5' },
        h('div', { className: 'agent-avatar-glow w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25' },
          h(Icon, { name: 'bot', className: 'w-5 h-5' })
        ),
        h('div', null,
          h('div', { className: 'flex items-center space-x-2' },
            h('span', { className: 'font-black text-lg tracking-tight gradient-text-agent' }, 'NEURA X'),
            h('span', { className: 'bg-cyan-500/10 text-cyan-400 text-[10px] px-2 py-0.5 rounded-full font-bold border border-cyan-500/30 tracking-wider uppercase' }, 'AI Agent PS7'),
            h('span', { className: 'flex h-2 w-2 relative' },
              h('span', { className: 'animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75' }),
              h('span', { className: 'relative inline-flex rounded-full h-2 w-2 bg-emerald-500' })
            )
          ),
          h('p', { className: 'text-[11px] text-slate-400 font-medium' }, 'Autonomous Database Question-Answering & Intelligence')
        )
      ),

      // Target Database Selector
      h('div', { className: 'flex items-center space-x-3' },
        h('div', { className: 'flex items-center bg-[#0d1322] border border-slate-800 rounded-xl px-3.5 py-1.5 shadow-inner' },
          h(Icon, { name: 'database', className: 'w-4 h-4 text-cyan-400 mr-2' }),
          h('span', { className: 'text-xs text-slate-400 mr-2 font-medium' }, 'Active DB:'),
          h('select', {
            value: activeDb,
            onChange: (e) => {
              setActiveDb(e.target.value);
              setCurrentResult(null);
            },
            className: 'bg-transparent text-xs font-bold text-cyan-300 outline-none cursor-pointer'
          },
            databases.map(db => h('option', { key: db.id, value: db.id, className: 'bg-[#090d16] text-slate-200' }, db.name))
          )
        ),
        h('div', { className: 'hidden lg:flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold' },
          h(Icon, { name: 'shieldCheck', className: 'w-3.5 h-3.5' }),
          h('span', null, 'Read-Only Sandbox')
        )
      ),

      // Navigation Tabs
      h('nav', { className: 'flex items-center space-x-1 bg-[#090d16] p-1 rounded-xl border border-slate-800/90' },
        [
          { id: 'agent', label: 'Agent Chat', icon: 'bot' },
          { id: 'schema', label: 'Schema Catalog', icon: 'table' },
          { id: 'history', label: 'Audit Trail', icon: 'history' },
          { id: 'settings', label: 'Config & Data', icon: 'settings' }
        ].map(tab => h('button', {
          key: tab.id,
          onClick: () => setActiveView(tab.id),
          className: `flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeView === tab.id
              ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`
        },
          h(Icon, { name: tab.icon, className: 'w-3.5 h-3.5' }),
          h('span', null, tab.label)
        ))
      )
    ),

    // Main Workspace
    h('div', { className: 'flex-1 flex overflow-hidden' },
      
      // VIEW 1: AGENT CHAT & LIVE STUDIO CANVAS
      activeView === 'agent' && h('div', { className: 'flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden' },
        
        // Left Column: Chat Conversation Stream
        h('div', { className: `flex flex-col h-[calc(100vh-64px)] border-r border-slate-800/70 bg-[#05070d]/95 ${currentResult ? 'lg:col-span-6 xl:col-span-5' : 'lg:col-span-12 max-w-4xl mx-auto w-full border-r-0'}` },
          
          // Stream Header
          h('div', { className: 'px-6 py-3 border-b border-slate-800/70 flex items-center justify-between bg-[#080c16]/90 backdrop-blur' },
            h('div', { className: 'flex items-center space-x-2' },
              h(Icon, { name: 'sparkles', className: 'w-4 h-4 text-cyan-400' }),
              h('span', { className: 'text-xs font-bold text-slate-300 uppercase tracking-wider' }, 'Agent Conversation Stream')
            ),
            h('button', {
              onClick: () => {
                setMessages([{
                  id: Date.now(),
                  sender: 'agent',
                  timestamp: 'Just now',
                  text: 'Conversation cleared. Ask me any new question about the active database!',
                  isInitial: true
                }]);
                setCurrentResult(null);
              },
              className: 'text-[11px] text-slate-400 hover:text-rose-400 flex items-center space-x-1 px-2.5 py-1 rounded-lg hover:bg-slate-800/40 transition'
            },
              h(Icon, { name: 'trash', className: 'w-3 h-3' }),
              h('span', null, 'Reset Chat')
            )
          ),

          // Message Feed
          h('div', { className: 'flex-1 overflow-y-auto p-6 space-y-6' },
            messages.map(msg => h('div', {
              key: msg.id,
              className: `flex items-start space-x-3 animate-message ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`
            },
              msg.sender === 'agent' && h('div', { className: 'w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-cyan-500/20' },
                h(Icon, { name: 'bot', className: 'w-4 h-4' })
              ),

              h('div', { className: `max-w-[88%] space-y-3 ${msg.sender === 'user' ? 'items-end' : 'items-start'}` },
                
                // Message Bubble
                h('div', {
                  className: `p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-tr-sm shadow-md'
                      : msg.isError
                      ? 'bg-rose-950/40 border border-rose-500/40 text-rose-200 rounded-tl-sm'
                      : 'glass-panel text-slate-100 rounded-tl-sm shadow-xl'
                  }`
                },
                  msg.sender === 'user'
                    ? h('div', { className: 'whitespace-pre-line font-medium' }, msg.text)
                    : h(MarkdownText, { text: msg.text }),

                  // Badges
                  h('div', { className: `mt-2 flex items-center space-x-2 text-[10px] ${msg.sender === 'user' ? 'text-cyan-100/70 justify-end' : 'text-slate-400'}` },
                    h('span', null, msg.timestamp),
                    msg.result && h('span', null, '•'),
                    msg.result && h('span', { className: 'text-cyan-400 font-mono font-bold' }, `${msg.result.execution_time_ms}ms`),
                    msg.result && h('span', null, '•'),
                    msg.result && h('span', { className: 'text-emerald-400 font-bold' }, `${msg.result.row_count} rows`)
                  )
                ),

                // Reasoning Accordion
                msg.result && h('div', { className: 'glass-panel rounded-xl overflow-hidden border border-slate-800/80 text-xs' },
                  h('button', {
                    onClick: () => setExpandedReasoning(prev => ({ ...prev, [msg.id]: !prev[msg.id] })),
                    className: 'w-full px-3.5 py-2 flex items-center justify-between bg-slate-900/60 hover:bg-slate-900 transition text-slate-300 font-medium'
                  },
                    h('span', { className: 'flex items-center space-x-2' },
                      h('span', { className: 'w-2 h-2 rounded-full bg-cyan-400 animate-pulse' }),
                      h('span', { className: 'font-bold text-cyan-300' }, 'Agent Reasoning & Execution Steps')
                    ),
                    h(Icon, { name: expandedReasoning[msg.id] ? 'chevronDown' : 'chevronRight', className: 'w-3.5 h-3.5 text-slate-400' })
                  ),

                  expandedReasoning[msg.id] && h('div', { className: 'p-3.5 space-y-3 bg-[#080c16]/95 font-mono text-[11px] border-t border-slate-800/60 text-slate-300' },
                    h('div', { className: 'flex items-start space-x-2' },
                      h('span', { className: 'text-cyan-400 font-bold' }, '1.'),
                      h('div', null,
                        h('span', { className: 'text-slate-400' }, 'Intent: '),
                        h('span', { className: 'text-cyan-300 font-bold' }, msg.result.intent),
                        h('div', { className: 'flex flex-wrap gap-1 mt-1' },
                          msg.result.entities?.map((ent, i) => h('span', { key: i, className: 'bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-300' }, ent))
                        )
                      )
                    ),
                    h('div', { className: 'flex items-start space-x-2' },
                      h('span', { className: 'text-indigo-400 font-bold' }, '2.'),
                      h('div', { className: 'w-full' },
                        h('span', { className: 'text-slate-400' }, 'Generated SQL:'),
                        h('div', { className: 'mt-1 p-2 rounded bg-slate-950 text-cyan-300 border border-slate-800/80 flex items-center justify-between' },
                          h('span', { className: 'overflow-x-auto' }, msg.result.sanitized_sql),
                          h('button', {
                            onClick: () => {
                              navigator.clipboard.writeText(msg.result.sanitized_sql);
                              showToast("Copied SQL query to clipboard!");
                            },
                            className: 'ml-2 text-slate-400 hover:text-white p-1'
                          },
                            h(Icon, { name: 'copy', className: 'w-3 h-3' })
                          )
                        )
                      )
                    ),
                    h('div', { className: 'flex items-start space-x-2' },
                      h('span', { className: 'text-emerald-400 font-bold' }, '3.'),
                      h('div', null,
                        h('span', { className: 'text-slate-400' }, 'Status: '),
                        h('span', { className: 'text-emerald-400 font-bold' }, '100% Read-Only Enforced'),
                        h('span', { className: 'text-slate-500' }, ` • ${msg.result.provider_used}`)
                      )
                    )
                  )
                )
              ),

              msg.sender === 'user' && h('div', { className: 'w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0' },
                h(Icon, { name: 'user', className: 'w-4 h-4' })
              )
            )),

            isAnalyzing && h('div', { className: 'flex items-start space-x-3 animate-message' },
              h('div', { className: 'w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shrink-0 animate-pulse' },
                h(Icon, { name: 'bot', className: 'w-4 h-4' })
              ),
              h('div', { className: 'glass-panel p-4 rounded-2xl max-w-sm space-y-2 thinking-shimmer' },
                h('div', { className: 'flex items-center space-x-2 text-xs font-bold text-cyan-300' },
                  h('span', { className: 'w-2 h-2 rounded-full bg-cyan-400 animate-ping' }),
                  h('span', null, 'Agent Reasoning & Executing SQL...')
                ),
                h('div', { className: 'h-2 bg-slate-800/80 rounded w-48' }),
                h('div', { className: 'h-2 bg-slate-800/80 rounded w-32' })
              )
            ),

            h('div', { ref: chatBottomRef })
          ),

          // Bottom Prompt Input Bar
          h('div', { className: 'p-4 border-t border-slate-800/80 bg-[#060911]/95 backdrop-blur space-y-3' },
            
            // Suggested Chips
            h('div', { className: 'flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs' },
              h('span', { className: 'text-[10px] text-slate-500 font-bold uppercase tracking-wider whitespace-nowrap' }, 'Suggested:'),
              activePresets.map((p, idx) => h('button', {
                key: idx,
                onClick: () => handleSendQuery(p.query),
                className: 'text-[11px] bg-slate-900/90 hover:bg-slate-800 text-slate-300 px-3 py-1 rounded-full whitespace-nowrap border border-slate-800 hover:border-cyan-500/40 transition flex items-center space-x-1.5'
              },
                h(Icon, { name: p.icon, className: 'w-3 h-3 text-cyan-400' }),
                h('span', null, p.title)
              ))
            ),

            // Command Input
            h('div', { className: 'relative flex items-center bg-[#0b101d] border border-slate-700/80 rounded-2xl px-4 py-3 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20 transition shadow-2xl' },
              
              h('button', {
                onClick: () => setDirectSqlMode(!directSqlMode),
                className: `mr-2.5 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider transition border ${
                  directSqlMode ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                }`
              }, directSqlMode ? 'RAW SQL' : 'NATURAL AI'),

              h('input', {
                type: 'text',
                value: inputQuery,
                onChange: (e) => setInputQuery(e.target.value),
                onKeyDown: (e) => e.key === 'Enter' && handleSendQuery(),
                placeholder: directSqlMode ? 'Enter read-only SELECT SQL query...' : 'Ask your database anything in plain English (e.g., student names in alphabetical order)...',
                className: 'w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none font-medium',
                disabled: isAnalyzing
              }),

              h('button', {
                onClick: handleVoiceToggle,
                title: 'Voice Input',
                className: `p-2 rounded-xl transition mr-1 flex items-center justify-center ${isListening ? 'bg-rose-500/20 text-rose-400' : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60'}`
              },
                isListening
                  ? h('div', { className: 'flex items-center space-x-0.5' },
                      h('span', { className: 'w-1 bg-rose-400 wave-bar-1 rounded' }),
                      h('span', { className: 'w-1 bg-rose-400 wave-bar-2 rounded' }),
                      h('span', { className: 'w-1 bg-rose-400 wave-bar-3 rounded' })
                    )
                  : h(Icon, { name: 'mic', className: 'w-4 h-4' })
              ),

              h('button', {
                onClick: () => handleSendQuery(),
                disabled: isAnalyzing || !inputQuery.trim(),
                className: 'gradient-btn p-2 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shrink-0 shadow-md'
              },
                h(Icon, { name: 'send', className: 'w-4 h-4' })
              )
            )
          )
        ),

        // Right Column: Live Studio Canvas
        currentResult && h('div', { className: 'lg:col-span-6 xl:col-span-7 flex flex-col h-[calc(100vh-64px)] bg-[#070b14] overflow-hidden' },
          
          // Studio Header
          h('div', { className: 'px-6 py-3 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-[#0a0f1d]' },
            
            // Tabs
            h('div', { className: 'flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800' },
              [
                { id: 'visuals', label: 'Visual Analytics', icon: 'chart' },
                { id: 'table', label: 'Data Grid', icon: 'table' },
                { id: 'sql', label: 'SQL Inspector', icon: 'code' }
              ].map(tab => h('button', {
                key: tab.id,
                onClick: () => setCanvasTab(tab.id),
                className: `flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                  canvasTab === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`
              },
                h(Icon, { name: tab.icon, className: 'w-3.5 h-3.5' }),
                h('span', null, tab.label)
              ))
            ),

            // Export Actions
            h('div', { className: 'flex items-center space-x-2' },
              h('button', {
                onClick: exportCSV,
                className: 'bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700/80 flex items-center space-x-1.5 transition font-semibold'
              },
                h(Icon, { name: 'download', className: 'w-3.5 h-3.5 text-cyan-400' }),
                h('span', null, 'Export CSV')
              ),
              h('button', {
                onClick: exportJSON,
                className: 'bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700/80 flex items-center space-x-1.5 transition font-semibold'
              },
                h('span', null, 'JSON')
              )
            )
          ),

          // Studio Content
          h('div', { className: 'flex-1 overflow-y-auto p-6 space-y-6' },
            
            // KPI Cards
            h('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4' },
              h('div', { className: 'glass-panel p-4 rounded-xl space-y-1' },
                h('span', { className: 'text-[10px] text-slate-400 font-bold uppercase tracking-wider' }, 'Total Rows'),
                h('p', { className: 'text-2xl font-black text-cyan-300 font-mono' }, currentResult.row_count)
              ),
              h('div', { className: 'glass-panel p-4 rounded-xl space-y-1' },
                h('span', { className: 'text-[10px] text-slate-400 font-bold uppercase tracking-wider' }, 'Execution Time'),
                h('p', { className: 'text-2xl font-black text-amber-400 font-mono' }, `${currentResult.execution_time_ms} ms`)
              ),
              h('div', { className: 'glass-panel p-4 rounded-xl space-y-1' },
                h('span', { className: 'text-[10px] text-slate-400 font-bold uppercase tracking-wider' }, 'Security Mode'),
                h('p', { className: 'text-xs font-bold text-emerald-400 mt-2' }, 'Read-Only Safe')
              ),
              h('div', { className: 'glass-panel p-4 rounded-xl space-y-1' },
                h('span', { className: 'text-[10px] text-slate-400 font-bold uppercase tracking-wider' }, 'Engine'),
                h('p', { className: 'text-xs font-bold text-slate-300 truncate mt-2' }, currentResult.provider_used)
              )
            ),

            // Tab 1: Visual Analytics
            canvasTab === 'visuals' && h('div', { className: 'glass-panel rounded-2xl p-6 shadow-2xl space-y-4' },
              h('div', { className: 'flex items-center justify-between border-b border-slate-800/80 pb-3' },
                h('div', null,
                  h('h3', { className: 'font-bold text-sm text-slate-100' }, currentResult.chart ? currentResult.chart.title : 'Visual Analytics'),
                  h('p', { className: 'text-xs text-slate-400' }, 'Automated visualization generated by the AI agent')
                ),
                currentResult.chart && h('div', { className: 'flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs' },
                  ['bar', 'line', 'doughnut'].map(t => h('button', {
                    key: t,
                    onClick: () => setChartTypeOverride(t),
                    className: `px-2.5 py-0.5 rounded capitalize transition font-bold ${
                      (chartTypeOverride || currentResult.chart.type) === t ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`
                  }, t))
                )
              ),

              currentResult.chart
                ? h('div', { className: 'w-full h-80 relative' },
                    h('canvas', { ref: chartCanvasRef })
                  )
                : h('div', { className: 'h-64 flex flex-col items-center justify-center text-slate-500 space-y-2' },
                    h(Icon, { name: 'chart', className: 'w-8 h-8 text-slate-600' }),
                    h('p', { className: 'text-xs font-medium' }, 'No numeric chart dimensions found for this query.'),
                    h('button', {
                      onClick: () => setCanvasTab('table'),
                      className: 'text-xs text-cyan-400 font-bold hover:underline'
                    }, 'View Data Grid instead →')
                  )
            ),

            // Tab 2: Data Grid Studio
            canvasTab === 'table' && h('div', { className: 'glass-panel rounded-2xl p-6 shadow-2xl space-y-4' },
              h('div', { className: 'flex items-center justify-between' },
                h('input', {
                  type: 'text',
                  placeholder: 'Filter records...',
                  value: tableSearch,
                  onChange: (e) => setTableSearch(e.target.value),
                  className: 'bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 w-64 outline-none focus:border-cyan-500 font-medium'
                }),
                h('span', { className: 'text-xs text-slate-400 font-mono' },
                  `Showing ${studioFilteredRows.length} of ${currentResult.row_count} records`
                )
              ),

              h('div', { className: 'overflow-x-auto rounded-xl border border-slate-800 max-h-[420px]' },
                h('table', { className: 'w-full text-left text-xs border-collapse font-mono' },
                  h('thead', { className: 'bg-slate-950 text-slate-400 uppercase tracking-wider sticky top-0 border-b border-slate-800' },
                    h('tr', null,
                      currentResult.columns.map((col, idx) => h('th', { key: idx, className: 'p-3 font-bold whitespace-nowrap' }, col.replace(/_/g, ' ')))
                    )
                  ),
                  h('tbody', { className: 'divide-y divide-slate-800/60 bg-[#070b14]/60' },
                    studioFilteredRows.map((row, rIdx) => h('tr', { key: rIdx, className: 'hover:bg-slate-800/40 transition' },
                      currentResult.columns.map((col, cIdx) => h('td', { key: cIdx, className: 'p-3 text-slate-200 whitespace-nowrap' },
                        row[col] !== null && row[col] !== undefined ? String(row[col]) : h('span', { className: 'text-slate-600' }, 'NULL')
                      ))
                    ))
                  )
                )
              )
            ),

            // Tab 3: SQL Inspector
            canvasTab === 'sql' && h('div', { className: 'glass-panel rounded-2xl p-6 shadow-2xl space-y-4' },
              h('div', { className: 'flex items-center justify-between border-b border-slate-800 pb-3' },
                h('span', { className: 'font-bold text-sm text-slate-100 flex items-center space-x-2' },
                  h(Icon, { name: 'terminal', className: 'w-4 h-4 text-cyan-400' }),
                  h('span', null, 'Generated SQL & Execution Sandbox')
                ),
                h('button', {
                  onClick: () => {
                    navigator.clipboard.writeText(currentResult.sanitized_sql);
                    showToast("SQL copied to clipboard!");
                  },
                  className: 'bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-lg border border-slate-700 flex items-center space-x-1 transition font-medium'
                },
                  h(Icon, { name: 'copy', className: 'w-3.5 h-3.5' }),
                  h('span', null, 'Copy')
                )
              ),

              h('pre', { className: 'p-4 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-sm overflow-x-auto leading-relaxed' },
                currentResult.sanitized_sql
              ),

              h('div', { className: 'grid grid-cols-2 gap-4 text-xs' },
                h('div', { className: 'bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1' },
                  h('span', { className: 'text-slate-500 font-bold uppercase' }, 'TARGET SCHEMA'),
                  h('p', { className: 'text-slate-200 font-mono font-medium' }, currentResult.database_id)
                ),
                h('div', { className: 'bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1' },
                  h('span', { className: 'text-slate-500 font-bold uppercase' }, 'SECURITY RESTRICTION'),
                  h('p', { className: 'text-emerald-400 font-mono font-medium' }, 'Read-Only Enforced')
                )
              )
            )

          )
        )
      ),

      // VIEW 2: SCHEMA CATALOG EXPLORER
      activeView === 'schema' && h('div', { className: 'flex-1 overflow-y-auto p-8 space-y-6 max-w-7xl mx-auto w-full' },
        h('div', { className: 'border-b border-slate-800/80 pb-4 flex items-center justify-between' },
          h('div', null,
            h('h2', { className: 'text-2xl font-black text-slate-100 flex items-center space-x-3' },
              h(Icon, { name: 'table', className: 'w-7 h-7 text-cyan-400' }),
              h('span', null, 'Database Schema & Metadata Catalog')
            ),
            h('p', { className: 'text-sm text-slate-400 mt-1 font-medium' },
              `Active Database: `,
              h('span', { className: 'text-cyan-400 font-bold' }, schemaData?.database_name),
              ` (${schemaData?.tables.length || 0} relational tables)`
            )
          )
        ),

        schemaData && h('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' },
          schemaData.tables.map(table => h('div', {
            key: table.name,
            className: 'glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4 hover:border-cyan-500/40 transition'
          },
            h('div', { className: 'flex items-center justify-between border-b border-slate-800/80 pb-3' },
              h('div', { className: 'flex items-center space-x-2' },
                h(Icon, { name: 'database', className: 'w-4 h-4 text-cyan-400' }),
                h('h3', { className: 'font-bold text-slate-100 font-mono text-sm' }, table.name)
              ),
              h('span', { className: 'text-xs bg-slate-900 text-slate-400 border border-slate-800 px-2.5 py-0.5 rounded-full font-mono' },
                `${table.row_count} rows`
              )
            ),

            h('div', { className: 'space-y-1.5 max-h-60 overflow-y-auto pr-1' },
              table.columns.map(col => h('div', {
                key: col.name,
                className: 'flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-slate-950/70 border border-slate-800/50 font-mono'
              },
                h('span', { className: 'text-slate-200 font-medium' }, col.name),
                h('div', { className: 'flex items-center space-x-1.5' },
                  h('span', { className: 'text-slate-500 text-[11px]' }, col.type),
                  col.is_primary_key && h('span', { className: 'bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded font-bold' }, 'PK'),
                  col.foreign_key && h('span', { className: 'bg-cyan-500/20 text-cyan-300 text-[10px] px-1.5 py-0.5 rounded', title: `References ${col.foreign_key}` }, 'FK')
                )
              ))
            ),

            table.sample_rows && table.sample_rows.length > 0 && h('div', { className: 'pt-2 border-t border-slate-800/80' },
              h('span', { className: 'text-[10px] text-slate-500 block mb-1 font-bold uppercase tracking-wider' }, 'Sample Record:'),
              h('pre', { className: 'text-[10px] bg-slate-950 p-2.5 rounded-lg text-slate-400 overflow-x-auto border border-slate-900 font-mono' },
                JSON.stringify(table.sample_rows[0], null, 2)
              )
            )
          ))
        )
      ),

      // VIEW 3: AUDIT TRAIL
      activeView === 'history' && h('div', { className: 'flex-1 overflow-y-auto p-8 space-y-6 max-w-7xl mx-auto w-full' },
        h('div', { className: 'flex items-center justify-between border-b border-slate-800/80 pb-4' },
          h('div', null,
            h('h2', { className: 'text-2xl font-black text-slate-100 flex items-center space-x-3' },
              h(Icon, { name: 'history', className: 'w-7 h-7 text-indigo-400' }),
              h('span', null, 'Query Audit Trail & Security Telemetry')
            ),
            h('p', { className: 'text-sm text-slate-400 mt-1' }, 'Chronological trace of questions, generated SQL, latency, and sandbox security guardrails.')
          ),
          h('button', {
            onClick: async () => {
              await fetch(`${API_BASE}/api/history`, { method: "DELETE" });
              fetchHistory();
              showToast("Audit history cleared!");
            },
            className: 'text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3.5 py-2 rounded-xl transition font-bold'
          }, 'Clear History')
        ),

        h('div', { className: 'glass-panel rounded-2xl overflow-hidden border border-slate-800 shadow-2xl' },
          h('div', { className: 'overflow-x-auto' },
            h('table', { className: 'w-full text-left text-xs border-collapse font-mono' },
              h('thead', { className: 'bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800' },
                h('tr', null,
                  h('th', { className: 'p-3.5 font-bold' }, 'Timestamp'),
                  h('th', { className: 'p-3.5 font-bold' }, 'User Question'),
                  h('th', { className: 'p-3.5 font-bold' }, 'Generated Safe SQL'),
                  h('th', { className: 'p-3.5 font-bold' }, 'Status'),
                  h('th', { className: 'p-3.5 font-bold' }, 'Latency'),
                  h('th', { className: 'p-3.5 font-bold' }, 'Rows')
                )
              ),
              h('tbody', { className: 'divide-y divide-slate-800/60' },
                queryHistory.length === 0
                  ? h('tr', null, h('td', { colSpan: 6, className: 'p-8 text-center text-slate-500 font-sans' }, 'No audit telemetry recorded yet.'))
                  : queryHistory.map(item => h('tr', { key: item.id, className: 'hover:bg-slate-800/30 transition' },
                      h('td', { className: 'p-3.5 text-slate-500 whitespace-nowrap' }, item.timestamp),
                      h('td', { className: 'p-3.5 text-slate-200 font-sans max-w-xs truncate font-medium' }, item.question),
                      h('td', { className: 'p-3.5 text-cyan-400 max-w-md truncate' }, item.sql || "N/A"),
                      h('td', { className: 'p-3.5' },
                        h('span', { className: `px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' :
                          item.status === 'BLOCKED_SECURITY' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                        }` }, item.status)
                      ),
                      h('td', { className: 'p-3.5 text-slate-400 whitespace-nowrap' }, `${item.execution_time_ms} ms`),
                      h('td', { className: 'p-3.5 text-slate-300' }, item.row_count)
                    ))
              )
            )
          )
        )
      ),

      // VIEW 4: SETTINGS & DATA IMPORT
      activeView === 'settings' && h('div', { className: 'flex-1 overflow-y-auto p-8 space-y-6 max-w-7xl mx-auto w-full' },
        h('div', { className: 'border-b border-slate-800/80 pb-4' },
          h('h2', { className: 'text-2xl font-black text-slate-100 flex items-center space-x-3' },
            h(Icon, { name: 'settings', className: 'w-7 h-7 text-cyan-400' }),
            h('span', null, 'Engine Configurations & Data Importer')
          ),
          h('p', { className: 'text-sm text-slate-400 mt-1 font-medium' }, 'Configure LLM providers, API keys, and import custom CSV datasets into SQLite.')
        ),

        h('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
          
          // AI Provider Card
          h('div', { className: 'glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5' },
            h('div', { className: 'flex items-center space-x-3 border-b border-slate-800 pb-3' },
              h(Icon, { name: 'sparkles', className: 'w-5 h-5 text-cyan-400' }),
              h('h3', { className: 'font-bold text-sm text-slate-100' }, 'AI Model Provider')
            ),

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
                    showToast("Configuration saved successfully!");
                    fetchSettings();
                  }
                } catch (err) { showToast(`Error: ${err.message}`); }
              },
              className: 'space-y-4 text-xs'
            },
              h('div', null,
                h('label', { className: 'block text-slate-400 font-bold mb-1.5' }, 'Active AI Engine'),
                h('select', {
                  value: settingsData.llm_provider,
                  onChange: (e) => setSettingsData({ ...settingsData, llm_provider: e.target.value }),
                  className: 'w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-cyan-400 font-semibold'
                },
                  h('option', { value: 'offline' }, 'Smart Heuristic Engine (100% Zero-Setup / Offline)'),
                  h('option', { value: 'gemini' }, 'Google Gemini API (Gemini 2.5 Flash / 1.5 Pro)'),
                  h('option', { value: 'openai' }, 'OpenAI API (GPT-4o / GPT-4o-mini)'),
                  h('option', { value: 'ollama' }, 'Local Ollama (Llama 3 / CodeLlama)')
                )
              ),

              settingsData.llm_provider === 'gemini' && h('div', null,
                h('label', { className: 'block text-slate-400 font-bold mb-1.5' }, 'Gemini API Key'),
                h('input', {
                  type: 'password',
                  placeholder: 'AIzaSy...',
                  value: settingsData.gemini_key_input,
                  onChange: (e) => setSettingsData({ ...settingsData, gemini_key_input: e.target.value }),
                  className: 'w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-cyan-400 font-mono'
                })
              ),

              settingsData.llm_provider === 'openai' && h('div', null,
                h('label', { className: 'block text-slate-400 font-bold mb-1.5' }, 'OpenAI API Key'),
                h('input', {
                  type: 'password',
                  placeholder: 'sk-...',
                  value: settingsData.openai_key_input,
                  onChange: (e) => setSettingsData({ ...settingsData, openai_key_input: e.target.value }),
                  className: 'w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-cyan-400 font-mono'
                })
              ),

              h('button', {
                type: 'submit',
                className: 'gradient-btn w-full font-bold py-2.5 rounded-xl transition shadow-lg shadow-cyan-500/20'
              }, 'Save Engine Configuration')
            )
          ),

          // CSV Importer Card
          h('div', { className: 'glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5' },
            h('div', { className: 'flex items-center space-x-3 border-b border-slate-800 pb-3' },
              h(Icon, { name: 'upload', className: 'w-5 h-5 text-indigo-400' }),
              h('h3', { className: 'font-bold text-sm text-slate-100' }, 'Upload CSV Dataset')
            ),

            h('div', { className: 'border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-2xl p-6 text-center space-y-3 transition' },
              h(Icon, { name: 'table', className: 'w-10 h-10 text-cyan-400 mx-auto' }),
              h('div', null,
                h('p', { className: 'text-xs font-bold text-slate-200' }, 'Select any CSV file'),
                h('p', { className: 'text-[11px] text-slate-500' }, 'Auto-infers column types and creates an SQLite table')
              ),
              h('input', {
                type: 'file',
                accept: '.csv',
                onChange: handleCSVUpload,
                className: 'text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 cursor-pointer'
              })
            ),

            uploadStatus && h('p', { className: 'text-xs bg-slate-950 p-3 rounded-xl border border-slate-800 text-cyan-300 font-mono' }, uploadStatus)
          )

        )
      )

    )
  );
}

// Render Root Instantly
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(h(App));
