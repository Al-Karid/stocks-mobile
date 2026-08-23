// services/gaugeService.ts

/** Bright azure used for the gauge + gain accents once the target has been reached */
export const REACHED_BAR_COLOR = "#30AFFF";
export const REACHED_GAIN_STRONG_COLOR = "#0284c7";
export const REACHED_GAIN_LIGHT_BG = "#f0f9ff";
export const REACHED_GAIN_BADGE_BG = "#e0f2fe";

export interface GaugeMetrics {
  /** Width (%) of the CMP→current segment (green/red) */
  leftSegmentWidth: number;
  /** Width (%) of the current→target segment (gray) */
  rightSegmentWidth: number;
  /** True when the current price is at or above the average price (gain) */
  cmpToCurrentIsPositive: boolean;
  /** True when the target price is still ahead of the current price */
  currentToTargetIsPositive: boolean;
  /** True when the current price has reached (or exceeded) the target price */
  isTargetReached: boolean;
  /** Solid bar color when the target has been reached */
  reachedBarColor: string;
  /** Track color of the CMP→current segment */
  cmpTrackColor: string;
  /** Track color of the current→target segment */
  targetTrackColor: string;
  /** Chip background color of the CMP→current segment */
  cmpChipBg: string;
  /** Chip text color of the CMP→current segment */
  cmpChipColor: string;
  /** Chip background color of the current→target segment */
  targetChipBg: string;
  /** Chip text color of the current→target segment */
  targetChipColor: string;
}

/**
 * Pure gauge computation for the holding card's price bar.
 * Returns the two segment widths (as percentages of the full track) and the
 * derived colors, so the component only has to render them.
 */
export const useGaugeService = () => {
  const computeGaugeMetrics = (
    averagePrice: number,
    currentPrice: number,
    targetPrice: number | null
  ): GaugeMetrics => {
    const hasTarget = targetPrice != null;

    // Position the current price on a scale from CMP (left) to target (right)
    const cmpToCurrentAbs = Math.abs(currentPrice - averagePrice);
    const currentToTargetAbs = hasTarget ? Math.abs(targetPrice! - currentPrice) : 0;
    const totalSpan = cmpToCurrentAbs + currentToTargetAbs;
    let leftSegmentWidth = totalSpan > 0 ? (cmpToCurrentAbs / totalSpan) * 100 : 0;
    let rightSegmentWidth = totalSpan > 0 ? (currentToTargetAbs / totalSpan) * 100 : 0;

    // Target reached or exceeded -> fill the whole bar with the CMP→current segment.
    // Handles both bullish targets (current >= target) and bearish targets (current <= target).
    const isTargetReached =
      hasTarget &&
      ((targetPrice! >= averagePrice && currentPrice >= targetPrice!) ||
        (targetPrice! < averagePrice && currentPrice <= targetPrice!));

    if (isTargetReached) {
      leftSegmentWidth = 100;
      rightSegmentWidth = 0;
    }

    const cmpToCurrentIsPositive = currentPrice >= averagePrice;
    const currentToTargetIsPositive = hasTarget && targetPrice! >= currentPrice;

    return {
      leftSegmentWidth,
      rightSegmentWidth,
      cmpToCurrentIsPositive,
      currentToTargetIsPositive,
      isTargetReached,
      reachedBarColor: REACHED_BAR_COLOR,
      targetTrackColor: currentToTargetIsPositive ? "#9ca3af" : "#d1d5db",
      targetChipBg: currentToTargetIsPositive ? "#f3f4f6" : "#f9fafb",
      targetChipColor: currentToTargetIsPositive ? "#6b7280" : "#9ca3af",
      cmpTrackColor: cmpToCurrentIsPositive ? "#22c55e" : "#ef4444",
      cmpChipBg: cmpToCurrentIsPositive ? "#dcfce7" : "#fce4ec",
      cmpChipColor: cmpToCurrentIsPositive ? "#16a34a" : "#dc2626",
    };
  };

  return { computeGaugeMetrics };
};
