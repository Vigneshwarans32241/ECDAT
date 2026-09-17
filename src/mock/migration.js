export const mockMigrationTasks = [
  {
    id: 'TASK-MIG-101',
    title: 'Migrate Payment API Signing to ML-DSA-65 Hybrid',
    assetId: 'CRYPTO-00182',
    applicationId: 'APP-001',
    applicationName: 'Payment API',
    stage: 'in_progress',
    priority: 'critical',
    owner: 'Alex Chen (SecOps)',
    dueDate: '2026-12-15',
    progressPercent: 65,
    estimatedEffort: '6 weeks',
    currentAlgorithm: 'RSA-2048 PSS',
    targetAlgorithm: 'ML-DSA-65',
    checklist: [
      { id: 'chk-1', text: 'Benchmark ML-DSA keygen and verify CPU overhead', completed: true },
      { id: 'chk-2', text: 'Implement dual-signature wrapper library', completed: true },
      { id: 'chk-3', text: 'Deploy to Staging environment for load testing', completed: true },
      { id: 'chk-4', text: 'Update partner validation endpoints', completed: false },
      { id: 'chk-5', text: 'Production canary release (5% traffic)', completed: false }
    ],
    blastRadius: { services: 4, apis: 12, dependentTeams: 3 }
  },
  {
    id: 'TASK-MIG-102',
    title: 'Enable X25519MLKEM768 on Edge Ingress TLS',
    assetId: 'CRYPTO-00092',
    applicationId: 'APP-002',
    applicationName: 'Customer Portal',
    stage: 'testing',
    priority: 'high',
    owner: 'Elena Rostova (NetOps)',
    dueDate: '2026-11-30',
    progressPercent: 85,
    estimatedEffort: '3 weeks',
    currentAlgorithm: 'ECDH P-256',
    targetAlgorithm: 'X25519MLKEM768',
    checklist: [
      { id: 'chk-1', text: 'Update Envoy ingress configs with PQC groups', completed: true },
      { id: 'chk-2', text: 'Test TLS 1.3 handshake compatibility matrix', completed: true },
      { id: 'chk-3', text: 'Monitor MTU packet fragmentation on mobile clients', completed: true },
      { id: 'chk-4', text: 'Roll out to 100% production traffic', completed: false }
    ],
    blastRadius: { services: 8, apis: 28, dependentTeams: 5 }
  },
  {
    id: 'TASK-MIG-103',
    title: 'Replace Identity OAuth Token Signer with ML-DSA-44',
    assetId: 'CRYPTO-00149',
    applicationId: 'APP-003',
    applicationName: 'Identity Service',
    stage: 'assessed',
    priority: 'critical',
    owner: 'Marcus Vance (IAM)',
    dueDate: '2027-02-28',
    progressPercent: 20,
    estimatedEffort: '8 weeks',
    currentAlgorithm: 'ECDSA P-256',
    targetAlgorithm: 'ML-DSA-44',
    checklist: [
      { id: 'chk-1', text: 'Evaluate JWT payload size impact (ML-DSA vs ECDSA)', completed: true },
      { id: 'chk-2', text: 'Design dual JWKS key rotation scheme', completed: false },
      { id: 'chk-3', text: 'Patch downstream SDK verification helpers', completed: false },
      { id: 'chk-4', text: 'Staging verification across 15 client apps', completed: false }
    ],
    blastRadius: { services: 16, apis: 45, dependentTeams: 8 }
  },
  {
    id: 'TASK-MIG-104',
    title: 'Decommission 3DES in Legacy Settlement Batch',
    assetId: 'CRYPTO-00215',
    applicationId: 'APP-006',
    applicationName: 'Settlement Engine',
    stage: 'not_started',
    priority: 'high',
    owner: 'Sarah Jenkins (Core Banking)',
    dueDate: '2027-05-15',
    progressPercent: 0,
    estimatedEffort: '10 weeks',
    currentAlgorithm: '3DES',
    targetAlgorithm: 'AES-256-GCM',
    checklist: [
      { id: 'chk-1', text: 'Audit mainframe file transfer integrations', completed: false },
      { id: 'chk-2', text: 'Coordinate decryption test run with Federal Reserve spool', completed: false },
      { id: 'chk-3', text: 'Cut over batch encryption to AES-256-GCM', completed: false }
    ],
    blastRadius: { services: 2, apis: 3, dependentTeams: 2 }
  },
  {
    id: 'TASK-MIG-105',
    title: 'Verify Post-Quantum Key Encapsulation in Data Gateway',
    assetId: 'CRYPTO-00088',
    applicationId: 'APP-007',
    applicationName: 'Data Exchange Gateway',
    stage: 'completed',
    priority: 'medium',
    owner: 'Devon Lee (Security)',
    dueDate: '2026-09-01',
    progressPercent: 100,
    estimatedEffort: '4 weeks',
    currentAlgorithm: 'RSA-3072',
    targetAlgorithm: 'ML-KEM-768',
    checklist: [
      { id: 'chk-1', text: 'Implement Kyber768/ML-KEM envelope encryption', completed: true },
      { id: 'chk-2', text: 'Run interoperability tests with B2B partner gateways', completed: true },
      { id: 'chk-3', text: 'Sign off security audit & update CBOM', completed: true }
    ],
    blastRadius: { services: 3, apis: 6, dependentTeams: 2 }
  }
];
