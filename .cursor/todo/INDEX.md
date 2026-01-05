# Project TODO & Documentation Index

## 🎯 Active Tasks

1. **[Grid & Photo Layout Refactor](./01_GRID_REFACTOR.md)** 🚀 IN PROGRESS
   - Orientation-based responsive layout (horizontal/vertical)
   - 6 states: Mobile/Tablet/Desktop × Horizontal/Vertical
   - Proportional sizing with vw + clamp()
   - Clean foundation for future features

2. **[Instagram Icon Overlay](./02_INSTA_OVERLAY.md)** 🚧 WIP - Not Started
   - Hover icon effect (desktop only)
   - Depends on: `01_GRID_REFACTOR.md`
   - Separate branch: `feat/insta`

3. **[Interactive Tooltips & Hover Effects](./04_TOOLTIPS_HOVER.md)** 📋 Planning
   - Informative tooltips for social media, links, terms
   - Business analysis & content strategy phase
   - Desktop-only enhancement

## 📋 Backlog

- Rewrite to TSX and build before publishing
- Autogenerate all-size icons from one icon source

---

## 📚 Documentation Structure

### Core Layout
- **`01_GRID_REFACTOR.md`** - Main layout system (orientation-aware grid)
  - Foundation for all photo features
  - Must be completed before other photo enhancements

### Enhancement Features  
- **`02_INSTA_OVERLAY.md`** - Instagram icon on hover
  - Builds on grid refactor
  - Desktop-only interactive feature
  - Optional enhancement (can be skipped)

- **`04_TOOLTIPS_HOVER.md`** - Interactive tooltips system
  - Informative hover effects for all key elements
  - Business analysis & content strategy documentation
  - Desktop-only (no mobile tooltips)
  - Independent feature (can run parallel)

### Archive
- **`03_ARCHIVE_V1_INSTA.md`** - Historical context from v1 attempt (lessons learned)

---

## 🔗 Dependencies

```
01_GRID_REFACTOR.md (foundation)
         ↓
02_INSTA_OVERLAY.md (depends on grid)

04_TOOLTIPS_HOVER.md (independent, can run parallel)
```

**Rules**: 
- Complete grid refactor before Instagram overlay (ensures clean code)
- Tooltips system is independent and can be developed in parallel
- All features are desktop-first (mobile enhancements come later)

---

Last updated: 2025-10-14
