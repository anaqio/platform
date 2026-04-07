'use client';

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  animate,
  useMotionValueEvent,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { usePathname } from '@/i18n/routing';

/**
 * Dispatched on the window BEFORE router.push() is called so the bar can
 * start during the actual navigation wait (chunk fetch, server round-trip)
 * rather than after the route has already committed.
 *
 * Import and dispatch this from usePageTransition or any imperative
 * navigation call site.
 */
export const NAV_START_EVENT = 'anaqio:nav:start' as const;

/**
 * Thin gradient progress bar at the top of the viewport.
 *
 * Lifecycle:
 *  1. `anaqio:nav:start` event fires (navigation intent, before commit)
 *     → bar appears and eases to 80 %
 *  2. `usePathname()` changes (route committed, new page rendered)
 *     → bar completes to 100 %, then fades out
 *
 * This ensures users see feedback during the actual wait, not just a
 * post-render flash.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const progress = useMotionValue(0);
  const progressPercent = useTransform(progress, (v) => `${Math.round(v)}%`);

  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animControls = useRef<{ stop: () => void } | null>(null);
  const prevPathname = useRef(pathname);
  const hideTimer = useRef<NodeJS.Timeout | undefined>(undefined);
  const isNavigating = useRef(false);

  // Synchronize aria-valuenow directly to DOM to avoid React re-renders on tick
  useMotionValueEvent(progress, 'change', (latest) => {
    if (containerRef.current) {
      containerRef.current.setAttribute(
        'aria-valuenow',
        Math.round(latest).toString()
      );
    }
  });

  // ── Helpers ──────────────────────────────────────────────────────────
  const animateTo = (target: number, onDone?: () => void) => {
    animControls.current?.stop();
    animControls.current = animate(progress, target, {
      duration: 0.4,
      ease: 'easeOut',
      onComplete: onDone,
    });
  };

  const complete = () => {
    isNavigating.current = false;
    animateTo(100, () => {
      hideTimer.current = setTimeout(() => {
        setVisible(false);
        progress.set(0);
      }, 380);
    });
  };

  // ── Phase 1: listen for navigation intent (before route commit) ───────
  useEffect(() => {
    const onNavStart = () => {
      if (isNavigating.current) return; // already in progress
      isNavigating.current = true;

      animControls.current?.stop();
      clearTimeout(hideTimer.current);

      progress.set(0);

      setVisible(true);

      // Immediate jump + ease to 80 % (leaves room for completion)
      requestAnimationFrame(() => {
        progress.set(25);
        animateTo(80);
      });
    };

    window.addEventListener(NAV_START_EVENT, onNavStart);
    return () => window.removeEventListener(NAV_START_EVENT, onNavStart);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Phase 2: complete when the new route renders ───────────────────────
  useEffect(() => {
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;

    if (isNavigating.current) {
      // Navigation was properly initiated — complete
      complete();
    } else {
      // Browser back/forward or programmatic push without event dispatch
      // (e.g. direct router.push call) — show a quick flash instead
      isNavigating.current = true;

      setVisible(true);
      progress.set(60);
      complete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // ── Safety: clean up on unmount ───────────────────────────────────────
  useEffect(() => {
    return () => {
      animControls.current?.stop();
      clearTimeout(hideTimer.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={containerRef}
          key="nav-progress"
          aria-hidden="true"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          className="pointer-events-none fixed left-0 right-0 top-0 z-[300] h-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.15 } }}
        >
          {/* Glow */}
          <motion.div
            className="bg-brand-gradient absolute inset-y-0 left-0 h-[4px] -translate-y-px rounded-full opacity-60 blur-sm"
            style={{ width: progressPercent }}
          />
          {/* Fill */}
          <motion.div
            className="bg-brand-gradient absolute inset-0 left-0 rounded-r-full"
            style={{ width: progressPercent }}
          />
          {/* Leading shimmer dot */}
          <motion.div
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-aq-purple/80 blur-[3px]"
            style={{ left: progressPercent }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
