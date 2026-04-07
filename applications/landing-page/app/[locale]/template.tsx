'use client';

import { motion } from 'framer-motion';

/**
 * Page transition template that pairs with the View Transition API.
 *
 * The browser's View Transition API handles the snapshot crossfade between
 * old and new page content. This template adds a subtle entrance animation
 * to the new content after the transition completes.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
