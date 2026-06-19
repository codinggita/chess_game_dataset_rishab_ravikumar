import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createMatch, fetchMatches } from '../../store/slices/dataSlice';
import { showToast } from '../../components/ui/Toast';

const INITIAL = {
  id: '',
  rated: 'TRUE',
  white_id: '',
  white_rating: '',
  black_id: '',
  black_rating: '',
  winner: '',
  victory_status: '',
  turns: '',
  increment_code: '',
  opening_eco: '',
  opening_name: '',
  opening_ply: '',
  moves: '',
};

const WINNERS = ['', 'white', 'black', 'draw'];
const VICTORY = ['', 'mate', 'resign', 'outoftime', 'draw'];

const inputCls = 'w-full h-[34px] rounded-[4px] border border-border-subtle bg-bg-input px-3 text-[13px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-gold-primary transition-colors';
const labelCls = 'block text-[11px] uppercase tracking-wider text-text-tertiary mb-1';

export default function NewMatchModal({ open, onClose }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.id.trim()) e.id = 'Match ID is required';
    if (form.white_rating && isNaN(Number(form.white_rating))) e.white_rating = 'Must be numeric';
    if (form.black_rating && isNaN(Number(form.black_rating))) e.black_rating = 'Must be numeric';
    if (form.turns && isNaN(Number(form.turns))) e.turns = 'Must be numeric';
    if (form.winner && !WINNERS.includes(form.winner)) e.winner = 'Invalid winner';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const data = { ...form, created_at: String(Date.now()) };
      await dispatch(createMatch(data)).unwrap();
      dispatch(fetchMatches({ page: 1, limit: 10 }));
      showToast('Match created', 'success');
      setForm(INITIAL);
      onClose();
    } catch (err) {
      showToast(err || 'Failed to create match', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-[560px] rounded-[8px] border border-border-strong bg-bg-surface p-6 shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-semibold text-text-primary">New Match</h2>
          <button onClick={onClose} className="text-[18px] text-text-tertiary hover:text-text-primary transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Match ID */}
          <div className="w-full">
            <label className={labelCls}>Match ID *</label>
            <input type="text" value={form.id} onChange={(e) => set('id', e.target.value)} placeholder="e.g. aB12xY34" className={inputCls} />
            {errors.id && <span className="text-[10px] text-data-negative mt-0.5">{errors.id}</span>}
          </div>

          {/* White Player */}
          <div className="flex gap-3">
            <div className="flex-1 min-w-0">
              <label className={labelCls}>White Player</label>
              <input type="text" value={form.white_id} onChange={(e) => set('white_id', e.target.value)} placeholder="Username" className={inputCls} />
            </div>
            <div className="flex-1 min-w-0">
              <label className={labelCls}>White Rating</label>
              <input type="text" value={form.white_rating} onChange={(e) => set('white_rating', e.target.value)} placeholder="1500" className={inputCls} />
              {errors.white_rating && <span className="text-[10px] text-data-negative mt-0.5">{errors.white_rating}</span>}
            </div>
          </div>

          {/* Black Player */}
          <div className="flex gap-3">
            <div className="flex-1 min-w-0">
              <label className={labelCls}>Black Player</label>
              <input type="text" value={form.black_id} onChange={(e) => set('black_id', e.target.value)} placeholder="Username" className={inputCls} />
            </div>
            <div className="flex-1 min-w-0">
              <label className={labelCls}>Black Rating</label>
              <input type="text" value={form.black_rating} onChange={(e) => set('black_rating', e.target.value)} placeholder="1500" className={inputCls} />
              {errors.black_rating && <span className="text-[10px] text-data-negative mt-0.5">{errors.black_rating}</span>}
            </div>
          </div>

          {/* Winner / Victory */}
          <div className="flex gap-3">
            <div className="flex-1 min-w-0">
              <label className={labelCls}>Winner</label>
              <select value={form.winner} onChange={(e) => set('winner', e.target.value)} className={inputCls}>
                {WINNERS.map((o) => <option key={o} value={o}>{o || '— Select —'}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-0">
              <label className={labelCls}>Victory</label>
              <select value={form.victory_status} onChange={(e) => set('victory_status', e.target.value)} className={inputCls}>
                {VICTORY.map((o) => <option key={o} value={o}>{o || '— Select —'}</option>)}
              </select>
            </div>
          </div>

          {/* Turns / Time */}
          <div className="flex gap-3">
            <div className="flex-1 min-w-0">
              <label className={labelCls}>Turns</label>
              <input type="text" value={form.turns} onChange={(e) => set('turns', e.target.value)} placeholder="42" className={inputCls} />
              {errors.turns && <span className="text-[10px] text-data-negative mt-0.5">{errors.turns}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <label className={labelCls}>Time Control</label>
              <input type="text" value={form.increment_code} onChange={(e) => set('increment_code', e.target.value)} placeholder="10+0" className={inputCls} />
            </div>
          </div>

          {/* Opening */}
          <div className="flex gap-3">
            <div className="flex-1 min-w-0">
              <label className={labelCls}>Opening ECO</label>
              <input type="text" value={form.opening_eco} onChange={(e) => set('opening_eco', e.target.value)} placeholder="C50" className={inputCls} />
            </div>
            <div className="flex-1 min-w-0">
              <label className={labelCls}>Opening Name</label>
              <input type="text" value={form.opening_name} onChange={(e) => set('opening_name', e.target.value)} placeholder="Italian Game" className={inputCls} />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-[36px] rounded-[4px] border border-border-subtle bg-bg-elevated text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 h-[36px] rounded-[4px] bg-gold-primary text-[13px] font-bold text-[#0B0B0E] hover:brightness-110 transition-all disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
