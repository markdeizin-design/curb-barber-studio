# CURB — Barber Studio

A complete responsive portfolio concept for a fictional men's barber studio in Al Quoz, Dubai, UAE. The business, team, address, phone numbers, prices and booking experience are illustrative. No real appointments are accepted.

## Run locally

Requires Node.js 20 or later. No dependencies or installation step.

```sh
npm run build
npm test
npm run dev
```

Open http://127.0.0.1:4173. Direct routes: `/`, `/services`, `/booking`. Team links preselect a barber, e.g. `/booking?barber=Amir`.

`build.mjs` generates three static HTML pages from one service list (`dist/data.js`). Static output and local assets are in `dist/`. `dist/style.css` and `dist/app.js` provide responsive styling and interactions. Serve `dist/` on any static host supporting directory index pages. Root-relative paths assume deployment at the domain root.

## Booking privacy

The form runs entirely in the browser. No backend, analytics, cookies, browser storage, messages or data transmission. After validation, it clears the fields and opens only `https://www.whatsapp.com/` with no query parameters. Dates use Dubai local time. The contact numbers are deliberately non-callable placeholders.

## Design & assets

Original geometric C logo: `dist/assets/curb-logo.svg` and `curb-mark.svg`. Locally hosted Bebas Neue and Manrope font files use SIL Open Font License; license files are included beside the fonts. Service photographs are genuine licensed stock, saved and cropped locally. See [ASSET-SOURCES.md](ASSET-SOURCES.md) for all attribution and license links. The hero photograph was generated for this project with OpenAI image generation and is identified separately from stock photography.

Palette: `#111111`, `#272727`, `#D9D9D2`, `#C7FF31`, `#FFFFFF`. Reduced motion, keyboard navigation, explicit form labels, visible focus, accessible dialog, mobile menu and directional sticky header included.

This source includes third-party assets under their respective licenses. No blanket license is granted over those assets.
