JUNO — M83 Product Experience v4
=================================
Patch for the already installed JUNO v3 (juno@2.0.0).

Replace only the paths included in this ZIP:
- app/pages/HomePage.tsx (full file)
- app/pages/StoryPage.tsx (new, full file)
- app/App.tsx (full file)
- app/routes/AppRouter.tsx (full file)
- app/components/TopNav.tsx (full file)
- app/styles/experience.scss (full file)

No images, commerce services, checkout, catalog data, or packages are overwritten.
The existing catalog/digital-time/media/hero.webp and m83-01..07 assets are reused.

What changed:
- JUNO wordmark and full-viewport, contained hero.webp (no zoomed crop)
- Explore M83 -> /product/junom83
- Overview now starts BELOW the hero; nav Overview scrolls to it
- Story -> independent /story editorial brand/product narrative
- Watch Functions: stopwatch, countdown, five alarms, dual time,
  auto calendar, cyan backlight, hourly chime, 12/24h. PROPOSED concept spec.
- Design Notes chapter before the collection
- 05 DIGITAL TIME / Four models. One attitude. -> BLACK background
- Technical notes chapter before Make it yours
- Mobile layouts and reduced-motion consideration

To apply from the new juno directory:
unzip -o ~/Downloads/JUNO-M83-experience-v4.zip -d .
npm run check
npm run dev

Validation in the authoring environment: Application TypeScript type check passed.
The FULL quality gate requires the dependency set installed on your Mac.
