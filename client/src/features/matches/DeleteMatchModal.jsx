import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteMatch, fetchMatches } from '../../store/slices/dataSlice';
import { showToast } from '../../components/ui/Toast';

export default function DeleteMatchModal({ open, onClose, matchId }) {
  const dispatch = useDispatch();
  const [deleting, setDeleting] = useState(false);

  if (!open || !matchId) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteMatch(matchId)).unwrap();
      dispatch(fetchMatches({ page: 1, limit: 10 }));
      showToast('Match deleted', 'success');
      onClose();
    } catch (err) {
      showToast(err || 'Failed to delete match', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-[400px] rounded-[8px] border border-border-strong bg-bg-surface p-6 shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-semibold text-text-primary">Delete Match</h2>
          <button onClick={onClose} className="text-[18px] text-text-tertiary hover:text-text-primary transition-colors">✕</button>
        </div>

        <p className="text-[13px] text-text-secondary mb-2">
          Are you sure you want to delete match{' '}
          <span className="font-mono text-text-primary">{matchId}</span>?
        </p>
        <p className="text-[12px] text-data-negative font-medium mb-5">
          This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-[36px] rounded-[4px] border border-border-subtle bg-bg-elevated text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="flex-1 h-[36px] rounded-[4px] bg-data-negative text-[13px] font-bold text-white hover:brightness-110 transition-all disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
