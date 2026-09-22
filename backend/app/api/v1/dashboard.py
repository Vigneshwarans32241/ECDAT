from fastapi import APIRouter
from app.data.seed_store import store

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary")
def get_dashboard_summary():
    return store.get_dashboard_summary()
