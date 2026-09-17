import { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import Drawer from '../../components/ui/Drawer';
import { useMigrationPlans } from '../../hooks/useMigrationPlans';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const COLUMNS = [
  { id: 'not_started', title: 'Not Started', color: '#94a3b8' },
  { id: 'assessed', title: 'Assessed & Planned', color: '#f59e0b' },
  { id: 'in_progress', title: 'In Progress', color: '#0284c7' },
  { id: 'testing', title: 'Testing & Staging', color: '#8b5cf6' },
  { id: 'completed', title: 'Migrated & Verified', color: '#10b981' }
];

export default function MigrationPage() {
  const { tasks, updateTaskStage, toggleChecklist } = useMigrationPlans();
  const [selectedTask, setSelectedTask] = useState(null);

  const completedCount = tasks.filter(t => t.stage === 'completed').length;
  const overallPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <PageHeader
        title="Post-Quantum Migration Center"
        subtitle="Kanban orchestration tracking cryptographic algorithm remediation across enterprise services"
      />

      {/* Progress Summary Header */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Overall Remediation Runway</span>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
              {completedCount} of {tasks.length} High-Impact Migrations Completed ({overallPercent}%)
            </div>
          </div>
          <Badge variant="pqc">NIST FIPS 203/204 STANDARD</Badge>
        </div>
        <ProgressBar value={overallPercent} max={100} height={10} color="#06b6d4" />
      </Card>

      {/* Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(240px, 1fr))', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.stage === col.id);
          return (
            <div key={col.id} style={{ background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', minHeight: '520px' }}>
              {/* Column Header */}
              <div style={{ padding: '12px 14px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: col.color }} />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{col.title}</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', background: '#e2e8f0', padding: '1px 6px', borderRadius: '10px' }}>
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                {colTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '14px',
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{task.applicationName}</span>
                      <Badge variant={task.priority === 'critical' ? 'critical' : 'high'}>{task.priority}</Badge>
                    </div>

                    <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                      {task.title}
                    </h4>

                    <div style={{ fontSize: '11px', color: '#475569', marginBottom: '8px' }}>
                      Target: <strong style={{ color: '#0284c7' }}>{task.targetAlgorithm}</strong>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <ProgressBar value={task.progressPercent} max={100} height={5} color={task.progressPercent === 100 ? '#10b981' : '#0284c7'} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                      <span>{task.owner.split(' ')[0]}</span>
                      <span>{task.dueDate}</span>
                    </div>

                    {/* Quick Move Buttons */}
                    <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                      {col.id !== 'not_started' && (
                        <button
                          type="button"
                          aria-label={`Move ${task.title} back one stage`}
                          title="Move task back one stage"
                          onClick={(e) => {
                            e.stopPropagation();
                            const curIdx = COLUMNS.findIndex(c => c.id === col.id);
                            updateTaskStage(task.id, COLUMNS[curIdx - 1].id);
                          }}
                          style={{ padding: '4px 7px', fontSize: '10px', borderRadius: '5px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <ArrowLeft size={12} aria-hidden="true" /> Back
                        </button>
                      )}
                      {col.id !== 'completed' && (
                        <button
                          type="button"
                          aria-label={`Advance ${task.title} one stage`}
                          title="Advance task one stage"
                          onClick={(e) => {
                            e.stopPropagation();
                            const curIdx = COLUMNS.findIndex(c => c.id === col.id);
                            updateTaskStage(task.id, COLUMNS[curIdx + 1].id);
                          }}
                          style={{ padding: '4px 7px', fontSize: '10px', borderRadius: '5px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          Advance <ArrowRight size={12} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Drawer */}
      <Drawer
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.title}
        subtitle={`Task ID: ${selectedTask?.id} | Application: ${selectedTask?.applicationName}`}
        width={600}
      >
        {selectedTask && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Assigned Owner</span>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{selectedTask.owner}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Due Date</span>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{selectedTask.dueDate}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Current Algorithm</span>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#dc2626' }}>{selectedTask.currentAlgorithm}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Target Scheme</span>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0284c7' }}>{selectedTask.targetAlgorithm}</div>
              </div>
            </div>

            {/* Checklist */}
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '10px' }}>Remediation Checklist</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedTask.checklist?.map(chk => (
                  <label
                    key={chk.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      background: chk.completed ? '#f0fdf4' : '#ffffff',
                      border: `1px solid ${chk.completed ? '#bbf7d0' : '#e2e8f0'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: chk.completed ? '#166534' : '#1e293b'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={chk.completed}
                      onChange={() => toggleChecklist(selectedTask.id, chk.id)}
                    />
                    <span style={{ textDecoration: chk.completed ? 'line-through' : 'none' }}>
                      {chk.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
