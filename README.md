# PG Finder — PG Management System

A responsive front-end web application for browsing, searching, and booking PG (paying guest) accommodation. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no backend, fully client-side.

🔗 **Live Demo:** _(add your deployed link here after hosting on Netlify/GitHub Pages)_

## Features

- 🏠 **Home page** with featured rooms, facilities, gallery, and trust stats
- 🔍 **Room search & filter** — live search by room type, plus filter buttons (All / Single / Double / Triple)
- 📄 **Dynamic room details page** — a single page that renders different room data based on a URL parameter (`room-details.html?room=single`), instead of duplicating HTML per room
- 📝 **Booking form** with validation, pre-filled room type, and persistence via `localStorage`
- 🔐 **Login & Register** with simple client-side authentication backed by `localStorage`
- ✉️ **Contact form** with inline success feedback
- 📱 **Fully responsive** layout (mobile, tablet, desktop)

## Tech Stack

- HTML5
- CSS3 (custom properties / variables, Flexbox, CSS Grid)
- Vanilla JavaScript (DOM manipulation, event handling, `localStorage`, `URLSearchParams`)

## Project Structure

```
pg-management/
├── index.html
├── about.html
├── rooms.html
├── room-details.html
├── booking.html
├── booking-success.html
├── login.html
├── register.html
├── contact.html
├── facilities.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── images/
```

## Key Technical Decisions

- **Single dynamic `room-details.html`** instead of a separate file per room — room data lives in a JS object (`ROOMS`) in `script.js`, and the correct room is loaded based on a `room` query parameter. This avoids HTML duplication and mirrors how real apps fetch data by ID.
- **`localStorage` as a mock database** — since this is a front-end-only project, bookings, user accounts, and login sessions are persisted in the browser via `localStorage`, simulating what a real backend + database would do.
- **Component-style CSS** — buttons, cards, and form styles are written once and reused across pages via shared classes (`.btn`, `.card`, `.facility-tags`, etc.).

## Possible Future Improvements

- Connect to a real backend (Node/Express + MongoDB or similar) to replace `localStorage`
- Add real authentication (hashed passwords, sessions/JWT)
- Add an admin dashboard to manage rooms and bookings
- Add image upload for room listings

## Run Locally

No build step needed — it's plain HTML/CSS/JS.

```bash
git clone https://github.com/<your-username>/pg-management-system.git
cd pg-management-system
```

Then just open `index.html` in your browser, or use a local server (recommended, so paths resolve correctly):

```bash
# using VS Code Live Server extension, or:
python -m http.server 5500
```

---

Built by Sonal Patil
