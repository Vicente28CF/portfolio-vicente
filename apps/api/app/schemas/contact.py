from pydantic import BaseModel, EmailStr


class ContactForm(BaseModel):
    name: str
    email: EmailStr
    reason: str
    message: str


class ContactResponse(BaseModel):
    id: str
    status: str
