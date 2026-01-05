# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Modern, minimalistic personal homepage for developers. Single-page application built with Parcel.js bundler, hosted serverless on GitHub Pages.

**Tech Stack:** SCSS, HTML5, JavaScript
**Build Tool:** Parcel.js v2
**Package Manager:** pnpm (required - do NOT use npm)
**Node Version:** 22+ (managed via nvm, specified in .nvmrc)

## Common Commands

### Development
```bash
pnpm run dev
```
Starts Parcel dev server on http://localhost:2000/ with hot reload. Builds to `deploy/` directory.

### Deploy to GitHub Pages
```bash
pnpm run deploy
```
Full deployment pipeline:
1. `deploy:clean` - Removes `deploy/` directory
2. `deploy:build` - Production build via Parcel
3. `deploy:setup` - Adds CNAME file with domain (id.zentala.io)
4. `deploy:push` - Pushes `deploy/` to `deploy` branch via gh-pages

### Individual Deploy Steps
```bash
pnpm run deploy:clean   # Clean build directory
pnpm run deploy:build   # Build only
pnpm run deploy:setup   # Add CNAME
pnpm run deploy:push    # Push to deploy branch
```

## Architecture

### Project Structure
```
src/
├── index.html           # Single-page entry point
├── index.js             # Main JavaScript entry
├── js/                  # JavaScript modules
├── scss/                # SCSS stylesheets (modular)
│   ├── index.scss       # Main SCSS entry (imports all modules)
│   ├── _reset.scss      # CSS reset
│   ├── _variables.scss  # SCSS variables
│   ├── _functions.scss  # SCSS functions
│   ├── _typography.scss # Typography styles
│   ├── _colors.scss     # Color definitions
│   ├── _helpers.scss    # Helper classes
│   ├── _general.scss    # General styles
│   ├── _grid.scss       # Grid system
│   ├── _buttons.scss    # Button styles
│   ├── _hello-world.scss    # Homepage specific styles
│   ├── _video-hero.scss     # Video background component
│   └── _social-media.scss   # Social media links
├── img/                 # Images and videos
└── [favicon/manifest files]
```

### SCSS Architecture
Modular SCSS following partial pattern. `scss/index.scss` imports all modules using `@use` directive:
1. Framework modules (reset, variables, functions, typography, colors, helpers, general, grid, buttons)
2. Page-specific modules (hello-world, video-hero, social-media)

### Deployment Architecture
- **Source Branch:** main (default development branch)
- **Deploy Branch:** deploy (auto-generated, GitHub Pages serves from this)
- **Domain:** Custom domain via CNAME (id.zentala.io)
- **Build Output:** `deploy/` directory (git-ignored on main, becomes deploy branch root)

### Bootstrap Script
`scripts/ensure-node-and-deps.ps1` (PowerShell) and `.sh` (Bash) version:
- Validates Node.js installation
- Attempts `nvm use` from `.nvmrc` if nvm available
- Runs `npm ci` if package-lock.json exists, else `npm install`
- Starts dev server

Invoked automatically by VSCode task on folder open.

## Important Guidelines

### Cursor Rules Integration
This project uses Cursor IDE rules located in `.cursor/rules/`:
- `architecture.mdc` - Project architecture and workflows
- `dict.mdc` - Master Mind Theory and dictionary (#notation)
- `tasks.mdc` - Task rules, metadata and procedures
- `mcp-future.mdc` - Automation and future MCP vision

See `.cursor/README.md` for the full `.cursor/` structure and scripts. Prefer linking to rules over duplicating content.

### Package Management
**Always use `pnpm` instead of `npm`** - this is a hard requirement per user preferences.

### Domain Configuration
When forking/adapting for new domain:
1. Update `package.json` scripts > `deploy:setup` to use new domain
2. Configure DNS CNAME record pointing to `<username>.github.io.`
3. Update README.md GitPod link with new repository URL

### Development Notes
- Single HTML file architecture - all content in `src/index.html`
- Video hero component with fallback poster image
- Responsive grid system with custom breakpoints
- FontAwesome icons for social media
- Google Analytics integrated (gtag.js)

### GitHub Pages Setup
After first deployment (`pnpm run deploy`):
1. Go to repository Settings > Pages
2. Select `deploy` branch as source
3. Wait ~15min for TLS cert generation
4. Enable "Enforce HTTPS"
