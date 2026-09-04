# Deploying the ADAPT-STL Design Studio for free

Two independent pieces, about 25 minutes total:

- **A. Storage** — a Google Sheet that receives every submission (free, unlimited for your volume).
- **B. Hosting** — a public HTTPS URL guests reach by scanning a QR code (free).

Do **A first**, because step B needs the URL that A produces.

The site is five files plus an `assets/` folder, about 450 KB. There is no build step, no server to run, no database to administer, and no login.

---

## A. Storage — Google Sheet + Apps Script

You need a Google account. That is the only account required.

### A1. Create the sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a blank spreadsheet.
2. Name it something like **ADAPT-STL Forum submissions**.
3. Leave it empty. The script creates the `boards`, `panels` and `raw_json` tabs itself on the first submission.

### A2. Add the script

1. In that sheet, choose **Extensions → Apps Script**. A new tab opens with a file called `Code.gs` containing an empty `myFunction()`.
2. Select everything in `Code.gs` and delete it.
3. Open `server/google-apps-script.gs` from this project, copy the whole file, and paste it in.
4. Press **Ctrl/Cmd + S** to save. Name the project **ADAPT-STL collector**.

### A3. Deploy it as a web app

1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in:
   - **Description**: `Forum collector v1`
   - **Execute as**: **Me (your@email)**
   - **Who has access**: **Anyone** ← this is the setting people get wrong. Not "Anyone with Google account". Guests will not be signed in.
4. Click **Deploy**.
5. Google asks you to authorize. Click **Authorize access** → pick your account → you will see **"Google hasn't verified this app"** → click **Advanced** → **Go to ADAPT-STL collector (unsafe)** → **Allow**. This warning is normal for your own scripts.
6. Copy the **Web app URL**. It looks like:
   `https://script.google.com/macros/s/AKfycb.....................45/exec`

### A4. Check it is live

Paste that `/exec` URL into a browser tab. You should see:

```json
{"ok":true,"service":"ADAPT-STL collector","boardsReceived":0}
```

If you get a sign-in page instead, "Who has access" is not set to **Anyone** — redeploy with the right setting.

### A5. Point the app at it

Open `config.js` and edit two lines:

```js
window.ADAPT_CONFIG = {
  eventName: 'Saint Louis Forum 2026',
  collectUrl: 'https://script.google.com/macros/s/AKfycb...../exec',
  collectMode: 'cors',
  alwaysDownload: false,
};
```

Save the file. That is the only file you ever edit.

### A6. Test end to end (do this before the event)

1. Open `index.html` — locally is fine, but a real test on the hosted URL from step B is better.
2. Walk through the wizard, add one panel, type something in its note box, submit.
3. Open the Google Sheet. Within a second or two you should see a row in `boards` and one in `panels`.

**If the sheet fills up but the app says "Could not reach the server"**, the POST is working and only the response is being blocked. Set `collectMode: 'no-cors'` and `alwaysDownload: true` in `config.js` and re-test. Submissions will still land; the app just stops trying to read the reply.

**If nothing arrives at all**, re-check A3 step 3 ("Anyone") and A4.

### A7. Redeploying after a script change

If you ever edit the script — including updating to the version in this repo, which added the `row_index` / `col_index` columns and the read endpoint the gallery uses — use **Deploy → Manage deployments → pencil icon → Version: New version → Deploy**. This keeps the same `/exec` URL. Using "New deployment" instead gives you a *different* URL and your printed QR codes would still point at the old one.

### A8. Reading the boards back — `gallery.html`

The sheet gives you the text. `gallery.html` gives you the **pictures**: it redraws every dashboard exactly as the participant arranged it — same panels, same side-by-side and stacked rows, same free-layout positions — with the note each person wrote sitting under the panel it belongs to.

1. Open `https://<your-site>/gallery.html`. It is not linked from the participant app, so nobody at the event stumbles into it.
2. Paste your `/exec` URL and the **view key**, then press **Load boards**. The key is `VIEW_KEY` at the top of `server/google-apps-script.gs` — change it from the default before the event.
3. Or skip the sheet entirely: drag in the `adapt-stl-*.json` files participants downloaded, or paste the contents of the `raw_json` column. Several files at once is fine, and duplicates are ignored.

Once loaded you can filter by hazard and purpose, sort by date or panel count, download a combined panel CSV across every board, and use the print button to save the whole gallery as a PDF — one page-break-safe block per board, which is what you want for a workshop debrief or a figure appendix.

Everything happens in your browser. No board data is sent anywhere by this page.

### Getting the board configurations out

The Sheet holds the same board three ways, so pick whichever suits the question:

- **`panels` tab** — one row per panel, 41 columns. `row_index` / `col_index` reconstruct rows-and-columns boards exactly; `pos_x` / `pos_y` / `width_px` / `height_px` / `surface_width_px` do the same for free-layout boards. This is the tidy analysis table.
- **`boards` tab** — one row per submission, 32 columns. Board-level metadata, the decision brief and the whole report block. Join to `panels` on `board_code`.
- **`raw_json` tab** — the complete original submission as a JSON string, one row per board. Nothing is ever lost here, even if a later schema drops a field.

Export any tab with **File → Download → Comma-separated values**.

**`tools/boards.py`** turns any of those three into board objects, text diagrams of each layout, or reshaped CSVs:

```bash
# straight from the deployed script
python tools/boards.py --url "https://script.google.com/macros/s/AKfy.../exec" --key stl-forum-2026 --layout

# or from a downloaded tab
python tools/boards.py --raw-csv raw_json.csv --layout
python tools/boards.py --panels-csv panels.csv --wide boards_wide.csv --tidy panels_tidy.csv
```

`--layout` prints each board as an ASCII picture with the panels sized to their real column widths and each person's note underneath the panel it belongs to. `--wide` writes one row per board with a `layout` string like `alert / heat-map | table / timeline`, which is directly countable. `--tidy` writes one row per panel with `visual_row` / `visual_col` filled in for **both** layout modes — in free layout it bands panels whose vertical centres are within 60 px, so a free-form board becomes comparable to a template one. `--json-dir` dumps one `.json` per board, which `gallery.html` will accept by drag-and-drop.

### Getting the data out

- **CSV**: in the sheet, open the `panels` tab and choose **File → Download → Comma-separated values**. That is your tidy panel-level table, one row per panel, grouped by `board_code`.
- **R**: `readr::read_csv("panels.csv")`, or read the sheet live with `googlesheets4::read_sheet(url, sheet = "panels")`.
- **Python**: `pandas.read_csv("panels.csv")`.
- The `raw_json` tab keeps the complete original submission for every board, so nothing is lost even if you later want a field the flat tables don't carry.

---

## B. Hosting

**Already done — the site is live at [https://orhuna.github.io/adapt-stl-dashboard/](https://orhuna.github.io/adapt-stl-dashboard/)**, published from the public repo [`orhuna/adapt-stl-dashboard`](https://github.com/orhuna/adapt-stl-dashboard) on the `main` branch. That is the URL the printed QR code points at, and it will not change. To update the site, commit and push to `main` — GitHub rebuilds within a minute or two and the QR code keeps working.

```bash
git add -A && git commit -m "tweak wording" && git push
```

The alternatives below are kept in case you ever want to move off GitHub. All are free, give you HTTPS, and are fast enough for a room full of phones.

### Option 1 — Netlify Drop (about 2 minutes, no command line)

Netlify Drop takes a drag-and-dropped folder and hosts it immediately; sites under 50 MB are fine and this one is under 1 MB ([Netlify](https://app.netlify.com/drop)).

1. Make sure `config.js` already has your `collectUrl` from step A5.
2. Put the project folder — `index.html`, `styles.css`, `app.js`, `catalog.js`, `config.js` and the `assets/` folder — together in one folder. The `server/` folder and the `.md` files can stay; they are ignored.
3. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)**.
4. Drag the folder onto the drop zone. Do not zip it, and do not drag only `index.html` — the whole folder must go, or the images and scripts break.
5. Wait for the upload, then click **Claim your site** and sign in with GitHub, GitLab or email to keep it permanently. Unclaimed drops expire.
6. You get a URL like `https://cheerful-otter-a1b2c3.netlify.app`. Under **Site configuration → Change site name**, rename it to something readable such as `adapt-stl-studio`, giving `https://adapt-stl-studio.netlify.app`.
7. To update the site later, drag the folder onto the site's **Deploys** tab. The URL stays the same, so your printed QR codes keep working.

### Option 2 — GitHub Pages (what this project uses)

Free for public repositories and served over GitHub's CDN with HTTPS ([GitHub Docs](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)). This is already set up; the steps are recorded here so you can redo it on another account.

1. Create a new **public** repository — Pages on private repos needs a paid plan.
2. Push the project files with `index.html` at the repository root.
3. **Settings → Pages → Build and deployment**: **Source: Deploy from a branch**, **Branch: `main`**, **Folder: `/ (root)`**. Save.
4. Wait one to two minutes. Your URL is `https://<your-username>.github.io/<repo>/`.
5. To update: commit and push; the site republishes automatically.

**Two things to know about the public repo.**

- `config.js` — and therefore your `/exec` URL — is publicly visible. That URL only accepts writes, so the worst case is somebody posting junk rows into the sheet, which you can spot and delete because every row carries a `board_code` and timestamp. If that is unacceptable, use Netlify or Cloudflare below, where the file is not browsable.
- Leave `viewKey` empty in `config.js` and type the key on the gallery page instead. Otherwise the key that unlocks reading everyone's submissions sits in a public file.

### Option 3 — Cloudflare Pages (most generous free tier)

Unlimited bandwidth on the free plan and it accepts a direct upload with no Git repository ([Cloudflare](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/)).

1. Sign up at [dash.cloudflare.com](https://dash.cloudflare.com) (free).
2. **Workers & Pages → Create → Pages → Upload assets**.
3. Name the project `adapt-stl-studio`, then drag in the project folder and click **Deploy site**.
4. You get `https://adapt-stl-studio.pages.dev`.
5. To update, open the project and use **Create new deployment → Upload assets**.

---

## C. The QR code

Once you have the final URL from step B:

- Easiest: any free generator, e.g. [qr-code-generator.com](https://www.qr-code-generator.com/) or [qrcode-monkey.com](https://www.qrcode-monkey.com/). Choose **URL**, paste, download as **PNG at 1000 px or larger**, or SVG if you are printing large.
- Or generate it yourself: `pip install qrcode[pil]` then
  `python -m qrcode "https://adapt-stl-studio.netlify.app" --output=qr.png --error-correction=H`

Printing rules that actually matter at an event:

- Print at **A5 or larger**, one per table. A code smaller than about 4 cm fails from across a table.
- Use **high error correction (H)** so a coffee ring or a crease doesn't kill it.
- Print the plain URL underneath in readable type. Some phones will refuse the code and someone will want to type it.
- **Test the printed code**, on the venue Wi-Fi, with both an iPhone and an Android phone, before the session.

---

## D. Event-day checklist

- [ ] `config.js` has the correct `collectUrl`, and a test submission has landed in the sheet.
- [ ] The hosted URL opens on a phone, a tablet and a laptop.
- [ ] The Google Sheet is open on the facilitator laptop so you can watch boards arrive.
- [ ] QR codes printed, tested on venue Wi-Fi, URL printed underneath.
- [ ] A few tablets or laptops on hand — side-by-side arrangement and free-layout dragging need a screen wider than 880 px; phones fall back to a stacked single column with up/down reordering.
- [ ] Fallback ready: if the venue network fails, set `collectUrl: ''` (offline mode) and each guest's device downloads its own JSON + CSV for you to collect.

---

## A9. After a schema change (v5 — the report block)

The export grew from 37 to 47 columns when the report questions were added. Which steps you follow depends on whether this Sheet has ever been deployed.

**First check which case you are in.** In the Apps Script editor click **Deploy → Manage deployments**.

- If the dialog is **empty** — a gear labelled "Select type" on the left and *"Please select a deployment type"* in the middle — you have **never deployed this script**. Go to A9-a.
- If you see a **row with a deployment name, a version number and a Web app URL**, you already have one. Go to A9-b.

### A9-a. You have never deployed (first-time setup)

There is nothing to update — you are simply doing the original setup with the current script. Close the "Manage deployments" dialog and:

1. Make sure the editor contains the **current** `server/google-apps-script.gs` from the site files. Select all, delete, paste, **Ctrl/Cmd + S**.
2. **Deploy → New deployment** (not "Manage deployments").
3. Click the **gear icon** next to "Select type" → choose **Web app**.
4. Fill in the form that appears on the right:
   - **Description**: `Forum collector v1`
   - **Execute as**: **Me (your@email)**
   - **Who has access**: **Anyone** — not "Anyone with Google account". Guests will not be signed in. This is the single most common mistake.
5. Click **Deploy**.
6. Authorize: **Authorize access** → pick your Google account → **"Google hasn't verified this app"** → **Advanced** → **Go to ADAPT-STL collector (unsafe)** → **Allow**. That warning is normal for a script you wrote yourself.
7. Copy the **Web app URL** — it ends in `/exec`.
8. Paste it into `config.js` as `collectUrl`, then commit and push so the live site picks it up:

   ```bash
   git add config.js && git commit -m "Point the studio at the Google Sheet collector" && git push
   ```

9. Verify: open the `/exec` URL in a browser tab. You should see
   `{"ok":true,"service":"ADAPT-STL collector","boardsReceived":0}`.
   A Google sign-in page instead means "Who has access" is wrong — redo step 4 via A9-b.

Then submit one test board from your phone and confirm a row appears in the `boards` tab with the ten `report_*` columns.

### A9-b. You already have a deployment (updating the script)

1. Paste the current `server/google-apps-script.gs` over the whole editor contents and save.
2. **Deploy → Manage deployments** → click the **pencil icon** on the existing row.
3. Set **Version** to **New version** in the dropdown. Leave everything else alone.
4. Click **Deploy**.

This keeps the same `/exec` URL, so `config.js` and your printed QR codes keep working. Choosing "New deployment" instead would give you a *different* URL and silently break collection.

5. In the Sheet, rename the existing `boards` and `panels` tabs to `boards_v4` and `panels_v4`, or delete them. The script writes its header row only into an empty tab, so an old tab would keep its old, now-wrong headers while the new values shift underneath them.
6. Submit one test board and confirm the ten `report_*` columns appear.

Boards submitted under v4 still load in the gallery; they simply show no report block.

## E. Cost and limits

| Piece | Free tier | Where you would hit a wall |
| --- | --- | --- |
| Google Apps Script web app | Free with any Google account | Consumer accounts have daily execution and runtime quotas; a Forum session uses a few dozen short calls |
| Google Sheets | Free | 10 million cells; you will use a few thousand |
| Netlify | Free | Monthly bandwidth cap on the free plan; drag-drop sites must stay under 50 MB |
| GitHub Pages | Free for public repos | Published site size and soft monthly bandwidth limits |
| Cloudflare Pages | Free | Unlimited bandwidth; a per-deployment file-count limit |

Nothing about this workshop comes close to any of those limits.

---

## F. Privacy note for the paper

Board codes are random (`STL-XXXX`) and no account or login is involved. Role and organization are optional, and the only identifying field is the optional follow-up email in the decision brief. The app deliberately does **not** use `localStorage` or cookies, so shared kiosk tablets carry nothing over between guests. `user_agent` is stored purely to distinguish phone from desktop submissions and can be dropped before analysis.
