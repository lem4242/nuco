---
name: nuco-render
description: Use with the nuco core skill in Claude Code and desktop for /nuco, "show me", status screens, project navigation, search result screens, ls-style listings, images and share links. Load only on these triggers.
---

# nuco screens

Render the current cursor level as markdown, never a widget. Headings carry the full path as
names; the heartbeat carries only the project. Images use `file_read` below.

## While awake

In Claude Code/desktop shell mode, keep a cursor at root, project or file; naming a child moves
in, a back-link moves out. `/nuco` renders the current level; no cursor yet means root.
Reads alone need no screen.

End every reply while awake with `— nuco` at root or `— nuco · <project>` at any depth inside it.
Stop on `nuco off`; if context loses the skill and the heartbeat stops, re-run `/nuco` to wake it
again. This heartbeat is a shell convention, not for voice/phone answers.

## Visual rules

Glyphs: `☲` docs · `⛁` tables · `◰` files · `⇄` connectors · `◷` updated · `⤓` size · `✎` access ·
`⚑` state. Access: `⌂` home · `rw` write · `r` read. State: `✓` active · `○` draft · `✗` archived.
Use state glyphs in tables; spell out state in a document's meta line.

Left-align text, centre numbers/glyphs. Capitalise headings and text headers; preserve raw DB
identifiers. Empty → `—`; true zero → `0`. Abbreviate relative times (`2 mins`, `3 hrs`, `4 days`,
`2 wks`, `5 mos`). Stack text in cells with `<br>`; no other HTML.

## Screens

- **Root** (`nuco_context`): one row per project, columns `Project | ☲ | ⛁ | ◷ | ✎`.
  Project cell stacks **Name**, description, members.
- **Project home** (`nuco_context(project=…)`): a section index. Heading `# <Name>` (own home:
  `# ⌂ Home`), description in italics, then `✎ Access: read + write | ◷ Updated 2 days` (omit
  pencil for read-only). Two columns with blank headers: section name + preview on the left,
  glyph + count on the right. Sections: Documents (counts by type), DB (table names), Files
  (counts by extension), Connectors, Members (names; no count).
- **Documents** (`doc_list`): `Document | Type | ◷ | ⚑`; document cell stacks **Title** `vX`
  and subtitle. A type-scoped list drops Type. Search uses this layout for doc hits and the
  Files layout for file/image hits; cite memory hits by their sentences. Read hits to fill
  missing version/state/date; never invent them. Page lists using returned cursors.
- **Tables** (`nuco_context(project=…)`): `Table | Rows`; plain names, hiding `doc` and
  `nuco_audit`. Describe with `db_describe`; obtain counts with `db_read` using
  `SELECT count(*) AS total FROM "<discovered_table>"`, quoting the discovered SQL identifier.
- **Files** (`file_list`): `File | ⤓ | ◷`; show name and project-relative path. Compact sizes
  (`2.4Mb`, `12Kb`, `340b`); empty → _No files yet_. With `next_cursor`, say "N shown — more
  available"; continue when asked with that cursor, the same project and no path or recursive
  selection. Use `path` for folder drill-in and `recursive=True` for descendants. With no path,
  list the four folders: `files/` (private), `public/` (published to the world), and `docs/`
  and `tables/` (read-only projections). File paths must start with one of these folders.
  Show whether each file is published, using the returned publication status (also on search
  hits and write/move results). Absent `next_cursor` means the listing is complete.
- **Document** (`doc_read`): `## <Title>`, meta line `note · v3 · ✓ active · ◷ 2 days`, then
  the body rendered as markdown.
- **Table** (`db_read` + `db_describe`): markdown table; `date` absolute, `since` relative,
  `status` plain word, rich cells fall back to raw text. Show returned count and truncation.

## Images and links

Show images with `file_read(size=512)` for one image, `768` for a composite. Separate reads stack
vertically; use one composite for side-by-side. Keep sizes modest and don't re-show resolved
images: their context cost recurs each turn. Inline `![]()` and base64 widgets don't render.
Put requested full-resolution `[View]` links below pictures. For image generation/editing, use
`nuco-recipe` to find the shared **images** recipe; discover connector tools before calling them.

`public/` publishes to the world; require that intent.
Follow `publishing_hint` (share the final URL without re-checking) and retry guidance.
A private link is a bearer credential that cannot be revoked early.
Never paste it into docs or logs.
