# ADAPT-STL Design Studio — Facilitator Guide

A browser-based participatory design tool for the final 45 minutes of the Saint Louis Forum. Guests scan a QR code, answer what they want a geospatial tool to *do*, assemble it from realistic panel presets on an Esri Experience Builder–style canvas, and write down the data and information each panel would require. Those written needs are the research data.

---

## What the guest experiences

| Step | Screen | What is captured |
| --- | --- | --- |
| 0 | Welcome | — |
| 1 | Purpose + hazard | Purpose (7 options), hazard focus (heat / flood / both), role, organization |
| 2 | Layout | Which of 7 layout options they started from, and whether they ended in tidy-grid or free layout |
| 3 | Build canvas | Panel type, title, position, size for every panel; free-text need (written in the box under each panel), plus data required, geography, freshness, data availability and priority |
| 4 | Review & submit | Decision brief: decision supported, action that follows, missing data, barrier |
| 5 | Done | Board code (`STL-XXXX`) read aloud or written on a card |

**Purposes offered** — see the situation (visualization), move people & resources (routing), answer "what about my address?" (near-me lookup), decide and trigger action (operational decision support), prioritize investment (planning & capital), watch and warn (monitoring & early warning), engage the community (communication & reporting).

**Panel catalog** — ~30 presets in four groups: Maps & scenes, Charts & indicators, Alerts & timing, Tools & interaction, Text & notes. Heat- and flood-specific panels are tagged with a colored badge, and the purpose choice pre-fills sensible starter panels.

Every preset shows a realistic preview, not an empty box: the map panels use real St. Louis heat, flood-depth, routing and susceptibility imagery; the charts, alerts, gauges and tools are drawn mock interfaces that resize with the panel.

**Every panel carries its own note box.** Under each panel on the canvas there is a text area labelled *"What do you need this panel to show you?"* (or *"Your note"* on a text panel). It stays amber until something is written in it, and it is the same field as the one in the right-hand properties panel — typing in either updates both. This is the single most important field in the instrument.

**Two layout modes.** The toolbar above the canvas has a **Tidy grid / Free layout** switch, and no work is lost when someone flips between them.

- *Tidy grid* — panels snap into a six-column grid, nothing overlaps. Best on phones and for people who want to move fast.
- *Free layout* — a completely open canvas. Drag a panel's title bar to move it anywhere, drag its bottom-right corner to resize it, overlap panels freely. Choosing the **"Build my own — free layout"** template starts here on an empty canvas. This mode needs a screen wider than 880 px; on a phone the panels stack into a readable single column and the drag positioning is disabled.

A search box above the panel list filters all ~30 presets by name, so nobody has to scroll to find "hydrograph".

---

## Running the 45 minutes

| Time | Activity |
| --- | --- |
| 0–5 min | Frame the question: "If someone built you the tool you actually need for heat and flooding, what would be on the screen?" Show the QR code. |
| 5–10 min | Everyone completes Step 1 and Step 2 individually. Reassure people there is no wrong answer and no GIS knowledge required. |
| 10–30 min | Build. Circulate and push on the written fields — the layout alone is not the data. The most useful prompt is: *"What would you look at on this panel, and what would you do next?"* |
| 30–40 min | Review & submit. Ask each table to read their decision brief aloud. |
| 40–45 min | Facilitator collects board codes and the exported files. |

**The single most important facilitator behavior:** guests will happily arrange panels and skip the text boxes. Panels with no written need are flagged in red on the Review screen. Point at them.

---

## Deployment and collection

The site is fully static — five files plus an `assets/` folder, no build step, no login, no database, and no `localStorage` (so shared kiosk tablets stay clean and nothing leaks between guests).

Full click-by-click hosting and storage instructions are in **DEPLOY.md**, including a ready-made Google Apps Script collector in `server/google-apps-script.gs`.

### Two collection modes

Edit `config.js`:

```js
window.ADAPT_CONFIG = {
  eventName: 'Saint Louis Forum 2026',
  collectUrl: '',        // empty = offline mode
  alwaysDownload: false, // true = always give the guest a copy too
};
```

- **Offline mode (`collectUrl: ''`)** — the default. On Submit, the guest's device downloads `adapt-stl-STL-XXXX.json` and `.csv`. A facilitator collects them (AirDrop, email, USB) or the guest emails them. Works with no network at the venue.
- **Server mode** — set `collectUrl` to any endpoint that accepts a JSON `POST` (a Google Apps Script web app, a Formspree/Netlify function, or your own Flask route). Submissions arrive automatically. If the POST fails, the app silently falls back to a device download so no board is ever lost.

A minimal Google Apps Script receiver:

```js
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  SpreadsheetApp.openById('SHEET_ID').getSheetByName('boards')
    .appendRow([new Date(), d.board_code, d.purpose, d.hazard, JSON.stringify(d)]);
  return ContentService.createTextOutput('ok');
}
```

Deploy it as a web app with access set to "Anyone", then paste the `/exec` URL into `collectUrl`.

### QR code

Print the QR code at A5 or larger and put one on every table. Test one scan on the venue Wi-Fi before the session starts — and have a short fallback URL written underneath the code in case a phone camera struggles.

---

## Export schema

Schema id: `adapt-stl-design-studio/v3`.

The JSON keeps the full board (design metadata + ordered panel array + decision brief). The CSV is one row per panel with 35 columns, ready to load straight into R or pandas:

```
board_code, event, submitted_at, app_title, purpose, hazard, template,
role, organization, decision, action, audience, open_frequency,
missing_data, barrier, contact, panel_order, panel_type, panel_type_name,
panel_category, panel_hazard_tag, panel_title, need_text, data_needed,
geography, freshness, data_availability, priority, layout_mode,
width_cols, height_rows, pos_x, pos_y, width_px, height_px
```

In free layout, `pos_x` / `pos_y` / `width_px` / `height_px` record where the participant actually put each window (with `surface_width_px` in the JSON as the reference frame), and panels are ordered top-to-bottom then left-to-right. In tidy-grid mode those columns are blank and `width_cols` / `height_rows` carry the geometry instead.

Concatenating every guest's CSV gives a single tidy panel-level table; `board_code` is the grouping key for board-level analysis.

---

## Coding the results for the paper

The instrument is designed so that most variables are pre-coded by the interface and only `need_text`, `data_needed`, `decision`, `action`, `missing_data` and `barrier` require qualitative coding.

Suggested analysis frame:

1. **Function demand** — frequency of `panel_type` and `panel_category`, cross-tabulated by `purpose` and `role`. Which capabilities are demanded regardless of role, and which are role-specific?
2. **Latency requirement** — distribution of `freshness` by `panel_category`. This is the clearest quantitative claim about whether existing static products meet practitioner needs.
3. **Spatial support** — distribution of `geography`. Expect a gap between the unit practitioners ask for (parcel, block, street segment) and the unit most published hazard data is served at (tract, county).
4. **Data gap** — `data_availability` = "not sure" / "does not exist" is the direct measure of perceived data gaps; `missing_data` gives the qualitative content.
5. **Decision linkage** — code `need_text` → `decision` → `action` triples to test whether requested map functions actually connect to a stated action, or stop at situational awareness.
6. **Layout as evidence** — compare `layout_mode`, and `pos_x`/`width_px` within free-layout boards. Whether a participant accepted a template, rearranged it, or started from the empty free canvas is a signal about how well existing dashboard conventions fit their mental model; the panel they made biggest and put top-left is usually the one they actually care about.
7. **Adoption barriers** — thematic coding of `barrier`, cross-tabulated with `role` and `organization` type.

Report `panel_hazard_tag` splits (heat / flood / neither) to show whether the two hazards generate different information needs or converge on a common core.

**Limitations to state in the paper.** The panel catalog is a closed set, so it constrains what participants can express; the blank and free-layout canvases and the per-panel free-text need field partially mitigate this, and the count of panels whose written need does not match its panel type is itself a useful signal. Participation is self-selected among Forum attendees. Board codes are anonymous, and role/organization are optional, so no personally identifying information is collected.

---

## Troubleshooting at the venue

| Problem | Fix |
| --- | --- |
| QR scans but page is blank | Venue Wi-Fi is blocking the font CDN — the app falls back to system fonts and still works. Reload once. |
| Guest cannot drag panels | Tell them to tap a panel in the left list, then tap an empty slot. The tap flow is the primary path on phones and tablets. |
| Guest accidentally closes the tab | The board is not recoverable by design. Tell people up front to submit before closing. |
| Nothing downloads on iOS | Safari blocks some downloads in private tabs. Use server mode, or have the guest read their notes aloud to a facilitator. |
| Screen is too small to build | The canvas becomes a single column below 880px. A tablet or laptop is a better experience than a phone for the build step. |
