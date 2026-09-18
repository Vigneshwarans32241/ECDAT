import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useCryptoAssets } from '../../hooks/useCryptoAssets';
import { useMigrationPlans } from '../../hooks/useMigrationPlans';
import { mockMoscaAssessments } from '../../mock/mosca-assessments';
import { useToast } from '../../components/ui/Toast';
import { FileJson, FileSpreadsheet, FileText } from 'lucide-react';

export default function ReportsPage() {
  const { rawAssets } = useCryptoAssets();
  const { tasks } = useMigrationPlans();
  const toast = useToast();

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
    toast.success('Downloaded CycloneDX 1.6 CBOM JSON (1,284 assets)');
  };

  const handleDownloadCSV = () => {
    const headers = ['Asset ID', 'Algorithm', 'Purpose', 'Application', 'Service', 'Risk Band', 'Quantum Status', 'Migration Status'];
    const rows = rawAssets.map((a) => [
      a.id,
      a.algorithm?.name || 'N/A',
      a.usage?.purpose || 'N/A',
      a.context?.applicationName || 'N/A',
      a.context?.serviceName || 'N/A',
      a.riskBand || 'N/A',
      a.status?.quantum || 'N/A',
      a.migrationStatus || 'N/A'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'ecdat_inventory_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Downloaded Cryptographic Inventory CSV');
  };

  const handleDownloadMoscaCSV = () => {
    const headers = ['App ID', 'Application Name', 'Data Category', 'Shelf Life (X)', 'Migration (Y)', 'Horizon (Z)', 'Margin', 'Status'];
    const rows = mockMoscaAssessments.map((m) => [
      m.applicationId,
      m.applicationName,
      m.dataCategory,
      m.shelfLifeX,
      m.migrationTimeY,
      m.threatHorizonZ,
      m.margin,
      m.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'mosca_quantum_exposure_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Downloaded Mosca Theorem Quantum Exposure CSV');
  };

  const handleDownloadExecutiveHTML = () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ECDAT - Executive Cryptographic Posture Brief</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #0f172a; max-width: 900px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 24px 0; }
    .kpi-box { padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center; }
    .kpi-val { font-size: 24px; font-weight: 800; color: #0f172a; }
    .kpi-lbl { font-size: 12px; color: #64748b; text-transform: uppercase; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { padding: 10px 14px; border-bottom: 1px solid #e2e8f0; text-align: left; font-size: 13px; }
    th { background: #f1f5f9; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
    .critical { background: #fee2e2; color: #991b1b; }
    .high { background: #ffedd5; color: #9a3412; }
    .low { background: #dcfce7; color: #166534; }
  </style>
</head>
<body>
  <h1>Enterprise Cryptographic Posture & PQC Readiness Brief</h1>
  <p><strong>Generated:</strong> ${new Date().toLocaleString()} | <strong>Organization:</strong> Enterprise Core Banking & Ingress</p>
  
  <div class="kpi-grid">
    <div class="kpi-box"><div class="kpi-val">1,284</div><div class="kpi-lbl">Total Assets</div></div>
    <div class="kpi-box"><div class="kpi-val" style="color: #dc2626;">326</div><div class="kpi-lbl">Quantum Exposed</div></div>
    <div class="kpi-box"><div class="kpi-val" style="color: #ea580c;">42</div><div class="kpi-lbl">Critical Risks</div></div>
    <div class="kpi-box"><div class="kpi-val" style="color: #0284c7;">${tasks.length} Active</div><div class="kpi-lbl">Migration Tasks</div></div>
  </div>

  <h2>Post-Quantum Migration Runway Summary</h2>
  <table>
    <thead>
      <tr><th>Task Title</th><th>Application</th><th>Target Algorithm</th><th>Stage</th><th>Due Date</th></tr>
    </thead>
    <tbody>
      ${tasks.map((t) => `<tr><td><strong>${t.title}</strong></td><td>${t.applicationName}</td><td>${t.targetAlgorithm}</td><td>${t.stage.replace('_', ' ')}</td><td>${t.dueDate}</td></tr>`).join('')}
    </tbody>
  </table>
  
  <p style="margin-top: 40px; font-size: 12px; color: #64748b;">Report generated automatically by ECDAT (Enterprise Cryptographic Discovery & Analysis Tool).</p>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ecdat_executive_audit_brief.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Generated Executive Cryptographic Audit Brief (HTML / Print ready)');
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
        <Card title="Executive Quantum Risk Brief" subtitle="Board-level printable executive summary of PQC readiness">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Badge variant="critical">EXECUTIVE AUDIT</Badge>
              <Badge variant="info">PRINT / HTML</Badge>
            </div>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              Summarizes the estimated 2034 threat horizon, Mosca theorem deficits across core banking, and active migration progress for compliance officers.
            </p>
            <div style={{ paddingTop: '8px' }}>
              <Button variant="outline" icon={FileText} onClick={handleDownloadExecutiveHTML}>
                Generate Executive Report
              </Button>
            </div>
          </div>
        </Card>

        {/* Mosca Exposure Report */}
        <Card title="Mosca Quantum Timing Report" subtitle="Data retention vs threat horizon calculations">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Badge variant="warning">MOSCA THEOREM</Badge>
              <Badge variant="default">CSV TABLE</Badge>
            </div>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              Per-application assessment of data shelf-life (X), migration time (Y), threat horizon (Z), and calculated protection margin deficits.
            </p>
            <div style={{ paddingTop: '8px' }}>
              <Button variant="outline" icon={FileSpreadsheet} onClick={handleDownloadMoscaCSV}>
                Download Mosca CSV
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
