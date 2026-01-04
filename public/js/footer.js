(async function () {
  // Evitar duplicados
  if (document.getElementById("qx_legal_footer")) return;

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
    document.body.insertAdjacentHTML("beforeend", html);

    // Año automático (por si lo quieres dinámico más adelante)
    const yearNode = document.querySelector("#qx_legal_footer .qx_footer_copy");
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
