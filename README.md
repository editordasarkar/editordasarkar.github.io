# Harshkumar Puthran — Portfolio

## Files
- `data.js` — **the only file you edit.** Video links, 3D model, résumé text.
- `index.html`, `styles.css`, `script.js` — layout, design, interactions.
- `scene.js` — the 3D scroll scene (Three.js).
- `assets/portrait.jpg` — photo used in the contact section.

## Adding a video
Open `data.js`, find the project, paste the link between the quotes:

```js
{ title: "Black Friday Campaign", type: "Campaign", year: "2025",
  link: "https://youtu.be/XXXXXXXXXXX", thumbnail: "", vertical: true },
```

- **YouTube (unlisted OK):** thumbnail is automatic.
- **Google Drive:** Share → General access → *Anyone with the link* (Viewer).
  Add `thumbnail: "assets/thumbs/name.jpg"` if the Drive preview image doesn't appear.
- `vertical: true` for Reels/Shorts (9:16). Empty `link: ""` shows "Coming soon".
- `SETTINGS.openVideosIn` — `"popup"` (plays on the site) or `"newtab"`.
- `SETTINGS.showreel` — paste a link to show a **Play showreel** button on the first screen.

## Adding your 3D character
1. Make a 3D model of yourself from a photo with an image-to-3D tool
   (e.g. Meshy or Tripo3D — use a clear, front-facing head-and-shoulders photo).
2. Export / download it as **GLB**.
3. Put the file in `assets/`, e.g. `assets/character.glb`.
4. In `data.js`: `character3D: "assets/character.glb",`
5. If it faces the wrong way, set `characterTurn: 180` (or 90 / -90).
   If it looks too big/small, change `characterScale` (e.g. 0.8 or 1.2).

Keep the file under ~10 MB so the site loads fast.

## Previewing
The 3D model and YouTube popups need the site to be served (not double-clicked):
host it, or run a local server in this folder, e.g. `ruby -run -e httpd . -p 8642`
then open http://localhost:8642.

## Hosting (free)
Netlify Drop: go to app.netlify.com/drop and drag this whole folder onto the page.
