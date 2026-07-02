from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.contact import ContactMessage
from app.schemas.contact import ContactForm, ContactResponse
from app.services.email_service import send_contact_notification


async def submit_contact(form: ContactForm, db: AsyncSession) -> ContactResponse:
    message = ContactMessage(
        name=form.name,
        email=form.email,
        reason=form.reason,
        message=form.message,
    )
    db.add(message)
    await db.commit()
    await db.refresh(message)

    try:
        await send_contact_notification(form.name, form.email, form.reason, form.message)
    except Exception as exc:
        print(f"[contact] Email notification failed: {exc}")

    return ContactResponse(id=str(message.id), status="received")


async def get_all_messages(db: AsyncSession) -> list[ContactMessage]:
    result = await db.execute(select(ContactMessage).order_by(ContactMessage.created_at.desc()))
    return list(result.scalars().all())
