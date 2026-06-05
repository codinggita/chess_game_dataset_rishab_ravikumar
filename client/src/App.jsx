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
import { DataTable, FilterBar, BulkActions } from './components/data';

const demoColumns = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'player', headerName: 'Player', width: 180 },
  { field: 'rating', headerName: 'Rating', width: 100, type: 'number' },
  { field: 'result', headerName: 'Result', width: 100 },
  { field: 'opening', headerName: 'Opening', width: 200 },
];

const demoRows = Array.from({ length: 50 }, (_, i) => ({
  id: `M${String(i + 1).padStart(5, '0')}`,
  player: [
    'Magnus Carlsen',
    'Hikaru Nakamura',
    'Fabiano Caruana',
    'Ian Nepomniachtchi',
    'Ding Liren',
  ][i % 5],
  rating: [2850, 2780, 2820, 2795, 2810][i % 5],
  result: ['1-0', '0-1', '½-½'][i % 3],
  opening: ['Sicilian B20', 'Ruy Lopez C65', "Queen's Gambit D30", 'Italian C50', 'Caro-Kann B15'][
    i % 5
  ],
}));

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState('matches');
  const [toggleVal, setToggleVal] = useState(false);
  const [selectVal, setSelectVal] = useState('');
  const [rowSelection, setRowSelection] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  const [filters, setFilters] = useState({
    winner: null,
    result: null,
    time: null,
  });

  const filterGroups = [
    {
      label: 'Winner',
      options: [
        { label: '♔ White', value: 'white', active: filters.winner === 'white' },
        { label: '♚ Black', value: 'black', active: filters.winner === 'black' },
        { label: '= Draw', value: 'draw', active: filters.winner === 'draw' },
      ],
      onChange: (val) => setFilters((f) => ({ ...f, winner: val })),
    },
    {
      label: 'Result',
      options: [
        { label: 'Checkmate', value: 'checkmate', active: filters.result === 'checkmate' },
        { label: 'Resign', value: 'resign', active: filters.result === 'resign' },
        { label: 'Timeout', value: 'timeout', active: filters.result === 'timeout' },
      ],
      onChange: (val) => setFilters((f) => ({ ...f, result: val })),
    },
    {
      label: 'Time',
      options: [
        { label: 'Bullet', value: 'bullet', active: filters.time === 'bullet' },
        { label: 'Blitz', value: 'blitz', active: filters.time === 'blitz' },
        { label: 'Rapid', value: 'rapid', active: filters.time === 'rapid' },
      ],
      onChange: (val) => setFilters((f) => ({ ...f, time: val })),
    },
  ];

  const bulkActions = [
    {
      label: 'Archive',
      variant: 'secondary',
      onClick: () =>
        showToast('info', { title: 'Archived', body: `${rowSelection.length} rows archived.` }),
    },
    {
      label: 'Delete',
      variant: 'danger',
      onClick: () =>
        showToast('error', { title: 'Deleted', body: `${rowSelection.length} rows deleted.` }),
    },
    {
      label: 'Export',
      variant: 'ghost',
      onClick: () =>
        showToast('success', { title: 'Exported', body: `${rowSelection.length} rows exported.` }),
    },
  ];

  return (
    <div className="chess-bg min-h-screen bg-bg-base p-8">
      <div className="mx-auto max-w-5xl space-y-10">
        <h1 className="font-display text-3xl font-bold text-text-primary">ChessIQ Analytics</h1>

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

        {/* ── Buttons ── */}
        <ComponentSection title="Buttons">
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="icon">⚙</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
        </ComponentSection>

        {/* ── Input + Select + Toggle ── */}
        <ComponentSection title="Form Controls">
          <div className="grid max-w-xs gap-4">
            <Input label="Search" placeholder="Search players..." />
            <Select
              label="Time Control"
              value={selectVal}
              onChange={(e) => setSelectVal(e.target.value)}
              options={[
                { label: 'Bullet (1+0)', value: 'bullet' },
                { label: 'Blitz (3+0)', value: 'blitz' },
                { label: 'Rapid (10+0)', value: 'rapid' },
              ]}
              fullWidth
            />
            <Toggle checked={toggleVal} onChange={setToggleVal} label="Enable notifications" />
          </div>
        </ComponentSection>

        {/* ── Badges + Tabs ── */}
        <ComponentSection title="Badges & Tabs">
          <div className="flex flex-wrap items-center gap-2">
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
          <div className="mt-3">
            <Tabs
              tabs={[
                { label: 'Matches', value: 'matches' },
                { label: 'Players', value: 'players' },
                { label: 'Openings', value: 'openings' },
              ]}
              activeTab={tab}
              onChange={setTab}
            />
          </div>
        </ComponentSection>

        {/* ── Cards ── */}
        <ComponentSection title="Cards">
          <div className="grid grid-cols-3 gap-4">
            <Card header="Total Matches">
              <p className="font-mono text-2xl text-accent-gold">20,058</p>
            </Card>
            <Card variant="featured" header="Win Rate">
              <p className="font-mono text-2xl text-success-green">54.2%</p>
            </Card>
            <Card variant="interactive" header="Active Players">
              <p className="font-mono text-2xl text-info-blue">14,320</p>
            </Card>
          </div>
        </ComponentSection>

        {/* ── Skeletons + Spinners ── */}
        <ComponentSection title="Loading States">
          <div className="flex items-center gap-4">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton variant="text" />
            <Skeleton variant="table-row" />
            <Skeleton variant="number" />
            <Skeleton variant="card" />
          </div>
        </ComponentSection>

        {/* ── EmptyState ── */}
        <ComponentSection title="Empty State">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <EmptyState piece="♟" title="No matches" body="Adjust filters or add a new match." />
            </Card>
            <Card>
              <EmptyState
                piece="♔"
                title="No players"
                body="Import data to get started."
                ctaLabel="Import"
                onCtaClick={() =>
                  showToast('info', { title: 'Import', body: 'Opening import dialog...' })
                }
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
                onClick={() => showToast(t, { title: t, body: 'Demo notification.' })}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Button>
            ))}
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

        {/* ── Data Components ── */}
        <ComponentSection title="Filter Bar">
          <Card>
            <FilterBar
              groups={filterGroups}
              onClearAll={() => setFilters({ winner: null, result: null, time: null })}
            />
          </Card>
        </ComponentSection>

        <ComponentSection title="Bulk Actions">
          <BulkActions selectedCount={rowSelection.length} actions={bulkActions} />
        </ComponentSection>

        <ComponentSection title="Data Table">
          <div className="flex items-center justify-between gap-4">
            <Button size="sm" onClick={() => setTableLoading(!tableLoading)}>
              {tableLoading ? 'Stop Loading' : 'Show Loading'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setRowSelection([])}>
              Clear selection ({rowSelection.length})
            </Button>
          </div>
          <DataTable
            rows={demoRows}
            columns={demoColumns}
            loading={tableLoading}
            rowSelectionModel={rowSelection}
            onRowSelectionModelChange={setRowSelection}
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
          <Input label="Player" placeholder="Enter name" />
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
                showToast('error', { title: 'Deleted', body: 'Match removed.' });
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
