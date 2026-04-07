'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-aq-ink px-6">
      <div className="glass-strong w-full max-w-md space-y-8 rounded-[2.5rem] border-white/5 p-12 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <svg
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold italic tracking-tight">
            Something went wrong
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Our virtual studio hit an unexpected error. We&apos;ve been notified
            and are working on it.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => reset()}
            variant="brand"
            className="h-12 rounded-xl font-bold"
          >
            Try again
          </Button>
          <Button
            onClick={() => (window.location.href = '/')}
            variant="ghost"
            className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
