import SearchInput from '../../components/ui/SearchInput';
import Button from '../../components/ui/Button';
import { Download, X } from 'lucide-react';
import { applications } from '../../mock/applications';

export default function InventoryToolbar({
  search,
  onSearchChange,
  riskFilter,
  onRiskFilterChange,
  quantumFilter,
  onQuantumFilterChange,
  appFilter = 'all',
  onAppFilterChange = () => {},
  purposeFilter = 'all',
  onPurposeFilterChange = () => {},
  onResetFilters,
  onExportCSV
}) {
  const hasActiveFilters = Boolean(
    search ||
    riskFilter !== 'all' ||
    quantumFilter !== 'all' ||
    appFilter !== 'all' ||
    purposeFilter !== 'all'
  );

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', padding: '14px 18px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', flex: 1, minWidth: '280px' }}>
        <div style={{ width: '260px' }}>
          <SearchInput
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search ID, algorithm, app..."
          />
        </div>

        {/* Risk Filter */}
        <select
          value={riskFilter}
          onChange={(e) => onRiskFilterChange(e.target.value)}
          aria-label="Filter by Risk Band"
          style={{ padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#ffffff', color: '#374151' }}
        >
          <option value="all">All Risk Bands</option>
          <option value="critical">Critical Risk</option>
          <option value="high">High Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="low">Low Risk</option>
        </select>

        {/* Quantum Status Filter */}
        <select
          value={quantumFilter}
          onChange={(e) => onQuantumFilterChange(e.target.value)}
          aria-label="Filter by Quantum Status"
          style={{ padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#ffffff', color: '#374151' }}
        >
          <option value="all">All Quantum Statuses</option>
          <option value="vulnerable">Quantum Vulnerable</option>
          <option value="safe">Classical Safe</option>
          <option value="pqc_native">PQC Native</option>
        </select>

        {/* Application Filter */}
        <select
          value={appFilter}
          onChange={(e) => onAppFilterChange(e.target.value)}
          aria-label="Filter by Application"
          style={{ padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#ffffff', color: '#374151' }}
        >
          <option value="all">All Applications</option>
          {applications.map((app) => (
            <option key={app.id} value={app.name}>
              {app.name}
            </option>
          ))}
        </select>

        {/* Purpose Filter */}
        <select
          value={purposeFilter}
          onChange={(e) => onPurposeFilterChange(e.target.value)}
          aria-label="Filter by Cryptographic Purpose"
          style={{ padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#ffffff', color: '#374151' }}
        >
          <option value="all">All Purposes</option>
          <option value="digital_signature">Digital Signature</option>
          <option value="token_signing">Token Signing</option>
          <option value="key_exchange">Key Exchange / KEX</option>
          <option value="data_at_rest_encryption">Data At Rest</option>
        </select>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" icon={X} onClick={onResetFilters}>
            Clear Filters
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
