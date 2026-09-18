import { useState, useEffect, useCallback } from 'react';
import { mockScans } from '../mock/scans';
import { storage } from '../lib/storage';

export function useScans() {
  const [scans, setScans] = useState(() => storage.get('scans_history', mockScans));

  useEffect(() => {
    storage.set('scans_history', scans);
  }, [scans]);

  const addScan = useCallback((newScan) => {
    setScans((prev) => [newScan, ...prev]);
  }, []);

  const rerunScan = useCallback((scanId) => {
    setScans((prev) =>
      prev.map((s) => {
        if (s.id === scanId) {
          return {
            ...s,
            status: 'completed',
            startedAt: new Date().toISOString(),
            finishedAt: new Date(Date.now() + 15000).toISOString(),
            duration: '15s',
            stats: {
              ...s.stats,
              newFindings: Math.floor(Math.random() * 3)
            }
          };
        }
        return s;
      })
    );
  }, []);

  const deleteScan = useCallback((scanId) => {
    setScans((prev) => prev.filter((s) => s.id !== scanId));
  }, []);

  return { scans, setScans, addScan, rerunScan, deleteScan };
}
