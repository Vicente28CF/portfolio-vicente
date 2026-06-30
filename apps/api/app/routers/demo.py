from datetime import datetime, timezone

from fastapi import APIRouter, Query

router = APIRouter(prefix="/demo", tags=["demo"])


@router.get("/ping")
async def ping(msg: str = Query("pong", description="Mensaje para el echo")):
    return {
        "echo": msg,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "processed_by": "FastAPI",
    }
