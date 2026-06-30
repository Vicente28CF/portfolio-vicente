"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, MapPin } from "lucide-react";
import { useAudience } from "@/lib/audience-context";
import Reveal from "@/components/ui/Reveal";

function GithubIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={props.size || 20} height={props.size || 20}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={props.size || 20} height={props.size || 20}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TypingEyebrow() {
  const text = "<Vicente Flores />";
  const [displayed, setDisplayed] = useState("");
  const hasTyped = useRef(false);

  useEffect(() => {
    if (hasTyped.current) return;
    hasTyped.current = true;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplayed(text);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 500 / text.length);

    return () => clearInterval(interval);
  }, []);

  return (
    <p className="font-mono text-sm text-signal mb-4">
      &gt; {displayed}
      {displayed.length < text.length && <span className="animate-pulse">_</span>}
    </p>
  );
}

export default function Hero() {
  const { audience } = useAudience();

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center items-center px-6 text-center relative"
    >
      <Reveal>
        <div className="max-w-xl min-h-[300px] flex flex-col items-center justify-center">
          <TypingEyebrow />

          {audience === "recruiter" ? (
            <div className="flex flex-col items-center">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text">
                Python Backend Developer.
              </h1>
              <p className="text-lg sm:text-xl text-muted mt-3 leading-relaxed">
                Computer Science Engineering — construyo sitios, juegos educativos y
                sistemas full-stack con TypeScript, Python y despliegues reales.
              </p>

              <div className="flex justify-center gap-4 mt-8">
                <a
                  href="#projects"
                  className="btn-hover px-5 py-2.5 rounded-lg bg-signal text-bg text-sm font-semibold hover:bg-signal/90 transition"
                >
                  Ver proyectos
                </a>
                <a
                  href="/cv/PythonDeveloper.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-lg border border-border text-text text-sm font-semibold hover:bg-surface transition"
                >
                  Descargar CV
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text">
                Construyo tu sitio o sistema, de cero a producción.
              </h1>
              <p className="text-lg sm:text-xl text-muted mt-3 leading-relaxed">
                Sitios web, e-commerce y software a medida. Trabajo end-to-end: backend, frontend y despliegue.
              </p>

              <div className="flex justify-center gap-4 mt-8">
                <a
                  href="#servicios"
                  className="btn-hover px-5 py-2.5 rounded-lg bg-signal text-bg text-sm font-semibold hover:bg-signal/90 transition"
                >
                  Ver servicios
                </a>
                <a
                  href="#contact"
                  className="px-5 py-2.5 rounded-lg border border-border text-text text-sm font-semibold hover:bg-surface transition"
                >
                  Cotizar proyecto
                </a>
              </div>
            </div>
          )}

          <p className="mt-8 inline-flex items-center gap-1.5 text-sm text-muted">
            <MapPin size={16} />
            Guadalajara, Jalisco
          </p>

          <div className="flex justify-center gap-4 mt-6 text-muted">
            <a
              href="https://github.com/Vicente28CF"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-text transition"
              aria-label="GitHub de Vicente Cayetano Flores"
            >
              <GithubIcon size={20} />
              <span className="text-sm">Vicente28CF</span>
            </a>
            <a
              href="https://www.linkedin.com/in/vicente-cayetano-3113322a9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-text transition"
              aria-label="LinkedIn de Vicente Cayetano Flores"
            >
              <LinkedinIcon size={20} />
              <span className="text-sm">LinkedIn</span>
            </a>
          </div>
        </div>
      </Reveal>

      <a
        href="#stack"
        className="absolute bottom-8 text-muted hover:text-text transition-colors"
      >
        <ArrowDown size={20} />
      </a>
    </section>
  );
}
