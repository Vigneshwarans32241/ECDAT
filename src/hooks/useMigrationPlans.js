import { useState, useEffect } from 'react';
import { mockMigrationTasks } from '../mock/migration';
import { storage } from '../lib/storage';

export function useMigrationPlans() {
  const [tasks, setTasks] = useState(() => storage.get('migration_tasks', mockMigrationTasks));

  useEffect(() => {
    storage.set('migration_tasks', tasks);
  }, [tasks]);

  const updateTaskStage = (taskId, newStage) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const progress = newStage === 'completed' ? 100 : newStage === 'testing' ? 80 : newStage === 'in_progress' ? 50 : newStage === 'assessed' ? 20 : 0;
        return { ...t, stage: newStage, progressPercent: progress };
      }
      return t;
    }));
  };

  const toggleChecklist = (taskId, chkId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedChk = t.checklist.map(c => c.id === chkId ? { ...c, completed: !c.completed } : c);
        const compCount = updatedChk.filter(c => c.completed).length;
        const pct = Math.round((compCount / updatedChk.length) * 100);
        return { ...t, checklist: updatedChk, progressPercent: pct };
      }
      return t;
    }));
  };

  return { tasks, setTasks, updateTaskStage, toggleChecklist };
}
