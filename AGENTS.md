# AGENTS.md

Personal blog (`vraton.dev`) built with **Lume 4 on Node.js/npm — not Deno**. There is no `deno.json` or `deno task`; all commands are npm scripts. Site URL `https://vraton.dev`, pinned by `CNAME.txt`.

## Commands (Node 24, npm)

- `npm run serve` — dev server on localhost:3000; sets `LUME_DRAFTS=true` (drafts visible)
- `npm run build` — production build into `_site/`; sets `LUME_DRAFTS=false` (drafts hidden)
- `npm run ci` — `npm run check` + `npm run lint` (`tsc --noEmit` + ESLint); CI runs it before every deploy, run it locally before commits
- `npm run build -- --dry-run` for a no-write build test

## Critical gotchas

- **Drafts leak bug (lume 4.0.1)**: `lume build` defaults `LUME_DRAFTS=true` when unset, so `draft = true` posts get *published in production*. Both npm scripts pin the env var and `.github/workflows/gh-pages.yml` also forces `LUME_DRAFTS: "false"`. Any new/script change must keep this set, or drafts go live.
- **Two conflicting markdown-it type trees**: `@types/markdown-it` (v14, hoisted by markdown-it-* plugins) vs the v15 bundled in `@lumeland/plugin-markdown`. The casts on `markdownPlugins` / `addImageAttrs` in `_config.ts` are intentional workarounds — do not "clean them up".
- **tsconfig.json**: `skipLibCheck: true` and `types: ["node"]` are required (sharp/resvg typings break checks without them). JSX uses `jsxImportSource: "@lumeland/ssx"`.
- **Typing**: `Lume.Data` / `Lume.Helpers` global namespace loads transitively from `@lumeland/core`; annotate untyped `.map()` callbacks as `(page: Lume.Data)`. `search.values()` is untyped in lume 4 — don't add generics (TS2347).
- **`types.d.ts`** in root is an ambient shim for `@gotfeedback/markdown-it-media` (that package's `exports` map hides its own typings); it's listed in `site.ignore(...)`.
- **Known build noise**: `[image-size]` errors about `posts/creating-this-blog/blog-works-300w.jpg` and `presentations/*.svg` are pre-existing (source files don't exist in the repo). Non-blocking, don't chase them.

## Content conventions

- Frontmatter is TOML-style (`+++` blocks).
- `posts/_data.yaml` sets `type: post`, `experiences/_data.yml` sets `type: xp`; these types drive the RSS/JSON feeds (`/posts.rss`, `/posts.json`, `/experiences.rss`, `/experiences.json`).
- `/tag/<tag>/` pages are generated dynamically by `tag.page.ts` from frontmatter `tags`.
- Posts are in Portuguese; layouts `_includes/*.tsx` and components `_components/*.tsx` (JSX via lume/ssx).

## Build-time data & components

- Components invoked as `<comp.X />` receive the current page data automatically; explicit props override it.
- `commitSha` / `commitUrl` are resolved once at build in `_config.ts` (`GITHUB_SHA` in CI → `git rev-parse --short HEAD` locally → github commit link); the footer renders `@[short sha]` linking to the commit.
- The repo slug comes from `package.json` → `repository` first, then `GITHUB_REPOSITORY`, then `git remote`.

## Deploy

- Push to `main` triggers `.github/workflows/gh-pages.yml` — the **only** active workflow (former `hugo.yml` / `lumen_action` duplicates were removed). It runs Node 24 → `npm ci` → checks → `npm run build` → GitHub Pages.
- `package.json` **and** `package-lock.json` must be committed together (workflow runs `npm ci`).
- `_site/` and `_cache/` are gitignored build artifacts; an old ignored `github/` folder entry remains in `site.ignore(...)` (harmless).
