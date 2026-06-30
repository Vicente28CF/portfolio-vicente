"use client";

import { useState } from "react";
import { Music, Send, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const moods = [
  { emoji: "🔥", label: "En llamas", color: "text-red-400" },
  { emoji: "⚡", label: "Electrizante", color: "text-infra" },
  { emoji: "🌊", label: "Fluido", color: "text-signal" },
  { emoji: "🌿", label: "Relajado", color: "text-ok" },
  { emoji: "🌌", label: "Místico", color: "text-violet" },
  { emoji: "💫", label: "Inspirador", color: "text-signal" },
];

function hashVibe(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function MusicVibeSection() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [vibe, setVibe] = useState<{
    mood: (typeof moods)[number];
    energy: number;
    timestamp: string;
    echo: string;
  } | null>(null);
  const [error, setError] = useState("");

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${API_URL}/demo/ping?msg=${encodeURIComponent(trimmed)}`,
      );
      if (!res.ok) throw new Error("Error en la respuesta");
      const data = await res.json();

      const hash = hashVibe(trimmed);
      const mood = moods[hash % moods.length];
      const energy = (hash % 41) + 60;

      setVibe({
        mood,
        energy,
        timestamp: data.timestamp || new Date().toISOString(),
        echo: data.echo || trimmed,
      });
    } catch {
      setError("No se pudo conectar con el servidor. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <p className="text-muted text-sm mb-6 leading-relaxed">
        Escribe tu artista o canción favorita y el servidor le asignará un
        &quot;vibe&quot; único. No es IA real, solo diversión con algoritmos.
      </p>

      <form onSubmit={handleAnalyze} className="flex gap-3 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ej: Daft Punk, Bohemian Rhapsody, Soda Stereo..."
          className="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-violet transition"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn-hover flex items-center gap-2 rounded-lg bg-violet px-5 py-2.5 text-sm font-semibold text-bg hover:bg-violet/90 disabled:opacity-50 transition"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Music size={16} />
          )}
          {loading ? "Analizando..." : "Analizar vibe"}
        </button>
      </form>

      {error && (
        <p className="text-red-400 text-sm mb-4 font-mono">{error}</p>
      )}

      {vibe && (
        <div className="rounded-xl border border-violet/30 bg-violet/5 p-6">
          <div className="flex items-center gap-4 mb-5">
            <span className="text-4xl">{vibe.mood.emoji}</span>
            <div>
              <p className="text-lg font-bold text-text">{vibe.echo}</p>
              <p className={`text-sm font-mono ${vibe.mood.color}`}>
                {vibe.mood.label}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-xs font-mono text-muted mb-1.5">
              <span>Energía</span>
              <span className={vibe.mood.color}>{vibe.energy}%</span>
            </div>
            <div className="w-full bg-bg h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${vibe.energy}%`,
                  backgroundColor: vibe.energy > 85 ? "#ef4444" : vibe.energy > 75 ? "#f59e0b" : "#46C8FF",
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
            <div className="rounded-lg bg-bg border border-border p-3">
              <span className="text-muted block mb-0.5">Procesado por</span>
              <span className="text-text font-semibold">FastAPI</span>
            </div>
            <div className="rounded-lg bg-bg border border-border p-3">
              <span className="text-muted block mb-0.5">Timestamp</span>
              <span className="text-text font-semibold text-[10px]">
                {new Date(vibe.timestamp).toLocaleTimeString("es-MX")}
              </span>
            </div>
          </div>
        </div>
      )}

      {!vibe && !loading && (
        <div className="rounded-xl border border-border border-dashed p-8 text-center">
          <Music size={32} className="text-muted mx-auto mb-3" />
          <p className="text-muted text-sm">
            Escribe algo arriba y descubre el vibe que el servidor le asigna.
          </p>
        </div>
      )}
    </div>
  );
}
