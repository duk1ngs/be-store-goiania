# Be Store Goiânia

Website em React, TypeScript e Vinext/Vite. A estrutura original do projeto foi preservada.

## Desenvolvimento

Use Node.js 22.13 ou superior, preferencialmente Node 24.

```sh
npm ci
npm run dev -- --hostname 127.0.0.1 --port 3000
npm run typecheck
npm test
npm run build
```

## Conteúdo comercial

- `lib/business.json`: endereço, telefone, Instagram, WhatsApp e reputação informados no briefing.
- `lib/catalog.ts`: contrato tipado e referências visuais de iPhones e tablet. Não há SKUs, preços, estoque, garantias ou modelo exato confirmados.
- O canal comercial é https://wa.link/5les7m. O telefone (62) 4103-0303 não é utilizado como número de WhatsApp.
- As promoções devem ser consultadas no Instagram https://www.instagram.com/bestoregyn/.
- A nota 4,8 e 307 avaliações são dados fornecidos pela loja, não uma consulta atual ao Google. Não são incluídos como AggregateRating.

## Domínio e SEO

Copie `.env.example` para `.env`, defina `SITE_URL` apenas com o domínio oficial escolhido e execute novamente `npm run build`. O gerador centraliza canonical, Open Graph, JSON-LD e os arquivos públicos `robots.txt`, `sitemap.xml`, `llms.txt`.

Sem SITE_URL, a prévia usa noindex, robots restritivo e sitemap vazio válido. Nenhum domínio fictício ou de preview é declarado como definitivo. Apenas a raiz tem URL indexável; âncoras não viram páginas de produto.

O site não implementa checkout, rastreamento, coleta de dados ou integração de estoque.

## GitHub Pages

O workflow `.github/workflows/deploy-pages.yml` gera uma exportação estática e publica o site no GitHub Pages a cada envio para `main`. O build configura automaticamente o subdiretório do repositório, os caminhos dos assets e a URL canônica da prévia.

Para testar a mesma exportação localmente:

```sh
STATIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH=/be-store-goiania \
SITE_URL=https://usuario.github.io SITE_BASE_PATH=/be-store-goiania \
npm run build:pages
```

## Imagens e identidade

A logo fornecida é utilizada sem alteração. As duas fotos foram tratadas por IA; as versões originais, convertidas para WebP, podem ser vistas nas janelas de detalhes e na galeria. Tratamento generativo pode alterar microdetalhes, especialmente inscrições do teclado; as imagens tratadas não devem comprovar especificações ou estado de um produto.

Duas imagens conceituais complementares ilustram o hero e detalhes de acabamento, sem representar modelo, oferta ou estoque real. Prompts completos e procedência: `documentation/image-prompts.md` e `documentation/image-provenance.json`. Imagens finais usam WebP e tamanhos responsivos; fontes Manrope são servidas localmente.

## Skills aplicadas

CodeMakers-Design 2.1.1, modern-web-design, motion-framer, frontend-design e web-design-guidelines. A infraestrutura mantém Sites; os assets foram preparados com imagegen. Os princípios de animação foram implementados com CSS, Web Animations e IntersectionObserver, sem acrescentar bibliotecas de animação.

modern-web-design e motion-framer vieram de https://github.com/freshtechbro/claudedesignskills no commit 1da73febff0c3e1dfefc07f8a5ef8f7d1dfdb6cd, instaladas no pedido anterior. Nenhuma nova skill foi instalada durante a continuação.
