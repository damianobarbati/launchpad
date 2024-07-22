/**
 * Ref: https://tanstack.com/table/latest/docs/framework/react/examples/virtualized-infinite-scrolling
 */
import React from 'react';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { IError, INoResults } from '@ui/component/Icons';
import { Spinner } from '@ui/component/Spinner';
import { ControlledCheckbox } from '@ui/control/ControlledCheckbox';
import cx from 'clsx';
import type { SWRResponse } from 'swr';

const NO_DATA = [];

type Props = {
  className?: string;
  showTotal?: boolean;
  estimateSize: number | ((index: number) => number);
  overscan?: number;
  columns: ColumnDef<any>[];
  defaultSorting?: SortingState;
  swr: SWRResponse;
  highlightColor?: string;
  highlightFilter?: (data: any) => boolean;
  onRowClick?: (data: any, event?: React.MouseEvent) => void;
  onRowMouseEnter?: (data: any, event?: React.MouseEvent) => void;
  onRowMouseLeave?: (data: any, event?: React.MouseEvent) => void;
  onRowSelect?: (data: any) => void;
  wrapHeaders?: boolean;
};

const selectionColumn = {
  id: 'select',
  size: '1',
  header: ({ table }) => (
    <ControlledCheckbox
      type={'checkbox'}
      data-table-no-row-events
      checked={table.getIsAllRowsSelected()}
      indeterminate={table.getIsSomeRowsSelected()}
      onChange={table.getToggleAllRowsSelectedHandler()}
    />
  ),
  cell: ({ row }) => (
    <ControlledCheckbox
      type={'checkbox'}
      data-table-no-row-events
      checked={row.getIsSelected()}
      disabled={!row.getCanSelect()}
      onChange={row.getToggleSelectedHandler()}
    />
  ),
};

const Table = ({
  className,
  columns,
  swr,
  estimateSize,
  defaultSorting = [],
  overscan,
  highlightColor = 'bg-blue-light',
  highlightFilter = () => false,
  onRowClick,
  onRowMouseEnter,
  onRowMouseLeave,
  onRowSelect,
  showTotal = false,
  wrapHeaders = false,
}: Props) => {
  const [sorting, setSorting] = React.useState<SortingState>(defaultSorting);
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const [rowSelection, setRowSelection] = React.useState({});
  const { data = NO_DATA, isValidating, error } = swr;

  const columnsWithSelection = React.useMemo(() => {
    // if user provided onRowSelect handler then enable row selection
    if (onRowSelect) return [selectionColumn, ...columns];
    return columns;
  }, [onRowSelect, columns]);

  const table = useReactTable({
    data,
    columns: columnsWithSelection as ColumnDef<any, any>[],
    state: {
      rowSelection,
      sorting,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { rows } = table.getRowModel();

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: typeof estimateSize === 'number' ? () => estimateSize : estimateSize,
    overscan,
  });

  const virtualRows = virtualizer.getVirtualItems();

  const onRowClickHandler = React.useCallback(
    (row) => (event: React.MouseEvent) => {
      if (!onRowClick) return;
      if ((event.target as HTMLElement).hasAttribute('data-table-no-row-events')) return event.stopPropagation();
      onRowClick(row.original, event);
    },
    [onRowClick],
  );

  const onRowMouseEnterHandler = React.useCallback(
    (row) => (event: React.MouseEvent) => {
      if (!onRowMouseEnter) return;
      if ((event.target as HTMLElement).hasAttribute('data-table-no-row-events')) return event.stopPropagation();
      onRowMouseEnter(row.original, event);
    },
    [onRowMouseEnter],
  );

  const onRowMouseLeaveHandler = React.useCallback(
    (row) => (event: React.MouseEvent) => {
      if (!onRowMouseLeave) return;
      if ((event.target as HTMLElement).hasAttribute('data-table-no-row-events')) return event.stopPropagation();
      onRowMouseLeave(row.original, event);
    },
    [onRowMouseLeave],
  );

  // todo: consider if we want a flag to prevent flickering, we check also for data to not be empty, to honor the keepPreviousData flag and prevent the flickering on new fetches
  // const isLoading = isValidating && data === NO_DATA;
  const isLoading = isValidating;
  const isErrored = !isValidating && !!error;
  const noResults = !isLoading && !isErrored && !data.length;

  if (noResults) {
    return (
      <div className={cx('relative', className)}>
        <div className="absolute left-1/2 top-1/3 flex w-max -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <INoResults size="48" />
          <p>No results found.</p>
        </div>
      </div>
    );
  }

  if (isErrored) {
    return (
      <div className={cx('relative', className)}>
        <div className="red absolute left-1/2 top-1/3 flex w-max -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <IError size="48" />
          <p title={error?.response?.data ?? error?.message}>Oops, an error occurred!</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cx('relative', className)}>
        <Spinner className="!top-1/2" centered={true} />
      </div>
    );
  }

  return (
    <>
      <div className={cx('border-b-grey-border relative min-h-max overflow-auto border-b bg-white', className)} ref={tableContainerRef}>
        <table data-role="table" className="w-full table-fixed">
          <thead data-role="thead" className="sticky top-0 z-20 m-0 bg-white shadow-[inset_0_-1px_0] shadow-slate-300">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr data-role="tr" key={headerGroup.id} className="flex w-full place-content-between">
                {headerGroup.headers.map((header) => (
                  <th
                    data-role="th"
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cx('border-grey-border flex p-3 text-left align-top', !wrapHeaders && 'truncate', header.column.columnDef.meta?.className)}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={cx('font-normal text-gray-500', header.column.getCanSort() && 'cursor-pointer select-none')}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: ' ↑',
                          desc: ' ↓',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody data-role="tbody" className="relative z-10" style={{ height: `${virtualizer.getTotalSize()}px` }}>
            {virtualRows.map((virtualRow, index) => {
              const row = rows[virtualRow.index];
              return (
                <tr
                  data-role="tr"
                  ref={(node) => virtualizer.measureElement(node)} // measure dynamic row height
                  key={index}
                  data-index={virtualRow.index} // needed for dynamic row height measurement
                  className={cx(
                    'border-grey-border absolute flex w-full cursor-pointer place-content-between border-b align-top last:border-b-0 hover:bg-gray-100',
                    highlightFilter(row) && highlightColor,
                  )}
                  style={{ transform: `translateY(${virtualRow.start}px)` }}
                  onClick={onRowClickHandler(row)}
                  onMouseEnter={onRowMouseEnterHandler(row)}
                  onMouseLeave={onRowMouseLeaveHandler(row)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      data-role="td"
                      key={cell.id}
                      className={cx('flex items-center truncate p-3', cell.column.columnDef.meta?.className)}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showTotal && !isLoading && !isErrored && (
        <div className="mt-4 text-center">
          {table.getRowModel().rows.length} {table.getRowModel().rows.length == 1 ? 'result' : 'results'} found.
        </div>
      )}
    </>
  );
};

export default Table;
