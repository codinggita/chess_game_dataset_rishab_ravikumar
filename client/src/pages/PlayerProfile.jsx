import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getByUsername, getOpenings, getRecent } from '../services/playerService';
import { usePageMeta } from '../hooks/usePageMeta';
import { showToast } from '../components/ui/Toast';
import { RatingChart, OpeningPreferences } from '../features/players';

const getTierInfo = (rating) => {
  const r = parseInt(rating, 10) || 0;
  if (r >= 2000) {
    return { label: 'ELITE', avatarBg: 'bg-gold-primary', textColor: 'text-gold-primary' };
  } else if (r >= 1600) {
    return { label: 'EXPERT', avatarBg: 'bg-purple-primary', textColor: 'text-purple-primary' };
  } else if (r >= 1200) {
    return { label: 'INTERMEDIATE', avatarBg: 'bg-data-neutral', textColor: 'text-data-neutral' };
  } else {
    return { label: 'BEGINNER', avatarBg: 'bg-[#35354A]', textColor: 'text-text-secondary' };
  }
};

export default function PlayerProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  usePageMeta(`${username || 'Player'} - Profile`);

  const [player, setPlayer] = useState(null);
  const [openings, setOpenings] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;

    setLoading(true);
    setError(null);

    Promise.all([
      getByUsername(username),
      getOpenings(username),
      getRecent(username),
    ])
      .then(([playerData, openingsData, recentData]) => {
        setPlayer(playerData.player || playerData);
        setOpenings(openingsData.openings || []);
        setRecentMatches(recentData.matches || []);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load player profile');
        showToast(err.response?.data?.message || 'Failed to load player details', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [username]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
        <div className="h-40 animate-pulse bg-bg-surface border border-border-default rounded-lg" />
        <div className="h-72 animate-pulse bg-bg-surface border border-border-default rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 animate-pulse bg-bg-surface border border-border-default rounded-lg" />
          <div className="h-64 animate-pulse bg-bg-surface border border-border-default rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
        <div className="rounded-[6px] border border-border-subtle bg-bg-surface p-6 text-center shadow-sm">
          <p className="text-[14px] text-text-secondary">{error || 'Player not found.'}</p>
          <button
            onClick={() => navigate('/players')}
            className="mt-4 h-[36px] rounded-[4px] bg-gold-primary px-4 text-[13px] font-bold text-[#0B0B0E] cursor-pointer"
          >
            Back to Players List
          </button>
        </div>
      </div>
    );
  }

  const tier = getTierInfo(player.currentRating);
  const initial = player.username ? player.username.charAt(0).toUpperCase() : '?';

  // Calculate Win Rate
  const winRate = player.totalGames > 0 
    ? ((player.wins / player.totalGames) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className="relative flex flex-col gap-6 p-6 pb-16 max-w-7xl mx-auto w-full z-10">
      {/* Grid Watermark Background */}
      <div className="fixed inset-0 chess-grid-bg pointer-events-none z-0" />

      {/* Hero Banner (War Room Style) */}
      <section className="relative z-10 bg-bg-surface border border-border-default rounded-xl p-6 md:p-8 overflow-hidden shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Subtle Watermark */}
        <span className="pointer-events-none absolute bottom-[-30px] right-2 select-none text-[160px] font-bold leading-none opacity-[0.03] text-gold-primary">
          ♛
        </span>

        {/* Profile Card Header Info */}
        <div className="flex flex-col sm:flex-row items-center gap-5 z-10 text-center sm:text-left">
          <div className="flex flex-col items-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-[#0B0B0E] text-[20px] shadow ${tier.avatarBg}`}>
              {initial}
            </div>
            <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-bg-elevated border border-border-subtle mt-2 ${tier.textColor}`}>
              {tier.label}
            </span>
          </div>
          <div>
            <h2 className="font-display text-text-primary text-[28px] font-bold tracking-tight">
              {player.username}
            </h2>
            <span className="text-[13px] font-mono text-text-tertiary block mt-1">
              ♟ {player.totalGames.toLocaleString()} total games
            </span>
          </div>
        </div>

        {/* 5 Mini Stat Blocks with dividers */}
        <div className="flex flex-wrap items-center justify-center gap-6 z-10 border-t md:border-t-0 border-border-subtle pt-6 md:pt-0 w-full md:w-auto">
          <div className="flex flex-col items-center md:items-start min-w-[70px]">
            <span className="text-[10px] uppercase tracking-widest text-text-tertiary font-bold mb-1">
              Rating
            </span>
            <span className="font-mono text-gold-primary text-[24px] font-bold">
              {player.currentRating ?? '-'}
            </span>
          </div>

          <div className="w-[1px] h-8 bg-border-subtle hidden sm:block" />

          <div className="flex flex-col items-center md:items-start min-w-[70px]">
            <span className="text-[10px] uppercase tracking-widest text-text-tertiary font-bold mb-1">
              Wins
            </span>
            <span className="font-mono text-text-primary text-[24px] font-bold">
              {player.wins ?? 0}
            </span>
          </div>

          <div className="w-[1px] h-8 bg-border-subtle hidden sm:block" />

          <div className="flex flex-col items-center md:items-start min-w-[70px]">
            <span className="text-[10px] uppercase tracking-widest text-text-tertiary font-bold mb-1">
              Losses
            </span>
            <span className="font-mono text-text-primary text-[24px] font-bold">
              {player.losses ?? 0}
            </span>
          </div>

          <div className="w-[1px] h-8 bg-border-subtle hidden sm:block" />

          <div className="flex flex-col items-center md:items-start min-w-[70px]">
            <span className="text-[10px] uppercase tracking-widest text-text-tertiary font-bold mb-1">
              Draws
            </span>
            <span className="font-mono text-text-primary text-[24px] font-bold">
              {player.draws ?? 0}
            </span>
          </div>

          <div className="w-[1px] h-8 bg-border-subtle hidden sm:block" />

          <div className="flex flex-col items-center md:items-start min-w-[70px]">
            <span className="text-[10px] uppercase tracking-widest text-text-tertiary font-bold mb-1">
              Win Rate
            </span>
            <span className="font-mono text-gold-primary text-[24px] font-bold">
              {winRate}%
            </span>
          </div>
        </div>
      </section>

      {/* Rating History Chart Card */}
      <section className="relative z-10 bg-bg-surface border border-border-default rounded-xl p-6 shadow-sm">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary mb-5">
          Rating History
        </h3>
        <RatingChart history={player.ratingHistory} />
      </section>

      {/* Preferences & Recent Matches columns */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Opening Preferences */}
        <section className="bg-bg-surface border border-border-default rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary mb-6">
            Opening Preferences
          </h3>
          <OpeningPreferences openings={openings} totalGames={player.totalGames} />
        </section>

        {/* Right Column: Recent Matches */}
        <section className="bg-bg-surface border border-border-default rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary mb-6">
            Recent Matches
          </h3>
          
          {recentMatches.length === 0 ? (
            <div className="flex items-center justify-center flex-1 h-48">
              <span className="font-mono text-text-tertiary text-[13px]">
                No recent matches recorded.
              </span>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle text-[11px] uppercase tracking-wider text-text-tertiary font-bold">
                    <th className="pb-3 pr-2">Opponent</th>
                    <th className="pb-3 px-2">Rating</th>
                    <th className="pb-3 px-2">Opening</th>
                    <th className="pb-3 px-2">Result</th>
                    <th className="pb-3 pl-2 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle/40">
                  {recentMatches.map((match) => {
                    const isWhite = match.white_id === player.username;
                    const opponent = isWhite ? match.black_id : match.white_id;
                    const opponentRating = isWhite 
                      ? (match.black_rating ?? match.bRating) 
                      : (match.white_rating ?? match.wRating);

                    // Win / Loss / Draw calculation
                    let resultChar = 'D';
                    let resultStyle = 'border-l-4 border-data-neutral pl-3 bg-data-neutral/5';
                    let badgeStyle = 'bg-data-neutral/10 text-data-neutral border-data-neutral/20';

                    if (match.winner !== 'draw') {
                      const isWin = (match.winner === 'white' && isWhite) || (match.winner === 'black' && !isWhite);
                      if (isWin) {
                        resultChar = 'W';
                        resultStyle = 'border-l-4 border-data-positive pl-3 bg-data-positive/5';
                        badgeStyle = 'bg-data-positive/10 text-data-positive border-data-positive/20';
                      } else {
                        resultChar = 'L';
                        resultStyle = 'border-l-4 border-data-negative pl-3 bg-data-negative/5';
                        badgeStyle = 'bg-data-negative/10 text-data-negative border-data-negative/20';
                      }
                    }

                    const matchDate = match.created_at 
                      ? new Date(parseFloat(match.created_at)).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })
                      : '-';

                    return (
                      <tr 
                        key={match._id || match.id} 
                        className={`hover:bg-bg-row-hover/30 transition-colors text-[13px]`}
                      >
                        {/* Styled left border by result inside td */}
                        <td className={`py-3 pr-2 font-semibold ${resultStyle}`}>
                          <Link 
                            to={`/players/${opponent}`}
                            className="text-text-primary hover:text-gold-primary transition-colors block truncate max-w-[120px]"
                          >
                            {opponent}
                          </Link>
                        </td>
                        <td className="py-3 px-2 font-mono text-text-secondary">
                          {opponentRating ?? '-'}
                        </td>
                        <td className="py-3 px-2 text-text-secondary truncate max-w-[150px]" title={match.opening_name}>
                          {match.opening_name || '-'}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`inline-block px-1.5 py-0.5 text-[10px] font-bold rounded border ${badgeStyle}`}>
                            {resultChar}
                          </span>
                        </td>
                        <td className="py-3 pl-2 text-right font-mono text-[12px] text-text-tertiary">
                          {matchDate}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
