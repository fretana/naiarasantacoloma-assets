

export function initAccordions() {
  const accordions = document.querySelectorAll(".my-accordion");

  accordions.forEach(container => {
    const items = container.querySelectorAll("details");

    items.forEach(item => {
      item.addEventListener("toggle", () => {
        if (item.open) {
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
