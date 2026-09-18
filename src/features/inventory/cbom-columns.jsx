import React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Eye, Copy, Layers, Download, MoreHorizontal, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { Checkbox } from '../../components/ui/checkbox';
import Badge from '../../components/ui/Badge';
import { DataTableColumnHeader } from '../../components/ui/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

const columnHelper = createColumnHelper();

export function getCbomColumns({ onInspect, onMigrate, onCopyId, onExportSnippet }) {
  return [
    // 1. Select Checkbox
    columnHelper.display({
      id: 'select',
      size: '40px',
      header: ({ table }) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all visible rows"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    }),

    // 2. Asset ID
    columnHelper.accessor('id', {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Asset ID" />,
      cell: ({ row }) => {
        const id = row.getValue('id');
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#1d4ed8',
                fontWeight: 600,
                background: '#eff6ff',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid #dbeafe'
              }}
            >
              {id}
            </span>
          </div>
        );
      },
    }),

    // 3. Algorithm & Key Size
    columnHelper.accessor((row) => row.algorithm?.name, {
      id: 'algorithm',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Algorithm" />,
      cell: ({ row }) => {
        const item = row.original;
        const algoName = item.algorithm?.name || 'Unknown';
        const keySize = item.algorithm?.keySize;
        const family = item.algorithm?.family;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '13px' }}>
                {algoName}
              </span>
              {keySize && (
                <span style={{ fontSize: '10px', padding: '1px 5px', background: '#f1f5f9', borderRadius: '3px', color: '#475569', fontWeight: 600 }}>
                  {keySize}-bit
                </span>
              )}
            </div>
            {family && (
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                Family: {family}
              </span>
            )}
          </div>
        );
      },
    }),

    // 4. Purpose
    columnHelper.accessor((row) => row.usage?.purpose, {
      id: 'purpose',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Purpose" />,
      cell: ({ row }) => {
        const purpose = row.original.usage?.purpose || 'General Cryptography';
        return (
          <span style={{ fontSize: '12px', color: '#334155', fontWeight: 500, textTransform: 'capitalize' }}>
            {purpose.replace(/_/g, ' ')}
          </span>
        );
      },
    }),

    // 5. Parent Application & Service
    columnHelper.accessor((row) => row.context?.applicationName, {
      id: 'application',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Application" />,
      cell: ({ row }) => {
        const item = row.original;
        const app = item.context?.applicationName || 'Global';
        const service = item.context?.serviceName;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontWeight: 550, color: '#1e293b', fontSize: '13px' }}>{app}</span>
            {service && (
              <span style={{ fontSize: '11px', color: '#64748b' }}>svc: {service}</span>
            )}
          </div>
        );
      },
    }),

    // 6. Quantum Status
    columnHelper.accessor((row) => row.status?.quantum, {
      id: 'quantum',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Quantum Readiness" />,
      cell: ({ row }) => {
        const qStatus = row.original.status?.quantum;
        if (qStatus === 'vulnerable') {
          return (
            <Badge variant="error" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ShieldAlert size={11} />
              Shor-Vulnerable
            </Badge>
          );
        }
        if (qStatus === 'pqc_native') {
          return (
            <Badge variant="success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={11} />
              PQC Native
            </Badge>
          );
        }
        return (
          <Badge variant="warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={11} />
            Transitional
          </Badge>
        );
      },
    }),

    // 7. Risk Band
    columnHelper.accessor('riskBand', {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Risk Band" />,
      cell: ({ row }) => {
        const band = row.getValue('riskBand') || 'low';
        const variantMap = {
          critical: 'error',
          high: 'warning',
          medium: 'warning',
          low: 'success',
          informational: 'info'
        };
        return (
          <Badge variant={variantMap[band] || 'default'} style={{ textTransform: 'capitalize', fontWeight: 600 }}>
            {band}
          </Badge>
        );
      },
    }),

    // 8. Row Actions Dropdown
    columnHelper.display({
      id: 'actions',
      size: '60px',
      header: () => <span style={{ fontSize: '11px', color: '#64748b' }}>Actions</span>,
      cell: ({ row }) => {
        const asset = row.original;

        return (
          <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  style={{
                    background: 'transparent',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '5px 8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                    e.currentTarget.style.color = '#0f172a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#64748b';
                  }}
                  aria-label="Open asset actions menu"
                >
                  <MoreHorizontal size={15} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" style={{ minWidth: '190px' }}>
                <DropdownMenuLabel>Asset Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onInspect(asset)}>
                  <Eye size={14} style={{ marginRight: '8px', color: '#2563eb' }} />
                  Inspect in Drawer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCopyId(asset.id)}>
                  <Copy size={14} style={{ marginRight: '8px', color: '#64748b' }} />
                  Copy Asset ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onMigrate(asset)}>
                  <Layers size={14} style={{ marginRight: '8px', color: '#10b981' }} />
                  Add to Migration Runway
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExportSnippet(asset)}>
                  <Download size={14} style={{ marginRight: '8px', color: '#64748b' }} />
                  Export CycloneDX Snippet
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    }),
  ];
}

export default getCbomColumns;
