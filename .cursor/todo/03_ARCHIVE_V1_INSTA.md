# ARCHIVE: v1 Instagram Overlay Attempt

**Status**: 🗃️ Archived - Historical reference  
**Date**: October 2025  
**Outcome**: Incomplete - issues with layout and orientation handling

---

## Purpose of this Archive

This documents the first attempt at implementing Instagram icon overlay feature. It encountered several issues and was paused. This archive helps us:
1. Understand what was tried
2. Learn from mistakes
3. Avoid repeating same problems in v2

**Current approach**: See `02_INSTA_OVERLAY.md` for v2 design (builds on grid refactor)

---

## Feature Description

Add Instagram icon overlay on photo hover/focus with link to profile.

---

## Original Specification (v1 summary)

Breakpoints in code:
- md: 900px (from src/scss/_variables.scss)
- We effectively had 2 ranges, but behaviors across sizes created 3 perceived states (small, mid, large)

v1 Intended behavior:
1) Small screens (< md)
- No Instagram icon
- No zoom
- No link (non-clickable)
- Left-aligned image

2) Large screens (≥ md)
- Instagram icon on hover/focus (black, opacity 0.3)
- Zoom on hover/focus (scale ≈ 1.05)
- Whole image links to https://www.instagram.com/pzentala/

## v1 Actual issues encountered

- Initial overlay (.photo wrapper) caused layout shifts: duplicate images, clipping on zoom, incorrect centering.
- Mobile: accidental zoom and link taps; icon persisted where it shouldn't.
- Migration to single element (`.hello-world__my-photo`) removed wrapper but required redoing icon via ::before.
- Orientation confusion: behaviors seemed different near 900–1200px; spacer `.hello-world__margin` visibility inconsistent.
- Image scale felt too big at some widths; desired size closer to typography behavior; small should be fixed size unless space is tight.

## What we changed in v1

- Single source of truth in `src/scss/_photo.scss` targeting `.hello-world__my-photo` (+ `::before`).
- Desktop (≥ md): big anchor only; hover zoom + icon 0.3 black; small hidden.
- Mobile (< md): small div only; no zoom/icon/link; left-aligned; big hidden.
- Fixed spacer visibility and removed float on small; added clamp width (may oversize at max width).

## Current pain points (as reported)

- Image too large on max width and mid range.
- On small, size should be constant unless space runs out.
- Behavior felt like 3 states; need explicit sizing rules.

## Proposed v2 spec (clear sizes and behavior)

Breakpoints:
- sm: 600px
- md: 900px
- lg: 1200px

Elements:
- Big (desktop/tablet): a.hello-world__my-photo.is-image-circle
- Small (mobile): div.hello-world__my-photo--small.is-image-circle

State A: Mobile (< md)
- Visible: Small
- Size: fixed 240px (clamp to 180–260px if container smaller)
- Interaction: no zoom, no icon, no link
- Alignment: left

State B: Tablet (≥ md and < lg)
- Visible: Big
- Size: 36vw (clamp 320–480px)
- Interaction: hover/focus zoom 1.05, icon ::before black 0.3
- Link: enabled

State C: Desktop (≥ lg)
- Visible: Big
- Size: fixed 420px (no further growth)
- Interaction: hover/focus zoom 1.05, icon ::before black 0.3
- Link: enabled

## Accessibility & Motion

- respects prefers-reduced-motion (no transitions)
- aria-label/rel/target on link

## Test plan (Playwright)

- Desktop (chromium):
  - Big visible; Small hidden
  - Hover => transform scale ~1.05
  - ::before opacity ≥ 0.25 and content present
  - Link opens Instagram
  - Computed width ~420px (± tolerance)
- Tablet (iPhone 12 landscape or custom viewport 1024x768):
  - Big visible
  - Width within 320–480px range (36vw with clamps)
  - Hover behavior as desktop (when hover-capable)
- Mobile portrait (iPhone 12):
  - Small visible; Big hidden
  - No icon (::before none)
  - No link descendants
  - Width ~240px (within 180–260px tolerance)

---

## Key Lessons Learned

1. **Don't mix concerns**: Layout (grid) and overlay (icon) are separate problems
2. **Orientation matters**: Can't just use width breakpoints
3. **Test early**: Mobile landscape was blind spot
4. **Foundation first**: Get basic layout right before adding effects

---

## What Changed in v2 Approach

1. **Grid refactor first** (`01_GRID_REFACTOR.md`)
   - 6 states: Mobile/Tablet/Desktop × Horizontal/Vertical
   - Orientation-aware layout
   - Clean foundation

2. **Instagram overlay second** (`02_INSTA_OVERLAY.md`)
   - Builds on solid grid
   - Desktop-only feature
   - Separate branch for isolation

3. **Testing strategy**
   - Manual testing on real devices
   - Check all 6 orientation/size states
   - Verify touch vs mouse behavior

---

## Related Files

- **Current spec**: `.cursor/todo/02_INSTA_OVERLAY.md`
- **Grid spec**: `.cursor/todo/01_GRID_REFACTOR.md`
- **Old code**: `src/scss/_photo.scss` (to be rewritten)

---

**This archive is for reference only. Do not implement from this document.**

Use `02_INSTA_OVERLAY.md` for current design decisions.

