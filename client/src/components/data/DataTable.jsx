import clsx from 'clsx';
import { DataGrid } from '@mui/x-data-grid';
import { Spinner } from '../ui';

/* ── DataTable — MUI DataGrid wrapper ──
   Gold theme via existing MUI overrides
   Custom loading overlay (gold spinner)
   Custom empty overlay (chess piece)
   Sorting, row selection, column resize enabled
*/
function CustomLoading() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 bg-bg-surface">
      <Spinner size="lg" />
      <p className="text-[13px] text-text-tertiary">Loading data...</p>
    </div>
  );
}

function CustomEmpty() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 bg-bg-surface">
      <span
        className="select-none leading-none"
        style={{ fontSize: '48px', opacity: 0.3, color: '#55556A' }}
        aria-hidden="true"
      >
        ♟
      </span>
      <p className="text-[13px] text-text-tertiary">No data to display</p>
    </div>
  );
}

export default function DataTable({
  rows,
  columns,
  loading,
  onRowSelectionModelChange,
  rowSelectionModel,
  checkboxSelection = true,
  getRowId,
  pageSize = 25,
  className,
  stickyFirstColumn,
  ...props
}) {
  /* Pin first column for mobile scroll if requested */
  const pinnedColumns = stickyFirstColumn && columns.length > 0
    ? { left: [columns[0].field] }
    : undefined;

  return (
    <div className={clsx('overflow-x-auto', className)}>
      <div className="min-w-[600px]">
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          checkboxSelection={checkboxSelection}
          disableRowSelectionOnClick
          onRowSelectionModelChange={onRowSelectionModelChange}
          rowSelectionModel={rowSelectionModel}
          getRowId={getRowId}
          initialState={{
            pagination: { paginationModel: { pageSize } },
            pinnedColumns,
          }}
          pageSizeOptions={[10, 25, 50]}
          slots={{
            loadingOverlay: CustomLoading,
            noRowsOverlay: CustomEmpty,
          }}
          autoHeight
          density="compact"
          sx={{
            '& .MuiDataGrid-cell:focus': { outline: 'none' },
            '& .MuiDataGrid-cell:focus-within': { outline: 'none' },
            '& .MuiDataGrid-columnHeader:focus': { outline: 'none' },
            '& .MuiDataGrid-columnHeader:focus-within': { outline: 'none' },
          }}
          {...props}
        />
      </div>
    </div>
  );
}
