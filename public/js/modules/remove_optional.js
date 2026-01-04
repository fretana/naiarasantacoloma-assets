export function removeOptionalText() {
  // --- 1. LIMPIAR PLACEHOLDERS (textarea / input) ---
  const fields = document.querySelectorAll("#main-form [placeholder]");
  fields.forEach(el => {
    const ph = el.getAttribute("placeholder");
    if (ph) {
      el.setAttribute(
        "placeholder",
        ph
          .replace(/\s*\(opcional\)/gi, "")
          .replace(/\s*\(optional\)/gi, "")
      );
    }
  });

  // --- 2. LIMPIAR TEXTO DE OPTION EN SELECTS ---
  const selects = document.querySelectorAll("#main-form select option");

  selects.forEach(opt => {
    const txt = opt.textContent;
    if (txt.includes("(opcional)") || txt.includes("(Optional)")) {
      opt.textContent = txt
        .replace(/\s*\(opcional\)/gi, "")
        .replace(/\s*\(optional\)/gi, "")
        .trim();
    }
  });
}
