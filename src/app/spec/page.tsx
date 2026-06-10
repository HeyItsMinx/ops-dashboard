'use client';

import React, { useState } from 'react';
import {
  Bot, Terminal, Database, Clock, Lock, GitBranch, Code2,
  Cloud, CheckCircle2, Circle, ChevronRight, Zap,
  MessageSquare, Layers, Search, BarChart3, ListChecks,
  Cpu, Shield, Activity
} from 'lucide-react';

// ============================================================================
// DATA & TYPES
// ============================================================================

type TabId = 'overview' | 'stack' | 'features' | 'schema' | 'roadmap';

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'stack', label: 'Tech Stack' },
  { id: 'features', label: 'Features' },
  { id: 'schema', label: 'DB Schema' },
  { id: 'roadmap', label: 'Roadmap' },
];

const STACK = [
  { name: "Next.js 14", cat: "Frontend", desc: "App Router, Server Components, and API routes as the full-stack backbone.", Icon: Code2 },
  { name: "TypeScript", cat: "Language", desc: "Strict types across all frontend, API routes, and shared data models.", Icon: Code2 },
  { name: "Supabase", cat: "Database + Auth", desc: "PostgreSQL with RLS, Realtime subscriptions, and built-in OAuth providers.", Icon: Database },
  { name: "OpenAI API", cat: "AI / LLM", desc: "Streaming chat responses and function calling against live ops data.", Icon: Cpu },
  { name: "pgvector", cat: "AI / Vector", desc: "Embed log messages, run cosine similarity search to power the RAG pipeline.", Icon: Search },
  { name: "Tailwind UI", cat: "UI", desc: "Utility-first CSS with accessible, unstyled component primitives.", Icon: Layers },
  { name: "Vercel", cat: "Deploy", desc: "Edge deployment, Vercel Cron for scheduled jobs, and per-PR preview URLs.", Icon: Cloud },
  { name: "Git Actions", cat: "CI/CD", desc: "Automated lint, type-check, and deploy pipeline on every push to main.", Icon: GitBranch },
  { name: "Discord.js", cat: "Bot (bonus)", desc: "Agent failure alerts and slash-command task queries via Discord.", Icon: MessageSquare },
];

const FEATURES = [
  { name: "Agent Monitor", Icon: Bot, type: "must", desc: "Live grid of AI agents with status badges (running/idle/failed), heartbeat timestamp, and a config drawer. Powered by Supabase Realtime.", tags: ["Realtime", "PostgreSQL", "React"] },
  { name: "Task Queue", Icon: ListChecks, type: "must", desc: "Real-time task list with status filter, infinite scroll, and a detail panel showing payload JSON, timing, and full error trace.", tags: ["Realtime", "TypeScript"] },
  { name: "Log Explorer", Icon: Terminal, type: "must", desc: "Searchable log viewer with level badges, per-agent drill-down, and a raw JSON metadata toggle.", tags: ["tsvector", "PostgreSQL"] },
  { name: "Metrics Dash", Icon: BarChart3, type: "must", desc: "Time-series charts for task success rate, p50 latency, throughput per agent, and error frequency over configurable windows.", tags: ["Recharts", "Aggregates"] },
  { name: "AI Assistant", Icon: MessageSquare, type: "preferred", desc: "Streaming chat powered by gpt-4o with function calling. Ask 'Which agent had the most failures today?' and get a live answer.", tags: ["OpenAI", "Function calling", "RAG"] },
  { name: "Webhook Intake", Icon: Zap, type: "must", desc: "POST /api/webhooks with HMAC signature validation, raw payload storage, event log UI, and manual retry support.", tags: ["Webhooks", "HMAC"] },
  { name: "Cron Manager", Icon: Clock, type: "must", desc: "View scheduled jobs, inspect last run result, and manually trigger a run. Uses Vercel Cron with DB-backed logs.", tags: ["Cron jobs", "Vercel"] },
  { name: "Auth + RBAC", Icon: Lock, type: "must", desc: "Supabase Auth with Google OAuth, JWT session handling, and Row Level Security policies.", tags: ["OAuth", "RLS"] },
  { name: "Discord Bot", Icon: MessageSquare, type: "preferred", desc: "Slash commands to query live agent status and a dedicated channel for automated failure alerts.", tags: ["Discord.js", "Bot"] },
];

const SCHEMA = [
  {
    name: "agents", cols: [
      { name: "id", type: "uuid", note: "primary key" },
      { name: "name", type: "text", note: "" },
      { name: "type", type: "text", note: "'llm' | 'scraper' | 'worker'" },
      { name: "status", type: "text", note: "'running' | 'idle' | 'failed'" },
      { name: "last_heartbeat", type: "timestamptz", note: "" },
      { name: "config", type: "jsonb", note: "agent settings" },
    ],
  },
  {
    name: "tasks", cols: [
      { name: "id", type: "uuid", note: "primary key" },
      { name: "agent_id", type: "uuid", note: "→ agents.id" },
      { name: "name", type: "text", note: "" },
      { name: "status", type: "text", note: "'pending' | 'success' | 'failed'" },
      { name: "payload", type: "jsonb", note: "" },
    ],
  },
  {
    name: "logs", cols: [
      { name: "id", type: "uuid", note: "primary key" },
      { name: "task_id", type: "uuid", note: "→ tasks.id" },
      { name: "level", type: "text", note: "'info' | 'warn' | 'error'" },
      { name: "message", type: "text", note: "" },
      { name: "embedding", type: "vector(1536)", note: "pgvector" },
    ],
  },
];

const PHASES = [
  { num: "01", name: "Foundation", weeks: "Week 1–2", tasks: ["Init Next.js 14 project with TypeScript + Tailwind", "Create Supabase project, write all schema migrations", "Build base layout: sidebar, top nav, breadcrumb system", "Deploy to Vercel with environment variables set up"], skills: ["Next.js", "Supabase", "CI/CD"] },
  { num: "02", name: "Dashboard", weeks: "Week 3–4", tasks: ["Agent Monitor with Supabase Realtime subscriptions", "Task Queue with filter, sort, and pagination", "Log Explorer with PostgreSQL tsvector full-text search", "Webhook intake endpoint with HMAC validation"], skills: ["Realtime", "PostgreSQL", "Webhooks"] },
  { num: "03", name: "AI Layer", weeks: "Week 5–6", tasks: ["AI chat interface with SSE streaming responses", "OpenAI function calling against database", "Enable pgvector in Supabase, build log embedding pipeline", "Discord bot: slash commands + failure alerts"], skills: ["OpenAI", "RAG", "Discord.js"] },
  { num: "04", name: "Polish", weeks: "Week 7–8", tasks: ["Architecture README with system diagrams", "Error boundaries, loading skeletons, empty states", "Playwright E2E tests for auth and critical flows", "3-minute screen-recorded demo walkthrough video"], skills: ["Testing", "Performance", "Docs"] },
];

// ============================================================================
// P5 THEME HELPER COMPONENTS
// ============================================================================

const RansomText = ({ text, size = "text-3xl" }: { text: string, size?: string }) => {
  const words = text.split(" ");
  return (
    <span className="flex flex-wrap gap-1 md:gap-2 items-center z-10 relative">
      {words.map((word, i) => {
        const styleType = i % 3;
        const rotation = i % 2 === 0 ? '-rotate-3' : 'rotate-2';
        
        let colors = "bg-white text-black";
        if (styleType === 1) colors = "bg-[#E60012] text-white";
        if (styleType === 2) colors = "bg-[#0F0F0F] text-white border-2 border-white";

        return (
          <span key={i} className={`inline-block px-2 py-1 font-black uppercase transform ${rotation} ${colors} ${size} shadow-lg tracking-tighter`}>
            {word}
          </span>
        );
      })}
    </span>
  );
};

const P5Badge = ({ children, active = false }: { children: React.ReactNode, active?: boolean }) => (
  <span className={`inline-block px-3 py-1 font-black uppercase text-[10px] tracking-widest transform -skew-x-12 border-2 
    ${active ? 'bg-[#FFF200] text-black border-[#FFF200]' : 'bg-[#E60012] text-white border-[#E60012]'}`}>
    <span className="block transform skew-x-12">{children}</span>
  </span>
);

const P5Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative bg-[#0F0F0F] border-2 border-white transform -skew-x-2 shadow-[6px_6px_0px_0px_#E60012] transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#FFF200] ${className}`}>
    {/* Inner wrapper to cancel skew for readable text */}
    <div className="transform skew-x-2 p-5 h-full flex flex-col">
      {children}
    </div>
  </div>
);

// ============================================================================
// CONTENT VIEWS
// ============================================================================

const OverviewContent = () => {
  const jd = [
    { text: "TypeScript / React / Next.js", covered: true },
    { text: "PostgreSQL / Supabase Realtime", covered: true },
    { text: "Webhook / API / System Architecture", covered: true },
    { text: "AI Agents / Vector DB / Function Calling", covered: true, pref: true },
  ];

  return (
    <div className="space-y-8 text-white">
      <div className="bg-[#1a1a1a] p-6 border-l-8 border-[#E60012] shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
        <p className="font-mono text-sm leading-relaxed max-w-3xl">
          <strong className="text-[#FFF200] uppercase tracking-widest mr-2">Target Acquired:</strong> 
          OpsIQ is a production-grade internal tool for infiltrating and monitoring AI agent workflows. Operators track health in real time, extract logs, and query the system using an LLM confidant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Operation Time", val: "8 WEEKS", color: "text-[#E60012]" },
          { label: "Payload Size", val: "9 MODULES", color: "text-white" },
          { label: "Requirements", val: "100% MET", color: "text-[#FFF200]" },
        ].map((s, i) => (
          <div key={i} className="bg-[#0F0F0F] border-2 border-[#555] p-4 transform rotate-1 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#E60012]" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
            <p className={`text-2xl font-black font-mono ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 relative">
        <h3 className="text-xl font-black uppercase text-white mb-4 flex items-center gap-2">
          <Zap className="text-[#FFF200]" /> Mission Coverage
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jd.map(item => (
            <div key={item.text} className="flex items-center gap-3 bg-[#111] p-3 border border-gray-800">
              <CheckCircle2 size={18} className="text-[#E60012] shrink-0" />
              <span className="font-mono text-xs text-gray-200">{item.text}</span>
              {item.pref && <P5Badge active>Bonus</P5Badge>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StackContent = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {STACK.map((s, i) => (
      <P5Card key={i}>
        <div className="flex justify-between items-start mb-4">
          <div className="bg-[#E60012] p-2 rounded-sm text-white transform -rotate-3">
            <s.Icon size={20} />
          </div>
          <P5Badge>{s.cat}</P5Badge>
        </div>
        <h4 className="font-black text-xl text-white uppercase tracking-wide mb-2">{s.name}</h4>
        <p className="font-mono text-xs text-gray-400 leading-relaxed flex-grow">{s.desc}</p>
      </P5Card>
    ))}
  </div>
);

const FeaturesContent = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {FEATURES.map((f, i) => (
      <P5Card key={i} className={f.type === 'preferred' ? 'border-[#FFF200]' : ''}>
        <div className="flex items-center gap-3 mb-3 border-b-2 border-gray-800 pb-3">
          <f.Icon size={24} className={f.type === 'preferred' ? 'text-[#FFF200]' : 'text-[#E60012]'} />
          <h4 className="font-black text-2xl text-white uppercase tracking-tight">{f.name}</h4>
        </div>
        <p className="font-mono text-sm text-gray-300 mb-6 flex-grow">{f.desc}</p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {f.tags.map(t => (
            <span key={t} className="px-2 py-1 bg-white text-black font-bold text-[10px] uppercase transform skew-x-6">
              {t}
            </span>
          ))}
        </div>
      </P5Card>
    ))}
  </div>
);

const SchemaContent = ({ schemaIdx, setSchemaIdx }: { schemaIdx: number, setSchemaIdx: (n: number) => void }) => {
  const active = SCHEMA[schemaIdx];
  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Sidebar Tabs for Schema */}
      <div className="flex flex-col gap-3 w-full md:w-48 shrink-0">
        <p className="text-[#E60012] font-black uppercase tracking-widest text-sm mb-2 px-2">Data Palaces</p>
        {SCHEMA.map((t, i) => (
          <button 
            key={t.name} 
            onClick={() => setSchemaIdx(i)}
            className={`text-left px-4 py-3 font-black uppercase transform transition-all duration-200 
              ${i === schemaIdx 
                ? 'bg-[#E60012] text-white translate-x-2 -skew-x-6 scale-105 shadow-[4px_4px_0px_0px_#FFFFFF]' 
                : 'bg-[#111] text-gray-500 hover:bg-[#222] hover:text-white -skew-x-6'}`}
          >
            <div className="transform skew-x-6 flex items-center gap-2">
              <Database size={14} /> {t.name}
            </div>
          </button>
        ))}
      </div>

      {/* Main Schema Table Container */}
      <div className="flex-grow w-full bg-[#0F0F0F] border-4 border-white p-1 relative shadow-[8px_8px_0px_0px_#E60012] transform -rotate-1">
        <div className="bg-[#E60012] text-white p-3 font-black uppercase flex justify-between items-center">
          <span className="text-xl tracking-widest">{active.name}</span>
          <span className="text-xs bg-black px-2 py-1">COLUMNS: {active.cols.length}</span>
        </div>
        <div className="bg-[#0F0F0F] p-4 font-mono text-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[#FFF200] border-b-2 border-gray-700">
                <th className="pb-2 font-bold uppercase tracking-wider">Column</th>
                <th className="pb-2 font-bold uppercase tracking-wider">Type</th>
                <th className="pb-2 font-bold uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody>
              {active.cols.map((col, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-[#1a1a1a] transition-colors">
                  <td className="py-3 text-white font-bold">
                    {col.name}
                    {col.note.includes('primary key') && <span className="ml-2 text-[9px] bg-[#E60012] px-1 py-0.5 text-white uppercase">PK</span>}
                  </td>
                  <td className="py-3 text-gray-400">{col.type}</td>
                  <td className="py-3 text-gray-500 italic text-xs">{col.note !== 'primary key' ? col.note : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const RoadmapContent = () => (
  <div className="space-y-12 pl-4 border-l-4 border-[#E60012] relative">
    {PHASES.map((p, i) => (
      <div key={i} className="relative">
        <div className="absolute -left-[26px] top-0 w-12 h-12 bg-[#0F0F0F] border-4 border-[#E60012] transform rotate-45 flex items-center justify-center z-10 shadow-lg">
          <span className="transform -rotate-45 font-black text-white">{p.num}</span>
        </div>
        
        <P5Card className="ml-10">
          <div className="flex justify-between items-center mb-6 border-b-2 border-gray-800 pb-4">
            <RansomText text={p.name} size="text-2xl md:text-3xl" />
            <P5Badge active>{p.weeks}</P5Badge>
          </div>
          <ul className="space-y-3 mb-6">
            {p.tasks.map((t, idx) => (
              <li key={idx} className="flex items-start gap-3 font-mono text-sm text-gray-300">
                <ChevronRight size={16} className="text-[#E60012] mt-0.5 shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            {p.skills.map(s => (
              <span key={s} className="bg-[#E60012] text-white text-[10px] font-black uppercase px-2 py-1 transform -skew-x-12">
                <span className="block transform skew-x-12">{s}</span>
              </span>
            ))}
          </div>
        </P5Card>
      </div>
    ))}
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function OpsIQProjectSpec() {
  const [tab, setTab] = useState<TabId>('overview');
  const [schemaIdx, setSchemaIdx] = useState(0);

  return (
    <div className="min-h-screen bg-[#0F0F0F] font-sans selection:bg-[#FFF200] selection:text-black overflow-hidden relative pb-20">
      
      {/* Background Graphic Accents */}
      <div className="absolute top-0 right-0 w-2/3 h-[500px] bg-red-600 opacity-20 transform rotate-12 translate-x-1/3 -translate-y-1/4 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 relative z-10">
        
        {/* Top Header Strip */}
        <header className="mb-12 border-l-8 border-[#E60012] pl-6 relative">
          <div className="absolute -left-2 top-0 bottom-0 w-1 bg-[#FFF200]" />
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white text-black font-black font-mono text-[10px] px-2 py-0.5 uppercase tracking-widest transform -skew-x-12">
              ~/portfolio/ai-ops-dashboard
            </div>
            <Activity className="text-[#E60012] animate-pulse" size={16} />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <RansomText text="OpsIQ Spec" size="text-5xl md:text-7xl" />
            <div className="bg-[#E60012] text-white font-black uppercase px-3 py-1 text-sm transform -rotate-3 mb-2">
              Version 1.0
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Sidebar Navigation */}
          <nav className="flex flex-col w-full lg:w-64 shrink-0 gap-1 mt-4">
            {TABS.map((t) => {
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative px-6 py-4 text-left font-black uppercase text-lg tracking-wider transition-all duration-200 transform
                    ${isActive 
                      ? 'bg-white text-black -translate-x-2 -skew-x-6 scale-105 shadow-[4px_4px_0px_0px_#E60012] z-10' 
                      : 'bg-[#1a1a1a] text-white hover:bg-[#333] hover:translate-x-2 hover:-skew-x-12 border-l-4 border-transparent hover:border-[#FFF200]'
                    }
                  `}
                >
                  {/* Cancel inner skew to keep text perfectly crisp */}
                  <span className={`block transform ${isActive ? 'skew-x-6' : 'group-hover:skew-x-12'}`}>
                    {t.label}
                  </span>
                  {isActive && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#E60012] rotate-45" />}
                </button>
              );
            })}
          </nav>

          {/* Main Content Area Container */}
          <main className="flex-grow w-full relative">
            {/* The massive stylized container for the active view */}
            <div className="bg-[#0F0F0F] border-4 border-white p-6 md:p-10 shadow-[12px_12px_0px_0px_#E60012] transform -skew-x-1 relative z-20 min-h-[600px]">
              
              {/* Decorative Corner Tab */}
              <div className="absolute -top-4 -right-4 bg-[#FFF200] text-black font-black uppercase text-xs px-4 py-1 border-2 border-black transform rotate-3 shadow-md">
                Confidential Data
              </div>

              {/* View Injection (wrapped to cancel the skew for reading) */}
              <div className="transform skew-x-1 h-full">
                {tab === 'overview' && <OverviewContent />}
                {tab === 'stack' && <StackContent />}
                {tab === 'features' && <FeaturesContent />}
                {tab === 'schema' && <SchemaContent schemaIdx={schemaIdx} setSchemaIdx={setSchemaIdx} />}
                {tab === 'roadmap' && <RoadmapContent />}
              </div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}