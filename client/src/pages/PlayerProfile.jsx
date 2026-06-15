import { usePageMeta } from '../hooks/usePageMeta';

export default function PlayerProfile() {
  usePageMeta('Player Profile');

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-text-primary">Player Profile</h1>
      <p className="mt-2 text-[13px] text-text-tertiary">
        Player profile placeholder — PR 13
      </p>
    </div>
  );
}
