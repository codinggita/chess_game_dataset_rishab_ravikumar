import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getDashboard, getUsers } from '../../services/adminService';
import Spinner from '../../components/ui/Spinner';

export default function DashboardTab() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    bannedUsers: 0,
    deletedMatches: 0,
    uptime: 0,
  });
  const [roleData, setRoleData] = useState([]);
  
  // Static mock admin activity feed
  const [activities] = useState([
    { id: 1, action: 'Promoted user rishab25 to admin', time: '10m ago', admin: 'Chess Analyst' },
    { id: 2, action: 'Banned user spammer_99 (reason: Match fixing)', time: '2h ago', admin: 'Chess Analyst' },
    { id: 3, action: 'Cleared application cache', time: '4h ago', admin: 'System Auto' },
    { id: 4, action: 'Restored Match #8943x after dispute resolution', time: '1d ago', admin: 'Chess Analyst' },
    { id: 5, action: 'Soft deleted Match #1209b (reason: Incomplete PGN data)', time: '2d ago', admin: 'Chess Analyst' },
  ]);

  useEffect(() => {
    Promise.all([
      getDashboard().catch(() => ({ totalUsers: 0, deletedMatches: 0 })),
      getUsers().catch(() => ({ users: [] })),
    ])
      .then(([dashRes, usersRes]) => {
        const usersList = usersRes?.users || [];
        const bannedCount = usersList.filter((u) => u.isBanned).length;
        const adminCount = usersList.filter((u) => u.role === 'admin').length;
        const userCount = usersList.filter((u) => u.role === 'user').length;

        setStats({
          totalUsers: dashRes.totalUsers || usersList.length || 0,
          bannedUsers: bannedCount,
          deletedMatches: dashRes.deletedMatches || 0,
          uptime: parseFloat(typeof process !== 'undefined' && process.uptime ? process.uptime() : 3600), // default or system uptime
        });

        setRoleData([
          { name: 'Admins', value: adminCount, color: '#C9A84C' },
          { name: 'Users', value: userCount, color: '#4F4F5A' },
        ]);
      })
      .catch((err) => console.error('Error loading admin dashboard stats:', err))
      .finally(() => setLoading(false));
  }, []);

  // System Uptime real-time ticking
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      setStats((prev) => ({ ...prev, uptime: prev.uptime + 1 }));
    }, 1000);
    return () => clearInterval(interval);
  }, [loading]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-bg-surface border border-border-default p-4 rounded-lg flex flex-col justify-between h-[110px] hover:border-gold-primary/30 transition-all">
          <span className="text-[10px] font-bold tracking-wider text-text-secondary uppercase">Total Users</span>
          <span className="text-[32px] font-display font-bold text-text-primary font-mono">{stats.totalUsers}</span>
          <span className="text-[11px] font-mono text-text-tertiary">Registered accounts</span>
        </div>

        <div className="bg-bg-surface border border-border-default p-4 rounded-lg flex flex-col justify-between h-[110px] hover:border-gold-primary/30 transition-all">
          <span className="text-[10px] font-bold tracking-wider text-text-secondary uppercase">Banned Users</span>
          <span className="text-[32px] font-display font-bold text-data-negative font-mono">{stats.bannedUsers}</span>
          <span className="text-[11px] font-mono text-text-tertiary">Restricted accounts</span>
        </div>

        <div className="bg-bg-surface border border-border-default p-4 rounded-lg flex flex-col justify-between h-[110px] hover:border-gold-primary/30 transition-all">
          <span className="text-[10px] font-bold tracking-wider text-text-secondary uppercase">Deleted Matches</span>
          <span className="text-[32px] font-display font-bold text-gold-primary font-mono">{stats.deletedMatches}</span>
          <span className="text-[11px] font-mono text-text-tertiary">Soft deleted matches</span>
        </div>

        <div className="bg-bg-surface border border-border-default p-4 rounded-lg flex flex-col justify-between h-[110px] hover:border-gold-primary/30 transition-all">
          <span className="text-[10px] font-bold tracking-wider text-text-secondary uppercase">System Uptime</span>
          <span className="text-[20px] font-display font-bold text-text-primary font-mono mt-2 truncate">
            {formatUptime(stats.uptime)}
          </span>
          <span className="text-[11px] font-mono text-text-tertiary">Live runtime counter</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role Distribution Donut Chart */}
        <div className="bg-bg-surface border border-border-default p-4 rounded-lg flex flex-col lg:col-span-1 min-h-[300px]">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-4 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-gold-primary">pie_chart</span>
            Role Distribution
          </h3>
          <div className="flex-1 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={4}
                  dataKey="value"
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-bg-elevated)',
                    borderColor: 'var(--color-border-strong)',
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-family-mono)',
                    fontSize: '11px',
                    borderRadius: '4px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-2 text-[11px] font-mono">
            {roleData.map((entry, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-text-secondary">{entry.name}:</span>
                <span className="text-text-primary font-bold">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Admin Activity Feed */}
        <div className="bg-bg-surface border border-border-default p-4 rounded-lg flex flex-col lg:col-span-2 min-h-[300px]">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-4 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-gold-primary">security_update_good</span>
            Recent Admin Activity
          </h3>
          <div className="flex-grow overflow-y-auto space-y-3 font-mono text-[12px] leading-relaxed">
            {activities.map((act) => (
              <div key={act.id} className="flex justify-between items-start border-b border-border-subtle/40 pb-2.5 last:border-0 last:pb-0">
                <div className="space-y-0.5">
                  <div className="text-text-primary">{act.action}</div>
                  <div className="text-[10px] text-text-tertiary">By {act.admin}</div>
                </div>
                <div className="text-[10px] text-text-tertiary whitespace-nowrap">{act.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
