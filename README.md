# LogicalDK

Personal site and blog. Built with SvelteKit, mdsvex, and Tailwind CSS v4. Deployed to GitHub Pages by GitHub Actions on every push to `main`.

## Develop

```sh
npm install
npm run dev
```

The site runs at <http://localhost:5173>.

## Test

```sh
npm test         # one-shot
npm run test:watch
```

## Build

```sh
npm run build
```

Outputs a static site to `build/`. Preview with `npm run preview`.

## Authoring posts

Drop a Markdown file into `src/posts/`. Front matter:

```yaml
---
title: Post title
date: 2026-05-22
tags: [java, spring]
description: Short summary used in RSS and link previews.
---
```

The slug is the filename (`my-post.md` → `/blog/my-post/`).

## Deploy

GitHub Actions handles it. First-time setup:

1. Push the repo to GitHub.
2. Repo Settings → Pages → set **Build and deployment → Source** to **GitHub Actions**.
3. Push to `main`. The workflow at `.github/workflows/deploy.yml` builds and deploys.
