# Anusha Kallempudi — Cinematic Portfolio

A personal portfolio built with Next.js, React, Three.js, React Three Fiber and GSAP. Designed for static export and GitHub Pages hosting.

## Design reference

This portfolio features an original UI design and independently developed interactions, created to reflect my personal style, technical interests, and professional journey.

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

The cinematic scroll experience uses original video footage created specifically for this portfolio. Its playback is synchronized with page scrolling, allowing the video to move forward or backward as visitors scroll through the page.
The scroll-scrubbing interaction was inspired by the MIT-licensed [Next.js Cinematic Portfolio](https://github.com/5araang/Nextjs-cinematic-portfolio). However, the video footage presented on this portfolio is my own and is not taken from the reference project's public demo.
