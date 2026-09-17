export const mockGraphData = {
  nodes: [
    { id: 'domain-banking', type: 'domain', data: { label: 'Core Banking & Payments', tier: 1, color: '#1e40af' }, position: { x: 250, y: 50 } },
    { id: 'domain-identity', type: 'domain', data: { label: 'Customer Identity & Access', tier: 1, color: '#4338ca' }, position: { x: 750, y: 50 } },

    { id: 'app-payment-api', type: 'application', data: { label: 'Payment API', appId: 'APP-001', criticality: 'critical', tier: 2 }, position: { x: 150, y: 180 } },
    { id: 'app-settlement', type: 'application', data: { label: 'Settlement Engine', appId: 'APP-006', criticality: 'critical', tier: 2 }, position: { x: 380, y: 180 } },
    { id: 'app-portal', type: 'application', data: { label: 'Customer Portal', appId: 'APP-002', criticality: 'high', tier: 2 }, position: { x: 620, y: 180 } },
    { id: 'app-identity', type: 'application', data: { label: 'Identity Service', appId: 'APP-003', criticality: 'critical', tier: 2 }, position: { x: 880, y: 180 } },

    { id: 'lib-openssl', type: 'library', data: { label: 'OpenSSL 3.0.2', version: '3.0.2', tier: 3 }, position: { x: 180, y: 320 } },
    { id: 'lib-jce', type: 'library', data: { label: 'Java JCE Provider', version: 'OpenJDK 17', tier: 3 }, position: { x: 420, y: 320 } },
    { id: 'lib-boringssl', type: 'library', data: { label: 'BoringSSL Envoy', version: '202305', tier: 3 }, position: { x: 660, y: 320 } },
    { id: 'lib-nimbus', type: 'library', data: { label: 'Nimbus JOSE+JWT', version: '9.3', tier: 3 }, position: { x: 900, y: 320 } },

    { id: 'asset-rsa2048', type: 'cryptoAsset', data: { label: 'RSA-2048 PSS', assetId: 'CRYPTO-00182', quantum: 'vulnerable', risk: 'critical', tier: 4 }, position: { x: 150, y: 460 } },
    { id: 'asset-aes256', type: 'cryptoAsset', data: { label: 'AES-256-GCM', assetId: 'CRYPTO-00204', quantum: 'safe', risk: 'low', tier: 4 }, position: { x: 380, y: 460 } },
    { id: 'asset-ecdh', type: 'cryptoAsset', data: { label: 'ECDH P-256', assetId: 'CRYPTO-00092', quantum: 'vulnerable', risk: 'high', tier: 4 }, position: { x: 640, y: 460 } },
    { id: 'asset-ecdsa', type: 'cryptoAsset', data: { label: 'ECDSA P-256', assetId: 'CRYPTO-00149', quantum: 'vulnerable', risk: 'critical', tier: 4 }, position: { x: 880, y: 460 } },
    { id: 'asset-pqc-mlkem', type: 'cryptoAsset', data: { label: 'ML-KEM-768 (PQC)', assetId: 'CRYPTO-00088', quantum: 'pqc_native', risk: 'low', tier: 4 }, position: { x: 1100, y: 460 } }
  ],
  edges: [
    { id: 'e1', source: 'domain-banking', target: 'app-payment-api', animated: true },
    { id: 'e2', source: 'domain-banking', target: 'app-settlement' },
    { id: 'e3', source: 'domain-identity', target: 'app-portal' },
    { id: 'e4', source: 'domain-identity', target: 'app-identity', animated: true },

    { id: 'e5', source: 'app-payment-api', target: 'lib-openssl' },
    { id: 'e6', source: 'app-settlement', target: 'lib-jce' },
    { id: 'e7', source: 'app-portal', target: 'lib-boringssl' },
    { id: 'e8', source: 'app-identity', target: 'lib-nimbus' },

    { id: 'e9', source: 'lib-openssl', target: 'asset-rsa2048', style: { stroke: '#dc2626', strokeWidth: 2 } },
    { id: 'e10', source: 'lib-jce', target: 'asset-aes256', style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e11', source: 'lib-boringssl', target: 'asset-ecdh', style: { stroke: '#f59e0b', strokeWidth: 2 } },
    { id: 'e12', source: 'lib-nimbus', target: 'asset-ecdsa', style: { stroke: '#dc2626', strokeWidth: 2 } },
    { id: 'e13', source: 'lib-boringssl', target: 'asset-pqc-mlkem', style: { stroke: '#06b6d4', strokeWidth: 2 } }
  ]
};
