import { readFileSync } from "node:fs";
const business = JSON.parse(readFileSync(new URL("../lib/business.json", import.meta.url), "utf8"));

export function normalizeSiteUrl(input = "") {
  const value = input.trim();
  if (!value) return "";
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.port || !url.hostname.includes(".") || ["localhost", "127.0.0.1"].includes(url.hostname) || /\.(example|invalid|test|localhost)$/.test(url.hostname) || !["", "/"].includes(url.pathname)) {
    throw new Error("SITE_URL deve ser a origem HTTPS do domínio oficial, sem caminho, credenciais ou parâmetros.");
  }
  return url.origin;
}
export function normalizeSiteBasePath(input = "") {
  const value = input.trim();
  if (!value) return "";
  const normalized = "/" + value.replace(/^\/+|\/+$/g, "");
  if (!/^\/[A-Za-z0-9._-]+$/.test(normalized)) {
    throw new Error("SITE_BASE_PATH deve conter apenas um segmento de caminho seguro.");
  }
  return normalized;
}
export function createSeoFiles(input = "", basePathInput = "") {
  const origin = normalizeSiteUrl(input);
  const siteUrl = origin ? origin + normalizeSiteBasePath(basePathInput) : "";
  const robots = siteUrl
    ? "User-agent: *\nAllow: /\n\nSitemap: " + siteUrl + "/sitemap.xml\n"
    : "User-agent: *\nDisallow: /\n\n# Previa privada: dominio oficial ainda nao configurado.\n";
  const urls = siteUrl ? "  <url><loc>" + siteUrl + "/</loc></url>\n" : "";
  const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + "</urlset>\n";
  const llms = "# " + business.name + "\n\n> Loja de eletrônicos com foco em iPhones, em Goiânia.\n\n"
    + "## Informações da empresa\n\n- Segmento: eletrônicos, com foco em iPhones.\n- Endereço: " + business.address + ", " + business.city + ", " + business.postalCode + ".\n- Telefone: " + business.phone + ".\n- Envio para todo o Brasil, conforme informado pela loja.\n- Parcelamento em até 18 vezes no cartão de crédito. Taxas, bandeiras e demais condições devem ser consultadas com a equipe.\n\n"
    + "## Canais oficiais informados\n\n- [Instagram](" + business.instagram + "): promoções e novidades da loja.\n- [Atendimento comercial pelo WhatsApp](" + business.whatsapp + ").\n\n"
    + (siteUrl ? "## Site\n\n- [Página principal](" + siteUrl + "/): apresentação, seleção ilustrativa, galeria e contato.\n\n" : "## Site\n\nO domínio oficial ainda não foi definido. Esta versão não apresenta uma URL canônica definitiva.\n\n")
    + "## Catálogo\n\nAs imagens são referências visuais. Não há catálogo de SKUs, preços ou estoque confirmado nesta versão. Consulte a equipe para modelos, armazenamento, cores, condição, preços e disponibilidade.\n";
  return { siteUrl, robots, sitemap, llms };
}
