import { useState, useEffect } from 'react';
import { mockDashboardData } from '../mock/dashboard';
import { storage } from '../lib/storage';

export function useDashboard() {
  const [data, setData] = useState(() => storage.get('dashboard_data', mockDashboardData));
  const [loading] = useState(false);

  useEffect(() => {
    storage.set('dashboard_data', data);
  }, [data]);

  return { data, loading, setData };
}
