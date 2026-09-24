export interface ProductImage {
  src: string;
  alt: string;
  caption: string;
  original?: string;
}
export interface Product {
  id: string;
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
    id: "referencia-iphones",
    name: "Seu mundo, em um iPhone.",
    model: null, storage: null, color: null, condition: null, price: null,
    availability: "a-confirmar", illustrative: true,
    description: "Para registrar, criar e estar perto. Converse com a equipe e encontre o modelo que faz sentido para a sua rotina.",
    images: [
      { src: "/images/iphones.webp", alt: "Três iPhones prateados apresentados na mão, em ambiente da loja", caption: "Foto fornecida, com tratamento criativo por IA.", original: "/images/iphones-original.webp" },
      { src: "/images/iphones-original.webp", alt: "Foto original dos três iPhones, sem tratamento generativo", caption: "Foto original fornecida pela loja." }
    ],
  },
  {
    id: "referencia-ipad",
    name: "Mais espaço para suas ideias.",
    model: null, storage: null, color: null, condition: null, price: null,
    availability: "a-confirmar", illustrative: true,
    description: "Trabalho, estudo e criatividade em novas possibilidades. Consulte a equipe sobre iPads e acessórios.",
    images: [
      { src: "/images/ipad.webp", alt: "Tablet com teclado preto sobre mesa clara, ao lado de uma planta", caption: "Foto fornecida, com tratamento criativo por IA.", original: "/images/ipad-original.webp" },
      { src: "/images/ipad-original.webp", alt: "Foto original do tablet com teclado ao lado da planta", caption: "Foto original fornecida pela loja." }
    ],
  },
];
export const gallery: ProductImage[] = [
  catalog[0].images[0], catalog[1].images[0],
  { src: "/images/camera-macro.webp", alt: "Detalhe de lentes e acabamento prateado de um smartphone", caption: "" },
  { src: "/images/hero-smartphone.webp", alt: "Smartphone prateado em composição de estúdio sobre fundo preto", caption: "" },
];
