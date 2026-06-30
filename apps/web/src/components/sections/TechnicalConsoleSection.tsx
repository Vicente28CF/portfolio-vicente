"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Terminal, Send, Loader2 } from "lucide-react";

const COMMANDS = {
  health: { method: "GET", path: "/health", needsArg: false },
  echo: { method: "GET", path: "/api/echo", needsArg: true, argLabel: "mensaje" },
  compatibility: {
    method: "POST",
    path: "/api/compatibility/",
    needsArg: true,
    argLabel: "descripción del puesto",
  },
  github: { method: "GET", path: "/api/github/activity", needsArg: false },
} as const;

type CommandName = keyof typeof COMMANDS;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface HistoryEntry {
  id: number;
  type: "command" | "output";
  content: string;
  response?: {
    status: number;
    method: string;
    clientTimeMs: number;
    serverTimeMs: number | null;
    headers: Record<string, string>;
    body: unknown;
  };
}

function formatHeaders(headers: Record<string, string>): [string, string][] {
  const relevant = ["content-type", "x-process-time", "x-request-id"];
  return relevant
    .filter((k) => headers[k] !== undefined)
    .map((k) => [k, headers[k]]);
}

function statusColor(status: number): string {
  if (status >= 200 && status < 300) return "bg-ok/20 text-ok border-ok/40";
  if (status >= 400 && status < 500) return "bg-infra/20 text-infra border-infra/40";
  if (status >= 500) return "bg-red-400/20 text-red-400 border-red-400/40";
  return "bg-muted/20 text-muted border-muted/40";
}

function JSONHighlight({ data }: { data: unknown }) {
  const render = (obj: unknown, indent = 0): React.ReactNode => {
    const pad = "  ".repeat(indent);
    if (obj === null)
      return <span className="text-muted">null</span>;
    if (typeof obj === "boolean")
      return <span className="text-violet">{obj.toString()}</span>;
    if (typeof obj === "number")
      return <span className="text-signal">{obj}</span>;
    if (typeof obj === "string")
      return (
        <span>
          <span className="text-ok">&quot;{obj}&quot;</span>
        </span>
      );
    if (Array.isArray(obj)) {
      if (obj.length === 0) return <span className="text-muted">[]</span>;
      return (
        <>
          [{"\n"}
          {obj.map((item, i) => (
            <span key={i}>
              {pad}  {render(item, indent + 1)}
              {i < obj.length - 1 ? "," : ""}
              {"\n"}
            </span>
          ))}
          {pad}]
        </>
      );
    }
    if (typeof obj === "object" && obj !== null) {
      const entries = Object.entries(obj as Record<string, unknown>);
      if (entries.length === 0) return <span className="text-muted">{`{}`}</span>;
      return (
        <>
          {`{`}{"\n"}
          {entries.map(([key, val], i) => (
            <span key={key}>
              {pad}  <span className="text-text">&quot;{key}&quot;</span>
              {": "}
              {render(val, indent + 1)}
              {i < entries.length - 1 ? "," : ""}
              {"\n"}
            </span>
          ))}
          {pad}{`}`}
        </>
      );
    }
    return String(obj);
  };

  return (
    <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap">
      {render(data)}
    </pre>
  );
}

function InspectorPanel({ response }: { response: HistoryEntry["response"] }) {
  if (!response) return null;

  return (
    <div className="mt-3 rounded-lg border border-border overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-surface border-b border-border">
        <Terminal size={12} className="text-muted" />
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted">
          Inspector de red
        </span>
      </div>

      <div className="p-3 space-y-3">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${statusColor(response.status)}`}
          >
            {response.status}
          </span>
          <span className="text-[10px] font-mono text-muted uppercase">
            {response.method}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-[10px] font-mono">
          <div className="rounded bg-bg p-2 border border-border">
            <span className="text-muted block">Method</span>
            <span className="text-text font-semibold">{response.method}</span>
          </div>
          <div className="rounded bg-bg p-2 border border-border">
            <span className="text-muted block">Status</span>
            <span className={`font-semibold ${response.status >= 200 && response.status < 300 ? "text-ok" : response.status >= 400 && response.status < 500 ? "text-infra" : "text-red-400"}`}>
              {response.status}
            </span>
          </div>
          <div className="rounded bg-bg p-2 border border-border">
            <span className="text-muted block">Cliente (ms)</span>
            <span className="text-signal font-semibold">{response.clientTimeMs.toFixed(2)}</span>
          </div>
          <div className="rounded bg-bg p-2 border border-border">
            <span className="text-muted block">Servidor (ms)</span>
            <span className="text-ok font-semibold">
              {response.serverTimeMs !== null ? `${response.serverTimeMs.toFixed(2)}` : "—"}
            </span>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted mb-1.5">
            Headers
          </p>
          <div className="rounded bg-bg border border-border p-2 font-mono text-[10px]">
            {formatHeaders(response.headers).length === 0 ? (
              <span className="text-muted">(sin headers relevantes)</span>
            ) : (
              formatHeaders(response.headers).map(([key, val]) => (
                <div key={key} className="flex gap-2">
                  <span className="text-muted shrink-0">{key}:</span>
                  <span className="text-text break-all">{val}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted mb-1.5">
            Body
          </p>
          <div className="rounded bg-bg border border-border p-3 overflow-x-auto max-h-64 overflow-y-auto">
            <JSONHighlight data={response.body} />
          </div>
        </div>
      </div>
    </div>
  );
}

const HELP_TEXT = [
  "Comandos disponibles:",
  "",
  "  help                  Muestra esta ayuda",
  "  clear                 Limpia la terminal",
  "  health                GET /health — estado del servidor",
  "  echo <mensaje>        GET /api/echo — prueba de eco",
  "  github                GET /api/github/activity — actividad reciente",
  "  compatibility <desc>  POST /api/compatibility/ — análisis de compatibilidad",
];

export default function TechnicalConsoleSection() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: 0,
      type: "output",
      content: "Bienvenido a la consola técnica. Escribe 'help' para ver los comandos disponibles.",
    },
  ]);
  const [loading, setLoading] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<CommandName[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, loading]);

  const updateSuggestions = useCallback((value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const firstWord = trimmed.split(/\s+/)[0];
    if (!firstWord) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const matches = (Object.keys(COMMANDS) as CommandName[]).filter((cmd) =>
      cmd.startsWith(firstWord),
    );
    setSuggestions(matches);
    setShowSuggestions(matches.length > 0 && matches.length <= 8);
    setSelectedSuggestion(-1);
  }, []);

  function selectSuggestion(cmd: CommandName) {
    setInput(cmd + " ");
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  }

  function addEntry(entry: HistoryEntry) {
    setHistory((prev) => {
      const next = [...prev, entry];
      if (next.length > 10) {
        return next.slice(next.length - 10);
      }
      return next;
    });
  }

  async function executeCommand(cmd: string) {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const parts = trimmed.split(/\s+/);
    const name = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ");

    addEntry({ id: nextId.current++, type: "command", content: `$ ${trimmed}` });

    if (name === "help") {
      addEntry({
        id: nextId.current++,
        type: "output",
        content: HELP_TEXT.join("\n"),
      });
      return;
    }

    if (name === "clear") {
      setHistory([]);
      return;
    }

    if (!(name in COMMANDS)) {
      addEntry({
        id: nextId.current++,
        type: "output",
        content: `bash: ${name}: comando no encontrado. Escribe 'help' para ver comandos disponibles`,
      });
      return;
    }

    const command = COMMANDS[name as CommandName];

    if (command.needsArg && !arg) {
      addEntry({
        id: nextId.current++,
        type: "output",
        content: `bash: ${name}: falta argumento (${command.argLabel})`,
      });
      return;
    }

    setLoading(nextId.current);

    const clientStart = performance.now();

    try {
      let url = `${API_URL}${command.path}`;
      const fetchInit: RequestInit = {
        method: command.method,
        headers: { "Content-Type": "application/json" },
      };

      if (command.method === "GET" && command.needsArg && arg) {
        const paramName = name === "echo" ? "msg" : "q";
        url += `?${encodeURIComponent(paramName)}=${encodeURIComponent(arg)}`;
      }

      if (command.method === "POST") {
        const bodyPayload = name === "compatibility"
          ? { job_description: arg }
          : { message: arg };
        fetchInit.body = JSON.stringify(bodyPayload);
      }

      const res = await fetch(url, fetchInit);
      const clientTimeMs = performance.now() - clientStart;

      const headers: Record<string, string> = {};
      res.headers.forEach((v, k) => {
        headers[k.toLowerCase()] = v;
      });

      const serverTimeHeader = headers["x-process-time"];
      const serverTimeMs = serverTimeHeader ? parseFloat(serverTimeHeader) : null;

      let body: unknown;
      const ct = headers["content-type"] || "";
      if (ct.includes("application/json")) {
        body = await res.json();
      } else {
        body = await res.text();
      }

      addEntry({
        id: nextId.current++,
        type: "output",
        content: "",
        response: {
          status: res.status,
          method: command.method,
          clientTimeMs,
          serverTimeMs,
          headers,
          body,
        },
      });
    } catch {
      const clientTimeMs = performance.now() - clientStart;
      addEntry({
        id: nextId.current++,
        type: "output",
        content: `Error: no se pudo conectar con el servidor (${clientTimeMs.toFixed(0)}ms)`,
      });
    } finally {
      setLoading(null);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      setShowSuggestions(false);
      executeCommand(input);
      setInput("");
      return;
    }

    if (e.key === "Tab" && showSuggestions && suggestions.length > 0) {
      e.preventDefault();
      selectSuggestion(suggestions[0]);
      return;
    }

    if (e.key === "ArrowDown" && showSuggestions) {
      e.preventDefault();
      setSelectedSuggestion((prev) =>
        Math.min(prev + 1, suggestions.length - 1),
      );
      return;
    }

    if (e.key === "ArrowUp" && showSuggestions) {
      e.preventDefault();
      setSelectedSuggestion((prev) => Math.max(prev - 1, 0));
      return;
    }
  }

  function renderEntry(entry: HistoryEntry) {
    return (
      <div key={entry.id} className="mb-3">
        {entry.type === "command" && (
          <p className="font-mono text-sm text-signal whitespace-pre-wrap">{entry.content}</p>
        )}
        {entry.type === "output" && entry.content && (
          <p className="font-mono text-sm text-text whitespace-pre-wrap">{entry.content}</p>
        )}
        {entry.type === "output" && entry.response && (
          <InspectorPanel response={entry.response} />
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-bg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-surface border-b border-border">
        <span className="w-3 h-3 rounded-full bg-red-400/60" />
        <span className="w-3 h-3 rounded-full bg-infra/60" />
        <span className="w-3 h-3 rounded-full bg-ok/60" />
        <span className="ml-2 text-[10px] font-mono text-muted uppercase tracking-wide">
          terminal — {history.length} líneas
        </span>
      </div>

      <div
        ref={terminalRef}
        className="p-4 min-h-[320px] max-h-[520px] overflow-y-auto space-y-1"
      >
        {history.map(renderEntry)}
        {loading !== null && (
          <div className="flex items-center gap-2 text-muted font-mono text-sm">
            <Loader2 size={14} className="animate-spin" />
            Ejecutando...
          </div>
        )}
      </div>

      <div className="relative border-t border-border px-4 py-3 bg-surface">
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute bottom-full left-4 mb-1 rounded-lg border border-border bg-surface overflow-hidden shadow-lg">
            {suggestions.map((cmd, i) => (
              <button
                key={cmd}
                onClick={() => selectSuggestion(cmd)}
                className={`block w-full text-left px-4 py-1.5 font-mono text-xs hover:bg-bg transition ${
                  i === selectedSuggestion ? "bg-bg text-signal" : "text-text"
                }`}
              >
                {cmd}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-ok shrink-0">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              updateSuggestions(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onFocus={() => updateSuggestions(input)}
            placeholder="Escribe un comando..."
            className="flex-1 bg-transparent font-mono text-sm text-text placeholder-muted focus:outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            onClick={() => {
              executeCommand(input);
              setInput("");
            }}
            disabled={loading !== null || !input.trim()}
            className="btn-hover flex items-center gap-1.5 rounded-lg bg-signal px-3 py-1.5 text-[11px] font-semibold text-bg hover:bg-signal/90 disabled:opacity-50 transition shrink-0"
          >
            <Send size={12} />
            Ejecutar
          </button>
        </div>
      </div>
    </div>
  );
}
