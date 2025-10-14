# Instagram Icon Overlay Feature

**Status**: 🚧 WIP - Not Started  
**Priority**: LOW (Future Enhancement)  
**Dependencies**: `01_GRID_REFACTOR.md` (MUST be completed first)  
**Branch**: `feat/insta` (separate branch recommended)

---

## Problem Statement

Add visual indication that photo is clickable link to Instagram profile. Show Instagram icon on hover/focus for desktop users.

**Requires**: Clean grid layout from `01_GRID_REFACTOR.md` as foundation.

---

## Design Goals

1. **Visual affordance**: Show icon when user hovers/focuses photo
2. **Subtle overlay**: Don't obscure photo too much (semi-transparent)
3. **Desktop only**: Touch devices don't need hover hints
4. **Accessible**: Keyboard focus should trigger same effect

---

## HTML Structure

The Instagram overlay feature requires changing the big photo element from a `<div>` to an `<a>` link:

```html
<!-- Small photo (mobile/tablet) - non-interactive DIV -->
<div class="hello-world__my-photo--small is-image-circle"></div>

<!-- Big photo (desktop) - interactive LINK -->
<a class="hello-world__my-photo is-image-circle" 
   href="https://www.instagram.com/pzentala/" 
   target="_blank" 
   rel="noopener noreferrer"
   aria-label="Visit my Instagram profile @pzentala">
</a>
```

### Link Attributes (Desktop element only)

- **`href`**: Instagram profile URL (`https://www.instagram.com/pzentala/`)
- **`target="_blank"`**: Opens in new tab (doesn't navigate away from site)
- **`rel="noopener noreferrer"`**: Security best practice (prevents window.opener exploits)
- **`aria-label`**: Descriptive text for screen readers (since there's no visible text)

**Why `<a>` instead of `<div>`?**
- Semantic HTML: Photo IS a clickable element
- Keyboard accessible: Users can Tab to it and press Enter
- Screen readers: Announced as link with purpose
- SEO: Search engines understand it's a social profile link

---

## Specification

### When to Show Icon

**ONLY on Desktop (≥1200px) with hover capability:**

```scss
@media (min-width: 1200px) and (hover: hover) and (pointer: fine) {
  .hello-world__my-photo:hover::before,
  .hello-world__my-photo:focus-visible::before {
    opacity: 0.5; // Or 0.3-0.6, to be determined
  }
}
```

### Icon Implementation

**Using Font Awesome pseudo-element:**

```scss
.hello-world__my-photo::before {
  content: "\f16d"; // Font Awesome Instagram icon
  font-family: "Font Awesome 6 Brands";
  font-weight: 400;
  
  // Positioning
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  
  // Styling
  color: #000; // Black (or white? TBD)
  opacity: 0; // Hidden by default
  transition: opacity 0.3s ease-out;
  font-size: 60cqw; // Container query units - ~60% of photo width
  
  // Accessibility
  pointer-events: none; // Don't block clicks
  
  // Visual enhancement
  filter: drop-shadow(0 0 2px rgba(0,0,0,0.4));
}
```

### Photo Zoom on Hover

Already specified in `01_GRID_REFACTOR.md` STATE 6:

```scss
@media (min-width: 1200px) and (hover: hover) and (pointer: fine) {
  .hello-world__my-photo:hover {
    transform: scale(1.05);
    transition: transform 0.3s ease-out;
  }
}
```

**Combined effect**: Photo grows slightly + icon fades in

---

## Design Decisions to Make

### 1. Icon Color
- **Black** (`#000`) - Classic, contrasts well with photo
- **White** (`#fff`) - Lighter, may need stronger shadow
- **Instagram gradient** - Brand colors, might be too busy

**Recommendation**: Start with black at 0.5 opacity, test and adjust.

### 2. Icon Opacity
- `0.3` - Very subtle, almost hidden
- `0.5` - Balanced, clear but not obtrusive **(current choice)**
- `0.6` - More prominent
- `0.8+` - Too strong, obscures photo

### 3. Icon Size
- `40cqw` - Small, minimalist
- `60cqw` - Medium, clear **(current choice)**
- `80cqw` - Large, dominant

**Note**: Using container query units (`cqw`) makes icon scale with photo size automatically.

### 4. Background Overlay?
Do we add semi-transparent background behind icon?

```scss
.hello-world__my-photo:hover::after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2); // Dark overlay
  opacity: 0;
  transition: opacity 0.3s ease-out;
}

.hello-world__my-photo:hover::after {
  opacity: 1;
}
```

**Pros**: Makes icon more readable, adds depth  
**Cons**: Darkens photo, more complex

**Recommendation**: Start without, add only if icon isn't visible enough.

---

## Alternative: Social Media Badge

Instead of hover-only icon, show persistent badge in corner?

```scss
.hello-world__my-photo::after {
  content: "\f16d";
  font-family: "Font Awesome 6 Brands";
  position: absolute;
  bottom: 10%;
  right: 10%;
  font-size: 2rem;
  color: #fff;
  background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
  padding: 0.5rem;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
```

**Pros**: Always visible, Instagram branding  
**Cons**: Permanent visual clutter, covers photo

**Decision**: Stick with hover-only for now. Badge could be alternate branch.

---

## Implementation Steps

1. ✅ Complete grid refactor first (`01_GRID_REFACTOR.md`)
2. Add `::before` pseudo-element for icon
3. Style icon (center, size, color)
4. Add opacity transition
5. Hook into hover/focus states (desktop only)
6. Test with keyboard navigation
7. Test across different photo sizes (icon should scale)
8. Verify `prefers-reduced-motion` disables transition

---

## Testing Checklist

### Desktop (≥1200px, mouse)
- [ ] Icon appears on hover
- [ ] Icon appears on keyboard focus (Tab key)
- [ ] Icon fades in smoothly (0.3s)
- [ ] Icon is centered on photo
- [ ] Icon size scales with photo
- [ ] Icon doesn't block clicks
- [ ] Photo zooms while icon appears
- [ ] Both transitions feel smooth together

### Desktop (≥1200px, touch)
- [ ] NO icon on tap (hover:hover prevents it)
- [ ] Photo still links to Instagram
- [ ] No stuck hover states

### Mobile/Tablet (<1200px)
- [ ] NO icon at all
- [ ] NO zoom effect
- [ ] Photo is not a link (small DIV, not anchor)

### Accessibility
- [ ] `prefers-reduced-motion` disables all transitions
- [ ] Keyboard focus triggers same effect as hover
- [ ] Screen reader announces link purpose (aria-label)
- [ ] Tab order is logical

---

## Known Issues from v1

From `DOING_INSTA_WIP.md`:

1. **Layout shifts**: Icon caused image to jump
   - **Solution**: Use `::before` with `position: absolute`, `pointer-events: none`

2. **Mobile accidental taps**: Icon showed on touch
   - **Solution**: Use `@media (hover: hover)` to exclude touch

3. **Orientation confusion**: Icon behavior inconsistent 900-1200px
   - **Solution**: New grid makes states clear, icon only ≥1200px

4. **Image too large**: Photo sizing was wrong
   - **Solution**: Fixed in grid refactor, icon builds on that

---

## Code Location

All Instagram overlay code goes in `src/scss/_photo.scss`, within the desktop section:

```scss
// ============================================
// DESKTOP (≥1200px) - Interactive photo
// ============================================

.hello-world__my-photo {
  // ... base styles ...
}

// Instagram icon (desktop only)
.hello-world__my-photo::before {
  // ... icon styles ...
}

@media (min-width: 1200px) and (hover: hover) and (pointer: fine) {
  .hello-world__my-photo:hover,
  .hello-world__my-photo:focus-visible {
    transform: scale(1.05);
  }
  
  .hello-world__my-photo:hover::before,
  .hello-world__my-photo:focus-visible::before {
    opacity: 0.5;
  }
}
```

---

## Alternative Approaches

### 1. Separate overlay element (not pseudo)
```html
<a class="hello-world__my-photo">
  <span class="photo-overlay">
    <i class="fab fa-instagram"></i>
  </span>
</a>
```

**Pros**: More control, easier to style complex overlays  
**Cons**: Extra HTML, more complex

### 2. CSS filter effects
```scss
.hello-world__my-photo:hover {
  filter: brightness(0.8) contrast(1.1);
}
```

**Pros**: Photo itself changes, no overlay needed  
**Cons**: No Instagram branding, just generic darkening

### 3. Text link below photo
```html
<a href="...">
  <div class="photo"></div>
  <span>@pzentala on Instagram</span>
</a>
```

**Pros**: Always visible, explicit call-to-action  
**Cons**: Takes more space, less elegant

**Decision**: Stick with pseudo-element overlay (clean, minimal HTML).

---

## Success Criteria

✅ Icon appears ONLY on desktop with mouse  
✅ Icon is centered and properly sized  
✅ Icon opacity provides good visibility without obscuring photo  
✅ Transitions are smooth (unless reduced motion)  
✅ Keyboard users get same experience  
✅ Touch devices don't show icon  
✅ No layout shifts or jumps  
✅ Accessible for all users  

---

## Future Enhancements

- Multiple social icons (Instagram, LinkedIn, GitHub)
- Animated icon appearance (fade + scale)
- Custom Instagram gradient background
- Stats overlay (followers count, etc.)
- Multiple photos in carousel

**Keep it simple first!** Start with basic Instagram icon, iterate if needed.

---

**Previous**: Complete `01_GRID_REFACTOR.md` first  
**Current**: This document (WIP - not started)  
**Next**: Create branch `feat/insta` and implement when grid is solid

---

## Historical Context

See `DOING_INSTA_WIP.md` (root) for full v1 attempt and lessons learned.

**Key lesson**: Get the grid and layout right FIRST, then add overlays. Don't try to do both at once.

