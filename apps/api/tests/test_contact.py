from unittest.mock import AsyncMock

import pytest

from app.schemas.contact import ContactResponse


@pytest.mark.asyncio
async def test_submit_valid_contact_returns_201(client, monkeypatch):
    mock_submit = AsyncMock(return_value=ContactResponse(id="1", status="received"))
    monkeypatch.setattr("app.routers.contact.submit_contact", mock_submit)

    payload = {"name": "Test", "email": "test@example.com", "message": "Hola"}
    response = await client.post("/contact", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "received"
    assert "id" in data


@pytest.mark.asyncio
async def test_submit_contact_without_email_returns_422(client):
    payload = {"name": "Test", "message": "Hola"}
    response = await client.post("/contact", json=payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_submit_contact_with_invalid_email_returns_422(client):
    payload = {"name": "Test", "email": "invalido", "message": "Hola"}
    response = await client.post("/contact", json=payload)
    assert response.status_code == 422
