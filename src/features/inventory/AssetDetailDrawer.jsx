import { useState } from 'react';
import Drawer from '../../components/ui/Drawer';
import Tabs from '../../components/ui/Tabs';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import { mockEvidence } from '../../mock/evidence';
import { mockRecommendations } from '../../mock/recommendations';
import { mockRiskAssessments } from '../../mock/risk-assessments';
import { ShieldAlert, FileCode2, Network, AlertTriangle, Lightbulb, History } from 'lucide-react';

export default function AssetDetailDrawer({ isOpen, onClose, asset }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!asset) return null;

  const evidence = mockEvidence.find(e => e.assetId === asset.id) || mockEvidence[0];
  const riskAssessment = mockRiskAssessments.find(r => r.assetId === asset.id) || mockRiskAssessments[0];
  const recommendation = mockRecommendations.find(r => r.assetId === asset.id) || mockRecommendations[0];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ShieldAlert },
    { id: 'evidence', label: 'Evidence & Code', icon: FileCode2 },
    { id: 'dependencies', label: 'Dependencies', icon: Network },
    { id: 'risk', label: 'Risk Scoring', icon: AlertTriangle },
    { id: 'recommendation', label: 'PQC Guidance', icon: Lightbulb },
    { id: 'history', label: 'Audit History', icon: History }
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={asset.algorithm?.name || asset.id}
      subtitle={`Asset ID: ${asset.id} | Application: ${asset.context?.applicationName || 'Unknown'}`}
      width={720}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Badge variant={asset.riskBand}>{asset.riskBand}</Badge>
            <Badge variant={asset.status?.quantum === 'vulnerable' ? 'high' : 'pqc'}>
              {asset.status?.quantum?.replace('_', ' ')}
            </Badge>
          </div>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab}>
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Identity Banner */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Algorithm Family</span>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{asset.algorithm?.family} ({asset.algorithm?.variant || 'Standard'})</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Key Length / Curve</span>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{asset.algorithm?.keySize ? `${asset.algorithm.keySize} bits` : 'N/A'}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Cryptographic Purpose</span>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{asset.usage?.purpose?.replace(/_/g, ' ')}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Detection Confidence</span>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#10b981' }}>{((asset.confidence || 0.99) * 100).toFixed(1)}% (AST Verified)</div>
              </div>
            </div>

            {/* Context Details */}
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '10px' }}>Operational Context</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div style={{ padding: '10px 12px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Target Application</div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#0f172a' }}>{asset.context?.applicationName} ({asset.context?.applicationId})</div>
                </div>
                <div style={{ padding: '10px 12px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Workload / Container</div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#0f172a' }}>{asset.context?.serviceName || 'default-service'}</div>
                </div>
                <div style={{ padding: '10px 12px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Underlying Library</div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#0f172a' }}>{asset.context?.libraryName || 'System Crypto'}</div>
                </div>
                <div style={{ padding: '10px 12px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Internet Facing</div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: asset.classification?.internetFacing ? '#dc2626' : '#10b981' }}>
                    {asset.classification?.internetFacing ? 'Yes (Public Ingress)' : 'No (Internal Network)'}
                  </div>
                </div>
              </div>
            </div>

            {/* Data Classification */}
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '10px' }}>Data Sensitivity & Exposure</h4>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                This asset secures <strong>{asset.classification?.dataSensitivity || 'high'}</strong> sensitivity data in a <strong>{asset.classification?.businessCriticality || 'critical'}</strong> workload.
                Because the algorithm is <strong>{asset.status?.quantum}</strong>, passive interceptors can store traffic now and retroactively compromise payloads once quantum computers reach scale.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: EVIDENCE */}
        {activeTab === 'evidence' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, color: '#334155' }}>Detector Rule:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#1e40af' }}>{evidence.ruleId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, color: '#334155' }}>Source Location:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#0f172a' }}>{evidence.filePath}:{evidence.startLine}-{evidence.endLine}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, color: '#334155' }}>Repository:</span>
                <span style={{ color: '#475569' }}>{evidence.context?.repository} ({evidence.context?.commit})</span>
              </div>
            </div>

            {/* Code Snippet Box */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Source Code Snippet</span>
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 500 }}>Confidence: {((evidence.confidence || 0.99) * 100).toFixed(1)}%</span>
              </div>
              <pre style={{
                background: '#0f172a',
                color: '#f8fafc',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                overflowX: 'auto',
                lineHeight: 1.6
              }}>
                <code>{evidence.codeSnippet}</code>
              </pre>
            </div>
          </div>
        )}

        {/* TAB 3: DEPENDENCIES */}
        {activeTab === 'dependencies' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ padding: '10px 14px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: '12px', color: '#334155' }}>
                Connected Workloads & Downstream Consumers
              </div>
              <div style={{ padding: '14px' }}>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#334155', lineHeight: 1.8 }}>
                  <li><strong>Upstream Consumer:</strong> Web Ingress ALB ({asset.context?.applicationName})</li>
                  <li><strong>Executing Workload:</strong> {asset.context?.serviceName || 'checkout-worker'}</li>
                  <li><strong>Crypto Provider:</strong> {asset.context?.libraryName || 'OpenSSL 3.0'}</li>
                  <li><strong>Downstream Service:</strong> Transaction Database & Settlement Queue</li>
                </ul>
              </div>
            </div>
            <div style={{ background: '#f0fdf4', padding: '12px 16px', borderRadius: '6px', border: '1px solid #bbf7d0', fontSize: '12px', color: '#166534' }}>
              <strong>Blast Radius:</strong> Replacing this algorithm impacts 4 dependent services and requires backward-compatible dual verification during transition.
            </div>
          </div>
        )}

        {/* TAB 4: RISK SCORING */}
        {activeTab === 'risk' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fee2e2' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#991b1b', fontWeight: 600, textTransform: 'uppercase' }}>Composite Risk Score</span>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#dc2626' }}>{riskAssessment.overallScore} / 100</div>
              </div>
              <Badge variant="critical">CRITICAL RISK</Badge>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Risk Dimension Weights</span>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span>Quantum Vulnerability (35%)</span>
                  <span style={{ fontWeight: 600 }}>{riskAssessment.factors.quantumVulnerability}%</span>
                </div>
                <ProgressBar value={riskAssessment.factors.quantumVulnerability} max={100} color="#dc2626" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span>Business Criticality (25%)</span>
                  <span style={{ fontWeight: 600 }}>{riskAssessment.factors.businessCriticality}%</span>
                </div>
                <ProgressBar value={riskAssessment.factors.businessCriticality} max={100} color="#f59e0b" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span>Internet Exposure (20%)</span>
                  <span style={{ fontWeight: 600 }}>{riskAssessment.factors.exposureEnvironment}%</span>
                </div>
                <ProgressBar value={riskAssessment.factors.exposureEnvironment} max={100} color="#f97316" />
              </div>
            </div>

            <div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Primary Risk Drivers</span>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '18px', fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
                {riskAssessment.drivers?.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 5: RECOMMENDATION */}
        {activeTab === 'recommendation' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #e0f2fe' }}>
              <span style={{ fontSize: '11px', color: '#0369a1', textTransform: 'uppercase', fontWeight: 600 }}>Recommended PQC Scheme</span>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0369a1', margin: '4px 0 6px 0' }}>
                {recommendation.recommendedAlgorithm}
              </h4>
              <Badge variant="pqc">{recommendation.nistStatus}</Badge>
              <p style={{ fontSize: '13px', color: '#334155', margin: '12px 0 0 0', lineHeight: 1.5 }}>
                {recommendation.rationale}
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '10px' }}>Migration Implementation Steps</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recommendation.steps?.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#334155' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>
                      {idx + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: HISTORY */}
        {activeTab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ borderLeft: '2px solid #cbd5e1', paddingLeft: '14px', marginLeft: '6px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>Initial Discovery via AST Code Inspection</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>{asset.firstSeen || '2026-08-15'} - Nightly Pipeline #8210</div>
            </div>
            <div style={{ borderLeft: '2px solid #cbd5e1', paddingLeft: '14px', marginLeft: '6px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>Risk Classification: Critical Assigned</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>2026-08-16 - Automated Policy Rule SEC-RSA-01</div>
            </div>
            <div style={{ borderLeft: '2px solid #1e40af', paddingLeft: '14px', marginLeft: '6px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e40af' }}>Migration Plan Linked: TASK-MIG-101</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>{asset.lastSeen || '2026-09-17'} - Assigned to Alex Chen</div>
            </div>
          </div>
        )}
      </Tabs>
    </Drawer>
  );
}
