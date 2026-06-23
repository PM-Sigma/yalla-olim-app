# Changelog

All notable changes to **Yalla**. Newest first.

## 2026-06-23

### Fixed
- **Joining a fill-in (pickup) game now adds it to Saved → Activities.** Previously a joined
  game was recorded but never appeared in the Saved list. Joined games show with a ⚡ tag and
  tapping one jumps to the Fill-in tab.

### Added
- **Activities Calendar** (יומן החוגים) with **Google Calendar** and **`.ics`** export per activity.
- **Fill-in / pickup feed** (השלמה) — team sports starting in the next 1–2 h that are short on
  players, with a push banner surfacing the most urgent open game.
- **Create activity** flow + **My Events** page with live signup progress bars.
- **Real interactive map** (Leaflet + OpenStreetMap) with markers per city; stylized SVG map as
  an offline fallback.
- **Signed-up / capacity** shown on activity details (with a progress bar) and Saved rows.
- Full project docs: `ONBOARDING.md` (architecture, data model, dev workflow) and `PRD.md`.

### Changed
- Recolored the whole app to a **warm dating-app palette** (sunset + rose).
- Map data: kept Tel Aviv pins on land, tightened the Jerusalem cluster, and added 7 more
  Be'er Sheva activities (now the main hub).

### Fixed (mobile)
- Use **`dvh`** for full-height so the bottom nav clears the mobile address bar.
- Lifted overlays **above the map** (z-index) so detail/filter/create sheets are no longer clipped.

### Notes
- Front-end only: no backend/DB. Content lives in `data.js`; user state in `localStorage`.
  Matches, signups and joins are local/simulated (see `ONBOARDING.md` §6).
