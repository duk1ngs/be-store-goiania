import {
  ArrowUp,
  ArrowUpRight,
  Camera,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { business } from "@/lib/business";
import { siteAsset } from "@/lib/site-path";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

const columns = [
  {
    title: "Produtos",
    links: [
      { label: "iPhones", href: "#selecao" },
      { label: "iPads e acessórios", href: "#selecao" },
      { label: "Ver a seleção", href: "#selecao" },
    ],
  },
  {
    title: "Institucional",
    links: [
      { label: "A Be Store", href: "#sobre" },
      { label: "Avaliações", href: "#avaliacoes" },
      { label: "Visite a loja", href: "#contato" },
    ],
  },
] as const;

export function FooterSection({ whatsappHref }: { whatsappHref: string }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" data-reveal-group data-stagger="82">
      <div className="site-footer-glow" aria-hidden="true" />
      <div className="wrap site-footer-inner">
        <div className="site-footer-lead" data-reveal-item data-reveal="left">
          <a className="footer-logo" href="#inicio" aria-label="Be Store Goiânia, início">
            <img src={siteAsset("/images/be-store-logo.svg")} alt="Be Store" width="150" height="150" />
          </a>
          <p className="eyebrow">Be Store Goiânia</p>
          <h2>Seu próximo upgrade<br />começa com uma conversa.</h2>
          <p>Atendimento direto para encontrar o aparelho que combina com a sua rotina.</p>
          <a className="button button-light" href={whatsappHref} {...external}>
            Falar no WhatsApp <MessageCircle size={19} />
          </a>
        </div>

        <div className="site-footer-links">
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title} data-reveal-item data-reveal="up">
              <h3>{column.title}</h3>
              {column.links.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}
            </nav>
          ))}

          <nav aria-label="Atendimento" data-reveal-item data-reveal="up">
            <h3>Atendimento</h3>
            <a href={whatsappHref} {...external}><MessageCircle size={16} /> WhatsApp</a>
            <a href={business.phoneHref}><Phone size={16} /> {business.phone}</a>
            <a href={business.maps} {...external}><MapPin size={16} /> Como chegar</a>
          </nav>

          <nav aria-label="Redes sociais" data-reveal-item data-reveal="right">
            <h3>Redes sociais</h3>
            <a href={business.instagram} {...external}><Camera size={16} /> {business.instagramHandle}</a>
          </nav>
        </div>

        <a className="site-footer-instagram" href={business.instagram} {...external} data-reveal-item data-reveal="fade">
          Acompanhe novidades e promoções no Instagram
          <ArrowUpRight size={18} />
        </a>

        <div className="site-footer-bottom" data-reveal-item data-reveal="up">
          <p>© {currentYear} Be Store Goiânia.</p>
          <p>*Parcelamento em até 18 vezes no cartão de crédito. Consulte taxas, bandeiras, envio e condições com a equipe.</p>
          <a href="#inicio">Voltar ao topo <ArrowUp size={16} /></a>
        </div>
      </div>
    </footer>
  );
}
