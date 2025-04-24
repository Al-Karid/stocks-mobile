export const useConputeService = () => {
  const computeRealPricePerShare = (
    pricePerShare: number,
    fees: number
  ): number => {
    return pricePerShare + (pricePerShare * fees) / 100;
  };

  const computeTotalCost = (
    quantity: number,
    realPricePerShare: number
  ): number => {
    return quantity * realPricePerShare;
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  return {
    computeRealPricePerShare,
    computeTotalCost,
    calculatePercentageChange,
  };
};
