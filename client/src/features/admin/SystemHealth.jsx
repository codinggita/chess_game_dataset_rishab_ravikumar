import { useEffect, useState } from 'react';
import { getSystemHealth, getPerformance, getDatabaseStatus, clearCache } from '../../services/adminService';
import { showToast } from '../../components/ui';
import Spinner from '../../components/ui/Spinner';

export default function SystemHealth() {
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);
  const [cacheClearing, setCacheClearing] = useState(false);

  const fetchSystemData = () => {
    Promise.all([
      getSystemHealth().catch(() => null),
      getPerformance().catch(() => null),
      getDatabaseStatus().catch(() => null),
    ])
      .then(([healthRes, perfRes, dbRes]) => {
        setHealth(healthRes);
        setPerformance(perfRes);
        setDbStatus(dbRes);
      })
      .catch((err) => console.error('Failed to load system health stats:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSystemData();
  }, []);

  // System Uptime real-time ticking
  useEffect(() => {
    if (!health) return;
    const interval = setInterval(() => {
      setHealth((prev) => (prev ? { ...prev, uptime: prev.uptime + 1 } : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [health]);

  const handleClearCache = () => {
    setCacheClearing(true);
    clearCache()
      .then(() => {
        showToast('System logs cache cleared successfully', 'success');
        fetchSystemData();
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || err?.message || String(err);
        showToast(msg || 'Failed to clear cache', 'error');
      })
      .finally(() => setCacheClearing(false));
  };

  const formatUptime = (seconds) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const dDisplay = d > 0 ? `${d}d ` : '';
    const hDisplay = h > 0 ? `${h}h ` : '0h ';
    const mDisplay = m > 0 ? `${m}m ` : '0m ';
    const sDisplay = `${s}s`;
    return dDisplay + hDisplay + mDisplay + sDisplay;
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 GB';
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const isConnected = health?.database === 'connected';

  // Compute memory metrics
  const totalMem = performance?.totalMemory || 0;
  const freeMem = performance?.freeMemory || 0;
  const usedMem = totalMem - freeMem;
  const memPct = totalMem > 0 ? ((usedMem / totalMem) * 100).toFixed(1) : '0';

  // Windows load averages might be simulated or N/A
  const cpuLoadVal = performance?.loadAvg && Array.isArray(performance.loadAvg)
    ? `${(performance.loadAvg[0] * 10).toFixed(1)}%`
    : 'N/A';

  return (
    <div className="space-y-6">
      {/* Status Card (Full-width) */}
      <div className="bg-bg-surface border border-border-default rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className={`w-3.5 h-3.5 rounded-full ${isConnected ? 'bg-data-positive shadow-[0_0_8px_#2dd4a0]' : 'bg-data-negative'} animate-pulse`} />
          <div>
            <h4 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">
              Database: {isConnected ? 'Connected' : 'Disconnected'}
            </h4>
            <span className="text-[10px] text-text-tertiary font-mono">
              Status Checked: {health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : 'N/A'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] font-mono text-text-secondary">
          <div>
            <span className="text-text-tertiary">UPTIME:</span>{' '}
            <span className="text-text-primary font-bold">{health?.uptime ? formatUptime(health.uptime) : '0s'}</span>
          </div>
          <div className="border-l border-border-subtle pl-6">
            <span className="text-text-tertiary">NODE:</span>{' '}
            <span className="text-text-primary font-bold">{health?.nodeVersion || 'N/A'}</span>
          </div>
          <div className="border-l border-border-subtle pl-6">
            <span className="text-text-tertiary">ENV:</span>{' '}
            <span className="text-text-primary font-bold uppercase">{health?.environment || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU Load */}
        <div className="bg-bg-surface border border-border-default p-4 rounded-lg flex flex-col justify-between h-[110px] hover:border-gold-primary/30 transition-all">
          <span className="text-[10px] font-bold tracking-wider text-text-secondary uppercase">CPU Load</span>
          <span className="text-[32px] font-display font-bold text-text-primary font-mono">{cpuLoadVal}</span>
          <span className="text-[11px] font-mono text-text-tertiary">System core usage</span>
        </div>

        {/* Memory Usage */}
        <div className="bg-bg-surface border border-border-default p-4 rounded-lg flex flex-col justify-between h-[110px] hover:border-gold-primary/30 transition-all">
          <span className="text-[10px] font-bold tracking-wider text-text-secondary uppercase">Memory Usage</span>
          <span className="text-[32px] font-display font-bold text-gold-primary font-mono">{memPct}%</span>
          <span className="text-[11px] font-mono text-text-tertiary">
            {formatBytes(usedMem)} / {formatBytes(totalMem)}
          </span>
        </div>

        {/* Free Memory */}
        <div className="bg-bg-surface border border-border-default p-4 rounded-lg flex flex-col justify-between h-[110px] hover:border-gold-primary/30 transition-all">
          <span className="text-[10px] font-bold tracking-wider text-text-secondary uppercase">Free Memory</span>
          <span className="text-[32px] font-display font-bold text-data-positive font-mono">
            {formatBytes(freeMem)}
          </span>
          <span className="text-[11px] font-mono text-text-tertiary">Available RAM capacity</span>
        </div>

        {/* Collections Count */}
        <div className="bg-bg-surface border border-border-default p-4 rounded-lg flex flex-col justify-between h-[110px] hover:border-gold-primary/30 transition-all">
          <span className="text-[10px] font-bold tracking-wider text-text-secondary uppercase">Collections</span>
          <span className="text-[32px] font-display font-bold text-text-primary font-mono">
            {dbStatus?.collections || 4}
          </span>
          <span className="text-[11px] font-mono text-text-tertiary">Active database tables</span>
        </div>
      </div>

      {/* Cache clearing / actions section */}
      <div className="bg-bg-surface border border-border-default p-5 rounded-lg">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-4 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[14px] text-gold-primary">settings_applications</span>
          System Maintenance Tasks
        </h4>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-md border border-border-subtle bg-bg-deep">
          <div>
            <h5 className="text-[13px] font-bold text-text-primary">Flush System Event Logs Cache</h5>
            <p className="text-[11px] text-text-tertiary mt-0.5">
              Purges in-memory request event logs. This action cannot be undone.
            </p>
          </div>
          <button
            onClick={handleClearCache}
            disabled={cacheClearing}
            className="w-full sm:w-auto px-4 py-2 text-[12px] font-bold rounded cursor-pointer border border-data-negative text-data-negative hover:bg-data-negative hover:text-[#0e0e11] disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-wider font-mono flex items-center justify-center gap-2"
          >
            {cacheClearing ? <Spinner size="sm" /> : 'Flush Event Logs'}
          </button>
        </div>
      </div>
    </div>
  );
}
