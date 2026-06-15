import { usePageMeta } from '../hooks/usePageMeta';

export default function NotFound() {
  usePageMeta('Page Not Found');

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base">
      <div className="text-center">
        <p className="font-mono text-[64px] text-gold-primary">404</p>
        <h1 className="font-display text-2xl font-semibold text-text-primary">
          Page Not Found
        </h1>
        <p className="mt-2 text-[14px] text-text-secondary">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
    </div>
  );
}
