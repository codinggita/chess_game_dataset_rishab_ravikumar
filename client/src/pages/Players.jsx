import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchPlayers, fetchStats } from '../store/slices/dataSlice';
import { usePageMeta } from '../hooks/usePageMeta';
import PageHeader from '../components/ui/PageHeader';
import Pagination from '../components/ui/Pagination';
import { PlayerCard, ComparePanel } from '../features/players';
import { getTopRated, getTopActive, getTopWinning } from '../services/playerService';
import { searchPlayers } from '../services/searchService';
import { showToast } from '../components/ui/Toast';

const TABS = [
  { id: 'all', label: 'All Players' },
  { id: 'rated', label: 'Top Rated' },
  { id: 'active', label: 'Most Active' },
  { id: 'winning', label: 'Top Winning' },
  { id: 'compare', label: 'Compare' },
];

export default function Players() {
  usePageMeta('Players');
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active tab derived from URL
  const activeTab = searchParams.get('tab') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 12; // Denoted limit per grid page

  // Redux players list (All Players) & stats
  const { items: allPlayers, totalCount, isLoading } = useSelector((s) => s.data.players);
  const statsTotalPlayers = useSelector((s) => s.data.stats.totalPlayers);

  // Local state for search & leaderboards
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [leaderboardList, setLeaderboardList] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  const debounceTimer = useRef(null);

  // Fetch stats on mount to ensure we have the total players count for pagination
  useEffect(() => {
    if (!statsTotalPlayers) {
      dispatch(fetchStats());
    }
  }, [dispatch, statsTotalPlayers]);

  // Handle Tab Switch
  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId, page: '1' });
    setSearchQuery('');
    setSearchResults([]);
  };

  // Sync / Load data based on tab & page
  useEffect(() => {
    if (activeTab === 'all') {
      if (!searchQuery) {
        dispatch(fetchPlayers({ page, limit: pageSize }));
      }
    } else if (activeTab === 'rated') {
      setLeaderboardLoading(true);
      getTopRated()
        .then((res) => setLeaderboardList(res.players || []))
        .catch(() => showToast('Failed to load top rated players', 'error'))
        .finally(() => setLeaderboardLoading(false));
    } else if (activeTab === 'active') {
      setLeaderboardLoading(true);
      getTopActive()
        .then((res) => setLeaderboardList(res.players || []))
        .catch(() => showToast('Failed to load active players', 'error'))
        .finally(() => setLeaderboardLoading(false));
    } else if (activeTab === 'winning') {
      setLeaderboardLoading(true);
      getTopWinning()
        .then((res) => setLeaderboardList(res.players || []))
        .catch(() => showToast('Failed to load top winning players', 'error'))
        .finally(() => setLeaderboardLoading(false));
    }
  }, [activeTab, page, searchQuery, dispatch]);

  // Debounced search logic for All Players
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
        const res = await searchPlayers(val);
        setSearchResults(res.players || []);
      } catch (err) {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ tab: activeTab, page: String(newPage) });
  };

  const renderTabHeaders = () => {
    return (
      <div className="flex border-b border-border-subtle/80 mb-6">
        {TABS.map((t) => {
          const active = t.id === activeTab;
          return (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`px-4 py-3 text-[14px] font-medium transition-all border-b-2 -mb-[2px] cursor-pointer ${
                active
                  ? 'border-gold-primary text-gold-primary font-semibold'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    );
  };

  const renderLegend = () => {
    return (
      <div className="flex items-center gap-4 bg-bg-surface border border-border-default rounded-md px-4 py-2 text-[12px] font-mono text-text-secondary mb-6 flex-wrap">
        <span className="text-text-tertiary uppercase tracking-wider font-bold mr-2">Result Ratio:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-data-positive" />
          <span>Wins</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-data-neutral" />
          <span>Draws</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-data-negative" />
          <span>Losses</span>
        </div>
      </div>
    );
  };

  // Decide current items to render
  const isSearchActive = activeTab === 'all' && searchQuery.trim() !== '';
  const currentPlayers = isSearchActive ? searchResults : (activeTab === 'all' ? allPlayers : leaderboardList);
  const loadingState = activeTab === 'all' ? (isSearchActive ? searching : isLoading) : leaderboardLoading;

  // Compute total elements count for header and pagination
  const activeTotalCount = activeTab === 'all' && !searchQuery 
    ? (statsTotalPlayers || totalCount || allPlayers.length) 
    : currentPlayers.length;
  
  const totalPages = Math.ceil(activeTotalCount / pageSize) || 1;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
      <PageHeader 
        title="Players" 
        description="Analyze player profiles, rankings, and structural details" 
        count={activeTotalCount}
      />

      {renderTabHeaders()}

      {activeTab !== 'compare' && renderLegend()}

      {/* Main Tab Panels */}
      {activeTab === 'compare' ? (
        <ComparePanel />
      ) : (
        <div className="flex flex-col gap-6">
          {/* Search bar (for All Players tab only) */}
          {activeTab === 'all' && (
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary text-[18px] select-none">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search username..."
                className="w-full h-[38px] rounded-[4px] border border-border-default bg-bg-input pl-9 pr-4 text-[13px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-gold-primary transition-colors font-mono"
              />
            </div>
          )}

          {loadingState ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-44 animate-pulse bg-bg-surface border border-border-default rounded-lg" />
              ))}
            </div>
          ) : currentPlayers.length === 0 ? (
            <div className="text-center py-16 border border-border-default rounded-lg bg-bg-surface flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-text-tertiary text-[64px] opacity-40 select-none">
                person_search
              </span>
              <h3 className="text-text-primary font-semibold text-[16px]">No Players Found</h3>
              <p className="text-text-secondary text-[13px] max-w-sm">
                We couldn't find any player records matching your criteria. Try adjusting your query.
              </p>
            </div>
          ) : (
            <>
              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentPlayers.map((player, idx) => (
                  <PlayerCard
                    key={player._id || player.username}
                    player={player}
                    rank={activeTab !== 'all' ? idx + 1 : undefined}
                  />
                ))}
              </div>

              {/* Pagination (All Players tab only, when not searching) */}
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
      )}
    </div>
  );
}
