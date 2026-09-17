import { useState, useEffect } from 'react';
import { mockScans } from '../mock/scans';
import { storage } from '../lib/storage';

export function useScans() {
  const [scans, setScans] = useState(() => storage.get('scans_history', mockScans));

  useEffect(() => {
    storage.set('scans_history', scans);
  }, [scans]);

  const addScan = (newScan) => {
    setScans(prev => [newScan, ...prev]);
  };

  return { scans, setScans, addScan };
}
