# Phase one: Fola’s editorial section

The portfolio panels, projects, business pages and existing assets are retained. The main and footer navigation now include Blog. All new pages use relative root-level paths for GitHub Pages, the existing header/footer, shared `style.css`, and the scoped `editorial.css` components. There are no new runtime dependencies.

## Updating stories

Edit `blog-stories.json`, then run `python3 tools/build-blog.py` from the project directory. The generator rebuilds `blog.html`, the seven `story-*.html` pages, and only the marked editorial region in `index.html`. It reuses the homepage header/footer for the editorial pages. Content is rendered into static HTML, so stories are readable without JavaScript. JavaScript enhances category filtering and article sharing.

Each story supports a unique slug, category, title, excerpt, local image, image alt text, author, date, sample flag and body sections (heading and paragraphs). Use an ISO publication date such as `2026-10-04` only for a real published article; `null` explicitly displays “Publication date to be added.” Set `sample` to `false` when replacing the sample with original content. The current featured story is the first entry; the first three entries appear on the homepage. Related stories are three other entries in editorial order. Image captions and blog introductory sample copy should also be updated when real articles launch. Old generated story files are deliberately not deleted automatically when entries are removed; remove obsolete pages and check incoming links yourself.

All seven supplied articles are clearly labelled samples. Their prose explains how to replace the content; no current events or publication dates are invented. Images reuse existing portfolio photography as placeholders.

## Newsletter connection

The homepage, blog and articles include “Stay in the Loop,” a labelled email input and Subscribe button. Both controls are disabled and the interface states that subscriptions are not open and no addresses are collected. The form exposes `name="email"`, `data-newsletter-form`, and `data-provider="unconnected"`. No submission endpoint, storage or simulated success is present.

When connecting a provider, configure its endpoint or integration, enable the controls, add required validation/consent and privacy copy, replace the placeholder submission handler in `editorial.js`, and implement truthful success/error handling. Do not enable submissions until the provider works. Regenerate after changing the newsletter markup in the generator.

## Future architecture

The intended journey is portfolio (`index.html`) → editorial (`blog.html` and story pages) → newsletter → services (`index.html#skills` and `index.html#businesses`) → consultation → digital products. Reserve root-level `shop.html` for Courses / Shop and `book-me.html` for Book Me. The header includes a comment marking those future navigation additions; no dead links or pretend storefront/booking pages are exposed.

A newsletter provider, scheduling service and payment/e-commerce platform are future integrations. The existing contact interface is also frontend-only; its email and WhatsApp links are the working contact channels. Publishing articles requires no backend: update the JSON, regenerate and deploy the static files.
