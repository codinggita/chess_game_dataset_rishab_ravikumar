import { usePageMeta } from '../hooks/usePageMeta';

export default function Settings() {
  usePageMeta('Settings');

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-text-primary">Settings</h1>
      <p className="mt-2 text-[13px] text-text-tertiary">
        Settings placeholder — PR 13
      </p>
    </div>
  );
}
