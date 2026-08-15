"use server";

import { ZodError } from "zod";
import {
  dailyRoutineCreateSchema,
  dailyRoutineUpdateSchema,
  deactivateEntrySchema,
  environmentCreateSchema,
  environmentUpdateSchema,
  expenseCreateSchema,
  expenseUpdateSchema,
  feedConsumptionCreateSchema,
  feedConsumptionUpdateSchema,
  feedPurchaseCreateSchema,
  feedPurchaseUpdateSchema,
  healthCreateSchema,
  healthUpdateSchema,
  medicineLotCreateSchema,
  medicineLotUpdateSchema,
  mortalityCreateSchema,
  mortalityUpdateSchema,
  otherIncomeCreateSchema,
  otherIncomeUpdateSchema,
  saleCreateSchema,
  saleUpdateSchema,
  weeklyWeightCreateSchema,
  weeklyWeightUpdateSchema,
} from "@farmnow/domain";
import { nextCode, writeAudit } from "@/lib/audit";
import { requirePermission } from "@/lib/supabase/server";
import { publicError } from "@/lib/utils";
import type { Permission } from "@farmnow/domain";
import { revalidatePath } from "next/cache";

type Result = { ok: true } | { ok: false; error: string };
type Entity =
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
  | "environment_readings";

function fail(error: unknown): Result {
  if (error instanceof ZodError) {
    return { ok: false, error: error.issues[0]?.message ?? "Invalid input." };
  }
  return { ok: false, error: publicError(error) };
}

const d = (v: Date) => v.toISOString().slice(0, 10);

async function insert(
  entity: Entity,
  prefix: string,
  payload: Record<string, unknown>,
  permission: Permission | Permission[],
): Promise<Result> {
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
  revalidatePath("/");
  return { ok: true };
}

async function patch(
  entity: Entity,
  id: string,
  payload: Record<string, unknown>,
): Promise<Result> {
  const { supabase, user } = await requirePermission("editTransactions");
  const { data: before } = await supabase.from(entity).select("*").eq("id", id).single();
  const { error } = await supabase.from(entity).update(payload as never).eq("id", id);
  if (error) throw error;
  await writeAudit(supabase, user, {
    action: "update",
    entityType: entity,
    entityId: id,
    oldData: before,
    newData: payload,
  });
  revalidatePath("/");
  return { ok: true };
}

export async function deactivateEntry(input: unknown): Promise<Result> {
  try {
    const parsed = deactivateEntrySchema.parse(input);
    const { supabase, user } = await requirePermission("deleteTransactions");
    const { data: before } = await supabase.from(parsed.table).select("*").eq("id", parsed.id).single();
    const { error } = await supabase.from(parsed.table).update({ is_active: false }).eq("id", parsed.id);
    if (error) throw error;
    await writeAudit(supabase, user, {
      action: "delete",
      entityType: parsed.table,
      entityId: parsed.id,
      oldData: before,
      newData: { is_active: false },
    });
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function createMortality(input: unknown): Promise<Result> {
  try {
    const p = mortalityCreateSchema.parse(input);
    return await insert("mortality_entries", "MORT", {
      flock_id: p.flockId,
      entry_date: d(p.entryDate),
      mortality_count: p.mortalityCount,
      cause: p.cause,
    }, "recordMortality");
  } catch (error) {
    return fail(error);
  }
}

export async function updateMortality(input: unknown): Promise<Result> {
  try {
    const p = mortalityUpdateSchema.parse(input);
    return await patch("mortality_entries", p.id, {
      flock_id: p.flockId,
      entry_date: d(p.entryDate),
      mortality_count: p.mortalityCount,
      cause: p.cause,
    });
  } catch (error) {
    return fail(error);
  }
}

export async function createFeedConsumption(input: unknown): Promise<Result> {
  try {
    const p = feedConsumptionCreateSchema.parse(input);
    return await insert("feed_consumption", "FEED", {
      flock_id: p.flockId,
      feed_type_id: p.feedTypeId,
      entry_date: d(p.entryDate),
      kg_used: p.kgUsed,
    }, "recordFeedUsage");
  } catch (error) {
    return fail(error);
  }
}

export async function updateFeedConsumption(input: unknown): Promise<Result> {
  try {
    const p = feedConsumptionUpdateSchema.parse(input);
    return await patch("feed_consumption", p.id, {
      flock_id: p.flockId,
      feed_type_id: p.feedTypeId,
      entry_date: d(p.entryDate),
      kg_used: p.kgUsed,
    });
  } catch (error) {
    return fail(error);
  }
}

export async function createFeedPurchase(input: unknown): Promise<Result> {
  try {
    const p = feedPurchaseCreateSchema.parse(input);
    return await insert("feed_purchases", "FPO", {
      purchase_date: d(p.purchaseDate),
      supplier_id: p.supplierId,
      feed_type_id: p.feedTypeId,
      number_of_bags: p.numberOfBags,
      bag_weight_kg: p.bagWeightKg,
      unit_cost_per_bag: p.unitCostPerBag,
      invoice_no: p.invoiceNo,
      payment_method: p.paymentMethod,
    }, "recordFeedPurchase");
  } catch (error) {
    return fail(error);
  }
}

export async function updateFeedPurchase(input: unknown): Promise<Result> {
  try {
    const p = feedPurchaseUpdateSchema.parse(input);
    return await patch("feed_purchases", p.id, {
      purchase_date: d(p.purchaseDate),
      supplier_id: p.supplierId,
      feed_type_id: p.feedTypeId,
      number_of_bags: p.numberOfBags,
      bag_weight_kg: p.bagWeightKg,
      unit_cost_per_bag: p.unitCostPerBag,
      invoice_no: p.invoiceNo,
      payment_method: p.paymentMethod,
    });
  } catch (error) {
    return fail(error);
  }
}

export async function createWeeklyWeight(input: unknown): Promise<Result> {
  try {
    const p = weeklyWeightCreateSchema.parse(input);
    return await insert("weekly_weights", "WGT", {
      flock_id: p.flockId,
      entry_date: d(p.entryDate),
      week_no: p.weekNo,
      sample_size: p.sampleSize,
      avg_body_weight_g: p.avgBodyWeightG,
    }, ["recordMortality", "recordFeedUsage", "recordMedicine"]);
  } catch (error) {
    return fail(error);
  }
}

export async function updateWeeklyWeight(input: unknown): Promise<Result> {
  try {
    const p = weeklyWeightUpdateSchema.parse(input);
    return await patch("weekly_weights", p.id, {
      flock_id: p.flockId,
      entry_date: d(p.entryDate),
      week_no: p.weekNo,
      sample_size: p.sampleSize,
      avg_body_weight_g: p.avgBodyWeightG,
    });
  } catch (error) {
    return fail(error);
  }
}

export async function createHealth(input: unknown): Promise<Result> {
  try {
    const p = healthCreateSchema.parse(input);
    return await insert("health_entries", "HLTH", {
      flock_id: p.flockId,
      product_id: p.productId,
      entry_date: d(p.entryDate),
      dosage_given: p.dosageGiven,
      route: p.route,
    }, "recordMedicine");
  } catch (error) {
    return fail(error);
  }
}

export async function updateHealth(input: unknown): Promise<Result> {
  try {
    const p = healthUpdateSchema.parse(input);
    return await patch("health_entries", p.id, {
      flock_id: p.flockId,
      product_id: p.productId,
      entry_date: d(p.entryDate),
      dosage_given: p.dosageGiven,
      route: p.route,
    });
  } catch (error) {
    return fail(error);
  }
}

export async function createMedicineLot(input: unknown): Promise<Result> {
  try {
    const p = medicineLotCreateSchema.parse(input);
    return await insert("medicine_lots", "MED", {
      flock_id: p.flockId,
      product_id: p.productId,
      supplier_id: p.supplierId,
      lot_number: p.lotNumber,
      expiry_date: d(p.expiryDate),
      quantity_received: p.quantityReceived,
      quantity_used: p.quantityUsed,
      unit_cost: p.unitCost,
    }, "recordMedicine");
  } catch (error) {
    return fail(error);
  }
}

export async function updateMedicineLot(input: unknown): Promise<Result> {
  try {
    const p = medicineLotUpdateSchema.parse(input);
    return await patch("medicine_lots", p.id, {
      flock_id: p.flockId,
      product_id: p.productId,
      supplier_id: p.supplierId,
      lot_number: p.lotNumber,
      expiry_date: d(p.expiryDate),
      quantity_received: p.quantityReceived,
      quantity_used: p.quantityUsed,
      unit_cost: p.unitCost,
    });
  } catch (error) {
    return fail(error);
  }
}

export async function createSale(input: unknown): Promise<Result> {
  try {
    const p = saleCreateSchema.parse(input);
    return await insert("sales", "SALE", {
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
    }, "recordSale");
  } catch (error) {
    return fail(error);
  }
}

export async function updateSale(input: unknown): Promise<Result> {
  try {
    const p = saleUpdateSchema.parse(input);
    return await patch("sales", p.id, {
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
    });
  } catch (error) {
    return fail(error);
  }
}

export async function createExpense(input: unknown): Promise<Result> {
  try {
    const p = expenseCreateSchema.parse(input);
    return await insert("expenses", "EXP", {
      flock_id: p.flockId,
      supplier_id: p.supplierId,
      entry_date: d(p.entryDate),
      category: p.category,
      quantity: p.quantity,
      unit_cost: p.unitCost,
      payment_method: p.paymentMethod,
      payment_ref: p.paymentRef,
      approved_by: p.approvedBy,
    }, "recordExpense");
  } catch (error) {
    return fail(error);
  }
}

export async function updateExpense(input: unknown): Promise<Result> {
  try {
    const p = expenseUpdateSchema.parse(input);
    return await patch("expenses", p.id, {
      flock_id: p.flockId,
      supplier_id: p.supplierId,
      entry_date: d(p.entryDate),
      category: p.category,
      quantity: p.quantity,
      unit_cost: p.unitCost,
      payment_method: p.paymentMethod,
      payment_ref: p.paymentRef,
      approved_by: p.approvedBy,
    });
  } catch (error) {
    return fail(error);
  }
}

export async function createOtherIncome(input: unknown): Promise<Result> {
  try {
    const p = otherIncomeCreateSchema.parse(input);
    return await insert("other_income", "INC", {
      entry_date: d(p.entryDate),
      source: p.source,
      description: p.description,
      amount: p.amount,
      payment_method: p.paymentMethod,
      received_by: p.receivedBy,
    }, "recordIncome");
  } catch (error) {
    return fail(error);
  }
}

export async function updateOtherIncome(input: unknown): Promise<Result> {
  try {
    const p = otherIncomeUpdateSchema.parse(input);
    return await patch("other_income", p.id, {
      entry_date: d(p.entryDate),
      source: p.source,
      description: p.description,
      amount: p.amount,
      payment_method: p.paymentMethod,
      received_by: p.receivedBy,
    });
  } catch (error) {
    return fail(error);
  }
}

export async function createRoutine(input: unknown): Promise<Result> {
  try {
    const p = dailyRoutineCreateSchema.parse(input);
    return await insert("daily_routines", "RTN", {
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
    }, "recordRoutine");
  } catch (error) {
    return fail(error);
  }
}

export async function updateRoutine(input: unknown): Promise<Result> {
  try {
    const p = dailyRoutineUpdateSchema.parse(input);
    return await patch("daily_routines", p.id, {
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
    });
  } catch (error) {
    return fail(error);
  }
}

export async function createEnvironment(input: unknown): Promise<Result> {
  try {
    const p = environmentCreateSchema.parse(input);
    return await insert("environment_readings", "ENV", {
      house_id: p.houseId,
      entry_date: d(p.entryDate),
      reading_time: p.readingTime,
      temperature_c: p.temperatureC,
      humidity_pct: p.humidityPct,
      ammonia_ppm: p.ammoniaPpm,
    }, "recordEnvironment");
  } catch (error) {
    return fail(error);
  }
}

export async function updateEnvironment(input: unknown): Promise<Result> {
  try {
    const p = environmentUpdateSchema.parse(input);
    return await patch("environment_readings", p.id, {
      house_id: p.houseId,
      entry_date: d(p.entryDate),
      reading_time: p.readingTime,
      temperature_c: p.temperatureC,
      humidity_pct: p.humidityPct,
      ammonia_ppm: p.ammoniaPpm,
    });
  } catch (error) {
    return fail(error);
  }
}
