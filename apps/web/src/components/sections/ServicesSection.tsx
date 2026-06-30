"use client";

import { useAudience } from "@/lib/audience-context";
import { ArrowRight, Globe, ShoppingCart, Code } from "lucide-react";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import Reveal from "@/components/ui/Reveal";

export default function ServicesSection() {
  const { audience } = useAudience();

  if (audience !== "client") {
    return null;
  }

  const handleQuote = (serviceName: string) => {
    window.dispatchEvent(new CustomEvent("preload-contact", { detail: `Me interesa: ${serviceName}` }));
  };

  const services = [
    {
      title: "Sitio web institucional",
      for: "negocios que necesitan presencia profesional",
      includes: "diseño responsive, SEO básico, formulario de contacto, hosting configurado",
      example: "CompuClub, ENMICE",
      icon: Globe,
    },
    {
      title: "E-commerce y catálogo",
      for: "negocios que venden productos online",
      includes: "catálogo, SEO avanzado (Schema.org, sitemap), integración de contacto/pedidos",
      example: "Equipales Cantor, EquipalesCasillas",
      icon: ShoppingCart,
    },
    {
      title: "Sistema o SaaS a medida",
      for: "negocios con un proceso específico que automatizar",
      includes: "backend en Python/FastAPI, frontend en Next.js, base de datos, autenticación, despliegue",
      example: "LoteX, Agendi",
      icon: Code,
    },
  ];

  return (
    <section id="servicios" className="px-6 py-16 md:py-24 max-w-5xl mx-auto border-t border-border">
      <SectionEyebrow command="cat servicios.json" />
      <h2 className="text-2xl font-bold text-text mb-8">Servicios</h2>

      <div className="grid gap-6 md:grid-cols-3">
        {services.map((svc, i) => (
          <Reveal key={i} delay={i * 0.07}>
            <div className="rounded-xl border border-border bg-surface p-6 flex flex-col card-hover group">
              <svc.icon size={32} className="text-signal mb-4 group-hover:text-signal transition-colors" />
              <h3 className="text-lg font-semibold text-text mb-3 group-hover:text-signal transition-colors">{svc.title}</h3>
              
              <div className="flex-1 flex flex-col gap-3">
                <div>
                  <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-muted mb-1">Para quién es</p>
                  <p className="text-sm text-text leading-relaxed">{svc.for}</p>
                </div>
                
                <div>
                  <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-muted mb-1">Qué incluye</p>
                  <p className="text-sm text-muted leading-relaxed">{svc.includes}</p>
                </div>

                <div>
                  <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-signal mb-1">Ejemplos reales</p>
                  <p className="text-sm font-medium text-text">{svc.example}</p>
                </div>
              </div>

              <a
                href="#contact"
                onClick={() => handleQuote(svc.title)}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-signal hover:text-signal/80 transition-colors"
              >
                Cotizar este servicio <ArrowRight size={16} />
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
