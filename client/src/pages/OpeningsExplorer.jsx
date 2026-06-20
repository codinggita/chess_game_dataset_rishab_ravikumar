import { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchOpenings, fetchStats } from '../store/slices/dataSlice';
import { usePageMeta } from '../hooks/usePageMeta';
import PageHeader from '../components/ui/PageHeader';
import Pagination from '../components/ui/Pagination';
import { OpeningCard } from '../features/openings';
import {
  search as searchOpeningsApi,
  getAggressive,
  getDefensive,
  getGambits,
  getWhiteAdvantage,
  getBlackAdvantage,
  getBeginnerFriendly,
} from '../services/openingService';
import { showToast } from '../components/ui/Toast';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'aggressive', label: 'Aggressive' },
  { id: 'defensive', label: 'Defensive' },
  { id: 'gambit', label: 'Gambit' },
  { id: 'white', label: 'White Advantage' },
  { id: 'black', label: 'Black Advantage' },
  { id: 'beginner', label: 'Beginner Friendly' },
];

const TAB_FETCHERS = {
  aggressive: getAggressive,
  defensive: getDefensive,
  gambit: getGambits,
  white: getWhiteAdvantage,
  black: getBlackAdvantage,
  beginner: getBeginnerFriendly,
};

export default function OpeningsExplorer() {
  usePageMeta('Openings Explorer');
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 20;

  const { items: allOpenings, totalCount, isLoading } = useSelector((s) => s.data.openings);
  const statsTotalPlayers = useSelector((s) => s.data.stats.totalPlayers);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [filteredLoading, setFilteredLoading] = useState(false);

  const debounceTimer = useRef(null);

  useEffect(() => {
    if (!statsTotalPlayers) {
      dispatch(fetchStats());
    }
  }, [dispatch, statsTotalPlayers]);

  const handleTabChange = useCallback((tabId) => {
    setSearchParams({ tab: tabId, page: '1' });
    setSearchQuery('');
    setSearchResults([]);
  }, [setSearchParams]);

  useEffect(() => {
    if (activeTab === 'all') {
      if (!searchQuery) {
        dispatch(fetchOpenings({ page, limit: pageSize }));
      }
    } else {
      const fetcher = TAB_FETCHERS[activeTab];
      if (fetcher) {
        setFilteredLoading(true);
        fetcher()
          .then((res) => setFilteredList(res.openings || res || []))
          .catch(() => showToast('Failed to load openings', 'error'))
          .finally(() => setFilteredLoading(false));
      }
    }
  }, [activeTab, page, searchQuery, dispatch]);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults([]);
      return;
    }
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setSearching(true);

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await searchOpeningsApi(val);
        setSearchResults(res.openings || res || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ tab: activeTab, page: String(newPage) });
  };

  const isSearchActive = activeTab === 'all' && searchQuery.trim() !== '';
  const currentOpenings = isSearchActive
    ? searchResults
    : activeTab === 'all'
      ? allOpenings
      : filteredList;
  const loadingState = activeTab === 'all'
    ? (isSearchActive ? searching : isLoading)
    : filteredLoading;

  const activeTotalCount = activeTab === 'all' && !searchQuery
    ? (totalCount || allOpenings.length)
    : currentOpenings.length;

  const totalPages = Math.ceil(activeTotalCount / pageSize) || 1;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
      <PageHeader
        title="Opening Lab"
        description="Explore chess openings, ECO codes, and win rate analytics"
        count={activeTotalCount}
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-4 items-center border-b border-border-subtle pb-4">
        {TABS.map((t) => {
          const active = t.id === activeTab;
          return (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`px-4 py-2 text-[14px] font-semibold transition-all cursor-pointer ${
                active
                  ? 'border-b-2 border-gold-primary text-gold-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Search Bar (All tab only) */}
      {activeTab === 'all' && (
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary text-[18px] select-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search opening name or ECO code..."
            className="w-full h-[44px] rounded-[4px] border border-border-default bg-bg-input pl-9 pr-4 text-[13px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-gold-primary transition-colors font-mono"
          />
        </div>
      )}

      {/* Grid */}
      {loadingState ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse bg-bg-surface border border-border-default rounded-xl" />
          ))}
        </div>
      ) : currentOpenings.length === 0 ? (
        <div className="text-center py-16 border border-border-default rounded-lg bg-bg-surface flex flex-col items-center justify-center gap-3">
          <span className="material-symbols-outlined text-text-tertiary text-[64px] opacity-40 select-none">
            library_books
          </span>
          <h3 className="text-text-primary font-semibold text-[16px]">No Openings Found</h3>
          <p className="text-text-secondary text-[13px] max-w-sm">
            We couldn't find any openings matching your criteria. Try adjusting your filters or search query.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {currentOpenings.map((opening) => (
              <OpeningCard
                key={opening._id || opening.eco}
                opening={opening}
              />
            ))}
          </div>

          {activeTab === 'all' && !searchQuery && activeTotalCount > pageSize && (
            <Pagination
              page={page}
              totalPages={totalPages}
              total={activeTotalCount}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              className="mt-4"
            />
          )}
        </>
      )}
    </div>
  );
}
