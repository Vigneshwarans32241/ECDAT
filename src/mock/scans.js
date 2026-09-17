export const mockScans = [
  {
    id: 'SCAN-2026-09-17-001',
    name: 'Scheduled Nightly Enterprise CBOM Discovery',
    target: 'Full Enterprise Scope (8 Applications)',
    type: 'Repository + Artifact + Container',
    status: 'completed',
    startedAt: '2026-09-17T02:00:00Z',
    finishedAt: '2026-09-17T02:34:12Z',
    duration: '34m 12s',
    triggeredBy: 'CI/CD Pipeline #8492',
    stats: {
      filesScanned: 14820,
      dependenciesAnalyzed: 2340,
      certificatesInspected: 184,
      cryptoAssetsDiscovered: 1284,
      quantumVulnerableFound: 326,
      criticalRisks: 42,
      newFindings: 3
    }
  },
  {
    id: 'SCAN-2026-09-16-003',
    name: 'Payment Gateway Security Release Audit',
    target: 'github.com/enterprise/checkout-service',
    type: 'Source Repository AST',
    status: 'completed',
    startedAt: '2026-09-16T14:10:00Z',
    finishedAt: '2026-09-16T14:18:45Z',
    duration: '8m 45s',
    triggeredBy: 'Alex Chen (Manual)',
    stats: {
      filesScanned: 620,
      dependenciesAnalyzed: 145,
      certificatesInspected: 12,
      cryptoAssetsDiscovered: 68,
      quantumVulnerableFound: 24,
      criticalRisks: 8,
      newFindings: 0
    }
  },
  {
    id: 'SCAN-2026-09-15-002',
    name: 'Identity Service Container Image Scan',
    target: 'registry.corp.internal/iam/oauth-server:v2.4.0',
    type: 'Container Binary Inspection',
    status: 'completed',
    startedAt: '2026-09-15T09:00:00Z',
    finishedAt: '2026-09-15T09:12:30Z',
    duration: '12m 30s',
    triggeredBy: 'Automated Registry Webhook',
    stats: {
      filesScanned: 3100,
      dependenciesAnalyzed: 412,
      certificatesInspected: 38,
      cryptoAssetsDiscovered: 94,
      quantumVulnerableFound: 31,
      criticalRisks: 6,
      newFindings: 1
    }
  },
  {
    id: 'SCAN-2026-09-17-002',
    name: 'Partner Data Exchange Sandbox Validation',
    target: 'Partner Ingress Endpoint (mTLS & TLS)',
    type: 'Network Endpoint Scan',
    status: 'running',
    startedAt: '2026-09-17T08:15:00Z',
    finishedAt: null,
    duration: 'Running (15m)',
    triggeredBy: 'Security Operations',
    stats: {
      filesScanned: 0,
      dependenciesAnalyzed: 0,
      certificatesInspected: 24,
      cryptoAssetsDiscovered: 18,
      quantumVulnerableFound: 7,
      criticalRisks: 2,
      newFindings: 0
    }
  }
];
