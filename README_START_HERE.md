# FarmNow ERP Broiler Management System — Package Contents

## 1. FarmNow_ERP_System.xlsx
The working system. Open it and it works immediately — no setup needed:
- 30 sheets, **29 of them visible as normal tabs** — every master table,
  register, and calc sheet is right there at the bottom of the Excel window.
  Only `Log_Audit` (a system log meant for the VBA layer, not manual editing)
  stays hidden.
- Flock selection is a dropdown (Data Validation list) everywhere it's
  needed. No slicers anywhere in this workbook.
- Dashboard with KPI scorecards, charts, and live inventory/medicine-expiry alerts
- `Menu_Nav` sheet also links directly to every sheet, as a shortcut

Start on the **Dashboard** tab, or use **Menu_Nav** to jump to any sheet, or
just click the sheet tab directly — all three work now.

## 2. FarmNow_VBA_Modules/
Optional automation layer: UserForm-based data entry, audit logging, and
one-click PDF report export, on top of the workbook above.

Start with **FarmNow_VBA_Modules/README.md** for setup steps (~35–45 minutes,
one time): save the workbook as .xlsm, import the modules, build 14 UserForms
following **UserForm_Instructions.md**.

This layer is optional — the .xlsx already works fully on its own with
dropdown-based entry. Add the VBA layer when you want pop-up forms instead.

## What was actually wrong, and what changed (latest round)
Two bugs, both about navigation, not data integrity — the data and formulas
underneath were already correct.

1. **Menu_Nav's hyperlinks were malformed.** They'd been created as an
   external-style relationship pointing at a same-workbook fragment (a
   quirk in how the authoring tool's hyperlink API was used) instead of a
   proper internal same-workbook link. Fixed: hyperlinks are now built the
   correct way (an internal `location` reference, no relationship needed at
   all), confirmed by inspecting the raw XML.

2. **The bigger issue: every register, master table, and calc sheet was
   hidden by default**, reachable only via Menu_Nav's hyperlinks or Excel's
   Unhide dialog. Even with the hyperlinks fixed, Excel does not reliably
   navigate to a hidden sheet when you click a link to it — so the sheets
   were effectively invisible even though they were technically still in
   the file, which is exactly what looked like "sheets are missing."

   **Fix:** every sheet except `Log_Audit` now ships visible. No more
   dependency on hyperlink-to-hidden-sheet behavior, no Unhide dialog
   needed — every register is a normal, always-visible tab.

Re-verified after this fix: zero errors on formula recalculation, a
page-by-page visual render confirming the Dashboard and several registers
(`reg_Flocks`, `reg_DailyMortality`) display correctly with real data and
working calculated columns, and no structural issues (merged-cell overlaps,
orphaned relationships) anywhere in the file.
