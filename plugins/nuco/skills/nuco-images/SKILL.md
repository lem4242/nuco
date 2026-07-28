---
name: nuco-images
description: Use when generating, editing, or choosing AI images in nuco — "make/generate an image", "create a logo / poster / product shot / concept art", "edit this image / change the background", "which model for…", or working with a Midjourney grid. Covers model choice, the always-async generate→poll flow, editing, and the Midjourney grid→pick→upscale picker. For how to *display* results, see the nuco skill's Rendering ("Images").
---

# nuco-images — generating & choosing images

The server tool instructions cover the mechanics (a `project` is required; generation is **always
async** — enqueue, then poll `image_status`). This skill is the judgment on top: which model, how to
run it, and how to present what comes back.

## First: check the tools are actually yours
Image generation is **grant-scoped** — not every nuco user has it. Before promising anything, call
`image_models`. If it isn't available (or errors on access), tell the user image generation isn't
enabled for their account and stop; don't guess at `image_generate` and surface a raw tool error.
Displaying images you already have is a *different* surface (`file_image`, part of the file tools) and
may work even when generation doesn't.

## Pick the model from the catalogue, not memory
`image_models` is the source of truth — each model carries a capability note + `est_cost_usd`. Pull it
when the brief needs control; otherwise `image_generate(project, model, prompt)` is enough. Rough map
(always confirm against `image_models` — the enabled set changes):
- **photoreal / product** → imagen-4, flux-2-pro, nano-banana-pro, seedream-5
- **text-in-image / layout** → gpt-image-2, fal-ideogram-v3, nano-banana-pro
- **logo / vector / brand** → recraft-v3 (vector), recraft-v41
- **artistic / mood / concept** → mj-8.1, mj-7 (returns a grid — see picker below)
- **cheap / fast draft** → imagen-4-fast, nano-banana, fal-qwen-image

`model` accepts a **list** → one result per model, ideal for a side-by-side comparison. `n` = variants
per model. Don't invent model ids — a name absent from `image_models` isn't enabled.

## Run it — always async
Enqueue → the row is `queued`; poll `image_status(ids)` until `done` (MJ: `needs_selection`; or
`failed`, with `last_error`). Bytes land **private** in `<project>/assets/generated/<model>/`. Each
finished row is stamped with `cost` (exact where the provider reports it, else the catalogue estimate),
`width/height/bytes`, and — on token-priced routes (Vertex/OpenAI) — `tokens`/`usage`. Read those; never
reason over cost/size in prose.

## Show the results
Don't just link — **show** them. Per the nuco skill's Rendering → "Images": `file_image(mode=view)`
drops the picture into the chat (single **512**, grid/composite **768**), with markdown `[View]` links
to the full-res originals **below**. One composite is far cheaper than N separate tiles.

## Editing & variations
`image_edit(project, source, instruction)` — `source` is an **internal image id** (from a prior
generate/edit), never an external URL; lineage (`parent_id`) is set to it. Only `supports_edit` models
run it (today: nano-banana, nano-banana-pro, gpt-image-2). Name the subject to keep ("…keep the pendant
identical").

## Midjourney — the grid picker (the one multi-step model)
MJ returns a **2×2 grid** (`shape=grid_needs_selection`), not a single image. Present it:
1. Show the **composite** — `file_image(mode=view, size=768)` on the grid's file → all four alongside.
2. A numbered list beneath, one line each: `N. Descriptor (position) · [View](webViewLink)` — position
   in words (`top left` / `top right` / `bottom left` / `bottom right`) so number↔image is unambiguous.
3. Close with "**Reply with a number (1–4)**" → on the reply, `image_select(grid_id, N)` upscales that
   quadrant; show the upscaled child at **512**.

To **skip** the picker (headless / automation, or the user just wants one), pass `params.auto_select: N`
to `image_generate` — the runner resolves the grid to that quadrant's full-res tile server-side (no
picker, no extra call). The interactive picker is the default when a human is present.

**Always pass `auto_select` in a side-by-side comparison.** Without it MJ returns a 2×2 grid while
every other model returns one image, so the MJ entry isn't comparable — it looks like four small
pictures next to twenty-three big ones. This is the single easiest way to ruin a model bake-off.

## Don't
- Don't publish assets to `public/` just to show them — `mode=view` shows private images fine.
- Don't build a `show_widget` with a base64 image, or use inline markdown `![]()` — neither renders
  for the user (see the render note); `mode=view` is the path.
- Don't chain MJ upscales (`upscale_2x` on an already-upscaled tile) — one `image_select` is final.
