import { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import Drawer from '../../components/ui/Drawer';
import Modal from '../../components/ui/Modal';
import { useMigrationPlans } from '../../hooks/useMigrationPlans';
import { useToast } from '../../components/ui/Toast';
import { Plus, Download, Trash2, Calendar, Layers } from 'lucide-react';

const COLUMNS = [
  { id: 'not_started', title: 'Not Started', color: '#94a3b8' },
  { id: 'assessed', title: 'Assessed & Planned', color: '#f59e0b' },
  { id: 'in_progress', title: 'In Progress', color: '#0284c7' },
  { id: 'testing', title: 'Testing & Staging', color: '#8b5cf6' },
  { id: 'completed', title: 'Migrated & Verified', color: '#10b981' }
];

export default function MigrationPage() {
  const { tasks, addTask, updateTaskStage, toggleChecklist, addChecklistItem, deleteTask } = useMigrationPlans();
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTab, setActiveTab] = useState('board'); // 'board' | 'timeline'
  const [newChecklistText, setNewChecklistText] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newApp, setNewApp] = useState('Payment API');
  const [newCurrentAlgo, setNewCurrentAlgo] = useState('RSA-2048');
  const [newTargetAlgo, setNewTargetAlgo] = useState('ML-DSA-65');
  const [newPriority, setNewPriority] = useState('high');
  const [newOwner, setNewOwner] = useState('Alex Chen (SecOps)');
  const [newDueDate, setNewDueDate] = useState('2026-12-31');

  const toast = useToast();

  const completedCount = tasks.filter((t) => t.stage === 'completed').length;
  const overallPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleCreateTask = () => {
    if (!newTitle.trim()) {
      toast.error('Please enter a task title');
      return;
    }
    addTask({
      title: newTitle.trim(),
      applicationName: newApp,
      currentAlgorithm: newCurrentAlgo,
      targetAlgorithm: newTargetAlgo,
      priority: newPriority,
      owner: newOwner,
      dueDate: newDueDate,
      stage: 'not_started'
    });
    setCreateModalOpen(false);
    setNewTitle('');
    toast.success(`Created migration task: ${newTitle.trim()}`);
  };

  const handleExportPlan = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', 'pqc_migration_runway.json');
    document.body.appendChild(dl);
    dl.click();
    document.body.removeChild(dl);
    toast.success(`Exported ${tasks.length} migration runway tasks`);
  };

  const handleAddChecklist = (e) => {
    e.preventDefault();
    if (!newChecklistText.trim() || !selectedTask) return;
    addChecklistItem(selectedTask.id, newChecklistText);
    setSelectedTask((prev) => ({
      ...prev,
      checklist: [
        ...prev.checklist,
        { id: 'chk-' + Date.now(), text: newChecklistText.trim(), completed: false }
      ]
    }));
    setNewChecklistText('');
    toast.info('Added checklist item');
  };

  const handleDeleteCurrentTask = () => {
    if (!selectedTask) return;
    deleteTask(selectedTask.id);
    setSelectedTask(null);
    toast.success('Migration task removed from runway');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <PageHeader
        title="Post-Quantum Migration Center"
        subtitle="Kanban orchestration tracking cryptographic algorithm remediation across enterprise services"
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="outline" size="sm" icon={Download} onClick={handleExportPlan}>
              Export Runway Plan
            </Button>
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setCreateModalOpen(true)}>
              New Migration Task
            </Button>
          </div>
        }
      />

      {/* Progress Summary Header */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Overall Remediation Runway
            </span>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
              {completedCount} of {tasks.length} High-Impact Migrations Completed ({overallPercent}%)
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant={activeTab === 'board' ? 'primary' : 'outline'}
              size="sm"
              icon={Layers}
              onClick={() => setActiveTab('board')}
            >
              Kanban Board
            </Button>
            <Button
              variant={activeTab === 'timeline' ? 'primary' : 'outline'}
              size="sm"
              icon={Calendar}
              onClick={() => setActiveTab('timeline')}
            >
              Gantt Runway Timeline
            </Button>
          </div>
        </div>
        <ProgressBar value={overallPercent} max={100} height={10} color="#06b6d4" />
      </Card>

      {/* VIEW 1: KANBAN BOARD */}
      {activeTab === 'board' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(240px, 1fr))', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.stage === col.id);
            return (
              <div key={col.id} style={{ background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', minHeight: '520px' }}>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: col.color }} />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{col.title}</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', background: '#e2e8f0', padding: '1px 6px', borderRadius: '10px' }}>
                    {colTasks.length}
                  </span>
                </div>

                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                  {colTasks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px 12px', color: '#94a3b8', fontSize: '12px' }}>
                      No tasks in this stage
                    </div>
                  ) : (
                    colTasks.map((task) => (
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
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#93c5fd';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.transform = 'none';
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
                          <span>{task.owner?.split(' ')[0]}</span>
                          <span>{task.dueDate}</span>
                        </div>

                        {/* Advance / Revert Action Buttons */}
                        <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            {col.id !== 'not_started' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const curIdx = COLUMNS.findIndex((c) => c.id === col.id);
                                  updateTaskStage(task.id, COLUMNS[curIdx - 1].id);
                                  toast.info(`Moved ${task.title} back to ${COLUMNS[curIdx - 1].title}`);
                                }}
                                style={{ padding: '3px 7px', fontSize: '11px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}
                                title="Move back"
                              >
                                ?
                              </button>
                            )}
                          </div>
                          <div>
                            {col.id !== 'completed' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const curIdx = COLUMNS.findIndex((c) => c.id === col.id);
                                  updateTaskStage(task.id, COLUMNS[curIdx + 1].id);
                                  toast.success(`Advanced ${task.title} to ${COLUMNS[curIdx + 1].title}`);
                                }}
                                style={{ padding: '3px 8px', fontSize: '11px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#eff6ff', color: '#1e40af', fontWeight: 600, cursor: 'pointer' }}
                                title="Advance to next stage"
                              >
                                Advance ?
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: GANTT TIMELINE */}
      {activeTab === 'timeline' && (
        <Card title="Post-Quantum Migration Gantt Schedule" subtitle="Remediation timelines across enterprise services">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {tasks.map((task) => (
              <div key={task.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <div>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{task.title}</span>
                    <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '8px' }}>({task.applicationName} • Due {task.dueDate})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Badge variant={task.stage === 'completed' ? 'success' : 'info'}>{task.stage.replace('_', ' ')}</Badge>
                    <span style={{ fontWeight: 700, color: '#1e40af' }}>{task.progressPercent}%</span>
                  </div>
                </div>
                <ProgressBar value={task.progressPercent} max={100} height={8} color={task.progressPercent === 100 ? '#10b981' : '#0284c7'} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Task Drawer */}
      <Drawer
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.title}
        subtitle={`Task ID: ${selectedTask?.id} | Application: ${selectedTask?.applicationName}`}
        width={620}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Button variant="danger" size="sm" icon={Trash2} onClick={handleDeleteCurrentTask}>
              Delete Task
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setSelectedTask(null)}>
              Close
            </Button>
          </div>
        }
      >
        {selectedTask && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Stage</span>
                <select
                  value={selectedTask.stage}
                  onChange={(e) => {
                    const newStage = e.target.value;
                    updateTaskStage(selectedTask.id, newStage);
                    setSelectedTask((prev) => ({
                      ...prev,
                      stage: newStage,
                      progressPercent: newStage === 'completed' ? 100 : newStage === 'testing' ? 80 : newStage === 'in_progress' ? 50 : 20
                    }));
                    toast.success(`Task stage updated to ${newStage.replace('_', ' ')}`);
                  }}
                  style={{ width: '100%', padding: '6px 8px', fontSize: '13px', borderRadius: '4px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                >
                  {COLUMNS.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Assigned Owner</span>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginTop: '6px' }}>{selectedTask.owner}</div>
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

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>Remediation Progress</span>
                <span style={{ fontWeight: 700, color: '#1e40af' }}>{selectedTask.progressPercent}%</span>
              </div>
              <ProgressBar value={selectedTask.progressPercent} max={100} height={8} color="#0284c7" />
            </div>

            {/* Checklist */}
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '10px' }}>Task Checklist</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedTask.checklist?.map((chk) => (
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
                      onChange={() => {
                        toggleChecklist(selectedTask.id, chk.id);
                        setSelectedTask((prev) => {
                          const updated = prev.checklist.map((c) =>
                            c.id === chk.id ? { ...c, completed: !c.completed } : c
                          );
                          const comp = updated.filter((c) => c.completed).length;
                          const pct = Math.round((comp / updated.length) * 100);
                          return { ...prev, checklist: updated, progressPercent: pct };
                        });
                        toast.info('Task checklist updated');
                      }}
                    />
                    <span style={{ textDecoration: chk.completed ? 'line-through' : 'none' }}>
                      {chk.text}
                    </span>
                  </label>
                ))}
              </div>

              {/* Add checklist input */}
              <form onSubmit={handleAddChecklist} style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <input
                  type="text"
                  placeholder="Add new verification or rollout item..."
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  style={{ flex: 1, padding: '7px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
                <Button variant="secondary" size="sm" type="submit">
                  Add Item
                </Button>
              </form>
            </div>
          </div>
        )}
      </Drawer>

      {/* New Task Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Post-Quantum Migration Task"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreateTask}>Enroll on Runway</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
              Migration Task Title
            </label>
            <input
              type="text"
              placeholder="e.g. Upgrade Settlement API to ML-KEM-768"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Target Application
              </label>
              <select
                value={newApp}
                onChange={(e) => setNewApp(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              >
                <option value="Payment API">Payment API</option>
                <option value="Customer Portal">Customer Portal</option>
                <option value="Identity Service">Identity Service</option>
                <option value="Settlement Engine">Settlement Engine</option>
                <option value="Data Exchange Gateway">Data Exchange Gateway</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Priority
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Current Algorithm
              </label>
              <input
                type="text"
                value={newCurrentAlgo}
                onChange={(e) => setNewCurrentAlgo(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Target PQC Scheme
              </label>
              <input
                type="text"
                value={newTargetAlgo}
                onChange={(e) => setNewTargetAlgo(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Assigned Owner
              </label>
              <input
                type="text"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Target Due Date
              </label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
