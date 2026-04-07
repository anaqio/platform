# Design System Specification: High-End Editorial Fashion Tech

## 1. Overview & Creative North Star: "The Digital Atelier"

The Creative North Star for this design system is **"The Digital Atelier."** It represents a collision between the heritage of Moroccan luxury and the precision of future-facing AI. This is not a standard SaaS interface; it is a curated editorial experience.

To break the "template" look, we move away from rigid, centered grids in favor of **Intentional Asymmetry**. Large-scale typography should overlap high-definition imagery, and UI elements should feel like they are floating on layers of silk and obsidian. The aesthetic is "Vogue meets AI"—confident, minimal, and unapologetically premium.

---

## 2. Colors & Tonal Depth

The palette is anchored in **Ink (#0F172A)** and **Navy (#1B2F52)**, using depth rather than lines to define structure.

### Surface Hierarchy & The "No-Line" Rule

- **The Proscription:** 1px solid borders are strictly prohibited for sectioning.
- **The Principle:** Boundaries are defined solely through background color shifts. Use the `surface_container` tiers to create "nested" depth.
  - **Main Canvas:** `surface` (#0b1326).
  - **Secondary Sections:** `surface_container_low` (#131b2e).
  - **Prominent Cards/Modules:** `surface_container_high` (#222a3d).
- **Signature Accents:** Use **Gold (#D4AF37)** for high-value moments (icons, rewards, premium features) and **Lime (#CCFF33)** exclusively for high-velocity Action CTAs.

### The "Glass & Gradient" Rule

To avoid a flat "out-of-the-box" look:

- **Floating Elements:** Use `surface_variant` with a 60% opacity and a `20px` backdrop-blur to create a "frosted glass" effect for navigation bars and overlays.
- **CTAs:** Apply a subtle linear gradient to Lime buttons (from `#CCFF33` to `#a8d700`) to provide a tactile, "lit from within" glow.

---

## 3. Typography: Editorial Authority

The typography system creates a rhythmic contrast between the avant-garde and the functional.

- **Display & Headline (Syne Bold / Epilogue):** These are your "Vogue" moments. Use `display-lg` and `headline-lg` with tight letter-spacing (-0.04em). These should feel massive and architectural. Don't be afraid to let a headline bleed off-center or overlap a photo edge.
- **Body & UI (Plus Jakarta Sans):** This provides the "AI Precision." It is hyper-legible and modern.
  - **Body-lg:** Use for editorial intros.
  - **Body-md:** Standard reading.
  - **Label-md:** All-caps with increased letter-spacing (+0.08em) for metadata and small tags.

---

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are too "software-standard" for this system. We use light and layering to imply status.

- **Layering Principle:** Instead of shadows, stack containers. Place a `surface_container_highest` card on a `surface_container_low` background. This creates a soft, natural lift.
- **Ambient Shadows:** If a floating effect is required (e.g., a modal), use an ultra-diffused shadow:
  - `box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5);`
  - The shadow should feel like a soft glow of darkness, not a hard edge.
- **The Ghost Border Fallback:** If a container requires more definition against a complex image, use a "Ghost Border": `outline_variant` at 15% opacity. Never use 100% opaque lines.

---

## 5. Components

### Buttons & CTAs

- **Primary (The "Pulse"):** Lime (#CCFF33) background, Ink text. 999px radius. Bold, high-contrast.
- **Secondary (The "Gold Standard"):** Ghost button with Gold (#D4AF37) text and a Gold "Ghost Border."
- **Tertiary:** Off-white text with a subtle underline that expands on hover.

### Inputs & Fields

- **Styling:** `12px` border radius. Background set to `surface_container_highest`.
- **States:** On focus, the border doesn't change color; instead, the background shifts to a slightly lighter tint, and the label (Plus Jakarta Sans) floats with a Gold accent color.

### Cards & Lists

- **Rule:** Forbid divider lines.
- **Execution:** Use the Spacing Scale (specifically `spacing-8` or `spacing-12`) to create "Active Negative Space." Use `surface_container_low` for the list item background on hover to indicate interactivity.
- **Radius:** Cards must strictly follow the `16px` (1rem) roundedness scale.

### Signature Component: The "Editorial Mask"

A specialized image container for fashion photography that uses a subtle Moroccan-inspired geometric clipping path or a soft gradient fade into the `surface` color, making the model appear as if they are emerging from the interface.

---

## 6. Do’s and Don’ts

### Do:

- **DO** use extreme scale. Pair a `display-lg` headline with `body-sm` metadata for a high-fashion look.
- **DO** use the **Lime (#CCFF33)** sparingly. It is a "laser pointer" for the user's eye.
- **DO** leverage "Active Negative Space"—let elements breathe more than you think they should.

### Don't:

- **DON’T** use 1px solid borders to separate sections. Use color shifts.
- **DON’T** use standard blue for links. Use Gold or Off-white.
- **DON’T** use pure black (#000000). Always use **Ink (#0F172A)** to maintain depth and color-richness.
- **DON'T** center-align everything. Modern editorial design thrives on a strong left-aligned axis or purposeful staggered layouts.
