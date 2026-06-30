import json

import httpx

from app.config import settings
from app.core.redis_client import get_redis

CACHE_KEY = "github:activity"
CACHE_TTL_SECONDS = 600
RELEVANT_EVENT_TYPES = frozenset({"PushEvent", "CreateEvent"})


class GitHubAPIError(Exception):
    pass


def _extract_events(raw_events: list[dict]) -> list[dict]:
    events: list[dict] = []
    for event in raw_events:
        event_type = event.get("type")
        if event_type not in RELEVANT_EVENT_TYPES:
            continue
        events.append(
            {
                "repo": event.get("repo", {}).get("name", "unknown"),
                "type": event_type,
                "created_at": event.get("created_at", ""),
            }
        )
        if len(events) >= 5:
            break
    return events


async def _fetch_github_events() -> list[dict]:
    url = f"https://api.github.com/users/{settings.github_username}/events/public"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                url,
                headers={"Accept": "application/vnd.github+json"},
            )
            if response.status_code == 403:
                raise GitHubAPIError(
                    "GitHub API rate limit exceeded. Try again in a few minutes."
                )
            response.raise_for_status()
            payload = response.json()
            if not isinstance(payload, list):
                raise GitHubAPIError("Unexpected response from GitHub API.")
            return payload
    except httpx.TimeoutException as exc:
        raise GitHubAPIError("GitHub API request timed out. Try again later.") from exc
    except httpx.HTTPStatusError as exc:
        raise GitHubAPIError(
            f"GitHub API returned status {exc.response.status_code}. Try again later."
        ) from exc
    except httpx.HTTPError as exc:
        raise GitHubAPIError("Unable to reach GitHub API. Try again later.") from exc


async def get_github_activity() -> dict:
    redis = get_redis()
    cached_value = await redis.get(CACHE_KEY)

    if cached_value:
        payload = json.loads(cached_value)
        ttl = await redis.ttl(CACHE_KEY)
        return {
            "events": payload["events"],
            "cached": True,
            "cache_ttl_seconds": ttl if ttl > 0 else None,
        }

    raw_events = await _fetch_github_events()
    events = _extract_events(raw_events)
    cache_payload = {"events": events}
    await redis.set(CACHE_KEY, json.dumps(cache_payload), ex=CACHE_TTL_SECONDS)

    return {
        "events": events,
        "cached": False,
        "cache_ttl_seconds": CACHE_TTL_SECONDS,
    }
