# Birthday Gift Boxes

A single-page birthday surprise: clickable gift boxes that animate open to
reveal a photo and a personal message. When every gift has been opened, one
last envelope appears; opening it shows the final birthday card.

Built with plain HTML, CSS, and JavaScript. No build step, no dependencies,
no framework. Open `index.html` directly or host it as static files.

**No photos or audio files are included.** The page ships with generated
placeholder art (emoji + gradients), so it works immediately. Add your own
photos and text to make it personal.

## Quick start

1. Open `index.html` in a browser.
2. Edit `js/gifts.js` — all text and photo paths live there.
3. Put your photos in `images/` and set the matching `photo` fields.

## What to personalize

| What | Where | Notes |
|---|---|---|
| Browser title + page heading | `js/gifts.js` → `heading` | Also sets `document.title` |
| Line under the heading | `js/gifts.js` → `subheading` | |
| Optional recipient line | `js/gifts.js` → `recipient` | Leave `""` to hide |
| Gift boxes | `js/gifts.js` → `gifts[]` | One object per box |
| Final card | `js/gifts.js` → `ending` | Hidden until all gifts are open |
| Decorative polaroids | `js/gifts.js` → `backgroundPhotos[]` | Optional; delete entries you don't want |
| Gift / ending photos | `images/` + `photo` fields | See below |
| Page background | `css/style.css` → `.backdrop` | Pastel gradient by default |
| Open sound | `js/main.js` → `playMeow()` | Synthesized by default |
| Confetti colours | `js/main.js` → `COLORS` | Six pastel hex values |
| Overall theme | `css/style.css` | Colours, ribbons, bunting, layout |

### Gift entries

Each object in `gifts` accepts:

```js
{
  label: "Open me!",       // small text under the box
  title: "Gift one",       // heading in the reveal card
  icon: "🎁",              // placeholder art until `photo` loads
  photo: "",               // e.g. "images/gift-1.jpg"
  message: "Your message", // text in the reveal card
  accent: "#b5d6b2",       // ribbon/lid colour
}
```

Add or remove entries in any order. The grid wraps automatically, and the
ending box only appears once every gift has been opened.

### The ending card

```js
const ending = {
  label: "One last thing…",
  title: "A Birthday Message",
  body: ["First paragraph.", "Second paragraph."],
  signature: "— Your name",
  // photo: "images/ending.jpg", // optional
  accent: "#c2b0dc",
};
```

`body` is an array, so each string becomes its own paragraph.

### Decorative polaroids

`backgroundPhotos` scatters optional photos around the page. All frames are
the same portrait size. Each entry accepts:

```js
{ photo: "", icon: "📷", rotate: -8 }
```

- `photo` — path in `images/`; empty shows the emoji placeholder.
- `icon` — emoji used for the placeholder.
- `rotate` — tilt in degrees.
- `x` / `y` — optional pixel offsets from the middle of the window
  (negative = left/up). Leave them out for automatic placement.
- Delete entries you don't want. Around six often looks less busy than twelve.

## Adding photos

1. Resize the image to roughly 800 px wide (phone originals are large and
   slow the page down).
2. Save it in `images/`, e.g. `images/gift-1.jpg`.
3. Point the matching `photo` field at it:

```js
photo: "images/gift-1.jpg",
```

If the file is missing or fails to load, the page keeps the generated emoji
placeholder — no broken-image icon.

The ending photo is optional. Omit the `photo` line entirely to hide it.

## Page background

The page uses a soft pastel gradient by default. To use a wallpaper instead,
add an image to `images/` and change `.backdrop` in `css/style.css`:

```css
.backdrop {
  background: #f7edf5 url("../images/page-bg.jpg") center / cover no-repeat;
}
```

## Open sound

The cat meow is synthesized in code, so no audio file is needed. To use your
own recording, see the commented example in `playMeow()` in `js/main.js`:
drop the file in `sounds/` (create the folder) and swap in the commented
loader.

## Reset

Opened boxes are remembered in the browser's `localStorage` under
`openedGifts`. Click the small **reset** link in the top-left corner, or add
`?reset` to the URL, to close them all again.

Opened state is stored by index, so reordering gifts after someone has opened
some can shift which boxes are marked as opened. Reset after reordering.

## Publish with GitHub Pages

1. Push the repo to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and the `/ (root)` folder, then save.
5. Your page will be at `https://<username>.github.io/<repo>/`.

## Privacy note

This repo intentionally contains no photos. If you add personal photos,
remember that anything committed to a public repository is visible to
everyone. The `.gitignore` includes a commented block you can enable to keep
image files out of git while you work locally.

## How it works

- `index.html` — page shell and modal markup.
- `js/gifts.js` — all content and photo paths (data only).
- `js/main.js` — renders boxes, modal, confetti, synthesized meow, opened state.
- `css/style.css` — layout, gift-box drawing, bunting, animations.
- `images/` — your photos (none included).

No build step. Everything runs in the browser.

## License

No license file is included. Add one if you want others to reuse this project.
