/**
 * Landing Page Configuration
 *
 * Controls the switching between the experiment page and the new landing page
 * based on a target launch date.
 */

// Target launch date: March 20, 2026 at 00:00 UTC
const LANDING_PAGE_SWITCH_DATE = '2026-03-10T00:00:00Z';

/**
 * Check if the new landing page should be shown
 * Returns true if the current date is on or after the switch date
 */
export function isNewLandingPageActive(): boolean {
  const now = new Date();
  const switchDate = new Date(LANDING_PAGE_SWITCH_DATE);
  return now >= switchDate;
}

/**
 * Get the remaining time until the landing page switch
 * Returns null if already active
 */
export function getRemainingTimeUntilSwitch(): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} | null {
  const now = new Date();
  const switchDate = new Date(LANDING_PAGE_SWITCH_DATE);

  if (now >= switchDate) {
    return null;
  }

  const diff = switchDate.getTime() - now.getTime();

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/**
 * Get the switch date as a Date object
 */
export function getLandingPageSwitchDate(): Date {
  return new Date(LANDING_PAGE_SWITCH_DATE);
}
