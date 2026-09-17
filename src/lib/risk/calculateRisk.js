import { getRiskBand } from './getRiskBand';
import { getQuantumWeight } from './quantumMapping';

export function calculateRisk(asset) {
  const quantumScore = getQuantumWeight(asset.status?.quantum);
  const isInternetFacing = asset.context?.internetFacing || asset.classification?.internetFacing ? 85 : 30;
  const isCritical = asset.classification?.businessCriticality === 'critical' ? 90 :
                     asset.classification?.businessCriticality === 'high' ? 70 : 40;
  
  // Weighted formula from Technical Blueprint:
  // 35% Quantum Vulnerability + 25% Criticality + 20% Exposure + 20% Algorithm legacy
  const legacyAlgoScore = (asset.algorithm?.family === 'RSA' || asset.algorithm?.family === 'ECC') ? 80 : 30;
  const overall = Math.round(
    quantumScore * 0.35 +
    isCritical * 0.25 +
    isInternetFacing * 0.20 +
    legacyAlgoScore * 0.20
  );

  return {
    overallScore: overall,
    riskBand: getRiskBand(overall),
    factors: {
      quantumVulnerability: quantumScore,
      businessCriticality: isCritical,
      exposureEnvironment: isInternetFacing,
      algorithmLegacy: legacyAlgoScore
    }
  };
}
