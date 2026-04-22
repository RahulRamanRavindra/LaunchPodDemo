# Ambit · Launch Tracker

React + Vite app for tracking skinboosters launches.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output is written to `dist/`.

## Deploy to Cloudflare Pages

1. Push this repo to GitHub.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**, select this repo.
3. Build settings:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** 20 (set env var `NODE_VERSION=20` if needed)
4. Save and deploy. Subsequent pushes to `main` deploy automatically.
