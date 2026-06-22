# Yalla · יאללה 🌅

**Your new life in Israel — one swipe at a time.**

A swipe-first prototype that helps **young olim chadashim (new immigrants, 18–35)** turn loneliness
into belonging: discover local activities and meet people, in Hebrew **or** English.

Built as the clickable product for the *Technology Product Management* course (BGU). Data is
invented — the point is to show the product. Full product thinking is in [PRD.md](PRD.md).

## ✨ Features
- **Two separate swipe decks** — Activities/Events 🔥 and People 💞 (mutual like → *It's a match!*).
- **Bilingual HE/EN** with a one-tap toggle that flips the whole UI **RTL ⇄ LTR**.
- **Map** with activities pinned across Tel Aviv, Jerusalem, and Be'er Sheva.
- **Distance filter** that re-filters both decks and the map.
- **Saved & Matches**, activity details, profile — and your picks persist (localStorage).
- Signature **"new-life passport"** motif: a *YALLA!* stamp on every like.

## 🏃 Run it
No build, no dependencies. Either:
1. **Double-click `index.html`** — it just opens, even offline; or
2. Serve it: `python -m http.server 8077` then open `http://localhost:8077`.

## 🤝 Contribute
It's plain HTML/CSS/JS (no framework, no bundler):
- `index.html` — structure · `styles.css` — design system · `data.js` — content + HE/EN strings · `app.js` — logic.
- Add an activity or person → edit the arrays in `data.js`. Add a UI string → add the key to both `he` and `en` in `data.js`.
- Append `?debug=1` to the URL to run the built-in self-checks (console).

Fork it, open a PR, or ask for collaborator access.

## 📄 Note
Course demo. Invented data, no real accounts, no backend.
