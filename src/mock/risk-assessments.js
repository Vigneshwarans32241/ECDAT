export const mockRiskAssessments = [
  {
    assetId: 'CRYPTO-00182',
    overallScore: 88,
    riskBand: 'critical',
    factors: {
      algorithmStrength: 75,
      quantumVulnerability: 95,
      businessCriticality: 90,
      exposureEnvironment: 85,
      hndlExposure: 90,
      migrationComplexity: 70
    },
    drivers: [
      'Vulnerable to Shor algorithm factoring within estimated 2030 horizon',
      'Transaction signing in critical internet-facing Payment API',
      'Harvest-Now-Decrypt-Later risk on stored financial audit logs'
    ],
    recommendedAction: 'Transition to dual-scheme ML-DSA (Dilithium) hybrid signature'
  },
  {
    assetId: 'CRYPTO-00149',
    overallScore: 82,
    riskBand: 'critical',
    factors: {
      algorithmStrength: 70,
      quantumVulnerability: 95,
      businessCriticality: 85,
      exposureEnvironment: 80,
      hndlExposure: 75,
      migrationComplexity: 65
    },
    drivers: [
      'Elliptic curve discrete log breakable by Shor algorithm',
      'Federated OAuth tokens vulnerable to forgery post-CRQC',
      'Tokens grant system-wide privilege elevation'
    ],
    recommendedAction: 'Migrate token issuer to ML-DSA-44 or SLH-DSA'
  },
  {
    assetId: 'CRYPTO-00092',
    overallScore: 68,
    riskBand: 'high',
    factors: {
      algorithmStrength: 65,
      quantumVulnerability: 90,
      businessCriticality: 75,
      exposureEnvironment: 85,
      hndlExposure: 85,
      migrationComplexity: 45
    },
    drivers: [
      'TLS session key exchange susceptible to passive eavesdropping and recording',
      'Customer traffic can be retroactively decrypted upon CRQC availability'
    ],
    recommendedAction: 'Enable X25519MLKEM768 hybrid key encapsulation in ingress TLS'
  },
  {
    assetId: 'CRYPTO-00204',
    overallScore: 22,
    riskBand: 'low',
    factors: {
      algorithmStrength: 15,
      quantumVulnerability: 20,
      businessCriticality: 80,
      exposureEnvironment: 10,
      hndlExposure: 15,
      migrationComplexity: 25
    },
    drivers: [
      'AES-256 retains 128-bit quantum security against Grover algorithm',
      'Internal ledger service, no direct internet exposure'
    ],
    recommendedAction: 'Maintain current AES-256-GCM; ensure adequate IV uniqueness'
  }
];
