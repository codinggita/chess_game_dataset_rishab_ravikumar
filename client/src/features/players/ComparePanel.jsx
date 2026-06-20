import { useState, useEffect, useRef } from 'react';
import { searchPlayers } from '../../services/searchService';
import { compare } from '../../services/playerService';
import { showToast } from '../../components/ui/Toast';

export default function ComparePanel() {
  const [player1Query, setPlayer1Query] = useState('');
  const [player2Query, setPlayer2Query] = useState('');
  const [suggestions1, setSuggestions1] = useState([]);
  const [suggestions2, setSuggestions2] = useState([]);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);

  const debounceTimer1 = useRef(null);
  const debounceTimer2 = useRef(null);

  // Debounced search for Player 1
  useEffect(() => {
    if (!player1Query.trim() || player1Query === player1?.username) {
      setSuggestions1([]);
      return;
    }

    if (debounceTimer1.current) clearTimeout(debounceTimer1.current);

    debounceTimer1.current = setTimeout(async () => {
      try {
        const res = await searchPlayers(player1Query);
        setSuggestions1(res.players || []);
      } catch (err) {
        setSuggestions1([]);
      }
    }, 300);

    return () => {
      if (debounceTimer1.current) clearTimeout(debounceTimer1.current);
    };
  }, [player1Query, player1]);

  // Debounced search for Player 2
  useEffect(() => {
    if (!player2Query.trim() || player2Query === player2?.username) {
      setSuggestions2([]);
      return;
    }

    if (debounceTimer2.current) clearTimeout(debounceTimer2.current);

    debounceTimer2.current = setTimeout(async () => {
      try {
        const res = await searchPlayers(player2Query);
        setSuggestions2(res.players || []);
      } catch (err) {
        setSuggestions2([]);
      }
    }, 300);

    return () => {
      if (debounceTimer2.current) clearTimeout(debounceTimer2.current);
    };
  }, [player2Query, player2]);

  // Trigger comparison when both players are selected
  useEffect(() => {
    if (player1 && player2) {
      setLoading(true);
      compare(player1.username, player2.username)
        .then((res) => {
          setComparisonData(res.comparison);
        })
        .catch((err) => {
          showToast(err.response?.data?.message || 'Failed to fetch comparison details', 'error');
          setComparisonData(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setComparisonData(null);
    }
  }, [player1, player2]);

  const selectPlayer1 = (p) => {
    setPlayer1(p);
    setPlayer1Query(p.username);
    setSuggestions1([]);
  };

  const selectPlayer2 = (p) => {
    setPlayer2(p);
    setPlayer2Query(p.username);
    setSuggestions2([]);
  };

  const clearComparison = () => {
    setPlayer1(null);
    setPlayer2(null);
    setPlayer1Query('');
    setPlayer2Query('');
    setComparisonData(null);
    setSuggestions1([]);
    setSuggestions2([]);
  };

  // Helper comparison styles
  const renderCompareRow = (label, key, isLowerBetter = false) => {
    if (!comparisonData) return null;
    const val1 = comparisonData.player1[key] ?? 0;
    const val2 = comparisonData.player2[key] ?? 0;

    let is1Winner = false;
    let is2Winner = false;

    if (val1 !== val2) {
      if (isLowerBetter) {
        is1Winner = val1 < val2;
        is2Winner = val2 < val1;
      } else {
        is1Winner = val1 > val2;
        is2Winner = val2 > val1;
      }
    }

    const cell1Cls = is1Winner
      ? 'text-gold-primary font-bold text-right'
      : 'text-text-secondary text-right';

    const cell2Cls = is2Winner
      ? 'text-gold-primary font-bold text-left'
      : 'text-text-secondary text-left';

    const formatVal = (v) => {
      if (key === 'winRate') return `${v.toFixed(1)}%`;
      return typeof v === 'number' ? v.toLocaleString() : v;
    };

    return (
      <tr className="border-b border-border-subtle/50 hover:bg-bg-row-hover/30 transition-colors">
        <td className={cell1Cls}>{formatVal(val1)}</td>
        <td className="text-center font-mono text-[11px] uppercase tracking-wider text-text-tertiary py-3 px-4 font-semibold">
          {label}
        </td>
        <td className={cell2Cls}>{formatVal(val2)}</td>
      </tr>
    );
  };

  // Calculate Win Rates for comparison display
  if (comparisonData) {
    const p1Total = comparisonData.player1.totalGames || 1;
    const p2Total = comparisonData.player2.totalGames || 1;
    comparisonData.player1.winRate = ((comparisonData.player1.wins || 0) / p1Total) * 100;
    comparisonData.player2.winRate = ((comparisonData.player2.wins || 0) / p2Total) * 100;
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Search Header Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start relative z-20">
        
        {/* Player 1 Selection */}
        <div className="relative flex flex-col w-full">
          <label className="text-[11px] uppercase tracking-widest text-text-tertiary mb-2 font-bold block">
            Select Player 1
          </label>
          <input
            type="text"
            value={player1Query}
            onChange={(e) => setPlayer1Query(e.target.value)}
            placeholder="Type username..."
            className="w-full h-10 rounded-[4px] border border-border-default bg-bg-input px-3.5 text-[14px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-gold-primary transition-colors font-mono"
          />
          {suggestions1.length > 0 && (
            <ul className="absolute top-[72px] left-0 w-full bg-bg-elevated border border-border-strong rounded-md shadow-xl max-h-48 overflow-y-auto z-30 divide-y divide-border-subtle/50 font-mono">
              {suggestions1.map((p) => (
                <li
                  key={p._id}
                  onClick={() => selectPlayer1(p)}
                  className="px-4 py-2.5 hover:bg-bg-hover text-[13px] text-text-primary cursor-pointer flex justify-between items-center"
                >
                  <span>{p.username}</span>
                  <span className="text-[11px] text-gold-primary">Rating: {p.currentRating}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Player 2 Selection */}
        <div className="relative flex flex-col w-full">
          <label className="text-[11px] uppercase tracking-widest text-text-tertiary mb-2 font-bold block">
            Select Player 2
          </label>
          <input
            type="text"
            value={player2Query}
            onChange={(e) => setPlayer2Query(e.target.value)}
            placeholder="Type username..."
            className="w-full h-10 rounded-[4px] border border-border-default bg-bg-input px-3.5 text-[14px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-gold-primary transition-colors font-mono"
          />
          {suggestions2.length > 0 && (
            <ul className="absolute top-[72px] left-0 w-full bg-bg-elevated border border-border-strong rounded-md shadow-xl max-h-48 overflow-y-auto z-30 divide-y divide-border-subtle/50 font-mono">
              {suggestions2.map((p) => (
                <li
                  key={p._id}
                  onClick={() => selectPlayer2(p)}
                  className="px-4 py-2.5 hover:bg-bg-hover text-[13px] text-text-primary cursor-pointer flex justify-between items-center"
                >
                  <span>{p.username}</span>
                  <span className="text-[11px] text-gold-primary">Rating: {p.currentRating}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

      {/* Reset Comparison Action */}
      {(player1 || player2) && (
        <div className="flex justify-end relative z-10">
          <button
            onClick={clearComparison}
            className="text-[12px] font-mono text-data-negative hover:underline cursor-pointer flex items-center gap-1.5"
          >
            ✕ Clear Comparison
          </button>
        </div>
      )}

      {/* Comparison Results Card */}
      <div className="bg-bg-surface border border-border-default rounded-lg p-6 shadow-sm min-h-[300px] flex flex-col justify-center relative z-10">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-t-gold-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            <span className="text-[13px] text-text-secondary font-mono">Computing matchup metrics...</span>
          </div>
        ) : comparisonData ? (
          <div className="w-full overflow-x-auto">
            <table className="w-full font-mono text-[14px]">
              <thead>
                <tr className="border-b border-border-strong text-text-primary font-bold text-[15px]">
                  <th className="text-right pb-3 w-[40%] truncate font-display text-[16px] text-gold-primary">
                    {comparisonData.player1.username}
                  </th>
                  <th className="text-center pb-3 w-[20%] text-[11px] uppercase tracking-wider text-text-tertiary font-bold">
                    VS
                  </th>
                  <th className="text-left pb-3 w-[40%] truncate font-display text-[16px] text-gold-primary">
                    {comparisonData.player2.username}
                  </th>
                </tr>
              </thead>
              <tbody>
                {renderCompareRow('Rating', 'currentRating')}
                {renderCompareRow('Matches Played', 'totalGames')}
                {renderCompareRow('Wins', 'wins')}
                {renderCompareRow('Draws', 'draws')}
                {renderCompareRow('Losses', 'losses', true)}
                {renderCompareRow('Win Rate', 'winRate')}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 flex flex-col items-center justify-center gap-3">
            <span className="material-symbols-outlined text-text-tertiary text-[56px] opacity-40 select-none">
              compare_arrows
            </span>
            <h4 className="text-text-primary font-semibold text-[15px]">No Comparison Active</h4>
            <p className="text-text-secondary text-[13px] max-w-sm">
              Search and select two player profiles above to compare their performance ratios in real-time.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
