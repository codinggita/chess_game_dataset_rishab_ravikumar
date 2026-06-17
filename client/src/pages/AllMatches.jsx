import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePageMeta } from '../hooks/usePageMeta';
import { fetchMatches, setMatchPage } from '../store/slices/dataSlice';
import * as searchService from '../services/searchService';
import PageHeader from '../components/ui/PageHeader';
import Pagination from '../components/ui/Pagination';
import { showToast } from '../components/ui/Toast';

/* ─── Winner border utilities ─── */
function getBorderColorHex(winner) {
  if (winner === 'white') return '#C9A84C';
  if (winner === 'black') return '#35354A';
  return '#6B7AFF';
}

function truncateId(id) {
  if (!id) return '';
  const str = String(id);
  return str.length > 10 ? str.slice(0, 10) + '...' : str;
}

/* ─── Badges ─── */
function ResultBadge({ winner }) {
  if (!winner) return <span className="text-text-tertiary">-</span>;
  const styles = {
    white: 'bg-gold-primary/10 text-gold-primary',
    black: 'bg-[#35354A]/50 text-text-primary',
    draw: 'bg-[#6B7AFF]/10 text-[#6B7AFF]',
  };
  return (
    <span className={`inline-block rounded-sm px-1.5 py-[1px] text-[10px] font-semibold uppercase ${styles[winner] || styles.draw}`}>
      {winner}
    </span>
  );
}

function VictoryBadge({ victory }) {
  if (!victory) return <span className="text-text-tertiary">-</span>;
  return (
    <span className="inline-block rounded-sm border border-border-strong bg-bg-elevated px-1.5 py-[1px] text-[10px] uppercase text-text-secondary">
      {victory}
    </span>
  );
}

function Avatar({ name }) {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-bg-elevated border border-border-strong text-[11px] font-bold text-text-primary flex-shrink-0">
      {initial}
    </div>
  );
}

export default function AllMatches() {
  usePageMeta('Matches');
  const dispatch = useDispatch();
  const { items, totalCount, page, pageSize, isLoading } = useSelector((state) => state.data.matches);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Initial load & page change
  useEffect(() => {
    if (!searchQuery) {
      dispatch(fetchMatches({ page, limit: pageSize }));
    }
  }, [dispatch, page, pageSize, searchQuery]);

  // Debounced Search
  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      const reset = setTimeout(() => {
        setSearchResults(null);
        setIsSearching(false);
      }, 0);
      return () => clearTimeout(reset);
    }

    const handler = setTimeout(() => {
      setIsSearching(true);
      searchService.searchMatches(trimmedQuery)
        .then(res => {
          setSearchResults(Array.isArray(res) ? res : res?.matches || []);
        })
        .catch(() => setSearchResults([]))
        .finally(() => setIsSearching(false));
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleCopy = (id) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    showToast('ID copied to clipboard', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const displayData = searchResults !== null ? searchResults : items;
  const isDataLoading = isLoading || isSearching;

  const headerActions = (
    <>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-text-tertiary">
          🔍
        </span>
        <input
          type="text"
          placeholder="Search matches..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-[34px] w-[280px] rounded-[4px] border border-border-subtle bg-bg-input pl-8 pr-3 text-[13px] text-text-primary placeholder:text-text-tertiary outline-none transition-colors focus:border-gold-primary"
        />
      </div>
      <button className="flex h-[34px] items-center gap-2 rounded-[4px] border border-border-subtle bg-bg-surface px-3 text-[13px] font-medium text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary">
        ⚙ Filters
      </button>
      <button className="flex h-[34px] items-center gap-2 rounded-[4px] bg-gold-primary px-4 text-[13px] font-bold text-[#0B0B0E] transition-all hover:brightness-110">
        + New Match
      </button>
    </>
  );

  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageHeader
        title="Matches"
        count={searchResults !== null ? searchResults.length : totalCount}
        badge={{ label: 'All', variant: 'pill' }}
        actions={headerActions}
      />

      <div className="rounded-[6px] border border-border-subtle bg-bg-surface p-1 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-[13px] whitespace-nowrap border-collapse">
            <thead>
              <tr className="border-b border-border-subtle text-[11px] uppercase tracking-[0.05em] text-text-tertiary">
                <th className="py-3 px-4 text-left font-medium">ID</th>
                <th className="py-3 px-4 text-left font-medium">White</th>
                <th className="py-3 px-4 text-right font-medium">W.Rating</th>
                <th className="py-3 px-4 text-left font-medium">Black</th>
                <th className="py-3 px-4 text-right font-medium">B.Rating</th>
                <th className="py-3 px-4 text-left font-medium">Opening</th>
                <th className="py-3 px-4 text-left font-medium">Result</th>
                <th className="py-3 px-4 text-left font-medium">Victory</th>
                <th className="py-3 px-4 text-right font-medium">Turns</th>
                <th className="py-3 px-4 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isDataLoading && displayData.length === 0 ? (
                <tr>
                  <td colSpan="10" className="p-8 text-center text-text-tertiary">Loading...</td>
                </tr>
              ) : displayData.length === 0 ? (
                <tr>
                  <td colSpan="10" className="p-8 text-center text-text-tertiary">No matches found.</td>
                </tr>
              ) : (
                displayData.map((m, i) => {
                  const id = m.id || m._id;
                  return (
                    <tr
                      key={id || i}
                      className="group border-b border-border-subtle/50 hover:bg-[#181820] hover:shadow-[inset_3px_0_0_rgba(201,168,76,0.5)] transition-all"
                    >
                      <td className="py-3 px-4 border-l-[3px]" style={{ borderLeftColor: getBorderColorHex(m.winner) }}>
                        <button 
                          onClick={() => handleCopy(id)}
                          className="flex items-center gap-1 font-mono text-text-tertiary hover:text-text-primary transition-colors"
                          title="Copy ID"
                        >
                          {truncateId(id)}
                          {copiedId === id && <span className="text-data-positive text-[10px]">✓</span>}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Avatar name={m.white_id} />
                          <span className="text-text-primary">{m.white_id || '-'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-right text-text-secondary">
                        {m.white_rating ?? m.wRating ?? '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Avatar name={m.black_id} />
                          <span className="text-text-primary">{m.black_id || '-'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-right text-text-secondary">
                        {m.black_rating ?? m.bRating ?? '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5" title={m.opening_name || m.opening}>
                          {m.opening_eco && (
                            <span className="rounded-sm border border-gold-primary/40 px-1 py-[1px] text-[9px] font-mono uppercase text-gold-primary bg-gold-primary/5">
                              {m.opening_eco}
                            </span>
                          )}
                          <span className="max-w-[200px] truncate text-text-secondary">
                            {m.opening_name || m.opening || '-'}
                          </span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <ResultBadge winner={m.winner} />
                      </td>
                      <td className="py-3 px-4">
                        <VictoryBadge victory={m.victory_status || m.status} />
                      </td>
                      <td className="py-3 px-4 font-mono text-right text-text-secondary">
                        {m.turns ?? m.num_moves ?? '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-bg-elevated text-[14px] text-text-secondary hover:bg-gold-primary hover:text-[#0B0B0E] transition-colors" title="View">
                            👁
                          </button>
                          <button className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-bg-elevated text-[14px] text-text-secondary hover:text-data-negative transition-colors" title="Archive">
                            📁
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer Pagination */}
        {!searchQuery && totalCount > pageSize && (
          <div className="border-t border-border-subtle p-4">
            <Pagination
              page={page}
              pageSize={pageSize}
              total={totalCount}
              totalPages={Math.ceil(totalCount / pageSize)}
              onPageChange={(p) => dispatch(setMatchPage(p))}
            />
          </div>
        )}
      </div>
    </div>
  );
}
