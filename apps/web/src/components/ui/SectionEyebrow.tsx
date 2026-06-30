interface Props {
  command: string;
}

export default function SectionEyebrow({ command }: Props) {
  return (
    <p className="font-mono text-caption text-signal mb-4">
      <span className="text-muted">$</span> {command}
    </p>
  );
}
