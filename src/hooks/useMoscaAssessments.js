import { useState } from 'react';
import { mockMoscaAssessments } from '../mock/mosca-assessments';
import { storage } from '../lib/storage';

export function useMoscaAssessments() {
  const [assessments, setAssessments] = useState(() => storage.get('mosca_assessments', mockMoscaAssessments));
  return { assessments, setAssessments };
}
