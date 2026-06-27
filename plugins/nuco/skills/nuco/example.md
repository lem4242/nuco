# nuco — view examples

Worked examples of every nuco screen, in markdown with sample data. Canonical rules live in
`SKILL.md` → "Rendering". Glyphs: `☲` documents · `⛁` tables · `◰` assets · `⇄` connectors ·
`◷` updated · `⤓` size · `✎` access · `⚑` state · access cells `⌂`/`rw`/`r` · state cells
`✓` active `○` saved `✗` archived `→` superseded.

The heartbeat only ever shows the **current project** — `— nuco` at root, `— nuco · <project>`
inside one (at any depth). The deeper location lives in the screen heading.

---

**root → projects** — `/nuco`

# nuco

Your projects.

| Project | ☲ | ⛁ | ◷ | ✎ |
|:--|:-:|:-:|:-:|:-:|
| **Lynton_vivelia**<br>Your personal space<br>lynton@vivelia.co.uk | 12 | 11 | 2 hrs | ⌂ |
| **Monicavinader**<br>Demi-fine jewellery research<br>lynton@vivelia.co.uk, lynton@d3r.com | 44 | 3 | 2 days | rw |
| **Havana**<br>Venue hire & events policy<br>lynton@vivelia.co.uk | 9 | 0 | 4 days | rw |
| **Vivelia_co_uk**<br>Marketing site content | 18 | 2 | 1 wk | r |

— nuco

---

**project → home** — `/nuco-project monicavinader`

# Monicavinader

_Demi-fine jewellery competitor & engraving research_

✎ Access: read + write | ◷ Updated 2 days ago

| | |
|:--|:-:|
| **Documents**<br>19 notes · 16 findings · 4 data · +5 | ☲ 44 |
| **DB**<br>competitor_matrix · competitor_pricing · engraving_services | ⛁ 3 |
| **Assets**<br>none yet | ◰ 0 |
| **Connectors**<br>none | ⇄ 0 |
| **Members**<br>lynton@vivelia.co.uk, lynton@d3r.com | |

— nuco · monicavinader

---

**documents** — drill into Documents

# Monicavinader / Documents

| Document | Type | ◷ | ⚑ |
|:--|:-:|:-:|:-:|
| **Monica Vinader — competitor review (8 brands)** v3<br>Benchmark vs 8 demi-fine brands | note | 2 days | ✓ |
| **Findings: fingerprint engraving** v1<br>Six providers, UK + US | findings | 2 days | ○ |
| **Pricing rows — Astrid & Miyu** v2<br>75 product rows via Shopify | data | 3 days | ○ |
| **Nuco2 — brief** v1<br>Archived duplicate — use the canonical | note | 1 wk | ✗ |

— nuco · monicavinader

---

**documents, type-scoped** — `findings` (Type column dropped)

# Monicavinader / Documents / findings

| Document | ◷ | ⚑ |
|:--|:-:|:-:|
| **Findings: fingerprint engraving** v1<br>Six providers, UK + US | 2 days | ○ |
| **Findings: handwriting & child's drawing engraving** v1<br>UK + international | 2 days | ○ |
| **Findings: soundwave of a voice engraving** v1<br>Soundwave engraving market | 3 days | ○ |

— nuco · monicavinader

---

**db** — `/nuco-db`

# Monicavinader / DB

| Table | Rows |
|:--|:-:|
| competitor_matrix | 9 |
| competitor_pricing | 352 |
| engraving_services | 37 |

— nuco · monicavinader

---

**table view** — `/nuco-db competitor_pricing`

# Monicavinader / DB / competitor_pricing

| brand | category | product | price | currency |
|:--|:-:|:--|:-:|:-:|
| Mejuri | necklaces | Bold chain | 180.00 | GBP |
| Missoma | earrings | Lucy Williams hoops | 99.00 | GBP |
| Gorjana | rings | Stacking set | 65.00 | USD |

352 rows · showing 3.

— nuco · monicavinader

---

**assets** — `/nuco-assets`

# Monicavinader / Assets

| Asset | ⤓ | ◷ |
|:--|:-:|:-:|
| [Brand-guide.pdf](https://drive.google.com/file/d/abc/view) | 2.4Mb | 3 days |
| [Lookbook-ss26.pdf](https://drive.google.com/file/d/def/view) | 8.1Mb | 1 wk |
| [Logo.svg](https://drive.google.com/file/d/ghi/view) | 12Kb | 2 wks |

— nuco · monicavinader

---

**document view** — open a document

# Monica Vinader — competitor review (8 brands)
note · v3 · ✓ active · ◷ 2 days

Consolidated competitor review benchmarking Monica Vinader against 8 demi-fine jewellery brands
(Linjer, Mejuri, Missoma, Astley Clarke, Ana Luisa, Otiumberg, Astrid & Miyu, Gorjana).

**Key findings.** MV's moat is engraving + 5-year warranty + 100-country reach + 100-day returns;
the biggest exposure is solid-gold accessibility, where Mejuri / Gorjana / Ana Luisa / Otiumberg
undercut it.

…(document body continues as markdown)

— nuco · monicavinader

---

**search** — `/nuco-search engraving`

# Monicavinader / search "engraving"

| Document | Type | ⚑ |
|:--|:-:|:-:|
| **Findings: fingerprint engraving** | findings | ○ |
| **Findings: soundwave of a voice engraving** | findings | ○ |
| **Engraving & customisation — research plan** | plan | ○ |

— nuco · monicavinader
