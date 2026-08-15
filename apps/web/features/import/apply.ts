import type { createClient } from "@/lib/supabase/server";
import {
  cellDate,
  cellNum,
  cellStr,
  cellTime,
  cellYes,
  type ParsedWorkbook,
  type SheetRows,
} from "@/features/import/parse";

function activeFlag(row: Record<string, unknown>): boolean {
  const raw = cellStr(row, "IsActive");
  if (!raw) return true;
  return cellYes(row, "IsActive");
}

type Client = Awaited<ReturnType<typeof createClient>>;

const DEFAULT_LOOKUPS: Record<string, string[]> = {
  PaymentMethod: ["Cash", "Mobile Money", "Bank Transfer", "Cheque", "Credit"],
  LitterCondition: ["Dry", "Damp", "Wet", "Needs Changing"],
  Ventilation: ["Good", "Fair", "Poor"],
  ExpenseCategory: ["Day-Old Chicks", "Bedding/Litter", "Utilities", "Labour", "Transport", "Veterinary", "Heater/Fuel"],
  YesNo: ["Yes", "No"],
  MortalityCause: ["Normal Culling", "Heat Stress", "Disease", "Predator", "Cold Stress", "Other"],
  VaccinationRoute: ["Eye Drop", "Drinking Water", "Injection", "Spray"],
  IncomeSource: ["Manure Sales", "Empty Bag Sales", "Equipment Rental", "Other"],
  ProductType: ["Vaccine", "Antibiotic", "Supplement"],
  FeedStage: ["Starter", "Grower", "Finisher"],
};

function excelKey(row: Record<string, unknown>, key: string): string {
  return cellStr(row, key);
}

function codeNum(code: string): number {
  const m = code.match(/(\d+)$/);
  return m ? Number(m[1]) : 0;
}

async function throwIf(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

async function existingCodes(supabase: Client, table: string): Promise<Set<string>> {
  const { data, error } = await supabase.from(table as never).select("code");
  await throwIf(error);
  return new Set((data ?? []).map((r: { code: string }) => r.code));
}

async function insertRows(supabase: Client, table: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  const { error } = await supabase.from(table as never).insert(rows as never);
  await throwIf(error);
}

async function mapBy<T extends { id: string }>(
  supabase: Client,
  table: string,
  column: string,
): Promise<Map<string, string>> {
  const { data, error } = await supabase.from(table as never).select(`id, ${column}`);
  await throwIf(error);
  return new Map((data ?? []).map((r) => [String((r as Record<string, unknown>)[column]), (r as T).id]));
}

export async function applyFarmNowImport(
  supabase: Client,
  userId: string,
  parsed: ParsedWorkbook,
): Promise<{ inserted: Record<string, number> }> {
  const s = parsed.sheets;
  const inserted: Record<string, number> = {};
  const bump = (key: string, n: number) => {
    inserted[key] = (inserted[key] ?? 0) + n;
  };

  for (const row of s.mst_Settings ?? []) {
    const key = cellStr(row, "Parameter");
    if (!key) continue;
    const { error } = await supabase.from("settings").upsert({ key, value: cellStr(row, "Value") });
    await throwIf(error);
  }

  const lookupRows: Array<{ list_name: string; value: string; sort_order: number }> = [];
  const listSheet = s.mst_Lists ?? [];
  if (listSheet.length > 0) {
    const grouped = new Map<string, string[]>();
    for (const row of listSheet) {
      const listName = cellStr(row, "ListName") || cellStr(row, "List") || cellStr(row, "Category");
      const value = cellStr(row, "Value") || cellStr(row, "Item");
      if (!listName || !value) continue;
      const arr = grouped.get(listName) ?? [];
      arr.push(value);
      grouped.set(listName, arr);
    }
    for (const [list_name, values] of grouped) {
      values.forEach((value, sort_order) => lookupRows.push({ list_name, value, sort_order }));
    }
  } else {
    for (const [list_name, values] of Object.entries(DEFAULT_LOOKUPS)) {
      values.forEach((value, sort_order) => lookupRows.push({ list_name, value, sort_order }));
    }
  }
  if (lookupRows.length) {
    const { error } = await supabase.from("lookup_options").upsert(lookupRows, { onConflict: "list_name,value" });
    await throwIf(error);
  }

  await upsertMasters(supabase, "houses", s.mst_Houses ?? [], (row) => ({
    code: cellStr(row, "HouseCode"),
    capacity: cellNum(row, "Capacity"),
    location_zone: cellStr(row, "LocationZone"),
    status: "Active" as const,
  }), "code");

  await upsertMasters(supabase, "breeds", s.mst_Breeds ?? [], (row) => ({
    name: cellStr(row, "BreedName"),
    standard_fcr: cellNum(row, "StandardFCR"),
    standard_adg_g: cellNum(row, "StandardADG_g"),
  }), "name");

  await upsertMasters(supabase, "feed_types", s.mst_FeedTypes ?? [], (row) => ({
    name: cellStr(row, "FeedName"),
    stage: cellStr(row, "Stage"),
    unit_cost_per_kg: cellNum(row, "UnitCostPerKg_ZMW"),
    standard_bag_weight_kg: cellNum(row, "StandardBagWeightKg"),
    min_stock_kg: cellNum(row, "MinStockKg"),
  }), "name");

  await upsertMasters(supabase, "suppliers", s.mst_Suppliers ?? [], (row) => ({
    name: cellStr(row, "SupplierName"),
    contact: cellStr(row, "Contact"),
    email: cellStr(row, "Email"),
    category: cellStr(row, "Category"),
    lead_time_days: cellNum(row, "LeadTimeDays"),
  }), "name");

  await upsertMasters(supabase, "customers", s.mst_Customers ?? [], (row) => ({
    name: cellStr(row, "CustomerName"),
    contact: cellStr(row, "Contact"),
    address: cellStr(row, "Address"),
    price_tier: cellStr(row, "PriceTier"),
    payment_terms: cellStr(row, "PaymentTerms"),
  }), "name");

  await upsertMasters(supabase, "products", s.mst_Vaccines_Meds ?? [], (row) => ({
    name: cellStr(row, "ProductName"),
    type: cellStr(row, "Type"),
    dosage_unit: cellStr(row, "DosageUnit"),
    withdrawal_days: cellNum(row, "WithdrawalDays"),
  }), "name");

  await upsertEmployees(supabase, s.mst_Employees ?? []);

  const housesByCode = await mapBy(supabase, "houses", "code");
  const breedsByName = await mapBy(supabase, "breeds", "name");
  const feedByName = await mapBy(supabase, "feed_types", "name");
  const suppliersByName = await mapBy(supabase, "suppliers", "name");
  const customersByName = await mapBy(supabase, "customers", "name");
  const productsByName = await mapBy(supabase, "products", "name");
  const employeesByName = await mapBy(supabase, "employees", "name");

  const houseByExcel = idMap(s.mst_Houses ?? [], "HouseID", "HouseCode", housesByCode);
  const breedByExcel = idMap(s.mst_Breeds ?? [], "BreedID", "BreedName", breedsByName);
  const feedByExcel = idMap(s.mst_FeedTypes ?? [], "FeedID", "FeedName", feedByName);
  const supplierByExcel = idMap(s.mst_Suppliers ?? [], "SupplierID", "SupplierName", suppliersByName);
  const customerByExcel = idMap(s.mst_Customers ?? [], "CustomerID", "CustomerName", customersByName);
  const productByExcel = idMap(s.mst_Vaccines_Meds ?? [], "ProductID", "ProductName", productsByName);
  const employeeByExcel = idMap(s.mst_Employees ?? [], "EmployeeID", "EmployeeName", employeesByName);

  const existingFlocks = await existingCodes(supabase, "flocks");
  const flockRows = (s.reg_Flocks ?? [])
    .filter((row) => !existingFlocks.has(cellStr(row, "FlockID")))
    .map((row) => ({
      code: cellStr(row, "FlockID"),
      house_id: must(houseByExcel.get(excelKey(row, "HouseID")), `Unknown house ${excelKey(row, "HouseID")}`),
      breed_id: must(breedByExcel.get(excelKey(row, "BreedID")), `Unknown breed ${excelKey(row, "BreedID")}`),
      supplier_id: must(supplierByExcel.get(excelKey(row, "SupplierID")), `Unknown supplier ${excelKey(row, "SupplierID")}`),
      placed_date: cellDate(row, "PlacedDate"),
      initial_bird_count: cellNum(row, "InitialBirdCount"),
      expected_dispatch_date: cellDate(row, "ExpectedDispatchDate"),
      status: "Active" as const,
      created_by: userId,
    }));
  await insertRows(supabase, "flocks", flockRows);
  bump("flocks", flockRows.length);

  const flocksByCode = await mapBy(supabase, "flocks", "code");

  const purchases = await skipExisting(supabase, "feed_purchases", s.reg_FeedPurchases ?? [], (row) => ({
    code: cellStr(row, "EntryID"),
    purchase_date: cellDate(row, "Date"),
    supplier_id: must(supplierByExcel.get(excelKey(row, "SupplierID")), `Unknown supplier ${excelKey(row, "SupplierID")}`),
    feed_type_id: must(feedByExcel.get(excelKey(row, "FeedID")), `Unknown feed ${excelKey(row, "FeedID")}`),
    number_of_bags: cellNum(row, "NumberOfBags"),
    bag_weight_kg: cellNum(row, "BagWeightKg"),
    unit_cost_per_bag: cellNum(row, "UnitCostPerBag_ZMW"),
    invoice_no: cellStr(row, "InvoiceNo"),
    payment_method: cellStr(row, "PaymentMethod"),
    is_active: activeFlag(row),
    created_by: userId,
  }));
  await insertRows(supabase, "feed_purchases", purchases);
  bump("feed_purchases", purchases.length);

  const usage = await skipExisting(supabase, "feed_consumption", s.reg_FeedConsumption ?? [], (row) => ({
    code: cellStr(row, "EntryID"),
    flock_id: flockId(flocksByCode, row),
    feed_type_id: must(feedByExcel.get(excelKey(row, "FeedID")), `Unknown feed ${excelKey(row, "FeedID")}`),
    entry_date: cellDate(row, "Date"),
    kg_used: cellNum(row, "KgUsed"),
    is_active: activeFlag(row),
    created_by: userId,
  }));
  await insertRows(supabase, "feed_consumption", usage);
  bump("feed_consumption", usage.length);

  const mortality = await skipExisting(supabase, "mortality_entries", s.reg_DailyMortality ?? [], (row) => ({
    code: cellStr(row, "EntryID"),
    flock_id: flockId(flocksByCode, row),
    entry_date: cellDate(row, "Date"),
    mortality_count: cellNum(row, "MortalityCount"),
    cause: cellStr(row, "Cause"),
    is_active: activeFlag(row),
    created_by: userId,
  }));
  await insertRows(supabase, "mortality_entries", mortality);
  bump("mortality_entries", mortality.length);

  const weights = await skipExisting(supabase, "weekly_weights", s.reg_WeeklyWeights ?? [], (row) => ({
    code: cellStr(row, "EntryID"),
    flock_id: flockId(flocksByCode, row),
    entry_date: cellDate(row, "Date"),
    week_no: cellNum(row, "WeekNo"),
    sample_size: cellNum(row, "SampleSize"),
    avg_body_weight_g: cellNum(row, "AvgBodyWeightG"),
    is_active: activeFlag(row),
    created_by: userId,
  }));
  await insertRows(supabase, "weekly_weights", weights);
  bump("weekly_weights", weights.length);

  const health = await skipExisting(supabase, "health_entries", s.reg_Vaccination_Health ?? [], (row) => ({
    code: cellStr(row, "EntryID"),
    flock_id: flockId(flocksByCode, row),
    product_id: must(productByExcel.get(excelKey(row, "ProductID")), `Unknown product ${excelKey(row, "ProductID")}`),
    entry_date: cellDate(row, "Date"),
    dosage_given: cellStr(row, "DosageGiven"),
    route: cellStr(row, "Route"),
    is_active: activeFlag(row),
    created_by: userId,
  }));
  await insertRows(supabase, "health_entries", health);
  bump("health_entries", health.length);

  const lots = await skipExisting(supabase, "medicine_lots", s.reg_MedicineStock ?? [], (row) => ({
    code: cellStr(row, "EntryID"),
    flock_id: flockId(flocksByCode, row),
    product_id: must(productByExcel.get(excelKey(row, "ProductID")), `Unknown product ${excelKey(row, "ProductID")}`),
    supplier_id: must(supplierByExcel.get(excelKey(row, "SupplierID")), `Unknown supplier ${excelKey(row, "SupplierID")}`),
    lot_number: cellStr(row, "LotNumber"),
    expiry_date: cellDate(row, "ExpiryDate"),
    quantity_received: cellNum(row, "QuantityReceived"),
    quantity_used: cellNum(row, "QuantityUsed"),
    unit_cost: cellNum(row, "UnitCost_ZMW"),
    is_active: activeFlag(row),
    created_by: userId,
  }));
  await insertRows(supabase, "medicine_lots", lots);
  bump("medicine_lots", lots.length);

  const sales = await skipExisting(supabase, "sales", s.reg_Sales_Dispatch ?? [], (row) => ({
    code: cellStr(row, "EntryID"),
    flock_id: flockId(flocksByCode, row),
    customer_id: must(customerByExcel.get(excelKey(row, "CustomerID")), `Unknown customer ${excelKey(row, "CustomerID")}`),
    entry_date: cellDate(row, "Date"),
    birds_dispatched: cellNum(row, "BirdsDispatched"),
    live_weight_kg: cellNum(row, "TotalLiveWeightKg"),
    price_per_kg: cellNum(row, "PricePerKg_ZMW"),
    price_per_bird: cellNum(row, "PricePerBird_ZMW"),
    transport_cost: cellNum(row, "TransportCost_ZMW"),
    amount_paid: cellNum(row, "AmountPaid_ZMW"),
    invoice_no: cellStr(row, "InvoiceNo"),
    is_active: activeFlag(row),
    created_by: userId,
  }));
  await insertRows(supabase, "sales", sales);
  bump("sales", sales.length);

  const expenses = await skipExisting(supabase, "expenses", s.reg_Expenses ?? [], (row) => {
    const flockCode = cellStr(row, "FlockID");
    const supplierExcel = excelKey(row, "SupplierID");
    return {
      code: cellStr(row, "EntryID"),
      flock_id: !flockCode || flockCode.toLowerCase() === "overhead" ? null : flockId(flocksByCode, row),
      supplier_id: supplierExcel ? must(supplierByExcel.get(supplierExcel), `Unknown supplier ${supplierExcel}`) : null,
      entry_date: cellDate(row, "Date"),
      category: cellStr(row, "ExpenseCategory"),
      quantity: cellNum(row, "Quantity"),
      unit_cost: cellNum(row, "UnitCost_ZMW"),
      payment_method: cellStr(row, "PaymentMethod"),
      payment_ref: cellStr(row, "PaymentRef"),
      approved_by: cellStr(row, "ApprovedBy"),
      is_active: activeFlag(row),
      created_by: userId,
    };
  });
  await insertRows(supabase, "expenses", expenses);
  bump("expenses", expenses.length);

  const income = await skipExisting(supabase, "other_income", s.reg_OtherIncome ?? [], (row) => ({
    code: cellStr(row, "EntryID"),
    entry_date: cellDate(row, "Date"),
    source: cellStr(row, "Source"),
    description: cellStr(row, "Description"),
    amount: cellNum(row, "Amount_ZMW"),
    payment_method: cellStr(row, "PaymentMethod"),
    received_by: cellStr(row, "ReceivedBy"),
    is_active: activeFlag(row),
    created_by: userId,
  }));
  await insertRows(supabase, "other_income", income);
  bump("other_income", income.length);

  const env = await skipExisting(supabase, "environment_readings", s.reg_EnvironmentReadings ?? [], (row) => ({
    code: cellStr(row, "EntryID"),
    house_id: must(houseByExcel.get(excelKey(row, "HouseID")), `Unknown house ${excelKey(row, "HouseID")}`),
    entry_date: cellDate(row, "Date"),
    reading_time: cellTime(row, "Time"),
    temperature_c: cellNum(row, "TemperatureC"),
    humidity_pct: cellNum(row, "HumidityPct"),
    ammonia_ppm: cellNum(row, "AmmoniaPPM"),
    is_active: activeFlag(row),
    created_by: userId,
  }));
  await insertRows(supabase, "environment_readings", env);
  bump("environment_readings", env.length);

  const routines = await skipExisting(supabase, "daily_routines", s.reg_DailyRoutine ?? [], (row) => ({
    code: cellStr(row, "EntryID"),
    flock_id: flockId(flocksByCode, row),
    employee_id: employeeByExcel.get(excelKey(row, "EmployeeID")) ?? null,
    entry_date: cellDate(row, "Date"),
    temperature_c: cellNum(row, "TemperatureC"),
    humidity_pct: cellNum(row, "HumidityPct"),
    water_available: cellStr(row, "WaterAvailable", "Yes"),
    feed_available: cellStr(row, "FeedAvailable", "Yes"),
    drinkers_cleaned: cellStr(row, "DrinkersCleaned", "Yes"),
    litter_condition: cellStr(row, "LitterCondition"),
    ventilation: cellStr(row, "Ventilation"),
    sick_birds_observed: cellNum(row, "SickBirdsObserved"),
    notes: cellStr(row, "Notes"),
    is_active: activeFlag(row),
    created_by: userId,
  }));
  await insertRows(supabase, "daily_routines", routines);
  bump("daily_routines", routines.length);

  for (const row of s.reg_Flocks ?? []) {
    const status = cellStr(row, "Status", "Active");
    if (status === "Active") continue;
    const { error } = await supabase.from("flocks").update({ status: "Closed" }).eq("code", cellStr(row, "FlockID"));
    await throwIf(error);
  }

  for (const row of s.mst_Houses ?? []) {
    const status = cellStr(row, "Status", "Active");
    if (status === "Active") continue;
    const { error } = await supabase.from("houses").update({ status: "Inactive" }).eq("code", cellStr(row, "HouseCode"));
    await throwIf(error);
  }

  await syncCounters(supabase, {
    FLK: [...flocksByCode.keys()],
    MORT: (s.reg_DailyMortality ?? []).map((r) => cellStr(r, "EntryID")),
    FEED: (s.reg_FeedConsumption ?? []).map((r) => cellStr(r, "EntryID")),
    FPO: (s.reg_FeedPurchases ?? []).map((r) => cellStr(r, "EntryID")),
    WGT: (s.reg_WeeklyWeights ?? []).map((r) => cellStr(r, "EntryID")),
    HLTH: (s.reg_Vaccination_Health ?? []).map((r) => cellStr(r, "EntryID")),
    SALE: (s.reg_Sales_Dispatch ?? []).map((r) => cellStr(r, "EntryID")),
    EXP: (s.reg_Expenses ?? []).map((r) => cellStr(r, "EntryID")),
    ENV: (s.reg_EnvironmentReadings ?? []).map((r) => cellStr(r, "EntryID")),
    INC: (s.reg_OtherIncome ?? []).map((r) => cellStr(r, "EntryID")),
    RTN: (s.reg_DailyRoutine ?? []).map((r) => cellStr(r, "EntryID")),
    MED: (s.reg_MedicineStock ?? []).map((r) => cellStr(r, "EntryID")),
  });

  return { inserted };
}

function must(id: string | undefined, message: string): string {
  if (!id) throw new Error(message);
  return id;
}

function flockId(flocksByCode: Map<string, string>, row: Record<string, unknown>): string {
  const code = cellStr(row, "FlockID");
  return must(flocksByCode.get(code), `Unknown flock ${code}`);
}

function idMap(
  rows: SheetRows,
  excelIdKey: string,
  nameKey: string,
  byName: Map<string, string>,
): Map<string, string> {
  const map = new Map<string, string>();
  for (const row of rows) {
    const id = byName.get(cellStr(row, nameKey));
    if (id) map.set(excelKey(row, excelIdKey), id);
  }
  return map;
}

async function upsertMasters(
  supabase: Client,
  table: string,
  rows: SheetRows,
  map: (row: Record<string, unknown>) => Record<string, unknown>,
  onConflict: string,
) {
  const payload = rows.map(map).filter((r) => r[onConflict]);
  if (!payload.length) return;
  const { error } = await supabase.from(table as never).upsert(payload as never, { onConflict });
  await throwIf(error);
}

async function upsertEmployees(supabase: Client, rows: SheetRows) {
  const existing = await mapBy(supabase, "employees", "name");
  const payload = rows
    .filter((row) => cellStr(row, "EmployeeName") && !existing.has(cellStr(row, "EmployeeName")))
    .map((row) => ({
      name: cellStr(row, "EmployeeName"),
      position: cellStr(row, "Position"),
      contact_number: cellStr(row, "ContactNumber"),
      nrc: cellStr(row, "NRC"),
      date_hired: cellDate(row, "DateHired") || null,
      salary_zmw: cellNum(row, "SalaryZMW"),
      status: (cellStr(row, "Status", "Active") === "Inactive" ? "Inactive" : "Active") as "Active" | "Inactive",
    }));
  await insertRows(supabase, "employees", payload);
}

async function skipExisting(
  supabase: Client,
  table: string,
  rows: SheetRows,
  map: (row: Record<string, unknown>) => Record<string, unknown>,
) {
  const have = await existingCodes(supabase, table);
  return rows.map(map).filter((row) => row.code && !have.has(String(row.code)));
}

async function syncCounters(supabase: Client, codes: Record<string, string[]>) {
  for (const [prefix, list] of Object.entries(codes)) {
    const n = list.reduce((max, code) => Math.max(max, codeNum(code)), 0);
    const { error } = await supabase.from("entry_counters").upsert({ prefix, last_value: n });
    await throwIf(error);
  }
}
