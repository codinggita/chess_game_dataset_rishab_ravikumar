export default function OpeningPreferences({ openings, totalGames }) {
  const list = openings ? openings.slice(0, 5) : [];
  const gamesCount = totalGames || 1;

  if (list.length === 0) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-surface p-6 shadow-sm flex items-center justify-center h-48">
        <span className="font-mono text-text-tertiary text-[13px]">
          No opening preferences recorded.
        </span>
      </div>
    );
  }

  const maxCount = Math.max(...list.map((o) => o.count), 1);

  return (
    <div className="flex flex-col gap-4">
      {list.map((item, index) => {
        const pct = ((item.count / gamesCount) * 100).toFixed(1);
        const barWidth = `${(item.count / maxCount) * 100}%`;

        return (
          <div key={index} className="flex items-center gap-4 w-full">
            {/* ECO Code Chip */}
            <div className="flex-shrink-0 w-11 h-6 border border-gold-primary/30 bg-gold-primary/5 rounded-[3px] flex items-center justify-center">
              <span className="font-mono text-[11px] font-bold text-gold-primary">
                {item.eco}
              </span>
            </div>

            {/* Opening Name & Progress Track */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span 
                  className="text-[13px] text-text-primary font-medium truncate pr-2"
                  title={item.name}
                >
                  {item.name}
                </span>
                <span className="font-mono text-[11px] text-text-secondary flex-shrink-0">
                  {item.count} games ({pct}%)
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#1E1E28] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gold-primary transition-all duration-500 rounded-full" 
                  style={{ width: barWidth }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
