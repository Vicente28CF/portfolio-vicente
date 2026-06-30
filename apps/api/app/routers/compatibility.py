import json

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.compatibility_query import CompatibilityQuery
from app.schemas.compatibility import CompatibilityRequest, CompatibilityResponse
from app.services.compatibility import calculate_match
from app.services.skills_service import get_all

router = APIRouter(prefix="/api/compatibility", tags=["Compatibility"])

@router.post("/", response_model=CompatibilityResponse)
async def check_compatibility(
    request: CompatibilityRequest,
    db: AsyncSession = Depends(get_db)
):
    skills_dict = get_all()
    result = calculate_match(request.job_description, skills_dict)
    
    percentage = result["percentage"]
    matched = result["matched"]
    missing = result["missing"]
    
    if percentage >= 80:
        message = "Match muy alto"
    elif percentage >= 50:
        message = "Match moderado"
    else:
        message = "Match bajo"
        
    query_record = CompatibilityQuery(
        job_description=request.job_description,
        match_percentage=percentage,
        matched_skills=json.dumps(matched),
        missing_skills=json.dumps(missing)
    )
    
    db.add(query_record)
    await db.commit()
    
    return CompatibilityResponse(
        match_percentage=percentage,
        matched_skills=matched,
        missing_skills=missing,
        message=message
    )
