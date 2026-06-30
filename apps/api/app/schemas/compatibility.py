from pydantic import BaseModel, Field

class CompatibilityRequest(BaseModel):
    job_description: str = Field(min_length=20, max_length=5000)

class CompatibilityResponse(BaseModel):
    match_percentage: float
    matched_skills: list[str]
    missing_skills: list[str]
    message: str
