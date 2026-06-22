import { useEffect, useState } from 'react';
import { getOpeningSuccess } from '../../services/analyticsService';
import Spinner from '../../components/ui/Spinner';

export default function OpeningMatrix() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOpeningSuccess()
      .then((res) => {
        // Take top 16 entries for the 4x4 matrix
        setData(res || []);
      })
      .catch((err) => console.error('Failed to fetch opening success matrix:', err))
      .finally(() => setLoading(false));
  }, []);

  const getCellClass = (winRate) => {
    if (winRate > 52) {
      return 'bg-data-positive/10 border border-data-positive/30 text-data-positive hover:bg-data-positive/25';
    } else if (winRate >= 45) {
      return 'bg-bg-elevated border border-border-default text-text-secondary hover:bg-bg-hover hover:text-text-primary';
    } else {
      return 'bg-data-negative/10 border border-data-negative/30 text-data-negative hover:bg-data-negative/25';
    }
  };

  return (
    <div className="bg-bg-surface border border-border-default rounded-lg flex flex-col h-[280px] lg:h-auto lg:flex-1 lg:min-h-0 overflow-hidden">
      <div className="p-3 border-b border-border-default flex justify-between items-center bg-bg-deep">
        <div className="font-ui text-[11px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[14px] text-gold-primary">grid_on</span>
          Opening Success Matrix
        </div>
      </div>
      
      <div className="flex-grow p-3 flex flex-col justify-center">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Spinner size="md" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-10 text-[12px] text-text-tertiary">No data available</div>
        ) : (
          <div className="grid grid-cols-4 grid-rows-4 gap-1.5 h-full">
            {data.slice(0, 16).map((item, idx) => {
              const displayLabel = item.eco || item.name?.split(':')[0] || 'Unknown';
              return (
                <div
                  key={idx}
                  className={`flex flex-col justify-center items-center rounded-[2px] transition-all cursor-default font-mono p-1 text-center ${getCellClass(
                    item.winRate
                  )}`}
                  title={item.name}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wide truncate max-w-full">
                    {displayLabel}
                  </span>
                  <span className="text-[12px] font-semibold mt-0.5">
                    {item.winRate ? `${item.winRate.toFixed(0)}%` : '0%'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
