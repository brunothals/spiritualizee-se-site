# Spiritualizee-se Site

Site público da Spiritualizee-se — HTML/CSS/JS estático, sem framework e sem build.
Pode ser publicado no GitHub Pages, Netlify, Vercel ou Cloudflare Pages.

Não coloque o app de atendimentos neste repositório público.

## Visual (branch `redesign-retro`)

Estética editorial retrô anos 70: gravuras antigas em domínio público, textura de papel,
tipografia serifada gorda em caixa alta e um fundo chapado por seção.

- **Fontes (Google Fonts):** Fraunces 600–900 com `SOFT 100` + `WONK 1` (títulos, estilo Cooper Black)
  e Libre Baskerville (texto).
- **Paleta** (variáveis no topo de `site.css`): lilás `#b79be0`, terracota `#e08a5f`, oliva `#a9b47a`,
  tijolo `#b23d2f`, mostarda `#e6c84f`, quase-preto `#1e1a17`, papel `#f2e6d0`, marrom do texto `#3a2418`.
- **Ilustrações:** `assets/art/`, com fontes e licenças em `assets/CREDITS.md`.

## Arquivos

- `index.html` — home (hero, catálogo, como funciona, transparência, depoimentos, FAQ, contato)
- `consultas/` — catálogo completo com preços e métodos
- `acolhimento/`, `circulo-de-luz/`, `praticas-energeticas/`, `projecao-astral/`, `espiritualidade-vida-real/`
- `termos/`, `privacidade/`, `aviso-legal/` — páginas legais
- `site.css` — todo o visual (compartilhado por todas as páginas)
- `site-config.js` — **nome da marca, WhatsApp e Instagram em um lugar só**
- `site.js` — aplica a config (nome, links de WhatsApp com mensagem pré-preenchida, ano)
- `tools/check_links.py` e `tools/screenshots.py` — verificação local

## Configurar WhatsApp

Em `site-config.js`, preencha `whatsappNumber` só com dígitos (DDI + DDD + número, ex.: `5511999999999`).
Cada botão com `data-wa="Nome do produto"` abre o WhatsApp com a mensagem
"oi! vim pelo site e quero encomendar: Nome do produto". Enquanto o número estiver vazio,
os botões levam para a seção de contato da home.

## Trocar o nome da marca

1. Mude `brandName` em `site-config.js` — isso já troca o nome em todos os elementos `data-brand`
   e nos títulos das abas.
2. Para o texto estático (SEO, compartilhamento e quem navega sem JavaScript), rode na raiz:

   ```bash
   grep -rl "Spiritualizee-se" --include="*.html" . | xargs sed -i 's/Spiritualizee-se/NovoNome/g'
   ```

3. Troque `assets/spiritualizee-logo.jpeg` e o link do Instagram (`instagramUrl` e o `href` com `data-instagram`).

## Testar localmente

```bash
python3 -m http.server 8000
python3 tools/check_links.py http://127.0.0.1:8000/
# screenshots (precisa de: pip install playwright && python -m playwright install chromium)
python3 tools/screenshots.py http://127.0.0.1:8000/ ./shots
```

## Melhorias v2 (branch `melhorias-v2`)

- `projecao-astral/` reescrita: níveis, sinais comuns, medo, preparação, técnica, madrugada, cuidados, FAQ (com JSON-LD) e créditos ao trabalho público de Saulo Calderon (sem vínculo).
- `biblioteca/`: passagens de livros por tema, conferidas na fonte, + um bloco de passagem nas páginas temáticas (componente `.passage`).
- Botão flutuante de WhatsApp em todas as páginas (`waFloat` em `site-config.js`).
- Pixel da Meta pronto, mas desligado: preencha `metaPixelId` em `site-config.js`. Cada clique em botão de WhatsApp dispara o evento `Contact` com o nome da leitura.
- SEO: canonical + Open Graph em todas as páginas, JSON-LD (ProfessionalService + FAQPage) na home, `robots.txt` e `sitemap.xml`.
  **Quando o domínio próprio entrar**, troque `https://brunothals.github.io/spiritualizee-se-site/` pelo domínio novo em todos os HTML, no `robots.txt` e no `sitemap.xml`:

  ```bash
  grep -rl "brunothals.github.io/spiritualizee-se-site/" . --include="*.html" --include="*.xml" --include="*.txt" | xargs sed -i 's#https://brunothals.github.io/spiritualizee-se-site/#https://SEUDOMINIO.com.br/#g'
  ```
- `consultas/`: tabela “qual leitura é pra vc” e guia “como fazer uma boa pergunta”; home com 4 dúvidas novas.
