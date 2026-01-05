function trackVideoUnlockedOnce(source) {
  console.log("trackVideoUnlockedOnce called", source);

  if (sessionStorage.getItem("qx_video_unlocked_tracked")) return;

  sessionStorage.setItem("qx_video_unlocked_tracked", "true");

  if (window.qxTrack && window.dataLayer) {
    qxTrack("video_unlocked", { source });
  } else {
    // Retry cuando GTM esté listo
    const interval = setInterval(() => {
      if (window.qxTrack && window.dataLayer) {
        qxTrack("video_unlocked", { source });
        clearInterval(interval);
      }
    }, 300);
  }
}



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

  function tryUnlock(source = "form") {
    if (!form || typeof window.unlockVideo !== "function") {
      setTimeout(tryUnlock(source), 100);
      return;
    }

    console.log("tryUnlock called", source);


    window.unlockVideo();

    trackVideoUnlockedOnce(source);

    if (form) form.style.display = "none";
    if (consentText) consentText.style.display = "none";
    if (afterMsg) afterMsg.style.display = "block";

    localStorage.setItem("video_unlocked", "true");

    // Limpia la URL si venía de email
    if (params.get("from")) {
      history.replaceState(null, "", window.location.pathname);
    }
  }

  window.addEventListener("qx:form_success", () => {
    tryUnlock("form");
  });


  if (shouldUnlock) {
    tryUnlock(params.get("from") === "email" ? "email" : "storage");
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

  // --- 1) Inject wrappers + default messages (VISIBLE BY DEFAULT) ---
  const emailField = email.closest('.field[data-type="email"]');
  const consentField = consent.closest('.field[data-type="checkbox"]');

  function wrapField(fieldElement, errorId, errorText) {
    if (!fieldElement) return null;

    // If already wrapped (avoid duplicating on re-init)
    if (fieldElement.querySelector(`#${errorId}`)) {
      return fieldElement.querySelector(`#${errorId}`);
    }

    // Wrapper
    const wrapper = document.createElement("div");
    wrapper.classList.add("field-inner");

    while (fieldElement.firstChild) {
      wrapper.appendChild(fieldElement.firstChild);
    }
    fieldElement.appendChild(wrapper);

    // Error message (visible by default)
    const errorMsg = document.createElement("div");
    errorMsg.id = errorId;
    errorMsg.className = "error-msg";
    errorMsg.textContent = errorText;

    // Important: default visible
    errorMsg.style.opacity = "1";
    errorMsg.style.display = "block";

    wrapper.appendChild(errorMsg);
    return errorMsg;
  }

  const errorEmail = wrapField(
    emailField,
    "error-email",
    "introduce un email válido"
  );
  const errorConsent = wrapField(
    consentField,
    "error-consent",
    "debes aceptar este consentimiento"
  );

  function isEmailValid(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function updateUI() {
    const emailOk = isEmailValid(email.value);
    const consentOk = consent.checked;

    // Toggle messages (hide when valid, show when invalid)
    if (errorEmail) errorEmail.style.opacity = emailOk ? "0" : "1";
    if (errorConsent) errorConsent.style.opacity = consentOk ? "0" : "1";

    // Button gating
    const ok = emailOk && consentOk;
    btn.disabled = !ok;
    btn.style.opacity = ok ? "1" : "0.4";
    btn.style.cursor = ok ? "pointer" : "not-allowed";
  }

  email.addEventListener("input", updateUI);
  consent.addEventListener("change", updateUI);

  // Initial state: show messages by default
  updateUI();

  /* ---------------------------------
     UNLOCK AFTER REAL SUCCESS (Carrd-safe)
  --------------------------------- */
  /*const observer = new MutationObserver(() => {
    // Carrd usually marks the form with "success" when submission succeeds
    if (form.classList.contains("success")) {
      tryUnlock("form");
      observer.disconnect();
    }
  });

  observer.observe(form, { attributes: true, attributeFilter: ["class"] });*/
  
}
