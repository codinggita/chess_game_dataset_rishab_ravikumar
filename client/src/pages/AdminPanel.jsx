import { usePageMeta } from '../hooks/usePageMeta';

export default function AdminPanel() {
  usePageMeta('Admin Panel');

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-text-primary">Admin Panel</h1>
      <p className="mt-2 text-[13px] text-text-tertiary">
        Admin panel placeholder — PR 13
      </p>
    </div>
  );
}
