export const QUANTUM_STATUS_WEIGHTS = {
  vulnerable: 95,
  transitional: 60,
  safe: 20,
  pqc_native: 5
};

export function getQuantumWeight(status) {
  return QUANTUM_STATUS_WEIGHTS[status] || 50;
}
