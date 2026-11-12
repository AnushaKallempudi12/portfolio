# Anusha Kallempudi — Cinematic Portfolio

A personal portfolio built with Next.js, React, Three.js, React Three Fiber and GSAP. Designed for static export and GitHub Pages hosting.

## Design reference

The visual direction and interaction patterns are informed by [Sarang's Next.js Cinematic Portfolio](https://github.com/5araang/Nextjs-cinematic-portfolio), which is MIT-licensed. This project is an independently authored adaptation: it does not copy the reference creator's personal content, assets, branding or backend implementation.

## Stack

- Next.js 15 / React 19
- Three.js + React Three Fiber + Drei for the 3D hero
- GSAP + ScrollTrigger for entrance and scroll reveals
- GitHub Actions + GitHub Pages for deployment

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## GitHub Pages

The project is configured for the repository path `/portfolio` and static export.

1. Push changes to `main`.
2. In GitHub, open **Settings → Pages**.
3. Set **Build and deployment → Source** to **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` builds the site and publishes the `out` directory. The repository Pages source must be set to **GitHub Actions**.

Expected URL: https://anushakallempudi12.github.io/portfolio/

## Personal details to verify before publishing

- Replace `YOUR_EMAIL@example.com` in `src/app/page.jsx` with the email address you want public.
- Replace the LinkedIn link with your profile URL.
- The resume is stored at `public/documents/Anusha-Kallempudi-Resume.pdf` and linked from the home page.

## Static hosting scope

This version intentionally omits the reference project's admin CMS, database, visitor analytics and server-side email APIs. The portfolio is a public-facing static site; no secrets or backend credentials are needed.

## Cinematic scroll experience

The portfolio now uses the scroll-scrubbed forward/reverse video technique from [5araang/Nextjs-cinematic-portfolio](https://github.com/5araang/Nextjs-cinematic-portfolio), whose source repository is MIT licensed. For this first replication pass, the reference repository's public demo footage and poster are streamed from its raw GitHub URLs. This is reference footage, not Anusha's personal footage; replace the two video URLs and poster in `src/components/VideoScrub.jsx` with portfolio-owned footage before treating the page as final. The video playhead follows scroll position in both directions.
