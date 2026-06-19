import { useEffect, useState } from 'react';
import { getStats } from '../../services/playerService';

export default function MatchHero({ match }) {
  const [whiteStats, setWhiteStats] = useState(null);
  const [blackStats, setBlackStats] = useState(null);

  useEffect(() => {
    if (match?.white_id) {
      getStats(match.white_id)
        .then((data) => setWhiteStats(data))
        .catch(() => {});
    }
  }, [match?.white_id]);

  useEffect(() => {
    if (match?.black_id) {
      getStats(match.black_id)
        .then((data) => setBlackStats(data))
        .catch(() => {});
    }
  }, [match?.black_id]);

  const whiteRating = match?.white_rating ?? match?.wRating ?? '-';
  const blackRating = match?.black_rating ?? match?.bRating ?? '-';

  const whiteInitial = match?.white_id ? match.white_id.charAt(0).toUpperCase() : '?';
  const blackInitial = match?.black_id ? match.black_id.charAt(0).toUpperCase() : '?';

  // Determine score text and progress bar width based on winner
  const winner = match?.winner;
  let scoreText = '1/2-1/2';
  let scoreWidth = '50%';
  if (winner === 'white') {
    scoreText = '1-0';
    scoreWidth = '100%';
  } else if (winner === 'black') {
    scoreText = '0-1';
    scoreWidth = '0%';
  }

  const getVictoryLabel = (status) => {
    if (!status) return '';
    if (status === 'mate') return 'CHECKMATE';
    if (status === 'resign') return 'RESIGNATION';
    if (status === 'outoftime') return 'TIMEOUT';
    return status.toUpperCase();
  };

  const victoryLabel = getVictoryLabel(match?.victory_status);

  return (
    <section className="relative bg-bg-surface border border-border-strong rounded-xl overflow-visible shadow-lg min-h-[240px] flex flex-col md:flex-row">
      {/* White Player Panel */}
      <div className="flex-1 bg-bg-secondary p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border-strong relative overflow-hidden group rounded-t-xl md:rounded-tr-none md:rounded-l-xl">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-primary/5 to-transparent opacity-50 pointer-events-none"></div>
        
        {/* Subtle Watermark */}
        <span className="pointer-events-none absolute bottom-2 right-2 select-none text-[90px] font-bold leading-none opacity-[0.03] text-gold-primary">
          ♔
        </span>

        {/* Custom Premium Avatar */}
        <div className="w-24 h-24 rounded-xl border-2 border-gold-primary/30 overflow-hidden mb-6 relative z-10 shadow-2xl transform group-hover:scale-105 transition-transform duration-500 flex items-center justify-center bg-gradient-to-br from-gold-primary/20 to-bg-base">
          <span className="text-[36px] font-bold text-gold-primary font-display">
            {whiteInitial}
          </span>
          <span className="absolute bottom-1 right-2 text-[20px] opacity-20 pointer-events-none select-none text-gold-primary">
            ♔
          </span>
        </div>

        <div className="text-center relative z-10">
          <h2 className="font-display text-text-primary text-[20px] font-semibold mb-1 truncate max-w-[240px]">
            {match?.white_id || '-'}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white shadow-sm border border-border-strong"></span>
            <span className="font-mono text-gold-primary text-[28px] font-bold leading-none">
              {whiteRating}
            </span>
          </div>

          {/* Record Chips */}
          <div className="flex justify-center gap-2 mt-4 text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded bg-data-positive/10 text-data-positive border border-data-positive/20">
              W: {whiteStats?.wins ?? '-'}
            </span>
            <span className="px-2 py-0.5 rounded bg-data-negative/10 text-data-negative border border-data-negative/20">
              L: {whiteStats?.losses ?? '-'}
            </span>
            <span className="px-2 py-0.5 rounded bg-data-neutral/10 text-data-neutral border border-data-neutral/20">
              D: {whiteStats?.draws ?? '-'}
            </span>
          </div>
        </div>
      </div>

      {/* VS Badge / Floating Badge */}
      <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-20 bg-bg-elevated border border-gold-primary/45 rounded-lg px-8 py-4 flex items-center gap-6 shadow-2xl self-center my-6 md:my-0">
        <span className="material-symbols-outlined text-text-primary text-[28px] opacity-80 select-none">
          chess
        </span>
        <div className="flex flex-col items-center min-w-[70px]">
          <span className="font-mono text-gold-primary font-bold tracking-widest text-[36px] leading-none mb-1">
            {scoreText}
          </span>
          <div className="h-[2px] w-full bg-border-strong rounded-full overflow-hidden">
            <div 
              className="h-full bg-gold-primary transition-all duration-500" 
              style={{ width: scoreWidth }}
            />
          </div>
        </div>
        <span className="material-symbols-outlined text-text-secondary text-[28px] opacity-80 select-none">
          chess
        </span>
      </div>

      {/* Black Player Panel */}
      <div className="flex-1 bg-[#0b0b0e] p-8 flex flex-col items-center justify-center relative overflow-hidden group rounded-b-xl md:rounded-bl-none md:rounded-r-xl">
        {/* Subtle Watermark */}
        <span className="pointer-events-none absolute bottom-2 right-2 select-none text-[90px] font-bold leading-none opacity-[0.03] text-text-secondary">
          ♚
        </span>

        {/* Custom Premium Avatar */}
        <div className="w-24 h-24 rounded-xl border-2 border-border-strong overflow-hidden mb-6 relative z-10 shadow-2xl transform group-hover:scale-105 transition-transform duration-500 flex items-center justify-center bg-gradient-to-br from-border-strong to-bg-base">
          <span className="text-[36px] font-bold text-text-secondary font-display">
            {blackInitial}
          </span>
          <span className="absolute bottom-1 right-2 text-[20px] opacity-20 pointer-events-none select-none text-text-secondary">
            ♚
          </span>
        </div>

        <div className="text-center relative z-10">
          <h2 className="font-display text-text-primary text-[20px] font-semibold mb-1 truncate max-w-[240px]">
            {match?.black_id || '-'}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-border-strong shadow-sm border border-border-strong"></span>
            <span className="font-mono text-text-secondary text-[28px] font-bold leading-none">
              {blackRating}
            </span>
          </div>

          {/* Record Chips */}
          <div className="flex justify-center gap-2 mt-4 text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded bg-data-positive/10 text-data-positive border border-data-positive/20">
              W: {blackStats?.wins ?? '-'}
            </span>
            <span className="px-2 py-0.5 rounded bg-data-negative/10 text-data-negative border border-data-negative/20">
              L: {blackStats?.losses ?? '-'}
            </span>
            <span className="px-2 py-0.5 rounded bg-data-neutral/10 text-data-neutral border border-data-neutral/20">
              D: {blackStats?.draws ?? '-'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
