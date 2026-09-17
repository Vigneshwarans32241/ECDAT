import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import ProgressBar from '../../components/ui/ProgressBar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';

export default function MigrationPrioritySection({ tasks }) {
  const activeTasks = tasks?.slice(0, 3) || [];

  return (
    <Card
      title="Active PQC Migration Runway"
      subtitle="Execution progress for high-impact cryptographic migrations"
      action={
        <Link to="/migration">
          <Button variant="outline" size="sm" icon={ArrowRight}>
            Migration Board
          </Button>
        </Link>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {activeTasks.map(task => (
          <div key={task.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{task.applicationName}</span>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: '2px 0 0 0' }}>{task.title}</h4>
              </div>
              <Badge variant={task.priority === 'critical' ? 'critical' : 'high'}>{task.priority}</Badge>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#475569' }}>
              <span>Target: <strong style={{ color: '#0284c7' }}>{task.targetAlgorithm}</strong></span>
              <span>Due: {task.dueDate}</span>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#64748b' }}>Remediation Progress</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{task.progressPercent}%</span>
              </div>
              <ProgressBar value={task.progressPercent} max={100} color={task.progressPercent >= 80 ? '#10b981' : '#0284c7'} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
              <span>Owner: {task.owner}</span>
              <span style={{ textTransform: 'capitalize' }}>Stage: {task.stage?.replace('_', ' ')}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
