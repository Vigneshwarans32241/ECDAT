from fastapi import APIRouter
from app.data.seed_store import store
from app.models.schemas import MoscaInput, MoscaResult
from app.services.mosca_service import mosca_service

router = APIRouter(prefix="/mosca", tags=["Mosca Theorem Engine"])

@router.get("/assessments")
def get_assessments():
    return store.mosca_assessments

@router.post("/assess", response_model=MoscaResult)
@router.post("/calculate", response_model=MoscaResult)
def assess_mosca(payload: MoscaInput):
    return mosca_service.calculate(
        shelf_life_x=payload.dataShelfLifeYears,
        migration_time_y=payload.migrationTimeYears,
        threat_horizon_z=payload.threatHorizonYears
    )
