import React, { useState, useEffect, useRef } from 'react';
import { useTable, FlexRender } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table';
import { DataTablePagination } from './data-table-pagination';
import { features } from './data-table-features';

export function DataTable({
  columns,
  data,
  onRowClick,
  onSelectionChange,
  emptyMessage = 'No results found.',
  initialPageSize = 25,
  toolbar,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useTable({
    features,
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
  });

  if (table && !table.getState) {
    table.getState = () => table.state || {};
  }

  // Track selection state changes safely without causing render loops
  const prevSelectionRef = useRef(rowSelection);
  useEffect(() => {
    if (prevSelectionRef.current !== rowSelection) {
      prevSelectionRef.current = rowSelection;
      if (onSelectionChange && table) {
        const selectedRowModels = table.getFilteredSelectedRowModel ? table.getFilteredSelectedRowModel().rows : [];
        const selectedData = selectedRowModels.map((r) => r.original);
        onSelectionChange(selectedData, rowSelection);
      }
    }
  }, [rowSelection, onSelectionChange]);

  const RenderComponent = table.FlexRender || FlexRender;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {toolbar && typeof toolbar === 'function' && toolbar({ table })}

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} style={{ width: header.column.columnDef.size || 'auto' }}>
                    {header.isPlaceholder ? null : (
                      <RenderComponent header={header} />
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected && row.getIsSelected() ? 'selected' : undefined}
                style={onRowClick ? { cursor: 'pointer' } : undefined}
                onClick={(e) => {
                  if (
                    e.target.closest('button') ||
                    e.target.closest('input') ||
                    e.target.closest('[role="menuitem"]') ||
                    e.target.closest('[data-radix-collection-item]') ||
                    (e.target.closest('[data-state]') && !e.target.closest('tr'))
                  ) {
                    return;
                  }
                  if (onRowClick) {
                    onRowClick(row.original, row);
                  }
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <RenderComponent cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} style={{ height: '100px', textAlign: 'center', color: '#64748b' }}>
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DataTablePagination table={table} />
    </div>
  );
}

export default DataTable;
