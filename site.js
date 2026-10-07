(function () {
  var cfg = window.SITE_CONFIG || {};
  var brand = cfg.brandName || "Spiritualizee-se";
  var DEFAULT_BRAND = "Spiritualizee-se";

  // 1. Nome da marca centralizado
  document.querySelectorAll("[data-brand]").forEach(function (el) {
    el.textContent = brand;
  });
  if (brand !== DEFAULT_BRAND) {
    document.title = document.title.split(DEFAULT_BRAND).join(brand);
  }

  // 2. Links de WhatsApp com mensagem pré-preenchida pelo produto
  var number = String(cfg.whatsappNumber || "").replace(/\D/g, "");
  document.querySelectorAll("[data-wa]").forEach(function (link) {
    var product = link.getAttribute("data-wa");
    var message = product ? (cfg.waGreeting || "oi! quero encomendar:") + " " + product : cfg.waGenericMessage || "oi!";
    if (number) {
      link.href = "https://wa.me/" + number + "?text=" + encodeURIComponent(message);
      link.target = "_blank";
      link.rel = "noopener";
    } else {
      // Sem número configurado: mantém o href de fallback (seção de contato)
      link.setAttribute("data-wa-pending", "");
    }
  });

  // 3. Instagram
  if (cfg.instagramUrl) {
    document.querySelectorAll("[data-instagram]").forEach(function (link) {
      link.href = cfg.instagramUrl;
    });
  }

  // 4. Ano no rodapé
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
