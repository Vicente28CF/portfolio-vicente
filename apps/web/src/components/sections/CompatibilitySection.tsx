"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { postCompatibilityCheck } from "@/lib/api";
import { Check, X, Loader2 } from "lucide-react";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import Reveal from "@/components/ui/Reveal";

export default function CompatibilitySection() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    if (description.length < 20) {
      setError("Por favor ingresa una descripción más larga (mínimo 20 caracteres).");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const data = await postCompatibilityCheck(description);
      setResult(data);
    } catch (e) {
      setError("Error al analizar la compatibilidad. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="compatibilidad" className="px-6 py-16 md:py-24 max-w-5xl mx-auto border-t border-border">
      <Reveal>
        <div>
          <SectionEyebrow command="python analizar_compatibilidad.py" />
          <h2 className="text-2xl font-bold text-text mb-8">Compatibilidad de Rol</h2>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted leading-relaxed">
                ¿Tienes una vacante o descripción de proyecto? Pégala aquí y descubre qué tanto 
                coincide con mi stack tecnológico.
              </p>
              <textarea
                className="w-full h-48 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text placeholder-muted focus:outline-none focus:border-signal transition resize-none"
                placeholder="Pega aquí la descripción del puesto o proyecto..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="btn-hover flex items-center justify-center gap-2 rounded-lg bg-signal px-5 py-2.5 text-sm font-semibold text-bg hover:bg-signal/90 disabled:opacity-50 transition"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : "Analizar compatibilidad"}
              </button>
            </div>

            <div className="rounded-xl border border-border bg-surface p-6 flex flex-col justify-center min-h-[300px]">
              {!result && !loading && (
                <div className="text-center text-muted text-sm">
                  <p>Los resultados del análisis aparecerán aquí.</p>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center text-signal">
                  <Loader2 className="animate-spin mb-4" size={32} />
                  <p className="text-sm font-mono animate-pulse">Analizando texto...</p>
                </div>
              )}

              {result && !loading && (
                <div className="flex flex-col gap-6">
                  <div>
                    <div className="flex items-end justify-between mb-2">
                      <span className="text-sm font-mono text-muted">Match Score</span>
                      <span className="text-2xl font-bold text-signal">{result.match_percentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-bg h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${result.match_percentage}%` }} 
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-signal"
                      />
                    </div>
                    <p className="text-xs text-text mt-2 font-medium">{result.message}</p>
                  </div>

                  {result.matched_skills.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-widest text-muted mb-3">Skills Encontrados</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.matched_skills.map((skill: string) => (
                          <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-ok/10 text-ok text-xs font-medium border border-ok/20">
                            <Check size={12} /> {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.missing_skills.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-widest text-muted mb-3">Skills Ausentes</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.missing_skills.map((skill: string) => (
                          <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-bg text-muted text-xs border border-border">
                            <X size={12} /> {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
