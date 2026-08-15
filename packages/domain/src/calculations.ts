/** Excel-parity calculations. Do not change silently — see docs/excel-mapping.md. */

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Excel CurrentBirds = Initial − Mortality (sales are not subtracted). */
export function excelCurrentBirds(initialBirds: number, totalMortality: number): number {
  return initialBirds - totalMortality;
}

/** Operational remaining used for web validation. */
export function remainingBirds(
  initialBirds: number,
  totalMortality: number,
  birdsSold: number,
): number {
  return initialBirds - totalMortality - birdsSold;
}

export function livabilityPct(initialBirds: number, totalMortality: number): number {
  if (initialBirds === 0) return 0;
  return excelCurrentBirds(initialBirds, totalMortality) / initialBirds;
}

export function mortalityPct(initialBirds: number, totalMortality: number): number {
  return 1 - livabilityPct(initialBirds, totalMortality);
}

export function daysOnFarm(placedDate: Date, asOf: Date): number {
  const placed = Date.UTC(placedDate.getFullYear(), placedDate.getMonth(), placedDate.getDate());
  const asOfUtc = Date.UTC(asOf.getFullYear(), asOf.getMonth(), asOf.getDate());
  return Math.floor((asOfUtc - placed) / 86_400_000);
}

export function feedConsumptionCost(kgUsed: number, unitCostPerKg: number): number {
  return roundMoney(kgUsed * unitCostPerKg);
}

export function feedPurchaseTotals(bags: number, bagWeightKg: number, unitCostPerBag: number): {
  totalWeightKg: number;
  totalCost: number;
} {
  return {
    totalWeightKg: bags * bagWeightKg,
    totalCost: roundMoney(bags * unitCostPerBag),
  };
}

export function feedStockBalance(purchasedKg: number, usedKg: number, openingKg = 0): number {
  return openingKg + purchasedKg - usedKg;
}

export function isLowStock(balanceKg: number, minStockKg: number): boolean {
  return balanceKg < minStockKg;
}

/** Row-level ADG from weekly weigh-in: AvgBodyWeightG / AgeDays. */
export function weeklyAdg(avgBodyWeightG: number, ageDays: number): number {
  if (ageDays === 0) return 0;
  return avgBodyWeightG / ageDays;
}

/** KPI ADG: latest average weight / days on farm. */
export function kpiAdg(latestAvgWeightG: number, days: number): number {
  if (days === 0) return 0;
  return latestAvgWeightG / days;
}

/** FCR = TotalFeedKg / (CurrentBirds * LatestAvgWeightG / 1000). Uses Excel CurrentBirds. */
export function fcr(totalFeedKg: number, currentBirds: number, latestAvgWeightG: number): number {
  const liveWeightKg = (currentBirds * latestAvgWeightG) / 1000;
  if (liveWeightKg === 0) return 0;
  return totalFeedKg / liveWeightKg;
}

export function expenseAmount(quantity: number, unitCost: number): number {
  return roundMoney(quantity * unitCost);
}

/**
 * If pricePerBird > 0, price by bird; otherwise price by live weight.
 * Then add transport. Excel: ROUND(IF(H>0, E*H, F*G)+I, 2)
 */
export function saleTotalValue(input: {
  birdsDispatched: number;
  liveWeightKg: number;
  pricePerKg: number;
  pricePerBird: number;
  transportCost: number;
}): number {
  const base =
    input.pricePerBird > 0
      ? input.birdsDispatched * input.pricePerBird
      : input.liveWeightKg * input.pricePerKg;
  return roundMoney(base + input.transportCost);
}

export function outstandingBalance(totalValue: number, amountPaid: number): number {
  return totalValue - amountPaid;
}

export function medicineBalance(received: number, used: number): number {
  return received - used;
}

export function medicineLotCost(received: number, unitCost: number): number {
  return roundMoney(received * unitCost);
}

export type MedicineExpiryStatus = "EXPIRED" | "EXPIRING SOON" | "OK";

export function medicineExpiryStatus(
  expiryDate: Date,
  today: Date,
  warningDays: number,
): MedicineExpiryStatus {
  const expiry = Date.UTC(expiryDate.getFullYear(), expiryDate.getMonth(), expiryDate.getDate());
  const asOf = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const daysLeft = Math.floor((expiry - asOf) / 86_400_000);
  if (daysLeft < 0) return "EXPIRED";
  if (daysLeft <= warningDays) return "EXPIRING SOON";
  return "OK";
}

export function totalProductionCost(expenses: number, feedCost: number, medicineCost: number): number {
  return expenses + feedCost + medicineCost;
}

export function costPerBird(totalCost: number, initialBirds: number): number {
  if (initialBirds === 0) return 0;
  return totalCost / initialBirds;
}

export function costPerKg(
  totalCost: number,
  currentBirds: number,
  latestAvgWeightG: number,
): number {
  const liveWeightKg = (currentBirds * latestAvgWeightG) / 1000;
  if (liveWeightKg === 0) return 0;
  return totalCost / liveWeightKg;
}

export function estimatedProfit(
  salesValue: number,
  expenses: number,
  feedCost: number,
  medicineCost: number,
): number {
  return salesValue - expenses - feedCost - medicineCost;
}

export function breakEvenPricePerBird(totalCost: number, birdsSold: number, initialBirds: number): number {
  const denom = birdsSold > 0 ? birdsSold : initialBirds;
  if (denom === 0) return 0;
  return totalCost / denom;
}

export type FlockAlert = "livability" | "fcr" | "ok" | "inactive";

export function flockAlert(input: {
  status: string;
  livability: number;
  fcrValue: number;
  targetLivabilityPct: number;
  targetFcr: number;
}): FlockAlert {
  if (input.status !== "Active") return "inactive";
  if (input.livability < input.targetLivabilityPct) return "livability";
  if (input.fcrValue > input.targetFcr) return "fcr";
  return "ok";
}

export function flockAlertMessage(alert: FlockAlert): string {
  switch (alert) {
    case "livability":
      return "Livability below target - investigate mortality";
    case "fcr":
      return "FCR above target - review feed efficiency";
    case "ok":
      return "Within normal range";
    case "inactive":
      return "";
  }
}

export function mortalityExceedsRemaining(
  initialBirds: number,
  mortalitySoFar: number,
  birdsSold: number,
  newCount: number,
): boolean {
  return newCount > remainingBirds(initialBirds, mortalitySoFar, birdsSold);
}

export function nextCode(prefix: string, existingCodes: string[]): string {
  let maxN = 0;
  for (const code of existingCodes) {
    if (!code.startsWith(`${prefix}-`)) continue;
    const n = Number.parseInt(code.slice(prefix.length + 1), 10);
    if (Number.isFinite(n) && n > maxN) maxN = n;
  }
  return `${prefix}-${String(maxN + 1).padStart(4, "0")}`;
}
