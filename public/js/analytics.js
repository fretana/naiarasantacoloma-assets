// analytics.js
window.qxTrack = function (event, params = {}) {
  if (!window.dataLayer) return;

  window.dataLayer.push({
    event,
    ...params,
  });
};


export function initScroll75Tracking() {
  // Evitar duplicados por sesión
  if (sessionStorage.getItem("qx_scroll_75")) return;

  function onScroll() {
    const scrollTop = window.scrollY || window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    const scrolledRatio = (scrollTop + viewportHeight) / docHeight;

    if (scrolledRatio >= 0.75) {
      sessionStorage.setItem("qx_scroll_75", "true");

      if (window.qxTrack && window.dataLayer) {
        qxTrack("scroll_75", {
          page: window.location.pathname,
        });
      }

      window.removeEventListener("scroll", onScroll);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
}

