import { useState, useEffect, useCallback } from 'react';
import { mockMigrationTasks } from '../mock/migration';
import { storage } from '../lib/storage';

export function useMigrationPlans() {
  const [tasks, setTasks] = useState(() => storage.get('migration_tasks', mockMigrationTasks));

  useEffect(() => {
    storage.set('migration_tasks', tasks);
  }, [tasks]);

  const addTask = useCallback((taskData) => {
    const newTask = {
      id: 'TASK-MIG-' + Math.floor(100 + Math.random() * 900),
      title: taskData.title || 'Untitled PQC Migration',
      assetId: taskData.assetId || 'CRYPTO-GENERIC',
      applicationId: taskData.applicationId || 'APP-001',
      applicationName: taskData.applicationName || 'General Application',
      stage: taskData.stage || 'not_started',
      priority: taskData.priority || 'high',
      owner: taskData.owner || 'SecOps Team',
      dueDate: taskData.dueDate || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      progressPercent: taskData.stage === 'completed' ? 100 : taskData.stage === 'testing' ? 80 : taskData.stage === 'in_progress' ? 50 : taskData.stage === 'assessed' ? 20 : 0,
      estimatedEffort: taskData.estimatedEffort || '4 weeks',
      currentAlgorithm: taskData.currentAlgorithm || 'RSA-2048',
      targetAlgorithm: taskData.targetAlgorithm || 'ML-DSA-65',
      checklist: taskData.checklist || [
        { id: 'chk-1', text: 'Evaluate PQC algorithm overhead and compatibility', completed: false },
        { id: 'chk-2', text: 'Implement dual-scheme wrapper or provider', completed: false },
        { id: 'chk-3', text: 'Run staging regression test suite', completed: false },
        { id: 'chk-4', text: 'Deploy to production with canary traffic', completed: false }
      ],
      blastRadius: taskData.blastRadius || { services: 3, apis: 6, dependentTeams: 2 }
    };

    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTaskStage = useCallback((taskId, newStage) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const progress =
            newStage === 'completed' ? 100 :
            newStage === 'testing' ? 80 :
            newStage === 'in_progress' ? 50 :
            newStage === 'assessed' ? 20 : 0;
          return { ...t, stage: newStage, progressPercent: progress };
        }
        return t;
      })
    );
  }, []);

  const toggleChecklist = useCallback((taskId, chkId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedChk = t.checklist.map((c) =>
            c.id === chkId ? { ...c, completed: !c.completed } : c
          );
          const compCount = updatedChk.filter((c) => c.completed).length;
          const pct = Math.round((compCount / updatedChk.length) * 100);
          const stage = pct === 100 ? 'completed' : pct >= 75 ? 'testing' : pct >= 25 ? 'in_progress' : t.stage;
          return { ...t, checklist: updatedChk, progressPercent: pct, stage };
        }
        return t;
      })
    );
  }, []);

  const addChecklistItem = useCallback((taskId, itemText) => {
    if (!itemText?.trim()) return;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newChk = [
            ...t.checklist,
            { id: 'chk-' + Date.now(), text: itemText.trim(), completed: false }
          ];
          const compCount = newChk.filter((c) => c.completed).length;
          const pct = Math.round((compCount / newChk.length) * 100);
          return { ...t, checklist: newChk, progressPercent: pct };
        }
        return t;
      })
    );
  }, []);

  const deleteTask = useCallback((taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  return {
    tasks,
    setTasks,
    addTask,
    updateTaskStage,
    toggleChecklist,
    addChecklistItem,
    deleteTask
  };
}
