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

### Archive
- **`03_ARCHIVE_V1_INSTA.md`** - Historical context from v1 attempt (lessons learned)

---

## 🔗 Dependencies

```
01_GRID_REFACTOR.md (foundation)
         ↓
02_INSTA_OVERLAY.md (enhancement)
```

**Rule**: Complete grid refactor fully before starting Instagram overlay. This ensures clean, maintainable code.

---

Last updated: 2025-10-13
