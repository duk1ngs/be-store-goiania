import test from "node:test";
import assert from "node:assert/strict";
import { createSeoFiles, normalizeSiteBasePath, normalizeSiteUrl } from "./seo-content.mjs";
test("Sem domínio: não publica URL canônica fictícia nem indexa a prévia",()=>{
 const output=createSeoFiles("");
 assert.equal(output.siteUrl,"");
 assert.match(output.robots,/Disallow: \//);
 assert.doesNotMatch(output.robots,/Sitemap:/);
 assert.doesNotMatch(output.sitemap,/<loc>/);
 assert.match(output.llms,/domínio oficial ainda não foi definido/);
});
test("Todos os arquivos usam a mesma origem de produção",()=>{
 const output=createSeoFiles("https://loja.dominio-verificado.com.br/");
 assert.equal(output.siteUrl,"https://loja.dominio-verificado.com.br");
 assert.ok(output.robots.includes("Sitemap: "+output.siteUrl+"/sitemap.xml"));
 assert.ok(output.sitemap.includes("<loc>"+output.siteUrl+"/</loc>"));
 assert.ok(output.llms.includes("]("+output.siteUrl+"/)"));
 assert.doesNotMatch(output.sitemap,/lastmod/);
});
test("Suporta o subdiretório seguro exigido pelo GitHub Pages",()=>{
 const output=createSeoFiles("https://usuario.github.io","/be-store-goiania");
 assert.equal(output.siteUrl,"https://usuario.github.io/be-store-goiania");
 assert.ok(output.robots.includes(output.siteUrl+"/sitemap.xml"));
 assert.throws(()=>normalizeSiteBasePath("/loja/catalogo"));
});
test("Recusa domínios de teste, HTTP, credenciais e URLs com caminhos",()=>{
 for(const url of ["http://loja.com.br","https://localhost","https://loja.test","https://u:p@loja.com.br","https://loja.com.br/catalogo","https://loja.com.br/?x=1","https://loja.com.br/#a"]) assert.throws(()=>normalizeSiteUrl(url));
});
test("Canal comercial confirmado não é convertido em WhatsApp do telefone fixo",()=>{
 const output=createSeoFiles();
 assert.ok(output.llms.includes("https://wa.link/5les7m"));
 assert.ok(output.llms.includes("https://www.instagram.com/bestoregyn/"));
 assert.doesNotMatch(output.llms,/wa.me|api.whatsapp.com|Offer/);
});
