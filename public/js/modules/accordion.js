

export function initAccordions() {
  document.querySelectorAll(".my-accordion").forEach(container => {
    const items = Array.from(container.querySelectorAll("details"));

    // Guard to avoid cascading toggle loops
    let isSyncing = false;

    items.forEach(item => {
      item.addEventListener("toggle", () => {
        if (isSyncing) return;
        if (!item.open) return; // only act when something opens

        isSyncing = true;
        try {
          items.forEach(other => {
            if (other !== item && other.open) {
              other.open = false; // more reliable than removeAttribute
            }
          });
        } finally {
          isSyncing = false;
        }
      });
    });
  });
}
