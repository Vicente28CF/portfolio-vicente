from datetime import datetime

from sqlalchemy import Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class CompatibilityQuery(Base):
    __tablename__ = "compatibility_queries"

    id: Mapped[int] = mapped_column(primary_key=True)
    job_description: Mapped[str] = mapped_column(Text)
    match_percentage: Mapped[float]
    matched_skills: Mapped[str]
    missing_skills: Mapped[str]
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
