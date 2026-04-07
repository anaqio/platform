'use client';

import { type ComponentPropsWithoutRef } from 'react';

import { trackUserBehavior } from '@/lib/analytics';

type ScrollLinkProps = ComponentPropsWithoutRef<'a'> & {
  targetId: string;
};

/**
 * Semantic anchor for in-page scroll navigation.
 * Renders as `<a href="#id">` for keyboard/screen-reader accessibility
 * and intercepts click for smooth scrolling. Compose with Button asChild:
 *
 * After scrolling, cleans up the URL hash to prevent auto-scroll on page reload.
 *
 * @example
 * <Button variant="hero" asChild>
 *   <ScrollLink targetId="waitlist">Join Waitlist</ScrollLink>
 * </Button>
 */
export function ScrollLink({ targetId, children, ...props }: ScrollLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      {...props}
      onClick={(e) => {
        e.preventDefault();
        trackUserBehavior.trackClick(`scroll_to_${targetId}`, 'navigation');
        const element = document.getElementById(targetId);
        element?.scrollIntoView({ behavior: 'smooth' });

        // Clean up URL hash after scrolling to prevent auto-scroll on reload
        // Use replaceState to avoid breaking browser back button
        window.history.replaceState(
          null,
          '',
          window.location.pathname + window.location.search
        );

        props.onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
