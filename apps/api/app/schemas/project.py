from pydantic import BaseModel


class CaseStudy(BaseModel):
    problem: str
    solution: str
    result: str


class Project(BaseModel):
    slug: str
    title: str
    tagline: str | None = None
    description: str
    stack: list[str] = []
    tech_stack: dict[str, list[str]] | None = None
    github: str | None = None
    github_url: str | None = None
    live: str | None = None
    url: str | None = None
    image_url: str | None = None
    featured: bool = False
    status: str | None = None
    status_note: str | None = None
    screenshots: list[str] = []
    highlights: list[str] = []
    case_study: CaseStudy | None = None


class ProjectDetail(Project):
    long_description: str
