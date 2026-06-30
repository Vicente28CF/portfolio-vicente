"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAudience } from "@/lib/audience-context";
import TechnicalConsoleSection from "@/components/sections/TechnicalConsoleSection";
import MusicVibeSection from "@/components/sections/MusicVibeSection";

export default function DemoSection() {
  const { audience } = useAudience();
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const isRecruiter = audience === "recruiter";

  const eyebrow = isRecruiter
    ? "ssh vicente@portfolio --verbose"
    : "python music_vibe.py --analyze";
  const title = isRecruiter
    ? "Pruébalo tú mismo: una consola real"
    : "¿Qué dice tu música de ti?";
  const subtitle = isRecruiter
    ? "No es un mockup. Esta terminal ejecuta peticiones HTTP reales contra mi backend en producción."
    : "Escribe tu artista o canción favorita y descúbrelo. Solo por diversión.";

  return (
    <section
      id="demo"
      className="px-6 py-16 md:py-24 max-w-3xl mx-auto border-t border-border"
    >
      <p className="font-mono text-caption text-signal mb-4">
        <span className="text-muted">$</span> {eyebrow}
      </p>

      <h2 className="text-2xl font-bold text-text mb-8">{title}</h2>

      <p className="text-muted text-sm mb-6">{subtitle}</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={audience}
          initial={reduced ? {} : { opacity: 0 }}
          animate={reduced ? {} : { opacity: 1 }}
          exit={reduced ? {} : { opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {isRecruiter ? <TechnicalConsoleSection /> : <MusicVibeSection />}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
