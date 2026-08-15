import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  breakEvenPricePerBird,
  costPerBird,
  costPerKg,
  daysOnFarm,
  excelCurrentBirds,
  estimatedProfit,
  expenseAmount,
  fcr,
  feedConsumptionCost,
  feedPurchaseTotals,
  feedStockBalance,
  flockAlert,
  flockAlertMessage,
  kpiAdg,
  livabilityPct,
  medicineBalance,
  medicineExpiryStatus,
  medicineLotCost,
  mortalityExceedsRemaining,
  mortalityPct,
  nextCode,
  remainingBirds,
  roundMoney,
  saleTotalValue,
  weeklyAdg,
} from "../src/calculations.ts";

describe("flock quantity", () => {
  it("creates current birds as initial minus mortality (Excel)", () => {
    assert.equal(excelCurrentBirds(5000, 24), 4976);
  });

  it("rejects invalid initial of zero livability", () => {
    assert.equal(livabilityPct(0, 0), 0);
  });

  it("computes remaining after sales for operational stock", () => {
    assert.equal(remainingBirds(5000, 50, 4950), 0);
  });
});

describe("mortality", () => {
  it("accepts mortality within remaining birds", () => {
    assert.equal(mortalityExceedsRemaining(5000, 20, 0, 10), false);
  });

  it("rejects mortality that exceeds remaining birds", () => {
    assert.equal(mortalityExceedsRemaining(5000, 20, 0, 4981), true);
  });

  it("subtracts prior sales from remaining (web integrity)", () => {
    assert.equal(mortalityExceedsRemaining(5000, 20, 4970, 15), true);
    assert.equal(mortalityExceedsRemaining(5000, 20, 4970, 10), false);
  });

  it("matches Excel livability and mortality %", () => {
    assert.ok(Math.abs(livabilityPct(5000, 250) - 0.95) < 1e-10);
    assert.ok(Math.abs(mortalityPct(5000, 250) - 0.05) < 1e-10);
  });
});

describe("feed", () => {
  it("costs consumption from master unit cost, not purchase price", () => {
    assert.equal(feedConsumptionCost(600, 12.5), 7500);
  });

  it("computes purchase totals from bags", () => {
    assert.deepEqual(feedPurchaseTotals(64, 50, 625), { totalWeightKg: 3200, totalCost: 40000 });
  });

  it("increases stock on purchase and decreases on usage", () => {
    assert.equal(feedStockBalance(3200, 0), 3200);
    assert.equal(feedStockBalance(3200, 600), 2600);
  });

  it("does not allow a negative balance in the derived formula without extra usage", () => {
    assert.equal(feedStockBalance(100, 100), 0);
    assert.equal(feedStockBalance(100, 101), -1);
  });
});

describe("sales", () => {
  it("prices by live weight when price per bird is 0 (Excel SALE-0001)", () => {
    assert.equal(
      saleTotalValue({
        birdsDispatched: 3000,
        liveWeightKg: 6750,
        pricePerKg: 42.5,
        pricePerBird: 0,
        transportCost: 350,
      }),
      287225,
    );
  });

  it("prices by bird when price per bird is greater than 0", () => {
    assert.equal(
      saleTotalValue({
        birdsDispatched: 100,
        liveWeightKg: 200,
        pricePerKg: 40,
        pricePerBird: 90,
        transportCost: 50,
      }),
      9050,
    );
  });

  it("rejects a sale that exceeds remaining birds", () => {
    const remaining = remainingBirds(5000, 50, 0);
    assert.equal(remaining, 4950);
    assert.equal(4960 > remaining, true);
    assert.equal(4950 > remaining, false);
  });
});

describe("weights / FCR / ADG", () => {
  it("computes weekly ADG as weight / age days", () => {
    assert.ok(Math.abs(weeklyAdg(180, 7) - 180 / 7) < 1e-10);
  });

  it("computes KPI ADG as latest weight / days on farm", () => {
    assert.ok(Math.abs(kpiAdg(2400, 42) - 2400 / 42) < 1e-10);
  });

  it("computes FCR from feed kg over live weight of current birds", () => {
    assert.ok(Math.abs(fcr(8400, 4976, 2400) - 8400 / ((4976 * 2400) / 1000)) < 1e-10);
  });

  it("returns 0 FCR when live weight is 0", () => {
    assert.equal(fcr(100, 0, 2400), 0);
    assert.equal(fcr(100, 100, 0), 0);
  });

  it("counts days on farm as Excel TODAY - placed", () => {
    assert.equal(daysOnFarm(new Date(2026, 4, 20), new Date(2026, 6, 1)), 42);
  });
});

describe("profitability", () => {
  it("computes expense amount as qty * unit cost", () => {
    assert.equal(expenseAmount(5000, 4.5), 22500);
  });

  it("excludes other income from estimated profit (Excel)", () => {
    assert.equal(estimatedProfit(287225, 22500, 7500, 600), 256625);
  });

  it("computes cost per bird on initial placement", () => {
    assert.ok(Math.abs(costPerBird(30600, 5000) - 6.12) < 1e-10);
  });

  it("computes cost per kg on Excel current birds live weight", () => {
    assert.ok(Math.abs(costPerKg(30600, 4976, 2400) - 30600 / ((4976 * 2400) / 1000)) < 1e-10);
  });

  it("uses birds sold for break-even when sales exist", () => {
    assert.ok(Math.abs(breakEvenPricePerBird(30600, 4950, 5000) - 30600 / 4950) < 1e-10);
    assert.ok(Math.abs(breakEvenPricePerBird(30600, 0, 5000) - 6.12) < 1e-10);
  });
});

describe("medicine", () => {
  it("balances received minus used", () => {
    assert.equal(medicineBalance(1000, 350), 650);
  });

  it("costs the received quantity", () => {
    assert.equal(medicineLotCost(500, 1.2), 600);
  });

  it("flags expiry using MedicineExpiryWarningDays = 30", () => {
    const today = new Date(2026, 7, 15);
    assert.equal(medicineExpiryStatus(new Date(2026, 6, 1), today, 30), "EXPIRED");
    assert.equal(medicineExpiryStatus(new Date(2026, 8, 1), today, 30), "EXPIRING SOON");
    assert.equal(medicineExpiryStatus(new Date(2027, 2, 1), today, 30), "OK");
  });
});

describe("dashboard alerts", () => {
  it("alerts on livability before FCR", () => {
    assert.equal(
      flockAlertMessage(
        flockAlert({
          status: "Active",
          livability: 0.94,
          fcrValue: 2,
          targetLivabilityPct: 0.95,
          targetFcr: 1.7,
        }),
      ),
      "Livability below target - investigate mortality",
    );
  });

  it("alerts on FCR when livability is on target", () => {
    assert.equal(
      flockAlertMessage(
        flockAlert({
          status: "Active",
          livability: 0.97,
          fcrValue: 1.8,
          targetLivabilityPct: 0.95,
          targetFcr: 1.7,
        }),
      ),
      "FCR above target - review feed efficiency",
    );
  });

  it("skips closed flocks", () => {
    assert.equal(
      flockAlert({
        status: "Closed",
        livability: 0.5,
        fcrValue: 3,
        targetLivabilityPct: 0.95,
        targetFcr: 1.7,
      }),
      "inactive",
    );
  });
});

describe("IDs and money", () => {
  it("pads the next Excel-style code", () => {
    assert.equal(nextCode("FLK", ["FLK-001", "FLK-004"]), "FLK-0005");
    assert.equal(nextCode("MORT", []), "MORT-0001");
  });

  it("rounds money the way Excel ROUND(...,2) does for these values", () => {
    assert.equal(roundMoney(42.5 * 6750 + 350), 287225);
  });
});
