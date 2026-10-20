/*
 * Configuração central do site.
 * Trocar o nome da marca, o WhatsApp ou o Instagram AQUI atualiza todos os botões e textos
 * marcados com data-brand / data-wa em todas as páginas.
 * (Os textos estáticos do HTML também trazem o nome, para SEO e para quem navega sem JS —
 *  veja no README o comando para renomear tudo de uma vez.)
 */
window.SITE_CONFIG = {
  brandName: "Spiritualizee-se",

  // TODO: número oficial do WhatsApp, só dígitos, com DDI + DDD. Ex.: "5511999999999".
  // Enquanto estiver vazio, os botões levam para a seção de contato do site.
  whatsappNumber: "",

  instagramUrl: "https://www.instagram.com/spiritualizee.se/",

  // Começo da mensagem pré-preenchida no WhatsApp. O nome do produto entra logo depois.
  waGreeting: "oi! vim pelo site e quero encomendar:",
  waGenericMessage: "oi! vim pelo site e queria tirar uma dúvida sobre as leituras.",

  // Botão flutuante de WhatsApp em todas as páginas (true/false).
  waFloat: true,

  // TODO (tráfego pago): ID do Pixel da Meta, só dígitos. Vazio = nenhum pixel carregado.
  // Quando preenchido, o site registra PageView e um evento "Contact" a cada clique em botão de WhatsApp
  // (com o nome da leitura). Lembre de manter a política de privacidade atualizada.
  metaPixelId: "",

  // Página de tráfego pago /mapa-de-carreira/ (Mapa Astral de Carreira em PDF).
  // Mudou aqui, muda em todos os preços, botões e na mensagem do WhatsApp da página.
  mapaCarreira: {
    price: 37,              // TODO: preço final no Pix, em reais (sugestão de teste: 37). Só número.
    installments: 6,        // parcelas no cartão (link de pagamento). 0 = esconde a linha do cartão.
    deliveryHours: 24,      // prazo prometido na página, em horas, depois do pagamento confirmado.
    pages: "cerca de 20",   // tamanho do PDF mostrado na página (o exemplo gerado tem 22 páginas).
    showTestimonials: false, // true SÓ quando houver depoimentos reais, com autorização por escrito.
    // Link do checkout da Kiwify (aba "Links" do produto). Preenchido = botões vão pro checkout, levando as UTMs do anúncio.
    // Vazio = botões vão pro WhatsApp (ou pros contatos do site, enquanto o número estiver vazio).
    checkoutUrl: ""
  },

  // Página de entrada /mapa-astral/ (Mapa Astral Simples, oferta de R$ 9,90 que puxa o Mapa de Carreira).
  mapaSimples: {
    price: 9.90,            // TODO: confirmar. Preço no Pix/cartão, em reais (com centavos: 9.90).
    installments: 0,        // 0 = não mostra parcelamento (não faz sentido em R$ 9,90).
    deliveryHours: 24,
    pages: "cerca de 7",    // o exemplo gerado tem 7 páginas.
    showTestimonials: false,
    checkoutUrl: ""         // link do checkout Kiwify do Mapa Astral Simples.
  }
};
