from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import database_is_reachable, get_db
from app.schemas.contact import ContactForm, ContactResponse
from app.services.contact_service import submit_contact

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("", response_model=ContactResponse, status_code=201)
async def create_contact(form: ContactForm, db: AsyncSession = Depends(get_db)):
    if not database_is_reachable():
        raise HTTPException(status_code=503, detail="Database not available")

    try:
        return await submit_contact(form, db)
    except ConnectionRefusedError:
        raise HTTPException(status_code=503, detail="Database not available")
    except Exception as exc:
        print(f"[contact] Unexpected error: {exc}")
        raise HTTPException(status_code=500, detail="Internal server error")
