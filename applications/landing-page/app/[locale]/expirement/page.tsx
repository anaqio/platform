import { Header } from '@/components/layout/Header';
import { NewLandingPage } from '@/components/sections/NewLandingPage';
import { ScrollTriggered } from '@/components/sections/ScrollTriggered';
import { isNewLandingPageActive } from '@/lib/landing-page-config';

/**
 * Experiment Page with Date-Based Switching
 *
 * This page automatically switches between the old experiment page
 * and the new landing page with video hero based on the configured date.
 *
 * Switch Date: March 20, 2026 at 00:00 UTC
 * - Before: Shows the original ScrollTriggered experiment page
 * - After: Shows the new landing page with 16:9 video hero
 */
export default function ExperimentPage() {
  const showNewLandingPage = isNewLandingPageActive();

  return (
    <main id="main-content" className="relative">
      <Header />
      {showNewLandingPage ? <NewLandingPage /> : <ScrollTriggered />}
    </main>
  );
}
