import React from 'react';
import ECOBox from './ECOBox';

const COMPLEXITY_COLORS = {
  advanced: 'bg-data-negative',
  intermediate: 'bg-[#F59E0B]',
  beginner: 'bg-data-positive',
};

const OpeningCard = React.memo(function OpeningCard({ opening }) {
  const totalGames = opening.totalGames || 0;

  const whiteWinPct = opening.winRate?.white ?? (totalGames > 0 ? ((opening.whiteWins || 0) / totalGames) * 100 : 0);
  const blackWinPct = opening.winRate?.black ?? (totalGames > 0 ? ((opening.blackWins || 0) / totalGames) * 100 : 0);
  const drawPct = opening.winRate?.draw ?? (totalGames > 0 ? ((opening.draws || 0) / totalGames) * 100 : 0);

  const complexityLabel = opening.complexity || null;
  const dotColor = COMPLEXITY_COLORS[complexityLabel] || 'bg-text-tertiary';

  return (
    <div
      className="bg-bg-surface border border-border-default rounded-xl p-6 group hover:border-gold-primary/50 transition-colors cursor-pointer flex flex-col gap-6"
      style={{ transition: 'border-color 150ms, background 150ms' }}
    >
      {/* Top: ECO + Name + Complexity Badge */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4 min-w-0">
          <ECOBox eco={opening.eco} />
          <h2 className="font-display text-[18px] text-text-primary font-bold truncate">
            {opening.name || opening.eco}
          </h2>
        </div>
        {complexityLabel && (
          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
            <span className={`w-2 h-2 rounded-full ${dotColor}`} aria-hidden="true" />
            <span className="inline-flex items-center px-2 py-1 border border-border-subtle text-text-secondary rounded text-[10px] font-bold tracking-widest uppercase">
              {complexityLabel}
            </span>
          </div>
        )}
      </div>

      {/* Win Rate Bars */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between font-mono text-[12px] text-text-secondary">
          <span>White {whiteWinPct.toFixed(1)}%</span>
          <span>Draw {drawPct.toFixed(1)}%</span>
          <span>Black {blackWinPct.toFixed(1)}%</span>
        </div>
        <div className="h-2 flex rounded-full overflow-hidden w-full bg-bg-elevated">
          <div className="h-full bg-gold-primary" style={{ width: `${whiteWinPct}%` }} />
          <div className="h-full bg-[#4a4a58]" style={{ width: `${drawPct}%` }} />
          <div className="h-full bg-[#6B7AFF]" style={{ width: `${blackWinPct}%` }} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-2 pt-4 border-t border-border-subtle">
        <span className="text-[11px] font-bold uppercase tracking-widest text-text-tertiary">
          Total Games
        </span>
        <span className="font-mono text-[14px] font-bold text-gold-primary">
          {totalGames.toLocaleString()}
        </span>
      </div>
    </div>
  );
});

export default OpeningCard;
