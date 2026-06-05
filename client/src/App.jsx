import { Button, Input, Badge, Card, Skeleton, EmptyState, Spinner } from './components/ui';

function App() {
  return (
    <div className="chess-bg min-h-screen bg-bg-base p-8">
      <div className="mx-auto max-w-4xl space-y-10">
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

        {/* ── Cards ── */}
        <section className="space-y-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-secondary">
            Cards
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <Card header="Default">
              <p className="text-sm text-text-primary">Standard card panel</p>
            </Card>
            <Card variant="featured" header="Featured">
              <p className="text-sm text-text-primary">Gold border accent</p>
            </Card>
            <Card variant="interactive" header="Hover Me">
              <p className="text-sm text-text-primary">Hover to see the effect</p>
            </Card>
          </div>
        </section>

        {/* ── Skeletons ── */}
        <section className="space-y-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-secondary">
            Skeletons
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-[11px] text-text-tertiary">Text line</p>
              <Skeleton variant="text" />
              <Skeleton variant="text" className="w-3/4" />
              <Skeleton variant="text" className="w-1/2" />
            </div>
            <div className="space-y-2">
              <p className="text-[11px] text-text-tertiary">Number / Card / Row</p>
              <Skeleton variant="number" />
              <Skeleton variant="table-row" />
              <Skeleton variant="avatar" />
            </div>
            <div className="col-span-2">
              <Skeleton variant="card" />
            </div>
          </div>
        </section>

        {/* ── Spinners ── */}
        <section className="space-y-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-secondary">
            Spinners
          </h2>
          <div className="flex items-end gap-4">
            <div className="flex flex-col items-center gap-2">
              <Spinner size="sm" />
              <span className="text-[10px] text-text-tertiary">SM</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner size="md" />
              <span className="text-[10px] text-text-tertiary">MD</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner size="lg" />
              <span className="text-[10px] text-text-tertiary">LG</span>
            </div>
          </div>
        </section>

        {/* ── EmptyState ── */}
        <section className="space-y-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-secondary">
            Empty State
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <EmptyState
                piece="♟"
                title="No matches found"
                body="Try adjusting your filters or add a new match."
              />
            </Card>
            <Card>
              <EmptyState
                piece="♔"
                title="No players yet"
                body="Import player data to get started."
                ctaLabel="Import Players"
                onCtaClick={() => alert('CTA clicked!')}
              />
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
