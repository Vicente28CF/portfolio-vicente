import pytest


@pytest.mark.asyncio
async def test_response_includes_process_time_header(client):
    response = await client.get("/health")
    assert response.status_code == 200
    assert "X-Process-Time" in response.headers


@pytest.mark.asyncio
async def test_process_time_header_is_numeric(client):
    response = await client.get("/health")
    val = response.headers["X-Process-Time"]
    float(val)


@pytest.mark.asyncio
async def test_response_includes_request_id_header(client):
    response = await client.get("/health")
    assert response.status_code == 200
    assert "X-Request-ID" in response.headers
