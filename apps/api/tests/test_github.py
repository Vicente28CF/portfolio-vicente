from unittest.mock import AsyncMock, MagicMock, patch

import httpx
import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio(loop_scope="session")

SAMPLE_GITHUB_EVENTS = [
    {
        "type": "PushEvent",
        "repo": {"name": "Vicente28CF/portfolio"},
        "created_at": "2024-06-01T10:00:00Z",
    },
    {
        "type": "WatchEvent",
        "repo": {"name": "Vicente28CF/other"},
        "created_at": "2024-06-01T09:00:00Z",
    },
    {
        "type": "CreateEvent",
        "repo": {"name": "Vicente28CF/new-repo"},
        "created_at": "2024-06-01T08:00:00Z",
    },
]


class FakeRedis:
    def __init__(self) -> None:
        self._store: dict[str, str] = {}
        self._ttl: dict[str, int] = {}

    async def get(self, key: str) -> str | None:
        return self._store.get(key)

    async def set(self, key: str, value: str, ex: int | None = None) -> None:
        self._store[key] = value
        if ex is not None:
            self._ttl[key] = ex

    async def ttl(self, key: str) -> int:
        if key not in self._store:
            return -2
        return self._ttl.get(key, 600)


@pytest.fixture
def fake_redis(monkeypatch):
    redis = FakeRedis()
    monkeypatch.setattr("app.services.github_stats.get_redis", lambda: redis)
    return redis


def _mock_github_client(events: list[dict] | None = None, side_effect=None):
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.raise_for_status = MagicMock()
    mock_response.json.return_value = events if events is not None else SAMPLE_GITHUB_EVENTS

    mock_get = AsyncMock(return_value=mock_response)
    if side_effect is not None:
        mock_get = AsyncMock(side_effect=side_effect)

    mock_client = AsyncMock()
    mock_client.__aenter__.return_value.get = mock_get
    mock_client.__aexit__ = AsyncMock(return_value=None)
    return mock_client, mock_get


async def test_returns_cached_true_on_second_call(client: AsyncClient, fake_redis):
    mock_client, mock_get = _mock_github_client()

    with patch("app.services.github_stats.httpx.AsyncClient", return_value=mock_client):
        first = await client.get("/api/github/activity")
        second = await client.get("/api/github/activity")

    assert first.status_code == 200
    first_data = first.json()
    assert first_data["cached"] is False
    assert len(first_data["events"]) == 2
    assert first_data["events"][0]["type"] == "PushEvent"

    assert second.status_code == 200
    second_data = second.json()
    assert second_data["cached"] is True
    assert second_data["cache_ttl_seconds"] is not None
    assert mock_get.await_count == 1


async def test_handles_github_api_failure_gracefully(client: AsyncClient, fake_redis):
    mock_client, _ = _mock_github_client(side_effect=httpx.TimeoutException("timeout"))

    with patch("app.services.github_stats.httpx.AsyncClient", return_value=mock_client):
        response = await client.get("/api/github/activity")

    assert response.status_code == 503
    assert "timed out" in response.json()["detail"].lower()
