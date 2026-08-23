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
function initScratchCards() {
  const canvases = document.querySelectorAll("[data-scratch-card]");
  if (!canvases.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    canvases.forEach((canvas) => canvas.remove());
    return;
  }

  canvases.forEach(setupScratchCard);
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

  function sizeCanvas() {
    const rect = canvas.getBoundingClientRect();
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
   8. INIT
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  applyContent(INVITE_CONTENT);
  initThemeToggle();
  initLanguageToggle();
  initRSVP();
  initMusicToggle(); // FIX #7 — wires the mute/unmute button; initEnvelope() below triggers the actual first play()
  initEnvelope();
  initScrollAtmosphere();
});