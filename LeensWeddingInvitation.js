/* ==========================================================================
   طارق و لين — دعوة الزفاف / TAREQ & LEEN — WEDDING INVITATION
   Vanilla JS: content config, envelope interaction, countdown, reveal anims

   Site is Arabic/RTL throughout, all ten sections wired below: envelope,
   Qur'anic verse + formal family invitation, hero, venue illustration,
   about the couple, scratch-to-reveal date, countdown, location, adults-
   only note, and closing.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. CONTENT CONFIG
   All user-facing copy lives here so wording (or another language) can be
   swapped in one place without touching markup. Arabic strings are plain
   UTF-8 — edit them directly, right in this object.
   -------------------------------------------------------------------------- */
const INVITE_CONTENT = {
  // Envelope screen
  monogramGroom: "T",
  monogramBride: "L",
  envelopeScript: "دعوة زفاف",
  tapHint: "اضغط للفتح",

  // Qur'anic verse + formal family invitation page
  verseLeadText: "يتشرف",
  basmala: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  verseText: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
  verseReference: "سورة الروم، الآية ٢١",
  // Family names, split into two mirrored columns (see .family-columns) —
  // bride's family first so it lands on the right under RTL.
  brideFamilyName: "السيد أحمد عبدالله الخطيب",
  brideFamilyConsort: "وحرمه جيهان",
  groomFamilyName: "الدكتور ماهر سلامة",
  groomFamilyConsort: "وحرمه منال",
  // Exact wording as given — do not paraphrase. "كريمتهم/كريمهم" (their
  // honored daughter/son) used rather than "نجلتهم/نجلهم" as the more
  // conventional, grammatically natural phrasing for formal Arabic
  // wedding invitations.
  formalInvitationText: "بدعوتكم لحضور حفل زفاف كريمتهم الدكتورة لين وكريمهم المهندس طارق سلامة",

  // Hero
  groomName: "طارق",
  heroNamesConnector: "و",
  brideName: "لين",

 

  // The date — scratch-to-reveal cards. Arabic-Indic numerals for day/
  // year and the month as an Arabic word, matching how the date is
  // conventionally written out in formal Arabic invitations.
  dateSectionTitle: "الموعد",
  dateSectionSubtitle: "امسح لتكتشف التاريخ",
  scratchDay: "١٣",
  dayLabel: "اليوم",
  scratchMonth: "أكتوبر",
  monthLabel: "الشهر",
  scratchYear: "٢٠٢٦",
  yearLabel: "السنة",

  // Countdown
  countdownTitle: "بدء الاحتفال",
  daysLabel: "أيام",
  hoursLabel: "ساعات",
  minutesLabel: "دقائق",
  secondsLabel: "ثوانٍ",

  // Location
  locationTitle: "فندق دبليو",
  locationSubtitle: "حيث تبدأ لحظاتنا الأجمل",
  venuePhotoCaption: "عمّان، الأردن",
  venuePhotoHint: "اضغط لعرض الموقع",
  directionsBtnLabel: "احصل على الاتجاهات",

  // Adults-only note. Exact wording as given — do not paraphrase.
  adultsNote: "مع فائق حبنا لصغاركم، نرجو التكرم بجعل حضور هذه الأمسية خاصًا بضيوفنا الكبار، شاكرين لكم حسن تفهمكم.",

  // Closing. Exact wording as given — do not paraphrase.
  closingMessage: "جزيل الشكر والامتنان لتشريفكم هذه المناسبة الغالية على قلوبنا، فوجودكم معنا هو أسمى ما نتمناه في هذا اليوم المشهود.",
  closingSignature: "بكل الحب والامتنان، طارق ولين",

  // Machine-readable event data, kept separate from display strings
  event: {
    // Local venue time — countdown target. Start time only: the invitation
    // shows no end time, by request.
    isoDateTime: "2026-10-13T19:00:00",
    venueName: "W Hotel",
    // Used to build the "Get Directions" link. Replace with a precise
    // address or Google-provided place link for exact pin placement.
    mapsQuery: "W Hotel"
  }
};

/* Populate every element tagged with data-field from the config above.
   #directions-btn and #venue-photo-link additionally need an href built
   from event.mapsQuery — both point at the same Google Maps destination. */
function applyContent(content) {
  document.querySelectorAll("[data-field]").forEach((el) => {
    const key = el.getAttribute("data-field");
    if (Object.prototype.hasOwnProperty.call(content, key)) {
      el.textContent = content[key];
    }
  });

  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.event.mapsQuery)}`;
  ["directions-btn", "venue-photo-link"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = mapsHref;
  });
}

/* --------------------------------------------------------------------------
   1b. LIMITED-SCOPE EN/AR TRANSLATIONS
   Deliberately covers only a subset of data-field keys — the Qur'anic
   verse, formal family invitation, hero names, and closing monogram are
   NOT here on purpose and stay Arabic always, no matter the toggle.
   Reuses the same data-field attributes applyContent() above already
   populates, so switching language is just re-running that same lookup
   against this table instead of INVITE_CONTENT for whichever keys exist
   here. RSVP strings live in the same table since that section is new
   and needs both languages from the start. */
const TRANSLATIONS = {
  envelopeScript: { ar: "دعوة زفاف", en: "Wedding Invitation" },
  tapHint: { ar: "اضغط للفتح", en: "Tap to Open" },

  dateSectionTitle: { ar: "الموعد", en: "The Date" },
  dateSectionSubtitle: { ar: "امسح لتكتشف التاريخ", en: "Scratch to reveal the date" },
  dayLabel: { ar: "اليوم", en: "Day" },
  monthLabel: { ar: "الشهر", en: "Month" },
  yearLabel: { ar: "السنة", en: "Year" },
  scratchDay: { ar: "١٣", en: "13" },
  scratchMonth: { ar: "أكتوبر", en: "October" },
  scratchYear: { ar: "٢٠٢٦", en: "2026" },

  countdownTitle: { ar: "بدء الاحتفال", en: "The Celebration Begins" },
  daysLabel: { ar: "أيام", en: "Days" },
  hoursLabel: { ar: "ساعات", en: "Hours" },
  minutesLabel: { ar: "دقائق", en: "Minutes" },
  secondsLabel: { ar: "ثوانٍ", en: "Seconds" },

  locationTitle: { ar: "فندق دبليو", en: "W Hotel" },
  locationSubtitle: { ar: "حيث تبدأ لحظاتنا الأجمل", en: "Where our most beautiful moments begin" },
  venuePhotoHint: { ar: "اضغط لعرض الموقع", en: "Tap to view location" },
  venuePhotoCaption: { ar: "عمّان، الأردن", en: "Amman, Jordan" },
  directionsBtnLabel: { ar: "احصل على الاتجاهات", en: "Get Directions" },

  adultsNote: {
    ar: "مع فائق حبنا لصغاركم، نرجو التكرم بجعل حضور هذه الأمسية خاصًا بضيوفنا الكبار، شاكرين لكم حسن تفهمكم.",
    en: "With our deepest love for your little ones, we kindly ask that this evening be reserved for our adult guests. Thank you for your understanding."
  },

  closingMessage: {
    ar: "جزيل الشكر والامتنان لتشريفكم هذه المناسبة الغالية على قلوبنا، فوجودكم معنا هو أسمى ما نتمناه في هذا اليوم المشهود.",
    en: "With heartfelt thanks for honoring this occasion so dear to us — your presence with us is all we could wish for on this special day."
  },
  closingSignature: { ar: "بكل الحب والامتنان، طارق ولين", en: "With all our love and gratitude, Tareq & Leen" },

  
  // RSVP (new section — both languages built in from the start)
  rsvpQuestion: { ar: "هل ستتمكنون من الحضور؟", en: "Will you be attending?" },
  rsvpYes: { ar: "نعم", en: "Yes" },
  rsvpNo: { ar: "لا", en: "No" },
  rsvpDeclined: { ar: "سنفتقدكم! شكرًا لإخبارنا", en: "We'll miss you — thank you for letting us know" },
  rsvpNamePlaceholder: { ar: "اسمك", en: "Your name" },
  rsvpConfirm: { ar: "تأكيد", en: "Confirm" },
  rsvpConfirmed: { ar: "تم التأكيد، نتشوق لرؤيتكم!", en: "Confirmed — we can't wait to celebrate with you!" },
  rsvpError: { ar: "حدث خطأ، حاولوا مرة أخرى.", en: "Something went wrong — please try again." }
};

let currentLang = localStorage.getItem("inviteLang") || "ar";

/* Applies TRANSLATIONS to every matching [data-field] element (a strict
   subset of the elements applyContent() touches) and sets dir="ltr" on
   each one in English so it stays left-aligned/left-to-right even though
   the page itself is otherwise RTL throughout — a per-element flip
   rather than flipping the whole document's direction. */
function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("inviteLang", lang);

  document.querySelectorAll("[data-field]").forEach((el) => {
    const key = el.getAttribute("data-field");
    const entry = TRANSLATIONS[key];
    if (!entry) return; // outside the limited scope — left exactly as applyContent() set it
    el.textContent = entry[lang];
    if (lang === "en") {
      el.setAttribute("dir", "ltr");
    } else {
      el.removeAttribute("dir");
    }
  });

  // Placeholders aren't text nodes, so they need their own attribute
  // (data-field-placeholder) and the .placeholder property instead of
  // textContent — currently just the RSVP name input.
  document.querySelectorAll("[data-field-placeholder]").forEach((el) => {
    const entry = TRANSLATIONS[el.getAttribute("data-field-placeholder")];
    if (entry) el.placeholder = entry[lang];
  });

  const toggle = document.getElementById("lang-toggle");
  if (toggle) {
    toggle.setAttribute("aria-pressed", String(lang === "en"));
    toggle.querySelectorAll("[data-lang-option]").forEach((el) => {
      el.classList.toggle("is-active", el.getAttribute("data-lang-option") === lang);
    });
  }

  document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
}

function initLanguageToggle() {
  const toggle = document.getElementById("lang-toggle");
  if (!toggle) return;
  toggle.addEventListener("click", () => applyLanguage(currentLang === "ar" ? "en" : "ar"));
  applyLanguage(currentLang);
}

/* --------------------------------------------------------------------------
   1c. LIGHT/DARK THEME TOGGLE
   Pure CSS custom properties do the actual re-theming (see the --bg-page/
   --bg-section/--text-primary/--text-secondary/--border-color tokens and
   the [data-theme="dark"] override block in LeensWeddingInvitation.css) —
   this just toggles the attribute that selects between them and remembers
   the choice. Applied as early as possible (see the inline snippet at the
   top of <head> in the HTML) so returning visitors never see a flash of
   the wrong theme before this file finishes loading.
   -------------------------------------------------------------------------- */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("inviteTheme", theme);
  const toggle = document.getElementById("theme-toggle");
  if (toggle) toggle.setAttribute("aria-checked", String(theme === "dark"));
}

function initThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;
  toggle.setAttribute("aria-checked", String(document.documentElement.getAttribute("data-theme") === "dark"));
  toggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    applyTheme(isDark ? "light" : "dark");
  });
}

/* FIX #7: background music toggle. Only wires the mute/unmute button and
   keeps its icon/aria-pressed state in sync with the audio element's own
   play/pause events (rather than assuming its own click always succeeds) —
   the actual FIRST audio.play() call lives in initEnvelope()'s seal-tap
   handler below, since that's the deliberate user gesture browsers require
   before allowing audio-with-sound to autoplay; this button exists purely
   so the guest can mute afterward (or unmute again) whenever they want. */
function initMusicToggle() {
  const audio = document.getElementById("bg-music");
  const toggle = document.getElementById("music-toggle");
  if (!audio || !toggle) return;

  function setMuted(muted) {
    toggle.classList.toggle("is-muted", muted);
    toggle.setAttribute("aria-pressed", String(!muted));
  }

  toggle.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(() => {}); // ignored: only reachable via a real click, so this always succeeds in practice
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", () => setMuted(false));
  audio.addEventListener("pause", () => setMuted(true));
}

/* --------------------------------------------------------------------------
   1B. CANDLE GLOW (GSAP) — idle ambient life, entirely independent of the
   envelope open interaction below (nothing here touches openInvitation(),
   the flap, or the seal tap handler).

   Each corner-cluster candle (see index.html — these 3-per-side candles
   are inlined SVG now, not <use href="#motif-candle">, specifically so
   GSAP can reach .candle-flame via plain document.querySelectorAll; a
   <use>'s cloned shadow content isn't reachable that way, confirmed by
   direct testing) gets its own .candle-flame + .candle-glow-halo pair.
   Both are driven by a GSAP timeline reproducing an exact provided
   keyframe recipe (4 flame stops at 25/50/75/100%, a 2-stop glow pulse,
   a 2-stop seal breathe) rather than CSS @keyframes — GSAP animates by
   writing styles directly each tick (like the falling-petal canvas loop
   already does), sidestepping a rendering quirk this session already
   hit once elsewhere on this page with CSS @keyframes on this general
   family of nested elements (see #ribbon-bow's removal history). What
   makes candles never look mechanically synced isn't the shape of any
   one candle's cycle (they all run the identical recipe) — it's that
   each of the 6 candles gets its OWN specific duration/delay pair below
   (explicitly chosen, not randomized, per the exact spec this was built
   from), so despite sharing one motion recipe, no two ever land on the
   same beat.
   -------------------------------------------------------------------------- */

// One flame cycle: scale/skew/opacity return to their rest values at
// each stop, matching a 0%→25%→50%→75%→100% CSS keyframe loop where the
// same ease applies to every segment (the default when no keyframe sets
// its own timing-function) — sine.inOut approximates CSS ease-in-out.
function buildFlameTimeline(el, duration) {
  const seg = duration / 4;
  const tl = gsap.timeline({ repeat: -1 });
  tl.to(el, { scaleX: 1.04, scaleY: 0.97, skewX: -2, opacity: 0.94, duration: seg, ease: "sine.inOut" })
    .to(el, { scaleX: 0.96, scaleY: 1.05, skewX: 1.5, opacity: 1, duration: seg, ease: "sine.inOut" })
    .to(el, { scaleX: 1.02, scaleY: 0.98, skewX: -1, opacity: 0.96, duration: seg, ease: "sine.inOut" })
    .to(el, { scaleX: 1, scaleY: 1, skewX: 0, opacity: 1, duration: seg, ease: "sine.inOut" });
  return tl;
}
// Glow pulse: a plain 2-stop breathe (brighten+grow at the midpoint,
// settle back at the loop point), tied to the SAME candle's flame via
// its own duration/delay pair below so the light visibly breathes with
// it without being literally the same tween.
function buildGlowTimeline(el, duration) {
  const seg = duration / 2;
  const tl = gsap.timeline({ repeat: -1 });
  tl.to(el, { opacity: 1, scale: 1.08, duration: seg, ease: "sine.inOut" }).to(el, {
    opacity: 0.85,
    scale: 1,
    duration: seg,
    ease: "sine.inOut",
  });
  return tl;
}

// Exact per-candle timing pairs, left cluster's own values (order
// matches the DOM: tall, short, mid). The right cluster reuses the same
// 3 pairs with a flat +0.35s offset added to every delay below, so the
// two clusters' otherwise-identical candles never land on the same beat
// either — matching in cadence would be as noticeable as matching within
// one cluster given both are visible together on the closed envelope.
const CANDLE_TIMING = [
  { flameDuration: 1.7, flameDelay: 0, glowDuration: 2.1, glowDelay: 0.2 },
  { flameDuration: 2.3, flameDelay: 0.4, glowDuration: 2.6, glowDelay: 0.1 },
  { flameDuration: 1.9, flameDelay: 0.7, glowDuration: 2.2, glowDelay: 0.5 },
];
const CANDLE_CLUSTER_OFFSET_S = 0.35;

function initCandleGlow() {
  if (typeof gsap === "undefined") return; // CDN failed to load — page still works, just without this ambient layer

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const timelines = [];

  document.querySelectorAll(".envelope-botanicals").forEach((cluster, clusterIndex) => {
    const clusterOffset = clusterIndex * CANDLE_CLUSTER_OFFSET_S;
    cluster.querySelectorAll(".candle-wrap").forEach((wrap, i) => {
      const flame = wrap.querySelector(".candle-flame");
      const glow = wrap.querySelector(".candle-glow-halo");
      if (!flame || !glow) return;

      if (prefersReducedMotion) {
        // Static mid-point values, per request — no scale/opacity/skew
        // drama, just a plausible resting look.
        gsap.set(flame, { scaleX: 1, scaleY: 1, skewX: 0, opacity: 0.97 });
        gsap.set(glow, { opacity: 0.92, scale: 1.04 });
        return;
      }

      const timing = CANDLE_TIMING[i % CANDLE_TIMING.length];
      const flameTl = buildFlameTimeline(flame, timing.flameDuration);
      flameTl.delay(timing.flameDelay + clusterOffset);
      const glowTl = buildGlowTimeline(glow, timing.glowDuration);
      glowTl.delay(timing.glowDelay + clusterOffset);
      timelines.push(flameTl, glowTl);
    });
  });

  const sealGlow = document.querySelector(".seal-candlelight-glow");
  if (sealGlow) {
    if (prefersReducedMotion) {
      gsap.set(sealGlow, { opacity: 0.8 });
    } else {
      // 2-stop breathe (0.6 -> 1 -> 0.6 opacity, ~5s each way), delayed
      // 0.9s so it never pulses in obvious lockstep with the much
      // faster candle cycles above.
      const sealTl = gsap.timeline({ repeat: -1, delay: 0.9 });
      sealTl
        .to(sealGlow, { opacity: 1, duration: 2.5, ease: "sine.inOut" })
        .to(sealGlow, { opacity: 0.6, duration: 2.5, ease: "sine.inOut" });
      timelines.push(sealTl);
    }
  }

  // Pause everything in a hidden tab rather than animating uselessly in
  // the background — gsap.globalTimeline covers every tween above (and
  // nothing else on this page uses GSAP), so one pause/resume pair is
  // enough rather than tracking each timeline's play state individually.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) gsap.globalTimeline.pause();
    else gsap.globalTimeline.resume();
  });

  // Exposed for completeness (this page never actually unmounts this
  // section, but killing cleanly is one line either way).
  return () => timelines.forEach((t) => t.kill());
}

/* --------------------------------------------------------------------------
   2. ENVELOPE OPEN INTERACTION
   Matches the timing/feel of the envelope-realistic/ demo exactly (same
   1.1s flap, same 1.4s content reveal starting partway through the flap
   rather than waiting for it to finish) — three-state sequence:
     State 1 — closed envelope, static, inviting a tap.
     State 2 (Step 1) — tapping the seal fades + scales it down on its
              own (~0.3s), while the "اضغط للفتح" hint fades out over the
              same span via a plain opacity transition. The flap then
              folds open in true 3D the instant Step 1 finishes
              (rotateX(-180deg) around its top-edge hinge inside
              #envelope-screen's perspective, transform-origin: top, 1.1s).
     State 3 — the invitation rises + scales up while fading in (1.4s) as
              #envelope-screen itself dims/blurs away, starting
              CONTENT_DELAY_MS after the flap begins (not after it
              finishes) — the two motions overlap rather than running one
              after another, same as the demo's .top-wrapper/.content
              relationship.
   Durations/timings here are kept in sync with .monogram-medallion.is-
   unlocking, #envelope-screen.open .flap-top, #envelope-screen.hidden,
   and #invitation.is-visible in LeensWeddingInvitation.css — change one,
   change both.

   Works on both click (desktop) and tap (mobile) via the button's native
   click event, which fires for both pointer types.

   prefers-reduced-motion skips all of the above and falls back to a
   plain 300ms fade (the #envelope-screen.hidden transition, sped up for
   reduced motion in CSS), per the standing reduced-motion convention
   used throughout this file.
   -------------------------------------------------------------------------- */
function initEnvelope() {
  const envelopeScreen = document.getElementById("envelope-screen");
  const envelopeScript = document.querySelector(".envelope-script");
  const envelopeHint = document.querySelector(".envelope-hint");
  const invitation = document.getElementById("invitation");

  // SLOWED DOWN (this pass): flap rotation is now 3.5s (was 2.3s, was
  // ~1.1s before that) — REVEAL_DELAY_MS scaled by the same ~1.52x factor
  // (1900ms -> 2890ms) so the invitation reveal still starts at the same
  // ~83% point through the rotation, i.e. as the flap is nearly (not
  // exactly) done, so it still reads as "content emerges once the flap
  // has opened" rather than starting from the very first tick.
  const REVEAL_DELAY_MS = 2890;

  let opened = false;

  // FIX (this pass): revealPeek() (unhide + initScrollReveal()) used to
  // fire immediately in openInvitation(), same tick as .open. That
  // exposed a rendering artifact: very early in the flap's rotation, its
  // 3D-perspective-foreshortened triangle silhouette doesn't pixel-align
  // with the flat, non-rotated triangular opening underneath
  // (.envelope-wedges) — for a few frames a stray diagonal olive edge
  // cut across the verse text before the flap finished shrinking out of
  // view. Screenshot testing showed the flap visually vanishing/going
  // edge-on somewhere around the halfway point of its rotation — scaled
  // by the same ~1.52x factor as REVEAL_DELAY_MS above (1000ms -> 1520ms)
  // for the now-3.5s rotation, keeping the same margin past that window
  // rather than sitting right on the edge of it, while the verse still
  // visibly "emerges" partway through the rotation, not just at the very
  // end of it.
  const PEEK_DELAY_MS = 1520;

  function revealPeek() {
    invitation.hidden = false;
    initScrollReveal();
  }

  function finishReveal() {
    // Idempotent if revealPeek() already ran (normal, non-reduced-motion
    // path) — still needed here directly for the reduced-motion path,
    // which calls finishReveal() alone, skipping revealPeek() entirely.
    invitation.hidden = false;
    // Force layout before adding the entrance/fade-out classes so the transitions run
    requestAnimationFrame(() => {
      invitation.classList.add("is-visible");
      envelopeScreen.classList.add("hidden");
      document.body.style.overflow = "";
      startCountdown();
      initScratchCards();
      activatePetals(); // envelope fully open — see section 7's own comment for why this is the trigger
    });
  }

  function openInvitation() {
    if (opened) return;
    opened = true;

    // FIX #1: the wax-seal button is gone — #envelope-screen itself is
    // now the trigger (role="button"/tabindex in the HTML), so there's
    // no separate element left to .disable() here.

    // FIX #6: seek to 0:33 before this very first play() — a resumed
    // play from the toggle button (initMusicToggle) never sets
    // currentTime, so pausing/unpausing afterward continues from
    // wherever the guest left it, not back to 0:33 every time.
    // This tap is also the deliberate user gesture browsers require
    // before allowing audio-with-sound to autoplay — starting it here,
    // not on page load, is what makes autoplay actually work instead of
    // being silently blocked. Independent of the reduced-motion branch
    // below (a guest who prefers reduced motion still gets music).
    const bgMusic = document.getElementById("bg-music");
    if (bgMusic) {
      bgMusic.currentTime = 32.5;
      bgMusic.play().catch(() => {});
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      finishReveal();
      return;
    }

    // Hint/title text fade (~0.5s, via CSS transition).
    // .envelope-hint has its own infinite hint-pulse animation running,
    // and a CSS animation always wins over a transition targeting the
    // same property — so killing that animation and adding the
    // opacity:0 transition target in the very same style recalc doesn't
    // work; the browser never gets a clean "before" value to transition
    // from and opacity just snaps straight to 0. Killing the animation
    // first, forcing a reflow, then adding the class on the next tick
    // gives the transition an actual starting point to ease from.
    envelopeHint.style.animation = "none";
    void envelopeHint.offsetHeight; // force reflow — commits the animation removal before the class below
    envelopeScript.classList.add("is-unlocking");
    envelopeHint.classList.add("is-unlocking");

    // The flap rotates open in true 3D (see #envelope-screen.open
    // .flap-top in the CSS, now a 2.3s transition — slowed down this
    // pass). Content should still begin emerging as the flap finishes
    // rotating, not simultaneously from the start, so finishReveal() now
    // waits until the flap is nearly done (REVEAL_DELAY_MS) rather than
    // firing in the same tick.
    envelopeScreen.classList.add("open");
    window.setTimeout(revealPeek, PEEK_DELAY_MS);
    window.setTimeout(finishReveal, REVEAL_DELAY_MS);
  }

  envelopeScreen.addEventListener("click", openInvitation);
  envelopeScreen.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openInvitation();
    }
  });

  // Lock background scroll while the envelope screen is showing
  document.body.style.overflow = "hidden";
}

/* --------------------------------------------------------------------------
   3. SCROLL-TRIGGERED REVEAL ANIMATIONS
   Uses IntersectionObserver to fade/slide each [data-reveal] section into
   view as the guest scrolls. Respects prefers-reduced-motion (handled in
   CSS by disabling the transition + starting fully visible).

   Toggles .is-visible both ways (added on entry, removed on exit) rather
   than revealing once and unobserving — so a section eases back out as it
   scrolls past the viewport and eases back in again the same way whether
   the guest is scrolling down into it or back up into it, instead of
   just sitting there already-revealed with no motion on the way back up.
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   3b. SCROLL ATMOSPHERE — illustration parallax
   A single rAF-throttled scroll listener drives one purely cosmetic CSS
   custom property (never touches layout, content, or the envelope):
     --parallax-y (px)     a gentle drift on the venue illustration,
                            capped small so it reads as depth, not motion.
   (This used to also ramp a --scroll-tint blending .stone-bg toward a
   dusk palette on scroll — removed because it read as the page losing
   its ivory/sage Italian-villa identity rather than a deliberate
   lighting change. The parallax alone still carries the "the page is
   alive as you scroll" feeling.)
   Entirely skipped under prefers-reduced-motion — the property just
   stays at its :root default (0px), so the illustration renders exactly
   as it did before this pass.
   -------------------------------------------------------------------------- */
function initScrollAtmosphere() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const venueIllustration = document.querySelector(".venue-illustration");
  if (!venueIllustration) return;

  const root = document.documentElement;
  let ticking = false;

  function update() {
    ticking = false;
    const vh = window.innerHeight;

    const rect = venueIllustration.getBoundingClientRect();
    const centerOffset = rect.top + rect.height / 2 - vh / 2;
    const parallax = Math.max(-18, Math.min(18, centerOffset * -0.04));
    root.style.setProperty("--parallax-y", parallax.toFixed(2) + "px");
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
}

/* --------------------------------------------------------------------------
   4. COUNTDOWN TIMER
   Pure vanilla JS, updates every second, stops cleanly at zero.
   -------------------------------------------------------------------------- */
// Countdown digits used to be Western numerals always, by design — but
// that was rolled back on request: the timer now follows the language
// toggle like everything else in its scope, switching to Arabic-Indic
// digits in Arabic mode.
const ARABIC_INDIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
function localizeDigits(str) {
  return currentLang === "ar" ? str.replace(/[0-9]/g, (d) => ARABIC_INDIC_DIGITS[Number(d)]) : str;
}

function startCountdown() {
  const targetDate = new Date(INVITE_CONTENT.event.isoDateTime).getTime();

  const els = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    minutes: document.getElementById("cd-minutes"),
    seconds: document.getElementById("cd-seconds")
  };
  if (!els.days) return;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    const diff = targetDate - Date.now();

    if (diff <= 0) {
      els.days.textContent = localizeDigits("00");
      els.hours.textContent = localizeDigits("00");
      els.minutes.textContent = localizeDigits("00");
      els.seconds.textContent = localizeDigits("00");
      clearInterval(timerId);
      return;
    }

    els.days.textContent = localizeDigits(pad(Math.floor(diff / (1000 * 60 * 60 * 24))));
    els.hours.textContent = localizeDigits(pad(Math.floor((diff / (1000 * 60 * 60)) % 24)));
    els.minutes.textContent = localizeDigits(pad(Math.floor((diff / (1000 * 60)) % 60)));
    els.seconds.textContent = localizeDigits(pad(Math.floor((diff / 1000) % 60)));
  }

  tick();
  const timerId = setInterval(tick, 1000);
  // Re-render immediately with the new script's digits on language toggle,
  // rather than waiting up to a second for the next natural tick.
  document.addEventListener("langchange", tick);
}

/* --------------------------------------------------------------------------
   5. SCRATCH-TO-REVEAL DATE CARDS
   Each card's real value already sits in the DOM (.scratch-value) — the
   canvas is purely a coating drawn on top. Scratching erases pixels with
   "destination-out" compositing — ONLY the pixels actually dragged over
   ever clear. An earlier version auto-revealed the entire remaining
   coating once ~30% was scratched, meant as a convenience so guests
   didn't have to scratch every last pixel — but that read as fake
   scratching (a third of a swipe silently completing the whole card), so
   it's gone; SCRATCH_COMPLETE_THRESHOLD now only fires once the coating
   is essentially ALL manually cleared (0.95, not 0.3), purely to sweep
   away the last few stray pixels canvas sampling might miss rather than
   to shortcut the scratching itself. The brush radius is deliberately
   modest so each swipe clears a believable band rather than one pass
   wiping out most of the card. requestAnimationFrame-batched redraws
   keep it feeling responsive despite the smaller brush. With
   prefers-reduced-motion the canvas is never created, so the date is
   simply visible.
   -------------------------------------------------------------------------- */
// Module-scoped, assigned below once the real per-card reset callbacks
// exist — same pattern as activatePetals() in section 7: this file is a
// classic (non-module) script, so every top-level function already
// shares one scope, and the "scratch again" button (wired up in
// initScratchCards() itself, since that's where the card elements and
// their per-card reset callbacks both live) just calls this directly.
let resetScratchCards = () => {};

function initScratchCards() {
  const canvases = document.querySelectorAll("[data-scratch-card]");
  const resetBtn = document.getElementById("scratch-reset-btn");
  if (!canvases.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    canvases.forEach((canvas) => canvas.remove());
    // Nothing left to re-cover — the date is just shown plainly for this
    // guest, so a "scratch again" button here would be a dead control.
    if (resetBtn) resetBtn.hidden = true;
    return;
  }

  // setupScratchCard() returns that one card's own forceReset() —
  // collected here so the button can re-coat every card in one click.
  const cardResets = Array.from(canvases).map(setupScratchCard);
  resetScratchCards = () => cardResets.forEach((reset) => reset());

  if (resetBtn) {
    resetBtn.addEventListener("click", () => resetScratchCards());
  }
}

const SCRATCH_BRUSH_RADIUS = 26; // ~65% of the old 40px radius — a believable scratch band, not a wide wipe
const SCRATCH_COMPLETE_THRESHOLD = 0.95; // cleanup only, not a shortcut — see the comment above

function setupScratchCard(canvas) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const dpr = window.devicePixelRatio || 1;
  let width = 0;
  let height = 0;
  let isScratching = false;
  let revealed = false;
  let lastPoint = null;
  let pendingSegments = [];
  let rafScheduled = false;

  function paintCoating() {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#b28d51");
    gradient.addColorStop(0.5, "#8b9873");
    gradient.addColorStop(1, "#57633f");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Faint grain so the coating doesn't read as a flat sticker
    ctx.fillStyle = "rgba(255,255,255,0.07)";
    for (let i = 0; i < 50; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // BUG FIX: this used to run its full reset (repaint the coating, clear
  // any scratched progress, drop the "is-cleared" state) on every single
  // "resize" event, no matter what. On mobile, scrolling shows/hides the
  // browser's own address bar, which changes the visual viewport height
  // and fires a real "resize" event on window — even though the card's
  // own on-page size never actually changed. That's what guests were
  // hitting: scratch progress wiped out by scrolling, not by any actual
  // resize. Now it bails out early unless the card's rendered size
  // (from getBoundingClientRect(), compared against what it was sized to
  // last time) has genuinely changed — a real resize (rotating the
  // device, a desktop window resize) still re-sizes and repaints
  // correctly; a same-size "resize" event now does nothing. Sub-pixel
  // tolerance (0.5px) absorbs float jitter between two reads of the same
  // layout rather than treating that as a "real" resize.
  function sizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    if (Math.abs(rect.width - width) < 0.5 && Math.abs(rect.height - height) < 0.5) return;
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    revealed = false;
    lastPoint = null;
    pendingSegments = [];
    canvas.classList.remove("is-cleared");
    paintCoating();
  }

  // "Scratch again" button target: unlike sizeCanvas() above, this always
  // repaints regardless of whether the card's rendered size changed —
  // clicking the button re-measures nothing, it just wants the coating
  // back, so it can't reuse sizeCanvas()'s same-size-skips-the-reset
  // guard (that guard exists specifically to stop a same-size "resize"
  // event from wiping progress the guest didn't ask to lose — a button
  // press is an explicit ask, the opposite case).
  function forceReset() {
    revealed = false;
    lastPoint = null;
    pendingSegments = [];
    canvas.classList.remove("is-cleared");
    paintCoating();
  }

  function pointFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  // Only the pixels actually dragged over should clear — a stroked line
  // (round cap/join) between the previous and current point, rather than
  // a dot at each point, so a fast drag still clears a continuous band
  // instead of a dotted trail with gaps.
  function eraseSegment(from, to) {
    ctx.globalCompositeOperation = "destination-out";
    // Explicit opaque style — paintCoating() above leaves the context's
    // fillStyle set to the near-transparent grain color (alpha 0.07) as
    // its last operation; without resetting it here (and on strokeStyle,
    // which a fillStyle-only fix wouldn't cover) each stroke would only
    // erase a sliver of the coating's opacity instead of fully erasing it.
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    ctx.lineWidth = SCRATCH_BRUSH_RADIUS * 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (from.x === to.x && from.y === to.y) {
      ctx.beginPath();
      ctx.arc(to.x, to.y, SCRATCH_BRUSH_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    }
  }

  function scratchedFraction() {
    // Sample a subset of pixels' alpha channel — checking every pixel on
    // every stroke would be far too slow for a smooth scratch feel.
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    let sampled = 0;
    for (let i = 3; i < data.length; i += 4 * 12) {
      sampled++;
      if (data[i] < 32) cleared++;
    }
    return sampled ? cleared / sampled : 0;
  }

  function checkProgress() {
    if (revealed) return;
    if (scratchedFraction() >= SCRATCH_COMPLETE_THRESHOLD) {
      revealed = true;
      canvas.classList.add("is-cleared");
    }
  }

  // Pointer events can fire far more often than the screen repaints —
  // queue segments as they come in and flush them once per animation
  // frame, so the canvas redraw (and the getImageData progress check)
  // never runs more than once per frame, keeping the drag feeling
  // smooth even on lower-powered devices.
  function queueSegment(point) {
    pendingSegments.push([lastPoint || point, point]);
    lastPoint = point;
    if (!rafScheduled) {
      rafScheduled = true;
      requestAnimationFrame(flush);
    }
  }

  function flush() {
    rafScheduled = false;
    if (!pendingSegments.length) return;
    for (const [from, to] of pendingSegments) eraseSegment(from, to);
    pendingSegments = [];
    checkProgress();
  }

  function handlePointerDown(e) {
    isScratching = true;
    lastPoint = null;
    // Pointer capture can throw on some devices/pointer types (e.g. a
    // pointerId the browser doesn't treat as active) — guard it so a
    // capture failure never blocks the actual scratch drawing below.
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch (err) {
      /* no-op: scratching still works without capture, just without the
         guarantee that a drag leaving the canvas keeps tracking it */
    }
    queueSegment(pointFromEvent(e));
  }
  function handlePointerMove(e) {
    if (!isScratching) return;
    queueSegment(pointFromEvent(e));
  }
  function handlePointerUp() {
    isScratching = false;
    lastPoint = null;
    // Force a final flush rather than waiting on a possibly-not-yet-fired
    // rAF, so the last bit of a stroke and its progress check are never
    // left dangling if the pointer lifts right after a move.
    flush();
  }

  canvas.addEventListener("pointerdown", handlePointerDown);
  canvas.addEventListener("pointermove", handlePointerMove);
  canvas.addEventListener("pointerup", handlePointerUp);
  canvas.addEventListener("pointercancel", handlePointerUp);

  window.addEventListener("resize", sizeCanvas);
  sizeCanvas();

  return forceReset;
}

/* --------------------------------------------------------------------------
   6. RSVP
   Yes/No -> (No: a brief acknowledgment, nothing saved) / (Yes: a name
   field + Confirm, which saves to Firestore and locks the form).

   A short-lived Node/Express server version replaced Firestore for a
   stretch, but that meant someone had to keep a server process running
   for the RSVP form (and the admin page) to work at all — not workable
   for "two links, always open, no server" delivery. Back to Firestore:
   a small always-on cloud database, reachable directly from a static
   HTML file with no server of our own. The actual read/write calls live
   in firebase-config.js (loaded as a <script type="module"> in
   LeensWeddingInvitation.html) — that's the one file with credentials in
   it. This function just calls the bridge it exposes on window.
   -------------------------------------------------------------------------- */
// A network hiccup (or firebase-config.js not set up yet) shouldn't leave
// a guest staring at a permanently-disabled Confirm button.
const RSVP_TIMEOUT_MS = 10000;
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("RSVP submission timed out")), ms))
  ]);
}

function initRSVP() {
  const choiceWrap = document.getElementById("rsvp-choice");
  const yesBtn = document.getElementById("rsvp-yes");
  const noBtn = document.getElementById("rsvp-no");
  const form = document.getElementById("rsvp-form");
  const nameInput = document.getElementById("rsvp-name");
  const confirmBtn = document.getElementById("rsvp-confirm");
  const message = document.getElementById("rsvp-message");
  if (!choiceWrap || !yesBtn || !noBtn || !form || !nameInput || !confirmBtn || !message) return;

  let submitting = false;
  let confirmed = false; // true only after the server confirms the RSVP was saved — locks the form for good, see below
  // Tracks whichever TRANSLATIONS key is currently shown in #rsvp-message
  // (if any), purely so the langchange listener below can re-render it in
  // the new language — otherwise a guest who sees "We'll miss you..." and
  // then switches to Arabic keeps seeing the English text forever, since
  // applyLanguage() only touches [data-field] elements and this message
  // is set directly via JS, not through that attribute.
  let activeMessageKey = null;

  function setMessage(key) {
    activeMessageKey = key;
    message.textContent = TRANSLATIONS[key][currentLang];
    message.hidden = false;
  }

  document.addEventListener("langchange", () => {
    if (activeMessageKey) message.textContent = TRANSLATIONS[activeMessageKey][currentLang];
  });

  // Yes/No stay visible and re-clickable through the whole flow — this is
  // a real two-way toggle between "show the name field" and "show the
  // declined note", not a one-way pick-and-vanish choice, so a guest can
  // freely change their mind right up until they actually hit Confirm.
  function setChoice(choice) {
    if (confirmed) return;
    yesBtn.classList.toggle("is-active", choice === "yes");
    noBtn.classList.toggle("is-active", choice === "no");
    yesBtn.setAttribute("aria-pressed", String(choice === "yes"));
    noBtn.setAttribute("aria-pressed", String(choice === "no"));

    if (choice === "yes") {
      form.hidden = false;
      message.hidden = true;
      activeMessageKey = null;
      nameInput.focus();
    } else {
      form.hidden = true;
      // "No" is acknowledged only — by request, nothing is saved for this path
      setMessage("rsvpDeclined");
    }
  }

  yesBtn.addEventListener("click", () => setChoice("yes"));
  noBtn.addEventListener("click", () => setChoice("no"));

  confirmBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (!name) {
      nameInput.classList.add("rsvp-input--error");
      nameInput.focus();
      return;
    }
    if (submitting) return;
    submitting = true;
    confirmBtn.disabled = true;
    nameInput.classList.remove("rsvp-input--error");

    const submit = typeof window.submitRSVP === "function"
      ? window.submitRSVP(name)
      : Promise.reject(new Error("submitRSVP is not available — firebase-config.js not set up yet"));

    withTimeout(submit, RSVP_TIMEOUT_MS)
      .then(() => {
        // Only NOW — an actual saved confirmation — does the flow lock.
        // Everything up to this point (picking Yes or No, seeing the
        // declined note, typing a name) stays freely reversible.
        confirmed = true;
        choiceWrap.hidden = true;
        form.hidden = true;
        setMessage("rsvpConfirmed");
      })
      .catch((err) => {
        console.error("RSVP submission failed:", err);
        submitting = false;
        confirmBtn.disabled = false;
        setMessage("rsvpError");
      });
  });

  nameInput.addEventListener("input", () => nameInput.classList.remove("rsvp-input--error"));
}

/* --------------------------------------------------------------------------
   7. AMBIENT FALLING PETALS
   A single fixed, full-viewport <canvas> (#petal-canvas, last element in
   <body> — see its own HTML comment) with a requestAnimationFrame loop,
   NOT individual DOM elements per petal — 15-20 continuously-animated DOM
   nodes on a page this long would be a real layout-thrash risk; a canvas
   sized to the viewport (it's fixed, so it never has to be page-length)
   keeps the per-frame cost to a handful of drawImage() calls no matter
   how far the guest has scrolled.

   Petal shape reuses #vine-petal's own SVG path data (the exact same
   elongated petal already established in the envelope's blossom motif,
   not a circle/emoji/generic teardrop) via the Path2D constructor's
   built-in support for SVG path-data strings — so this never drifts out
   of sync with the blossom's own petal silhouette. That path is filled
   ONCE per size/color combination onto small offscreen sprite canvases at
   startup (buildPetalSprites()); every subsequent frame just
   translate+rotate+drawImage()s one of those pre-rendered sprites per
   petal, rather than re-running the gradient fill 15-20 times a frame.

   Two entry points into the rest of the site, both deliberately additive
   — neither changes any existing line, timing, or transform elsewhere:
     - initPetals() is called once from the main DOMContentLoaded init
       below, same as every other initX() there. It builds the sprites,
       sizes the canvas, and starts the rAF loop — but doesn't spawn any
       petals yet (`active` stays false) — per request, the effect should
       only begin once the envelope has actually finished opening, not
       during the envelope/verse intro screens.
     - activatePetals() (module-scoped, not a global — this file is a
       classic script so every top-level function already shares one
       scope, no window.* needed) is called once, from inside
       finishReveal() in initEnvelope() — a single new line alongside
       that function's existing startCountdown()/initScratchCards()
       calls, not a modification to anything already there. That's the
       "envelope fully opening" trigger: a denser one-time release burst,
       then the steady ambient trickle begins.
   -------------------------------------------------------------------------- */
const PETAL_PATH_D = "M0,0 C -2.4,-1.5 -3.8,-4.2 -3.0,-7.3 C -2.6,-9.1 -1.1,-10.8 0.3,-11.9 C 1.6,-10.5 2.9,-8.7 3.2,-6.6 C 3.5,-4.1 2.0,-1.6 0,0 Z";
// Native path bounding box, roughly (control points overshoot the true
// curve slightly — the sprite padding below absorbs that difference).
const PETAL_NATIVE_W = 7;
const PETAL_NATIVE_H = 12.5;

// THEME-AWARE COLOR (bug fix): white petals were invisible against the
// light theme's ivory/beige background — no contrast at all. Color is now
// keyed to the SITE's own light/dark theme (data-theme on <html>, same
// attribute applyTheme()/initThemeToggle() already manage above) instead
// of picking a random variety of tints regardless of background. Each
// theme reuses an EXISTING gradient verbatim rather than introducing a
// new color just for this:
//   dark  -> index.html's own <radialGradient id="vine-petal-white"> stops
//            (bright white center, soft warm-gray edge) — unchanged from
//            before, this already worked against the dark olive background.
//   light -> index.html's own <radialGradient id="vine-leaf-gradient">
//            stops (light warm cream center, deeper olive-gold edge) —
//            the same tones the envelope's vine LEAVES already use, which
//            reads clearly against ivory.
// A petal's color is fixed at the moment it spawns (read fresh from the
// current data-theme each time) and never changes afterward — so toggling
// mid-fall never jarringly recolors a petal already in flight; new petals
// simply start picking up the new theme's color within about half a
// second (the ambient trickle interval), the "let already-falling petals
// keep their current color" option from the two offered, chosen because
// it can't ever look like a discontinuity — there's nothing to notice.
const PETAL_COLOR_DARK = ["#ffffff", "#f8f4e9", "#dcd2b4"]; // = #vine-petal-white
const PETAL_COLOR_LIGHT = ["#eee3ba", "#cfbb82", "#93875a"]; // = #vine-leaf-gradient

function currentPetalThemeKey() {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

// VARIED SIZE, TIED TO DEPTH: three explicit tiers rather than one
// continuous random range — three clear, repeatable steps read as
// intentional depth; fully continuous randomness tends to blend into
// sameness instead. Every other per-petal range (fall speed, opacity,
// drift, spin) is drawn from THAT tier's own range, not varied
// independently of size — a petal's size, speed, and opacity all move
// together as "how far back is this one," matching the layering a guest
// actually reads as depth (small+slow+faint = background,
// large+fast+bold = foreground). weight is the probability of a spawned
// petal landing in that tier: small/medium do the bulk of the work,
// large stays a deliberately occasional accent (per request, "keep the
// large-petal proportion modest").
const PETAL_TIERS = [
  {
    name: "small",
    weight: 0.4,
    spriteSize: 9,
    vy: [12, 19],
    opacity: [0.26, 0.4],
    driftAmp: [7, 15],
    driftFreq: [0.35, 0.75],
    rotationSpeed: [0.15, 0.4],
    windSensitivity: 0.6, // background petals feel the shared wind least
  },
  {
    name: "medium",
    weight: 0.4,
    spriteSize: 14,
    vy: [18, 27],
    opacity: [0.42, 0.6],
    driftAmp: [13, 25],
    driftFreq: [0.5, 1.0],
    rotationSpeed: [0.25, 0.65],
    windSensitivity: 1.0,
  },
  {
    name: "large",
    weight: 0.2,
    spriteSize: 22,
    vy: [24, 35],
    opacity: [0.6, 0.85],
    driftAmp: [19, 34],
    driftFreq: [0.65, 1.3],
    rotationSpeed: [0.35, 0.9],
    windSensitivity: 1.5, // foreground petals get pushed the most, for depth-consistent parallax
  },
];

// DENSITY (increased per request): cap 18 -> 36, ambient interval roughly
// 2.5x faster, release burst and scroll burst both scaled up to match —
// re-measured actual on-screen count and frame rate afterward at this
// new density (see the test report), rather than assuming the increase
// was performance-neutral.
const PETAL_MAX_COUNT = 36;
const PETAL_AMBIENT_INTERVAL_MS = [450, 800]; // range: ms between ambient spawns
const PETAL_RELEASE_BURST = 14;
const PETAL_SCROLL_BURST_MAX = 8;
const PETAL_SCROLL_THROTTLE_MS = 150;
const PETAL_STATIC_COUNT = 10; // prefers-reduced-motion: a few still petals, scaled with the density bump

// module-scoped, assigned by initPetals() below, called by finishReveal()
// in initEnvelope() — see this section's own header comment.
let activatePetals = () => {};

function pickPetalTier() {
  const r = Math.random();
  let acc = 0;
  for (const tier of PETAL_TIERS) {
    acc += tier.weight;
    if (r < acc) return tier;
  }
  return PETAL_TIERS[0];
}

function randRange(range) {
  return range[0] + Math.random() * (range[1] - range[0]);
}

// Reads the envelope's own shared --light-angle custom property (the
// site-wide "light comes from here" convention every sheen/highlight
// gradient on the envelope already uses — see its definition in
// LeensWeddingInvitation.css) and converts it into a unit vector pointing
// TOWARD where the light source itself sits, so the petal sprite's own
// highlight can be aimed the same direction instead of an independently
// eyeballed offset. A CSS linear-gradient(angle, ...) travels FROM its
// first color stop TO its last along (sin(angle), -cos(angle)) in
// screen-space (x-right, y-down) — since our gradients go light-stop
// first, dark-stop last, that vector points AWAY from the light, so the
// light direction itself is the negation of it.
function lightAngleOffsetVector() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--light-angle").trim();
  const deg = parseFloat(raw) || 128; // falls back to the site's own established angle if unreadable
  const rad = (deg * Math.PI) / 180;
  return { x: -Math.sin(rad), y: Math.cos(rad) };
}

// Pre-renders every theme/tier combination once (2 themes x 3 tiers = 6
// sprites total). Each sprite is drawn by filling the SAME Path2D (the
// blossom's own petal shape) with a radial gradient, offset toward the
// upper-left of the petal for a soft highlight rather than a flat
// center-fill — matching how the blossom's own petals (and the rest of
// the envelope's shading) already read light from that same direction.
// A thin edge stroke, in that same theme's own darkest stop color, is
// baked in on top of the fill — this is what keeps the petal's
// silhouette readable through its fade-in/fade-out (checked specifically
// at LOW opacity, not just full strength, per request): since the stroke
// is part of the same baked sprite pixels, it fades proportionally WITH
// the fill when globalAlpha is applied at draw time, so the edge never
// separately "disappears first" the way a fixed-opacity CSS
// box-shadow/filter applied at runtime could.
function buildPetalSprites() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const path = new Path2D(PETAL_PATH_D);
  const themes = { dark: PETAL_COLOR_DARK, light: PETAL_COLOR_LIGHT };
  const sprites = {};
  // Same direction for every sprite (the light source doesn't move
  // between tiers/themes), so this is computed once outside the loop.
  const light = lightAngleOffsetVector();
  const highlightMagnitude = 3.2; // native path units, offset from the petal's own center
  for (const themeKey of Object.keys(themes)) {
    const stops = themes[themeKey];
    sprites[themeKey] = {};
    for (const tier of PETAL_TIERS) {
      const sizePx = tier.spriteSize;
      const pad = sizePx * 0.22; // headroom for antialiasing at the edges
      const h = sizePx + pad * 2;
      const w = sizePx * (PETAL_NATIVE_W / PETAL_NATIVE_H) + pad * 2;
      const off = document.createElement("canvas");
      off.width = Math.ceil(w * dpr);
      off.height = Math.ceil(h * dpr);
      const octx = off.getContext("2d");
      octx.scale(dpr, dpr);
      // Map the path's native units (base at 0,0, tip up at y=-11.9) onto
      // this sprite's own pixel box: centered horizontally, base sitting
      // just above the bottom padding.
      const scale = sizePx / PETAL_NATIVE_H;
      octx.translate(w / 2, h - pad);
      octx.scale(scale, scale);
      const gradient = octx.createRadialGradient(
        light.x * highlightMagnitude,
        -6 + light.y * highlightMagnitude,
        0.4,
        0,
        -6,
        8.5,
      );
      gradient.addColorStop(0, stops[0]);
      gradient.addColorStop(0.55, stops[1]);
      gradient.addColorStop(1, stops[2]);
      octx.fillStyle = gradient;
      octx.fill(path);
      octx.lineWidth = 0.45;
      octx.strokeStyle = stops[2];
      octx.globalAlpha = 0.55;
      octx.stroke(path);
      sprites[themeKey][tier.name] = { canvas: off, cssW: w, cssH: h };
    }
  }
  return sprites;
}

function initPetals() {
  const canvas = document.getElementById("petal-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const sprites = buildPetalSprites();

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  // BUG: these must start at 0, NOT the current window size — the guard
  // in resizeCanvas() below skips its own work when the size "hasn't
  // changed" from vw/vh, and initializing them to the already-current
  // window size made that guard trigger on the very FIRST call, so
  // canvas.width/height never actually got set at all (silently left at
  // the browser's built-in 300x150 default for an unset canvas — caught
  // by explicitly sampling canvas.width in testing, not visually
  // obvious, since CSS still stretched that tiny backing store to fill
  // the viewport). 0 guarantees nextW/nextH can never match on the first
  // real call, so the initial sizing always runs — same reasoning as
  // width/height starting at 0 in setupScratchCard() above.
  let vw = 0;
  let vh = 0;

  function resizeCanvas() {
    // Same false-alarm-resize guard as the scratch cards' sizeCanvas()
    // (see setupScratchCard() above): on mobile, scrolling shows/hides
    // the browser's own address bar, which fires a real "resize" event
    // even though nothing about this canvas's own target size changed.
    // Harmless here either way (this canvas is fully redrawn from the
    // `petals` array every frame, nothing persists IN the bitmap the way
    // scratch progress did), but skipping the reassignment avoids a
    // pointless context reset on every false alarm.
    const nextW = window.innerWidth;
    const nextH = window.innerHeight;
    if (Math.abs(nextW - vw) < 0.5 && Math.abs(nextH - vh) < 0.5) return;
    vw = nextW;
    vh = nextH;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.ceil(vw * dpr);
    canvas.height = Math.ceil(vh * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    // A few still petals, drawn once — never forced continuous motion on
    // a guest who's asked for less of it. No rAF loop, no spawn timers,
    // no scroll listener: this branch ends here.
    const themeKey = currentPetalThemeKey();
    for (let i = 0; i < PETAL_STATIC_COUNT; i++) {
      const tier = pickPetalTier();
      const sprite = sprites[themeKey][tier.name];
      ctx.save();
      ctx.globalAlpha = randRange(tier.opacity);
      ctx.translate(Math.random() * vw, Math.random() * vh);
      ctx.rotate(Math.random() * Math.PI * 2);
      ctx.drawImage(sprite.canvas, -sprite.cssW / 2, -sprite.cssH / 2, sprite.cssW, sprite.cssH);
      ctx.restore();
    }
    return;
  }

  const petals = [];
  let active = false;
  let lastFrameTime = 0;

  // Shared wind field: ONE slowly-varying global value (not per-petal),
  // computed once per frame in update() and applied to every petal that
  // frame, on top of each petal's own individual sway — a gentle breeze
  // direction that drifts back and forth over an 8-15s period, rather
  // than every petal swaying independently with nothing tying them
  // together. windTime/PHASE/FREQ live here (not as module-level
  // constants) since they're this one initPetals() run's own timeline.
  const WIND_PERIOD_SEC = 11;
  const WIND_FREQ = (Math.PI * 2) / WIND_PERIOD_SEC; // rad/s, same convention as a petal's own driftFreq
  const WIND_PHASE = Math.random() * Math.PI * 2;
  const WIND_AMPLITUDE = 13; // px/s of extra lateral drift at the wind's peak
  let windTime = 0;

  function spawnPetal(xOverride) {
    if (petals.length >= PETAL_MAX_COUNT) return;
    const tier = pickPetalTier();
    const vy = randRange(tier.vy);
    const spawnMargin = 40;
    const exitMargin = 60;
    // Lifespan is DERIVED from this petal's own fall speed (roughly how
    // long it takes to cross spawn-to-exit at that speed), not picked
    // independently — a slow petal automatically gets a longer lifespan
    // to match, so it still fades out near the bottom of the viewport
    // instead of either getting cut off mid-air or lingering past it.
    const fallDistance = vh + spawnMargin + exitMargin;
    const lifespan = (fallDistance / vy) * 1000 * (0.9 + Math.random() * 0.2);
    const rotationSpeed = (Math.random() < 0.5 ? -1 : 1) * randRange(tier.rotationSpeed); // rad/s, randomized direction
    // Tumble (the sprite's own scaleX oscillation, see draw() below) gets
    // its own randomized 1.5-3s period, independent of the in-plane spin
    // above — but nudged faster when this petal's spin already is,
    // "synced subtly with rotation speed" per request rather than fully
    // decoupled from it.
    const tumbleSpeedFactor = 0.8 + 0.4 * (Math.abs(rotationSpeed) / tier.rotationSpeed[1]);
    const tumblePeriodSec = (1.5 + Math.random() * 1.5) / tumbleSpeedFactor;
    const x = xOverride != null ? xOverride : Math.random() * vw;
    const y = -spawnMargin - Math.random() * 40;
    petals.push({
      x,
      y,
      vy,
      driftAmp: randRange(tier.driftAmp),
      driftFreq: randRange(tier.driftFreq), // rad/s — gentle multi-second sway, not a fast wobble
      driftPhase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed,
      tumbleFreq: (Math.PI * 2) / tumblePeriodSec, // rad/s, same convention as driftFreq
      tumblePhase: Math.random() * Math.PI * 2,
      windSensitivity: tier.windSensitivity,
      // Brief near-zero-velocity pause right after spawn — a petal
      // "hangs" for a beat before gravity/wind actually take it, rather
      // than falling at full speed from the instant it appears. Falls
      // comfortably inside the fade-in window (10% of even the shortest
      // realistic lifespan here is several seconds — see the lifespan
      // math above), so it reads as a subtle hesitation, not a visible
      // freeze-frame.
      hangTime: 150 + Math.random() * 150,
      flutterTimer: 2 + Math.random() * 6,
      flutterStrength: 0,
      // Theme is read fresh HERE, at spawn time, and then frozen on the
      // petal for its whole life — see this section's own header comment
      // on why that's the smoother of the two toggle-mid-fall options.
      themeKey: currentPetalThemeKey(),
      tierName: tier.name,
      baseOpacity: randRange(tier.opacity),
      age: 0,
      lifespan,
    });
  }

  function update(dt) {
    const dtSec = dt / 1000;
    windTime += dt;
    const windX = Math.sin((windTime / 1000) * WIND_FREQ + WIND_PHASE) * WIND_AMPLITUDE;
    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      p.age += dt;
      if (p.age >= p.lifespan || p.y > vh + 80) {
        petals.splice(i, 1);
        continue;
      }
      // Spawn-anticipation hang: skip the fall/wind displacement (but
      // keep rotation alive, so it doesn't read as a hard freeze) until
      // this petal's own hangTime has elapsed.
      if (p.age >= p.hangTime) {
        p.y += p.vy * dtSec;
        p.x += windX * p.windSensitivity * dtSec;
      }
      p.rotation += p.rotationSpeed * dtSec;

      // Flutter: an occasional brief perturbation to spin speed that
      // decays back to zero, mimicking real petal tumbling — not a
      // constant wobble layered on every petal all the time.
      p.flutterTimer -= dtSec;
      if (p.flutterTimer <= 0) {
        p.flutterStrength = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random() * 2);
        p.flutterTimer = 3 + Math.random() * 6;
      }
      p.flutterStrength *= Math.pow(0.05, dtSec); // ~exponential decay, frame-rate independent
      p.rotation += p.flutterStrength * dtSec;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, vw, vh);
    for (const p of petals) {
      const f = p.age / p.lifespan;
      // Eased fade: ease-out on the way in (quick appear, gentle
      // settle), ease-in on the way out (slow to start fading, quicker
      // right at the very end) — replaces the old straight-line fade,
      // which read a little too mechanical/linear for a floating petal.
      let fade;
      if (f < 0.1) {
        const t = f / 0.1;
        fade = 1 - (1 - t) * (1 - t);
      } else if (f > 0.85) {
        const t = (f - 0.85) / 0.15;
        fade = Math.max(0, 1 - t * t);
      } else {
        fade = 1;
      }
      const opacity = p.baseOpacity * fade;
      if (opacity <= 0.01) continue;

      const driftX = Math.sin((p.age / 1000) * p.driftFreq + p.driftPhase) * p.driftAmp;
      // Tumble: oscillates the sprite's own horizontal scale between
      // ~1.0 (face-on) and ~0.15 (edge-on), on a period independent of
      // the in-plane rotation above — mimics a petal turning in 3D as it
      // falls, not just spinning flat in the screen plane.
      const tumble = Math.abs(Math.cos((p.age / 1000) * p.tumbleFreq + p.tumblePhase));
      const scaleX = 0.15 + 0.85 * tumble;
      const sprite = sprites[p.themeKey][p.tierName];

      // NOTE: a motion-blur trail (one faint extra copy per large-tier
      // petal, offset to its previous position) was implemented and
      // measured here, then deliberately dropped — it cost ~15% of frame
      // rate on a throttled mid-tier mobile simulation (22 vs 26fps),
      // and per explicit instruction the trail was the first thing to
      // give up rather than trimming density or the rest of the physics.
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.translate(p.x + driftX, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(scaleX, 1);
      ctx.drawImage(sprite.canvas, -sprite.cssW / 2, -sprite.cssH / 2, sprite.cssW, sprite.cssH);
      ctx.restore();
    }
  }

  function loop(time) {
    requestAnimationFrame(loop);
    // Pause entirely in a hidden tab — no update, no draw, no wasted
    // battery/CPU — rather than continuing to render invisibly.
    if (document.hidden) {
      lastFrameTime = 0; // so the next visible frame doesn't see a huge dt
      return;
    }
    const dt = lastFrameTime ? Math.min(time - lastFrameTime, 50) : 16;
    lastFrameTime = time;
    update(dt);
    draw();
  }
  requestAnimationFrame(loop);

  // Scroll burst: same rAF-gated throttle initScrollAtmosphere() already
  // uses elsewhere in this file (a `ticking` flag around
  // requestAnimationFrame), plus a timestamp gate so bursts themselves
  // stay spaced out even across one long continuous scroll rather than
  // firing every rAF tick of it.
  // Clustered scroll burst: instead of every petal in a burst appearing
  // instantly at an independent full-width random x, pick ONE cluster
  // center for the whole burst and stagger each petal's spawn by a small
  // random delay — reads as a loose handful of petals disturbed together,
  // not a mechanical simultaneous full-width sprinkle.
  function spawnClusteredBurst(count) {
    const clusterCenter = Math.random() * vw;
    const spread = 90 + Math.random() * 70;
    for (let i = 0; i < count; i++) {
      const delay = Math.random() * 120;
      setTimeout(() => {
        if (!active) return;
        const x = Math.min(vw, Math.max(0, clusterCenter + (Math.random() - 0.5) * spread));
        spawnPetal(x);
      }, delay);
    }
  }

  let lastScrollY = window.scrollY;
  let lastScrollSampleTime = performance.now();
  let lastBurstTime = 0;
  let scrollTicking = false;
  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      scrollTicking = false;
      if (!active) return;
      const now = performance.now();
      const dy = Math.abs(window.scrollY - lastScrollY);
      const dt = Math.max(now - lastScrollSampleTime, 1);
      const velocity = dy / dt; // px/ms
      lastScrollY = window.scrollY;
      lastScrollSampleTime = now;
      if (velocity < 0.05) return; // ignore near-stationary scroll noise
      if (now - lastBurstTime < PETAL_SCROLL_THROTTLE_MS) return;
      lastBurstTime = now;
      // Multiplier scaled up alongside PETAL_SCROLL_BURST_MAX (4 -> 8) so
      // a genuinely fast flick can still reach the new higher ceiling
      // rather than topping out at half of it.
      const count = Math.max(1, Math.min(PETAL_SCROLL_BURST_MAX, Math.round(velocity * 10)));
      spawnClusteredBurst(count);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  function scheduleAmbient() {
    const delay =
      PETAL_AMBIENT_INTERVAL_MS[0] + Math.random() * (PETAL_AMBIENT_INTERVAL_MS[1] - PETAL_AMBIENT_INTERVAL_MS[0]);
    setTimeout(() => {
      if (active && !document.hidden) spawnPetal();
      scheduleAmbient();
    }, delay);
  }

  activatePetals = function () {
    if (active) return;
    active = true;
    for (let i = 0; i < PETAL_RELEASE_BURST; i++) spawnPetal();
    scheduleAmbient();
  };
}

/* --------------------------------------------------------------------------
   8. INIT
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  applyContent(INVITE_CONTENT);
  initThemeToggle();
  initLanguageToggle();
  initRSVP();
  initMusicToggle(); // FIX #7 — wires the mute/unmute button; initEnvelope() below triggers the actual first play()
  initEnvelope();
  initCandleGlow();
  initScrollAtmosphere();
  initPetals(); // builds the sprites + starts the render loop; doesn't spawn anything until activatePetals() fires — see that section's own comment
});
