import { showToast } from '../../components/ui/Toast';

export default function PGNViewer({ match }) {
  if (!match) return null;

  // Generate Date representation
  const dateObj = match.created_at ? new Date(parseFloat(match.created_at)) : new Date();
  const dateStr = !isNaN(dateObj.getTime())
    ? dateObj.toISOString().slice(0, 10).replace(/-/g, '.')
    : '????.??.??';

  let resultStr = '*';
  if (match.winner === 'white') resultStr = '1-0';
  else if (match.winner === 'black') resultStr = '0-1';
  else if (match.winner === 'draw') resultStr = '1/2-1/2';

  // Build standard PGN headers
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

  // Format moves array into paired standard notation
  const movesArray = match.moves ? match.moves.trim().split(/\s+/) : [];
  const movePairs = [];
  for (let i = 0; i < movesArray.length; i += 2) {
    const whiteMove = movesArray[i];
    const blackMove = movesArray[i + 1] ? ' ' + movesArray[i + 1] : '';
    movePairs.push(`${Math.floor(i / 2) + 1}. ${whiteMove}${blackMove}`);
  }
  const movesStr = movePairs.join(' ') + ' ' + resultStr;

  const pgnText = `${headers}\n\n${movesStr}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pgnText);
    showToast('PGN copied to clipboard', 'success');
  };

  return (
    <div className="relative rounded-[6px] border border-border-subtle bg-bg-surface p-5 flex flex-col h-full min-h-[220px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-medium uppercase tracking-[0.08em] text-text-tertiary">
          PGN Output
        </h3>
        <button
          onClick={handleCopy}
          className="rounded-[4px] border border-border-subtle bg-bg-elevated px-2.5 py-1 text-[11px] font-medium text-text-secondary hover:text-text-primary hover:border-border-strong transition-all flex items-center gap-1"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          Copy PGN
        </button>
      </div>

      <div className="flex-1 overflow-auto rounded-[4px] bg-[#0D0D12] p-4 text-[12px] font-mono text-text-secondary select-text whitespace-pre-wrap leading-relaxed max-h-[260px] border border-border-subtle/50">
        {pgnText}
      </div>
    </div>
  );
}
