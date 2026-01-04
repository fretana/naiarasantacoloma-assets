

export function initAccordions() {
  document.querySelectorAll(".my-accordion").forEach(container => {
    const items = Array.from(container.querySelectorAll("details"));
    let syncing = false;

    items.forEach(item => {
      item.addEventListener("toggle", () => {
        if (syncing) return;
        if (!item.open) return;

        syncing = true;

        // ⏱ Defer closing others to next frame
        requestAnimationFrame(() => {
          items.forEach(other => {
            if (other !== item && other.open) {
              other.open = false;
            }
          });
          syncing = false;
        });
      });
    });
  });
}
