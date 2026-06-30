from socket import create_connection

from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

engine = create_async_engine(settings.database_url, echo=settings.app_env == "development")

async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncSession:
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()


async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


def database_is_reachable(timeout: float = 1.0) -> bool:
    url = make_url(settings.database_url)
    host = url.host or "localhost"
    port = url.port or 5432

    try:
        with create_connection((host, port), timeout=timeout):
            return True
    except OSError:
        return False
