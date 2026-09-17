export const mockMoscaAssessments = [
  {
    applicationId: 'APP-001',
    applicationName: 'Payment API',
    assetId: 'CRYPTO-00182',
    shelfLifeX: 10,
    migrationTimeY: 3,
    threatHorizonZ: 8,
    margin: -5,
    status: 'urgent',
    hndlVulnerable: true,
    dataCategory: 'Financial Records & Cardholder Data',
    narrative: 'Migration should have begun 5 years ago. Stored transaction logs remain exposed to Harvest Now Decrypt Later.'
  },
  {
    applicationId: 'APP-003',
    applicationName: 'Identity Service',
    assetId: 'CRYPTO-00149',
    shelfLifeX: 5,
    migrationTimeY: 2,
    threatHorizonZ: 8,
    margin: 1,
    status: 'vulnerable',
    hndlVulnerable: true,
    dataCategory: 'Identity Claims & Credentials',
    narrative: 'Tight positive margin of 1 year. Any delay in token signer migration will cause quantum exposure.'
  },
  {
    applicationId: 'APP-002',
    applicationName: 'Customer Portal',
    assetId: 'CRYPTO-00092',
    shelfLifeX: 7,
    migrationTimeY: 2,
    threatHorizonZ: 8,
    margin: -1,
    status: 'urgent',
    hndlVulnerable: true,
    dataCategory: 'Customer Communications & PII',
    narrative: 'Passive interceptors can capture current TLS sessions and decrypt when quantum compute reaches capacity.'
  },
  {
    applicationId: 'APP-006',
    applicationName: 'Settlement Engine',
    assetId: 'CRYPTO-00204',
    shelfLifeX: 15,
    migrationTimeY: 1,
    threatHorizonZ: 8,
    margin: 4,
    status: 'safe',
    hndlVulnerable: false,
    dataCategory: 'Interbank Settlement Audit Ledger',
    narrative: 'Protected by 256-bit symmetric strength, well within post-quantum safety threshold.'
  }
];
