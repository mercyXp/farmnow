"use server";

import {
  dailyRoutineCreateSchema,
  environmentCreateSchema,
  expenseCreateSchema,
  feedConsumptionCreateSchema,
  feedPurchaseCreateSchema,
  healthCreateSchema,
  medicineLotCreateSchema,
  mortalityCreateSchema,
  otherIncomeCreateSchema,
  saleCreateSchema,
  weeklyWeightCreateSchema,
} from "@farmnow/domain";
import { nextCode, writeAudit } from "@/lib/audit";
import { requirePermission } from "@/lib/supabase/server";
import { publicError } from "@/lib/utils";
import type { Permission } from "@farmnow/domain";

type Result = { ok: true } | { ok: false; error: string };

async function run(
  entity:
    | "mortality_entries"
    | "feed_consumption"
    | "feed_purchases"
    | "weekly_weights"
    | "health_entries"
    | "medicine_lots"
    | "sales"
    | "expenses"
    | "other_income"
    | "daily_routines"
    | "environment_readings",
  prefix: string,
  payload: Record<string, unknown>,
  permission: Permission | Permission[],
): Promise<Result> {
  try {
    const { supabase, user } = await requirePermission(
      ...(Array.isArray(permission) ? permission : [permission]),
    );
    const code = await nextCode(supabase, prefix);
    const { error, data } = await supabase
      .from(entity)
      .insert({ ...payload, code, created_by: user.id } as never)
      .select("id")
      .single();
    if (error) throw error;
    await writeAudit(supabase, user, { action: "create", entityType: entity, entityId: data.id, newData: payload });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: publicError(error) };
  }
}

const d = (v: Date) => v.toISOString().slice(0, 10);

export async function createMortality(input: unknown): Promise<Result> {
  const p = mortalityCreateSchema.parse(input);
  return run(
    "mortality_entries",
    "MORT",
    {
      flock_id: p.flockId,
      entry_date: d(p.entryDate),
      mortality_count: p.mortalityCount,
      cause: p.cause,
    },
    "recordMortality",
  );
}

export async function createFeedConsumption(input: unknown): Promise<Result> {
  const p = feedConsumptionCreateSchema.parse(input);
  return run(
    "feed_consumption",
    "FEED",
    {
      flock_id: p.flockId,
      feed_type_id: p.feedTypeId,
      entry_date: d(p.entryDate),
      kg_used: p.kgUsed,
    },
    "recordFeedUsage",
  );
}

export async function createFeedPurchase(input: unknown): Promise<Result> {
  const p = feedPurchaseCreateSchema.parse(input);
  return run(
    "feed_purchases",
    "FPO",
    {
      purchase_date: d(p.purchaseDate),
      supplier_id: p.supplierId,
      feed_type_id: p.feedTypeId,
      number_of_bags: p.numberOfBags,
      bag_weight_kg: p.bagWeightKg,
      unit_cost_per_bag: p.unitCostPerBag,
      invoice_no: p.invoiceNo,
      payment_method: p.paymentMethod,
    },
    "recordFeedPurchase",
  );
}

export async function createWeeklyWeight(input: unknown): Promise<Result> {
  const p = weeklyWeightCreateSchema.parse(input);
  return run(
    "weekly_weights",
    "WGT",
    {
      flock_id: p.flockId,
      entry_date: d(p.entryDate),
      week_no: p.weekNo,
      sample_size: p.sampleSize,
      avg_body_weight_g: p.avgBodyWeightG,
    },
    ["recordMortality", "recordFeedUsage", "recordMedicine"],
  );
}

export async function createHealth(input: unknown): Promise<Result> {
  const p = healthCreateSchema.parse(input);
  return run(
    "health_entries",
    "HLTH",
    {
      flock_id: p.flockId,
      product_id: p.productId,
      entry_date: d(p.entryDate),
      dosage_given: p.dosageGiven,
      route: p.route,
    },
    "recordMedicine",
  );
}

export async function createMedicineLot(input: unknown): Promise<Result> {
  const p = medicineLotCreateSchema.parse(input);
  return run(
    "medicine_lots",
    "MED",
    {
      flock_id: p.flockId,
      product_id: p.productId,
      supplier_id: p.supplierId,
      lot_number: p.lotNumber,
      expiry_date: d(p.expiryDate),
      quantity_received: p.quantityReceived,
      quantity_used: p.quantityUsed,
      unit_cost: p.unitCost,
    },
    "recordMedicine",
  );
}

export async function createSale(input: unknown): Promise<Result> {
  const p = saleCreateSchema.parse(input);
  return run(
    "sales",
    "SALE",
    {
      flock_id: p.flockId,
      customer_id: p.customerId,
      entry_date: d(p.entryDate),
      birds_dispatched: p.birdsDispatched,
      live_weight_kg: p.liveWeightKg,
      price_per_kg: p.pricePerKg,
      price_per_bird: p.pricePerBird,
      transport_cost: p.transportCost,
      amount_paid: p.amountPaid,
      invoice_no: p.invoiceNo,
    },
    "recordSale",
  );
}

export async function createExpense(input: unknown): Promise<Result> {
  const p = expenseCreateSchema.parse(input);
  return run(
    "expenses",
    "EXP",
    {
      flock_id: p.flockId,
      supplier_id: p.supplierId,
      entry_date: d(p.entryDate),
      category: p.category,
      quantity: p.quantity,
      unit_cost: p.unitCost,
      payment_method: p.paymentMethod,
      payment_ref: p.paymentRef,
      approved_by: p.approvedBy,
    },
    "recordExpense",
  );
}

export async function createOtherIncome(input: unknown): Promise<Result> {
  const p = otherIncomeCreateSchema.parse(input);
  return run(
    "other_income",
    "INC",
    {
      entry_date: d(p.entryDate),
      source: p.source,
      description: p.description,
      amount: p.amount,
      payment_method: p.paymentMethod,
      received_by: p.receivedBy,
    },
    "recordIncome",
  );
}

export async function createRoutine(input: unknown): Promise<Result> {
  const p = dailyRoutineCreateSchema.parse(input);
  return run(
    "daily_routines",
    "RTN",
    {
      flock_id: p.flockId,
      employee_id: p.employeeId,
      entry_date: d(p.entryDate),
      temperature_c: p.temperatureC,
      humidity_pct: p.humidityPct,
      water_available: p.waterAvailable,
      feed_available: p.feedAvailable,
      drinkers_cleaned: p.drinkersCleaned,
      litter_condition: p.litterCondition,
      ventilation: p.ventilation,
      sick_birds_observed: p.sickBirdsObserved,
      notes: p.notes,
    },
    "recordRoutine",
  );
}

export async function createEnvironment(input: unknown): Promise<Result> {
  const p = environmentCreateSchema.parse(input);
  return run(
    "environment_readings",
    "ENV",
    {
      house_id: p.houseId,
      entry_date: d(p.entryDate),
      reading_time: p.readingTime,
      temperature_c: p.temperatureC,
      humidity_pct: p.humidityPct,
      ammonia_ppm: p.ammoniaPpm,
    },
    "recordEnvironment",
  );
}
