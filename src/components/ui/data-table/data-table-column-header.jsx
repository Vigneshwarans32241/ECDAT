import React from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, EyeOff } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown-menu';

export function DataTableColumnHeader({ column, title, className = '' }) {
  if (!column.getCanSort()) {
    return <div className={`column-header-title ${className}`}>{title}</div>;
  }

  const isSorted = column.getIsSorted();

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }} className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              border: 'none',
              padding: '4px 6px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: isSorted ? '#0f172a' : '#64748b',
              outline: 'none',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <span>{title}</span>
            {isSorted === 'desc' ? (
              <ArrowDown size={13} style={{ color: '#2563eb' }} />
            ) : isSorted === 'asc' ? (
              <ArrowUp size={13} style={{ color: '#2563eb' }} />
            ) : (
              <ArrowUpDown size={13} style={{ opacity: 0.5 }} />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp size={13} style={{ marginRight: '8px', color: '#64748b' }} />
            Sort Ascending
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown size={13} style={{ marginRight: '8px', color: '#64748b' }} />
            Sort Descending
          </DropdownMenuItem>
          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeOff size={13} style={{ marginRight: '8px', color: '#64748b' }} />
                Hide Column
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default DataTableColumnHeader;
