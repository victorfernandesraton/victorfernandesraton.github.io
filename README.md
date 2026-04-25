# Victor Raton's Blog

Personal blog built with [Lume](https://lume.land) - a Deno-based static site generator.

## Tech Stack

- **Lume 3.2.4** - Static site generator
- **Deno** - JavaScript/TypeScript runtime
- **JSX/Preact** - Templating and components
- **LightningCSS** - CSS processing and minification
- **Google Fonts** - Self-hosted fonts (Space Grotesk, Open Sans)
- **Highlight.js** - Code syntax highlighting (github-dark theme)

## Prerequisites

- [Deno](https://deno.land/) installed (v2.0+)

## Quick Start

```bash
# Install dependencies and run dev server
deno task serve

# Build for production (outputs to _site/)
deno task build
```

## Available Commands

| Command | Description |
|---------|-------------|
| `deno task serve` | Start dev server with hot reload (localhost:3000) |
| `deno task build` | Build site for production |
| `deno task lume` | Direct access to Lume CLI |
| `deno fmt` | Format code |
| `deno lint` | Lint with Lume plugin rules |

## Project Structure

```
├── _config.ts          # Lume configuration and plugins
├── _data.yaml          # Global site metadata
├── _includes/          # JSX layouts (layout.tsx, post.tsx, etc.)
├── _components/        # Reusable JSX components
├── posts/              # Blog posts (Markdown with TOML frontmatter)
├── experiences/        # Professional experience entries
├── presentations/      # Slide presentations (Marp)
├── images/             # Static images
├── theme.css           # Custom CSS with Everforest Dark theme
└── _site/              # Build output (gitignored)
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
tags = ['javascript', 'web']
+++

# Markdown content here
```

## Features

- **Performance optimized**: Preload CSS, font-display: swap, image dimensions
- **Accessibility**: WCAG compliant code highlighting (github-dark theme)
- **SEO**: Auto-generated meta tags, sitemap, RSS feeds
- **Image optimization**: Transform images plugin with WebP generation
- **Responsive**: Mobile-first design with LightningCSS

## Plugins Used

- `jsx` - JSX/Preact rendering
- `nav` - Navigation menus
- `favicon` - Auto-generate favicons from SVG
- `transform_images` - Image optimization
- `google_fonts` - Self-hosted fonts
- `code_highlight` - Syntax highlighting
- `metas` - SEO meta tags
- `seo` - SEO validation
- `gzip` - Compression
- `feed` - RSS/JSON feeds

## License

Content: CC BY-NC-SA 4.0
Code: See repository license
