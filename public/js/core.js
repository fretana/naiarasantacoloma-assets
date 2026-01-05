
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