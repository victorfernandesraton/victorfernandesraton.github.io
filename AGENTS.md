# AGENTS.md

Personal blog built with [Lume](https://lume.land) (Deno-based static site generator).

**Critical**: README.md is outdated (mentions Hugo). This is a Lume project.

## Quick Start

```bash
# Install Deno first: https://deno.land

# Dev server with hot reload
deno task serve

# Build for production (outputs to `_site/`)
deno task build
```

## Project Structure

| Path | Purpose |
|------|---------|
| `_config.ts` | Lume configuration, plugins, site data |
| `_data.yaml` | Global site metadata, social links |
| `_includes/` | JSX layouts (layout.tsx, post.tsx, xplist.tsx, etc.) |
| `posts/` | Blog posts as Markdown files |
| `experiences/` | Professional experience entries |
| `images/` | Static images (webp, png, jpg, svg) |
| `_site/` | Build output (gitignored) |
| `_cache/` | Lume cache (gitignored) |

## Key Commands

```bash
deno task serve    # Dev server on localhost:3000
deno task build    # Production build
deno task lume     # Direct Lume CLI access
deno fmt           # Format code
deno lint          # Lint with Lume plugin rules
```

## Content Format

Frontmatter uses TOML-style `+++` delimiters:

```markdown
+++
title = 'Post Title'
date = 2023-01-01T08:00:00-07:00
draft = false
layout = 'post.tsx'
description = 'SEO description'
+++

# Markdown content
```

## Tech Stack Notes

- **Lume 3.2.4** with JSX/Preact rendering
- **Plugins**: jsx, nav, favicon, inline, transform_images, google_fonts, code_highlight, gzip, feed, metas, seo, image_size, lightningcss
- **Markdown**: markdown-it with custom plugins (media embeds, link attributes)
- **Styling**: LightningCSS with theme.css (Google Fonts + code highlight)
- **Target browsers**: Chrome/Firefox/Edge 100+, Safari 16+, iOS 18+

## Important Conventions

- JSX layouts in `_includes/` use `lume/jsx-runtime`
- Images auto-processed with `transformImages` plugin
- Code highlighting uses `base16/gruvbox-dark-pale` theme
- Site location: `https://vraton.dev`
- RSS feeds generated at `/posts.rss`, `/posts.json`, `/experiences.rss`, `/experiences.json`

## Creating New Posts

Add `.md` files to `posts/` with frontmatter. Use existing posts as templates.
