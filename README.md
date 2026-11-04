# Victor Raton's Blog — vraton.dev

Personal blog built with [Lume](https://lume.land) 4 running on **Node.js** (npm). No Deno required.

## Quick Start

```bash
# Node 18+ required (CI uses Node 24)

npm install      # install dependencies
npm run serve    # dev server with reload on localhost:3000
npm run build    # production build, outputs to _site/
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run serve` | Dev server with hot reload (localhost:3000) — drafts visible |
| `npm run build` | Production build — drafts hidden |
| `npm run check` | Type-check with `tsc --noEmit` |
| `npm run lint` | Lint with ESLint (typescript-eslint) |
| `npm run ci` | Type-check + lint (runs in CI before every deploy) |

## Project Structure

```
├── _config.ts          # Lume configuration, plugins and site data
├── _data.yaml          # Global site metadata (metas, social links)
├── _includes/          # JSX layouts (layout.tsx, post.tsx, xp.tsx, ...)
├── _components/        # Reusable JSX components (navbar.tsx, footer.tsx)
├── posts/              # Blog posts (Markdown, type: post)
├── experiences/        # Professional experience entries (type: xp)
├── tag.page.ts         # Dynamic /tag/<tag>/ pages generated from post tags
├── images/             # Static images
├── theme.css           # Custom CSS (Everforest Dark) + fonts/highlight injection
├── _site/              # Build output (gitignored)
└── .github/workflows/  # GitHub Actions deploy workflow
```

## Content Format

Frontmatter uses TOML-style `+++` delimiters:

```markdown
+++
title = 'Post Title'
date = 2023-01-01T08:00:00-03:00
draft = false            # drafts only visible in dev server, never in production
description = 'SEO description'
tags = ['javascript', 'web']
+++

# Markdown content here
```

Posts get `type: post` (from `posts/_data.yaml`), experience entries `type: xp` (`experiences/_data.yml`). Both drive the RSS/JSON feeds and the dynamic tag pages.

## Features

- **SEO & accessibility**: auto metas, fediverse metadata, sitemap, WCAG-compliant code highlighting (github-dark)
- **Image pipeline**: transform_images (AVIF/WebP generation) + picture plugin with responsive `sizes`
- **Feeds**: `/posts.rss`, `/posts.json`, `/experiences.rss`, `/experiences.json`
- **Footer**: links to the exact git commit that produced the deployed build
- **Fonts**: self-hosted Google Fonts (Space Grotesk, Open Sans) with `display=optional`

## License

Content: CC BY-NC-SA 4.0
