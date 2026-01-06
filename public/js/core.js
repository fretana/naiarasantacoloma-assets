(function initThanksPageTracking() {
  if (window.location.pathname !== "/gracias") return;

  console.log("Gracias page detected");

  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session_id");

  if (!sessionId) {
    console.warn("No session_id in URL");
    return;
  }

  const key = `qx_payment_success_${sessionId}`;
  if (sessionStorage.getItem(key)) {
    console.log("Payment already tracked");
  } else {
    sessionStorage.setItem(key, "true");

    if (window.qxTrack && window.dataLayer) {
      qxTrack("payment_success", {
        transaction_id: sessionId,
        page: "/gracias",
      });
      console.log("payment_success sent", sessionId);
    } else {
      console.warn("GTM not ready, deferring");
      sessionStorage.setItem(`${key}_pending`, "true");
    }
  }

  // Limpieza de URL (SIEMPRE)
  params.delete("session_id");
  window.history.replaceState({}, document.title, "/gracias");
})();


window.qxFlushDeferredEvents = function () {
  if (!window.qxTrack || !window.dataLayer) return;

  // checkout_opened
  if (sessionStorage.getItem("qx_checkout_opened_pending")) {
    qxTrack("checkout_opened", {
      page: window.location.pathname,
    });
    sessionStorage.removeItem("qx_checkout_opened_pending");
  }

};



import { removeOptionalText } from "./modules/remove_optional.js";
import { initVideoGate, initVideoStartedTracking } from "./modules/video_gate.js";
import { initScroll75Tracking } from "./analytics.js";


/* -------------------------------
   CHECKOUT OPENED
-------------------------------- */
function trackCheckoutOpened() {
  if (sessionStorage.getItem("qx_checkout_opened")) return;

  sessionStorage.setItem("qx_checkout_opened", "true");

  if (window.qxTrack && window.dataLayer) {
    qxTrack("checkout_opened", {
      page: window.location.pathname,
    });
  } else {
    sessionStorage.setItem("qx_checkout_opened_pending", "true");
  }
}



document.addEventListener("DOMContentLoaded", () => {

  if (document.querySelector("#main-form")) {
    removeOptionalText();
    initVideoGate();
    initVideoStartedTracking();
  }

  initScroll75Tracking();

  // Checkout (SOLO en /pago)
  if (window.location.pathname === "/pago") {
    trackCheckoutOpened();
  }


});