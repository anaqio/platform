'use client';

import { forwardRef, useCallback } from 'react';

import { Link, useRouter } from '@/i18n/routing';
import { cn } from '@/lib/utils';

type ViewTransitionLinkProps = React.ComponentPropsWithoutRef<typeof Link> & {
  /** CSS class for the view transition type (e.g., 'slide', 'fade') */
  transitionClass?: string;
};

/**
 * A drop-in replacement for Next.js `<Link>` that explicitly triggers
 * `document.startViewTransition()` on click for browsers that support it.
 *
 * Falls back to standard navigation in unsupported browsers.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
 */
export const ViewTransitionLink = forwardRef<
  HTMLAnchorElement,
  ViewTransitionLinkProps
>(function ViewTransitionLink(
  { onClick, transitionClass, className, ...props },
  ref
) {
  const router = useRouter();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Let the caller's onClick run first
      onClick?.(e);

      // If the event is already prevented, bail out
      if (e.defaultPrevented) return;

      // Only intercept left clicks without modifier keys
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;

      const href =
        typeof props.href === 'string'
          ? props.href
          : (props.href?.pathname ?? '/');

      // Check for View Transition API support
      if (
        typeof document !== 'undefined' &&
        'startViewTransition' in document
      ) {
        e.preventDefault();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transition = (document as any).startViewTransition(() => {
          router.push(href);
        });

        // Optionally add a transition type class
        if (transitionClass) {
          transition.types?.add(transitionClass);
        }
      }
      // If not supported, the default Link behavior handles navigation
    },
    [onClick, props.href, router, transitionClass]
  );

  return (
    <Link
      ref={ref}
      onClick={handleClick}
      className={cn(className)}
      {...props}
    />
  );
});
