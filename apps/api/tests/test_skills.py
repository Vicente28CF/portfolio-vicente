import pytest


@pytest.mark.asyncio
async def test_list_skills_returns_categories(client):
    response = await client.get("/skills")
    assert response.status_code == 200
    data = response.json()
    for category in ("frontend", "backend", "devops", "tools"):
        assert category in data
        assert isinstance(data[category], list)
