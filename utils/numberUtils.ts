// Déclaration des overloads
export function formatNumber(value: number): string;
export function formatNumber(value: string): string;

// Implémentation unique
export function formatNumber(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("fr-FR").format(num);
}
