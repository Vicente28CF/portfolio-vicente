import json
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
SKILLS_FILE = DATA_DIR / "skills.json"


def get_all() -> dict:
    with open(SKILLS_FILE) as f:
        return json.load(f)
