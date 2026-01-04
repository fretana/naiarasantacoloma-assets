export function initVideoGate() {
  const form = document.getElementById("main-form");
  const consentText = document.getElementById("text_consent");
  const afterMsg = document.getElementById("after-form-message");

  if (afterMsg) afterMsg.style.display = "none";

  if (!form) return;

  const email = form.querySelector('input[type="email"]');
  const consent = form.querySelector('input[type="checkbox"]');
  const submit =
    form.querySelector('button[type="submit"]') ||
    form.querySelector('input[type="submit"]');

  if (!email || !consent || !submit) return;

  /* ---------------------------------
     STATE RESOLUTION
  --------------------------------- */

  const params = new URLSearchParams(window.location.search);
  const unlockedFromEmail = params.get("from") === "email";
  const alreadyUnlocked = localStorage.getItem("video_unlocked") === "true";

  if (unlockedFromEmail || alreadyUnlocked) {
    unlockAndHide();
    if (unlockedFromEmail) {
      localStorage.setItem("video_unlocked", "true");
      history.replaceState(null, "", window.location.pathname);
    }
    return;
  }

  /* ---------------------------------
     VALIDATION HELPERS
  --------------------------------- */

  const errorEmail = createError(email, "Introduce un email válido");
  const errorConsent = createError(consent, "Debes aceptar el consentimiento");

  function isEmailValid(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function updateUI() {
    const emailOk = isEmailValid(email.value);
    const consentOk = consent.checked;

    errorEmail.style.opacity = emailOk ? "0" : "1";
    errorConsent.style.opacity = consentOk ? "0" : "1";

    const ok = emailOk && consentOk;
    submit.disabled = !ok;
    submit.style.opacity = ok ? "1" : "0.4";
    submit.style.cursor = ok ? "pointer" : "not-allowed";
  }

  /* ---------------------------------
     EVENTS
  --------------------------------- */

  email.addEventListener("input", updateUI);
  consent.addEventListener("change", updateUI);

  form.addEventListener("submit", e => {
    if (!isEmailValid(email.value) || !consent.checked) {
      e.preventDefault();
      updateUI();
    }
  });

  // Esperar a que Carrd confirme éxito
  const observer = new MutationObserver(() => {
    if (form.classList.contains("success")) {
      localStorage.setItem("video_unlocked", "true");
      unlockAndHide();
      observer.disconnect();
    }
  });

  observer.observe(form, {
    attributes: true,
    attributeFilter: ["class"],
  });


  // Initial state
  updateUI();

  /* ---------------------------------
     HELPERS
  --------------------------------- */

  function unlockAndHide() {
    if (typeof window.unlockVideo === "function") {
      window.unlockVideo();
    }

    form.style.display = "none";
    if (consentText) consentText.style.display = "none";
  }

  function createError(field, text) {
    const wrapper = field.closest(".field")?.querySelector(".field-inner") || field.parentNode;
    const el = document.createElement("div");
    el.className = "error-msg";
    el.textContent = text;
    el.style.opacity = "0";
    wrapper.appendChild(el);
    return el;
  }
}
