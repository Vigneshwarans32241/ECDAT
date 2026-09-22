from fastapi import APIRouter, HTTPException
from typing import List, Optional
from app.data.seed_store import store
from app.models.schemas import MigrationTask, MigrationTaskCreate, MigrationTaskUpdate

router = APIRouter(prefix="/migration", tags=["Migration Engine"])

@router.get("/tasks")
@router.get("/plans")
def list_tasks():
    return store.get_tasks()

@router.post("/tasks", status_code=201)
def create_task(payload: MigrationTaskCreate):
    task_dict = payload.model_dump()
    if not task_dict.get("checklist"):
        task_dict["checklist"] = [
            {"id": "chk-1", "text": "Evaluate PQC algorithm overhead and compatibility", "completed": False},
            {"id": "chk-2", "text": "Implement dual-scheme wrapper or provider", "completed": False},
            {"id": "chk-3", "text": "Run staging regression test suite", "completed": False},
            {"id": "chk-4", "text": "Deploy to production with canary traffic", "completed": False}
        ]
    if not task_dict.get("blastRadius"):
        task_dict["blastRadius"] = {"services": 2, "apis": 4, "dependentTeams": 1}
    if not task_dict.get("dueDate"):
        task_dict["dueDate"] = "2026-12-31"

    new_task = store.add_task(task_dict)
    return new_task

@router.get("/tasks/{task_id}")
def get_task(task_id: str):
    task = store.get_task_by_id(task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    return task

@router.patch("/tasks/{task_id}")
def update_task(task_id: str, payload: MigrationTaskUpdate):
    updates = payload.model_dump(exclude_unset=True)
    updated = store.update_task(task_id, updates)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    return updated

@router.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    deleted = store.delete_task(task_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    return {"message": f"Task {task_id} deleted"}
