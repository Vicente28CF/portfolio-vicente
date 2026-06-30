import type { Skill } from "@/types";

const levelColor: Record<Skill["level"], string> = {
  beginner: "bg-violet/10 text-violet border-violet/20",
  intermediate: "bg-infra/10 text-infra border-infra/20",
  advanced: "bg-ok/10 text-ok border-ok/20",
};

interface Props {
  skill: Skill;
}

export default function SkillBadge({ skill }: Props) {
  return (
    <span
      className={`px-3 py-1 text-xs rounded border font-mono ${levelColor[skill.level]}`}
    >
      {skill.name}
    </span>
  );
}
