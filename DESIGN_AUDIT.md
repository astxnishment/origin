# Origin Repairs Design Audit

Audit date: 30 July 2026

This audit covers the rendered Origin Repairs website in light and dark themes
at 1440 x 1000, 1280 x 800, 1024 x 768, 768 x 1024, 430 x 932,
390 x 844, 375 x 812 and 320 x 568.

Baseline screenshots are stored in:

`artifacts/design-audit/before/{theme}/{viewport}/{route}.png`

The matching after-capture run is prepared to store screenshots in:

`artifacts/design-audit/after/{theme}/{viewport}/{route}.png`

The in-app browser refused the local preview URL during final capture, so this
run does not claim matching after screenshots that were not actually produced.
Responsive layout, accessibility and interaction behavior were instead
verified against the production build at desktop, 320px, 390px and tablet
viewports. The capture script remains in `scripts/capture-design-audit.mjs` for
the next environment that permits local browser capture.

## Existing Visual System

- Typeface: Geist Sans and Geist Mono, loaded locally.
- Identity: monochrome Origin logo, warm neutral light theme and graphite dark
  theme.
- Primary breakpoint patterns: mobile below 640px, tablet from 768px and
  desktop from 1024px.
- Existing surfaces: `card`, `surface`, `surface-raised`, `panel-bg` and
  control-specific tokens.
- Existing radii range from small controls to rounded feature panels, but their
  application varies between routes.
- Most pages use `max-w-6xl`, while legal and narrow content use independent
  widths and padding.
- Buttons and forms combine shared primitives with route-specific height,
  padding and radius overrides.

## Audit Findings

| Route | Viewport | Current visual problem | Proposed change | Component affected | Status | Verification |
| --- | --- | --- | --- | --- | --- | --- |
| All routes | All | Container widths, horizontal padding and section spacing are repeated with small variations. | Introduce shared page, narrow, form and section primitives backed by central tokens. | `app/globals.css`, layout primitives | Implemented | [Baseline](artifacts/design-audit/before/light/1440x1000/about.png) |
| All routes | Both themes | Warm beige light surfaces and pure-black dark backgrounds do not always feel like two versions of the same graphite system. | Refine theme tokens for neutral warm-white light surfaces and layered graphite dark surfaces. | `app/globals.css` | Implemented | [Light](artifacts/design-audit/before/light/1440x1000/home.png), [dark](artifacts/design-audit/before/dark/1440x1000/home.png) |
| Header | Desktop | Header alignment is sound, but the visual hierarchy gives theme and booking similar edge weight and the blur is stronger than necessary. | Keep one compact primary action, simplify the secondary control and use a quieter translucent divider. | `components/Navbar.tsx` | Implemented | [Baseline](artifacts/design-audit/before/light/1440x1000/home.png) |
| Header / menu | 320-430px | Three icon controls sit beside the logo, creating a tool-strip feeling; the menu does not own the secondary utilities. | Keep the menu and one quiet utility in the bar, moving secondary actions into the drawer. | `components/Navbar.tsx` | Implemented | [Baseline](artifacts/design-audit/before/dark/390x844/home.png) |
| Homepage hero | 1280-1440px | The hero fills nearly the entire viewport but leaves a large unused lower area; the next section is hidden. | Use a 46/54 grid, reduce hero height and reveal the beginning of device categories. | `app/page.tsx`, shared hero primitives | Implemented | [Baseline](artifacts/design-audit/before/dark/1440x1000/home.png) |
| Homepage hero | Desktop | The iPhone, Pixel and MacBook occupy disconnected corners with no single visual centre. | Make the iPhone dominant and group the laptop and Pixel as restrained supporting devices. | `app/page.tsx` | Implemented | [Baseline](artifacts/design-audit/before/dark/1440x1000/home.png) |
| Homepage hero | 320-430px | Device imagery sits above the message as three small, separate objects; phone competes with the primary repair action. | Use one compact grouped composition and change actions to quote first, booking second, with phone as a quiet utility. | `app/page.tsx` | Implemented | [Baseline](artifacts/design-audit/before/dark/390x844/home.png) |
| Homepage trust | All | Four trust points wrap inconsistently and use long labels at smaller widths. | Use three concise trust items with consistent icon alignment and no decorative containers. | `app/page.tsx`, `TrustRow` | Implemented | [Baseline](artifacts/design-audit/before/dark/390x844/home.png) |
| Homepage categories | All | Card imagery uses route-specific dimensions and device silhouettes have unequal optical scale. | Add a fixed image stage with per-category optical scale tokens and consistent content alignment. | `app/page.tsx`, `DeviceCard` | Implemented | [Baseline](artifacts/design-audit/before/light/1440x1000/home.png) |
| Homepage common repairs | Mobile | Price and time are visually close and rows read as compact utilities instead of comparable repair choices. | Separate price and duration metadata while preserving a restrained row treatment. | `app/page.tsx`, `RepairRow` | Implemented | [Baseline](artifacts/design-audit/before/light/390x844/home.png) |
| Homepage quote | All | The quote interaction appears after repair lists and does not feel like the central product. | Move it directly after categories and give it a stronger, unified interface surface. | `app/page.tsx`, `components/HeroCalculator.tsx` | Implemented | [Baseline](artifacts/design-audit/before/dark/1440x1000/home.png) |
| Quote | Desktop | The empty calculator is tall, with a dense configuration side and a mostly empty summary side. | Use a 62/38 composition, compact empty state and top-aligned progress summary. | `components/FullCalculator.tsx` | Implemented | [Baseline](artifacts/design-audit/before/light/1440x1000/quote.png) |
| Quote | 320-430px | The introduction and stacked choices consume the viewport while the fixed conversion bar duplicates the page action. | Tighten the introduction, preserve progress and suppress the global conversion bar on calculator routes. | `app/quote/page.tsx`, `components/FullCalculator.tsx`, `components/MobileCTABar.tsx` | Implemented | [Baseline](artifacts/design-audit/before/dark/390x844/quote.png) |
| Pricing | Tablet/mobile | Filters are usable but feel like a nested beige tool card and the global three-action bar competes with results. | Create a flatter filter panel, clearer active-filter count and two-action route-aware mobile bar. | `components/PricingTable.tsx`, `components/MobileCTABar.tsx` | Implemented | [Baseline](artifacts/design-audit/before/light/390x844/pricing.png) |
| Service pages | Desktop | Hero height, copy width, image scale and CTA wording vary between phones, tablets, laptops, consoles, custom PCs and recovery. | Introduce one service-hero and repair-list system with controlled visual stages. | Service page components and routes | Implemented | [Phones](artifacts/design-audit/before/light/1440x1000/phone-repairs.png), [recovery](artifacts/design-audit/before/dark/1440x1000/data-recovery.png) |
| Data recovery | Desktop | Product image is optically too small and two similarly worded actions compete. | Increase the controlled image stage and use quote/assessment primary with one booking secondary. | `app/repairs/data-recovery/page.tsx` | Implemented | [Baseline](artifacts/design-audit/before/dark/1440x1000/data-recovery.png) |
| Repair pricing grids | Desktop | Five-column micro-cards create a dense spreadsheet-like block and service metadata does not align across pages. | Use a two-column or flat three-column repair list with aligned name, price and duration. | Service repair lists | Implemented | [Baseline](artifacts/design-audit/before/light/1440x1000/phone-repairs.png) |
| Booking | Desktop | The form floats on the page while contact and expectations are split into two equal cards; the composition feels empty. | Use one form panel with internal divisions and one quieter information panel. | `app/book/page.tsx`, booking components | Implemented | [Baseline](artifacts/design-audit/before/dark/1440x1000/booking.png) |
| Booking | Mobile | Form controls are usable, but the global fixed bar duplicates booking and can compete with keyboard-focused fields. | Hide the global bar on booking, preserve 44px controls and keep the form first. | `components/MobileCTABar.tsx`, booking components | Implemented | [Baseline](artifacts/design-audit/before/dark/390x844/booking.png) |
| Contact / location | Desktop | Contact details, form and map use separate spacing rules, making the page feel like multiple independent layouts. | Align intro, form and location to the shared grid and use one balanced information/map section. | `app/contact/page.tsx`, `components/InteractiveMap.tsx` | Implemented | [Baseline](artifacts/design-audit/before/dark/1440x1000/contact.png) |
| About / FAQ | All | Supporting pages use older page-title and section-spacing patterns and feel quieter but disconnected from interactive routes. | Apply shared page intro, narrow measure and section rhythm without adding decorative content. | `app/about/page.tsx`, `app/faq/page.tsx` | Implemented | [About](artifacts/design-audit/before/light/1440x1000/about.png), [FAQ](artifacts/design-audit/before/light/390x844/faq.png) |
| Mail-in / tracking | Mobile | Secondary service utilities still inherit the global three-action bar and page-specific cards compete with it. | Use route-aware fixed actions and shared form/information panels. | `app/mail-in/page.tsx`, `app/track/page.tsx`, `components/MobileCTABar.tsx` | Implemented | [Mail-in](artifacts/design-audit/before/dark/390x844/mail-in.png), [tracking](artifacts/design-audit/before/dark/390x844/tracking.png) |
| Legal pages | All | Legal routes have consistent narrow text but use different title spacing and notice-panel treatments. | Apply shared legal intro, narrow container and muted notice surface. | Privacy, terms and warranty routes | Implemented | [Terms](artifacts/design-audit/before/light/1440x1000/terms.png) |
| 404 | All | The illustrated mascot and large recovery card use a more playful visual language than the rest of Origin. | Replace it with a restrained error composition and compact recovery links. | `app/not-found.tsx` | Implemented | [Baseline](artifacts/design-audit/before/dark/390x844/not-found.png) |
| Footer | Mobile | The two-column footer is improved, but the fixed three-action bar covers part of its lower rhythm and five-column hierarchy is absent on desktop. | Use a wider brand column, clearer repair/service split and route-aware bottom clearance. | `components/Footer.tsx`, `components/MobileCTABar.tsx` | Implemented | [Baseline](artifacts/design-audit/before/light/390x844/contact.png) |
| Motion / focus | All | Motion is restrained globally, but interactive cards and hand-built controls do not share one focus treatment. | Centralise focus rings, hover lift and reduced-motion behavior in shared primitives. | `app/globals.css`, shared components | Implemented | Automated and keyboard verification |
| Images / performance | All | Several transparent PNGs are large and some responsive images lack precise `sizes`; multiple hero images are eager. | Use one genuine LCP image per route, accurate sizes and lazy loading for supporting imagery. | Homepage and service image components | Implemented | Build output and rendered image review |

## Baseline Quality Gates

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run test:unit`: 25 tests passed across 7 files.
- `npm run build`: passed with 451 generated pages.
- `npm run test:e2e`: 40 checks passed across desktop, mobile and tablet;
  4 mobile-only checks were intentionally skipped on desktop/tablet.

## Final Quality Gates

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run test:unit`: 25 tests passed across 7 files.
- `npm run build`: passed with 451 generated pages.
- `npm run test:e2e`: 40 checks passed across desktop, 320px, 390px and tablet;
  4 viewport-specific checks were intentionally skipped.
- Axe reported no automatically detectable violations on the homepage,
  repairs, pricing, quote or contact routes. Colour contrast remains excluded
  from the automated rule set and should receive a manual visual check.

## Acceptance Checklist

- [x] Shared grid and spacing tokens are used across routes.
- [x] Homepage shows a balanced hero and the next section at desktop and mobile.
- [x] Quote is the primary homepage interaction.
- [x] Device images have consistent optical scale.
- [x] Service heroes and repair lists share one system.
- [x] Quote and booking interfaces have coherent desktop and mobile compositions.
- [x] Mobile has no competing fixed actions.
- [x] Light and dark themes are intentionally layered.
- [x] No 320px overflow or covered content.
- [x] Automated accessibility, unit, browser and production checks pass.
- [ ] Matching after screenshots are captured.
