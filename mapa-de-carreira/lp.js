/* Páginas de tráfego (Mapa Astral Simples e Mapa Astral de Carreira).
   Produto da página: <body data-product="mapaCarreira|mapaSimples">. Um elemento pode falar de outro produto com data-lp-of="...".
   Preço, prazo, parcelas e checkout vêm de site-config.js. Botões: checkout Kiwify (se checkoutUrl preenchido, com as UTMs do anúncio)
   → senão WhatsApp com mensagem pronta → senão contatos do site. Eventos do Pixel: ViewContent (carregar) e InitiateCheckout (clique). */
(function () {
  var cfg = window.SITE_CONFIG || {};
  var NAMES = { mapaCarreira: "Mapa Astral de Carreira", mapaSimples: "Mapa Astral Simples" };
  var DEFAULTS = { mapaCarreira: { price: 37, pages: "cerca de 20" }, mapaSimples: { price: 9.9, pages: "cerca de 7" } };
  var pageProduct = document.body.getAttribute("data-product") || "mapaCarreira";
  var number = String(cfg.whatsappNumber || "").replace(/\D/g, "");

  function prod(key) {
    var c = cfg[key] || {}, d = DEFAULTS[key] || {};
    return { key: key, name: NAMES[key] || key, price: Number(c.price) || d.price, inst: Number(c.installments) || 0,
             hours: String(Number(c.deliveryHours) || 24), pages: c.pages || d.pages, checkout: String(c.checkoutUrl || "").trim(),
             testimonials: c.showTestimonials === true };
  }
  function of(el) { return prod(el.getAttribute("data-lp-of") || pageProduct); }
  function brl(v) { return "R$ " + (Math.round(v * 100) % 100 === 0 ? String(Math.round(v)) : v.toFixed(2).replace(".", ",")); }

  // UTMs e ids do anúncio da URL da página → checkout (sem sobrescrever o que já estiver no link do checkout)
  var PASS = /^(utm_[a-z]+|src|sck|fbclid|gclid|ttclid)$/;
  function withParams(url) {
    try {
      var u = new URL(url), here = new URLSearchParams(window.location.search);
      here.forEach(function (v, k) { if (PASS.test(k) && !u.searchParams.has(k)) u.searchParams.set(k, v); });
      return u.toString();
    } catch (e) { return url; }
  }
  var blank = "\n\nmeus dados:\nnome completo:\ncidade onde nasci (e estado):\ndata de nascimento:\nhora de nascimento:";
  function waUrl(p, body) {
    var head = (cfg.waGreeting || "oi! quero encomendar:") + " " + p.name + " (" + brl(p.price) + ").";
    return "https://wa.me/" + number + "?text=" + encodeURIComponent(head + (body || blank));
  }
  function track(p, where) {
    var data = { content_name: p.name, content_category: "mapa astral", value: p.price, currency: "BRL" };
    if (window.fbq) window.fbq("track", "InitiateCheckout", data);
    if (window.gtag) window.gtag("event", "begin_checkout", { item_name: p.name, value: p.price, currency: "BRL", placement: where });
  }

  // 1. Textos que vêm da config
  document.querySelectorAll("[data-lp]").forEach(function (el) {
    var p = of(el), k = el.getAttribute("data-lp");
    var v = { price: brl(p.price), installments: String(p.inst), hours: p.hours, pages: p.pages }[k];
    if (v) el.textContent = v;
  });
  document.querySelectorAll("[data-lp-installments-row]").forEach(function (el) { if (!of(el).inst) { el.hidden = true; el.style.display = "none"; } });

  // 2. Modo de compra da página: checkout (Kiwify) ou whatsapp
  var main = prod(pageProduct);
  var mode = main.checkout ? "checkout" : "wa";
  document.querySelectorAll("[data-lp-mode]").forEach(function (el) { el.hidden = el.getAttribute("data-lp-mode") !== mode; });

  // 3. Depoimentos só com config liberada e algum <blockquote> de verdade
  var dep = document.querySelector("[data-lp-testimonials]");
  if (dep && main.testimonials && dep.querySelector("blockquote")) dep.hidden = false;

  // 4. Botões de compra
  document.querySelectorAll("[data-lp-wa]").forEach(function (a) {
    var p = of(a);
    if (p.checkout) { a.href = withParams(p.checkout); a.removeAttribute("target"); }
    else if (number) { a.href = waUrl(p); a.target = "_blank"; a.rel = "noopener"; }
    else { a.setAttribute("data-wa-pending", ""); }
    a.addEventListener("click", function () { track(p, a.getAttribute("data-lp-wa")); });
  });
  if (!main.checkout && !number) document.querySelectorAll("[data-lp-pending]").forEach(function (el) { el.hidden = false; });

  // 5. Formulário opcional (só no modo whatsapp; com checkout, os dados são pedidos depois da compra)
  var form = document.getElementById("pedido");
  if (form && mode === "checkout") form.hidden = true;
  if (form && mode === "wa") {
    var semhora = form.elements.semhora, hora = form.elements.hora, err = form.querySelector(".lp-err");
    semhora.addEventListener("change", function () { hora.disabled = semhora.checked; if (semhora.checked) hora.value = ""; });
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var f = form.elements, miss = [];
      if (!f.nome.value.trim()) miss.push("nome completo");
      if (!f.cidade.value.trim()) miss.push("cidade");
      if (!f.data.value) miss.push("data de nascimento");
      if (!f.hora.value && !semhora.checked) miss.push("hora (ou marque \"não sei a hora\")");
      if (miss.length) { err.textContent = "falta preencher: " + miss.join(", ") + "."; err.hidden = false; return; }
      err.hidden = true;
      var d = f.data.value.split("-");
      var body = "\n\nmeus dados:\nnome completo: " + f.nome.value.trim() + "\ncidade onde nasci: " + f.cidade.value.trim() +
        "\ndata de nascimento: " + d[2] + "/" + d[1] + "/" + d[0] + "\nhora de nascimento: " + (semhora.checked ? "não sei" : f.hora.value);
      track(main, "formulario");
      window.location.href = number ? waUrl(main, body) : "../index.html#contato";
    });
  }

  // 6. ViewContent (o site.js só carrega o pixel se metaPixelId estiver preenchido)
  if (window.fbq) window.fbq("track", "ViewContent", { content_name: main.name, content_category: "mapa astral", value: main.price, currency: "BRL" });

  // 7. Barra fixa: aparece depois do hero e some sobre a oferta
  var bar = document.querySelector(".lp-sticky"), hero = document.querySelector(".lp-hero"), offer = document.getElementById("oferta");
  if (bar && hero && offer && "IntersectionObserver" in window) {
    var heroIn = true, offerIn = false;
    var upd = function () { bar.classList.toggle("is-on", !heroIn && !offerIn); };
    new IntersectionObserver(function (e) { heroIn = e[0].isIntersecting; upd(); }).observe(hero);
    new IntersectionObserver(function (e) { offerIn = e[0].isIntersecting; upd(); }).observe(offer);
  } else if (bar) { bar.classList.add("is-on"); }
})();
