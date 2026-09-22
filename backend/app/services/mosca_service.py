from typing import Dict, Any

class MoscaCalculator:
    @staticmethod
    def calculate(shelf_life_x: float, migration_time_y: float, threat_horizon_z: float) -> Dict[str, Any]:
        total_required = shelf_life_x + migration_time_y
        margin = threat_horizon_z - total_required
        deficit_years = abs(margin) if margin < 0 else 0.0

        if margin < 0:
            status = "urgent"
            condition = "X + Y > Z (Quantum Deficit)"
            recommendation = f"Immediate action required. Protection gap of {abs(margin):.1f} years against Harvest Now, Decrypt Later (HNDL)."
        elif margin <= 2.0:
            status = "vulnerable"
            condition = "X + Y ~ Z (Near Deficit)"
            recommendation = f"Tight protection window of {margin:.1f} years remaining. Begin migration planning immediately."
        else:
            status = "safe"
            condition = "X + Y <= Z (Protected)"
            recommendation = f"Sufficient runway of {margin:.1f} years under current assumptions. Monitor NIST PQC transition."

        return {
            "dataShelfLifeYears": shelf_life_x,
            "migrationTimeYears": migration_time_y,
            "threatHorizonYears": threat_horizon_z,
            "totalExposureYears": total_required,
            "deficitYears": round(deficit_years, 2),
            "isUrgent": margin < 0,
            "status": status,
            "condition": condition,
            "recommendation": recommendation
        }

mosca_service = MoscaCalculator()
