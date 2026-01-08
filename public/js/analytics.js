// analytics.js
/*window.qxTrack = function (event, params = {}) {
  if (!window.dataLayer) return;

  window.dataLayer.push({
    event,
    ...params,
  });
};
*/

// analytics.js
/*window.qxTrack = function (event, params = {}) {
  if (!window.dataLayer) return;

  const search = new URLSearchParams(window.location.search);

  const utmPayload = {
    utm_source: search.get("utm_source"),
    utm_medium: search.get("utm_medium"),
    utm_campaign: search.get("utm_campaign"),
    utm_content: search.get("utm_content"),
    utm_term: search.get("utm_term"),
    variant: search.get("variant"),
    hero: search.get("hero"),
  };

  // Limpia nulls
  Object.keys(utmPayload).forEach(
    k => utmPayload[k] == null && delete utmPayload[k]
  );

  window.dataLayer.push({
    event,
    page: window.location.pathname,
    ...utmPayload,
    ...params,
  });
};*/


window.qxTrack = function (event, params = {}) {
  if (!window.dataLayer) return;

  const search = new URLSearchParams(window.location.search);

  // --- helpers VARIANT ---
  const variantFromUrl = search.get("variant");
  const variantFromSession = sessionStorage.getItem("variant");

  let resolvedVariant = null;

  if (variantFromUrl) {
    resolvedVariant = variantFromUrl;
    sessionStorage.setItem("variant", variantFromUrl);
  } else if (variantFromSession) {
    resolvedVariant = variantFromSession;
  }

  // --- helpers INTERNAL_OFFER ---
  const offerFromUrl = search.get("internal_offer");
  const offerFromSession = sessionStorage.getItem("internal_offer");

  let resolvedOffer = null;

  if (offerFromUrl) {
    resolvedOffer = offerFromUrl;
    sessionStorage.setItem("internal_offer", offerFromUrl);
  } else if (offerFromSession) {
    resolvedOffer = offerFromSession;
  }

  const utmPayload = {
    utm_source: search.get("utm_source"),
    utm_medium: search.get("utm_medium"),
    utm_campaign: search.get("utm_campaign"),
    utm_content: search.get("utm_content"),
    utm_term: search.get("utm_term"),
    hero: search.get("hero"),
  };

  // Añadir variant SOLO si no viene ya en params
  if (!params.variant && resolvedVariant) {
    utmPayload.variant = resolvedVariant;
  }

  // Añadir internal_offer SOLO si no viene ya en params
  if (!params.internal_offer && resolvedOffer) {
    utmPayload.internal_offer = resolvedOffer;
  }

  // Limpia nulls
  Object.keys(utmPayload).forEach(
    k => utmPayload[k] == null && delete utmPayload[k]
  );

  window.dataLayer.push({
    event,
    page: window.location.pathname,
    ...utmPayload,
    ...params,
  });
};



const SCROLL_75_EXCLUDED_PATHS = [
  "/pago",
  "/gracias",
  "/politica-de-privacidad",
  "/aviso-legal",
  "/politica-de-cookies",
];

export function initScroll75Tracking() {

  const path = window.location.pathname;

  // excluir páginas no deseadas
  if (SCROLL_75_EXCLUDED_PATHS.includes(path)) {
    return;
  }

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

