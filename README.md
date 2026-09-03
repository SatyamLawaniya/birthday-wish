# 🎂 Birthday Wish — Pastel Slideshow

A super cute React + Vite page with a pastel-themed photo slideshow, cutesy animations, and a birthday wish overlay.

## Setup

```bash
cd birthday-wish
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Adding your photos

Drop your images into `public/photos/` named:

- `photo1.jpg`
- `photo2.jpg`
- `photo3.jpg`
- `photo4.jpg`
- `photo5.jpg`

(Or edit the `PHOTOS` array in `src/App.jsx` to match your filenames / add more.)

## Customising

- **Name** — change the `NAME` constant in `src/App.jsx`
- **Wish lines** — edit the `WISH_LINES` array
- **Pastel filters** — tweak or add entries in the `FILTERS` array
- **Slide speed** — change `4000` (ms) in the auto-advance timeout

## Controls

- `←` / `→` — prev / next photo
- `space` — pause / play slideshow
- drag a photo left/right to swipe
