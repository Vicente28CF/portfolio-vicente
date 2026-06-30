from fastapi import APIRouter, HTTPException

from app.schemas.github import GitHubActivityResponse
from app.services.github_stats import GitHubAPIError, get_github_activity

router = APIRouter(prefix="/api/github", tags=["github"])


@router.get("/activity", response_model=GitHubActivityResponse)
async def github_activity():
    try:
        return await get_github_activity()
    except GitHubAPIError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
