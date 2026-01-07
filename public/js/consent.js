(async function () {

  // 1. Load cookie banner HTML
  if (!document.getElementById("qx_cookie_bar")) {
    try {
      const res = await fetch(
        "https://static.naiarasantacoloma.com/partials/cookie-banner.html"
      );
      const html = await res.text();
      document.body.insertAdjacentHTML("beforeend", html);
    } catch (e) {
      console.warn("Cookie banner HTML not loaded", e);
      return;
    }
  }

  const bar = document.getElementById("qx_cookie_bar");
  if (!bar) return;

  const consent = localStorage.getItem("qx_cookie_consent");

  if (!consent) bar.style.display = "block";
  if (consent === "accepted") loadGTM();

  // ACCEPT
  document.getElementById("qx_accept").onclick = function () {
    localStorage.setItem("qx_cookie_consent", "accepted");
    bar.style.display = "none";
    loadGTM(true);
  };

  // REJECT
  document.getElementById("qx_reject").onclick = function () {
    localStorage.setItem("qx_cookie_consent", "rejected");

    // Guardamos rechazo local (no GA)
    sessionStorage.setItem("qx_cookies_rejected", "true");

    bar.style.display = "none";
  };


  function loadGTM(trackAccept = false) {
    if (window.gtmLoaded) return;
    window.gtmLoaded = true;

    // Asegurar dataLayer
    window.dataLayer = window.dataLayer || [];

    const gtmId = "GTM-MF59774F"; // TU ID REAL
    const script = document.createElement("script");

    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
    script.async = true;

    script.onload = () => {
      //console.log("GTM loaded");

      // Evento cookies accepted (si aplica)
      if (trackAccept) {
        window.dataLayer.push({ event: "cookies_accepted" });
      }

      // Evento cookies rejected diferido
      if (sessionStorage.getItem("qx_cookies_rejected")) {
        window.dataLayer.push({ event: "cookies_rejected" });
        sessionStorage.removeItem("qx_cookies_rejected");
      }

      // 🔑 FLUSH GLOBAL DE EVENTOS DIFERIDOS
      if (typeof window.qxFlushDeferredEvents === "function") {
        window.qxFlushDeferredEvents();
      }
    };

    document.head.appendChild(script);

    // Inicialización estándar GTM (antes de que cargue)
    window.dataLayer.push({
      "gtm.start": new Date().getTime(),
      event: "gtm.js",
    });
  }
  



  /*function loadGTM(trackAccept = false) {
    if (window.gtmLoaded) return;
    window.gtmLoaded = true;

    window.dataLayer = window.dataLayer || [];

    const gtmId = "GTM-MF59774F"; // TU ID
    const script = document.createElement("script");

    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
    script.async = true;

    document.head.appendChild(script);

    // Emit events ONLY after GTM exists
    script.onload = () => {
      if (trackAccept) {
        window.dataLayer.push({ event: "cookies_accepted" });
      }

      if (window.qxFlushDeferredEvents) {
        window.qxFlushDeferredEvents();
      }
      
      if (sessionStorage.getItem("qx_cookies_rejected")) {
        window.dataLayer.push({ event: "cookies_rejected" });
        sessionStorage.removeItem("qx_cookies_rejected");
      }
    };
  }*/

})();
