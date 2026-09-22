from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from app.data.seed_store import store
from app.models.schemas import CryptoAsset, CryptoAssetCreate, CryptoAssetUpdate, AssetListResponse
from app.services.cbom_service import cbom_service

router = APIRouter(prefix="/assets", tags=["Cryptographic Assets"])

@router.get("", response_model=AssetListResponse)
def list_assets(
    search: Optional[str] = None,
    riskBand: Optional[str] = None,
    quantum: Optional[str] = None,
    application: Optional[str] = None,
    purpose: Optional[str] = None,
    page: int = Query(1, ge=1),
    pageSize: int = Query(50, ge=1, le=200)
):
    all_assets = store.get_assets(
        search=search,
        risk_band=riskBand,
        quantum=quantum,
        application=application,
        purpose=purpose
    )
    total = len(all_assets)
    start = (page - 1) * pageSize
    end = start + pageSize
    page_items = all_assets[start:end]
    return {
        "items": page_items,
        "page": page,
        "pageSize": pageSize,
        "total": total
    }

@router.get("/export/cbom")
def export_cbom():
    all_assets = store.get_assets()
    return cbom_service.generate_cyclonedx_cbom(all_assets)

@router.get("/{asset_id}")
def get_asset(asset_id: str):
    asset = store.get_asset_by_id(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail=f"Asset {asset_id} not found")
    return asset

@router.post("", status_code=201)
def create_asset(payload: CryptoAssetCreate):
    new_asset = store.add_asset(payload.model_dump())
    return new_asset

@router.put("/{asset_id}")
def update_asset(asset_id: str, payload: CryptoAssetUpdate):
    updated = store.update_asset(asset_id, payload.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail=f"Asset {asset_id} not found")
    return updated

@router.delete("/{asset_id}")
def delete_asset(asset_id: str):
    deleted = store.delete_asset(asset_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Asset {asset_id} not found")
    return {"message": f"Asset {asset_id} successfully removed"}
