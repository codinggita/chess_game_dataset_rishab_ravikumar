import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { fetchMatches, setMatchPage, archiveMatch } from '../store/slices/dataSlice';
import * as searchService from '../services/searchService';
import * as matchService from '../services/matchService';
import PageHeader from '../components/ui/PageHeader';
import Pagination from '../components/ui/Pagination';
import { showToast } from '../components/ui/Toast';
import MatchFilters from '../features/matches/MatchFilters';
import NewMatchModal from '../features/matches/NewMatchModal';
import DeleteMatchModal from '../features/matches/DeleteMatchModal';

/* ─── Winner border utilities ─── */
const getRowStyle = (winner) => ({
  borderLeft: winner === 'white'
    ? '2px solid #C9A84C'
    : winner === 'black'
    ? '2px solid #35354A'
    : '2px solid #6B7AFF'
});

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
  const navigate = useNavigate();
  const { items, totalCount, page, pageSize, isLoading } = useSelector((state) => state.data.matches);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterResults, setFilterResults] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkProcessing, setBulkProcessing] = useState(false);

  // Initial load & page change
  useEffect(() => {
    if (!searchQuery && !filterResults) {
      dispatch(fetchMatches({ page, limit: pageSize }));
    }
  }, [dispatch, page, pageSize, searchQuery, filterResults]);

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

  const handleFilterResults = useCallback((matches) => {
    setFilterResults(matches);
    setSearchResults(null);
    setSearchQuery('');
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilterResults(null);
  }, []);

  const handleArchive = async (id) => {
    try {
      await dispatch(archiveMatch(id)).unwrap();
      dispatch(fetchMatches({ page, limit: pageSize }));
      showToast('Match archived', 'success');
    } catch (err) {
      showToast(err || 'Failed to archive', 'error');
    }
  };

  // Bulk selection
  const displayData = filterResults !== null ? filterResults : searchResults !== null ? searchResults : items;
  const isDataLoading = isLoading || isSearching;

  const allVisibleSelected = displayData.length > 0 && displayData.every((m) => selectedIds.has(m.id || m._id));
  const someVisibleSelected = displayData.length > 0 && displayData.some((m) => selectedIds.has(m.id || m._id));

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      displayData.forEach((m) => {
        const id = m.id || m._id;
        if (allVisibleSelected) {
          next.delete(id);
        } else {
          next.add(id);
        }
      });
      return next;
    });
  };

  const handleBulkArchive = async () => {
    if (selectedIds.size === 0) return;
    setBulkProcessing(true);
    try {
      await matchService.bulkArchive([...selectedIds]);
      dispatch(fetchMatches({ page, limit: pageSize }));
      showToast(`${selectedIds.size} matches archived`, 'success');
      setSelectedIds(new Set());
    } catch {
      showToast('Bulk archive failed', 'error');
    } finally {
      setBulkProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setBulkProcessing(true);
    try {
      await matchService.bulkDelete([...selectedIds]);
      dispatch(fetchMatches({ page, limit: pageSize }));
      showToast(`${selectedIds.size} matches deleted`, 'success');
      setSelectedIds(new Set());
    } catch {
      showToast('Bulk delete failed', 'error');
    } finally {
      setBulkProcessing(false);
    }
  };

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
      <button
        onClick={() => setShowFilters((p) => !p)}
        className={`flex h-[34px] items-center gap-2 rounded-[4px] border px-3 text-[13px] font-medium transition-colors ${
          showFilters
            ? 'border-gold-primary bg-gold-primary/10 text-gold-primary'
            : 'border-border-subtle bg-bg-surface text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
        }`}
      >
        ⚙ Filters
      </button>
      <button
        onClick={() => setShowNewModal(true)}
        className="flex h-[34px] items-center gap-2 rounded-[4px] bg-gold-primary px-4 text-[13px] font-bold text-[#0B0B0E] transition-all hover:brightness-110"
      >
        + New Match
      </button>
    </>
  );

  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageHeader
        title="Matches"
        count={filterResults !== null ? filterResults.length : searchResults !== null ? searchResults.length : totalCount}
        badge={{ label: 'All', variant: 'pill' }}
        actions={headerActions}
      />

      {showFilters && (
        <MatchFilters onFilterResults={handleFilterResults} onClearFilters={handleClearFilters} />
      )}

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-[6px] border border-gold-primary/30 bg-gold-primary/5 px-4 py-2.5 animate-slide-in-up">
          <span className="text-[13px] font-medium text-gold-primary">
            {selectedIds.size} selected
          </span>
          <div className="ml-auto flex gap-2">
            <button
              onClick={handleBulkArchive}
              disabled={bulkProcessing}
              className="h-[30px] rounded-[4px] border border-border-subtle bg-bg-elevated px-3 text-[12px] font-medium text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
            >
              📁 Archive
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={bulkProcessing}
              className="h-[30px] rounded-[4px] bg-data-negative/10 border border-data-negative/30 px-3 text-[12px] font-medium text-data-negative hover:bg-data-negative/20 transition-colors disabled:opacity-50"
            >
              🗑 Delete
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="h-[30px] rounded-[4px] px-2 text-[12px] text-text-tertiary hover:text-text-primary transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="rounded-[6px] border border-border-subtle bg-bg-surface p-1 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-[13px] whitespace-nowrap border-collapse">
            <thead>
              <tr className="border-b border-border-subtle text-[11px] uppercase tracking-[0.05em] text-text-tertiary">
                <th className="py-3 px-3 text-center font-medium w-[40px]">
                  <input
                    type="checkbox"
                    ref={(el) => {
                      if (el) {
                        el.indeterminate = someVisibleSelected && !allVisibleSelected;
                      }
                    }}
                    checked={allVisibleSelected}
                    onChange={toggleSelectAll}
                    className="accent-gold-primary h-3.5 w-3.5 cursor-pointer"
                  />
                </th>
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
                  <td colSpan="11" className="p-8 text-center text-text-tertiary">Loading...</td>
                </tr>
              ) : displayData.length === 0 ? (
                <tr>
                  <td colSpan="11" className="p-8 text-center text-text-tertiary">No matches found.</td>
                </tr>
              ) : (
                displayData.map((m, i) => {
                  const id = m.id || m._id;
                  const isSelected = selectedIds.has(id);
                  return (
                    <tr
                      key={id || i}
                      className={`group border-b border-border-subtle/50 hover:bg-[#181820] hover:shadow-[inset_3px_0_0_rgba(201,168,76,0.5)] transition-all ${
                        isSelected ? 'bg-gold-primary/5' : ''
                      }`}
                      style={getRowStyle(m.winner)}
                    >
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(id)}
                          className="accent-gold-primary h-3.5 w-3.5 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4">
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
                        {m.white_rating ?? '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Avatar name={m.black_id} />
                          <span className="text-text-primary">{m.black_id || '-'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-right text-text-secondary">
                        {m.black_rating ?? '-'}
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
                        {m.turns ?? '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex gap-2 justify-center">
                          {/* View button */}
                          <button
                            aria-label="View match"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/matches/${id}`);
                            }}
                            className="p-1.5 rounded-md border border-border-subtle text-text-tertiary hover:text-gold-primary hover:border-gold-primary transition-colors"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          </button>

                          {/* Archive button */}
                          <button
                            aria-label="Archive match"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArchive(id);
                            }}
                            className="p-1.5 rounded-md border border-border-subtle text-text-tertiary hover:text-data-warning hover:border-data-warning transition-colors"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="21 8 21 21 3 21 3 8"/>
                              <rect x="1" y="3" width="22" height="5"/>
                              <line x1="10" y1="12" x2="14" y2="12"/>
                            </svg>
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
        {!searchQuery && !filterResults && totalCount > pageSize && (
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

      {/* Modals */}
      <NewMatchModal open={showNewModal} onClose={() => setShowNewModal(false)} />
      <DeleteMatchModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} matchId={deleteTarget} />
    </div>
  );
}
