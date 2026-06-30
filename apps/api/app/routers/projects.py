from fastapi import APIRouter, HTTPException

from app.schemas.project import Project, ProjectDetail
from app.services import projects_service

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=list[Project])
async def list_projects():
    return projects_service.get_all()


@router.get("/{slug}", response_model=ProjectDetail)
async def get_project(slug: str):
    project = projects_service.get_by_slug(slug)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
