# iThirst Water Case Tracker

A single front-end dashboard for VOW Center's iThirst Street Evangelism
ministry, showing cases of water given by family/donor name, sourced live
from Notion.

- **Filter** by Including Ministers / Excluding Ministers / Ministers Only
- **Sort** by most cases, fewest cases, name, or date given
- **Light/dark toggle** (defaults to light, remembers your choice)
- Blues + grey palette, sans-serif type (Manrope + Inter)

## 1. The Notion database

A database called **iThirst Water Donations** has already been created in
your workspace, nested under **VOW Center Ops**:

https://app.notion.com/p/fa32bc0ba6354057a377892737ed7883

Schema:

| Property           | Type   | Notes                                                                    |
|--------------------|--------|---------------------------------------------------------------------------|
| `Name`             | Title  | Family or donor name                                                     |
| `Cases`            | Number | Cases of water given                                                     |
| `Tags`             | Select | Any two options — e.g. `Lay Member`/`Minister`, or `Member`/`Minister`   |
| `Date Given`       | Date   | Optional                                                                 |
| `Notes`            | Text   | Optional                                                                 |
| `Entry Type`       | Select | `Donation` or `Site Text`                                                |
| `Header`           | Text   | Only used on the `Site Text` row                                         |
| `Subheader`        | Text   | Only used on the `Site Text` row                                         |
| `Goal`             | Number | Only used on the `Site Text` row — the case-count goal in the progress bar |
| `Cases Given Away` | Number | Only used on the `Site Text` row — running total of cases distributed on the street |
| `Logo`             | Files  | Only used on the `Site Text` row — upload an image to override the bundled Verity mark |

It's pre-loaded with 3 sample donation rows so you can confirm the site
works — delete them once you add real entries.

### The "Minister" tag is the only fixed one

The `Tags` select can use whatever wording you want for the non-minister
option (e.g. rename "Lay Member" to just "Member") — the site reads that
text directly from Notion and reflects it everywhere: the tag pill on
each row, and the legend label under the progress bar. No code change or
redeploy needed.

The one exception: the app looks specifically for a tag whose text is
"Minister" (case-insensitive) to power the Including/Excluding/Only
filters and the ministers/non-ministers case split. Keep that one option
named "Minister" for those to keep working.

### Editing the page header, goal, and given-away count from Notion

One row, titled **"Site Text — do not delete"**, has `Entry Type` set to
`Site Text` instead of `Donation`. Its fields drive everything at the top
of the site:

- **Header** → "Cases of Water Given"
- **Subheader** → "Every case logged here reaches the street through
  iThirst. Filter by who gave, sort by what matters, and watch the total
  rise."
- **Goal** → `150` — the target shown in the progress bar under the total.
  Set it to whatever the current campaign goal is; the bar and percentage
  update automatically.
- **Cases Given Away** → running total of cases actually distributed on
  the street (separate from cases donated). Update it manually as
  outreach happens; "Still in stock" on the site is calculated as
  total donated minus this number.
- **Logo** → upload an image here to replace the default Verity mark at
  the bottom of the page. Leave empty to keep the bundled default.

Edit any of these any time and the live site picks it up within about
60 seconds — no redeploy needed. This row is excluded from the donation
list and totals automatically, since the app filters by `Entry Type`.
Just don't change its `Entry Type` or delete the row, or the site falls
back to its built-in defaults.

## 2. Connect Notion to this app

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
   and create a new **internal integration** (e.g. "iThirst Dashboard").
   Copy the **Internal Integration Token** — this is your `NOTION_TOKEN`.
2. Open the **iThirst Water Donations** database in Notion, click `···` in
   the top right → **Connections** → add the integration you just created.
   (Without this step, the API can't read the database.)
3. Grab the **database ID** from the URL above — it's the 32-character
   string right after the workspace name and before any `?`:
   `fa32bc0ba6354057a377892737ed7883`. This is your `NOTION_DATABASE_ID`.

## 3. Local development

```bash
npm install
cp .env.example .env.local
# paste your NOTION_TOKEN and NOTION_DATABASE_ID into .env.local
npm run dev
```

Visit `http://localhost:3000`.

## 4. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: iThirst water case tracker"
git branch -M main
git remote add origin <your-new-repo-url>
git push -u origin main
```

## 5. Deploy on Vercel

1. Import the GitHub repo in [vercel.com/new](https://vercel.com/new).
   Make sure the **Framework Preset** is set to **Next.js** (Vercel
   usually auto-detects this from `package.json`).
2. Under **Environment Variables**, add `NOTION_TOKEN` and
   `NOTION_DATABASE_ID` (same values as your `.env.local`).
3. Deploy. New Notion entries appear on the site within about a minute
   (no redeploy needed — the data route revalidates every 60 seconds).

## Reusable template pieces

Built with future Verity/VOW Center outreach dashboards in mind — these
pieces are meant to be copied as-is into new projects:

- **`app/components/BrandMark.tsx`** + **`public/brand/verity-mark.png`**
  — the footer wordmark, centered at 50% opacity, inverted to white in
  dark mode. Accepts an optional `logoUrl` prop so a project-specific
  logo set in Notion overrides the bundled default.
- **The "Site Text" row pattern** in `lib/notion.ts` — a single row in
  the same database, flagged by an `Entry Type` property, that holds
  page copy, goals, and settings without needing a second database or
  redeploy to edit.

## Notes

- All Notion access happens server-side (`app/api/donations/route.ts`);
  your token is never exposed to the browser.
