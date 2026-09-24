import type { Metadata, Viewport } from "next";
import seo from "@/lib/seo-config.json";
import { siteAsset } from "@/lib/site-path";
import "./globals.css";

const title = "Be Store Goiânia | Seu próximo upgrade";
const description = "iPhones e eletrônicos na Be Store Goiânia. Atendimento pelo WhatsApp, envio para todo o Brasil e parcelamento em até 18 vezes. Av. T-10, Setor Bueno.";
export const metadata: Metadata = {
  title, description,
  ...(seo.siteUrl ? { metadataBase: new URL(seo.siteUrl), alternates: { canonical: seo.siteUrl + "/" } } : {}),
  robots: { index: Boolean(seo.siteUrl), follow: Boolean(seo.siteUrl) },
  icons: { icon: siteAsset("/favicon.svg"), shortcut: siteAsset("/favicon.svg") },
  openGraph: { title, description, locale: "pt_BR", type: "website", siteName: "Be Store Goiânia",
    ...(seo.siteUrl ? { url: seo.siteUrl + "/" } : {}) },
};
export const viewport: Viewport = { themeColor: "#0a0a0a", colorScheme: "dark" };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>) {
  return <html lang="pt-BR"><head><link rel="preload" href={siteAsset("/fonts/manrope.woff2")} as="font" type="font/woff2" crossOrigin="anonymous"/></head><body>{children}</body></html>;
}
