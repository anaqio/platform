# Responsive Layout Debug Plan

## Breakpoints in Use

Tailwind defaults — all used in the codebase:

| Token | Width  | Context                           |
| ----- | ------ | --------------------------------- |
| `sm`  | 640px  | Padding, card layout switches     |
| `md`  | 768px  | Grid column changes               |
| `lg`  | 1024px | Hero two-column split, nav expand |
| `xl`  | 1280px | Max-width containers              |
| `2xl` | 1536px | Wide-screen spacing               |

### xs — Sub-640px (no Tailwind token, use `max-sm:` or explicit values)

Tailwind has no built-in `xs` token. Target these with `max-sm:` (Tailwind v3.2+) or
raw arbitrary values. Older Android devices and budget smartphones often fall in this range.

| Device class         | Width | Notes                                               |
| -------------------- | ----- | --------------------------------------------------- |
| iPhone SE (1st gen)  | 320px | Smallest common viewport; absolute floor to support |
| Galaxy A series      | 360px | Most common Android budget phone width              |
| iPhone SE (2nd/3rd)  | 375px | Popular iOS baseline                                |
| Moto G / Redmi       | 390px | Common mid-range Android                            |
| iPhone 14/15         | 393px | Current iOS default                                 |
| Large Android budget | 412px | Pixel 6a, Galaxy A54                                |

**xs-specific risks:**

- `clamp()` headline sizes can still render too large at 320px — verify the `vw` component doesn't exceed the container
- Flex row layouts that work at 390px may still overflow at 320px
- Glass cards with `p-8` (32px) leave only 256px inner width at 320px — check input fields
- `gap-x-[0.22em]` word gap pushes words to a new line if individual word spans are near-full-width
- Bottom nav bars on Android (soft buttons) reduce visible viewport height by 48–72px

**Test viewports to add for xs:**

| Viewport | Represents                   |
| -------- | ---------------------------- |
| 320×568  | iPhone SE 1st gen (smallest) |
| 360×780  | Galaxy budget baseline       |
| 375×667  | iPhone SE 2nd/3rd gen        |
| 390×844  | iPhone 14 Pro                |
| 412×915  | Pixel 6a / Galaxy A54        |

**Tailwind patterns for xs targeting:**

```html
<!-- Below sm (640px) only -->
<div class="max-sm:flex-col max-sm:px-3">
  <!-- Specific arbitrary breakpoint -->
  <div class="[@media(max-width:360px)]:text-sm">
    <!-- Stack at xs, row at sm+ -->
    <div class="flex flex-col gap-3 sm:flex-row"></div>
  </div>
</div>
```

---

## Sections to Audit

### 1. VideoHeroSection / HeroText

**File:** `components/sections/VideoHeroSection.tsx`, `atoms/HeroText.tsx`, `atoms/HeroVideoPlayer.tsx`

**Layout:**

- Mobile (`< lg`): single column, text on top, portrait video below
- Desktop (`lg+`): two columns — text left (`w-1/2`), video right (`w-1/2`)

**Known issues to check:**

- [ ] Portrait video (`aspect-[9/16]`, `max-w-xs`) overflows or clips on narrow screens
- [ ] `HeroText` headline `clamp(2.5rem, 6vw, 6rem)` — verify word wrapping at 360px
- [ ] Subheadline `clamp(0.9rem, 2vw, 1.1rem)` — check legibility on 320px
- [ ] CTA buttons stack correctly on mobile (flex-wrap or flex-col?)
- [ ] Eyebrow label doesn't overlap video on tablet (768–1023px)
- [ ] `gap-x-[0.22em]` word spacing renders correctly at all font sizes

**Test viewports:** 320px, 360px, 375px, 390px, 412px, 428px, 640px, 768px, 1024px, 1280px, 1440px

---

### 2. StyleShowcase / SupportLine

**File:** `components/sections/StyleShowcase.tsx`, `SupportLine.tsx`

**Layout concern:** These sit directly below the hero. Check:

- [ ] No horizontal overflow on mobile
- [ ] Text doesn't bump into edges (padding at `px-4` or `px-6`?)
- [ ] Images (if any) scale correctly with `next/image`

---

### 3. ProblemSection

**File:** `components/sections/ProblemSection.tsx`

**Layout concern:** Pain point cards — likely a grid.

- [ ] Grid switches from 1-col → 2-col → 3-col at correct breakpoints
- [ ] Card heights equalize on multi-col grid (use `items-stretch` + flex-col)
- [ ] Unsplash image (from `NANOBANANA_VISUALS`) aspect ratio maintained

---

### 4. SolutionSection / HowItWorksSection

**File:** `components/sections/SolutionSection.tsx`, `HowItWorksSection.tsx`

**Layout concern:** Pipeline steps — numbered flow.

- [ ] Connector lines between steps hidden on mobile (vertical stack)
- [ ] Step icons don't clip below 375px
- [ ] Section min-height doesn't create excessive whitespace on desktop

---

### 5. WhoItsForSection

**File:** `components/sections/WhoItsForSection.tsx`

**Layout concern:** Audience tabs or cards.

- [ ] Tab labels truncate gracefully on narrow screens
- [ ] Active tab indicator is keyboard-accessible
- [ ] Content panel height doesn't jump on tab switch

---

### 6. WaitlistSection

**File:** `components/sections/WaitlistSection.tsx`, `waitlist-form.tsx`

**Notes:**

- Loaded `ssr: false` — no SSR HTML, mounts after hydration
- Glass card: `min-h-[400px]`, `max-w-3xl`, `p-8 sm:p-12`

**Check:**

- [ ] Form inputs don't overflow card padding on 320px
- [ ] Multi-step form step indicators are readable on mobile
- [ ] Submit button full-width on mobile, auto on desktop
- [ ] Error/success states lay out correctly (don't shift card height unexpectedly)

---

### 7. Footer

**File:** `components/layout/Footer.tsx`

**Check:**

- [ ] Logo watermark `w-1/2` doesn't overflow at `< 400px`
- [ ] Nav links wrap gracefully
- [ ] Social icons have adequate tap target size (min 44×44px)

---

## Debug Workflow

### Step 1 — Browser devtools inspection

```
1. Open http://localhost:3000 in Chrome
2. DevTools → Toggle device toolbar (Cmd/Ctrl + Shift + M)
3. Test each section at: 375px, 768px, 1024px, 1440px
4. Note any: overflow indicators (red border), text clipping, image distortion
```

### Step 2 — Overflow detection

Paste into browser console to highlight overflowing elements:

```js
document.querySelectorAll('*').forEach((el) => {
  if (el.offsetWidth > document.body.offsetWidth) {
    el.style.outline = '2px solid red';
    console.log('OVERFLOW:', el);
  }
});
```

### Step 3 — Playwright screenshot audit

```bash
# Full-page screenshots at key breakpoints
bun run test -- __tests__/preservation/
```

Or quick one-off:

```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const viewports = [
    { width: 320, height: 568, name: 'xs-iphonese1' },
    { width: 360, height: 780, name: 'xs-android' },
    { width: 375, height: 667, name: 'xs-iphonese2' },
    { width: 390, height: 844, name: 'xs-iphone14' },
    { width: 412, height: 915, name: 'xs-pixel6a' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1280, height: 800, name: 'desktop' },
  ];
  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: vp, reducedMotion: 'reduce' });
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: \`/tmp/anaqio-\${vp.name}.png\`, fullPage: true });
    console.log('Saved', vp.name);
  }
  await browser.close();
})();
"
```

### Step 4 — Targeted fixes

After identifying issues, fix by section in this priority order:

1. Hero (highest visual impact, above the fold)
2. WaitlistSection (conversion-critical)
3. ProblemSection / SolutionSection (SEO-critical content)
4. Footer

---

## Common Fix Patterns

| Issue                    | Pattern                                                              |
| ------------------------ | -------------------------------------------------------------------- |
| Text overflows container | Add `overflow-hidden` or `break-words` to wrapper                    |
| Image stretches wrong    | Ensure `next/image` has `width`/`height` or `fill` + `sizes` prop    |
| Grid doesn't collapse    | Check breakpoint prefix: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` |
| Flex children overflow   | Add `min-w-0` to flex children (overcomes default `min-width: auto`) |
| CTA buttons don't stack  | Use `flex-col sm:flex-row` on button group wrapper                   |
| Video clips on mobile    | Ensure `w-full max-w-xs` with `mx-auto` for centering                |
| Touch targets too small  | Add `min-h-[44px] min-w-[44px]` to interactive elements              |
| Padding inconsistent     | Use section-level `px-4 sm:px-6 lg:px-8` consistently                |

---

## Files Reference

```
components/sections/
├── VideoHeroSection.tsx       # Hero outer layout
├── atoms/
│   ├── HeroText.tsx           # Left column: headline, sub, CTAs
│   └── HeroVideoPlayer.tsx    # Right column: portrait video (aspect-[9/16])
├── ProblemSection.tsx
├── SolutionSection.tsx
├── HowItWorksSection.tsx
├── WhyAnaqioSection.tsx
├── WhoItsForSection.tsx
├── PhilosophySection.tsx
├── VisionSection.tsx
├── FinalCTA.tsx
└── WaitlistSection.tsx

components/layout/
└── Footer.tsx

components/ui/
├── section.tsx                # <Section> wrapper with consistent padding
└── section-header.tsx         # <SectionHeader> + <GradientText>
```
