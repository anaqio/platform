# New Landing Page with Video Hero - Feature Documentation

**Branch:** `feature/new-landing-page-video-hero`  
**Created:** March 15, 2026  
**Launch Date:** March 20, 2026 at 00:00 UTC

## Overview

This feature introduces a new landing page with a 16:9 video hero section that automatically becomes active on March 20, 2026. The implementation includes date-based switching logic, lazy-loaded video optimization, and a refined two-column layout.

## Key Features

### 1. Date-Based Switching

The landing page automatically switches based on the configured date:

- **Before March 20, 2026:** Shows the original experiment page / Coming Soon page
- **After March 20, 2026:** Shows the new landing page with video hero

Configuration file: `lib/landing-page-config.ts`

```typescript
const LANDING_PAGE_SWITCH_DATE = '2026-03-20T00:00:00Z';
```

### 2. Video Hero Section

**Component:** `components/sections/VideoHeroSection.tsx`

Features:

- **16:9 aspect ratio video** on the right side (desktop) / bottom (mobile)
- **Two-column layout** with text content on the left, video on the right
- **Responsive design** that adapts to all screen sizes
- **Interactive controls** for play/pause and mute/unmute
- **Muted autoplay** for better browser compatibility

### 3. Lazy Loading & FCP Optimization

**Hook:** `hooks/use-lazy-video.ts`

The video component implements several optimization techniques:

1. **Intersection Observer:** Video only loads when 10% visible
2. **Root Margin:** 200px margin ensures early loading before user sees it
3. **Placeholder Poster:** Shows a static image while video loads
4. **Preload Strategy:** Uses `preload="auto"` for optimal buffering
5. **Progressive Enhancement:** Page is fully functional without video

### 4. Layout Structure

```
┌─────────────────────────────────────────────────────┐
│                    Header                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────┐    ┌─────────────────────┐   │
│  │                 │    │                     │   │
│  │   Text Content  │    │    16:9 Video       │   │
│  │   (Left)        │    │    (Right)          │   │
│  │                 │    │                     │   │
│  │   - Eyebrow     │    │  [Video Player]     │   │
│  │   - Headline    │    │                     │   │
│  │   - Subheadline │    │  - Play/Pause       │   │
│  │   - CTAs        │    │  - Mute/Unmute      │   │
│  │                 │    │                     │   │
│  └─────────────────┘    └─────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│              Support Line                           │
├─────────────────────────────────────────────────────┤
│         Remaining Page Sections                     │
│  (Problem, Solution, How It Works, etc.)           │
└─────────────────────────────────────────────────────┘
```

## File Structure

```
justwaitit/
├── app/[locale]/
│   ├── expirement/
│   │   └── page.tsx                    # Updated with switching logic
│   └── page.tsx                        # Updated with redirect logic
├── components/sections/
│   ├── VideoHeroSection.tsx            # NEW: Video hero component
│   ├── NewLandingPage.tsx              # NEW: Wrapper for new landing page
│   └── ScrollTriggered.tsx             # Existing: Original hero
├── hooks/
│   └── use-lazy-video.ts               # NEW: Lazy video hook
├── lib/
│   └── landing-page-config.ts          # NEW: Date configuration
└── public/
    ├── videos/
    │   ├── README.md                   # NEW: Video asset guidelines
    │   ├── hero-showcase.mp4           # TODO: Add video file
    │   └── hero-showcase.webm          # TODO: Add video file
    └── images/
        └── hero-video-poster.webp      # TODO: Add poster image
```

## Required Assets

### Video Files (Need to be added)

1. **hero-showcase.mp4** (primary format)
   - 16:9 aspect ratio (1920x1080 recommended)
   - H.264 codec
   - < 5MB optimized
   - 15-30 seconds loop

2. **hero-showcase.webm** (fallback format)
   - Same specifications as MP4
   - VP9 codec for better compression

3. **hero-video-poster.webp** (placeholder)
   - 16:9 aspect ratio
   - < 200KB
   - Shown while video loads

See `public/videos/README.md` for detailed specifications.

## Usage

### Before Launch Date (Testing)

To test the new landing page before March 20, 2026:

1. Navigate to `/[locale]/expirement` to see the original page
2. The new landing page will automatically activate on the switch date

### After Launch Date

1. Home page (`/[locale]/`) redirects to the new landing page
2. Experiment page (`/[locale]/expirement`) shows the new landing page
3. All existing sections remain unchanged below the hero

## Customization

### Change the Launch Date

Edit `lib/landing-page-config.ts`:

```typescript
const LANDING_PAGE_SWITCH_DATE = 'YYYY-MM-DDTHH:MM:SSZ';
```

### Adjust Lazy Loading Behavior

Edit `components/sections/VideoHeroSection.tsx`:

```typescript
const { videoRef, shouldLoad, isInView, hasLoaded } = useLazyVideo({
  threshold: 0.1, // Load when 10% visible
  rootMargin: '200px', // Start loading 200px before visible
  eager: false, // Set to true to disable lazy loading
});
```

### Modify Video Settings

In `VideoHeroSection.tsx`, adjust:

- `autoPlay`: Enable/disable autoplay
- `loop`: Enable/disable looping
- `muted`: Default mute state
- `poster`: Placeholder image path

## Performance Considerations

### FCP Optimization

1. **Lazy Loading:** Video doesn't block initial page render
2. **Poster Image:** Provides instant visual feedback
3. **Preload Strategy:** `preload="auto"` buffers video efficiently
4. **Code Splitting:** Video component is tree-shaken if not shown

### Lighthouse Scores

Expected impact:

- **FCP:** No negative impact (lazy loaded)
- **LCP:** May improve with engaging video content
- **Performance:** Minimal impact due to lazy loading
- **Accessibility:** Full keyboard controls and ARIA labels

### Browser Compatibility

- **Modern Browsers:** Full support with MP4/WebM
- **Older Browsers:** Graceful fallback to poster image
- **Mobile:** Optimized with `playsInline` attribute

## Accessibility

- **Keyboard Controls:** Full play/pause/mute support
- **Screen Readers:** Proper ARIA labels and descriptions
- **Reduced Motion:** Respects `prefers-reduced-motion`
- **Focus Management:** Clear focus indicators on controls

## Testing Checklist

- [ ] Video loads correctly on desktop
- [ ] Video loads correctly on mobile
- [ ] Lazy loading triggers at correct threshold
- [ ] Play/pause functionality works
- [ ] Mute/unmute functionality works
- [ ] Poster image displays while loading
- [ ] Fallback works if video fails to load
- [ ] Keyboard navigation works
- [ ] Screen reader announces controls correctly
- [ ] Date switching works (test by modifying date)
- [ ] Responsive layout works at all breakpoints
- [ ] Build completes without errors

## Migration Notes

### From Old to New

The original `ScrollTriggered` component remains unchanged and is used as a fallback before the switch date. This ensures:

1. **Backward Compatibility:** Old page still works
2. **Easy Rollback:** Can disable by changing date
3. **A/B Testing:** Can manually toggle for testing

### Reverting

To revert to the old page:

1. Change `LANDING_PAGE_SWITCH_DATE` to a future date
2. Or update `expirement/page.tsx` to always show `ScrollTriggered`

## Future Enhancements

Potential improvements:

1. **A/B Testing:** Add analytics to compare old vs new
2. **Video Variants:** Test different video content
3. **Auto-play with Sound:** Request user permission for audio
4. **Thumbnail Selection:** Allow custom frame selection
5. **Video Analytics:** Track play rate, completion, engagement
6. **Background Video Option:** Full-width background variant

## Related Documentation

- [Video Assets Guide](../../public/videos/README.md)
- [Lazy Video Hook](../../hooks/use-lazy-video.ts)
- [Landing Page Config](../../lib/landing-page-config.ts)

## Support

For issues or questions:

1. Check the component comments in `VideoHeroSection.tsx`
2. Review the video asset requirements in `public/videos/README.md`
3. Test the lazy loading behavior in browser DevTools

---

**Last Updated:** March 15, 2026  
**Version:** 1.0  
**Status:** Ready for Review
