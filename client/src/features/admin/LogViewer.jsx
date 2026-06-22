import { useEffect, useState, useRef } from 'react';
import { getLogs, clearCache } from '../../services/adminService';
import { showToast } from '../../components/ui';
import Spinner from '../../components/ui/Spinner';

export default function LogViewer() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const containerRef = useRef(null);

  const fetchLogs = (silent = false) => {
    if (!silent) setLoading(true);
    getLogs(100)
      .then((res) => {
        const logArray = res?.logs || [];
        setLogs([...logArray].reverse());
      })
      .catch((err) => {
        console.error('Failed to fetch system logs:', err);
      })
      .finally(() => {
        if (!silent) setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
    
    // Poll for new logs every 3 seconds
    const interval = setInterval(() => {
      fetchLogs(true);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll logs to bottom internally
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleClearLogs = () => {
    clearCache()
      .then(() => {
        setLogs([]);
        showToast('Logs database cache cleared', 'success');
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || err?.message || String(err);
        showToast(msg || 'Failed to clear logs', 'error');
      });
  };

  const getMethodColor = (method) => {
    switch (method?.toUpperCase()) {
      case 'GET':
        return 'text-[#6B7AFF]';
      case 'POST':
        return 'text-[#2DD4A0]';
      case 'PATCH':
        return 'text-[#F59E0B]';
      case 'PUT':
        return 'text-[#7C4DFF]';
      case 'DELETE':
        return 'text-[#F05252]';
      default:
        return 'text-text-primary';
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'text-text-secondary';
    if (status >= 200 && status < 300) return 'text-[#2DD4A0]';
    if (status >= 400 && status < 500) return 'text-[#F59E0B]';
    if (status >= 500) return 'text-[#F05252]';
    return 'text-[#6B7AFF]';
  };

  if (loading && logs.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-[#0B0B0E] border border-border-strong rounded-lg flex flex-col h-[500px] overflow-hidden relative shadow-lg">
      {/* Terminal Header */}
      <div className="p-3 border-b border-border-strong bg-[#121217] flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-data-negative/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-data-positive/60" />
          </div>
          <span className="font-mono text-[11px] text-text-secondary uppercase tracking-widest pl-2">
            SYS.LOG // Live event feed
          </span>
        </div>
        <button
          onClick={handleClearLogs}
          className="px-2.5 py-1 font-mono text-[10px] uppercase font-bold text-data-negative/80 border border-data-negative/30 hover:border-data-negative hover:bg-data-negative/10 hover:text-data-negative rounded transition-all cursor-pointer"
        >
          Clear Logs
        </button>
      </div>

      {/* Terminal logs list */}
      <div
        ref={containerRef}
        className="flex-grow p-4 overflow-y-auto font-mono text-[12px] leading-relaxed flex flex-col gap-2 select-text"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#C9A84C #0B0B0E',
        }}
      >
        {logs.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-text-tertiary">
            &gt; AWAITING INCOMING API LOGS...
          </div>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} className="flex flex-wrap gap-x-3 gap-y-0.5 items-start border-l border-border-default/20 pl-2">
              <span className="text-text-tertiary">
                [{log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'N/A'}]
              </span>
              <span className={`font-bold uppercase ${getMethodColor(log.method)}`}>
                {log.method}
              </span>
              <span className="text-text-secondary break-all">
                {log.url}
              </span>
              <span className={`font-bold ${getStatusColor(log.status)}`}>
                {log.status}
              </span>
              {log.responseTime && (
                <span className="text-text-tertiary font-mono text-[11px]">
                  ({log.responseTime.toFixed(1)} ms)
                </span>
              )}
            </div>
          ))
        )}

        {/* Prompt indicator line */}
        <div className="flex items-center gap-1.5 mt-2 pl-2">
          <span className="text-gold-primary font-bold">&gt;</span>
          <span className="w-1.5 h-3.5 bg-gold-primary animate-pulse-dot" />
        </div>
      </div>
    </div>
  );
}
