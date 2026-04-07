'use client';

interface AtelierQuestionProps {
  icon: React.ReactNode;
  hint?: string;
  question: string;
}

export function AtelierQuestion({
  icon,
  hint,
  question,
}: AtelierQuestionProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 text-aq-blue/70">
        {icon}
        {hint && (
          <span className="text-xs text-muted-foreground/60">{hint}</span>
        )}
      </div>
      <h2 className="font-cormorant text-3xl font-medium leading-snug text-foreground sm:text-4xl">
        {question}
      </h2>
    </div>
  );
}
