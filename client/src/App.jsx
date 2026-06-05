import { Button, Input, Badge } from './components/ui';

function App() {
  return (
    <div className="chess-bg min-h-screen bg-bg-base p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* ── Title ── */}
        <h1 className="font-display text-3xl font-bold text-text-primary">ChessIQ Analytics</h1>

        {/* ── Buttons ── */}
        <section className="space-y-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-secondary">
            Buttons
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="icon">⚙</Button>
            <Button variant="primary" loading>
              Loading
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>

        {/* ── Inputs ── */}
        <section className="space-y-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-secondary">
            Inputs
          </h2>
          <div className="grid max-w-sm gap-4">
            <Input label="Username" placeholder="Enter username" />
            <Input label="Email" type="email" placeholder="you@example.com" />
            <Input label="Password" type="password" placeholder="••••••••" />
            <Input label="With Error" placeholder="Invalid value" error="This field is required" />
          </div>
        </section>

        {/* ── Badges ── */}
        <section className="space-y-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-secondary">
            Badges
          </h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="white-win">1-0</Badge>
            <Badge variant="black-win">0-1</Badge>
            <Badge variant="draw">½-½</Badge>
            <Badge variant="checkmate">#</Badge>
            <Badge variant="resign">Resign</Badge>
            <Badge variant="timeout">Timeout</Badge>
            <Badge variant="rated">Rated</Badge>
            <Badge variant="eco">B20</Badge>
            <Badge variant="pill">Active</Badge>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
