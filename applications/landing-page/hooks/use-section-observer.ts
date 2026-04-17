'use client'

import { useEffect, useRef, useState } from 'react'

import { trackUserBehavior } from '@/lib/analytics'

/**
 * Tracks which section (by id) is currently in the viewport's central zone.
 * Also reports when the first tracked section has entered view (to show/hide the wheel).
 *
 * @param ids - Stable array of section element IDs to observe.
 */
export function useSectionObserver(ids: readonly string[]) {
  const idsRef = useRef(ids)
  const [activeIndex, setActiveIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const trackedIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    const currentIds = idsRef.current

    // Active-section detection: trigger when section occupies the central 30% strip
    const zoneObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const id = entry.target.id
          const idx = currentIds.indexOf(id)
          if (idx !== -1) {
            setActiveIndex(idx)

            // Track section view if not already tracked in this session
            if (!trackedIds.current.has(id)) {
              trackUserBehavior.trackSectionView(id)
              trackedIds.current.add(id)
            }
          }
        })
      },
      { rootMargin: '-35% 0px -35% 0px', threshold: 0 }
    )

    // Visibility: show wheel once the first tracked section has entered (or scrolled past)
    const sentinelObserver = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting || entry.boundingClientRect.top < 0),
      { threshold: 0 }
    )

    currentIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) zoneObserver.observe(el)
    })

    const firstEl = document.getElementById(currentIds[0])
    if (firstEl) sentinelObserver.observe(firstEl)

    return () => {
      zoneObserver.disconnect()
      sentinelObserver.disconnect()
    }
  }, []) // stable: idsRef.current never changes between renders

  return { activeIndex, visible }
}
