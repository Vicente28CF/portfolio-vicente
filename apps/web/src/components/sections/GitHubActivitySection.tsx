"use client";

import { useQuery } from "@tanstack/react-query";
import { FolderPlus, GitCommitHorizontal } from "lucide-react";
import { api } from "@/lib/api";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import Reveal from "@/components/ui/Reveal";
import type { GitHubEvent } from "@/types";

function eventIcon(type: string) {
  if (type === "CreateEvent") {
    return <FolderPlus className="h-4 w-4 text-infra shrink-0" aria-hidden />;
  }
  return <GitCommitHorizontal className="h-4 w-4 text-ok shrink-0" aria-hidden />;
}

function eventLabel(type: string) {
  if (type === "CreateEvent") {
    return "repo creado";
  }
  if (type === "PushEvent") {
    return "push";
  }
  return type;
}

function formatEventTime(isoDate: string) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }
  return date.toLocaleString("es-CL", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EventLine({ event }: { event: GitHubEvent }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-border/50 last:border-b-0">
      {eventIcon(event.type)}
      <div className="min-w-0 flex-1 font-mono text-xs leading-relaxed">
        <span className="text-muted">[{formatEventTime(event.created_at)}]</span>{" "}
        <span className="text-signal">{eventLabel(event.type)}</span>{" "}
        <span className="text-text break-all">{event.repo}</span>
      </div>
    </div>
  );
}

export default function GitHubActivitySection() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["github-activity"],
    queryFn: api.github.activity,
  });

  return (
    <section id="github-activity" className="px-6 py-16 md:py-24 max-w-3xl mx-auto border-t border-border">
      <Reveal>
        <div>
          <div className="flex items-center gap-3 mb-4">
            <SectionEyebrow command="git log --oneline -5" />
            {data && (
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-mono uppercase tracking-wide ${
                  data.cached
                    ? "bg-surface border border-border text-muted"
                    : "bg-ok/10 border border-ok/30 text-ok"
                }`}
              >
                {data.cached ? "cacheado" : "en vivo"}
              </span>
            )}
          </div>

          <h2 className="text-2xl font-bold text-text mb-4">Actividad reciente en GitHub</h2>
          <p className="text-muted text-sm mb-6">
            Últimos pushes y repos creados, obtenidos desde la API de GitHub y cacheados en Redis
            para respetar rate limits.
          </p>

          {isPending && <p className="text-muted text-sm font-mono">$ fetching events...</p>}

          {isError && (
            <p className="text-red-400 text-sm font-mono">
              Error al cargar actividad: {error.message}
            </p>
          )}

          {data && (
            <div className="rounded-lg border border-ok/30 bg-bg p-4 font-mono text-sm">
              <p className="text-muted text-xs mb-3">
                $ tail -n {data.events.length} ~/github/events.log
                {data.cache_ttl_seconds != null && data.cached && (
                  <span className="ml-2 text-muted/70">ttl={data.cache_ttl_seconds}s</span>
                )}
              </p>

              {data.events.length === 0 ? (
                <p className="text-muted text-xs">No hay eventos recientes de push o creación.</p>
              ) : (
                <div>
                  {data.events.map((event) => (
                    <EventLine key={`${event.type}-${event.repo}-${event.created_at}`} event={event} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
