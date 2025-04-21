// Déclaration des overloads
export function formatNumber(value: number, toFixed?: number): string;
export function formatNumber(value: string, toFixed?: number): string;

// Implémentation unique
export function formatNumber(value: number | string, toFixed: number = 0): string {
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
    return "0.00%";
  }
  const percent = new Intl.NumberFormat("fr-FR", {
    style: "percent",
    maximumFractionDigits: toFixed,
  }).format(value / 100);
  return value >= 0 ? `+${percent}` : percent;
}

export const formatTransactionNumber = (number: number) => {
  return formatNumber(Math.abs(number));
}

export const formatTransactionCurrency = (number: number) => {
  return formatCurrency(Math.abs(number), 0)
}

export const isPositiveNumber = (number: number) => {
  return number >= 0;
}

export const formatCurrency = (value: number | string, toFixed: number = 0, currency: string = "XOF", currencyPrefixed: boolean = false) => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) {
    return currencyPrefixed ? currency + " 0" : "0 " + currency;
  }
  const currencyDecimal = new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    maximumFractionDigits: toFixed,
  }).format(num);

  const numberWithCurrencyPrefix = currency + " " + currencyDecimal;
  const numberWithCurrencySuffix = currencyDecimal + " " + currency;

  return currencyPrefixed ? numberWithCurrencyPrefix : numberWithCurrencySuffix;
}