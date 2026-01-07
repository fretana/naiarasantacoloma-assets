(async function () {
  // Evitar duplicados
  if (document.getElementById("qx_footer")) return;

  try {
    const res = await fetch(
      "https://static.naiarasantacoloma.com/partials/legal-footer.html",
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.warn("Legal footer fetch failed:", res.status);
      return;
    }

    const html = await res.text();

    // Insertar al final del body
    //document.body.insertAdjacentHTML("beforeend", html);
    document.body.appendChild(
      document.createRange().createContextualFragment(html)
    );

    /*const footer = document.getElementById("qx_footer");
    if (footer && footer.parentElement !== document.body) {
      document.body.appendChild(footer);
    }    */

    // Año automático (por si lo quieres dinámico más adelante)
    const yearNode = document.querySelector("#qx_footer .qx_footer_copy");
    if (yearNode) {
      const year = new Date().getFullYear();
      yearNode.innerHTML = yearNode.innerHTML.replace(
        /\d{4}/,
        year.toString()
      );
    }

  } catch (e) {
    console.warn("Legal footer not loaded", e);
  }
})();
