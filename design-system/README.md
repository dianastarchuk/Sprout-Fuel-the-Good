# Sprout Design System

**Fuel the Good** — a design system for the Sprout calorie tracker and recipe finder, in light and dark.

| File | What it is |
|---|---|
| `tokens.css` | Every design decision as a CSS custom property. The single source of truth. |
| `components.html` | A live styleguide rendering every component in every state. Consumes only tokens. |
| `theme.js` | Writes `[data-theme]` from `localStorage` before the first paint. Everything else about theming is CSS. |
| `README.md` | This file — the rationale behind each decision, and how to use it. |

Open `components.html` in any browser. No build step, no framework, no dependencies beyond two Google Fonts.

---

## How this was derived

Colours were **sampled from `stylescape.png`**, not eyeballed. The anchors:

| Sampled from | Hex | Became |
|---|---|---|
| "Log a meal" CTA, progress ring stroke | `#CCFF4C` | `--lime-500`, the brand anchor |
| Confetti dots, "52g FAT" numeral | `#FF6A45` | `--orange-500` |
| Quote card, "FIND A RECIPE" heading | `#0D3C2A` | `--forest-800` |
| Dark tracker chrome | `#0A1711` → `#0A1F16` | `--forest-900`, primary text |
| Stylescape canvas | `#F5F8F2` | `--sage-100`, the app background |
| "5 MIN A DAY" badge | `#F3ECD9` | `--cream-200`, warm accent surface |
| Recipe rows, search bar | `#FFFFFF` | `--surface-raised` |

Every contrast ratio quoted in this document was computed from these hex values using the WCAG 2.1 relative-luminance formula. None are estimates.

---

## Token architecture

Three layers, in dependency order:

```
PRIMITIVES   --lime-500: #CCFF4C          raw palette. Never used by components.
     ↓
SEMANTIC     --surface-brand: var(--lime-500)     role-based. Use these.
     ↓
COMPONENT    --btn-radius: var(--radius-pill)     per-component knobs.
```

**Build UI against layer 2 and 3 only.** If you find yourself writing `var(--lime-500)` in a component, a semantic token is missing — add it rather than reaching past the layer. The point of the indirection is that rebranding, or adding a theme, touches layer 1 and 2 and nothing else — which is exactly what the dark theme cost: seventeen lines of component CSS, all of them places where a component had reached past the layer.

---

## Colour rationale

### Lime is a fill, never a text colour

This is the single most important rule in the system. `#CCFF4C` has a relative luminance of ~0.86 — brighter than most greys. Against the canvas it scores **1.09:1**, against white **1.17:1**. It is invisible as text.

So lime is defined as a *surface*: CTA fills, the progress ring stroke, selected tag backgrounds, the active nav pill. Anywhere the design calls for "lime text", use `--text-lime` (`#526B0B`, **5.65:1** on canvas), which reads as lime while remaining legible.

The corollary: **only dark text goes on lime.** `--text-on-brand` (`#0A1F16`) gives **14.73:1**. White on lime is 1.17:1 and is prohibited.

### Forest is re-cast, not reused

In the stylescape the deep greens are *backgrounds* — the whole tracker screen is dark. Porting that directly into a light theme would mean a dark screen inside a light app. Instead the forest ramp changes job:

- `--forest-900` → primary text (**16.05:1**, AAA)
- `--forest-800` → headings, and the one surviving dark surface: the quote card, kept as deliberate punctuation
- `--forest-600` → secondary text (**5.88:1**, AA)
- `--forest-500` → **restricted.** At 4.08:1 it misses the 4.5:1 body threshold. Scoped to ≥24px text and icons, where 3:1 applies.

This is why the dark tracker screen becomes light without losing brand identity: the greens are all still there, just carrying ink instead of ground.

### Orange doubles as the warning hue

The stylescape uses orange sparingly — a few confetti shapes and the fat macro. Rather than introduce a fifth hue for warnings, orange *is* the warning colour. It keeps the palette to four families and makes "over budget" feel native to the brand.

Same fill/text split as lime: `--feedback-warning` (`#FF6A45`) for shapes, rings and rules; `--feedback-warning-text` (`#A8380F`, **6.05:1**) for anything readable.

### Cool canvas, warm accent

The stylescape canvas is a cool green-white (`#F5F8F2`); the badges are a warm cream (`#F3ECD9`). Both are kept. The canvas stays cool so the lime reads as energetic against it; cream appears only on editorial surfaces — the "5 min a day" style badge, the quote card's sibling — where warmth signals "this is a human voice, not a data readout."

Neutrals are **sage**, a green-tinted grey ramp rather than a pure grey. A neutral grey next to this much green reads as dirty; sage keeps the whole surface family in one temperature.

---

## Typography rationale

**Archivo** (display) + **Plus Jakarta Sans** (body/UI).

### Why Archivo

The stylescape headline is a very heavy grotesque — flat terminals, tight apertures, near-zero sidebearings, set in caps. Archivo Black at `wdth 88` reproduces it closely.

The deciding factor was the **variable width axis (62–125)**. The brief asked for "condensed/expanded" display type, and Archivo delivers both from a single family and a single download:

| Token | Axis | Use |
|---|---|---|
| `--font-width-condensed` | 75 | Dense stat headers, tight column headings |
| `--font-width-display` | 88 | Standard headlines — the stylescape default |
| `--font-width-expanded` | 112 | Hero moments, splash, onboarding |

Set via `font-variation-settings: "wdth" var(--font-width-display)`. Changing width costs no extra network request, which matters on a mobile app. Anton was the alternative but ships a single weight with no width axis.

### Why Plus Jakarta Sans

Geometric-humanist — circular bowls, a double-storey `a`, open apertures. It matches the "Avocado power bowl" / "Search 5,000+ healthy meals" text in the recipe screen, and it holds up at 11px, which the macro labels need. Geometric enough to look related to Archivo; neutral enough to disappear when you're reading a nutrition label.

### The pairing logic

The two faces are doing opposite jobs and should not compete:

- **Archivo shouts.** Caps only, weight 800–900, `-0.02em` tracking, line-height 1.0–1.15. Reserved for numbers you want people to *feel* (the calorie count, the streak) and for screen titles.
- **Plus Jakarta Sans speaks.** Sentence case, weight 400–700, line-height 1.4–1.5.

The one place they meet is the macro chip: the value in Archivo (a number to feel), the label beneath in Plus Jakarta Sans caps at 11px with `+0.08em` tracking (a label to read).

### Scale

Font-size tokens are **value-named**: `--font-size-16` is 16px, always. A token can never drift from the number it promises, and reading a component's CSS tells you the rendered pixel size without resolving a chain.

Nine steps carry the entire app UI:

| Token | Size | Used by |
|---|---|---|
| `--font-size-10` | 10px | Macro labels, nav labels |
| `--font-size-12` | 12px | List metadata, ring unit |
| `--font-size-13` | 13px | Ring remaining ("520 left") |
| `--font-size-14` | 14px | Filter pills, streak count |
| `--font-size-15` | 15px | Search input text |
| `--font-size-16` | 16px | List titles, button labels, body copy |
| `--font-size-18` | 18px | Macro values |
| `--font-size-20` | 20px | Screen titles |
| `--font-size-32` | 32px | The calorie ring value |

A separate display scale — `--font-size-display-sm` (22) through `--font-size-display-xl` (44) — serves marketing surfaces and this styleguide's own page headings. **No in-app screen uses it.**

Weights are `--font-weight-regular` (400) through `--font-weight-black` (900). Line heights are named by role: `--line-height-none` (1) through `--line-height-relaxed` (1.5).

> **One caveat worth knowing.** The search input is specified at 15px. iOS Safari zooms the viewport whenever a focused input is under 16px, so the search field will trigger that zoom on iPhone. If you'd rather not have it, `--search-text-size` is the single token to change; every other 15px use is unaffected.

---

## Spacing logic

Spacing tokens are value-named on the same principle: `--spacing-16` is 16px.

```
--spacing-0     0
--spacing-4     4px   ← icon-to-label gaps, streak dots
--spacing-6     6px   ← filter pill vertical padding (off-grid)
--spacing-8     8px
--spacing-12   12px
--spacing-14   14px   ← filter pill horizontal padding (off-grid)
--spacing-16   16px   ← default component padding, screen gutter
--spacing-24   24px
--spacing-32   32px
--spacing-40   40px
--spacing-48   48px
--spacing-64   64px
--spacing-80   80px
```

The 8px grid governs everything structural. Four values sit off it, each for a stated reason:

- **4px** — an icon and its label read as two separate things at 8px. Reserved for that and the streak dot row.
- **6px / 14px** — filter pill padding, from the screen spec. Their combination with a fixed 32px pill height is what produces the pill's proportions; they are not general-purpose.
- **12px** — list row vertical padding and macro chip vertical padding. A true half-step.

**Why the scale skips.** There is no `--spacing-20` or `--spacing-28`. Once past 16px, adjacent multiples of 8 are too similar to communicate hierarchy; the gaps force a real choice between "grouped" (24) and "separated" (32).

### Screen composition

Three screens render in a fixed **440 x 956** container (`--screen-width` x `--screen-height`) with 16px side padding:

| Screen | Shows |
|---|---|
| **Today** | Calorie ring, macro chips, log CTA, today's logged meals |
| **Find a recipe** | Search field, filter pills, recipe result list, scan CTA |
| **Recipe detail** | Hero image, tags, per-recipe macros, ingredient list, log CTA |

The content area is 440 - (2 x 16) = **408px** wide and 956 - 56 (nav bar) = **898px** tall. The body fills the height above the pinned nav bar and scrolls when a screen's content runs longer, exactly as a real viewport does.

The screens row is wider than the documentation column, so it breaks out symmetrically, capped to the viewport (`min(1432px, 100vw - 48px)`) — it can never cause page-level horizontal scroll, and wraps when three no longer fit side by side.

Vertical rhythm uses one named token per gap, rather than a single flex `gap`, because the spec calls for different distances between different blocks:

| Token | Value | Between |
|---|---|---|
| `--gap-title-ring` | 24px | Title row → calorie ring |
| `--gap-ring-macros` | 24px | Ring → macro chips |
| `--gap-macros-cta` | 16px | Macro chips → CTA button |
| `--gap-search-pills` | 12px | Search bar → filter pills |
| `--gap-pills-list` | 16px | Filter pills → recipe list |
| `--gap-list-cta` | 16px | Recipe list → scan button |

### Verified rendered geometry

Every value below was measured from the rendered page via `getBoundingClientRect` and `getComputedStyle` — not read back from the CSS:

| Element | Token | Rendered |
|---|---|---|
| Screen container | `--screen-width` x `--screen-height` | 440 x 956 |
| Screen body (above nav) | derived | 898px |
| Recipe hero | `--recipe-hero-height` | 406 x 200 |
| Screen padding | `--screen-padding-x` | 16px |
| Screen title | `--screen-title-size` | 20px / 700 |
| Streak count | `--streak-count-size` | 14px / 500 |
| Ring diameter | `--ring-diameter` | 160 × 160 |
| Ring stroke | `--ring-stroke` | 8px |
| Ring value | `--ring-value-size` | 32px / 700 |
| Ring unit | `--ring-unit-size` | 12px / 500, 0.03em, uppercase |
| Ring remaining | `--ring-remaining-size` | 13px / 400 |
| Macro chip | `--macro-chip-height` | 64px, padding 12px 8px, gap 8px |
| Macro value / label | `--macro-value-size` / `--macro-label-size` | 18px / 700 · 10px / 500 |
| CTA button | `--btn-height` | 48px, padding 0 16px, full width |
| Search field | `--search-height` | 44px, 15px / 400 |
| Filter pill | `--pill-height` | 32px, padding 6px 14px, gap 8px |
| List item | `--list-item-padding-*` | padding 12px 16px |
| List avatar | `--list-avatar-size` | 40 × 40 |
| List title / meta | `--list-title-size` / `--list-meta-size` | 16px / 600 · 12px / 400 |
| Bottom nav | `--navbar-height` | 56px |
| Nav icon / label | `--nav-icon-size` / `--nav-label-size` | 20 × 20 · 10px / 500 |

### Radius

Radius encodes size, not decoration — the bigger the surface, the softer the corner:

| Token | Value | Applied to |
|---|---|---|
| `--radius-sm` | 8px | Inline code, small wells |
| `--radius-md` | 12px | Nested elements |
| `--radius-lg` | 16px | Macro chips |
| `--radius-xl` | 20px | Cards, lists |
| `--radius-2xl` | 28px | Sheets, phone frames |
| `--radius-pill` | 999px | Buttons, tags, search field |

Pills are the brand's signature — every button and tag in the stylescape is fully rounded — so `--radius-pill` is the default for anything you tap that contains a word.

### Elevation

Shadows are tinted `rgba(10, 31, 22, …)` — forest green, not black. Pure black shadows on a green-tinted canvas read as grey smudges; the tint keeps them in the same colour family as everything else. `--shadow-brand` is the lime glow under the primary CTA, the only coloured shadow in the system.

---

## Accessibility

### Text on the cream / neutral surfaces

| Foreground | On canvas `#F5F8F2` | On white `#FFFFFF` | On cream `#F3ECD9` | Level |
|---|---|---|---|---|
| `--text-primary` `#0A1F16` | **16.05** | **17.21** | **14.59** | AAA |
| `--forest-800` `#0D3C2A` | **11.55** | **12.38** | **10.50** | AAA |
| `--text-secondary` `#2E6B4F` | **5.88** | **6.30** | **5.35** | AA |
| `--text-lime` `#526B0B` | **5.65** | **6.06** | **5.14** | AA |
| `--feedback-warning-text` `#A8380F` | **6.05** | **6.49** | **5.50** | AA |
| `--feedback-error` `#B3241B` | **6.15** | **6.59** | **5.59** | AA |
| `--feedback-success` `#17794B` | **5.06** | **5.42** | **4.60** | AA |
| `--text-tertiary` `#4C8466` | 4.08 | 4.38 | 3.71 | ⚠ Large only |
| `--text-disabled` `#9AA894` | 2.33 | 2.50 | 2.15 | Exempt (1.4.3) |
| `--lime-500` `#CCFF4C` | 1.09 | 1.17 | 1.01 | ✗ **Never as text** |

### Text on the green surfaces

| Foreground | On lime `#CCFF4C` | On forest-800 `#0D3C2A` | Level |
|---|---|---|---|
| `--text-on-brand` `#0A1F16` | **14.73** | — | AAA |
| `--forest-800` `#0D3C2A` | **10.59** | — | AAA |
| `--text-on-inverse` `#FFFFFF` | 1.17 ✗ | **12.38** | AAA on forest |
| `--surface-canvas` `#F5F8F2` | — | **11.55** | AAA |
| `--lime-500` `#CCFF4C` | — | **10.59** | AAA |
| `--text-on-inverse-muted` `#A8C0B2` | — | **6.39** | AA |

The lime button's hover and active states stay safe: `#0A1F16` scores **12.59** on `--lime-600` and **9.92** on `--lime-700`.

### Four failures found and fixed

Building this surfaced four combinations that fail WCAG AA. All were adjusted rather than shipped.

**1. Lime on cream — 1.09:1.**
The brand colour is unusable as text or as an icon on any light surface. Resolved by defining lime as fill-only and adding `--text-lime` (`#526B0B`, 5.65:1) for every case where "lime text" was wanted. The protein macro value uses it.

**2. Orange on cream — 2.65:1.**
The stylescape renders "52g FAT" in raw `#FF6A45` on a *dark* background, where it reads fine. Moved to light, it fails. Raw orange is kept for shapes, dots and the over-budget ring; readable text uses `--feedback-warning-text` (`#A8380F`, 6.05:1).

**3. The lime focus ring — 1.62:1.** *(the one that mattered most)*
Lime was the obvious choice for a focus indicator, but WCAG 2.4.11 requires the indicator to hold 3:1 against adjacent colours. `--lime-700` manages only **1.62:1** on the canvas and **1.48:1** on a lime button — it would have been effectively invisible on the primary CTA, the single control where focus matters most.

The ring is now `--forest-900`: **16.05:1** on the canvas and **14.73:1** on lime, so one ring works on every surface in the system. Lime survives as a decorative halo outside the ring, via `--focus-ring-shadow`.

The same reasoning fixed the inputs. A focused field originally switched its border to lime — which *lowered* contrast from the resting `--border-strong` (3.32:1) to 1.73:1. Focus now darkens the border to `--forest-900` instead, and the lime halo sits outside it.

**4. forest-500 on cream — 4.08:1.**
Just short of the 4.5:1 body threshold. Rather than darken it and lose a useful mid-tone, it was scoped: `--text-tertiary` is documented for ≥24px text and icons only, where the 3:1 large-text threshold applies. Body copy uses `--text-secondary`.

### Non-text contrast

`--border-strong` (`#7E8C77`) scores **3.32:1** on canvas and **3.56:1** on white, clearing WCAG 1.4.11 for input borders. This is why fields use a 2px `--border-strong` outline rather than a 1px hairline — a hairline in `--border-subtle` would be decorative only and would not qualify as a visible field boundary.

### Tap targets

`--tap-min: 44px` is applied to every interactive element.

Two components are visually smaller than 44px — the 32px filter tags and the 36px small button. Rather than inflate them, a transparent pseudo-element stretches the hit area:

```css
button.tag {
  position: relative;
}
button.tag::after {
  content: "";
  position: absolute;
  left: 0; right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: var(--tap-min);
}
```

The pill still reads as 32px; the finger target is 44px. Apply this pattern to any control you shrink below `--tap-min`.

### Never colour alone

Every state that uses colour also carries a second signal (WCAG 1.4.1):

| State | Colour | Second signal |
|---|---|---|
| Over calorie budget | Ring turns orange | Label reads "270 over" |
| Goal met | Ring turns green | Label reads "Goal met" |
| Active nav tab | Lime pill behind icon | `aria-current="page"` + pill shape |
| Selected filter chip | Lime fill | Checkmark icon + `aria-pressed="true"` |
| Field error | Red border | Icon + message, wired via `aria-describedby` |
| Today's streak dot | Lime | Forest outline ring around it |

### Screen reader patterns

- The calorie ring is one `role="img"` with a full `aria-label` ("1530 of 2050 kilocalories consumed, 520 remaining"); the visual numerals inside are `aria-hidden` so the figure is announced once, coherently, instead of as three fragments.
- Streak dots are `aria-hidden`; the adjacent text count is the accessible version.
- Icon-only buttons always carry `aria-label`.
- Recipe thumbnails are `role="img"` with a descriptive label. In production these become `<img alt="…">` describing the dish.
- The styleguide itself has a skip link, a single `<h1>`, and no skipped heading levels.

---

## Using the tokens

Link the stylesheet, then reference variables. Nothing else is needed.

```html
<link rel="stylesheet" href="tokens.css">
```

```css
.my-component {
  padding: var(--spacing-16);
  background: var(--surface-raised);
  color: var(--text-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}
```

### Picking the right token

| You want… | Use |
|---|---|
| The page background | `--surface-canvas` |
| A card or row background | `--surface-raised` |
| A dark panel for emphasis | `--surface-inverse` + `--text-on-inverse` |
| A warm editorial badge | `--surface-accent` |
| Body text | `--text-primary` / `--text-secondary` |
| Text on a lime fill | `--text-on-brand` (never white) |
| Text that should look lime | `--text-lime` (never `--lime-500`) |
| An input border | `--border-strong` (never `--border-subtle`) |
| A divider | `--border-subtle` |

---

## Component reference

### Buttons

```html
<button class="btn btn--primary">Log a meal</button>
<button class="btn btn--secondary">Scan a meal</button>
<button class="btn btn--tertiary">Skip for now</button>
<button class="btn btn--primary btn--icon" aria-label="Add a meal">…</button>
```

Variants: `--primary` (lime CTA — one per screen), `--secondary` (dark forest), `--tertiary` (outline), `--icon` (circular, 44px, requires `aria-label`).
Modifiers: `--lg` (48px), `--sm` (36px visual / 44px target), `--block` (full width).
States: `:hover`, `:active`, `:focus-visible`, `:disabled` — all defined; `disabled` also needs the HTML attribute so it is exposed to assistive tech.

### Tags and badges

```html
<span class="tag tag--brand">Vegan</span>
<button class="tag tag--outline" aria-pressed="false">Breakfast</button>
```

Use `<span>` for static badges, `<button>` with `aria-pressed` for interactive filters. Variants: `--brand`, `--subtle`, `--outline`, `--dark`, `--cream`, `--success`, `--warning`, `--error`, `--info`.

### Fields and search

```html
<div class="field">
  <label class="field__label" for="goal">Daily calorie goal</label>
  <input class="input" id="goal" type="text" value="2050">
  <span class="field__hint">Based on your height, weight and activity level.</span>
</div>
```

Errors require three things together: `aria-invalid="true"`, `aria-describedby` pointing at the message, and the `.field__error` element. Colour alone is not sufficient.

For search, wrap in `.search`, add `.search__icon`, and give the input a visually-hidden `<label>`.

### Cards

`.recipe-card` — media, title, metadata, tags. The media area is a gradient placeholder; in production it becomes `<img alt="…">` describing the dish.
The card is `width: 100%` capped at `--recipe-card-width`, so it fills a sized parent — a grid track, a screen column — and stops at one card's width. Give it a parent that is sized by its own content and the `100%` has nothing to resolve against: the card shrinks to whatever its longest tag needs, and a row of them comes out at several different widths. Staging one on its own means giving the wrapper `--recipe-card-width` too.
`.meal-card` — status icon, title, metadata, calorie value. Use `.meal-card--pending` for unlogged meals.
`.card--dark` — the forest quote card, for editorial punctuation only.

### Calorie ring

```html
<div class="ring" style="--ring-progress: 0.746"
     role="img" aria-label="1530 of 2050 kilocalories consumed, 520 remaining">
  <svg class="ring__svg" viewBox="0 0 160 160" aria-hidden="true">
    <circle class="ring__track" cx="80" cy="80" r="68"/>
    <circle class="ring__fill"  cx="80" cy="80" r="68"/>
  </svg>
  <div class="ring__center" aria-hidden="true">…</div>
</div>
```

Progress is one custom property, `--ring-progress` (0–1). The dash array is computed in CSS from `--ring-circumference`, so setting progress requires no JavaScript arithmetic — just write the ratio.

Modifiers: `.ring--complete` (green, goal met), `.ring--over` (orange, over budget). Always update the label text alongside the modifier.

### Macro chips

```html
<div class="macros">
  <div class="macro macro--protein"><span class="macro__value">92g</span><span class="macro__label">Protein</span></div>
  …
</div>
```

The nutrient hue lives in a 3px top rule — decorative, so no contrast requirement — while the numeral takes the darkened AA-passing variant. This is what makes the dark screen's colour-coding survive the move to a light surface: protein 6.06:1, carbs 12.38:1, fat 6.49:1.

### Streak indicator

Dots are `aria-hidden`; the text count carries the meaning. Today's dot uses `.streak__dot--today` (lime with a forest outline) so it is distinguishable by shape, not only colour.

In a screen header the badge is a `<button>` that opens the streak modal, so it also carries `aria-haspopup="dialog"` and an `aria-label` that says what pressing it does.

The flame's `viewBox` is cropped to the glyph — `"7 2 10 14.2"`, not the 24-unit box the path was drawn in. That box was two thirds empty and not symmetrically so: it held the glyph high in its own frame and padded both sides, so the flame floated above the count and no gap value could pull it in. Cropped, the box is the glyph, which means `align-items: center` lines the flame up with the count for free, `--streak-flame-size` is the height it actually paints, and `--streak-flame-gap` is the gap you actually see. `.badge__flame` derives its width from `--streak-flame-ratio` so the glyph fills the box with no letterboxing.

The flame reads as part of the count rather than as a third item in the row, so it closes the row's shared gap and sits at `--streak-flame-gap` instead. The offset subtracts `--streak-gap`, not `--badge-gap`: a chip carrying both `.badge` and `.streak` takes its gap from `.streak`, which is declared later in `components.css`.

### Modal

```html
<button type="button" class="badge streak" data-modal-open="streak-modal" aria-haspopup="dialog">…</button>

<dialog class="modal" id="streak-modal" aria-labelledby="streak-modal-title">
  <div class="modal__panel">
    <form method="dialog"><button class="modal__close" aria-label="Close">…</button></form>
    <h2 class="modal__title" id="streak-modal-title">Good work!</h2>
    …
  </div>
</dialog>
```

A native `<dialog>` opened with `showModal()`. The browser supplies the top layer, the focus trap, Esc-to-close and the inert page behind it, so `components.js` holds only two behaviours: opening the dialog named by `data-modal-open`, and closing it when a click lands on the backdrop. Closing from inside is declarative — any control in a `<form method="dialog">` closes its own dialog.

The `<dialog>` box itself is transparent and unpadded so it measures exactly `.modal__panel`. That is what makes the backdrop click detectable: a click on the dim area is reported on the `<dialog>` element, while anything inside the panel targets the panel.

### Week row

Seven day columns for the modal. A finished day is a filled check, today is the lime chip with a forest outline, and a day still to come is an empty well — shape as well as colour, the same pairing the streak dots use. Each column carries an `.sr-only` word (`tracked` / `today, tracked` / `still to come`) so the row reads as "Mon, tracked" instead of as seven unlabelled circles.

### Bottom navigation

Mark the current tab with `aria-current="page"`, which drives the lime pill via CSS. Each item is a link with `--tap-min` minimum height.

The raised Scan circle is the one tab whose glyph sits *on* the active lime rather than beside it, so it cannot keep the white it wears over its dark resting circle — that pairing is 1.17:1. Active, it takes `--nav-fab-active-fg` (`--text-on-brand`, **14.73:1** on lime). The rule that does this must follow the generic `[aria-current="page"]` rule in `components.css`: the two selectors weigh the same, so source order decides the background.

### Device frame

The prototype screens in `screens/` are wrapped in `.device` — the phone hardware plus the two pieces of OS chrome that always sit on top of an app:

```html
<div class="device">
  <div class="device__viewport">
    <div class="status-bar" aria-hidden="true">
      <span class="status-bar__time">9:41</span>
      <span class="status-bar__island"></span>
      <span class="status-bar__indicators">…</span>
    </div>
    <div class="screen">…</div>
    <div class="home-indicator" aria-hidden="true"></div>
  </div>
</div>
```

| Part | Token | Value |
|---|---|---|
| Bezel | `--device-bezel` | 13pt of black glass around the display |
| Rim | `--device-rim` | 3pt polished metal edge |
| Display corner | `--device-screen-radius` | 42pt |
| Status bar | `--statusbar-height` | 59pt |
| Dynamic Island | `--island-width` / `--island-height` | 125 x 36pt |
| Home indicator | `--home-indicator-width` / `--home-indicator-thickness` | 140 x 5pt, 8pt off the bottom edge |

Three decisions worth naming:

**The chrome eats into the viewport, it is not added on top.** `.device__viewport` stays exactly `--screen-width` x `--screen-height`; the status bar and the home indicator take their bite out of it, so the app is left the same space a real device leaves it. `.screen` therefore drops its own fixed height inside a frame and becomes a flex child, along with the border, corner and shadow it wears when it stands alone on the styleguide page.

**The frame does not theme.** Every other colour in the system is `light-dark()`. These are not: a phone's glass and aluminium are physical objects, and they do not repaint themselves when the app goes dark. The gradient rim is a transparent border with two backgrounds — `padding-box` paints the black glass, `border-box` the metal — which is the only way a border carries a gradient.

**The chrome is `aria-hidden`.** A status bar and a home indicator are the device drawing over the app. They carry nothing a screen reader user needs, and the time in particular would be read as page content.

**The island is centred on the display, not between the labels.** It is a hole in the glass at a fixed position; it must not shift when the clock gets a digit wider.

### List items

```html
<ul class="list">
  <li class="list__item">
    <a class="list__link" href="…">
      <span class="list__thumb" role="img" aria-label="Avocado power bowl"></span>
      <span class="list__body">
        <span class="list__title">Avocado power bowl</span>
        <span class="list__meta">420 kcal · 15 min</span>
      </span>
    </a>
  </li>
</ul>
```

Use `aria-disabled="true"` on a `<span class="list__link">` for unavailable rows — never a disabled link.

---

## Extending the system

**Adding a colour.** Add the ramp to layer 1, then a semantic alias in layer 2. Compute its contrast against `#F5F8F2`, `#FFFFFF` and `#F3ECD9` before committing — if the value fails 4.5:1, ship a darkened `-text` sibling the way lime and orange have.

**Adding a component.** Reference layer 2 and 3 only. If you reach for a primitive, add the missing semantic token instead. Add the component to `components.html` with all its states — the styleguide is the regression test.

**Adding a colour to the dark theme.** Write it as `light-dark(<light>, <dark>)` in layer 2 or 3 of `tokens.css`, never as a second block. Measure the dark half against `--dark-canvas` *and* `--dark-raised`; the card is only 1.38× lighter than the canvas, so a value that passes on one nearly passes on the other, and "nearly" is where the failures were.

---

## Theming

There is one set of tokens, not two. Every colour in layers 2 and 3 is written as `light-dark(<light>, <dark>)`, and `color-scheme` decides which half a page uses:

```css
:root                      { color-scheme: light dark; }   /* follow the OS */
:root[data-theme="light"]  { color-scheme: light; }
:root[data-theme="dark"]   { color-scheme: dark; }
```

`theme.js` writes that attribute from `localStorage` while the document is still parsing — load it in `<head>` **without** `defer`, or a stored dark preference lands after the browser has already painted a light page. The mode is always one of **Auto → Light → Dark**; Auto is a real setting, not the absence of one, so it stays reachable.

The same script drives two controls, and a page may carry either or both:

| Control | Markup | Where |
|---|---|---|
| Cycling button | `.theme-toggle[data-theme-toggle]`, three icons, one label | Parked outside the phone frame on the prototype screens and the styleguide — there is nowhere inside a 440×956 frame it could sit without becoming part of the design |
| Three named options | `.segmented.segmented--block[role="radiogroup"][data-theme-choice]` with `[data-theme-set]` buttons | The Appearance picker under Preferences on the You screen — the setting as the app itself would ship it |

Neither carries state in the HTML: `theme.js` writes `data-theme-mode` on the button, and `aria-checked` plus the roving `tabindex` on the options (arrow keys move the selection, as a radiogroup requires). A control added to a page after load works without re-running anything — the listeners are delegated from the document.

Because `light-dark()` resolves against the `color-scheme` in force where a token is *used* rather than where it is declared, any subtree can be pinned on its own — `.theme-light` and `.theme-dark` do exactly that, and the styleguide uses them to show both themes on one page with no duplicated CSS.

### Layer 1 is not themed

A primitive is a fixed pigment; a token that changes its own hex is no longer one. The dark theme adds primitives of its own — `--dark-canvas`, `--dark-raised`, `--dark-sunken`, the lit macro and feedback hues — rather than rewriting the light ones. Every ratio quoted in this README therefore stays true for the palette it was measured against.

### Five things that are not a straight swap

**`--surface-inverse` mirrors.** An accent panel is defined by opposing the canvas, so on a dark canvas it goes light: forest-800 → sage-100. `.card--dark`, `.tag--dark`, the "Scan a meal instead" button and the raised Scan circle all follow it, and `--text-on-inverse` flips with it so every pairing survives.

**`--surface-camera` does not.** The viewfinder stands in for a live camera image, not for chrome. It was always dark on purpose, which is why it needed a token of its own — following `--surface-inverse-deep` would have turned the camera white.

**`--surface-sunken` inverts its direction.** In the light theme a well sits *below* the card. Below the dark canvas there is nowhere left to go, so in the dark theme it sits *above* it: forest-700 is the lightest of the three surfaces. A track reads by lifting off its card rather than sinking under it.

**The focus ring swaps its two tones.** No single colour clears 3:1 against both the dark canvas and a lime button — lime wants a ring no lighter than L 0.25, the sunken track wants one no darker than L 0.30, and those bands do not meet. The ring was already two-tone, so the roles trade: `--focus-ring-color` goes to forest-50 and carries every dark surface (15.6:1 on the canvas, 11.3:1 on a card), and the forest-900 halo just outside it carries lime at 14.7:1.

**`--macro-*-ink` splits in two.** `-ink` is the dry text painted on the macro card, so it follows the card: dark on a light one, lit on a dark one. `-deep` is the bottom of the liquid fill and the label chip printed on that fill — and the fill is the same colour in both themes, so `-deep` never moves. Without the split, the dark theme's lit shade would have landed on a 92%-white chip.

### Dark ratios

Measured on `--dark-canvas` (#0A1F16); the raised card costs about a quarter of each.

| Token | Value | On canvas | On card |
|---|---|---|---|
| `--text-primary` | forest-50 | 15.55:1 | 11.28:1 |
| `--text-secondary` | forest-200 | 11.82:1 | 8.57:1 |
| `--text-tertiary` | forest-300 | 8.82:1 | 6.39:1 |
| `--text-lime` | lime-500 | 14.61:1 | 10.59:1 |
| `--border-strong` | forest-400 | 6.38:1 | 4.62:1 |

The light theme's own values fail here in four specific places, all of them indicators rather than text: `--chart-bar` drops to 1.45:1 on the dark track, `--chart-bar-over` to 2.40:1, `--nav-item-inactive` to 2.83:1 on the dark bar, and `--ring-gradient-from` starts the arc at 2.7:1. Each is lifted to its light counterpart in the dark half of the token.

---

## Known constraints

- **`light-dark()` is required.** It is Baseline since mid-2024 (Chrome 123, Safari 17.5, Firefox 120). Older engines drop the declaration and leave those tokens unset. The fix, if it is ever needed, is a build step that expands each pair into two blocks — not a change to the tokens.
- **`theme.js` must not be deferred.** Deferred, every load with a stored dark preference starts on a flash of the light theme.
- `--text-tertiary` is deliberately restricted to ≥24px text and icons. It will fail an automated audit if used for body copy.
- Recipe imagery is gradient placeholders. Real photography needs an overlay behind any text placed on it — none of the ratios here account for text over a photo.
- Archivo's width axis needs a variable-font-capable browser. The fallback stack (`Arial Narrow`, `Helvetica Neue`) degrades to a fixed width; the layout does not break, but the condensed/expanded distinction is lost.
