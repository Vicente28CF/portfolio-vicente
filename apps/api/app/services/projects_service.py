import json
from pathlib import Path

from app.schemas.project import Project, ProjectDetail

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
PROJECTS_FILE = DATA_DIR / "projects.json"


def _normalize(raw: dict) -> dict:
    if not raw.get("stack") and raw.get("tech_stack"):
        flattened = []
        for _, techs in raw["tech_stack"].items():
            flattened.extend(techs)
        raw["stack"] = flattened

    if not raw.get("live") and raw.get("url"):
        raw["live"] = raw["url"]

    if not raw.get("github") and raw.get("github_url"):
        raw["github"] = raw["github_url"]

    return raw


def _load_projects() -> list[dict]:
    with open(PROJECTS_FILE, encoding="utf-8") as f:
        return json.load(f)


def get_all() -> list[Project]:
    return [Project(**_normalize(p)) for p in _load_projects()]


def get_by_slug(slug: str) -> ProjectDetail | None:
    for p in _load_projects():
        if p["slug"] == slug:
            return ProjectDetail(**_normalize(p))
    return None
