"use client";

import { useQuery } from "@tanstack/react-query";
import { getSkills } from "@/lib/api";
import SkillBadge from "@/components/ui/SkillBadge";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import Reveal from "@/components/ui/Reveal";
import type { SkillCategory } from "@/types";

const categoryColors: Record<SkillCategory, string> = {
  frontend: "text-signal border-signal/30",
  backend: "text-ok border-ok/30",
  devops: "text-infra border-infra/30",
  tools: "text-violet border-violet/30",
};

const categoryLabels: Record<SkillCategory, string> = {
  frontend: "Frontend",
  backend: "Backend",
  devops: "DevOps",
  tools: "Herramientas",
};

export default function Stack() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
  });

  return (
    <section id="stack" className="px-6 py-16 md:py-24 max-w-3xl mx-auto border-t border-border">
      <SectionEyebrow command="cat stack.json" />
      <h2 className="text-2xl font-bold text-text mb-8">Tecnologías</h2>

      {isPending && (
        <p className="text-muted text-sm">Cargando...</p>
      )}

      {isError && (
        <p className="text-red-400 text-sm">
          Error al cargar tecnologías: {error.message}
        </p>
      )}

      {data &&
        (Object.entries(data) as [SkillCategory, typeof data[keyof typeof data]][]).map(
          ([category, skills], index) => (
            <Reveal key={category} delay={index * 0.07}>
              <div className="mb-6">
                <h3
                  className={`text-sm font-semibold mb-3 pb-1 border-b ${categoryColors[category]}`}
                >
                  {categoryLabels[category]}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <SkillBadge key={skill.name} skill={skill} />
                  ))}
                </div>
              </div>
            </Reveal>
          ),
        )}
    </section>
  );
}
