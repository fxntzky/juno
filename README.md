# JUNO — Digital Time

A clean source-only rebuild of the original JUNO product-led storefront. React 18, TypeScript, Vite, SCSS; zero external commerce/payment accounts.

## Run

```bash
npm ci
npm run dev
```

For validation: `npm run check` (TypeScript + production build + Vitest).

## Scope

- Home: original JUNO visual identity and product storytelling, M83 campaign hero, Digital Time selection, gallery, features, contextual buying panel.
- Additional routes: `/collection/digital-time`, `/product/junom83` (and M64/M31/B612), `/cart`, `/checkout`, `/order/:id`. The home remains the editorial main experience, not a shopping grid.
- Checkout is a **DEMO**. No personal-information input, real credit-card entry, processor, real payment, email or shipment. Only shipping option is editable; contact and shipping address are fixed fictional fixtures.
- Cart IDs and product quantities persist locally across reloads; demo orders and inventory changes exist only in memory and reset on refresh. No personal or payment details are saved by cart storage. Pricing and inventory are illustrative.

## Folders

- `app/` — UI, page routing, context, styles and copy.
- `catalog/` — four Digital Time products, image manifest and current media.
- `commerce/` — typed mock provider and contracts.
- `features/` — service layer and product helpers.
- `tests/` — core functionality tests.

## Visual media

Only actively referenced product media are included and converted to WebP without changing the depicted designs. **The pre-existing M83 close-ups may still contain third-party generation marks**: they are retained strictly as interim design references, not asserted to be finished clean campaign assets. Replace in `catalog/digital-time/media/` and keep `catalog/media-manifest.ts` in sync as the approved new shots are generated.

## Cleanup

Removed: `node_modules`, `dist`, old generated hero duplicates, browser-export artifacts, agent/governance sessions, orphaned UI components, old asset scripts, dormant Analog Time catalogue and its unused large images. The original project remains untouched.
