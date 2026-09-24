import BeStore from "@/components/be-store";
import { business } from "@/lib/business";
import seo from "@/lib/seo-config.json";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org", "@type": "ElectronicsStore",
    name: business.name, telephone: "+55-62-4103-0303",
    address: { "@type": "PostalAddress", streetAddress: business.address,
      addressLocality: "Goiânia", addressRegion: "GO", postalCode: business.postalCode, addressCountry: "BR" },
    sameAs: [business.instagram],
    ...(seo.siteUrl ? { url: seo.siteUrl } : {}),
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,"\\u003c")}}/><BeStore/></>;
}
