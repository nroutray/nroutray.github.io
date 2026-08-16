# nroutray.github.io

Personal portfolio of **Nishant Routray** — Software Engineer II at Microsoft (Azure App Configuration & Service Linker).

🔗 **Live:** https://nroutray.github.io

## Overview

A single-page, dependency-free portfolio with a dark glassmorphism design: an animated gradient-mesh
background, glass surfaces, and glowing gradient accents.

### Highlights

- **Animated background** — drifting gradient blobs, masked grid and film-grain noise, with a subtle
  mouse parallax.
- **Interactive hero** — typewriter role cycling, floating glass badges and a conic-gradient avatar ring.
- **Scroll experience** — top progress bar, glass navbar, scroll-spy nav highlighting and
  `IntersectionObserver` reveal animations.
- **Micro-interactions** — cursor spotlight, magnetic buttons, 3D tilt cards and card-following glow.
- **Content sections** — filterable tech-stack grid, tabbed Experience/Education timeline, project
  cards, and a keyboard-navigable gallery lightbox.
- **Contact form** — client-side validation that composes a prefilled email.
- **Accessible & responsive** — semantic landmarks, ARIA labels, keyboard support, and full
  `prefers-reduced-motion` fallbacks.

## Tech stack

Plain **HTML5**, **CSS3** (custom properties, grid, `backdrop-filter`) and **vanilla JavaScript** —
no frameworks, no build step, zero runtime dependencies. Icons are inline SVG; fonts come from
Google Fonts.

## Structure

```
index.html              # entire page markup
assets/
  css/style.css         # design tokens + all styling
  js/app.js             # all interactions
  img/                  # logos, skill icons, photos, gallery
  resume/               # résumé PDF
```

## Local development

The site is fully static — open `index.html` directly, or serve it to test relative paths:

```bash
npx http-server -p 8080 -c-1
# then visit http://localhost:8080
```

## Deployment

Hosted with **GitHub Pages** from the default branch. Pushing to `main` publishes automatically.

## Customizing

- **Colors / spacing / radii** — edit the `:root` tokens at the top of `assets/css/style.css`.
- **Rotating hero roles** — update the `data-words` attribute (pipe-separated) on `#typed`.
- **Skills** — add a `.skill-chip` and tag it with `data-cat` (`lang`, `frame`, `cloud`, `data`, `ai`).
- **Timeline, projects, gallery** — duplicate the existing card markup in `index.html`.

## License

See [license.txt](license.txt).
