"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowDown, ArrowRight, ArrowLeft, Menu, X, Plus, Camera as Instagram, MessageCircle, MapPin, Phone, Star, Truck, CreditCard, Expand } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { FooterSection } from "@/components/ui/footer-section";
import { SiteIntro } from "@/components/ui/site-intro";
import TopoField from "@/components/ui/topo-field";
import { useScrollMotion } from "@/hooks/use-scroll-motion";
import { business } from "@/lib/business";
import { catalog, gallery, type Product } from "@/lib/catalog";
import { siteAsset } from "@/lib/site-path";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;
const navigation = [{href:"#selecao",label:"A seleção"},{href:"#sobre",label:"A Be Store"},{href:"#instagram",label:"Instagram"},{href:"#contato",label:"Visite a loja"}];

function Logo() {
  return <a className="logo-window" href="#inicio" aria-label="Be Store Goiânia, início"><img src={siteAsset("/images/be-store-logo.svg")} alt="Be Store" width="150" height="150"/></a>;
}
function WhatsAppLink({children,href,className="",label}:{children:React.ReactNode;href:string;className?:string;label?:string}) {
  return <a className={className} href={href} aria-label={label} {...external}>{children}</a>;
}
function ResponsivePhoto({src,alt,className="",priority=false}:{src:string;alt:string;className?:string;priority?:boolean}) {
  const resolved=siteAsset(src);
  const sourceSet=src.endsWith(".webp")?siteAsset(src.replace(".webp","-640.webp"))+" 640w, "+resolved+" 1200w":undefined;
  return <img className={className} src={resolved} srcSet={sourceSet} sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 600px" alt={alt} width="1200" height="1500" loading={priority?"eager":"lazy"} fetchPriority={priority?"high":"auto"}/>;
}

export default function BeStore() {
  const [menuOpen,setMenuOpen]=useState(false);
  const [selectedProduct,setSelectedProduct]=useState<Product|null>(null);
  const [productPhoto,setProductPhoto]=useState(0);
  const [galleryIndex,setGalleryIndex]=useState<number|null>(null);
  const [showOriginal,setShowOriginal]=useState(false);
  const [activeSection,setActiveSection]=useState("inicio");
  const [visitorName,setVisitorName]=useState("");
  const lastTrigger=useRef<HTMLButtonElement|null>(null);
  const navigationTarget=useRef<string|null>(null);
  const finishMenuNavigation=(event:Event)=>{
    const target=navigationTarget.current;
    if(!target)return;
    event.preventDefault();
    navigationTarget.current=null;
    requestAnimationFrame(()=>{
      const section=document.querySelector<HTMLElement>(target);
      history.pushState(null,"",target);
      section?.focus({preventScroll:true});
      if(section) window.scrollTo({top:window.scrollY+section.getBoundingClientRect().top-24,behavior:"instant"});
    });
  };

  useScrollMotion();

  const handleIntroComplete=useCallback((name:string)=>setVisitorName(name),[]);
  const generalWhatsApp=buildWhatsAppHref(visitorName);
  const productWhatsApp=(product:Product)=>buildWhatsAppHref(visitorName,product);

  useEffect(()=>{
    if(!("IntersectionObserver" in window))return;
    const sections=["inicio","selecao","sobre","instagram","contato"]
      .map(id=>document.getElementById(id)).filter((section):section is HTMLElement=>Boolean(section));
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(visible)setActiveSection(visible.target.id);
    },{rootMargin:"-24% 0px -58%",threshold:[0,.2,.5]});
    sections.forEach(section=>observer.observe(section));
    return ()=>observer.disconnect();
  },[]);

  const openProduct=(product:Product,button:HTMLButtonElement)=>{lastTrigger.current=button;setProductPhoto(0);setSelectedProduct(product);};
  const openGallery=(index:number,button:HTMLButtonElement)=>{lastTrigger.current=button;setShowOriginal(false);setGalleryIndex(index);};
  const moveGallery=(step:number)=>{setShowOriginal(false);setGalleryIndex(index=>index===null?null:(index+step+gallery.length)%gallery.length);};
  const restoreFocus=(event:Event)=>{event.preventDefault();lastTrigger.current?.focus();};
  const currentImage=galleryIndex===null?null:gallery[galleryIndex];

  return <>
    <TopoField className="global-fluid-field" mode="dark" speed={0.76} length={1.08} density={1.15} opacity={0.9} saturation={0} brightness={0.92} />
    <SiteIntro onComplete={handleIntroComplete} />
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <div className="announcement"><span>De Goiânia para todo o Brasil</span><span>Em até 18x no cartão*</span></div>
    <header className="site-header">
      <div className="site-header-inner wrap">
      <Logo/>
      <nav aria-label="Navegação principal">{navigation.map(item=><a key={item.href} href={item.href} aria-current={activeSection===item.href.slice(1)?"location":undefined}>{item.label}</a>)}</nav>
      <WhatsAppLink href={generalWhatsApp} className="header-contact">Vamos conversar <ArrowUpRight size={18}/></WhatsAppLink>
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}><SheetTrigger asChild><button className="icon-button mobile-menu" aria-label="Abrir menu"><Menu size={24}/></button></SheetTrigger><SheetContent className="mobile-sheet" showCloseButton={false} onCloseAutoFocus={finishMenuNavigation}>
        <SheetTitle>Be Store Goiânia</SheetTitle><SheetDescription>Explore e fale com a gente.</SheetDescription>
        <SheetClose asChild><button className="icon-button close-button" aria-label="Fechar menu"><X/></button></SheetClose>
        <nav aria-label="Navegação móvel">{navigation.map(item=><a key={item.href} href={item.href} aria-current={activeSection===item.href.slice(1)?"location":undefined} onClick={event=>{event.preventDefault();navigationTarget.current=item.href;setMenuOpen(false);}}>{item.label}</a>)}</nav>
        <WhatsAppLink href={generalWhatsApp} className="button button-light">Conversar no WhatsApp <MessageCircle size={19}/></WhatsAppLink>
      </SheetContent></Sheet>
      </div>
    </header>

    <main id="conteudo" tabIndex={-1}>
      <section className="hero wrap" id="inicio" aria-labelledby="hero-title">
        <div className="hero-copy" data-hero-group><p className="eyebrow" data-motion-item data-reveal="fade">{visitorName?`Bem-vindo, ${visitorName}.`:"Be Store Goiânia"}</p><h1 id="hero-title" aria-label="Seu próximo upgrade."><span className="title-mask"><span data-motion-item data-reveal="up">Seu próximo</span></span><span className="title-mask"><em data-motion-item data-reveal="up">upgrade.</em></span></h1><p className="hero-description" data-motion-item data-reveal="up">Novas possibilidades começam com a escolha certa. Encontre o iPhone que combina com você.</p><div data-motion-item data-reveal="up"><WhatsAppLink href={generalWhatsApp} className="button button-light">Encontre seu iPhone <ArrowUpRight size={20}/></WhatsAppLink><a className="explore-link" href="#selecao">Explore a seleção <ArrowDown size={16}/></a></div></div>
        <figure className="hero-visual" data-hero-visual data-scroll-motion="28">
          <picture>
            <img src={siteAsset("/images/hero-iphone-18-pro-max.webp")} srcSet={`${siteAsset("/images/hero-iphone-18-pro-max-640.webp")} 640w, ${siteAsset("/images/hero-iphone-18-pro-max.webp")} 1024w`} sizes="(max-width: 640px) 100vw, (max-width: 1000px) 54vw, 660px" alt="Conceito visual de iPhone 18 Pro Max em acabamento dark gray sobre fundo preto" width="1024" height="1536" loading="eager" fetchPriority="high" />
          </picture>
          <figcaption>Conceito visual fornecido; modelo e disponibilidade são confirmados pela equipe.</figcaption>
        </figure>
        <div className="hero-bottom"><span>Tecnologia para o que vem a seguir.</span><span>Goiânia, GO / Brasil</span></div>
      </section>

      <section className="benefits light-section" aria-label="Facilidades de compra"><div className="wrap benefit-grid" data-reveal-group>
        <div data-reveal-item data-reveal="left"><CreditCard size={26} strokeWidth={1.3}/><p><strong>Seu upgrade em até 18x</strong><span>Parcelamento no cartão de crédito*</span></p></div>
        <div data-reveal-item data-reveal="up"><Truck size={27} strokeWidth={1.3}/><p><strong>De Goiânia até você</strong><span>Envio para todo o Brasil</span></p></div>
        <div data-reveal-item data-reveal="right"><MessageCircle size={26} strokeWidth={1.3}/><p><strong>Uma conversa, sua escolha</strong><span>Atendimento direto pelo WhatsApp</span></p></div>
      </div></section>

      <section className="selection light-section" id="selecao" tabIndex={-1}>
        <div className="wrap">
          <div className="section-heading heading-split" data-reveal-group><div data-reveal-item data-reveal="left"><p className="eyebrow">A seleção Be Store</p><h2>O que move<br/>o seu dia?</h2></div><p data-reveal-item data-reveal="right">Para se conectar, criar ou ir mais longe.<br/>A gente ajuda você a escolher.</p></div>
          <div className="product-grid" data-reveal-group data-stagger="130">{catalog.map((product,index)=><article className={`product-card product-${index}${index===0?" product-card-featured":""}`} key={product.id} data-reveal-item data-reveal={index===0?"up":index%2?"left":"right"}>
            <button className="product-photo" onClick={event=>openProduct(product,event.currentTarget)} aria-label={"Ver detalhes: "+product.label}><ResponsivePhoto src={product.images[0].src} alt={product.images[0].alt}/><span className="photo-label">{index===0?"Referência visual · consulte a equipe":product.label}</span><span className="photo-expand"><Plus size={24}/></span></button>
            <div className="product-info"><div><p className="product-status">{index===0?"Novo conceito na seleção":product.illustrative?"Seleção ilustrativa":product.availability==="disponivel"?"Disponível para consulta":"Consulte disponibilidade"}</p><h3>{product.name}</h3><p>{product.description}</p></div><a className="text-button" href={productWhatsApp(product)} {...external}>Conhecer possibilidades <ArrowUpRight size={19}/></a></div>
          </article>)}</div>
          <div className="catalog-note"><span>Modelos, cores, valores e disponibilidade são confirmados no atendimento.</span><WhatsAppLink href={generalWhatsApp}>Consultar a equipe <ArrowUpRight size={17}/></WhatsAppLink></div>
        </div>
      </section>

      <section className="about wrap" id="sobre" tabIndex={-1} data-reveal-group>
        <div className="about-image" data-reveal-item data-reveal="left" data-scroll-motion="22"><ResponsivePhoto src="/images/camera-macro.webp" alt="Detalhe aproximado de lentes e acabamento prateado de um smartphone"/><span>Um novo olhar para cada detalhe.</span></div>
        <div className="about-copy" data-reveal-item data-reveal="right"><p className="eyebrow">Muito prazer. Somos a Be Store.</p><h2>A tecnologia muda.<br/>A conexão fica.</h2><p>Uma foto que guarda um momento. Uma ideia que sai do papel. Uma conversa que encurta a distância. A tecnologia faz parte da sua vida — e a escolha do próximo aparelho também.</p><p>Somos a Be Store Goiânia, no Setor Bueno. Nossa equipe está por aqui para conversar sobre o que você procura e apresentar as possibilidades.</p><a className="text-link" href="#contato">Conheça a loja <ArrowUpRight size={20}/></a></div>
      </section>

      <section className="reputation wrap" id="avaliacoes" aria-labelledby="reputation-title" data-reveal-group><div className="reputation-intro" data-reveal-item data-reveal="left"><p className="eyebrow">Reputação</p><h2 id="reputation-title">A experiência<br/>de quem já conhece.</h2></div><div className="rating-number" data-reveal-item data-reveal="scale"><strong>{business.reputation.score}</strong><span className="stars" aria-label="Avaliação 4,8 de 5 estrelas">{[1,2,3,4,5].map(star=><Star key={star} size={17} fill="currentColor"/>)}</span></div><div className="rating-detail" data-reveal-item data-reveal="right"><p><strong>{business.reputation.count} avaliações</strong> no Google</p><a href={business.maps} {...external} className="text-link">Leia as avaliações <ArrowUpRight size={18}/></a><small>{business.reputation.source}</small></div></section>

      <section className="social light-section" id="instagram" tabIndex={-1}><div className="wrap">
        <div className="section-heading heading-split" data-reveal-group><div data-reveal-item data-reveal="left"><p className="eyebrow">Nosso universo, mais de perto</p><h2>A próxima novidade<br/>está no seu feed.</h2></div><div className="social-copy" data-reveal-item data-reveal="right"><p>As promoções e novidades da Be Store são divulgadas no Instagram. Acompanhe para ficar por dentro.</p><a className="text-link" href={business.instagram} {...external}><Instagram size={20}/>{business.instagramHandle}<ArrowUpRight size={18}/></a></div></div>
        <div className="gallery-grid" data-reveal-group data-stagger="105">{gallery.slice(0,3).map((image,index)=><button key={image.src} className={"gallery-tile gallery-tile-"+index} onClick={event=>openGallery(index,event.currentTarget)} aria-label={"Ampliar imagem "+(index+1)+": "+image.alt} data-reveal-item data-reveal={index===0?"left":index===2?"right":"up"} data-scroll-motion={String(10+index*4)}><ResponsivePhoto src={image.src} alt={image.alt}/><span className="gallery-expand"><Expand size={20}/></span></button>)}</div>
        <div className="gallery-footer"><p>Toque nas fotos para ampliar e ver os originais disponíveis.</p><a href={business.instagram} {...external}>Ver promoções no Instagram <ArrowUpRight size={18}/></a></div>
      </div></section>

      <section className="contact" id="contato" tabIndex={-1}><div className="wrap contact-grid" data-reveal-group><div className="contact-copy" data-reveal-item data-reveal="left"><p className="eyebrow">Perto de você</p><h2>A gente se encontra<br/>no Bueno.</h2><p>Prefere ver de perto ou conversar primeiro?<br/>Escolha como quer falar com a gente.</p><WhatsAppLink href={generalWhatsApp} className="button button-light">Converse no WhatsApp <MessageCircle size={20}/></WhatsAppLink><span className="contact-subline">Combine sua visita com a nossa equipe.</span></div><div className="contact-details" data-reveal-item data-reveal="right" data-scroll-motion="16"><div className="location-heading"><MapPin size={27} strokeWidth={1.3}/><span>Be Store Goiânia</span></div><address>{business.address}<br/>{business.city}<br/><span>CEP {business.postalCode}</span></address><a className="text-link" href={business.maps} {...external}>Abrir no Google Maps <ArrowUpRight size={20}/></a><div className="contact-bottom"><a href={business.phoneHref}><Phone size={17}/>{business.phone}</a><a href={business.instagram} {...external}><Instagram size={18}/>{business.instagramHandle}</a></div></div></div></section>
    </main>

    <FooterSection whatsappHref={generalWhatsApp} />
    <WhatsAppLink href={generalWhatsApp} className="floating-contact" label="Fale com a Be Store pelo WhatsApp"><MessageCircle size={21}/><span>Fale com a Be Store</span></WhatsAppLink>

    <Dialog open={selectedProduct!==null} onOpenChange={open=>{if(!open)setSelectedProduct(null);}}>
      <DialogContent className="product-dialog" showCloseButton={false} onCloseAutoFocus={restoreFocus}>
        <DialogClose asChild><button className="icon-button close-button" aria-label="Fechar detalhes"><X/></button></DialogClose>
        {selectedProduct && <><div className={`dialog-photo${selectedProduct.id==="iphone-18-pro-reference"?" dialog-photo-contain":""}`}><img src={siteAsset(selectedProduct.images[productPhoto].src)} alt={selectedProduct.images[productPhoto].alt} width="1200" height="1500"/>{selectedProduct.images.length>1&&<div className="photo-switch">{selectedProduct.images.map((image,index)=><button key={image.src} aria-pressed={productPhoto===index} onClick={()=>setProductPhoto(index)}>{index===0?"Versão editorial":"Foto original"}</button>)}</div>}</div><div className="dialog-copy"><span className="product-status">Referência visual</span><DialogTitle className="dialog-title">{selectedProduct.name}</DialogTitle><DialogDescription className="dialog-description">{selectedProduct.description}</DialogDescription><p className="consult-text">Modelos, armazenamento, cores, condição e valores são confirmados pela equipe. As fotos não representam uma oferta ou confirmação de estoque.</p><WhatsAppLink href={productWhatsApp(selectedProduct)} className="button button-light">Consultar pelo WhatsApp <ArrowUpRight size={20}/></WhatsAppLink><p className="image-caption">{selectedProduct.images[productPhoto].caption}</p></div></>}
      </DialogContent>
    </Dialog>

    <Dialog open={galleryIndex!==null} onOpenChange={open=>{if(!open)setGalleryIndex(null);}}>
      <DialogContent className="gallery-dialog" showCloseButton={false} onCloseAutoFocus={restoreFocus} onKeyDown={event=>{if(event.key==="ArrowRight"){event.preventDefault();moveGallery(1);}if(event.key==="ArrowLeft"){event.preventDefault();moveGallery(-1);}}}>
        <DialogTitle className="sr-only">Galeria Be Store</DialogTitle><DialogDescription className="sr-only">Use as setas para navegar pelas imagens e Escape para fechar.</DialogDescription>
        <DialogClose asChild><button className="icon-button close-button" aria-label="Fechar galeria"><X/></button></DialogClose>
        {currentImage && <><figure className="lightbox-figure"><img src={siteAsset(showOriginal&&currentImage.original?currentImage.original:currentImage.src)} alt={currentImage.alt} width="1200" height="1500"/>{(showOriginal||currentImage.caption)&&<figcaption aria-live="polite">{showOriginal?"Foto original fornecida pela loja.":currentImage.caption}</figcaption>}</figure><div className="gallery-controls"><button className="icon-button" onClick={()=>moveGallery(-1)} aria-label="Imagem anterior"><ArrowLeft/></button><span aria-live="polite">{(galleryIndex??0)+1} / {gallery.length}</span>{currentImage.original&&<button className="original-toggle" onClick={()=>setShowOriginal(value=>!value)}>{showOriginal?"Ver tratamento":"Ver foto original"}</button>}<button className="icon-button" onClick={()=>moveGallery(1)} aria-label="Próxima imagem"><ArrowRight/></button></div></>}
      </DialogContent>
    </Dialog>
  </>;
}
