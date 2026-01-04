
export function initAccordions() {
  document.querySelectorAll(".my-accordion").forEach(container => {
    const items = Array.from(container.querySelectorAll("details"));

    container.addEventListener(
      "click",
      e => {
        const summary = e.target.closest("summary");
        if (!summary) return;

        const current = summary.parentElement;
        if (!current || current.tagName !== "DETAILS") return;

        // Close all others BEFORE browser toggles
        items.forEach(item => {
          if (item !== current) {
            item.removeAttribute("open");
          }
        });
      },
      true // ← CAPTURE PHASE (this is key)
    );
  });
}
