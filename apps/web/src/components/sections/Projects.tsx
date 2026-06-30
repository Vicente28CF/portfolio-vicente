"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/lib/api";
import ProjectCard from "@/components/ui/ProjectCard";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import Reveal from "@/components/ui/Reveal";

export default function Projects() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  return (
    <section id="projects" className="px-6 py-16 md:py-24 max-w-3xl mx-auto border-t border-border">
      <SectionEyebrow command="ls proyectos/ --featured" />
      <h2 className="text-2xl font-bold text-text mb-8">Proyectos</h2>

      {isPending && (
        <p className="text-muted text-sm">Cargando...</p>
      )}

      {isError && (
        <p className="text-red-400 text-sm">
          Error al cargar proyectos: {error.message}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {data?.map((project, index) => (
          <Reveal key={project.slug} delay={index * 0.07}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
