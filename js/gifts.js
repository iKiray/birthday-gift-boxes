// DATA ONLY — this is the one file to edit.
//
// Everything you personalize lives here:
//   heading, subheading, recipient  → the text at the top of the page
//   gifts[]                         → one entry per gift box
//   backgroundPhotos[]              → optional decorative polaroids
//   ending                          → the final card, shown after every gift is open
//
// Photos: drop a file in images/ and set `photo` to its path, e.g.
// "images/gift-1.jpg". Leave `photo: ""` to show generated placeholder art
// built from the entry's `icon` emoji. No photos are included in this repo.

// Text at the top of the page (also used as the browser tab title).
// Try something like: "Happy Birthday, Sam!"
const heading = "Happy Birthday!";

// Line under the heading.
const subheading = "Tap a gift to open it.";

// Optional line under the subheading, e.g. "For Sam". Leave "" to hide it.
const recipient = "";

// One entry per gift box, in the order they should appear.
// Add or remove entries freely — the grid wraps and the ending box waits
// until every entry here has been opened.
const gifts = [
  {
    label: "Open me!", // small text under the box
    title: "Gift one", // heading in the reveal card
    icon: "🎁", // placeholder art emoji, used until `photo` is set
    photo: "", // e.g. "images/gift-1.jpg" — empty shows placeholder art
    message: "Write a message for this gift here.", // reveal text
    accent: "#b5d6b2", // box ribbon/lid colour
  },
  {
    label: "One more…",
    title: "Gift two",
    icon: "🎟️",
    photo: "",
    message: "Write a message for this gift here.",
    accent: "#a3c3de",
  },
  {
    label: "And another…",
    title: "Gift three",
    icon: "🎀",
    photo: "",
    message: "Write a message for this gift here.",
    accent: "#e8a8a0",
  },
];

// Decorative polaroids scattered around the page — purely cosmetic.
// All frames are the same size. To use a real photo, drop it in images/ and
// set `photo` (e.g. "images/bg-1.jpg"); an empty `photo` shows placeholder
// art built from `icon`.
// Position: leave `x`/`y` out and the picture gets an automatic spot beside
// the gifts, or set `x`/`y` (pixels from the middle of the window; negative
// = left/up) to pin it exactly. `rotate` is the tilt in degrees.
// Delete entries you don't want — around six often looks less busy than twelve.
const backgroundPhotos = [
  { photo: "", icon: "📷", rotate: -8 },
  { photo: "", icon: "🎈", rotate: 7 },
  { photo: "", icon: "🎂", rotate: 6 },
  { photo: "", icon: "🌷", rotate: -6 },
  { photo: "", icon: "⭐", rotate: -5 },
  { photo: "", icon: "🎉", rotate: 5 },
  { photo: "", icon: "🌈", rotate: 4 },
  { photo: "", icon: "🦋", rotate: -4 },
  { photo: "", icon: "🍭", rotate: -7 },
  { photo: "", icon: "🎁", rotate: 8 },
  { photo: "", icon: "🌻", rotate: 3 },
  { photo: "", icon: "💫", rotate: -3 },
];

// Shown as one last gift box once every other gift has been opened;
// clicking it opens the card like any other gift.
const ending = {
  label: "One last thing…", // text under the last box
  title: "A Birthday Message",
  body: [
    "Write your birthday message here.",
    "Add another paragraph, or delete this one.",
  ],
  signature: "— Your name",
  // Optional picture at the top of the ending card:
  // photo: "images/ending.jpg",
  accent: "#c2b0dc", // box ribbon/lid colour
};
