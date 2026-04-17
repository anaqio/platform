# React Hooks Guide - ANAQIO

This document outlines the custom and library-provided hooks used in the ANAQIO codebase to ensure performance, scalability, and a superior user experience.

## Custom Hooks (@/hooks)

### 1. `useLocalStorage`

**Location:** `hooks/use-local-storage.ts`  
**Library:** `@uidotdev/usehooks`

**Description:** Persists state in the browser's `localStorage`. It synchronizes the state across tabs and handles serialization/deserialization automatically.

**Use Cases in ANAQIO:**

- **Form Persistence:** Saving progress in the multi-step waitlist form so users don't lose data on refresh.
- **User Preferences:** Storing theme (light/dark) or language preferences.
- **Session State:** Keeping track of interactive preview settings.

**Example:**

```tsx
const [formData, setFormData] = useLocalStorage('anaqio-form-data', initialValues)
```

---

### 2. `useWindowSize`

**Location:** `hooks/use-window-size.ts`  
**Library:** `@uidotdev/usehooks`

**Description:** Tracks the current window dimensions (`width` and `height`).

**Use Cases in ANAQIO:**

- **Responsive Logic:** Conditionally rendering desktop vs. mobile components when CSS media queries are insufficient.
- **Canvas Scaling:** Adjusting the size of AI relighting simulations or Remotion previews.
- **Video Hero:** Optimizing video aspect ratios based on real-time viewport changes.

**Example:**

```tsx
const { width } = useWindowSize()
const isDesktop = width > 1024
```

---

### 3. `useDebounce`

**Location:** `hooks/use-debounce.ts`  
**Library:** `@uidotdev/usehooks`

**Description:** Delays updating a value until a specified time has passed without further changes.

**Use Cases in ANAQIO:**

- **Search Optimization:** Debouncing search queries in the fashion asset library.
- **Input Validation:** Waiting for the user to stop typing before showing validation errors.
- **Real-time Preview:** Throttling expensive AI relighting updates during slider adjustments.

**Example:**

```tsx
const debouncedSearch = useDebounce(searchTerm, 300)
```

---

### 4. `useIntersectionObserver`

**Location:** `hooks/use-intersection-observer.ts`  
**Library:** `@uidotdev/usehooks`

**Description:** Detects when an element enters or leaves the viewport.

**Use Cases in ANAQIO:**

- **Lazy Loading:** Loading heavy fashion videos and assets only when they are about to become visible.
- **Scroll Animations:** Triggering Framer Motion transitions as sections scroll into view.
- **Active Navigation:** Updating the header navigation based on the current visible section.

**Example:**

```tsx
const [ref, entry] = useIntersectionObserver({ threshold: 0.1 })
const isVisible = entry?.isIntersecting
```

---

### 5. `useMultiStepForm`

**Location:** `hooks/use-multi-step-form.ts`  
**Custom Implementation**

**Description:** Specialized hook for managing complex, multi-step registration flows. Now enhanced with `useLocalStorage` for automatic state persistence.

**Features:**

- State management for form data and errors.
- Step-by-step validation.
- Animation state control.
- **Automatic Persistence:** Saves data to `localStorage` using a configurable key.

---

### 6. `useLazyVideo`

**Location:** `hooks/use-lazy-video.ts`  
**Custom Implementation**

**Description:** Optimized hook for lazy-loading `<video>` elements.

**Features:**

- Uses Intersection Observer to defer loading.
- Tracks `loadeddata` state for smooth transitions.
- Supports `eager` loading for critical assets.

---

## Best Practices

1. **DRY (Don't Repeat Yourself):** Always check if a hook exists in `@uidotdev/usehooks` before implementing a custom one.
2. **Server-Side Safety:** Ensure hooks that access browser APIs (like `window` or `localStorage`) are only used within `useEffect` or in Client Components.
3. **Type Safety:** Use TypeScript generics to ensure state managed by hooks is correctly typed.
