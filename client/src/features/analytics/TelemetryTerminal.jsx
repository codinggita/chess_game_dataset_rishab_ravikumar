import { useEffect, useState, useRef } from 'react';

const INITIAL_LOGS = [
  { time: '14:02:01', type: 'CONN', text: 'Established secure link to DB_ALPHA', color: 'text-data-positive' },
  { time: '14:02:05', type: 'INFO', text: 'Syncing latest 50 match PGNs...', color: 'text-text-secondary' },
  { time: '14:02:12', type: 'EVAL', text: 'SF16.1 initiated analysis worker thread #4', color: 'text-gold-primary' },
  { time: '14:03:00', type: 'WARN', text: 'High latency detected on Lichess API endpoint', color: 'text-data-warning' },
  { time: '14:03:15', type: 'INFO', text: 'Blunder detected in Match ID: 8943x. CP Drop: -3.4', color: 'text-text-secondary' },
  { time: '14:03:45', type: 'INFO', text: 'Recalculating Opening Matrix...', color: 'text-text-secondary' },
  { time: '14:04:10', type: 'SUCCESS', text: 'Matrix updated. E4 winrate +0.2%', color: 'text-data-positive' },
  { time: '14:05:00', type: 'SYS', text: 'Awaiting input command...', color: 'text-gold-primary' }
];

const DYNAMIC_LOG_POOL = [
  { type: 'INFO', text: 'Scanning database collections for new player ratings...', color: 'text-text-secondary' },
  { type: 'SUCCESS', text: 'Synchronized 14 new GMs profiles from FIDE live', color: 'text-data-positive' },
  { type: 'EVAL', text: 'Evaluating position: King Safety index 0.94', color: 'text-gold-primary' },
  { type: 'WARN', text: 'Memory threshold reached: 1.4GB. Garbage collector invoked', color: 'text-data-warning' },
  { type: 'INFO', text: 'Deep analysis completed for Match ID: 7712a.', color: 'text-text-secondary' },
  { type: 'SUCCESS', text: 'System diagnostics complete. Status: Optimal.', color: 'text-data-positive' },
  { type: 'SYS', text: 'Refreshing Top Openings distribution cache', color: 'text-gold-primary' },
  { type: 'INFO', text: 'Lichess API rate limit reset. Client pool refreshed', color: 'text-text-secondary' }
];

const BEST_LINES = [
  '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4',
  '1. d4 Nf6 2. c4 e6 3. Nf3 d5 4. Nc3 Bb4 5. Bg5 h6 6. Bxf6 Qxf6',
  '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6',
  '1. c4 e5 2. Nc3 Nf6 3. Nf3 Nc6 4. g3 d5 5. cxd5 Nxd5 6. Bg2 Nb6 7. O-O'
];

export default function TelemetryTerminal() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [depth, setDepth] = useState(32);
  const [nodes, setNodes] = useState(14245601);
  const [nps, setNps] = useState(1845);
  const [evaluation, setEvaluation] = useState('+1.24');
  const [bestLine, setBestLine] = useState(BEST_LINES[0]);

  const containerRef = useRef(null);
  
  // Engine telemetry update loop
  useEffect(() => {
    const timer = setInterval(() => {
      setDepth((d) => (d >= 45 ? 28 : d + 1));
      setNodes((n) => n + Math.floor(Math.random() * 85000) + 15000);
      setNps((n) => Math.floor(n * 0.98 + Math.random() * 80));
      
      const val = (Math.random() * 0.3 + 1.1).toFixed(2);
      setEvaluation(Math.random() > 0.5 ? `+${val}` : `+${(1.24).toFixed(2)}`);

      if (Math.random() > 0.8) {
        setBestLine(BEST_LINES[Math.floor(Math.random() * BEST_LINES.length)]);
      }
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  // System log append loop
  useEffect(() => {
    const timer = setInterval(() => {
      const randomLog = DYNAMIC_LOG_POOL[Math.floor(Math.random() * DYNAMIC_LOG_POOL.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      
      setLogs((prev) => [
        ...prev,
        {
          time: timeStr,
          type: randomLog.type,
          text: randomLog.text,
          color: randomLog.color
        }
      ].slice(-50)); // Keep last 50 logs max
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  // Auto-scroll logs container to bottom (prevents bad UX page scroll jumps)
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Engine Telemetry */}
      <div className="bg-bg-surface border border-border-default rounded-lg flex flex-col h-[240px] lg:h-auto lg:flex-1 lg:min-h-0 overflow-hidden">
        <div className="p-3 border-b border-border-default flex justify-between items-center bg-bg-deep">
          <div className="font-ui text-[11px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-primary animate-pulse"></span>
            Engine Telemetry
          </div>
          <span className="font-mono text-[10px] text-gold-primary font-semibold">SF 16.1 ON</span>
        </div>
        
        <div className="flex-1 p-3 flex flex-col justify-between font-mono text-[12px] text-text-secondary leading-relaxed bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-gold-glow/5 via-transparent to-transparent">
          <div className="flex justify-between items-center border-b border-border-subtle pb-2">
            <span>DEPTH</span>
            <span className="text-gold-primary font-semibold">{depth}/45</span>
          </div>
          <div className="flex justify-between items-center border-b border-border-subtle pb-2">
            <span>NODES</span>
            <span className="text-text-primary font-semibold">{nodes.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center border-b border-border-subtle pb-2">
            <span>NPS</span>
            <span className="text-text-primary font-semibold">{nps.toLocaleString()} kN/s</span>
          </div>
          <div className="flex justify-between items-center border-b border-border-subtle pb-2">
            <span>EVAL</span>
            <span className="text-data-positive font-semibold">{evaluation}</span>
          </div>
          <div className="mt-2 flex flex-col gap-1">
            <span className="text-text-tertiary text-[10px] font-bold uppercase tracking-wider">BEST LINE</span>
            <span className="text-gold-primary text-[11px] leading-relaxed break-words font-semibold">
              {bestLine}
            </span>
          </div>
        </div>
      </div>

      {/* Live Event Log */}
      <div className="bg-bg-base border border-border-default rounded-lg flex flex-col h-[240px] lg:h-auto lg:flex-1 lg:min-h-0 overflow-hidden">
        <div className="p-2 border-b border-border-default bg-bg-deep font-ui text-[11px] font-bold uppercase tracking-wider text-text-secondary flex justify-between items-center">
          <span>SYS.LOG // LIVE FEED</span>
          <span className="text-[10px] text-data-positive tracking-widest">[STREAM ACTIVE]</span>
        </div>
        
        <div ref={containerRef} className="flex-1 p-3 overflow-y-auto terminal-scroll font-mono text-[11px] text-text-secondary leading-relaxed flex flex-col gap-1.5 select-text">
          {logs.map((log, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <span className="text-text-tertiary flex-shrink-0">[{log.time}]</span>
              <span className={`font-bold flex-shrink-0 ${log.color}`}>{log.type}</span>
              <span className="text-text-primary break-words">{log.text}</span>
            </div>
          ))}
          
          {/* Prompt line */}
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-gold-primary font-bold">&gt;</span>
            <span className="w-1.5 h-3 bg-gold-primary animate-pulse-dot" />
          </div>
        </div>
      </div>
    </div>
  );
}
