// Déclaration des overloads
export function formatNumber(value: number, toFixed?: number): string;
export function formatNumber(value: string, toFixed?: number): string;

// Implémentation unique
export function formatNumber(value: number | string, toFixed: number = 1): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) {
    return "0.00";
  }
  return new Intl.NumberFormat("fr-FR",
    {
      maximumFractionDigits: toFixed,
    }
  ).format(num);
}

export const formatPercentage = (value: number, toFixed: number = 1) => {
  if (isNaN(value)) {
    return "0.0%";
  }
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    maximumFractionDigits: toFixed,
  }).format(value / 100);
}

export const formatTransactionNumber = (number: number) => {
  return formatNumber(Math.abs(number));
}

export const isPositiveNumber = (number: number) => {
  return number >= 0;
}