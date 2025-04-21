// Déclaration des overloads
export function formatNumber(value: number): string;
export function formatNumber(value: string): string;

// Implémentation unique
export function formatNumber(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) {
    return "0.00";
  }
  return new Intl.NumberFormat("fr-FR").format(num);
}

export const formatPercentage = (value: number, toFixed: number = 1) => {
  if (isNaN(value)) {
    return "0.00%";
  }
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    maximumFractionDigits: toFixed,
  }).format(value / 100);
}

export const formatTransactionNumber = (number: number) => {
  return formatNumber(Math.abs(number).toFixed(0));
}