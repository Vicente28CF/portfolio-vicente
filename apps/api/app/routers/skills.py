from fastapi import APIRouter

from app.services import skills_service

router = APIRouter(prefix="/skills", tags=["skills"])


@router.get("")
async def list_skills():
    return skills_service.get_all()
