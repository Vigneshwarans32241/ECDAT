import SearchInput from '../../components/ui/SearchInput';
import Button from '../../components/ui/Button';
import { Filter, Download, X } from 'lucide-react';

export default function InventoryToolbar({
  search,
  onSearchChange,
  riskFilter,
  onRiskFilterChange,
  quantumFilter,
  onQuantumFilterChange,
  onResetFilters,
  onExportCSV
}) {
  const hasActiveFilters = Boolean(search || riskFilter !== 'all' || quantumFilter !== 'all');

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', padding: '14px 18px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', flex: 1, minWidth: '280px' }}>
        <div style={{ width: '280px' }}>
          <SearchInput
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by ID, algorithm, app..."
          />
        </div>

        {/* Risk Filter */}
        <select
          value={riskFilter}
          onChange={(e) => onRiskFilterChange(e.target.value)}
          style={{ padding: '8px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#ffffff', color: '#374151' }}
        >
          <option value="all">All Risk Bands</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Quantum Status Filter */}
        <select
          value={quantumFilter}
          onChange={(e) => onQuantumFilterChange(e.target.value)}
          style={{ padding: '8px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#ffffff', color: '#374151' }}
        >
          <option value="all">All Quantum Statuses</option>
          <option value="vulnerable">Quantum Vulnerable</option>
          <option value="safe">Classical Safe</option>
          <option value="pqc_native">PQC Native</option>
        </select>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" icon={X} onClick={onResetFilters}>
            Clear
          </Button>
        )}
      </div>

      <div>
        <Button variant="secondary" size="sm" icon={Download} onClick={onExportCSV}>
          Export CSV
        </Button>
      </div>
    </div>
  );
}
