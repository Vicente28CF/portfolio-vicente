"use client";

import { useState, useEffect } from "react";
import { postContact } from "@/lib/api";
import { Send, CheckCircle } from "lucide-react";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import Reveal from "@/components/ui/Reveal";
import type { ContactForm, ContactResponse } from "@/types";

interface Errors {
  name?: string;
  email?: string;
  reason?: string;
  message?: string;
}

export default function Contact() {
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", reason: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [result, setResult] = useState<ContactResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    const handlePreload = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setForm((prev) => ({ ...prev, message: customEvent.detail }));
      setErrors((prev) => ({ ...prev, message: undefined }));
    };
    window.addEventListener("preload-contact", handlePreload);
    return () => window.removeEventListener("preload-contact", handlePreload);
  }, []);

  function validate(): boolean {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "El nombre es requerido";
    if (!form.email.trim()) e.email = "El email es requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email inválido";
    if (!form.reason) e.reason = "Selecciona un motivo";
    if (!form.message.trim()) e.message = "El mensaje es requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError(null);
    try {
      const data = await postContact(form);
      setResult(data);
    } catch {
      setServerError("Error al enviar el mensaje. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: keyof ContactForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  if (result) {
    return (
      <section id="contact" className="px-6 py-16 md:py-24 max-w-lg mx-auto text-center">
        <Reveal>
          <div>
            <CheckCircle size={40} className="text-ok mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-text mb-2">¡Mensaje enviado!</h2>
            <p className="text-muted text-sm">
              Gracias por contactarme. Te responderé pronto.
            </p>
          </div>
        </Reveal>
      </section>
    );
  }

  return (
    <section id="contact" className="px-6 py-16 md:py-24 max-w-lg mx-auto border-t border-border">
      <Reveal>
        <div>
          <SectionEyebrow command="mail vicente" />
          <h2 className="text-2xl font-bold text-text mb-8">Contacto</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <input
                type="text"
                placeholder="Nombre"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-signal transition"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-signal transition"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <select
                value={form.reason}
                onChange={(e) => handleChange("reason", e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none focus:border-signal transition"
              >
                <option value="" disabled>Selecciona un motivo</option>
                <option value="job">💼 Propuesta de trabajo</option>
                <option value="project">🚀 Propuesta de proyecto</option>
                <option value="other">✉️ Otro</option>
              </select>
              {errors.reason && <p className="text-red-400 text-xs mt-1">{errors.reason}</p>}
            </div>

            <div>
              <textarea
                placeholder="Mensaje"
                rows={4}
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-signal transition resize-none"
              />
              {errors.message && (
                <p className="text-red-400 text-xs mt-1">{errors.message}</p>
              )}
            </div>

            {serverError && (
              <p className="text-red-400 text-sm">{serverError}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-hover flex items-center justify-center gap-2 rounded-lg bg-signal px-5 py-2.5 text-sm font-semibold text-bg hover:bg-signal/90 disabled:opacity-50 transition"
            >
              <Send size={16} />
              {loading ? "Enviando..." : "Enviar mensaje"}
            </button>
          </form>
        </div>
      </Reveal>
    </section>
  );
}
