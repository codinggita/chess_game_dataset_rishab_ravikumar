import { usePageMeta } from '../hooks/usePageMeta';

export default function Landing() {
  usePageMeta();

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-5xl font-bold text-text-primary sm:text-7xl">
            ChessIQ Analytics
          </h1>
          <p className="mt-4 text-[16px] text-text-secondary">
            Every move tells a story.
          </p>
          <p className="mt-2 text-[12px] font-mono text-text-tertiary">
            Landing page — PR 13 placeholder
          </p>
        </div>
      </div>
    </div>
  );
}
