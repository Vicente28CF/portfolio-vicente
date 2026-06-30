import pytest


@pytest.mark.asyncio
async def test_list_projects_returns_200(client):
    response = await client.get("/projects")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0


@pytest.mark.asyncio
async def test_get_existing_project_returns_required_fields(client):
    response = await client.get("/projects/lotex")
    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == "lotex"
    assert "title" in data
    assert "description" in data
    assert "stack" in data


@pytest.mark.asyncio
async def test_get_nonexistent_project_returns_404(client):
    response = await client.get("/projects/noexiste")
    assert response.status_code == 404
