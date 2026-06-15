import { usePageMeta } from '../hooks/usePageMeta';

export default function Login() {
  usePageMeta('Sign In');

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base">
      <div className="w-full max-w-md rounded-lg border border-border-default bg-bg-surface p-8">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Sign In</h1>
        <p className="mt-2 text-[13px] text-text-tertiary">
          Login placeholder — PR 13
        </p>
      </div>
    </div>
  );
}
