import { useState } from 'react';
import { mockRiskAssessments } from '../mock/risk-assessments';
import { storage } from '../lib/storage';

export function useRiskAssessments() {
  const [assessments, setAssessments] = useState(() => storage.get('risk_assessments', mockRiskAssessments));
  return { assessments, setAssessments };
}
