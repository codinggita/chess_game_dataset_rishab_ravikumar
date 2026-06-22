import { useState } from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import PageHeader from '../components/ui/PageHeader';
import DashboardTab from '../features/admin/DashboardTab';
import UserManagement from '../features/admin/UserManagement';
import SystemHealth from '../features/admin/SystemHealth';
import LogViewer from '../features/admin/LogViewer';

export default function AdminPanel() {
  usePageMeta('Admin Panel');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showWarning, setShowWarning] = useState(true);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'users', label: 'Users', icon: 'group' },
    { id: 'health', label: 'System Health', icon: 'settings_heart' },
    { id: 'logs', label: 'Logs', icon: 'terminal' },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Admin Control Panel"
        description="Manage users, monitor system health, and inspect server telemetry"
      />

      {/* Warning Banner */}
      {showWarning && (
        <div
          className="flex items-center justify-between p-4 rounded border transition-all"
          style={{
            backgroundColor: 'rgba(240,82,82,0.06)',
            borderColor: 'rgba(240,82,82,0.25)',
            color: '#F05252',
          }}
        >
          <div className="flex items-center gap-2 text-[12px] font-medium font-mono">
            <span className="material-symbols-outlined text-[16px] shrink-0">warning</span>
            <span>ADMIN MODE — Changes affect the live database. Proceed with caution.</span>
          </div>
          <button
            onClick={() => setShowWarning(false)}
            className="text-[#F05252] hover:opacity-80 text-[18px] font-bold leading-none cursor-pointer select-none px-2 py-1"
            aria-label="Dismiss warning"
          >
            &times;
          </button>
        </div>
      )}

      {/* Tabs Sub-Nav */}
      <div className="border-b border-border-default flex gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-[12px] font-bold uppercase tracking-wider border-t-2 border-x transition-all cursor-pointer font-mono ${
                isActive
                  ? 'border-t-gold-primary border-x-border-default bg-bg-surface text-gold-primary rounded-t-md'
                  : 'border-t-transparent border-x-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="min-h-[400px]">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'health' && <SystemHealth />}
        {activeTab === 'logs' && <LogViewer />}
      </div>
    </div>
  );
}
