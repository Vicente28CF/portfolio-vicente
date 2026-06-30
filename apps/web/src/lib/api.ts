import type {
  ContactForm,
  ContactResponse,
  GitHubActivityResponse,
  PingResponse,
  Project,
  SkillsMap,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export function getProjects(): Promise<Project[]> {
  return fetchJson("/projects");
}

export function getProject(slug: string): Promise<Project> {
  return fetchJson(`/projects/${slug}`);
}

export function getSkills(): Promise<SkillsMap> {
  return fetchJson("/skills");
}

export function postContact(data: ContactForm): Promise<ContactResponse> {
  return fetchJson("/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function pingDemo(msg?: string): Promise<PingResponse> {
  const params = msg ? `?msg=${encodeURIComponent(msg)}` : "";
  return fetchJson(`/demo/ping${params}`);
}

export function postCompatibilityCheck(text: string): Promise<any> {
  return fetchJson("/api/compatibility/", {
    method: "POST",
    body: JSON.stringify({ job_description: text }),
  });
}

export const api = {
  github: {
    activity(): Promise<GitHubActivityResponse> {
      return fetchJson("/api/github/activity");
    },
  },
};
