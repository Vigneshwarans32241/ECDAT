import { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import KPICard from '../../components/ui/KPICard';
import { useRecommendations } from '../../hooks/useRecommendations';
import { ShieldCheck, Cpu, ArrowRight, CheckCircle, ExternalLink, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecommendationsPage() {
  const { recommendations } = useRecommendations();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHeader
        title="Post-Quantum Cryptography (PQC) Guidance"
        subtitle="NIST FIPS 203/204 compliant transition strategies tailored to discovered asset usage patterns"
      />

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <KPICard
          label="Quantum Vulnerable Perimeter"
          value="326"
          detail="Requiring PQC replacement"
          icon={ShieldCheck}
          accentColor="#dc2626"
        />
        <KPICard
          label="Automated Drop-In Ready"
          value="208"
          detail="Standardized lattice drop-ins"
          icon={Cpu}
          accentColor="#10b981"
        />
        <KPICard
          label="Hybrid Dual-Sign Required"
          value="96"
          detail="Legacy client compatibility"
          icon={Lightbulb}
          accentColor="#0284c7"
        />
        <KPICard
          label="Manual Review Needed"
          value="22"
          detail="Proprietary hardware & HSMs"
          icon={ExternalLink}
          accentColor="#f59e0b"
        />
      </div>

      {/* Strategy Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
        {recommendations.map(rec => (
          <Card
            key={rec.id}
            title={rec.applicationName}
            subtitle={`Asset: ${rec.assetId} | Purpose: ${rec.currentPurpose?.replace(/_/g, ' ')}`}
            action={<Badge variant={rec.priority}>{rec.priority}</Badge>}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Transition Banner */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Current Legacy</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#dc2626' }}>{rec.currentAlgorithm}</div>
                </div>
                <ArrowRight size={20} color="#94a3b8" />
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Target Scheme</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0369a1' }}>{rec.recommendedAlgorithm}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Badge variant="pqc">{rec.nistStatus}</Badge>
                <Badge variant="info">Strategy: {rec.strategy?.replace(/_/g, ' ')}</Badge>
                <Badge variant="default">Complexity: {rec.complexity}</Badge>
              </div>

              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                {rec.rationale}
              </p>

              {/* Implementation Steps Checklist */}
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>Standardized Migration Roadmap:</span>
                <ul style={{ margin: '6px 0 0 0', paddingLeft: '18px', fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
                  {rec.steps?.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Link to="/migration">
                  <Button variant="primary" size="sm" icon={CheckCircle}>
                    View on Migration Runway
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
