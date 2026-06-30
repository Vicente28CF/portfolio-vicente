import pytest
from httpx import AsyncClient
from sqlalchemy import select

from app.database import async_session
from app.models.compatibility_query import CompatibilityQuery

pytestmark = pytest.mark.asyncio(loop_scope="session")

async def test_high_match_when_description_mentions_python_fastapi(client: AsyncClient):
    desc = "Buscamos un desarrollador backend con experiencia en Python, FastAPI y PostgreSQL. Idealmente con conocimientos de Next.js."
    response = await client.post("/api/compatibility/", json={"job_description": desc})
    
    assert response.status_code == 200
    data = response.json()
    assert data["match_percentage"] > 10.0
    assert "Python" in data["matched_skills"]
    assert "FastAPI" in data["matched_skills"]
    assert "PostgreSQL" in data["matched_skills"]


async def test_low_match_when_description_is_unrelated_stack(client: AsyncClient):
    desc = "Buscamos experto en PHP, Laravel, MySQL, jQuery y WordPress. No necesitamos otra cosa."
    response = await client.post("/api/compatibility/", json={"job_description": desc})
    
    assert response.status_code == 200
    data = response.json()
    assert data["match_percentage"] < 50.0


async def test_rejects_description_too_short(client: AsyncClient):
    desc = "hola busco dev"
    response = await client.post("/api/compatibility/", json={"job_description": desc})
    
    assert response.status_code == 422


async def test_persists_query_in_database(client: AsyncClient):
    desc = "Esto es una descripcion de prueba para persistencia en base de datos PostgreSQL."
    response = await client.post("/api/compatibility/", json={"job_description": desc})
    
    assert response.status_code == 200
    
    async with async_session() as session:
        stmt = select(CompatibilityQuery).where(CompatibilityQuery.job_description == desc)
        result = await session.execute(stmt)
        record = result.scalar_one_or_none()
        
        assert record is not None
        assert record.match_percentage == response.json()["match_percentage"]
