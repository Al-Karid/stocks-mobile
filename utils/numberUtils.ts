export const formatNumber = (number: number) => {
  return new Intl.NumberFormat("fr-FR").format(number);
};
