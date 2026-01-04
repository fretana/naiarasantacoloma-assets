(async function () {

  // 1. Cargar HTML del banner si no existe
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

  // 2. Ahora el resto de la lógica, tal cual
  const bar = document.getElementById("qx_cookie_bar");
  if (!bar) return;

  const consent = localStorage.getItem("qx_cookie_consent");

  if (!consent) bar.style.display = "block";
  if (consent === "accepted") loadGTM();

  // Aceptar
  document.getElementById("qx_accept").onclick = function () {
    localStorage.setItem("qx_cookie_consent", "accepted");
    bar.style.display = "none";

    // Evento aceptado
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "cookie_accept" });

    loadGTM();
  };

  // Rechazar
  document.getElementById("qx_reject").onclick = function () {
    localStorage.setItem("qx_cookie_consent", "rejected");
    bar.style.display = "none";
  };

  // Cargar GTM
  function loadGTM() {
    if (window.gtmLoaded) return;
    window.gtmLoaded = true;

    const gtmId = "GTM-MF59774F"; // ← TU ID
    const script = document.createElement("script");

    script.innerHTML = `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');
    `;

    document.head.appendChild(script);
  }
})();
