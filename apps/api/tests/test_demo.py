import pytest


@pytest.mark.asyncio
async def test_ping_with_message_echos(client):
    response = await client.get("/demo/ping", params={"msg": "hola"})
    assert response.status_code == 200
    data = response.json()
    assert data["echo"] == "hola"
    assert data["processed_by"] == "FastAPI"


@pytest.mark.asyncio
async def test_ping_without_message_uses_default(client):
    response = await client.get("/demo/ping")
    assert response.status_code == 200
    data = response.json()
    assert data["echo"] == "pong"
