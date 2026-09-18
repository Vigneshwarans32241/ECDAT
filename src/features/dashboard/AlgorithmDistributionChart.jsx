import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function AlgorithmDistributionChart({ algorithms }) {
  const navigate = useNavigate();
  const maxCount = Math.max(...(algorithms?.map((a) => a.count) || [1]));

  const handleSelectAlgorithm = (algoName) => {
    navigate(`/inventory?search=${encodeURIComponent(algoName)}`);
  };

  return (
    <Card title="Cryptographic Algorithm Families" subtitle="Asset count by discovered algorithm type (Click to filter)">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '4px' }}>
        {algorithms?.map((algo, i) => {
          const pct = Math.round((algo.count / maxCount) * 100);
          const badgeVariant =
            algo.quantum === 'vulnerable' ? 'high' :
            algo.quantum === 'pqc_native' ? 'pqc' : 'low';
          const badgeLabel =
            algo.quantum === 'vulnerable' ? 'Quantum Vulnerable' :
            algo.quantum === 'pqc_native' ? 'PQC Native' : 'Classical Safe';

          return (
            <div
              key={i}
              onClick={() => handleSelectAlgorithm(algo.algorithm)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                cursor: 'pointer',
                padding: '4px 6px',
                borderRadius: '6px',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              title={`Filter inventory by ${algo.algorithm}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>{algo.algorithm}</span>
                  <Badge variant={badgeVariant}>{badgeLabel}</Badge>
                </div>
                <span style={{ fontWeight: 600, color: '#475569' }}>{algo.count}</span>
              </div>
              <div style={{ width: '100%', height: '7px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    backgroundColor:
                      algo.quantum === 'vulnerable' ? '#f59e0b' :
                      algo.quantum === 'pqc_native' ? '#06b6d4' : '#10b981',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
