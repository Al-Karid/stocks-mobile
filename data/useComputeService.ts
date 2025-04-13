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

  return {
    computeRealPricePerShare,
    computeTotalCost,
  };
};
