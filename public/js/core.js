
import { removeOptionalText } from "./modules/remove_optional.js";

document.addEventListener("DOMContentLoaded", () => {

  if (document.querySelector("#main-form")) {
    removeOptionalText();
  }
});