import { useState } from 'react';
import { mockGraphData } from '../mock/graph-data';

export function useGraphData() {
  const [graphData, setGraphData] = useState(mockGraphData);
  return { graphData, setGraphData };
}
