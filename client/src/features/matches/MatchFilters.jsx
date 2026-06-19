import { useCallback } from 'react';
import { useSessionState } from '../../hooks/useSessionState';
import api from '../../services/api';

const FILTER_GROUPS = [
  {
    label: 'Result',
    key: 'result',
    pills: [
      { label: 'White Wins', value: 'white-wins' },
      { label: 'Black Wins', value: 'black-wins' },
      { label: 'Draws', value: 'draws' },
    ],
  },
  {
    label: 'Rated',
    key: 'rated',
    pills: [
      { label: 'Rated', value: 'rated' },
      { label: 'Unrated', value: 'unrated' },
    ],
  },
  {
    label: 'Victory',
    key: 'victory',
    pills: [
      { label: 'Checkmate', value: 'checkmates' },
      { label: 'Resign', value: 'resignations' },
      { label: 'Timeout', value: 'timeouts' },
    ],
  },
  {
    label: 'Time Control',
    key: 'time',
    pills: [
      { label: 'Bullet', value: 'bullet' },
      { label: 'Blitz', value: 'blitz' },
      { label: 'Rapid', value: 'rapid' },
      { label: 'Classical', value: 'classical' },
    ],
  },
  {
    label: 'Rating',
    key: 'rating',
    pills: [
      { label: 'High Rated', value: 'high-rated' },
      { label: 'Low Rated', value: 'low-rated' },
      { label: 'Long Games', value: 'long-games' },
    ],
  },
];

export default function MatchFilters({ onFilterResults, onClearFilters }) {
  const [activeFilters, setActiveFilters] = useSessionState('matchFilters', {});

  const toggleFilter = useCallback(
    async (groupKey, value) => {
      const current = activeFilters[groupKey];
      let next;

      if (current === value) {
        next = Object.fromEntries(Object.entries(activeFilters).filter(([k]) => k !== groupKey));
      } else {
        next = { ...activeFilters, [groupKey]: value };
      }

      setActiveFilters(next);

      const activeValues = Object.values(next);
      if (activeValues.length === 0) {
        onClearFilters();
        return;
      }

      try {
        const requests = activeValues.map((v) =>
          api.get(`/matches/filter/${v}`).then((r) => r.data?.data?.matches || []),
        );
        const results = await Promise.all(requests);

        const idSet = new Set(results[0]?.map((m) => m.id || m._id));
        for (let i = 1; i < results.length; i++) {
          const ids = new Set(results[i].map((m) => m.id || m._id));
          for (const id of idSet) {
            if (!ids.has(id)) idSet.delete(id);
          }
        }

        const combined = results[0]?.filter((m) => idSet.has(m.id || m._id)) || [];
        onFilterResults(combined);
      } catch {
        onClearFilters();
      }
    },
    [activeFilters, setActiveFilters, onFilterResults, onClearFilters],
  );

  const clearAll = useCallback(() => {
    setActiveFilters({});
    onClearFilters();
  }, [setActiveFilters, onClearFilters]);

  const hasActive = Object.keys(activeFilters).length > 0;

  return (
    <div className="rounded-[6px] border border-border-subtle bg-bg-surface p-4 shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] font-medium uppercase tracking-[0.05em] text-text-tertiary">
          Filter by
        </span>
        {hasActive && (
          <button
            onClick={clearAll}
            className="text-[11px] font-medium text-gold-primary hover:text-gold-primary/80 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        {FILTER_GROUPS.map((group) => (
          <div key={group.key} className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-text-tertiary mr-1">
              {group.label}:
            </span>
            {group.pills.map((pill) => {
              const isActive = activeFilters[group.key] === pill.value;
              return (
                <button
                  key={pill.value}
                  onClick={() => toggleFilter(group.key, pill.value)}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-[3px] text-[11px] font-medium transition-all ${
                    isActive
                      ? 'bg-gold-primary text-[#0B0B0E] shadow-[0_0_6px_rgba(201,168,76,0.3)]'
                      : 'border border-border-subtle bg-bg-elevated text-text-secondary hover:border-border-strong hover:text-text-primary'
                  }`}
                >
                  {pill.label}
                  {isActive && <span className="text-[9px] ml-0.5">✕</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
