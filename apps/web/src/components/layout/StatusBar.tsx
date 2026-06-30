"use client";

import { useEffect, useState } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";

function useHealth() {
  const [status, setStatus] = useState<"online" | "offline">("online");

  useEffect(() => {
    let mounted = true;
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    async function check() {
      try {
        const res = await fetch(`${base}/health`);
        if (mounted) setStatus(res.ok ? "online" : "offline");
      } catch {
        if (mounted) setStatus("offline");
      }
    }

    check();
    const id = setInterval(check, 30000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return status;
}

function useClock() {
  const [time, setTime] = useState(() =>
    new Intl.DateTimeFormat("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Mexico_City",
      hour12: false,
    }).format(new Date()),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTime(
        new Intl.DateTimeFormat("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Mexico_City",
          hour12: false,
        }).format(new Date()),
      );
    }, 60000);
    return () => clearInterval(id);
  }, []);

  return time;
}

function formatSection(id: string): string {
  const map: Record<string, string> = {
    hero: "INICIO",
    stack: "STACK",
    "github-activity": "GITHUB",
    servicios: "SERVICIOS",
    projects: "PROYECTOS",
    compatibilidad: "MATCH",
    demo: "LIVE DEMO",
    contact: "CONTACTO",
  };
  return map[id] || id.toUpperCase();
}

export default function StatusBar() {
  const status = useHealth();
  const time = useClock();
  const sectionId = useActiveSection();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-9 bg-surface border-t border-border font-mono text-caption flex items-center px-3 gap-1.5 select-none">
      <span
        className={`inline-flex items-center gap-1.5 ${
          status === "online" ? "text-ok" : "text-red-400"
        }`}
      >
        <span
          className={`inline-block w-2 h-2 rounded-full ${
            status === "online" ? "bg-ok" : "bg-red-400"
          }`}
          aria-hidden
        />
        {status}
      </span>

      <span className="text-muted" aria-hidden>
        ·
      </span>

      <span className="text-muted hidden min-[480px]:inline">vicenteflores.dev</span>

      <span className="text-muted hidden min-[480px]:inline" aria-hidden>
        ·
      </span>

      <span className="text-muted">
        -- <span className="text-text font-semibold uppercase tracking-wider">{formatSection(sectionId)}</span> --
      </span>

      <span className="text-muted" aria-hidden>
        ·
      </span>

      <span className="text-muted ml-auto">{time} GMT-6</span>
    </div>
  );
}
