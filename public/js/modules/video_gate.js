export function initVideoGate() {
  const form = document.getElementById("main-form");
  const consentText = document.getElementById("text_consent");
  const afterMsg = document.getElementById("after-form-message");

  if (afterMsg) afterMsg.style.display = "none";

  /* ---------------------------------
     UNLOCK FROM EMAIL OR STORAGE
  --------------------------------- */

  const params = new URLSearchParams(window.location.search);
  const shouldUnlock =
    params.get("from") === "email" ||
    localStorage.getItem("video_unlocked") === "true";

  if (shouldUnlock) {
    tryUnlock();
    return;
  }

  /* ---------------------------------
     FORM VALIDATION (NO submit hook)
  --------------------------------- */

  if (!form) return;

  const email = document.getElementById("main-form-email-input");
  const consent = document.getElementById("main-form-consent-check");
  const btn = form.querySelector("button[type='submit']");

  if (!email || !consent || !btn) return;

  function isEmailValid(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function updateUI() {
    const ok = isEmailValid(email.value) && consent.checked;
    btn.disabled = !ok;
    btn.style.opacity = ok ? "1" : "0.4";
    btn.style.cursor = ok ? "pointer" : "not-allowed";
  }

  email.addEventListener("input", updateUI);
  consent.addEventListener("change", updateUI);

  updateUI();

  /* ---------------------------------
     UNLOCK AFTER SUBMIT (CARRD SAFE)
  --------------------------------- */

  function tryUnlock() {
    if (!form || typeof window.unlockVideo !== "function") {
      setTimeout(tryUnlock, 100);
      return;
    }

    window.unlockVideo();

    if (form) form.style.display = "none";
    if (consentText) consentText.style.display = "none";

    localStorage.setItem("video_unlocked", "true");

    // Limpia la URL si venía de email
    if (params.get("from")) {
      history.replaceState(null, "", window.location.pathname);
    }
  }

  // Observa el submit real de Carrd (sin tocarlo)
  form.addEventListener("submit", () => {
    setTimeout(tryUnlock, 500);
  });
}
