# Yalla — Product Requirements Document

**Course:** Technology Product Management (364-1-2020), Ben-Gurion University
**One-liner:** A swipe-first mobile app that helps young olim chadashim turn loneliness into belonging — discovering local activities and meeting people, one swipe at a time.

> Demo data is invented. This PRD frames the product against the course methodologies (JTBD, segmentation, Lean Canvas, MoSCoW, North Star + funnel).

---

## 1. Problem & Jobs To Be Done

Young new immigrants (olim) arrive with energy and time but **no social graph and no map of "what's on."** Existing tools are fragmented: Facebook groups (noisy, Hebrew-heavy), Meetup (thin in Israel), municipal absorption portals (bureaucratic, not social). The emotional cost is isolation in the first 6–18 months — the window that most predicts whether an oleh stays.

**Jobs To Be Done (why they "hire" Yalla):**
- *When* I've just arrived and know no one, *I want* to find people my age with shared interests, *so I can* build a social circle fast.
- *When* I have a free evening, *I want* to find a nearby activity in a language I understand, *so I can* get out of the apartment without friction.
- *When* I don't speak Hebrew yet, *I want* the whole experience in my language, *so I* don't feel like an outsider before I even start.

## 2. Target Segment & Persona

**Segment (narrow, per course guidance):** olim aged **18–35**, 0–24 months in Israel, in the three metros where most young olim land — **Tel Aviv, Jerusalem, Be'er Sheva** (incl. lone soldiers, students, young professionals).

**Primary persona — "Maya, 26, from Paris":** made aliyah 4 months ago, rents in central Tel Aviv, working Hebrew is weak, wants friends and things to do, lives on her phone. Swipes through Tinder/Instagram daily; expects that interaction model.

## 3. Market Opportunity

- ~**25–30k** olim arrive yearly (typical year); the 18–35 cohort is the majority. **SAM:** young olim in the three metros in their first 2 years.
- **Unfair advantage:** purpose-built bilingual (HE/EN) experience and a *two-sided* graph (activities **and** people) tuned for the newcomer moment — neither generic dating apps nor event listings serve this segment's specific JTBD.

## 4. Vision & North Star

**Vision:** every young oleh has a full social calendar within their first month.
**North Star Metric:** *weekly connections made* = (activities saved/joined) + (mutual matches) per active user. It captures the real value — getting out and meeting people — not vanity installs.

## 5. Lean Canvas (summary)

| Block | Summary |
|---|---|
| Problem | Isolation + no "what's on" map for new olim; tools are fragmented and Hebrew-heavy |
| Customer segments | Olim 18–35, first 2 years, TLV/JLM/BSV |
| UVP | "Your new life in Israel, one swipe at a time" — bilingual, activities + people in one app |
| Solution | Two swipe decks (activities, people), distance filter, map, matches |
| Channels | Nefesh B'Nefesh / Masa / university aliyah offices, IG, lone-soldier programs |
| Revenue | Freemium (paid boosts/unlimited swipes), promoted local activities |
| Cost | Lean — content/partnerships, infra |
| Key metrics | North Star (weekly connections), W1 retention, swipe→save→join funnel |
| Unfair advantage | Newcomer-specific bilingual two-sided graph |

## 6. Solution Overview

A single mobile-first app (built as a clickable prototype for this project):
- **Two separate swipe decks** — Activities/Events and People — so discovering *things to do* and *people to meet* stay distinct, each with its own visual identity (warm sunset vs. sea-teal).
- **Distance filter** (radius + city) feeding both decks and the map.
- **Map view** with activities pinned per city.
- **Matches & Saved**, and a **bilingual HE/EN toggle** that flips the entire UI RTL⇄LTR.
- **Signature:** a "new-life passport" motif — likes thump a *YALLA!* stamp; matches collect like stamps in a passport.

## 7. MVP Scope (MoSCoW)

- **Must:** onboarding + profile; activities swipe deck; people swipe deck with mutual-match; distance filter; bilingual HE/EN (RTL); saved/matches; local persistence.
- **Should:** map with pins; activity detail + join.
- **Could:** in-app chat, real geolocation, calendar sync, host-an-activity.
- **Won't (this version):** payments, real accounts/auth, push notifications, content moderation tooling.

## 8. Key User Stories

- As a new oleh, I can set my city, interests, and language in under a minute.
- As a user, I can swipe right to save an activity and see it in Saved.
- As a user, I can swipe right on a person and, on a mutual like, get a match and start a conversation.
- As a non-Hebrew speaker, I can flip the whole app to English at any time.
- As a user, I can narrow results to a distance I'm willing to travel, on both the deck and the map.

## 9. Success Metrics & Funnel

**North Star:** weekly connections made.
**Funnel (where we'll hunt bottlenecks):** Install → Onboarding complete → First swipe → First save/like → First match/join → W1 return.
**Supporting KPIs:** onboarding completion %, swipe→save rate, like→match rate, D1/W1 retention, activities joined per WAU.

## 10. Go-To-Market & Risks

- **GTM:** seed via aliyah organizations (Nefesh B'Nefesh, Masa), universities, and lone-soldier programs; cross the chasm from early adopters (proactive new arrivals) to the mainstream via word-of-mouth and partner events.
- **Key risks:** cold-start liquidity (need enough people + activities per city) → seed each metro one at a time; safety/trust for in-person meetups → verification + reporting before scale; activity supply → partner with existing community organizers.
