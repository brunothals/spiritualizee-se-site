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
    showTestimonials: false // true SÓ quando houver depoimentos reais, com autorização por escrito.
  }
};
