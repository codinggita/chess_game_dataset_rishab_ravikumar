import { showToast } from '../../components/ui/Toast';

export default function MoveSequence({ match }) {
  if (!match || !match.moves) {
    return (
      <div className="rounded-xl border border-border-strong bg-bg-surface p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border-strong pb-4 mb-4">
          <h3 className="font-display text-text-primary flex items-center gap-3 text-[16px] font-semibold">
            <span className="material-symbols-outlined text-gold-primary text-[20px]">
              format_list_numbered
            </span>
            Move Sequence
          </h3>
        </div>
        <p className="text-[14px] font-mono text-text-tertiary">No moves recorded.</p>
      </div>
    );
  }

  // Parse moves string (space-separated)
  const movesArray = match.moves.trim().split(/\s+/).filter(Boolean);
  const pairs = [];
  for (let i = 0; i < movesArray.length; i += 2) {
    pairs.push({
      num: Math.floor(i / 2) + 1,
      white: movesArray[i],
      black: movesArray[i + 1] || null,
    });
  }

  // PGN generation logic for the quick copy button
  const handleCopyPGN = () => {
    const dateObj = match.created_at ? new Date(parseFloat(match.created_at)) : new Date();
    const dateStr = !isNaN(dateObj.getTime())
      ? dateObj.toISOString().slice(0, 10).replace(/-/g, '.')
      : '????.??.??';

    let resultStr = '*';
    if (match.winner === 'white') resultStr = '1-0';
    else if (match.winner === 'black') resultStr = '0-1';
    else if (match.winner === 'draw') resultStr = '1/2-1/2';

    const headers = [
      `[Event "ChessIQ Analytics Match"]`,
      `[Site "ChessIQ"]`,
      `[Date "${dateStr}"]`,
      `[Round "1"]`,
      `[White "${match.white_id || 'White Player'}"]`,
      `[Black "${match.black_id || 'Black Player'}"]`,
      `[Result "${resultStr}"]`,
      match.white_rating || match.wRating ? `[WhiteElo "${match.white_rating || match.wRating}"]` : null,
      match.black_rating || match.bRating ? `[BlackElo "${match.black_rating || match.bRating}"]` : null,
      match.opening_eco ? `[ECO "${match.opening_eco}"]` : null,
      match.opening_name ? `[Opening "${match.opening_name}"]` : null,
      `[TimeControl "${match.increment_code || '-'}"]`,
      match.victory_status ? `[Termination "${match.victory_status}"]` : null,
    ].filter(Boolean).join('\n');

    const movePairs = [];
    for (let i = 0; i < movesArray.length; i += 2) {
      const whiteMove = movesArray[i];
      const blackMove = movesArray[i + 1] ? ' ' + movesArray[i + 1] : '';
      movePairs.push(`${Math.floor(i / 2) + 1}. ${whiteMove}${blackMove}`);
    }
    const movesStr = movePairs.join(' ') + ' ' + resultStr;
    const pgnText = `${headers}\n\n${movesStr}`;

    navigator.clipboard.writeText(pgnText);
    showToast('PGN copied to clipboard', 'success');
  };

  const isCritical = (pair) => {
    // Highlight checks and checkmates as critical moves
    const hasCheck = (val) => val && (val.includes('+') || val.includes('#'));
    return hasCheck(pair.white) || hasCheck(pair.black);
  };

  return (
    <section className="bg-bg-surface border border-border-strong rounded-xl p-6 flex flex-col gap-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-border-strong pb-4">
        <h3 className="font-display text-text-primary flex items-center gap-3 text-[16px] font-semibold">
          <span className="material-symbols-outlined text-gold-primary text-[20px] select-none">
            format_list_numbered
          </span>
          Move Sequence
        </h3>
        <button
          onClick={handleCopyPGN}
          className="text-gold-primary hover:text-gold-primary/80 text-[12px] font-mono flex items-center gap-2 border border-gold-primary/30 hover:border-gold-primary px-3 py-1.5 rounded transition-all cursor-pointer bg-gold-primary/5 hover:bg-gold-primary/10"
        >
          <span className="material-symbols-outlined text-[16px] select-none">
            download
          </span> 
          Export PGN
        </button>
      </div>

      {/* High Density Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-x-4 gap-y-6 font-mono text-[14px]">
        {pairs.map((pair) => {
          const critical = isCritical(pair);
          
          const isWhiteCritical = pair.white && (pair.white.includes('+') || pair.white.includes('#'));
          const isBlackCritical = pair.black && (pair.black.includes('+') || pair.black.includes('#'));

          return (
            <div
              key={pair.num}
              className={
                critical
                  ? "flex flex-col gap-1.5 bg-bg-elevated rounded p-2 border border-gold-primary/50 glow-critical relative transition-all hover:bg-bg-hover cursor-pointer"
                  : "flex flex-col gap-1.5 hover:bg-bg-elevated rounded p-2 transition-all cursor-pointer group"
              }
            >
              {critical && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gold-primary rounded-full animate-pulse" />
              )}
              <span className={critical ? "text-gold-primary text-[11px] font-bold" : "text-text-tertiary text-[11px]"}>
                {pair.num}.
              </span>
              <div className="flex flex-col gap-1">
                <span className={isWhiteCritical ? "text-gold-primary font-bold" : "text-text-primary font-semibold group-hover:text-gold-primary transition-colors"}>
                  {pair.white}
                </span>
                {pair.black ? (
                  <span className={isBlackCritical ? "text-gold-primary font-bold" : "text-text-secondary"}>
                    {pair.black}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
