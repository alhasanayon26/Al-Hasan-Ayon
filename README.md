# Portfolio – Rifaat Al Hasan Ayon

## Open in VS Code
1. File > Open Folder... and pick this folder.
2. Install the recommended **Live Server** extension (VS Code will offer it).
3. Right-click `index.html` > **Open with Live Server**.

Open it through Live Server (http://127.0.0.1:5500), not by double-clicking the file:
a few effects read image pixels on a canvas, and browsers block that on file:// pages.

## Structure
- `index.html` – page markup
- `css/main.css` – main styles
- `css/overrides.css` – later add-on styles (skills, education, GitHub panel, easter eggs...), loaded after main.css
- `js/` – scripts, numbered in load order (keep that order; 01-main.js must stay first)
- `js/31-preload-all.js` – loads/decodes everything after the intro so nothing loads or fades in while scrolling
- `assets/img`, `assets/audio` – images and sound that used to be embedded as base64
