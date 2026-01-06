
window.qxFlushDeferredEvents = function () {
  if (!window.qxTrack || !window.dataLayer) return;

  // checkout_opened
  if (sessionStorage.getItem("qx_checkout_opened_pending")) {
    qxTrack("checkout_opened", {
      page: window.location.pathname,
    });
    sessionStorage.removeItem("qx_checkout_opened_pending");
  }


  Object.keys(sessionStorage).forEach((k) => {
    if (k.startsWith("qx_payment_success_") && k.endsWith("_pending")) {
      const txId = k.replace("qx_payment_success_", "").replace("_pending", "");

      qxTrack("payment_success", {
        transaction_id: txId,
        page: window.location.pathname,
      });

      sessionStorage.removeItem(k);
    }
  });

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

/* -------------------------------
   CHECKOUT OPENED
-------------------------------- */
function getTransactionId() {
  const params = new URLSearchParams(window.location.search);
  /*return (
    params.get("session_id") ||
    params.get("payment_intent") ||
    params.get("tx") ||
    "unknown"
  );*/
  return params.get("session_id");
}

function trackPaymentSuccess() {
  const txId = getTransactionId();
  if (!txId) return;

  const key = `qx_payment_success_${txId}`;
  if (sessionStorage.getItem(key)) return;

  sessionStorage.setItem(key, "true");

  if (window.qxTrack && window.dataLayer) {
    qxTrack("payment_success", {
      transaction_id: txId,
      page: window.location.pathname,
    });
  } else {
    sessionStorage.setItem(`${key}_pending`, "true");
  }
}

function cleanThanksUrl() {
  const url = new URL(window.location.href);

  if (url.searchParams.has("session_id")) {
    url.searchParams.delete("session_id");
    window.history.replaceState({}, document.title, url.pathname);
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

  if (window.location.pathname === "/gracias") {
    trackPaymentSuccess();
    cleanThanksUrl();
  }

});