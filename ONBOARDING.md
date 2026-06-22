# Yalla — Project Onboarding & Setup (מסמך הקמה)

> **Yalla** — a swipe-first app for young olim chadashim (18–35): half **dating/discovery**
> (swipe people → matches, swipe activities, map) and half **event management** (create
> activities, track signups, fill-in pickup games, calendar export).
> Built for the BGU *Technology Product Management* course. Data is invented; it's a clickable demo.
>
> מסמך זה נועד לאפשר לכל מי שמצטרף לפרויקט להבין אותו במלואו ולפתח בלי לשבור דברים.

---

## 1. Current status — where it stands

✅ **Working & deployed.** All core flows are built, verified in-browser, and live.

Implemented:
- Onboarding (name / age / origin / city / interests, skippable)
- Two **separate** swipe decks: Activities 🔥 and People 💞 (mutual like → "It's a match!")
- **Fill-in / pickup** feed ⚡ (team sports starting in 1–2 h, short on players) + push banner
- **Map** 📍 — real Leaflet + OpenStreetMap, pins per city (TLV / Jerusalem / Be'er Sheva)
- **Distance filter**, **Saved/Matches**, **Profile**
- **Create activity** + **My Events** with live signup progress bars
- **Activities Calendar** with Google Calendar + `.ics` export
- Bilingual **HE/EN** with full **RTL⇄LTR** flip; mobile-first (`dvh`, safe-area)
- `localStorage` persistence

Not built (deliberately — see PRD): real backend/DB, auth, real chat, payments, push notifications.

## 2. Repo & live links

- **Repo:** https://github.com/PM-Sigma/yalla-olim-app  (public)
- **Live app:** https://pm-sigma.github.io/yalla-olim-app/  (GitHub Pages, auto-rebuilds on push to `main`)
- **Local project folder:** `…\לימודים שנה ד\סמסטר ב\ניהול מוצר\פרוייקט`

## 3. Run & deploy

**Run locally** — no build, no install:
1. Double-click `index.html`, **or**
2. `python -m http.server 8077` in the project folder → open `http://localhost:8077`
   (a server is only needed if your browser blocks `file://` for some reason; the app works from `file://` too).

**Deploy:** just `git push` to `main` — GitHub Pages rebuilds in ~1 minute. No pipeline.

**Debug self-checks:** open the app with `?debug=1` → console runs assertions for the
non-trivial logic (distance filter, save routing, match trigger, calendar dates, pickup spots).

## 4. Architecture — the whole thing in 4 files

Vanilla HTML/CSS/JS. **No framework, no bundler, no npm, no dependencies to install.**

| File | Role |
|------|------|
| `index.html` | DOM shell: all screens/views, overlays (detail, filter, create, match), bottom nav, push banner. Loads the 3 assets below. |
| `styles.css`  | The entire design system (CSS variables → warm dating palette), all component styles, RTL, mobile `dvh`. |
| `data.js`     | **All content + all UI strings.** Global arrays + the `I18N` dictionary. This is the "database". |
| `app.js`      | All logic: state, rendering per screen, swipe, match, map, calendar, pickup, create, i18n, persistence. Wrapped in one IIFE. |
| `PRD.md`      | Product requirements (course methodologies: JTBD, persona, Lean Canvas, North Star, MoSCoW). |
| `README.md`   | Short public-facing intro + run/contribute. |

External resources (loaded from CDN, **degrade gracefully offline**):
- **Leaflet 1.9.4** (cdnjs) → real map. Offline → falls back to a stylized SVG city map.
- **Google Fonts** Rubik + Heebo → typography. Offline → system font stack (Segoe UI / system-ui).

## 5. Data model — "is there a DB?" → No. Here's what there is.

**Content lives in `data.js` as in-memory globals** (loaded fresh each page load):

| Global | Count | Shape (key fields) |
|--------|-------|--------------------|
| `ACTIVITIES` | 19 (TLV 6 / JLM 3 / BSV 10) | `id, city, emoji, cat, title{he,en}, blurb{he,en}, tags[], when{he,en}, distanceKm, attendees, x, y` |
| `PEOPLE` | 8 | `id, name, age, flag, city, color, likesYou, distanceKm, country{he,en}, langs[], interests[], bio{he,en}` |
| `PICKUP` | 6 | `id, emoji, city, have, need, inMin, sport{he,en}, loc{he,en}` |
| `CITIES` | 3 | `key, he, en` |
| `CITY_CENTER` | 3 | `lat, lng, zoom, span{lat,lng}` (map centering; pin lat/lng derived from `x/y` + span) |
| `INTERESTS` | 10 | `key, he, en, icon` |
| `COUNTRIES` | 15 | strings |
| `I18N` | he / en | every UI string by key; `dir` per language |

**User state persists in `localStorage` under key `yalla.v1`:**
```
{ lang, city, radius, profile, saved:[activityId], matches:[personId],
  pickupJoined:[pickupId], created:[ {id,title{he,en},cat,city,day,time,capacity,joined} ] }
```
`created` is seeded with 2 sample events (`e1`, `e2`) so My Events shows progress immediately.
A timer simulates incoming signups so created events visibly fill over time.

> To add content: edit the arrays in `data.js`. To add a UI string: add the key to **both**
> `he` and `en` in `I18N`. That's the whole "database migration".

## 6. Limitations & transparency — what's real vs. simulated

Be upfront with everyone: **Yalla is a front-end-only clickable prototype. There is no server
and no database.** This shapes what is and isn't real:

**No database / no backend**
- All content (activities, people, pickup games) is hard-coded in `data.js` and re-loaded from
  scratch on every page refresh. Editing the content = editing the file.
- The only saved data is the browser's `localStorage` (key `yalla.v1`). It is **per-browser,
  per-device, and private to you** — nothing syncs between users or devices.

**What's real (works as shown):** swiping, distance filtering, the map, the language/RTL toggle,
saving activities, the calendar Google/`.ics` export, and your own choices persisting on refresh
*in the same browser*.

**What's simulated (looks real, but is not multi-user):**
- **Matches** — a person "likes you back" only because they're flagged `likesYou:true` in data; there are no real other users.
- **Pickup "join" & signup counts** — joining updates the number locally only; no one else sees it.
- **My Events progress bars** — signups tick up via a timer, not real people registering.
- **The push banner** — an in-app banner, not a real OS/phone push notification.
- **Distance / "X km away"** — invented numbers; there is no real GPS/geolocation.

**Also not included (by design):** user accounts / login, real chat/messaging, payments,
content moderation, server-side storage, analytics.

**Consequences to remember**
- Clearing browser data, using a different browser, or another device = a fresh start.
- Friends will **not** see each other's created events, matches, or signups — each runs its own local copy.
- It's a public repo with invented data — never add real personal data or secrets.

Making any of this "real" would require a backend (DB + API + auth) — out of scope for the course
demo, but the front-end is structured so it could be wired to one later.

## 7. Screen / feature map (where code lives in `app.js`)

- **Routing:** `showView(name)` toggles `.view#view-<name>`; bottom nav `[data-view]`.
- **i18n:** `t(key)` (UI strings), `tr({he,en})` (content); `setLang()` flips `dir` + re-renders.
- **Swipe:** `renderDeck()`, `attachDrag()`, `doSwipe()`, `finalize()`. Match modal: `showMatch()`.
- **Map:** `renderMap()` (Leaflet or SVG fallback), `aLatLng()`, `cityMapSVG()`.
- **Filter:** `openFilter()`, `applyFilter()`, `filterByDistance()`.
- **Calendar/export:** `renderCalendar()`, `occ()/occDT()`, `gcalUrl()`, `downloadICS()`.
- **Pickup:** `renderPickup()`, `joinPickup()`, `pkHave()/pkSpots()`, push: `showPush()`.
- **Create / My Events:** `buildCreateForm()`, `submitCreate()`, `renderMyEvents()`, `capacityOf()`.
- **Persistence:** `load()` / `save()` (localStorage).

## 8. Development Workflow — how we avoid mistakes  🛠️

Treat this as the project's house rules. Following them prevents ~all of the bugs we've hit.

1. **Verify in the browser before every commit.** Open the screen you touched, click through it,
   and check the console is clean. Add `?debug=1` to run the self-checks. *Never claim "it works" without looking.*
2. **Bilingual is not optional.** Any new UI text → add the key to **both** `he` and `en` in `I18N`,
   and render it with `t("key")`. Any displayed content field → make it `{he,en}` and render with `tr()`.
   A missing language key shows the raw key on screen.
3. **Mobile-first, always.** Use `dvh` (not `vh`) for full-height; keep the bottom nav inside the
   viewport; respect `env(safe-area-inset-*)`. Test at a phone width.
4. **Overlays must beat the map.** Leaflet uses z-index ~1000. Modals/sheets are `z-index: 2000`,
   the map is wrapped in `isolation: isolate`. Keep new popups above 1000 or inside an isolated context.
5. **External resources must degrade.** Anything from a CDN (Leaflet, fonts) has to fall back when
   offline — guard with `if (window.L)` etc. Never let a network resource block the app from running.
6. **Keep it dependency-free.** No npm, no framework, no build step. If you reach for a library,
   first check it can be a few lines of vanilla JS. This is a feature, not a limitation.
7. **One runnable check per non-trivial function.** Add an assertion to `runSelfChecks()` (behind
   `?debug=1`) for any new branch/loop/parsing/money-or-count logic.
8. **Small, descriptive commits.** One change per commit; message says what + why. Push triggers deploy.
9. **Editing gotcha:** lines with Hebrew + column-aligned spacing can break exact-match edits.
   Match on a short, unique ASCII-bounded anchor instead of the whole aligned block.
10. **Don't store secrets / real personal data.** It's a public repo with invented data — keep it that way.

## 9. Contributing (for teammates)

1. Clone: `git clone https://github.com/PM-Sigma/yalla-olim-app.git`
2. Open `index.html` or run the local server (section 3).
3. Make a change in the relevant file (section 4), verify in the browser (section 8, rule 1).
4. Commit + push to `main` (or open a PR). Pages redeploys automatically.

No environment setup, no keys, no DB. If `index.html` opens in a browser, you're ready to develop.
