


import { initAccordions } from "./modules/accordion.js";

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".my-accordion")) {
    initAccordions();
  }
});
