import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats } from '../../store/slices/dataSlice';

export default function TickerBar() {
  const dispatch = useDispatch();
  const stats = useSelector((s) => s.data.stats);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  const items = [
    { label: 'LIVE RATINGS', value: '' },
    { label: 'CARLSEN', value: '2830', trend: '▲ 2.1', trendColor: 'text-data-positive' },
    { label: 'NAKAMURA', value: '2789', trend: '▼ 1.5', trendColor: 'text-data-negative' },
    { label: 'CARUANA', value: '2805', trend: '▲ 4.2', trendColor: 'text-data-positive' },
    { label: 'DING L.', value: '2780', trend: '•', trendColor: 'text-text-secondary' },
    { label: 'FIROUZJA', value: '2770', trend: '▲ 1.1', trendColor: 'text-data-positive' },
    { label: 'DATABASE STATS', value: '' },
    { label: 'TOTAL MATCHES', value: stats?.totalMatches?.toLocaleString() || '20,058' },
    { label: 'TOTAL PLAYERS', value: stats?.totalPlayers?.toLocaleString() || '15,635' },
    { label: 'WHITE WIN RATE', value: `${stats?.whiteWinRate || '49.8'}%` },
    { label: 'BLACK WIN RATE', value: `${stats?.blackWinRate || '47.2'}%` },
    { label: 'DRAW RATE', value: `${stats?.drawRate || '3.0'}%` },
  ];

  const renderContent = () => (
    <div className="flex items-center gap-10 px-4">
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-2 font-mono text-[12px]">
          {item.label === 'LIVE RATINGS' || item.label === 'DATABASE STATS' ? (
            <span className="text-gold-primary font-bold tracking-wider">{item.label}:</span>
          ) : (
            <>
              <span className="text-text-secondary">{item.label}</span>
              <span className="text-text-primary font-semibold">{item.value}</span>
              {item.trend && <span className={item.trendColor}>{item.trend}</span>}
            </>
          )}
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative w-full h-[40px] bg-bg-deep border-b border-border-default flex items-center overflow-hidden z-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-gold-glow via-transparent to-transparent pointer-events-none opacity-50" />
      <div className="flex whitespace-nowrap animate-ticker">
        {renderContent()}
        {renderContent()}
      </div>
    </div>
  );
}
