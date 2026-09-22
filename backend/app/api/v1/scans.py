from fastapi import APIRouter, HTTPException
from typing import Optional, Dict, Any
import datetime
from app.data.seed_store import store
from app.models.schemas import ScanInput
from app.services.analyzer import analyzer

router = APIRouter(prefix="/scans", tags=["Scans"])

@router.get("")
def list_scans():
    return store.get_scans()

@router.post("")
def create_scan(payload: ScanInput):
    scan_id = f"SCAN-{len(store.scans) + 1:04d}"
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    target_name = payload.target.get("uri", "Repository Source") if payload.target else "Source Code"
    
    findings = []
    if payload.snippet:
        findings = analyzer.analyze_snippet(payload.snippet)

    new_scan = {
        "id": scan_id,
        "name": f"Automated Scan - {scan_id}",
        "target": target_name,
        "type": payload.targetType,
        "status": "completed",
        "startedAt": now,
        "finishedAt": now,
        "duration": "4.2s",
        "stats": {
            "totalFiles": 128 if not payload.snippet else 1,
            "cryptoAssetsFound": len(findings) if findings else 6,
            "vulnerabilities": len([f for f in findings if f["severity"] in ("critical", "high")]),
            "newFindings": len(findings) if findings else 2
        },
        "findings": findings
    }
    return store.add_scan(new_scan)

@router.get("/{scan_id}")
def get_scan(scan_id: str):
    for s in store.get_scans():
        if s.get("id") == scan_id:
            return s
    raise HTTPException(status_code=404, detail=f"Scan {scan_id} not found")

@router.post("/analyze")
def analyze_code(payload: Dict[str, Any]):
    code_text = payload.get("code", "")
    filename = payload.get("filename", "input.py")
    findings = analyzer.analyze_snippet(code_text, filename=filename)
    return {
        "filename": filename,
        "findingsCount": len(findings),
        "findings": findings
    }
