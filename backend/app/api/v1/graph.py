from fastapi import APIRouter
from app.data.seed_store import store

router = APIRouter(prefix="/graph", tags=["Topology Graph"])

@router.get("")
def get_graph():
    return store.graph
