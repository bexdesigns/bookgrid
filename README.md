#  BookGrid

**Turn your reading list into a beautiful, shareable book cover grid.**

BookGrid is a lightweight, mobile-first web app that fetches book cover images automatically and arranges them into a clean visual grid — perfect for Instagram Stories, Bookstagram posts, and yearly reading wrap-ups.

---

## Features

- **Automatic cover fetching** via the Google Books API
- **Drag-and-drop reordering** on desktop and mobile (iOS Safari + Android supported)
- **Custom grid title** to label your list (e.g., "My 2025 Reads")
- **Screenshot-ready layout** — the white frame is your crop boundary
- **Cover caching** so repeat searches load instantly
- **Placeholder cards** for any titles not found in the API
- No accounts. No uploads. No backend. Just paste and go.

---

## How to Use

1. **Paste your book list** — one book per line, in the format `Title by Author`
2. **Add an optional title** for your grid
3. **Click "Generate Book Grid"** and wait for covers to load
4. **Drag covers** to reorder them however you like
5. **Screenshot the white-framed grid** and share it

---

## Sharing Tips

- **Instagram Stories:** The 4-column mobile layout is optimized for a 9:16 crop
- **Feed posts:** Use desktop view for a wider 6–8 column grid
- The white frame in the app is your intended crop boundary — screenshot just that area

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (Grid, custom properties) |
| Logic | Vanilla JavaScript (ES6+) |
| Drag & Drop | [SortableJS](https://sortablejs.github.io/Sortable/) |
| Cover Images | [Google Books API](https://developers.google.com/books) |
| Hosting | GitHub Pages |
| Storage | localStorage (cover cache + custom title) |

---

## 📁 File Structure

```
bookgrid/
├── index.html       # App structure and markup
├── styles.css       # All styling and responsive layout
├── app.js           # Cover fetching, grid rendering, drag-and-drop
├── .nojekyll        # Tells GitHub Pages to skip Jekyll processing
└── README.md        # You are here
```

---

## Running Locally

No installation or build step required.

1. Clone or download this repository
2. Open `index.html` in any modern browser
3. That's it

```bash
git clone https://bexdesigns.github.io/bookgrid/
cd bookgrid
open index.html
```

---

##  About

BookGrid was built for readers who want a fast, beautiful way to visualize and share what they've been reading — without fussing with design tools or social media templates. It's image-only, screenshot-first, zero friction.

---

## License

MIT License — free to use and build on.
