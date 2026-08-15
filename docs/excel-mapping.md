# FarmNow Excel → Web Mapping

Source workbook: `FarmNow_ERP_System.xlsx` (30 sheets). VBA layer in `FarmNow_VBA_Modules/` is optional automation on top of the same tables.

This document maps every sheet to a PostgreSQL object and a web module. Calculated Excel columns are **not** stored as mutable totals; they are derived in SQL views or TypeScript domain functions.

Currency in the source is **ZMW** (symbol **K**). Company: FarmNow Limited, Lusaka, Zambia.

---

## Sheet classification

| Excel sheet | Class | Keep as table? | Notes |
|---|---|---|---|
| Dashboard | Dashboard view | No | KPI cards, flock comparison, charts, alerts |
| Menu_Nav | Navigation | No | Replaced by app sidebar |
| mst_Houses | Master | Yes `houses` | |
| mst_Breeds | Master | Yes `breeds` | Includes StandardFCR, StandardADG_g |
| mst_FeedTypes | Master | Yes `feed_types` | Stage, unit cost, bag weight, min stock |
| mst_Suppliers | Master | Yes `suppliers` | |
| mst_Customers | Master | Yes `customers` | |
| mst_Vaccines_Meds | Master | Yes `products` | Vaccines, antibiotics, supplements |
| mst_Users | Auth (obsolete) | No | Replaced by Supabase Auth + `profiles` |
| mst_Settings | Settings | Yes `settings` | KPI targets, company, currency |
| mst_Lists | Lookup | Yes `lookup_options` | Dropdown values |
| mst_Employees | Master | Yes `employees` | |
| reg_Flocks | Transaction | Yes `flocks` | Placement / batch register |
| reg_DailyMortality | Transaction | Yes `mortality_entries` | |
| reg_FeedConsumption | Transaction | Yes `feed_consumption` | |
| reg_WeeklyWeights | Transaction | Yes `weekly_weights` | |
| reg_Vaccination_Health | Transaction | Yes `health_entries` | |
| reg_Sales_Dispatch | Transaction | Yes `sales` | Single-line sales (no line items in Excel) |
| reg_Expenses | Transaction | Yes `expenses` | FlockID may be a flock code or "Overhead" |
| reg_EnvironmentReadings | Transaction | Yes `environment_readings` | House-level, not flock-level |
| reg_OtherIncome | Transaction | Yes `other_income` | |
| reg_DailyRoutine | Transaction | Yes `daily_routines` | Floor-walk checklist |
| reg_FeedPurchases | Transaction | Yes `feed_purchases` | Increases feed stock |
| reg_MedicineStock | Transaction | Yes `medicine_lots` | Lot + expiry + received/used |
| calc_KPI_Engine | Calculated view | SQL view `v_flock_kpis` | Do not persist |
| calc_FeedStockSummary | Calculated view | SQL view `v_feed_stock` | Do not persist |
| Log_Audit | Audit | Yes `audit_logs` | Hidden in Excel |
| rpt_FlockPerformance | Report | PDF + page | Reads KPI view |
| rpt_FinancialSummary | Report | PDF + page | All-flock P&L |
| rpt_MortalityTrend | Report | PDF + page | Weekly mortality + health list |

**Not in Excel (intentionally omitted):** generic SKU inventory, transfers between houses, multi-farm tenancy, sale line-items, purchase orders as a separate document from feed purchases.

**Inventory in the web app** is the union of feed stock (`v_feed_stock`) and medicine lots (`medicine_lots`). There is no third generic inventory register in the workbook.

---

## Mapping (sheet → purpose → database → web → calculations)

### Dashboard

```
Dashboard
    ↓ Live KPI overview, flock comparison, 3 charts, flock alerts, feed/medicine alerts
    ↓ Views: v_flock_kpis, v_feed_stock + medicine_lots status
    ↓ /dashboard
    ↓ Livability, avg FCR, avg ADG, mortality %, cost/bird, cost/kg (active flocks)
```

Scorecards (active flocks only):

| Card | Excel formula |
|---|---|
| Livability % | `SUMIFS(CurrentBirds, Status, Active) / SUMIFS(InitialBirds, Status, Active)` |
| Mortality % | `1 - Livability` |
| Avg FCR | `AVERAGEIFS(FCR, Status, Active)` |
| Avg ADG | `AVERAGEIFS(ADG_g, Status, Active)` |
| Avg cost/bird | `AVERAGEIFS(CostPerBird_ZMW, Status, Active)` |
| Avg cost/kg | `AVERAGEIFS(CostPerKg_ZMW, Status, Active)` |

Charts: FCR by flock, Livability % by flock, Cost per bird by flock.

Flock alert (active only): livability below `TargetLivabilityPct` → mortality message; else FCR above `TargetFCR` → feed message; else “Within normal range”.

Inventory alerts: each feed type `LOW STOCK`/`OK` with kg balance; each medicine lot expiry status.

### Menu_Nav

```
Menu_Nav
    ↓ Hyperlink index of all sheets
    ↓ (none)
    ↓ App sidebar + settings subnav
    ↓ n/a
```

### Master data

```
mst_Houses → houses → /settings/houses
mst_Breeds → breeds → /settings/breeds (StandardFCR, StandardADG_g for report comparison)
mst_FeedTypes → feed_types → /settings/feed-types (UnitCostPerKg costs consumption, not purchase price)
mst_Suppliers → suppliers → /settings/suppliers
mst_Customers → customers → /settings/customers
mst_Vaccines_Meds → products → /settings/products
mst_Employees → employees → /settings/employees
mst_Users → auth.users + profiles → /login (Excel name-login replaced)
mst_Settings → settings → /settings
mst_Lists → lookup_options → /settings/lookups
```

Settings keys: CompanyName, Location, Phone, Email, CurrencySymbol (`K`), ReportCurrency (`ZMW`), TargetFCR (`1.7`), TargetLivabilityPct (`0.95`), MortalityAlertThresholdPct (`0.02`), MedicineExpiryWarningDays (`30`), CurrentFlockCounter.

Lookup lists: PaymentMethod, LitterCondition, Ventilation, ExpenseCategory, YesNo, MortalityCause, VaccinationRoute.

### Flocks

```
reg_Flocks
    ↓ Placement / batch register
    ↓ flocks
    ↓ /flocks, /flocks/[id], /flocks/new
    ↓ Current birds, age, mortality % derived — not stored
```

Columns: FlockID, HouseID, BreedID, PlacedDate, InitialBirdCount, SupplierID, ExpectedDispatchDate, Status (`Active` | `Closed`).

### Mortality

```
reg_DailyMortality
    ↓ Daily deaths per flock
    ↓ mortality_entries
    ↓ /mortality, flock detail tab
    ↓ CumulativeMortality = SUMIFS count where same flock and date <= this date
```

VBA: flock must be Active; date not future; one row per flock+date; count must not exceed initial − mortality so far. **Does not subtract birds sold.**

Causes: Normal Culling, Heat Stress, Disease, Predator, Cold Stress, Other.

### Feed

```
reg_FeedConsumption → feed_consumption → /feed (usage)
    CostZMW = ROUND(KgUsed * feed_types.unit_cost_per_kg, 2)
    RunningTotalKg = SUMIFS kg where same flock and date <= this date

reg_FeedPurchases → feed_purchases → /feed (purchases)
    TotalWeightKg = bags * bag_weight
    TotalCost_ZMW = ROUND(bags * unit_cost_per_bag, 2)

calc_FeedStockSummary → v_feed_stock → /inventory
    OpeningStockKg = 0
    PurchasedKg = SUM purchases
    UsedKg = SUM consumption
    BalanceKg = opening + purchased − used
    Alert = LOW STOCK if balance < MinStockKg else OK
```

### Weights / performance sampling

```
reg_WeeklyWeights → weekly_weights → /flocks/[id] (weights) and /performance
    AgeDays = Date − flock.PlacedDate
    ADG_g = AvgBodyWeightG / AgeDays   (row-level; different from KPI ADG)
```

VBA range check: average weight 10–6000 g.

### Medicine / health

```
reg_Vaccination_Health → health_entries → /medicine (treatments)
    RankInFlock / CompositeKey are Excel lookup helpers — not stored

reg_MedicineStock → medicine_lots → /medicine (stock) and /inventory
    Balance = QuantityReceived − QuantityUsed
    TotalCost = ROUND(QuantityReceived * UnitCost, 2)
    Status = EXPIRED if today > expiry
             EXPIRING SOON if expiry − today <= MedicineExpiryWarningDays
             else OK
```

VBA: quantity used cannot exceed quantity received.

Routes: Eye Drop, Drinking Water, Injection, Spray.

### Sales

```
reg_Sales_Dispatch → sales → /sales
    TotalValue = ROUND(IF(PricePerBird>0, Birds*PricePerBird, LiveWeight*PricePerKg) + Transport, 2)
    Outstanding = TotalValue − AmountPaid
```

Excel VBA does **not** check that birds dispatched ≤ remaining birds. Web app **does** (transaction integrity). See `docs/business-rules.md`.

### Expenses / other income

```
reg_Expenses → expenses → /expenses
    flock_id nullable; Excel "Overhead" → NULL
    Amount = ROUND(Quantity * UnitCost, 2)

reg_OtherIncome → other_income → /income
    amount entered directly
```

**Estimated profit in Excel does not include other income.**

Expense categories: Day-Old Chicks, Bedding/Litter, Utilities, Labour, Transport, Veterinary, Heater/Fuel.

Other income sources: Manure Sales, Empty Bag Sales, Equipment Rental, Other.

Payment methods: Cash, Mobile Money, Bank Transfer, Cheque, Credit.

### Environment & daily routine

```
reg_EnvironmentReadings → environment_readings → /environment
    House-level temp / humidity / ammonia

reg_DailyRoutine → daily_routines → /routines
    Floor-walk checklist per flock
```

These overlap (both record temperature/humidity). They are kept as two modules because Excel treats them as two registers: house sensor log vs flock checklist.

### KPI engine (calculated)

```
calc_KPI_Engine → v_flock_kpis → Dashboard, flock list, flock detail, reports
```

| Column | Excel formula (simplified) |
|---|---|
| DaysOnFarm | `TODAY() − PlacedDate` |
| TotalMortality | `SUMIFS(mortality)` |
| CurrentBirds | `InitialBirds − TotalMortality` (**does not subtract sales**) |
| LivabilityPct | `CurrentBirds / InitialBirds` |
| TotalFeedKg | `SUMIFS(feed kg)` |
| TotalFeedCost | `SUMIFS(feed cost)` |
| LatestWeightDate | `MAXIFS(weekly weight dates)` |
| LatestAvgWeightG | weight on that date |
| FCR | `TotalFeedKg / (CurrentBirds * LatestAvgWeightG / 1000)` |
| ADG_g | `LatestAvgWeightG / DaysOnFarm` |
| TotalExpenses | `SUMIFS(expense amounts)` |
| MedicineCost | `SUMIFS(medicine lot total cost)` |
| TotalSalesValue | `SUMIFS(sale totals)` |
| BirdsSold | `SUMIFS(birds dispatched)` |
| CostPerBird | `(Expenses + FeedCost + MedicineCost) / InitialBirds` |
| CostPerKg | `(Expenses + FeedCost + MedicineCost) / (CurrentBirds * LatestAvgWeightG / 1000)` |
| EstimatedProfit | `Sales − Expenses − FeedCost − MedicineCost` |
| BreakEvenPricePerBird | `totalCost / IF(BirdsSold>0, BirdsSold, InitialBirds)` |

### Reports

```
rpt_FlockPerformance → /reports/flock-performance + PDF
rpt_FinancialSummary → /reports/financial + PDF
rpt_MortalityTrend → /reports/mortality + PDF
    Week n: placed+(7*(n-1)) to placed+(7*n-1); 8 weeks
```

### Audit

```
Log_Audit → audit_logs → /settings/audit
```

Excel columns: LogID, TableName, Action, RecordID, FieldChanged, OldValue, NewValue, UserName, Timestamp.

Web columns (expanded, JSONB snapshots): id, user_id, action, entity_type, entity_id, old_data, new_data, created_at.

---

## VBA forms → web forms

| UserForm | Web |
|---|---|
| frmFlockSetup | `/flocks/new` |
| frmDailyMortality | `/mortality/new` |
| frmFeedEntry | `/feed/consumption/new` |
| frmFeedPurchase | `/feed/purchases/new` |
| frmWeighIn | `/weights/new` |
| frmHealthVaccination | `/medicine/treatments/new` |
| frmMedicineStock | `/medicine/lots/new` |
| frmSalesDispatch | `/sales/new` |
| frmExpenseEntry | `/expenses/new` |
| frmOtherIncome | `/income/new` |
| frmDailyRoutine | `/routines/new` |
| frmReportGenerator | `/reports` |
| frmUserLogin | `/login` (Supabase Auth) |

Environment readings have no UserForm; they exist as a register and remain a web module.

---

## ID prefixes (Excel `NextEntryID`)

| Prefix | Table |
|---|---|
| FLK | flocks |
| MORT | mortality |
| FEED | feed consumption |
| FPO | feed purchases |
| WGT | weekly weights |
| HLTH | health |
| SALE | sales |
| EXP | expenses |
| ENV | environment |
| INC | other income |
| RTN | daily routine |
| MED | medicine lots |
