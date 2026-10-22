// Renders the grid, handles the open animation + modal, tracks opened boxes.
// You normally don't need to edit this file — all content lives in gifts.js.
// The one common tweak here is the opening sound; see playMeow() below.

(function () {
  var STORAGE_KEY = "openedGifts";

  var grid = document.getElementById("grid");
  var modal = document.getElementById("modal");
  var modalGift = document.getElementById("modal-gift");
  var modalEnding = document.getElementById("modal-ending");
  var modalPhoto = document.getElementById("modal-photo");
  var modalPlaceholder = document.getElementById("modal-placeholder");
  var modalTitle = document.getElementById("modal-title");
  var modalMessage = document.getElementById("modal-message");
  var modalEndingTitle = document.getElementById("modal-ending-title");
  var modalEndingBody = document.getElementById("modal-ending-body");
  var modalEndingSign = document.getElementById("modal-ending-sign");
  var modalEndingPhoto = document.getElementById("modal-ending-photo");
  var modalClose = document.getElementById("modal-close");

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ?reset clears the opened state so every box is closed again.
  if (location.search.indexOf("reset") !== -1) {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    try { history.replaceState(null, "", location.pathname); } catch (e) {}
  }

  var headingText = typeof heading === "string" ? heading : "Happy Birthday!";
  document.getElementById("page-heading").textContent = headingText;
  document.title = headingText;
  document.getElementById("page-subhead").textContent =
    typeof subheading === "string" ? subheading : "";
  document.getElementById("page-recipient").textContent =
    typeof recipient === "string" ? recipient : "";

  var opened = loadOpened();
  var ENDING_INDEX = gifts.length; // the ending box shares the opened list

  // Decorative bunting: rows of little flags on a string (page top + modal).
  var buntings = document.querySelectorAll(".bunting");
  for (var bi = 0; bi < buntings.length; bi++) {
    for (var f = 0; f < 50; f++) {
      buntings[bi].appendChild(document.createElement("span")).className = "flag";
    }
  }

  // Decorative background photos scattered around the page (data in gifts.js).
  var backdrop = document.getElementById("backdrop");
  if (backdrop && typeof backgroundPhotos !== "undefined" && Array.isArray(backgroundPhotos)) {
    // Automatic spots: two columns of polaroids on each side of the centred
    // gift grid (3 rows each; the outer rows are staggered 70px against the
    // inner rows so both columns stay visible where narrow windows force
    // them to overlap). INNER/OUTER are CSS expressions for the distance
    // from the window's middle: inner hugs the gifts and stays clear of the
    // 3-gift row (332px each side of the middle) down to ~1020px window
    // width and of the 4-gift row once the ending box appears at ~1300px.
    // Outer sits 240px further out but never leaves the window. Entries
    // beyond the 12 slots reuse them with a small offset.
    var INNER = "min(540px, 42vw)";
    var OUTER = "min(50vw - 100px, " + INNER + " + 240px)";
    var fromMiddle = function (px) { // signed px offset from the middle
      return "calc(50% " + (px < 0 ? "- " + -px : "+ " + px) + "px)";
    };
    var SLOTS = [
      { side: -1, col: INNER, fan: 0, y: -247, rot: -8 },
      { side: 1, col: INNER, fan: 0, y: -236, rot: 7 },
      { side: -1, col: INNER, fan: 20, y: 17, rot: 6 },
      { side: 1, col: INNER, fan: 20, y: 29, rot: -6 },
      { side: -1, col: INNER, fan: -15, y: 270, rot: -5 },
      { side: 1, col: INNER, fan: -15, y: 282, rot: 5 },
      { side: -1, col: OUTER, fan: 10, y: -167, rot: 4 },
      { side: 1, col: OUTER, fan: 10, y: -155, rot: -4 },
      { side: -1, col: OUTER, fan: -10, y: 98, rot: -7 },
      { side: 1, col: OUTER, fan: -10, y: 109, rot: 8 },
      { side: -1, col: OUTER, fan: 15, y: 339, rot: 3 },
      { side: 1, col: OUTER, fan: 15, y: 328, rot: -3 },
    ];
    backgroundPhotos.forEach(function (photo, i) {
      var slot = SLOTS[i % SLOTS.length];
      var lap = Math.floor(i / SLOTS.length); // extras reuse slots, nudged
      var el = document.createElement("div");
      el.className = "backdrop-photo";

      if (photo.x != null) {
        el.style.left = fromMiddle(photo.x); // pinned: exact offset
      } else {
        var fan = slot.fan + lap * 30;
        el.style.left = "calc(50% " + (slot.side < 0 ? "- " : "+ ") + "(" +
          slot.col + (fan < 0 ? " - " + -fan : " + " + fan) + "px))";
      }
      if (photo.y != null) {
        el.style.top = fromMiddle(photo.y); // pinned: exact offset
      } else {
        el.style.top = fromMiddle(slot.y + lap * 40);
      }
      if (photo.rotate != null) {
        el.style.setProperty("--rot", photo.rotate + "deg");
      } else {
        el.style.setProperty("--rot", slot.rot + "deg");
      }

      var shot = document.createElement("div");
      shot.className = "backdrop-shot";

      var placeholder = document.createElement("div");
      placeholder.className = "backdrop-placeholder";
      placeholder.textContent = photo.icon || "🖼️";
      shot.appendChild(placeholder);

      if (photo.photo) {
        var img = document.createElement("img");
        img.alt = "";
        img.addEventListener("load", function () {
          img.classList.add("loaded");
        });
        img.addEventListener("error", function () {
          img.removeAttribute("src"); // keep the placeholder art
        });
        img.src = photo.photo;
        shot.appendChild(img);
      }

      el.appendChild(shot);
      backdrop.appendChild(el);
    });
  }

  gifts.forEach(function (gift, i) {
    var el = buildBox(gift.accent, gift.label);
    if (opened.indexOf(i) !== -1) el.classList.add("opened");
    wireBox(el, i, function () { showModal(gift); });
    grid.appendChild(el);
  });

  // One last box: hidden until every gift is open, then it pops up and
  // opens like the others.
  var endingEl = null;
  if (ending && typeof ending === "object") {
    endingEl = buildBox(ending.accent, ending.label, true);
    endingEl.classList.add("gift-ending");
    endingEl.hidden = true;
    if (opened.indexOf(ENDING_INDEX) !== -1) endingEl.classList.add("opened");
    wireBox(endingEl, ENDING_INDEX, showEnding);
    grid.appendChild(endingEl);
    refreshEnding(false);
  }

  function buildBox(accent, label, envelope) {
    var el = document.createElement("div");
    el.className = "gift";
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.style.setProperty("--accent", accent || "#e8a8a0");

    var art = envelope
      ? '<div class="box envelope">' +
          '<div class="env-back"></div>' +
          '<div class="env-letter"></div>' +
          '<div class="env-front"></div>' +
          '<div class="env-flap"></div>' +
          '<div class="env-seal">\u2665</div>' +
        "</div>"
      : '<div class="box">' +
          '<div class="body"></div>' +
          '<div class="lid"><div class="bow"></div></div>' +
        "</div>";
    el.innerHTML = art + '<span class="gift-label"></span>';
    el.querySelector(".gift-label").textContent = label || "";
    return el;
  }

  function wireBox(el, index, show) {
    el.addEventListener("click", function () { openGift(el, index, show); });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openGift(el, index, show);
      }
    });
  }

  var showTimer = null;
  var hideTimer = null;

  function openGift(el, index, show) {
    var fresh = !el.classList.contains("opened");
    el.classList.add("opened");

    if (fresh && opened.indexOf(index) === -1) {
      opened.push(index);
      saveOpened(opened);
      playMeow();
      if (!reduced) {
        var r = el.getBoundingClientRect();
        confettiBurst(r.left + r.width / 2, r.top + r.height / 3);
      }
    }

    // Fresh boxes play the lid (or envelope) animation first; reopens go
    // straight to the modal.
    var delay = fresh && !reduced ? (el.classList.contains("gift-ending") ? 900 : 550) : 0;
    clearTimeout(showTimer); // a newer click replaces a pending reveal
    showTimer = setTimeout(show, delay);
  }

  function showModal(gift) {
    clearTimeout(hideTimer); // cancel a close still finishing
    modal.style.setProperty("--accent", gift.accent || "#e8a8a0");

    modalGift.hidden = false;
    modalEnding.hidden = true;

    modalTitle.textContent = gift.title || gift.label || "";
    modalMessage.textContent = gift.message || "";
    setPhoto(gift);

    modal.hidden = false;
    requestAnimationFrame(function () {
      modal.classList.add("visible");
    });
    modalClose.focus();
  }

  // Real photo when `photo` is set and loads; generated art otherwise.
  function setPhoto(gift) {
    modalPhoto.classList.remove("loaded");
    modalPhoto.alt = gift.title || "";
    modalPlaceholder.textContent = gift.icon || "🎁";
    if (gift.photo) {
      modalPhoto.src = gift.photo;
    } else {
      modalPhoto.removeAttribute("src");
    }
  }

  modalPhoto.addEventListener("load", function () {
    modalPhoto.classList.add("loaded");
  });
  modalPhoto.addEventListener("error", function () {
    modalPhoto.removeAttribute("src"); // keep the placeholder art
  });

  function hideModal() {
    modal.classList.remove("visible");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      modal.hidden = true;
      refreshEnding(true); // the last box pops up once the set is complete
    }, 250);
  }

  // The ending box is visible exactly when every gift has been opened.
  function refreshEnding(pop) {
    if (!endingEl) return;
    var complete = gifts.every(function (gift, i) {
      return opened.indexOf(i) !== -1;
    });
    if (complete) {
      if (endingEl.hidden) {
        endingEl.hidden = false;
        if (pop && !reduced) {
          endingEl.classList.add("pop");
          setTimeout(function () { endingEl.classList.remove("pop"); }, 450);
        }
      }
    } else {
      endingEl.hidden = true;
    }
  }

  function showEnding() {
    if (!ending || typeof ending !== "object") return;
    clearTimeout(hideTimer);
    modal.style.setProperty("--accent", ending.accent || "#c2b0dc");

    modalGift.hidden = true;
    modalEnding.hidden = false;

    modalEndingPhoto.hidden = true; // shown once the optional photo loads
    if (ending.photo) {
      modalEndingPhoto.alt = ending.title || "";
      modalEndingPhoto.src = ending.photo;
    } else {
      modalEndingPhoto.removeAttribute("src");
    }
    modalEndingTitle.textContent = ending.title || "";
    modalEndingBody.innerHTML = "";
    (ending.body || []).forEach(function (line) {
      var p = document.createElement("p");
      p.textContent = line;
      modalEndingBody.appendChild(p);
    });
    modalEndingSign.textContent = ending.signature || "";

    modal.hidden = false;
    requestAnimationFrame(function () {
      modal.classList.add("visible");
    });
    modalClose.focus();
  }

  modalEndingPhoto.addEventListener("load", function () {
    modalEndingPhoto.hidden = false;
  });
  modalEndingPhoto.addEventListener("error", function () {
    modalEndingPhoto.hidden = true; // missing file: card still works without it
  });

  modalClose.addEventListener("click", hideModal);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) hideModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) hideModal();
  });

  function loadOpened() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveOpened(list) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) {}
  }

  // ---- confetti: hand-rolled canvas burst from the opened box ----

  var canvas = document.getElementById("confetti");
  var ctx = canvas.getContext("2d");
  var particles = [];
  var rafId = null;
  var COLORS = ["#f2b3bd", "#a9c9e8", "#cbb7ea", "#f7e2a4", "#a9dac8", "#eebfe0"];

  function confettiBurst(x, y) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    for (var i = 0; i < 90; i++) {
      var angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3;
      var speed = 4 + Math.random() * 8;
      particles.push({
        x: x, y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        w: 5 + Math.random() * 6,
        h: 3 + Math.random() * 4,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.25,
        color: COLORS[i % COLORS.length],
        life: 1,
      });
    }
    if (rafId === null) rafId = requestAnimationFrame(tick);
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.vy += 0.22;           // gravity
      p.vx *= 0.99;           // drag
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 0.008;
      if (p.life <= 0 || p.y > canvas.height + 20) {
        particles.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.min(1, p.life * 1.5);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (particles.length) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // ---- sound: synthesized cat meow (no audio files) ----

  var audioCtx = null;

  function getAudioCtx() {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!audioCtx) audioCtx = new AC();
      return audioCtx;
    } catch (e) {
      return null;
    }
  }

  // Create the context at load and resume it on the first gesture, so the
  // open pop doesn't pay the audio-startup latency. Capture phase, so the
  // warm-up starts before the box handler plays the sound.
  getAudioCtx();
  function resumeAudio() {
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
      // near-silent blip so the output stream opens right away
      try {
        var o = audioCtx.createOscillator();
        var g = audioCtx.createGain();
        g.gain.value = 0.0001;
        o.connect(g);
        g.connect(audioCtx.destination);
        o.start();
        o.stop(audioCtx.currentTime + 0.05);
      } catch (e) {}
    }
    document.removeEventListener("pointerdown", resumeAudio, true);
    document.removeEventListener("keydown", resumeAudio, true);
  }
  document.addEventListener("pointerdown", resumeAudio, true);
  document.addEventListener("keydown", resumeAudio, true);

  // The meow is synthesized in code by playSynthMeow() below, so the page
  // needs no audio files. To use your own recording instead, drop it in
  // sounds/ (create the folder) and replace this function with something
  // like:
  //
  //   var meowAudio = new Audio("sounds/open-sound.mp3");
  //   function playMeow() {
  //     meowAudio.currentTime = 0;
  //     var p = meowAudio.play();
  //     if (p && p.catch) p.catch(playSynthMeow);
  //   }
  function playMeow() {
    playSynthMeow();
  }

  function playSynthMeow() {
    try {
      var ctx = getAudioCtx();
      if (!ctx) return;
      var start = function () {
        // schedule against a live clock: a just-resumed context has a
        // stale currentTime and would hold the sound back
        var t = ctx.currentTime + 0.01;
        // meow: a sawtooth "voice" whose pitch rises then falls, run through
        // two bandpass formants that sweep from "ee" to "ow"
        var dur = 0.7;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.exponentialRampToValueAtTime(520, t + 0.18);
        osc.frequency.exponentialRampToValueAtTime(450, t + 0.4);
        osc.frequency.exponentialRampToValueAtTime(230, t + dur);
        var vib = ctx.createOscillator(); // slight wobble
        var vibGain = ctx.createGain();
        vib.frequency.value = 7;
        vibGain.gain.value = 8;
        vib.connect(vibGain);
        vibGain.connect(osc.frequency);
        var f1 = ctx.createBiquadFilter();
        f1.type = "bandpass";
        f1.Q.value = 5;
        f1.frequency.setValueAtTime(450, t);
        f1.frequency.linearRampToValueAtTime(850, t + 0.25);
        f1.frequency.linearRampToValueAtTime(500, t + dur);
        var f2 = ctx.createBiquadFilter();
        f2.type = "bandpass";
        f2.Q.value = 6;
        f2.frequency.setValueAtTime(2000, t);
        f2.frequency.linearRampToValueAtTime(1300, t + 0.3);
        f2.frequency.linearRampToValueAtTime(900, t + dur);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.5, t + 0.08);
        gain.gain.setValueAtTime(0.5, t + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(f1);
        osc.connect(f2);
        f1.connect(gain);
        f2.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        vib.start(t);
        osc.stop(t + dur + 0.05);
        vib.stop(t + dur + 0.05);
      };
      if (ctx.state === "suspended") {
        var p = ctx.resume();
        if (p && p.then) {
          p.then(start, function () {});
        } else {
          start();
        }
      } else {
        start();
      }
    } catch (e) {}
  }
})();
