'use client';

interface AtelierStepCounterProps {
  current: number;
  total: number;
  isOptional: boolean;
  skipLabel: string;
  onSkip: () => void;
}

export function AtelierStepCounter({
  current,
  total,
  isOptional,
  skipLabel,
  onSkip,
}: AtelierStepCounterProps) {
  return (
    <div className="mt-4 flex items-center justify-between px-1">
      <span className="text-xs font-medium tabular-nums text-muted-foreground/60">
        {current} / {total}
      </span>
      {isOptional && (
        <button
          type="button"
          onClick={onSkip}
          className="text-xs text-muted-foreground/50 transition-colors hover:text-muted-foreground"
        >
          {skipLabel}
        </button>
      )}
    </div>
  );
}
