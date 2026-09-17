import { useState } from 'react';
import { mockRecommendations } from '../mock/recommendations';
import { storage } from '../lib/storage';

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState(() => storage.get('recommendations', mockRecommendations));
  return { recommendations, setRecommendations };
}
