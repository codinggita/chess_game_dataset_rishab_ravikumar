import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getById, archive, restore } from '../services/matchService';
import { usePageMeta } from '../hooks/usePageMeta';
import { showToast } from '../components/ui/Toast';
import Breadcrumb from '../components/ui/Breadcrumb';
import DeleteMatchModal from '../features/matches/DeleteMatchModal';
import { MatchHero, MoveSequence, PGNViewer } from '../features/matches';

export default function MatchView() {
  usePageMeta('Match Details');
  const { id } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.resolve().then(() => {
      if (!cancelled) {
        setLoading(true);
        setError(null);
      }
    });

    getById(id)
      .then((data) => {
        if (cancelled) return;
        setMatch(data?.match || data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.response?.data?.message || 'Failed to load match details');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleArchive = async () => {
    try {
      await archive(id);
      setMatch((prev) => ({ ...prev, isArchived: true }));
      showToast('Match archived', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to archive match', 'error');
    }
  };

  const handleRestore = async () => {
    try {
      await restore(id);
      setMatch((prev) => ({ ...prev, isArchived: false }));
      showToast('Match restored', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to restore match', 'error');
    }
  };

  const handleDeleteSuccess = () => {
    navigate('/matches');
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="h-6 w-48 animate-pulse rounded bg-bg-elevated" />
        <div className="h-[200px] animate-pulse rounded bg-bg-elevated" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded bg-bg-elevated" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="rounded-[6px] border border-border-subtle bg-bg-surface p-6 text-center">
          <p className="text-[14px] text-text-secondary">{error || 'Match not found.'}</p>
          <button
            onClick={() => navigate('/matches')}
            className="mt-4 h-[36px] rounded-[4px] bg-gold-primary px-4 text-[13px] font-bold text-[#0B0B0E] cursor-pointer"
          >
            Go back to matches
          </button>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Matches', href: '/matches' },
    { label: `#${id}` },
  ];

  // Helper date formatting
  const dateObj = match.created_at ? new Date(parseFloat(match.created_at)) : null;
  const formattedDate = dateObj && !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : '-';

  // Helper victory label
  const getVictoryLabel = (status) => {
    if (!status) return '';
    if (status === 'mate') return 'Checkmate';
    if (status === 'resign') return 'Resignation';
    if (status === 'outoftime') return 'Time Out';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Winner string
  const winnerLabel = match.winner === 'draw'
    ? 'Draw'
    : `${match.winner ? match.winner.charAt(0).toUpperCase() + match.winner.slice(1) : '-'} Won by`;

  // Engine Eval simulation
  let evalText = '0.00';
  let whiteBarWidth = '50%';
  if (match.winner === 'white') {
    evalText = match.victory_status === 'mate' ? '+M6' : '+4.8';
    whiteBarWidth = '85%';
  } else if (match.winner === 'black') {
    evalText = match.victory_status === 'mate' ? '-M3' : '-4.2';
    whiteBarWidth = '15%';
  }

  return (
    <div className="relative flex flex-col gap-6 p-6 pb-16 max-w-7xl mx-auto w-full z-10">
      {/* Grid Watermark Background */}
      <div className="fixed inset-0 chess-grid-bg pointer-events-none z-0" />

      {/* Top Header Row with Breadcrumb & Actions */}
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 z-10">
        <Breadcrumb items={breadcrumbs} className="font-mono" />
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/matches')}
            className="h-[34px] px-4 rounded-[4px] border border-border-subtle bg-bg-surface text-[13px] font-medium text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            ← Back
          </button>

          {match.isArchived ? (
            <button
              onClick={handleRestore}
              className="h-[34px] px-4 rounded-[4px] border border-[#C9A84C]/30 bg-gold-primary/5 text-[13px] font-medium text-gold-primary hover:bg-gold-primary/10 transition-colors cursor-pointer"
            >
              Restore
            </button>
          ) : (
            <button
              onClick={handleArchive}
              className="h-[34px] px-4 rounded-[4px] border border-border-subtle bg-bg-surface text-[13px] font-medium text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors cursor-pointer"
            >
              Archive
            </button>
          )}

          <button
            onClick={() => setShowDeleteModal(true)}
            className="h-[34px] px-4 rounded-[4px] bg-data-negative text-[13px] font-bold text-white hover:brightness-110 transition-all shadow-sm cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Match Hero Section (Split Layout) */}
      <div className="relative z-10">
        <MatchHero match={match} />
      </div>

      {/* Analysis Panels (Terminal v3.2 Look) */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 z-10">
        {/* Left Column: Opening Stats (ECO, Opening, Turns, Details) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Opening ECO */}
          <div className="bg-bg-surface border border-border-strong rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group shadow-sm">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary mb-4">
              Opening ECO
            </h3>
            <div className="font-mono text-gold-primary flex items-center gap-3 font-bold text-[24px]">
              <span className="material-symbols-outlined text-[24px] opacity-80 select-none">
                book
              </span>
              {match.opening_eco || '-'}
            </div>
          </div>

          {/* Card 2: Opening Name */}
          <div className="bg-bg-surface border border-border-strong rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group shadow-sm">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary mb-4">
              Opening Name
            </h3>
            <div className="text-text-primary flex items-center gap-3 mt-1 text-[16px] font-medium min-w-0">
              <span className="material-symbols-outlined text-gold-primary text-[20px] opacity-80 select-none flex-shrink-0">
                account_tree
              </span>
              <span className="truncate" title={match.opening_name}>
                {match.opening_name || '-'}
              </span>
            </div>
          </div>

          {/* Card 3: Total Turns */}
          <div className="bg-bg-surface border border-border-strong rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group shadow-sm">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary mb-4">
              Total Turns
            </h3>
            <div className="font-mono text-text-primary flex items-center gap-3 font-bold text-[24px]">
              <span className="material-symbols-outlined text-[24px] text-gold-primary opacity-80 select-none">
                sync
              </span>
              {match.turns || '-'}
            </div>
          </div>

          {/* Card 4: Match Details */}
          <div className="bg-bg-surface border border-border-strong rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group shadow-sm">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary mb-4">
              Match Details
            </h3>
            <div className="flex gap-4 mt-1">
              <div className="flex flex-col gap-1 border-l-2 border-gold-primary pl-3">
                <span className="text-gold-primary font-mono text-[12px] font-semibold">
                  {match.rated === 'TRUE' ? 'Rated Match' : 'Casual Match'}
                </span>
                <span className="text-text-secondary font-mono text-[11px]">
                  {formattedDate}
                </span>
              </div>
              <div className="flex flex-col gap-1 border-l-2 border-border-strong pl-3">
                <span className="text-text-primary font-mono text-[12px] font-semibold">
                  {winnerLabel}
                </span>
                <span className="text-text-secondary font-mono text-[11px]">
                  {getVictoryLabel(match.victory_status) || '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Engine Eval / Time Control */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Card 5: Time Control */}
          <div className="bg-bg-surface border border-border-strong rounded-xl p-6 flex flex-col justify-between relative overflow-hidden flex-1 group border-t-2 border-t-gold-primary shadow-sm">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary mb-4">
              Time Control
            </h3>
            <div className="font-mono text-text-primary flex items-center gap-3 font-bold text-[24px]">
              <span className="material-symbols-outlined text-[24px] text-gold-primary opacity-80 select-none">
                timer
              </span>
              {match.increment_code || '-'}
            </div>
          </div>

          {/* Card 6: Engine Eval (Final) */}
          <div className="bg-bg-surface border border-border-strong rounded-xl p-6 flex flex-col relative overflow-hidden flex-1 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary">
                Engine Eval (Final)
              </h3>
              <span className="font-mono text-gold-primary font-bold text-[14px]">{evalText}</span>
            </div>
            <div className="flex-1 w-full flex flex-col justify-center">
              <div className="h-4 w-full bg-bg-elevated rounded-sm overflow-hidden flex border border-border-subtle">
                <div className="h-full bg-text-primary transition-all duration-1000" style={{ width: whiteBarWidth }} />
                <div className="h-full bg-border-strong transition-all duration-1000 flex-1" />
              </div>
              <div className="flex justify-between mt-2 font-mono text-[10px] text-text-secondary">
                <span>White Adv.</span>
                <span>Black Adv.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Move Sequence */}
      <div className="relative z-10">
        <MoveSequence match={match} />
      </div>

      {/* PGN Viewer */}
      <div className="relative z-10">
        <PGNViewer match={match} />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteMatchModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        matchId={id}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
