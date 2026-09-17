import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useCryptoAssets } from '../../hooks/useCryptoAssets';
import { Download, FileJson, FileSpreadsheet } from 'lucide-react';

export default function ReportsPage() {
  const { rawAssets } = useCryptoAssets();

  const handleDownloadJSON = () => {
    const cbom = {
      bomFormat: 'CycloneDX',
      specVersion: '1.6',
      serialNumber: 'urn:uuid:ecdat-cbom-enterprise-perimeter',
      version: 1,
      metadata: {
        timestamp: new Date().toISOString(),
        tools: [{ vendor: 'ECDAT', name: 'Enterprise Cryptographic Discovery Tool', version: '1.0.0' }],
        component: { name: 'Enterprise Core Perimeter', type: 'application' }
      },
      cryptographicAssets: rawAssets
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cbom, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', 'enterprise_cbom_cyclonedx_1.6.json');
    document.body.appendChild(dl);
    dl.click();
    document.body.removeChild(dl);
  };

  const handleDownloadCSV = () => {
    const headers = ['Asset ID', 'Algorithm', 'Purpose', 'Application', 'Risk Band', 'Quantum Status'];
    const rows = rawAssets.map(a => [
      a.id,
      a.algorithm?.name || 'N/A',
      a.usage?.purpose || 'N/A',
      a.context?.applicationName || 'N/A',
      a.riskBand || 'N/A',
      a.status?.quantum || 'N/A'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'ecdat_inventory_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <PageHeader
        title="Compliance & Audit Reports"
        subtitle="Export standardized Cryptographic Bill of Materials (CBOM), executive risk briefs, and audit logs"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* CBOM CycloneDX Export Card */}
        <Card title="CycloneDX 1.6 CBOM Export" subtitle="Standardized machine-readable cryptographic catalog">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Badge variant="pqc">CYCLONEDX 1.6</Badge>
              <Badge variant="info">JSON FORMAT</Badge>
            </div>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              Complete machine-readable export following the OWASP CycloneDX Cryptography Extension specification, detailing algorithms, key lengths, certificates, and detection evidence.
            </p>
            <div style={{ paddingTop: '8px' }}>
              <Button variant="primary" icon={FileJson} onClick={handleDownloadJSON}>
                Download CBOM JSON
              </Button>
            </div>
          </div>
        </Card>

        {/* Inventory Spreadsheet Export */}
        <Card title="Cryptographic Perimeter Spreadsheet" subtitle="Comma-separated tabular inventory for audit teams">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Badge variant="success">CSV FORMAT</Badge>
              <Badge variant="default">1,284 ASSETS</Badge>
            </div>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              High-level tabular snapshot containing asset IDs, owning applications, classical and quantum risk classifications, and designated migration runways.
            </p>
            <div style={{ paddingTop: '8px' }}>
              <Button variant="secondary" icon={FileSpreadsheet} onClick={handleDownloadCSV}>
                Download Inventory CSV
              </Button>
            </div>
          </div>
        </Card>

        {/* Executive Risk Brief */}
        <Card title="Executive Quantum Risk Brief" subtitle="Board-level executive summary of PQC readiness">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Badge variant="critical">EXECUTIVE AUDIT</Badge>
              <Badge variant="info">NIST COMPLIANCE</Badge>
            </div>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              Summarizes the estimated 2034 threat horizon, Mosca theorem deficits across core banking, and active migration progress for compliance officers.
            </p>
            <div style={{ paddingTop: '8px' }}>
              <Button variant="outline" icon={Download} onClick={handleDownloadJSON}>
                Generate Executive Report
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
