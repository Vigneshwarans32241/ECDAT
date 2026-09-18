import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Button from '../Button';

export function DataTablePagination({ table }) {
  const state = table.getState ? table.getState() : (table.state || {});
  const pageIndex = state.pagination?.pageIndex ?? 0;
  const pageSize = state.pagination?.pageSize ?? 25;
  const pageCount = table.getPageCount ? table.getPageCount() : 1;

  const totalCount = table.getFilteredRowModel ? table.getFilteredRowModel().rows.length : 0;
  const selectedCount = table.getFilteredSelectedRowModel ? table.getFilteredSelectedRowModel().rows.length : 0;

  const canPrevious = table.getCanPreviousPage ? table.getCanPreviousPage() : pageIndex > 0;
  const canNext = table.getCanNextPage ? table.getCanNextPage() : pageIndex < pageCount - 1;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 4px',
      fontSize: '13px',
      color: '#64748b',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      <div style={{ fontWeight: 500 }}>
        {selectedCount} of {totalCount} row{totalCount !== 1 ? 's' : ''} selected
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#475569' }}>Rows per page</span>
          <select
            value={pageSize}
            onChange={(e) => {
              if (table.setPageSize) {
                table.setPageSize(Number(e.target.value));
              }
            }}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: '13px',
              color: '#0f172a',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div style={{ fontWeight: 500, color: '#0f172a' }}>
          Page {pageIndex + 1} of {Math.max(1, pageCount)}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (table.firstPage) table.firstPage();
              else if (table.setPageIndex) table.setPageIndex(0);
            }}
            disabled={!canPrevious}
            style={{ minWidth: '32px', padding: '4px 6px', opacity: !canPrevious ? 0.4 : 1 }}
            aria-label="First page"
          >
            <ChevronsLeft size={15} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (table.previousPage) table.previousPage();
              else if (table.setPageIndex) table.setPageIndex(pageIndex - 1);
            }}
            disabled={!canPrevious}
            style={{ minWidth: '32px', padding: '4px 6px', opacity: !canPrevious ? 0.4 : 1 }}
            aria-label="Previous page"
          >
            <ChevronLeft size={15} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (table.nextPage) table.nextPage();
              else if (table.setPageIndex) table.setPageIndex(pageIndex + 1);
            }}
            disabled={!canNext}
            style={{ minWidth: '32px', padding: '4px 6px', opacity: !canNext ? 0.4 : 1 }}
            aria-label="Next page"
          >
            <ChevronRight size={15} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (table.lastPage) table.lastPage();
              else if (table.setPageIndex) table.setPageIndex(pageCount - 1);
            }}
            disabled={!canNext}
            style={{ minWidth: '32px', padding: '4px 6px', opacity: !canNext ? 0.4 : 1 }}
            aria-label="Last page"
          >
            <ChevronsRight size={15} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DataTablePagination;
