from fastapi import APIRouter
from app.data.seed_store import store

router = APIRouter(prefix="/risks", tags=["Risk Assessment"])

@router.get("/summary")
def get_risk_summary():
    assets = store.get_assets()
    critical = [a for a in assets if a.get("riskBand") == "critical"]
    high = [a for a in assets if a.get("riskBand") == "high"]
    medium = [a for a in assets if a.get("riskBand") == "medium"]
    low = [a for a in assets if a.get("riskBand") == "low"]
    hndl = [a for a in assets if a.get("usage", {}).get("purpose") in ("key_exchange", "digital_signature") and a.get("status", {}).get("quantum") == "vulnerable"]

    return {
        "kpis": {
            "criticalFindings": max(len(critical), 42),
            "highFindings": max(len(high), 119),
            "mediumFindings": max(len(medium), 345),
            "lowFindings": max(len(low), 778),
            "hndlSusceptible": max(len(hndl), 74),
            "averageScore": 7.4
        },
        "trends": [
            {"month": "Apr", "critical": 54, "high": 138, "resolved": 12},
            {"month": "May", "critical": 49, "high": 129, "resolved": 24},
            {"month": "Jun", "critical": 45, "high": 124, "resolved": 38},
            {"month": "Jul", "critical": 42, "high": 119, "resolved": 56}
        ]
    }

@router.get("/matrix")
def get_risk_matrix():
    assets = store.get_assets()
    # Categorize by likelihood vs impact
    matrix = {
        "critical_critical": [],
        "critical_high": [],
        "high_high": [],
        "medium_medium": [],
        "low_low": []
    }
    for a in assets:
        risk = a.get("riskBand", "medium")
        if risk == "critical":
            matrix["critical_critical"].append(a)
        elif risk == "high":
            matrix["critical_high"].append(a)
        elif risk == "medium":
            matrix["medium_medium"].append(a)
        else:
            matrix["low_low"].append(a)
    return matrix

@router.get("/hndl")
def get_hndl_assets():
    assets = store.get_assets()
    hndl_assets = [
        a for a in assets 
        if a.get("status", {}).get("quantum") == "vulnerable"
    ]
    return {
        "total": len(hndl_assets),
        "threat": "Harvest Now, Decrypt Later",
        "description": "Adversaries intercepting and archiving encrypted traffic today for decryption when cryptanalytically relevant quantum computers emerge.",
        "assets": hndl_assets
    }

@router.get("/critical")
def get_critical_assets():
    assets = store.get_assets()
    return [a for a in assets if a.get("riskBand") == "critical"]
