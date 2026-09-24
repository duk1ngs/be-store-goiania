import { existsSync, writeFileSync } from "node:fs";
import { createSeoFiles } from "./seo-content.mjs";
const envFile = new URL("../.env", import.meta.url);
if (existsSync(envFile)) process.loadEnvFile(envFile);
const output = createSeoFiles(process.env.SITE_URL ?? "", process.env.SITE_BASE_PATH ?? "");
writeFileSync(new URL("../lib/seo-config.json", import.meta.url), JSON.stringify({siteUrl:output.siteUrl}, null, 2)+"\n");
for (const [file, content] of [["robots.txt",output.robots],["sitemap.xml",output.sitemap],["llms.txt",output.llms]]) {
  writeFileSync(new URL("../public/"+file, import.meta.url), content);
}
console.log(output.siteUrl ? "SEO configurado para "+output.siteUrl : "SEO de prévia: sem domínio canônico definitivo.");
