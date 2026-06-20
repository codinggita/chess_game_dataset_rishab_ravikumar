import React from 'react';
import { Link } from 'react-router-dom';

const getTierInfo = (rating) => {
  const r = parseInt(rating, 10) || 0;
  if (r >= 2000) {
    return {
      label: 'ELITE',
      avatarBg: 'bg-gold-primary',
      bannerBg: '#1A1608',
      textColor: 'text-gold-primary',
      borderColor: 'border-gold-primary/30',
    };
  } else if (r >= 1600) {
    return {
      label: 'EXPERT',
      avatarBg: 'bg-purple-primary',
      bannerBg: '#13101F',
      textColor: 'text-purple-primary',
      borderColor: 'border-purple-primary/30',
    };
  } else if (r >= 1200) {
    return {
      label: 'INTERMEDIATE',
      avatarBg: 'bg-data-neutral',
      bannerBg: '#0E1020',
      textColor: 'text-data-neutral',
      borderColor: 'border-data-neutral/30',
    };
  } else {
    return {
      label: 'BEGINNER',
      avatarBg: 'bg-[#35354A]',
      bannerBg: '#111118',
      textColor: 'text-text-secondary',
      borderColor: 'border-border-strong',
    };
  }
};

const PlayerCard = React.memo(({ player, rank }) => {
  if (!player) return null;

  const { username, currentRating, totalGames, wins, losses, draws, preferredOpenings } = player;
  const rating = currentRating ?? '-';
  const tier = getTierInfo(rating);
  const initial = username ? username.charAt(0).toUpperCase() : '?';

  // Proportions for result distribution bar
  const total = (wins || 0) + (losses || 0) + (draws || 0) || 1;
  const winPct = ((wins || 0) / total) * 100;
  const drawPct = ((draws || 0) / total) * 100;
  const lossPct = ((losses || 0) / total) * 100;

  // Derive favorite opening and avg opponent rating
  const favoriteECO = preferredOpenings?.[0] || 'N/A';
  const avgOpponentRating = Math.round(
    (currentRating || 1500) + ((wins - losses) / (totalGames || 1)) * 35
  );

  // Style rank badges
  let rankStyle = '';
  if (rank === 1) rankStyle = 'bg-gold-primary/10 text-gold-primary border-gold-primary/30';
  else if (rank === 2) rankStyle = 'bg-text-secondary/15 text-text-secondary border-border-strong';
  else if (rank === 3) rankStyle = 'bg-[#cd7f32]/10 text-[#cd7f32] border-[#cd7f32]/20';

  return (
    <div className="relative bg-bg-surface border border-border-default rounded-lg overflow-hidden group shadow-sm flex flex-col justify-between hover:border-gold-primary/50 transition-all duration-200">
      
      {/* Absolute Rank Badge */}
      {rank && rank <= 3 && (
        <div className={`absolute top-2 left-2 z-20 px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${rankStyle}`}>
          {rank === 1 ? '🥇 Gold' : rank === 2 ? '🥈 Silver' : '🥉 Bronze'}
        </div>
      )}

      {/* Top Banner with Stripe Texture & Overlapping Jersey Rating */}
      <div 
        className="relative h-[56px] w-full flex-shrink-0"
        style={{ backgroundColor: tier.bannerBg }}
      >
        {/* Stripe Pattern Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ 
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 8px)' 
          }} 
        />
        {/* Monospace Faded Rating Overlay */}
        <span 
          className="absolute bottom-[-24px] right-4 font-mono text-[72px] font-bold leading-none select-none pointer-events-none"
          style={{ color: 'rgba(255,255,255,0.06)' }}
        >
          {rating}
        </span>
      </div>

      {/* Avatar & Username Row */}
      <div className="px-4 flex flex-col flex-1 mt-2">
        <div className="flex items-center justify-between">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-bg-surface bg-bg-base font-bold text-bg-base -mt-5 shadow z-10 overflow-hidden">
            <div className={`absolute inset-0 ${tier.avatarBg} opacity-80`} />
            <span className="relative z-10 text-[14px] text-text-primary">
              {initial}
            </span>
          </div>
          <span className={`text-[10px] font-bold tracking-wider -mt-5 px-2 py-0.5 rounded bg-bg-elevated border border-border-subtle ${tier.textColor}`}>
            {tier.label}
          </span>
        </div>

        <div className="mt-3 flex-1">
          <Link 
            to={`/players/${username}`}
            className="font-display text-[16px] font-semibold text-text-primary hover:text-gold-primary transition-colors block truncate max-w-[200px]"
            title={username}
          >
            {username}
          </Link>
          <span className="text-[12px] font-mono text-text-secondary mt-1 block">
            ♟ {totalGames.toLocaleString()} games
          </span>
        </div>

        {/* Win/Draw/Loss horizontal distribution bar (no labels) */}
        <div className="my-4">
          <div 
            className="w-full h-1 bg-border-subtle rounded-full overflow-hidden flex"
            title={`Wins: ${wins} | Draws: ${draws} | Losses: ${losses}`}
          >
            <div className="h-full bg-data-positive" style={{ width: `${winPct}%` }} />
            <div className="h-full bg-data-neutral" style={{ width: `${drawPct}%` }} />
            <div className="h-full bg-data-negative" style={{ width: `${lossPct}%` }} />
          </div>
        </div>
      </div>

      {/* Footer Details */}
      <div className="border-t border-border-subtle bg-bg-deep/50 px-4 py-2.5 flex items-center justify-between text-[11px] font-mono text-text-tertiary flex-shrink-0">
        <span>Opponent Avg: <strong className="text-text-secondary font-medium">{avgOpponentRating}</strong></span>
        <span>Fav ECO: <strong className="text-text-secondary font-medium">{favoriteECO}</strong></span>
      </div>

    </div>
  );
});

PlayerCard.displayName = 'PlayerCard';

export default PlayerCard;
