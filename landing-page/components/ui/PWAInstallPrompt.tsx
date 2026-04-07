'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  prompt: () => Promise<void>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Don't show immediately - wait for user engagement
      setTimeout(() => {
        setShowPrompt(true);
      }, 8000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] flex max-w-md items-center justify-between gap-4 rounded-lg bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:bottom-auto sm:top-4">
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">
          Install ANAQIO for a better experience
        </p>
        <p className="text-xs text-muted-foreground">
          Access our AI Fashion Studio directly from your home screen
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={handleDismiss}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Later
        </button>
        <button
          onClick={handleInstall}
          className="rounded-md bg-aq-blue px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-aq-blue/90"
        >
          Install
        </button>
      </div>
    </div>
  );
}
