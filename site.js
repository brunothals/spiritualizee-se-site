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

  // 4. Botão flutuante de WhatsApp (injetado em todas as páginas)
  var scriptEl = document.querySelector('script[src$="site.js"]');
  var root = scriptEl ? scriptEl.getAttribute("src").replace(/site\.js$/, "") : "";
  if (cfg.waFloat !== false && !document.querySelector(".wa-float")) {
    var fl = document.createElement("a");
    fl.className = "wa-float";
    fl.setAttribute("aria-label", "falar no WhatsApp");
    fl.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg><span>tirar dúvida no whatsapp</span>';
    var page = (document.body.getAttribute("data-wa-context") || "").trim();
    var msg = page ? (cfg.waGenericMessage || "oi!") + " (página: " + page + ")" : cfg.waGenericMessage || "oi!";
    if (number) {
      fl.href = "https://wa.me/" + number + "?text=" + encodeURIComponent(msg);
      fl.target = "_blank";
      fl.rel = "noopener";
    } else {
      fl.href = root + "index.html#contato";
      fl.setAttribute("data-wa-pending", "");
    }
    fl.setAttribute("data-track", "whatsapp-flutuante");
    document.body.appendChild(fl);
  }

  // 5. Pixel da Meta (só carrega se metaPixelId estiver preenchido em site-config.js)
  var pixelId = String(cfg.metaPixelId || "").replace(/\D/g, "");
  if (pixelId && !window.fbq) {
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
  }
  // Evento de contato a cada clique em botão de WhatsApp (funciona com ou sem pixel)
  document.addEventListener("click", function (ev) {
    var a = ev.target.closest && ev.target.closest("[data-wa], .wa-float");
    if (!a) return;
    var name = a.getAttribute("data-wa") || a.getAttribute("data-track") || "whatsapp";
    if (window.fbq) window.fbq("track", "Contact", { content_name: name });
    if (window.gtag) window.gtag("event", "whatsapp_click", { item_name: name });
  });

  // 6. Ano no rodapé
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
