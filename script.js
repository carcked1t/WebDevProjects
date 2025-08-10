const ASSETS = {
  envelope_closed:  "imgs/mail-removebg-preview.png",
  envelope_open:    "imgs/open_mail-removebg-preview.png",
  start_button:     "imgs/start-Photoroom.png",
  gift_front: {
    base:    "imgs/boxlow-removebg-preview.png",
    lid:     "imgs/lid-removebg-preview.png",
    r1:      "imgs/ribbon_1-removebg-preview.png",
    r2:      "imgs/ribbon2-removebg-preview.png",
    bow:     "imgs/bow-Photoroom.png"
  },
  raakhi: "imgs/raakhifull-removebg-preview.png"
};

function preloadList(list, cb) {
  const keys = Object.keys(list);
  let remaining = keys.length;
  keys.forEach(k => {
    const val = list[k];
    if (typeof val === "string") {
      const img = new Image();
      img.src = val;
      img.onload = img.onerror = () => { if (--remaining === 0) cb(); };
    } else if (typeof val === "object") {
      // nested
      preloadList(val, () => { if (--remaining === 0) cb(); });
    } else {
      if (--remaining === 0) cb();
    }
  });
}

const stageMail   = document.getElementById("stage-mail");
const envelope    = document.getElementById("envelope");
const mailText    = document.getElementById("mail-text");

const stageStart  = document.getElementById("stage-start");
const envelopeOpen = document.getElementById("envelope-open");
const startWrapper = document.getElementById("start-wrapper");
const startBtn     = document.getElementById("start-btn");
const arrowHint    = document.getElementById("arrow-hint");

const stageGift   = document.getElementById("stage-gift");
const baseEl      = document.getElementById("base");
const lidEl       = document.getElementById("lid");
const r1El        = document.getElementById("ribbon1");
const r2El        = document.getElementById("ribbon2");
const bowEl       = document.getElementById("bow");

const stageRaakhi = document.getElementById("stage-raakhi");
const raakhiEl    = document.getElementById("raakhi");
const finalText   = document.getElementById("final-text");

let state = "mail";

function showStage(idEl) {
  [stageMail, stageStart, stageGift, stageRaakhi].forEach(s => s.classList.add("hidden"));
  if (idEl) idEl.classList.remove("hidden");
}

function fadeIn(el, ms = 300) {
  el.style.opacity = 0;
  el.classList.remove("hidden");
  requestAnimationFrame(() => {
    el.style.transition = `opacity ${ms}ms ease`;
    el.style.opacity = 1;
  });
  setTimeout(()=> { el.style.transition = ""; }, ms+20);
}
function fadeOut(el, ms = 250) {
  el.style.opacity = 1;
  el.style.transition = `opacity ${ms}ms ease`;
  el.style.opacity = 0;
  setTimeout(()=> { el.classList.add("hidden"); el.style.transition = ""; }, ms+20);
}

function stageMailInit() {
  showStage(stageMail);
  envelope.src = ASSETS.envelope_closed;
  mailText.textContent = "You've got mail";
  envelope.addEventListener("click", onEnvelopeClick);
}

function onEnvelopeClick() {
  if (state !== "mail") return;
  state = "opening";
  mailText.classList.add("hidden");
  envelope.classList.add("hidden");
  stageStart.classList.remove("hidden");
  envelopeOpen.src = ASSETS.envelope_open;
  fadeIn(envelopeOpen, 350);
  setTimeout(() => {
    fadeIn(startWrapper, 250);
    startBtn.src = ASSETS.start_button;
    startWrapper.classList.remove("hidden");
    startBtn.classList.add("clickable");
    startBtn.addEventListener("click", onStartClick);
    state = "start";
  }, 400);
  envelope.removeEventListener("click", onEnvelopeClick);
}

function onStartClick(e) {
  if (state !== "start") return;
  state = "assembling";
  fadeOut(startWrapper, 200);
  fadeOut(envelopeOpen, 300);
  setTimeout(() => {
    showStage(stageGift);
    baseEl.src = ASSETS.gift_front.base;
    lidEl.src  = ASSETS.gift_front.lid;
    r1El.src   = ASSETS.gift_front.r1;
    r2El.src   = ASSETS.gift_front.r2;
    bowEl.src  = ASSETS.gift_front.bow;

    const pieces = [baseEl, lidEl, r1El, r2El, bowEl];
    pieces.forEach((p, i) => {
      setTimeout(() => {
        p.classList.remove("hidden");
        p.style.transform = "translateY(-8px) scale(0.96)";
        p.style.opacity = 0;
        requestAnimationFrame(() => {
          p.style.transition = `transform 200ms cubic-bezier(.2,.9,.3,1), opacity 300ms`;
          p.style.transform = "translateY(0) scale(1)";
          p.style.opacity = 1;
        });
        setTimeout(()=> { p.style.transition = ""; }, 200);
      }, i * 50);
    });

    setTimeout(() => {
      bowEl.classList.add("clickable");
      bowEl.addEventListener("click", onBowClick);
      state = "gift-front";
    }, pieces.length * 50 + 250);

  }, 350);
}
function onBowClick(e) {
  if (state !== "gift-front") return;
  state = "drifting";

  const driftConfig = [
    { el: baseEl,  x: -150, y: 150,  rot: -10, delay: 0   }, 
    { el: lidEl,   x:   0,  y: -200, rot:  18, delay: 150 },
    { el: r1El,    x: -200, y:  50,  rot: -36, delay: 300 }, 
    { el: r2El,    x:  200, y:  50,  rot:  32, delay: 450 }, 
    { el: bowEl,   x:   0,  y: 200,  rot:   6, delay: 600 }  
  ];

  driftConfig.forEach(cfg => {
    setTimeout(() => {
      cfg.el.style.transition = `transform 900ms cubic-bezier(.15,.9,.35,1), opacity 900ms ease`;
      cfg.el.style.transform = `translate(${cfg.x}px, ${cfg.y}px) rotate(${cfg.rot}deg) scale(0.8)`;
      cfg.el.style.opacity = 0;
    }, cfg.delay);
  });

  setTimeout(() => {
    showRaakhi();
  }, 1800);
}


function performDrift() {
  const driftConfig = [
    { el: lidEl,   x:  160, y: -180, rot:  18,  delay: 120 },
    { el: r1El,    x: -260, y:  140, rot: -36,  delay: 240 },
    { el: r2El,    x:  220, y:  120, rot:  32,  delay: 320 },
    { el: bowEl,   x:   0,  y:  260, rot:  6,   delay: 420 }
  ];

  driftConfig.forEach(cfg => {
    setTimeout(() => {
      cfg.el.style.transition = `transform 900ms cubic-bezier(.15,.9,.35,1), opacity 900ms ease`;
      cfg.el.style.transform = `translate(${cfg.x}px, ${cfg.y}px) rotate(${cfg.rot}deg) scale(0.8)`;
      cfg.el.style.opacity = 0;
    }, cfg.delay);
  });

  setTimeout(() => {
    showRaakhi();
    showStage(finalText);
  }, 1300);
}

function showRaakhi() {
  state = "raakhi";
  showStage(stageRaakhi);
  finalText.classList.remove("hidden");

  raakhiEl.classList.remove("hidden");
  raakhiEl.style.transition = "none";
  raakhiEl.style.transform = "scale(0.7)";
  raakhiEl.style.opacity = 0;

  void raakhiEl.offsetWidth;

  raakhiEl.style.transition = "transform 0.6s ease-out, opacity 0.6s ease-out";
  raakhiEl.style.transform = "scale(1)";
  raakhiEl.style.opacity = 1;
}


function init() {
  preloadList({
    envelope_closed: ASSETS.envelope_closed,
    envelope_open: ASSETS.envelope_open,
    start_button: ASSETS.start_button,
    gift_front: ASSETS.gift_front,
    raakhi: ASSETS.raakhi
  }, () => {
    stageMailInit();
  });


  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter" || ev.key === " ") {
      if (state === "mail") envelope.click();
      else if (state === "start") startBtn.click();
      else if (state === "gift-front") bowEl.click();
    }
  });
}


init();
