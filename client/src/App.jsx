import { useState } from 'react';
import {
  Button,
  Input,
  Badge,
  Card,
  Skeleton,
  EmptyState,
  Spinner,
  Modal,
  showToast,
  Pagination,
  Tabs,
  Breadcrumb,
  Toggle,
  Select,
} from './components/ui';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState('matches');
  const [toggleVal, setToggleVal] = useState(false);
  const [selectVal, setSelectVal] = useState('');

  return (
    <div className="chess-bg min-h-screen bg-bg-base p-8">
      <div className="mx-auto max-w-4xl space-y-10">
        <h1 className="font-display text-3xl font-bold text-text-primary">ChessIQ Analytics</h1>

        {/* ── Buttons ── */}
        <ComponentSection title="Buttons">
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
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </ComponentSection>

        {/* ── Inputs ── */}
        <ComponentSection title="Inputs">
          <div className="grid max-w-sm gap-4">
            <Input label="Username" placeholder="Enter username" />
            <Input label="Email" type="email" placeholder="you@example.com" />
            <Input label="Password" type="password" placeholder="••••••••" />
            <Input label="With Error" placeholder="Invalid value" error="This field is required" />
          </div>
        </ComponentSection>

        {/* ── Badges ── */}
        <ComponentSection title="Badges">
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
        </ComponentSection>

        {/* ── Cards ── */}
        <ComponentSection title="Cards">
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
        </ComponentSection>

        {/* ── Skeletons ── */}
        <ComponentSection title="Skeletons">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-[11px] text-text-tertiary">Text line</p>
              <Skeleton variant="text" />
              <Skeleton variant="text" className="w-3/4" />
              <Skeleton variant="text" className="w-1/2" />
            </div>
            <div className="space-y-2">
              <p className="text-[11px] text-text-tertiary">Number / Row / Avatar</p>
              <Skeleton variant="number" />
              <Skeleton variant="table-row" />
              <Skeleton variant="avatar" />
            </div>
            <div className="col-span-2">
              <Skeleton variant="card" />
            </div>
          </div>
        </ComponentSection>

        {/* ── Spinners ── */}
        <ComponentSection title="Spinners">
          <div className="flex items-end gap-4">
            {['sm', 'md', 'lg'].map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <Spinner size={s} />
                <span className="text-[10px] text-text-tertiary uppercase">{s}</span>
              </div>
            ))}
          </div>
        </ComponentSection>

        {/* ── EmptyState ── */}
        <ComponentSection title="Empty State">
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
        </ComponentSection>

        {/* ── Modal + Toast ── */}
        <ComponentSection title="Modal & Toast">
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
            <Button variant="secondary" onClick={() => setDeleteOpen(true)}>
              Delete Modal
            </Button>
            {['success', 'error', 'warning', 'info'].map((t) => (
              <Button
                key={t}
                variant="ghost"
                onClick={() =>
                  showToast(t, {
                    title: `${t.charAt(0).toUpperCase() + t.slice(1)} toast`,
                    body: 'This is a demo notification.',
                  })
                }
              >
                {t.charAt(0).toUpperCase() + t.slice(1)} Toast
              </Button>
            ))}
          </div>
        </ComponentSection>

        {/* ── Breadcrumb ── */}
        <ComponentSection title="Breadcrumb">
          <Breadcrumb
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Matches', href: '/matches' },
              { label: 'B20 Sicilian' },
            ]}
          />
        </ComponentSection>

        {/* ── Tabs ── */}
        <ComponentSection title="Tabs">
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-[11px] text-text-tertiary">Underline variant</p>
              <Tabs
                tabs={[
                  { label: 'Matches', value: 'matches' },
                  { label: 'Players', value: 'players' },
                  { label: 'Openings', value: 'openings' },
                  { label: 'Analytics', value: 'analytics' },
                ]}
                activeTab={tab}
                onChange={setTab}
              />
            </div>
            <div>
              <p className="mb-2 text-[11px] text-text-tertiary">Pill variant</p>
              <Tabs
                variant="pill"
                tabs={[
                  { label: 'Overview', value: 'overview' },
                  { label: 'Stats', value: 'stats' },
                  { label: 'History', value: 'history' },
                ]}
                activeTab={tab === 'matches' ? 'overview' : 'stats'}
                onChange={() => {}}
              />
            </div>
          </div>
        </ComponentSection>

        {/* ── Toggle ── */}
        <ComponentSection title="Toggle">
          <div className="flex flex-col gap-3">
            <Toggle checked={toggleVal} onChange={setToggleVal} label="Enable notifications" />
            <Toggle checked={!toggleVal} onChange={setToggleVal} label="Disabled toggle" disabled />
          </div>
        </ComponentSection>

        {/* ── Select ── */}
        <ComponentSection title="Select">
          <div className="grid max-w-xs gap-4">
            <Select
              label="Time Control"
              value={selectVal}
              onChange={(e) => setSelectVal(e.target.value)}
              options={[
                { label: 'Bullet (1+0)', value: 'bullet' },
                { label: 'Blitz (3+0)', value: 'blitz' },
                { label: 'Rapid (10+0)', value: 'rapid' },
                { label: 'Classical (30+0)', value: 'classical' },
              ]}
              fullWidth
            />
            <Select
              label="With Error"
              value=""
              onChange={() => {}}
              options={[]}
              error="This field is required"
              fullWidth
            />
          </div>
        </ComponentSection>

        {/* ── Pagination ── */}
        <ComponentSection title="Pagination">
          <Pagination
            page={page}
            totalPages={12}
            totalItems={20058}
            pageSize={10}
            onPageChange={setPage}
          />
        </ComponentSection>
      </div>

      {/* Modals */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Match Details"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setModalOpen(false)}>Confirm</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input label="Player" placeholder="Enter player name" />
          <Input label="Rating" placeholder="Enter rating" />
        </div>
      </Modal>

      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Match?"
        variant="delete"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setDeleteOpen(false);
                showToast('error', { title: 'Match deleted', body: 'Permanently removed.' });
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-[14px] text-error-red">This action cannot be undone.</p>
      </Modal>
    </div>
  );
}

function ComponentSection({ title, children }) {
  return (
    <section className="space-y-3">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-secondary">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default App;
