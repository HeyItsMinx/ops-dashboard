import { Bot, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function MainDashboardPage() {
  // Sample Data matching your specified database expectations
  const mockAgents = [
    { id: 1, name: "Arsene_LLM", type: "llm", status: "running", heartbeat: "Just now" },
    { id: 2, name: "Captain_Kid", type: "worker", status: "idle", heartbeat: "3m ago" },
    { id: 3, name: "Carmen_Scraper", type: "scraper", status: "failed", heartbeat: "14m ago" },
  ];

  return (
    <div className="space-y-6 text-white">
      {/* Headline Block */}
      <div className="flex items-center gap-3 border-b-2 border-gray-800 pb-4">
        <Bot className="text-[#E60012]" size={28} />
        <h2 className="text-3xl font-black uppercase tracking-tight">Active Agent Grid</h2>
      </div>

      {/* Grid Monitor Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockAgents.map((agent) => (
          <div 
            key={agent.id} 
            className={`bg-[#121212] border-2 p-5 relative transform transition-all hover:-translate-y-1
              ${agent.status === 'failed' ? 'border-[#E60012] shadow-[6px_6px_0px_0px_#E60012]' : 'border-gray-700 shadow-[6px_6px_0px_0px_#555]'}
            `}
          >
            {/* Top Row */}
            <div className="flex justify-between items-start mb-4">
              <span className="font-mono text-[10px] tracking-wider text-gray-500 uppercase bg-black px-2 py-0.5">
                TYPE // {agent.type}
              </span>
              
              {/* Dynamic Theme Alerts */}
              {agent.status === 'running' && <span className="bg-[#FFF200] text-black font-black text-[9px] uppercase px-2 py-0.5 tracking-wider flex items-center gap-1"><ShieldCheck size={10}/> RUNNING</span>}
              {agent.status === 'idle' && <span className="bg-white text-black font-black text-[9px] uppercase px-2 py-0.5 tracking-wider flex items-center gap-1">IDLE</span>}
              {agent.status === 'failed' && <span className="bg-[#E60012] text-white font-black text-[9px] uppercase px-2 py-0.5 tracking-wider flex items-center gap-1 animate-pulse"><AlertTriangle size={10}/> CRITICAL FAILURE</span>}
            </div>

            {/* Middle Row */}
            <h3 className="text-xl font-black tracking-wide uppercase mb-4 text-white font-mono">{agent.name}</h3>

            {/* Bottom Row */}
            <div className="flex items-center justify-between border-t border-gray-800 pt-3 text-xs font-mono text-gray-400">
              <span className="flex items-center gap-1"><Activity size={12} className="text-[#E60012]" /> Heartbeat</span>
              <span>{agent.heartbeat}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}