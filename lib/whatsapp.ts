import type { Product } from "@/lib/catalog";

export const VISITOR_NAME_KEY = "be-store-visitor-name-v1";
const WHATSAPP_NUMBER = "556241030303";

export function normalizeVisitorName(value: string) {
  return value.trim().replace(/\s+/g, " ").slice(0, 40);
}

export function isValidVisitorName(value: string) {
  const name = normalizeVisitorName(value);
  return /^[\p{L}][\p{L}\p{M}'’ -]{1,39}$/u.test(name);
}

export function buildWhatsAppMessage(name: string, product?: Product | null) {
  const visitor = normalizeVisitorName(name) || "visitante";
  if (!product) {
    return `Olá! Meu nome é ${visitor} e gostaria de conhecer melhor as opções disponíveis na Be Store.`;
  }

  const details = [product.model || product.label];
  if (product.color) details.push(`cor ${product.color}`);
  if (product.storage) details.push(`capacidade ${product.storage}`);
  return `Olá! Meu nome é ${visitor} e tenho interesse em ${details.join(", ")}. Gostaria de conhecer as opções disponíveis.`;
}

export function buildWhatsAppHref(name: string, product?: Product | null) {
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(buildWhatsAppMessage(name, product))}`;
}
