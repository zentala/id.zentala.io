# Grid & Photo Layout Refactor

**Status**: 🎯 Active - Implementation in Progress  
**Priority**: HIGH  
**Dependencies**: None  
**Blocks**: `02_INSTA_OVERLAY.md`

---

## Problem Statement

Current photo layout uses breakpoints only (900px, 1200px) without considering screen orientation. This creates confusing behavior where:
- Tablet landscape (1024×768) behaves differently than tablet portrait (768×1024)
- Phone landscape sometimes shows desktop layout
- Photo sizing doesn't scale proportionally with screen

**We need**: Orientation-aware layout that works predictably across all device sizes.

---

## Design Philosophy

1. **Orientation determines layout direction**
   - Horizontal (landscape) → photo RIGHT of text
   - Vertical (portrait) → photo ABOVE text

2. **Screen size determines photo size**
   - Use viewport units (vw) with safety limits (clamp)
   - Proportional scaling maintains visual balance

3. **Device type determines interactivity**
   - Desktop (≥1200px) → hover zoom effect
   - Mobile/Tablet → no effects (touch-first, static display)

---

## Breakpoints

From `src/scss/_variables.scss`:
```scss
$breakpoints: (
  xl: 1600px,
  lg: 1200px,  // Desktop threshold
  md: 900px,   // Tablet threshold
  sm: 600px,   // Mobile threshold
  xs: 0px
)
```

---

## 6 Layout States (Device × Orientation)

### Device Categories:
- **Mobile**: < 600px
- **Tablet**: 600px - 1199px
- **Desktop**: ≥ 1200px

### States Matrix:

| # | Device | Orientation | Photo Element | Position | Size (clamp) |
|---|--------|-------------|---------------|----------|--------------|
| **1** | Mobile | Vertical | Small DIV | ABOVE text | `clamp(200px, 50vw, 350px)` |
| **2** | Mobile | Horizontal | Small DIV | RIGHT of text | `clamp(160px, 35vw, 240px)` |
| **3** | Tablet | Vertical | Small DIV | ABOVE text | `clamp(240px, 45vw, 380px)` |
| **4** | Tablet | Horizontal | Small DIV | RIGHT of text | `clamp(220px, 30vw, 320px)` |
| **5** | Desktop | Vertical | Big photo | RIGHT column | `clamp(320px, 35vw, 420px)` |
| **6** | Desktop | Horizontal | Big photo | RIGHT column | `clamp(360px, 28vw, 450px)` |

---

## Detailed Specifications

### STATE 1: Mobile Vertical (Portrait)
**Example**: iPhone 12 (390×844), iPhone 14 Pro (393×852)

```scss
@media (max-width: 599px) and (orientation: portrait) {
  // Small DIV shown, Big photo hidden
  .hello-world__my-photo { display: none; }
  .hello-world__my-photo--small {
    display: block;
    width: clamp(200px, 50vw, 350px);
    margin: 0 0 1.5rem 0; // Space below photo
  }
}
```

**Behavior**:
- ✅ Photo displayed ABOVE text (stacked vertically)
- ✅ Left-aligned with text
- ✅ NO hover, NO zoom, NO effects
- ✅ Margin-bottom: 1.5rem (separation from text)

---

### STATE 2: Mobile Horizontal (Landscape)
**Example**: iPhone 12 landscape (844×390), iPhone 14 Pro landscape (852×393)

```scss
@media (max-width: 599px) and (orientation: landscape) {
  .hello-world__my-photo { display: none; }
  .hello-world__my-photo--small {
    display: block;
    width: clamp(160px, 35vw, 240px);
    float: right;
    margin: 0 0 1rem 1rem; // Space on left and bottom
  }
}
```

**Behavior**:
- ✅ Photo on RIGHT side (float right)
- ✅ Text wraps around on left
- ✅ Smaller than portrait (doesn't dominate narrow height)
- ✅ NO hover, NO zoom, NO effects
- ✅ Margin-left: 1rem (separation from text)

---

### STATE 3: Tablet Vertical (Portrait)
**Example**: iPad (768×1024), iPad Mini (744×1133)

```scss
@media (min-width: 600px) and (max-width: 1199px) and (orientation: portrait) {
  .hello-world__my-photo { display: none; }
  .hello-world__my-photo--small {
    display: block;
    width: clamp(240px, 45vw, 380px);
    margin: 0 0 2rem 0; // Larger space below
  }
}
```

**Behavior**:
- ✅ Photo ABOVE text
- ✅ Larger than mobile (more screen space available)
- ✅ NO hover, NO zoom, NO effects
- ✅ Margin-bottom: 2rem (comfortable spacing)

---

### STATE 4: Tablet Horizontal (Landscape)
**Example**: iPad landscape (1024×768), Surface Go landscape (1366×768)

```scss
@media (min-width: 600px) and (max-width: 1199px) and (orientation: landscape) {
  .hello-world__my-photo { display: none; }
  .hello-world__my-photo--small {
    display: block;
    width: clamp(220px, 30vw, 320px);
    float: right;
    margin: 0 0 1.5rem 1.5rem;
  }
}
```

**Behavior**:
- ✅ Photo RIGHT of text
- ✅ Medium size (balanced with text)
- ✅ NO hover, NO zoom, NO effects
- ✅ Margin-left: 1.5rem

---

### STATE 5: Desktop Vertical (Portrait - rare)
**Example**: Rotated monitor, ultrawide portrait (1200×1920)

```scss
@media (min-width: 1200px) and (orientation: portrait) {
  .hello-world__my-photo--small { display: none; }
  .hello-world__my-photo {
    display: block;
    width: clamp(320px, 35vw, 420px);
    // Grid positions in right column
  }
}
```

**Behavior**:
- ✅ Big photo shown (not small DIV)
- ✅ RIGHT column in grid (not above text)
- ⚠️ **Hover/zoom**: Only if `hover: hover` media query matches (see STATE 6)

---

### STATE 6: Desktop Horizontal (Landscape - common)
**Example**: MacBook (1440×900), Desktop (1920×1080), 4K (3840×2160)

```scss
@media (min-width: 1200px) and (orientation: landscape) {
  .hello-world__my-photo--small { display: none; }
  .hello-world__my-photo {
    display: block;
    width: clamp(360px, 28vw, 450px);
    // Grid positions in right column
  }
  
  // Hover zoom (only if hover capable)
  @media (hover: hover) and (pointer: fine) {
    .hello-world__my-photo:hover {
      transform: scale(1.05);
      transition: transform 0.3s ease-out;
    }
  }
}
```

**Behavior**:
- ✅ Big photo shown
- ✅ RIGHT column in grid
- ✅ **Hover zoom**: `scale(1.05)` - ONLY when mouse available
- ✅ Smooth transition: 0.3s ease-out

---

## Size Rationale

### Why these specific sizes?

**Mobile Vertical (50vw)**: 
- Phone ~390px wide → 195px photo (with min 200px = 200px)
- Phone ~414px wide → 207px photo
- ✅ Visible but not overwhelming

**Mobile Horizontal (35vw)**:
- Phone landscape ~844px wide → 295px photo (capped at 240px)
- ✅ Smaller due to limited height

**Tablet Vertical (45vw)**:
- Tablet ~768px wide → 346px photo (capped at 380px)
- ✅ Prominent but balanced

**Tablet Horizontal (30vw)**:
- Tablet landscape ~1024px wide → 307px photo
- ✅ Comfortable side-by-side

**Desktop Vertical (35vw)**:
- Desktop ~1200px wide → 420px photo (at cap)
- ✅ Focal point

**Desktop Horizontal (28vw)**:
- Desktop ~1440px wide → 403px photo
- Desktop ~1920px wide → 538px photo (capped at 450px)
- ✅ Balanced with text content

---

## Spacing Strategy

### Vertical Spacing (Photo above text):
- Mobile: `1.5rem` → ~24px
- Tablet: `2rem` → ~32px
- Desktop: Grid handles spacing

### Horizontal Spacing (Photo right of text):
- Mobile: `1rem` → ~16px
- Tablet: `1.5rem` → ~24px
- Desktop: Grid column gap

**Why different?** 
- Portrait: More vertical space available, can breathe
- Landscape: Limited height, tighter spacing

---

## Interactivity Rules

### Hover Effects (Desktop ONLY)

Only apply when:
1. ✅ Screen width ≥ 1200px
2. ✅ Device has hover capability: `@media (hover: hover)`
3. ✅ Device has precise pointer: `@media (pointer: fine)`

This prevents:
- ❌ Touch devices accidentally triggering hover
- ❌ Stylus/coarse pointers getting stuck states
- ❌ Mobile Safari hover bugs

```scss
@media (min-width: 1200px) and (hover: hover) and (pointer: fine) {
  .hello-world__my-photo:hover {
    transform: scale(1.05);
  }
}
```

### No Effects on Mobile/Tablet

Reasons:
- Touch doesn't have hover state
- Zoom can cause layout shifts
- Better performance on low-power devices
- Cleaner, simpler presentation

---

## HTML Structure

Two conditional elements (which one is shown depends on CSS media queries):

```html
<!-- Small photo (mobile/tablet) -->
<div class="hello-world__my-photo--small is-image-circle"></div>

<!-- Big photo (desktop) -->
<div class="hello-world__my-photo is-image-circle"></div>
```

**Note**: The actual HTML implementation may use different elements (e.g., `<a>` for semantic/functional reasons). See `02_INSTA_OVERLAY.md` for clickable/interactive features.

---

## Implementation Checklist

- [ ] Remove old photo styles from `src/scss/_hello-world.scss` (lines 169-199)
- [ ] Create new `src/scss/_photo.scss` with 6 states
- [ ] Test each state in browser DevTools
- [ ] Verify no hover on touch devices
- [ ] Check margins/spacing at all breakpoints
- [ ] Verify grid layout positions correctly
- [ ] Test `prefers-reduced-motion`
- [ ] Test keyboard navigation and focus states

---

## Testing Matrix

| Device | Viewport | Orientation | Expected Photo | Expected Size | Hover? |
|--------|----------|-------------|----------------|---------------|--------|
| iPhone 12 | 390×844 | portrait | small DIV, above | ~200px | NO |
| iPhone 12 | 844×390 | landscape | small DIV, right | ~240px | NO |
| iPad Mini | 744×1133 | portrait | small DIV, above | ~335px | NO |
| iPad | 1024×768 | landscape | small DIV, right | ~307px | NO |
| MacBook Air | 1440×900 | landscape | big photo, right | ~403px | YES |
| Desktop | 1920×1080 | landscape | big photo, right | ~450px | YES |

---

## Accessibility

### Reduced Motion
```scss
@media (prefers-reduced-motion: reduce) {
  .hello-world__my-photo {
    transition: none !important;
    transform: none !important;
  }
}
```

### Focus States
All interactive elements must have visible focus indicators for keyboard navigation.

---

## Files to Modify

1. **`src/scss/_photo.scss`** (COMPLETE REWRITE)
   - Remove old breakpoint logic
   - Add 6-state orientation-based logic
   - Implement hover zoom for desktop only

2. **`src/scss/_hello-world.scss`** (REMOVE old code)
   - Delete lines 169-199 (old photo styles)
   - Keep animation/layout code
   - Grid structure stays

3. **`src/index.html`** (NO CHANGES NEEDED)
   - Already has both elements
   - Already has correct classes

---

## Notes

- This grid refactor is FOUNDATION for future features
- Keep implementation simple and clean
- Focus on layout, positioning, and sizing ONLY
- Interactive features (overlays, icons, etc.) are separate concerns

---

## Success Criteria

✅ Photo appears in correct position on all 6 states  
✅ Photo sizes scale proportionally with screen  
✅ Margins provide comfortable spacing  
✅ Hover zoom only works on desktop with mouse  
✅ No layout shifts or jumps  
✅ Smooth transitions (when motion allowed)  
✅ Accessible for keyboard/screen reader users  

---

**Next**: See `02_INSTA_OVERLAY.md` for interactive overlay features (separate implementation)
