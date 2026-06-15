import { usePageMeta } from '../hooks/usePageMeta';

export default function Profile() {
  usePageMeta('Profile');

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-text-primary">Profile</h1>
      <p className="mt-2 text-[13px] text-text-tertiary">
        Profile placeholder — PR 13
      </p>
    </div>
  );
}
