"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useAudience } from "@/lib/audience-context";
import { useActiveSection } from "@/hooks/useActiveSection";

const baseLinks = [
  { id: "hero", label: "Inicio", href: "#hero" },
  { id: "stack", label: "Stack", href: "#stack" },
  { id: "servicios", label: "Servicios", href: "#servicios" },
  { id: "projects", label: "Proyectos", href: "#projects" },
  { id: "demo", href: "#demo" },
  { id: "contact", label: "Contacto", href: "#contact" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { audience, setAudience } = useAudience();
  const activeSection = useActiveSection();

  const links = baseLinks.map((l) =>
    l.id === "demo"
      ? { ...l, label: audience === "recruiter" ? "Demo técnica" : "Demo divertida" }
      : l,
  );

  const visibleLinks = links.filter(
    (l) => l.id !== "servicios" || audience === "client",
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center px-4 h-12">
        <a
          href="#hero"
          className="font-mono text-sm text-signal font-semibold whitespace-nowrap mr-6 shrink-0"
        >
          &gt; Vicente28CF
        </a>

        <div className="hidden md:flex items-center gap-0 flex-1 min-w-0">
          {visibleLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "px-3 py-2 text-xs font-mono rounded-t-md transition-colors duration-150 border-b-2",
                  isActive
                    ? "bg-surface border-signal text-signal"
                    : "border-transparent text-muted hover:text-text hover:bg-surface/50",
                )}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        <div className="hidden md:flex items-center ml-auto shrink-0">
          <div className="flex bg-surface border border-border rounded-full p-0.5">
            <button
              onClick={() => setAudience("recruiter")}
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors duration-150",
                audience === "recruiter"
                  ? "bg-signal text-bg"
                  : "text-muted hover:text-text",
              )}
            >
              Busco talento
            </button>
            <button
              onClick={() => setAudience("client")}
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors duration-150",
                audience === "client"
                  ? "bg-violet text-bg"
                  : "text-muted hover:text-text",
              )}
            >
              Necesito proyecto
            </button>
          </div>
        </div>

        <button
          className="md:hidden ml-auto text-muted hover:text-text transition p-1"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-surface border-b border-border px-4 pb-4">
          <div className="flex bg-bg border border-border rounded-full p-0.5 mb-3 w-fit">
            <button
              onClick={() => setAudience("recruiter")}
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors duration-150",
                audience === "recruiter"
                  ? "bg-signal text-bg"
                  : "text-muted hover:text-text",
              )}
            >
              Busco talento
            </button>
            <button
              onClick={() => setAudience("client")}
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors duration-150",
                audience === "client"
                  ? "bg-violet text-bg"
                  : "text-muted hover:text-text",
              )}
            >
              Necesito proyecto
            </button>
          </div>

          <div className="flex flex-col gap-0.5">
            {visibleLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-3 py-2 text-xs font-mono rounded-md transition-colors duration-150 border-l-2",
                    isActive
                      ? "bg-surface border-signal text-signal"
                      : "border-transparent text-muted hover:text-text hover:bg-surface/50",
                  )}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
