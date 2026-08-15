"""Generate supabase/seed.sql from dumped Excel tables. Demo/development data only."""
from __future__ import annotations

import json
import uuid
from pathlib import Path

NS = uuid.UUID("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa")
TABLES = json.loads(Path(r"C:\farmnow\.dist\excel_tables.json").read_text(encoding="utf-8"))
OUT = Path(r"C:\farmnow\supabase\seed.sql")


def uid(kind: str, excel_id) -> str:
    return str(uuid.uuid5(NS, f"{kind}-{excel_id}"))


def flock_uid(code: str) -> str:
    return str(uuid.uuid5(NS, f"flock-{code}"))


def sql_str(v) -> str:
    if v is None:
        return "NULL"
    s = str(v).replace("'", "''")
    return f"'{s}'"


def sql_num(v) -> str:
    if v is None or v == "":
        return "NULL"
    return str(v)


def yes(v) -> str:
    return "true" if str(v).strip().lower() in ("yes", "true", "1") else "false"


def main() -> None:
    lines: list[str] = []
    a = lines.append
    a("-- DEMO / DEVELOPMENT SEED DATA")
    a("-- Extracted from FarmNow_ERP_System.xlsx. Do not use as production history without review.")
    a("begin;")
    a("")

    a("-- Settings")
    a("insert into public.settings (key, value) values")
    settings = TABLES["mst_Settings"]["rows"]
    a(",\n".join(f"  ({sql_str(r['Parameter'])}, {sql_str(r['Value'])})" for r in settings) + ";")
    a("")

    lookups = [
        ("PaymentMethod", ["Cash", "Mobile Money", "Bank Transfer", "Cheque", "Credit"]),
        ("LitterCondition", ["Dry", "Damp", "Wet", "Needs Changing"]),
        ("Ventilation", ["Good", "Fair", "Poor"]),
        (
            "ExpenseCategory",
            [
                "Day-Old Chicks",
                "Bedding/Litter",
                "Utilities",
                "Labour",
                "Transport",
                "Veterinary",
                "Heater/Fuel",
            ],
        ),
        ("YesNo", ["Yes", "No"]),
        (
            "MortalityCause",
            ["Normal Culling", "Heat Stress", "Disease", "Predator", "Cold Stress", "Other"],
        ),
        ("VaccinationRoute", ["Eye Drop", "Drinking Water", "Injection", "Spray"]),
        (
            "IncomeSource",
            ["Manure Sales", "Empty Bag Sales", "Equipment Rental", "Other"],
        ),
        ("ProductType", ["Vaccine", "Antibiotic", "Supplement"]),
        ("FeedStage", ["Starter", "Grower", "Finisher"]),
    ]
    a("insert into public.lookup_options (list_name, value, sort_order) values")
    rows = []
    for name, values in lookups:
        for i, v in enumerate(values):
            rows.append(f"  ({sql_str(name)}, {sql_str(v)}, {i})")
    a(",\n".join(rows) + ";")
    a("")

    a("-- Houses")
    a("insert into public.houses (id, code, capacity, location_zone, status) values")
    a(
        ",\n".join(
            f"  ('{uid('house', r['HouseID'])}', {sql_str(r['HouseCode'])}, {r['Capacity']}, {sql_str(r['LocationZone'])}, {sql_str(r['Status'])})"
            for r in TABLES["mst_Houses"]["rows"]
        )
        + ";"
    )
    a("")

    a("-- Breeds")
    a("insert into public.breeds (id, name, standard_fcr, standard_adg_g) values")
    a(
        ",\n".join(
            f"  ('{uid('breed', r['BreedID'])}', {sql_str(r['BreedName'])}, {r['StandardFCR']}, {r['StandardADG_g']})"
            for r in TABLES["mst_Breeds"]["rows"]
        )
        + ";"
    )
    a("")

    a("-- Feed types")
    a("insert into public.feed_types (id, name, stage, unit_cost_per_kg, standard_bag_weight_kg, min_stock_kg) values")
    a(
        ",\n".join(
            f"  ('{uid('feed', r['FeedID'])}', {sql_str(r['FeedName'])}, {sql_str(r['Stage'])}, {r['UnitCostPerKg_ZMW']}, {r['StandardBagWeightKg']}, {r['MinStockKg']})"
            for r in TABLES["mst_FeedTypes"]["rows"]
        )
        + ";"
    )
    a("")

    a("-- Suppliers")
    a("insert into public.suppliers (id, name, contact, email, category, lead_time_days) values")
    a(
        ",\n".join(
            f"  ('{uid('supplier', r['SupplierID'])}', {sql_str(r['SupplierName'])}, {sql_str(r['Contact'])}, {sql_str(r['Email'])}, {sql_str(r['Category'])}, {r['LeadTimeDays']})"
            for r in TABLES["mst_Suppliers"]["rows"]
        )
        + ";"
    )
    a("")

    a("-- Customers")
    a("insert into public.customers (id, name, contact, address, price_tier, payment_terms) values")
    a(
        ",\n".join(
            f"  ('{uid('customer', r['CustomerID'])}', {sql_str(r['CustomerName'])}, {sql_str(r['Contact'])}, {sql_str(r['Address'])}, {sql_str(r['PriceTier'])}, {sql_str(r['PaymentTerms'])})"
            for r in TABLES["mst_Customers"]["rows"]
        )
        + ";"
    )
    a("")

    a("-- Products")
    a("insert into public.products (id, name, type, dosage_unit, withdrawal_days) values")
    a(
        ",\n".join(
            f"  ('{uid('product', r['ProductID'])}', {sql_str(r['ProductName'])}, {sql_str(r['Type'])}, {sql_str(r['DosageUnit'])}, {r['WithdrawalDays']})"
            for r in TABLES["mst_Vaccines_Meds"]["rows"]
        )
        + ";"
    )
    a("")

    a("-- Employees")
    a("insert into public.employees (id, name, position, contact_number, nrc, date_hired, salary_zmw, status) values")
    a(
        ",\n".join(
            f"  ('{uid('employee', r['EmployeeID'])}', {sql_str(r['EmployeeName'])}, {sql_str(r['Position'])}, {sql_str(r['ContactNumber'])}, {sql_str(r['NRC'])}, {sql_str(str(r['DateHired'])[:10])}, {r['SalaryZMW']}, {sql_str(r['Status'])})"
            for r in TABLES["mst_Employees"]["rows"]
        )
        + ";"
    )
    a("")

    a("-- Flocks (all Active first so transaction triggers accept historical rows; Closed applied at end)")
    a("insert into public.flocks (id, code, house_id, breed_id, supplier_id, placed_date, initial_bird_count, expected_dispatch_date, status) values")
    a(
        ",\n".join(
            f"  ('{flock_uid(r['FlockID'])}', {sql_str(r['FlockID'])}, '{uid('house', r['HouseID'])}', '{uid('breed', r['BreedID'])}', '{uid('supplier', r['SupplierID'])}', {sql_str(str(r['PlacedDate'])[:10])}, {r['InitialBirdCount']}, {sql_str(str(r['ExpectedDispatchDate'])[:10])}, 'Active')"
            for r in TABLES["reg_Flocks"]["rows"]
        )
        + ";"
    )
    a("")

    # Purchases BEFORE consumption so stock trigger passes
    a("-- Feed purchases")
    a("insert into public.feed_purchases (code, purchase_date, supplier_id, feed_type_id, number_of_bags, bag_weight_kg, unit_cost_per_bag, invoice_no, payment_method, is_active) values")
    a(
        ",\n".join(
            f"  ({sql_str(r['EntryID'])}, {sql_str(str(r['Date'])[:10])}, '{uid('supplier', r['SupplierID'])}', '{uid('feed', r['FeedID'])}', {r['NumberOfBags']}, {r['BagWeightKg']}, {r['UnitCostPerBag_ZMW']}, {sql_str(r['InvoiceNo'])}, {sql_str(r['PaymentMethod'])}, {yes(r['IsActive'])})"
            for r in TABLES["reg_FeedPurchases"]["rows"]
        )
        + ";"
    )
    a("")

    a("-- Feed consumption")
    a("insert into public.feed_consumption (code, flock_id, feed_type_id, entry_date, kg_used, is_active) values")
    a(
        ",\n".join(
            f"  ({sql_str(r['EntryID'])}, '{flock_uid(r['FlockID'])}', '{uid('feed', r['FeedID'])}', {sql_str(str(r['Date'])[:10])}, {r['KgUsed']}, {yes(r['IsActive'])})"
            for r in TABLES["reg_FeedConsumption"]["rows"]
        )
        + ";"
    )
    a("")

    a("-- Mortality")
    a("insert into public.mortality_entries (code, flock_id, entry_date, mortality_count, cause, is_active) values")
    a(
        ",\n".join(
            f"  ({sql_str(r['EntryID'])}, '{flock_uid(r['FlockID'])}', {sql_str(str(r['Date'])[:10])}, {r['MortalityCount']}, {sql_str(r['Cause'])}, {yes(r['IsActive'])})"
            for r in TABLES["reg_DailyMortality"]["rows"]
        )
        + ";"
    )
    a("")

    a("-- Weekly weights")
    a("insert into public.weekly_weights (code, flock_id, entry_date, week_no, sample_size, avg_body_weight_g, is_active) values")
    a(
        ",\n".join(
            f"  ({sql_str(r['EntryID'])}, '{flock_uid(r['FlockID'])}', {sql_str(str(r['Date'])[:10])}, {r['WeekNo']}, {r['SampleSize']}, {r['AvgBodyWeightG']}, {yes(r['IsActive'])})"
            for r in TABLES["reg_WeeklyWeights"]["rows"]
        )
        + ";"
    )
    a("")

    a("-- Health")
    a("insert into public.health_entries (code, flock_id, product_id, entry_date, dosage_given, route, is_active) values")
    a(
        ",\n".join(
            f"  ({sql_str(r['EntryID'])}, '{flock_uid(r['FlockID'])}', '{uid('product', r['ProductID'])}', {sql_str(str(r['Date'])[:10])}, {sql_str(r['DosageGiven'])}, {sql_str(r['Route'])}, {yes(r['IsActive'])})"
            for r in TABLES["reg_Vaccination_Health"]["rows"]
        )
        + ";"
    )
    a("")

    a("-- Medicine lots")
    a("insert into public.medicine_lots (code, flock_id, product_id, supplier_id, lot_number, expiry_date, quantity_received, quantity_used, unit_cost, is_active) values")
    a(
        ",\n".join(
            f"  ({sql_str(r['EntryID'])}, '{flock_uid(r['FlockID'])}', '{uid('product', r['ProductID'])}', '{uid('supplier', r['SupplierID'])}', {sql_str(r['LotNumber'])}, {sql_str(str(r['ExpiryDate'])[:10])}, {r['QuantityReceived']}, {r['QuantityUsed']}, {r['UnitCost_ZMW']}, {yes(r['IsActive'])})"
            for r in TABLES["reg_MedicineStock"]["rows"]
        )
        + ";"
    )
    a("")

    a("-- Sales")
    a("insert into public.sales (code, flock_id, customer_id, entry_date, birds_dispatched, live_weight_kg, price_per_kg, price_per_bird, transport_cost, amount_paid, invoice_no, is_active) values")
    a(
        ",\n".join(
            f"  ({sql_str(r['EntryID'])}, '{flock_uid(r['FlockID'])}', '{uid('customer', r['CustomerID'])}', {sql_str(str(r['Date'])[:10])}, {r['BirdsDispatched']}, {r['TotalLiveWeightKg']}, {r['PricePerKg_ZMW']}, {r['PricePerBird_ZMW']}, {r['TransportCost_ZMW']}, {r['AmountPaid_ZMW']}, {sql_str(r['InvoiceNo'])}, {yes(r['IsActive'])})"
            for r in TABLES["reg_Sales_Dispatch"]["rows"]
        )
        + ";"
    )
    a("")

    a("-- Expenses")
    exp_rows = []
    for r in TABLES["reg_Expenses"]["rows"]:
        flock = "NULL" if r["FlockID"] in (None, "Overhead") else f"'{flock_uid(r['FlockID'])}'"
        supplier = "NULL" if not r.get("SupplierID") else f"'{uid('supplier', r['SupplierID'])}'"
        exp_rows.append(
            f"  ({sql_str(r['EntryID'])}, {flock}, {supplier}, {sql_str(str(r['Date'])[:10])}, {sql_str(r['ExpenseCategory'])}, {r['Quantity']}, {r['UnitCost_ZMW']}, {sql_str(r['PaymentMethod'])}, {sql_str(r['PaymentRef'])}, {sql_str(r['ApprovedBy'])}, {yes(r['IsActive'])})"
        )
    a("insert into public.expenses (code, flock_id, supplier_id, entry_date, category, quantity, unit_cost, payment_method, payment_ref, approved_by, is_active) values")
    a(",\n".join(exp_rows) + ";")
    a("")

    a("-- Other income")
    a("insert into public.other_income (code, entry_date, source, description, amount, payment_method, received_by, is_active) values")
    a(
        ",\n".join(
            f"  ({sql_str(r['EntryID'])}, {sql_str(str(r['Date'])[:10])}, {sql_str(r['Source'])}, {sql_str(r['Description'])}, {r['Amount_ZMW']}, {sql_str(r['PaymentMethod'])}, {sql_str(r['ReceivedBy'])}, {yes(r['IsActive'])})"
            for r in TABLES["reg_OtherIncome"]["rows"]
        )
        + ";"
    )
    a("")

    a("-- Environment")
    a("insert into public.environment_readings (code, house_id, entry_date, reading_time, temperature_c, humidity_pct, ammonia_ppm, is_active) values")
    a(
        ",\n".join(
            f"  ({sql_str(r['EntryID'])}, '{uid('house', r['HouseID'])}', {sql_str(str(r['Date'])[:10])}, {sql_str(r['Time'])}, {r['TemperatureC']}, {r['HumidityPct']}, {r['AmmoniaPPM']}, {yes(r['IsActive'])})"
            for r in TABLES["reg_EnvironmentReadings"]["rows"]
        )
        + ";"
    )
    a("")

    a("-- Daily routines")
    a("insert into public.daily_routines (code, flock_id, employee_id, entry_date, temperature_c, humidity_pct, water_available, feed_available, drinkers_cleaned, litter_condition, ventilation, sick_birds_observed, notes, is_active) values")
    a(
        ",\n".join(
            f"  ({sql_str(r['EntryID'])}, '{flock_uid(r['FlockID'])}', '{uid('employee', r['EmployeeID'])}', {sql_str(str(r['Date'])[:10])}, {r['TemperatureC']}, {r['HumidityPct']}, {sql_str(r['WaterAvailable'])}, {sql_str(r['FeedAvailable'])}, {sql_str(r['DrinkersCleaned'])}, {sql_str(r['LitterCondition'])}, {sql_str(r['Ventilation'])}, {r['SickBirdsObserved']}, {sql_str(r['Notes'])}, {yes(r['IsActive'])})"
            for r in TABLES["reg_DailyRoutine"]["rows"]
        )
        + ";"
    )
    a("")

    a("-- Restore Closed status from Excel")
    for r in TABLES["reg_Flocks"]["rows"]:
        if r["Status"] != "Active":
            a(f"update public.flocks set status = {sql_str(r['Status'])} where code = {sql_str(r['FlockID'])};")
    a("")

    a("-- Align code counters with imported IDs")
    a("""
update public.entry_counters c set last_value = s.n
from (values
  ('FLK', (select coalesce(max(nullif(regexp_replace(code, '\\D', '', 'g'), '')::int), 0) from public.flocks)),
  ('MORT', (select coalesce(max(nullif(regexp_replace(code, '\\D', '', 'g'), '')::int), 0) from public.mortality_entries)),
  ('FEED', (select coalesce(max(nullif(regexp_replace(code, '\\D', '', 'g'), '')::int), 0) from public.feed_consumption)),
  ('FPO', (select coalesce(max(nullif(regexp_replace(code, '\\D', '', 'g'), '')::int), 0) from public.feed_purchases)),
  ('WGT', (select coalesce(max(nullif(regexp_replace(code, '\\D', '', 'g'), '')::int), 0) from public.weekly_weights)),
  ('HLTH', (select coalesce(max(nullif(regexp_replace(code, '\\D', '', 'g'), '')::int), 0) from public.health_entries)),
  ('SALE', (select coalesce(max(nullif(regexp_replace(code, '\\D', '', 'g'), '')::int), 0) from public.sales)),
  ('EXP', (select coalesce(max(nullif(regexp_replace(code, '\\D', '', 'g'), '')::int), 0) from public.expenses)),
  ('ENV', (select coalesce(max(nullif(regexp_replace(code, '\\D', '', 'g'), '')::int), 0) from public.environment_readings)),
  ('INC', (select coalesce(max(nullif(regexp_replace(code, '\\D', '', 'g'), '')::int), 0) from public.other_income)),
  ('RTN', (select coalesce(max(nullif(regexp_replace(code, '\\D', '', 'g'), '')::int), 0) from public.daily_routines)),
  ('MED', (select coalesce(max(nullif(regexp_replace(code, '\\D', '', 'g'), '')::int), 0) from public.medicine_lots))
) as s(prefix, n)
where c.prefix = s.prefix;
""")
    a("commit;")
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print("wrote", OUT, "bytes", OUT.stat().st_size)

    # sanity: feed stock
    purchased = {}
    used = {}
    for r in TABLES["reg_FeedPurchases"]["rows"]:
        purchased[r["FeedID"]] = purchased.get(r["FeedID"], 0) + r["NumberOfBags"] * r["BagWeightKg"]
    for r in TABLES["reg_FeedConsumption"]["rows"]:
        used[r["FeedID"]] = used.get(r["FeedID"], 0) + r["KgUsed"]
    print("feed stock purchased/used/balance")
    for k in sorted(set(purchased) | set(used)):
        print(k, purchased.get(k, 0), used.get(k, 0), purchased.get(k, 0) - used.get(k, 0))

    # remaining birds for sales
    init = {r["FlockID"]: r["InitialBirdCount"] for r in TABLES["reg_Flocks"]["rows"]}
    mort = {}
    for r in TABLES["reg_DailyMortality"]["rows"]:
        mort[r["FlockID"]] = mort.get(r["FlockID"], 0) + r["MortalityCount"]
    sold = {}
    for r in TABLES["reg_Sales_Dispatch"]["rows"]:
        sold[r["FlockID"]] = sold.get(r["FlockID"], 0) + r["BirdsDispatched"]
    print("remaining after mort+sales")
    for k, i in init.items():
        print(k, i, mort.get(k, 0), sold.get(k, 0), i - mort.get(k, 0) - sold.get(k, 0))


if __name__ == "__main__":
    main()
