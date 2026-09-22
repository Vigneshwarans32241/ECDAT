from typing import List, Dict, Any
import datetime
import uuid

class CBOMService:
    @staticmethod
    def generate_cyclonedx_cbom(assets: List[Dict[str, Any]]) -> Dict[str, Any]:
        serial_number = f"urn:uuid:{uuid.uuid4()}"
        timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()

        components = []
        for asset in assets:
            algo = asset.get("algorithm", {})
            ctx = asset.get("context", {})
            status = asset.get("status", {})
            usage = asset.get("usage", {})
            classification = asset.get("classification", {})

            component = {
                "bom-ref": asset.get("id"),
                "type": "cryptographic-asset",
                "name": algo.get("name", "Unknown Algorithm"),
                "version": str(algo.get("keySize", "")) if algo.get("keySize") else "n/a",
                "cryptoProperties": {
                    "assetType": asset.get("assetType", "algorithm"),
                    "algorithmProperties": {
                        "primitive": algo.get("family", "asymmetric"),
                        "parameterSetIdentifier": algo.get("name"),
                        "curve": algo.get("variant") if algo.get("family") == "ECC" else None,
                        "executionEnvironment": "software-plain"
                    }
                },
                "properties": [
                    {"name": "x-ecdat-confidence", "value": str(asset.get("confidence", 0.95))},
                    {"name": "x-ecdat-quantum-status", "value": status.get("quantum", "vulnerable")},
                    {"name": "x-ecdat-risk-band", "value": asset.get("riskBand", "medium")},
                    {"name": "x-ecdat-application", "value": ctx.get("applicationName", "Unknown")},
                    {"name": "x-ecdat-purpose", "value": usage.get("purpose", "general")},
                    {"name": "x-ecdat-data-sensitivity", "value": classification.get("dataSensitivity", "medium")},
                    {"name": "x-ecdat-migration-status", "value": asset.get("migrationStatus", "not_started")}
                ]
            }
            components.append(component)

        return {
            "bomFormat": "CycloneDX",
            "specVersion": "1.6",
            "serialNumber": serial_number,
            "version": 1,
            "metadata": {
                "timestamp": timestamp,
                "tools": [
                    {
                        "vendor": "ECDAT",
                        "name": "Enterprise Cryptographic Discovery & Assessment Tool",
                        "version": "1.0.0"
                    }
                ]
            },
            "components": components
        }

cbom_service = CBOMService()
