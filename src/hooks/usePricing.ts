import { useMemo } from 'react';

export function usePricing() {
  // In a real app with RevenueCat, this would fetch from the active offering.
  // We'll mock it for now based on the requested pricing.
  
  return useMemo(() => {
    // 149.24 / 52 = 2.87
    return {
      yearlyPrice: "149,24 €",
      weeklyEquivalent: "2,87 €",
      monthlyPrice: "19,99 €",
      currencySymbol: "€"
    };
  }, []);
}
