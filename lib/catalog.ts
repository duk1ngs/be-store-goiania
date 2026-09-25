export interface ProductImage {
  src: string;
  alt: string;
  caption: string;
  original?: string;
}
export interface Product {
  id: string;
  label: string;
  name: string;
  model: string | null;
  storage: string | null;
  color: string | null;
  condition: "novo" | "seminovo" | null;
  price: number | null;
  availability: "a-confirmar" | "disponivel" | "indisponivel";
  images: ProductImage[];
  description: string;
  illustrative: boolean;
}
// Referências visuais, não SKUs, ofertas ou confirmação de estoque.
// Substitua por dados fornecidos e confirmados pela loja antes de anunciar produtos.
export const catalog: Product[] = [
  {
    id: "iphone-18-pro-reference",
    label: "iPhone 18 Pro",
    name: "iPhone 18 Pro",
    model: "iPhone 18 Pro", storage: null, color: null, condition: null, price: null,
    availability: "a-confirmar", illustrative: true,
    description: "Uma referência visual enviada para a Be Store. Consulte a equipe para confirmar modelo, cores, lançamento e disponibilidade.",
    images: [
      { src: "/images/iphone-18-pro-reference.png", alt: "Referência visual de quatro aparelhos em acabamentos escuro, claro, vinho e azul", caption: "Conceito visual fornecido; modelo, cores e disponibilidade não confirmados." }
    ],
  },
  {
    id: "referencia-iphones",
    label: "iPhones",
    name: "Seu mundo, em um iPhone.",
    model: null, storage: null, color: null, condition: null, price: null,
    availability: "a-confirmar", illustrative: true,
    description: "Para registrar, criar e estar perto. Converse com a equipe e encontre o modelo que faz sentido para a sua rotina.",
    images: [
      { src: "/images/iphones.webp", alt: "Três iPhones prateados apresentados na mão, em ambiente da loja", caption: "Imagem editorial preparada a partir de foto fornecida pela loja.", original: "/images/iphones-original.webp" },
      { src: "/images/iphones-original.webp", alt: "Foto original dos três iPhones", caption: "Foto original fornecida pela loja." }
    ],
  },
  {
    id: "referencia-ipad",
    label: "iPads & acessórios",
    name: "Mais espaço para suas ideias.",
    model: null, storage: null, color: null, condition: null, price: null,
    availability: "a-confirmar", illustrative: true,
    description: "Trabalho, estudo e criatividade em novas possibilidades. Consulte a equipe sobre iPads e acessórios.",
    images: [
      { src: "/images/ipad.webp", alt: "Tablet com teclado preto sobre mesa clara, ao lado de uma planta", caption: "Imagem editorial preparada a partir de foto fornecida pela loja.", original: "/images/ipad-original.webp" },
      { src: "/images/ipad-original.webp", alt: "Foto original do tablet com teclado ao lado da planta", caption: "Foto original fornecida pela loja." }
    ],
  },
];
export const gallery: ProductImage[] = [
  catalog[1].images[0], catalog[2].images[0],
  { src: "/images/camera-macro.webp", alt: "Detalhe de lentes e acabamento prateado de um smartphone", caption: "" },
  { src: "/images/hero-smartphone.webp", alt: "Smartphone prateado em composição de estúdio sobre fundo preto", caption: "" },
];
