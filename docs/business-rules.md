# FarmNow Business Rules

Rules are taken from the Excel workbook formulas and VBA (`modValidation`, `modEntryHandlers`). Where the web app must be stricter than Excel for transaction integrity, the difference is labelled **[WEB]**. Where Excel is inconsistent, the discrepancy is labelled **[EXCEL DISCREPANCY]**.

All money is **ZMW**. Do not use floating-point types for monetary values.

---

## Identity and status

1. Every flock, house, breed, feed type, product, supplier, customer, and employee must exist in master data before it can be referenced by a transaction.
2. Flock status values are `Active` or `Closed`. New flocks are created as `Active`.
3. House status values are `Active` or `Inactive`. New flocks may only be placed in an `Active` house.
4. Transactions that target a flock (mortality, feed usage, weights, health, sales, daily routine, medicine lots) require the flock to be **Active**, matching VBA `FlockIsActive`.
5. Transaction rows have `is_active` (Excel `IsActive` Yes/No). Inactive rows are excluded from KPI and stock calculations (soft delete). Excel sample data is all `Yes`; VBA always writes `Yes`.
6. Dates cannot be in the future (`IsDateNotFuture`).
7. Human-readable codes keep Excel prefixes (`FLK-0001`, `MORT-0001`, …) and are unique.

---

## Flock quantity

8. `initial_bird_count` must be an integer between 1 and 1,000,000 (VBA `SaveFlockSetup`).
9. **Excel CurrentBirds** = `InitialBirdCount − TotalMortality`. Sales are **not** subtracted. Livability uses this figure.
10. **[WEB] Operational remaining birds** = `InitialBirdCount − TotalMortality − BirdsSold` (active rows only). Used to validate new mortality and sales so the flock cannot go negative.
11. A flock’s operational remaining quantity cannot be negative.
12. **[EXCEL DISCREPANCY]** VBA `MortalityExceedsRemaining` compares mortality to `InitialBirdCount` only, ignoring sales. The web app uses operational remaining (rule 10).
13. **[EXCEL DISCREPANCY]** `DaysOnFarm` = `TODAY() − PlacedDate` even after a flock is Closed, so closed flocks keep aging. The web KPI view matches this Excel formula.

---

## Mortality

14. Mortality count must be a positive integer (Excel allows 0 via data entry; VBA does not explicitly reject 0; web requires `>= 1` for a new entry, `>= 0` at the database check).
15. Mortality count must not exceed operational remaining birds (rule 10).
16. At most one mortality entry per flock per date (`IsDuplicateFlockDate`).
17. Cause must be a `MortalityCause` lookup value.
18. Cumulative mortality on a row = sum of that flock’s mortality on dates `<=` the row date.
19. Mortality % (dashboard, active flocks) = `1 − livability`.
20. Livability = `(Initial − TotalMortality) / Initial`. Target default `0.95`.

---

## Feed

21. Consumption `kg_used` must be in `0.1 … 100000` (VBA).
22. Consumption cost = `ROUND(kg_used * feed_types.unit_cost_per_kg, 2)`. **Not** the purchase price of that batch.
23. Purchase `number_of_bags` must be in `1 … 100000`.
24. Purchase total weight = `bags * bag_weight_kg`.
25. Purchase total cost = `ROUND(bags * unit_cost_per_bag, 2)`.
26. Feed stock opening is **0** (Excel `OpeningStockKg = 0`).
27. Feed balance = `0 + purchased_kg − used_kg`.
28. **[WEB]** Consumption must not drive feed balance below zero. Excel does not prevent this.
29. Low-stock alert when `balance_kg < min_stock_kg`.

---

## Weights and FCR / ADG

30. Average body weight must be in `10 … 6000` grams (VBA).
31. Row-level `AgeDays` = weigh date − placed date.
32. Row-level `ADG_g` = `AvgBodyWeightG / AgeDays` (`IFERROR(..., 0)`).
33. KPI `ADG_g` = `LatestAvgWeightG / DaysOnFarm` (different denominator from rule 32).
34. KPI `FCR` = `TotalFeedKg / (CurrentBirds * LatestAvgWeightG / 1000)`. If denominator is 0, FCR is 0.
35. **[EXCEL DISCREPANCY]** FCR uses Excel CurrentBirds (rule 9), not operational remaining, so a sold-out closed flock can still show a non-zero FCR based on birds-not-yet-dead.
36. Breed `StandardFCR` / `StandardADG_g` are comparison targets on the flock performance report only; they are not used in the KPI engine.

---

## Medicine

37. `quantity_used` cannot exceed `quantity_received` (VBA).
38. Lot balance = `received − used`.
39. Lot total cost = `ROUND(received * unit_cost, 2)` (costed on received qty, not used qty).
40. Expiry status:
    - `EXPIRED` if `today > expiry_date`
    - `EXPIRING SOON` if `expiry_date − today <= MedicineExpiryWarningDays` (default 30)
    - else `OK`
41. Health/vaccination entries require an Active flock and a product. Dosage is free text. Route is a lookup.

---

## Sales

42. Total value = `ROUND(IF(price_per_bird > 0, birds * price_per_bird, live_weight_kg * price_per_kg) + transport_cost, 2)`.
    Pricing is **per-bird if price_per_bird > 0**, otherwise per kg.
43. Outstanding balance = `total_value − amount_paid`. Excel does not constrain outstanding ≥ 0.
44. **[WEB]** Birds dispatched cannot exceed operational remaining birds. Excel VBA does not check this.
45. **[WEB]** Sales require an Active flock (same as other flock transactions). Excel VBA `SaveSalesDispatch` does not call `FlockIsActive`.

---

## Expenses and income

46. Expense amount = `ROUND(quantity * unit_cost, 2)`.
47. Expense `FlockID` may be a flock code or the literal `"Overhead"`. Overhead is stored as `flock_id = NULL`.
48. Supplier on an expense is optional.
49. Other income amount must be in `0.01 … 10,000,000`.
50. **Estimated profit does not include other income.** Profit = sales − expenses − feed cost − medicine cost.
51. Cost per bird = `(expenses + feed cost + medicine cost) / initial_birds`.
52. Cost per kg live weight = `(expenses + feed cost + medicine cost) / (CurrentBirds * LatestAvgWeightG / 1000)`.
53. Break-even price per bird = `totalCost / IF(birds_sold > 0, birds_sold, initial_birds)`.

---

## Dashboard alerts

54. Only **Active** flocks generate flock alerts.
55. If livability `< TargetLivabilityPct` (0.95) → “Livability below target - investigate mortality”.
56. Else if FCR `> TargetFCR` (1.7) → “FCR above target - review feed efficiency”.
57. Else → “Within normal range”.
58. `MortalityAlertThresholdPct` (0.02) is displayed as the mortality scorecard target; it is **not** used in the flock alert formula.

---

## Daily routine and environment

59. Daily routine is per flock; environment readings are per house.
60. Yes/No fields: WaterAvailable, FeedAvailable, DrinkersCleaned.
61. Litter: Dry, Damp, Wet, Needs Changing. Ventilation: Good, Fair, Poor.

---

## Audit

62. Create / update / delete of transactional records, inventory-affecting feed and medicine movements, sales, purchases, mortality, and report generation are written to `audit_logs`.
63. A logging failure must not block the user’s save (Excel `clsAuditLogger` fails silently). Web logs errors server-side but still returns the saved record.

---

## Import

64. Excel import must parse → validate against these rules → preview → confirm → insert. Invalid rows are rejected before any insert of that batch.
