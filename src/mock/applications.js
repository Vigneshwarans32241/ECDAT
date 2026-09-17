export const applications = [
  { id: 'APP-001', name: 'Payment API', criticality: 'critical', owner: 'Platform Security', environment: 'production', internetFacing: true, description: 'Card processing & wire gateway' },
  { id: 'APP-002', name: 'Customer Portal', criticality: 'high', owner: 'Gateway Core', environment: 'production', internetFacing: true, description: 'Customer-facing web portal' },
  { id: 'APP-003', name: 'Identity Service', criticality: 'critical', owner: 'IAM Engineering', environment: 'production', internetFacing: true, description: 'OAuth 2.1 & FIDO2 identity federation' },
  { id: 'APP-004', name: 'Internal Analytics', criticality: 'medium', owner: 'Data Engineering', environment: 'production', internetFacing: false, description: 'Internal business intelligence platform' },
  { id: 'APP-005', name: 'Mobile Backend', criticality: 'high', owner: 'Mobile Team', environment: 'production', internetFacing: true, description: 'Mobile authentication service' },
  { id: 'APP-006', name: 'Settlement Engine', criticality: 'critical', owner: 'Core Banking', environment: 'production', internetFacing: false, description: 'End-of-day batch ledger reconciling' },
  { id: 'APP-007', name: 'Data Exchange Gateway', criticality: 'high', owner: 'NetOps', environment: 'production', internetFacing: true, description: 'Partner data exchange & API gateway' },
  { id: 'APP-008', name: 'Reporting Service', criticality: 'medium', owner: 'Platform', environment: 'production', internetFacing: false, description: 'Compliance reporting & audit logs' },
]