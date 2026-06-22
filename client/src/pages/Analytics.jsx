import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import TickerBar from '../features/analytics/TickerBar';
import OpeningMatrix from '../features/analytics/OpeningMatrix';
import TelemetryTerminal from '../features/analytics/TelemetryTerminal';
import { getAverageRating, getWhiteWinRate, getMonthlyGames } from '../services/statsService';
import { getTurnCountAvg } from '../services/analyticsService';
import { getLatest } from '../services/matchService';
import Spinner from '../components/ui/Spinner';

export default function Analytics() {
  usePageMeta('Grandmaster War Room');
  const navigate = useNavigate();

  // State variables
  const [loading, setLoading] = useState(true);
  const [averageElo, setAverageElo] = useState(1594);
  const [winRate, setWinRate] = useState(49.9);
  const [avgMoves, setAvgMoves] = useState(60.5);
  const [recentMatches, setRecentMatches] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartPeriod, setChartPeriod] = useState('ALL'); // 7D, 30D, ALL

  // System stats (telemetry)
  const [cpuUsage, setCpuUsage] = useState(12);
  const [memoryUsage, setMemoryUsage] = useState(1.2);

  useEffect(() => {
    // Dynamic system stats simulator
    const statsInterval = setInterval(() => {
      setCpuUsage((c) => Math.max(5, Math.min(95, Math.floor(c + (Math.random() * 6 - 3)))));
      setMemoryUsage((m) => parseFloat(Math.max(1.0, Math.min(7.8, m + (Math.random() * 0.2 - 0.1))).toFixed(1)));
    }, 3000);

    // Fetch dashboard stats from real endpoints
    Promise.all([
      getAverageRating().catch(() => ({ avgOverall: 1594 })),
      getWhiteWinRate().catch(() => 49.9),
      getTurnCountAvg().catch(() => ({ avgTurns: 60.5 })),
      getLatest().catch(() => []),
      getMonthlyGames().catch(() => [])
    ])
      .then(([eloRes, winRes, movesRes, matchesRes, gamesRes]) => {
        if (eloRes?.avgOverall) setAverageElo(eloRes.avgOverall);
        if (typeof winRes === 'number') {
          setWinRate(winRes);
        } else if (winRes?.rate) {
          setWinRate(parseFloat(winRes.rate));
        }
        if (movesRes?.avgTurns) setAvgMoves(movesRes.avgTurns);
        
        // Take top 5 recent matches
        const matchesList = Array.isArray(matchesRes) ? matchesRes : (matchesRes?.matches || []);
        setRecentMatches(matchesList.slice(0, 5));

        // Format games volume data for the AreaChart
        const formattedGames = (gamesRes || []).map((item) => ({
          name: item.month || 'Unknown',
          games: item.count || 0
        }));
        setChartData(formattedGames);
      })
      .catch((err) => console.error('Error fetching analytics data:', err))
      .finally(() => setLoading(false));

    return () => clearInterval(statsInterval);
  }, []);

  const handleMatchClick = (id) => {
    navigate(`/matches/${id}`);
  };

  const getFilteredChartData = () => {
    if (chartPeriod === '7D') return chartData.slice(-7);
    if (chartPeriod === '30D') return chartData.slice(-30);
    return chartData;
  };

  const getDotColor = (winner) => {
    if (winner === 'white') return 'bg-gold-primary';
    if (winner === 'black') return 'bg-purple-primary';
    return 'bg-data-neutral';
  };

  const getResultText = (winner) => {
    if (winner === 'white') return '1-0';
    if (winner === 'black') return '0-1';
    return '1/2-1/2';
  };

  return (
    <div className="h-[calc(100vh-56px)] bg-[#0e0e11] text-text-primary relative font-ui flex flex-col -m-6 overflow-hidden">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none z-0" 
        style={{
          backgroundImage: `linear-gradient(#252530 1px, transparent 1px), linear-gradient(90deg, #252530 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
          opacity: 0.04
        }}
      />

      {/* Top auto-scrolling stats ticker */}
      <TickerBar />

      {loading ? (
        <div className="flex-grow flex items-center justify-center min-h-[500px]">
          <div className="flex flex-col items-center gap-3">
            <Spinner size="lg" />
            <span className="font-mono text-text-secondary text-[12px] uppercase tracking-widest animate-pulse">
              Initializing War Room Interface...
            </span>
          </div>
        </div>
      ) : (
        /* Main Grid Content */
        <div className="flex-grow p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 z-10 relative lg:overflow-hidden pb-14 h-[calc(100vh-100px)]">
          {/* Column 1: Primary Metrics & Matches */}
          <div className="flex flex-col gap-6 lg:h-full lg:overflow-hidden">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bg-surface border border-border-default p-4 rounded-lg flex flex-col justify-between h-[130px] hover:border-gold-primary/40 transition-colors">
                <span className="text-[10px] font-bold tracking-widest text-text-secondary uppercase">AVG PLAYER ELO</span>
                <span className="text-[36px] font-display font-bold text-gold-primary tracking-tight font-mono">
                  {averageElo}
                </span>
                <span className="text-[11px] font-mono text-data-positive flex items-center gap-1">
                  <span className="text-[8px]">▲</span> +12 this month
                </span>
              </div>
              
              <div className="bg-bg-surface border border-border-default p-4 rounded-lg flex flex-col justify-between h-[130px] hover:border-gold-primary/40 transition-colors">
                <span className="text-[10px] font-bold tracking-widest text-text-secondary uppercase">WIN RATE</span>
                <span className="text-[36px] font-display font-bold text-text-primary tracking-tight font-mono">
                  {winRate}%
                </span>
                <span className="text-[11px] font-mono text-data-positive flex items-center gap-1">
                  <span className="text-[8px]">▲</span> Top 1%
                </span>
              </div>
            </div>

            <div className="bg-bg-surface border border-border-default p-4 rounded-lg flex flex-col justify-between h-[100px] hover:border-gold-primary/40 transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold tracking-widest text-text-secondary uppercase">AVG MOVES</span>
                <span className="text-[11px] font-mono text-data-negative flex items-center gap-1">
                  <span className="text-[8px]">▼</span> -0.5 vs prev
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-[24px] font-display font-bold text-gold-primary font-mono">
                  {avgMoves.toFixed(1)}
                </span>
              </div>
              <div className="w-full bg-border-subtle h-[3px] rounded-full mt-2 overflow-hidden">
                <div className="bg-gold-primary h-full rounded-full" style={{ width: `${Math.min(100, (avgMoves / 120) * 100)}%` }}></div>
              </div>
            </div>

            {/* Recent Matches list */}
            <div className="bg-bg-surface border border-border-default rounded-lg flex flex-col flex-1 min-h-[300px] lg:min-h-0 overflow-hidden hover:border-gold-primary/20 transition-colors">
              <div className="p-3 border-b border-border-default flex justify-between items-center bg-bg-deep">
                <span className="font-ui text-[11px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-gold-primary">history</span>
                  Recent Matches
                </span>
                <span className="material-symbols-outlined text-[16px] text-gold-primary cursor-pointer hover:text-text-primary select-none">
                  sort
                </span>
              </div>
              
              <div className="flex-grow overflow-y-auto p-2 space-y-1 terminal-scroll">
                {recentMatches.map((match) => (
                  <div
                    key={match.id}
                    onClick={() => handleMatchClick(match.id)}
                    className="flex items-center justify-between p-2.5 rounded-[4px] hover:bg-bg-elevated border-l-2 border-transparent hover:border-gold-primary cursor-pointer transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${getDotColor(match.winner)} shadow-[0_0_4px_currentColor]`} />
                      <div>
                        <div className="font-mono text-[12px] font-semibold text-text-primary">
                          vs {match.winner === 'white' ? match.black_id : match.white_id}
                        </div>
                        <div className="font-ui text-[10px] text-text-tertiary">
                          {match.increment_code} • {match.winner === 'white' ? 'White' : 'Black'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className={`text-[12px] font-bold ${match.winner === 'white' ? 'text-gold-primary' : 'text-purple-primary'}`}>
                        {getResultText(match.winner)}
                      </div>
                      <div className="text-[10px] text-text-tertiary">{match.turns} moves</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Center Analytics */}
          <div className="flex flex-col gap-6 lg:h-full lg:overflow-hidden">
            {/* Volume Chart */}
            <div className="bg-bg-surface border border-border-default rounded-lg flex flex-col flex-1 min-h-[300px] lg:min-h-0 overflow-hidden hover:border-gold-primary/20 transition-colors">
              <div className="p-3 border-b border-border-default flex justify-between items-center bg-bg-deep">
                <span className="font-ui text-[11px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-gold-primary">show_chart</span>
                  Volume & Intensity
                </span>
                
                <div className="flex space-x-1.5">
                  {['7D', '30D', 'ALL'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setChartPeriod(period)}
                      className={`px-2 py-0.5 font-mono text-[10px] rounded-[2px] cursor-pointer transition-all uppercase ${
                        chartPeriod === period
                          ? 'bg-gold-primary text-[#0e0e11] font-bold'
                          : 'bg-bg-elevated text-text-secondary border border-border-default hover:bg-bg-hover hover:text-text-primary'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-full h-[220px] p-4 relative">
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={getFilteredChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-gold-primary)" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="var(--color-gold-primary)" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="name"
                      stroke="var(--color-text-tertiary)"
                      fontSize={10}
                      fontFamily="var(--font-family-mono)"
                      tickLine={false}
                    />
                    <YAxis
                      stroke="var(--color-text-tertiary)"
                      fontSize={10}
                      fontFamily="var(--font-family-mono)"
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-bg-elevated)',
                        borderColor: 'var(--color-border-strong)',
                        color: 'var(--color-text-primary)',
                        fontFamily: 'var(--font-family-mono)',
                        fontSize: '11px',
                        borderRadius: '4px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="games"
                      stroke="var(--color-gold-primary)"
                      strokeWidth={1.5}
                      fill="url(#chartGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Opening Success Matrix */}
            <OpeningMatrix />
          </div>

          {/* Column 3: Telemetry & Terminal */}
          <div className="lg:h-full lg:overflow-hidden">
            <TelemetryTerminal />
          </div>
        </div>
      )}

      {/* Bottom Status Bar */}
      <footer className="fixed bottom-0 left-0 lg:left-[220px] right-0 h-[32px] bg-bg-deep border-t border-border-default z-[60] flex items-center justify-between px-4 font-mono text-[10px] text-text-tertiary">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-data-positive shadow-[0_0_6px_#2dd4a0] animate-pulse"></span>
            SYSTEM OPTIMAL
          </span>
          <span className="border-l border-border-default pl-4">MEM: {memoryUsage}GB / 8.0GB</span>
          <span className="border-l border-border-default pl-4">CPU: {cpuUsage}%</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>LAST SYNC: 1m ago</span>
          <span className="border-l border-border-default pl-4 text-gold-primary font-semibold">v2.4.1_stable</span>
        </div>
      </footer>
    </div>
  );
}
