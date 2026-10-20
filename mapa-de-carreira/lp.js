/* Página Mapa Astral de Carreira: preço/prazo vindos de site-config.js, CTA de WhatsApp, formulário opcional e eventos do Pixel. */
(function () {
  var cfg = window.SITE_CONFIG || {};
  var mc = cfg.mapaCarreira || {};
  var price = Number(mc.price) || 37;
  var inst = Number(mc.installments) || 0;
  var number = String(cfg.whatsappNumber || "").replace(/\D/g, "");
  var PRODUCT = "Mapa Astral de Carreira";

  function brl(v) { return "R$ " + (v % 1 === 0 ? String(v) : v.toFixed(2).replace(".", ",")); }

  // 1. Preço, parcelas, prazo e tamanho a partir da config
  var map = { price: brl(price), installments: String(inst), hours: String(Number(mc.deliveryHours) || 24), pages: mc.pages || "cerca de 20" };
  document.querySelectorAll("[data-lp]").forEach(function (el) { var k = el.getAttribute("data-lp"); if (map[k]) el.textContent = map[k]; });
  if (!inst) document.querySelectorAll("[data-lp-installments-row]").forEach(function (el) { el.hidden = true; el.style.display = "none"; });

  // 2. Depoimentos só aparecem se a config liberar (e se houver algum <blockquote> de verdade)
  var dep = document.querySelector("[data-lp-testimonials]");
  if (dep && mc.showTestimonials === true && dep.querySelector("blockquote")) dep.hidden = false;

  // 3. Mensagem do WhatsApp
  var head = (cfg.waGreeting || "oi! quero encomendar:") + " " + PRODUCT + " (" + brl(price) + ").";
  var blank = "\n\nmeus dados:\nnome completo:\ncidade onde nasci (e estado):\ndata de nascimento:\nhora de nascimento:";
  function waUrl(body) { return "https://wa.me/" + number + "?text=" + encodeURIComponent(head + (body || blank)); }

  function track(where) {
    var data = { content_name: PRODUCT, content_category: "mapa astral", value: price, currency: "BRL" };
    if (window.fbq) window.fbq("track", "InitiateCheckout", data);
    if (window.gtag) window.gtag("event", "begin_checkout", { item_name: PRODUCT, value: price, currency: "BRL", placement: where });
  }

  document.querySelectorAll("[data-lp-wa]").forEach(function (a) {
    if (number) { a.href = waUrl(); a.target = "_blank"; a.rel = "noopener"; }
    else { a.setAttribute("data-wa-pending", ""); }
    a.addEventListener("click", function () { track(a.getAttribute("data-lp-wa")); });
  });
  if (!number) document.querySelectorAll("[data-lp-pending]").forEach(function (el) { el.hidden = false; });

  // 4. Formulário opcional: monta a mensagem e abre o WhatsApp (nada é enviado para servidor nenhum)
  var form = document.getElementById("pedido");
  if (form) {
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
      track("formulario");
      if (number) window.location.href = waUrl(body);
      else window.location.href = "../index.html#contato";
    });
  }

  // 5. ViewContent (só dispara se o Pixel estiver configurado em site-config.js; o site.js carrega o pixel)
  if (window.fbq) window.fbq("track", "ViewContent", { content_name: PRODUCT, content_category: "mapa astral", value: price, currency: "BRL" });

  // 6. Barra fixa aparece depois que o hero sai da tela e some sobre a oferta
  var bar = document.querySelector(".lp-sticky"), hero = document.querySelector(".lp-hero"), offer = document.getElementById("oferta");
  if (bar && "IntersectionObserver" in window) {
    var heroIn = true, offerIn = false;
    var upd = function () { bar.classList.toggle("is-on", !heroIn && !offerIn); };
    new IntersectionObserver(function (e) { heroIn = e[0].isIntersecting; upd(); }).observe(hero);
    new IntersectionObserver(function (e) { offerIn = e[0].isIntersecting; upd(); }).observe(offer);
  } else if (bar) { bar.classList.add("is-on"); }
})();
