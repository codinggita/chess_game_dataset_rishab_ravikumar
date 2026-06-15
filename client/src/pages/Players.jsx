import { usePageMeta } from '../hooks/usePageMeta';

export default function Players() {
  usePageMeta('Players');

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-text-primary">Players</h1>
      <p className="mt-2 text-[13px] text-text-tertiary">
        Players placeholder — PR 13
      </p>
    </div>
  );
}
