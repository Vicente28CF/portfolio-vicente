from pydantic import BaseModel


class GitHubEvent(BaseModel):
    repo: str
    type: str
    created_at: str


class GitHubActivityResponse(BaseModel):
    events: list[GitHubEvent]
    cached: bool
    cache_ttl_seconds: int | None = None
