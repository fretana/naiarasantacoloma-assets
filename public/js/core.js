
import { removeOptionalText } from "./modules/remove_optional.js";
import { initVideoGate, initVideoStartedTracking } from "./modules/video_gate.js";


document.addEventListener("DOMContentLoaded", () => {

  if (document.querySelector("#main-form")) {
    removeOptionalText();
    initVideoGate();
    initVideoStartedTracking();
  }
});