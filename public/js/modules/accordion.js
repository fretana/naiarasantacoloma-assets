

export function initAccordions() {
  document.querySelectorAll(".my-accordion").forEach(container => {
    const items = Array.from(container.querySelectorAll("details"));

    items.forEach(item => {
      const summary = item.querySelector("summary");
      if (!summary) return;

      summary.addEventListener("click", () => {
        // If this item is about to open, close others first
        if (!item.hasAttribute("open")) {
          items.forEach(other => {
            if (other !== item) {
              other.removeAttribute("open");
            }
          });
        }
      });
    });
  });
}
