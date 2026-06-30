export interface CaseStudy {
  problem: string;
  solution: string;
  result: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline?: string;
  description: string;
  stack: string[];
  github?: string;
  live?: string;
  image_url?: string;
  featured?: boolean;
  status?: string;
  status_note?: string | null;
  case_study?: CaseStudy;
}

export interface ProjectDetail extends Project {
  long_description: string;
  screenshots: string[];
  highlights: string[];
}

export interface Skill {
  name: string;
  level: "beginner" | "intermediate" | "advanced";
}

export type SkillCategory = "frontend" | "backend" | "devops" | "tools";

export type SkillsMap = Record<SkillCategory, Skill[]>;

export interface ContactForm {
  name: string;
  email: string;
  reason: string;
  message: string;
}

export interface ContactResponse {
  id: string;
  status: string;
}

export interface PingResponse {
  echo: string;
  timestamp: string;
  processed_by: string;
}

export interface GitHubEvent {
  repo: string;
  type: string;
  created_at: string;
}

export interface GitHubActivityResponse {
  events: GitHubEvent[];
  cached: boolean;
  cache_ttl_seconds: number | null;
}
