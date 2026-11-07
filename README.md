# Portfolio – Rifaat Al Hasan Ayon

## Structure
- `index.html` – page markup
- `css/main.css` – main styles
- `css/overrides.css` – later add-on styles (skills, education, GitHub panel, easter eggs...), loaded after main.css
- `js/` – scripts, numbered in load order (keep that order; 01-main.js must stay first)
- `js/31-preload-all.js` – loads/decodes everything after the intro so nothing loads or fades in while scrolling
- `assets/img`, `assets/audio` – images and sound that used to be embedded as base64
