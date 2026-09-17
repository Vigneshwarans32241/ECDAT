/**
 * Mosca Theorem for Quantum Risk:
 * If (Shelf Life X + Migration Time Y) > Threat Horizon Z, then the system is VULNERABLE.
 * Protection Margin = Z - (X + Y)
 */
export function calculateMosca(shelfLifeX, migrationTimeY, threatHorizonZ) {
  const totalRequired = Number(shelfLifeX) + Number(migrationTimeY);
  const margin = Number(threatHorizonZ) - totalRequired;

  let status = 'safe';
  let badgeLabel = 'Protected';
  if (margin < 0) {
    status = 'urgent';
    badgeLabel = 'Quantum Deficit';
  } else if (margin <= 2) {
    status = 'vulnerable';
    badgeLabel = 'Near Deficit';
  }

  return {
    shelfLifeX: Number(shelfLifeX),
    migrationTimeY: Number(migrationTimeY),
    threatHorizonZ: Number(threatHorizonZ),
    totalRequired,
    margin,
    status,
    badgeLabel,
    isHNDLVulnerable: margin < 0,
    recommendation: margin < 0 
      ? `Action required immediately. Protection gap of ${Math.abs(margin)} years.`
      : margin <= 2 
      ? `Tight protection window of ${margin} years remaining. Plan migration now.`
      : `Sufficient runway of ${margin} years under current assumptions.`
  };
}
