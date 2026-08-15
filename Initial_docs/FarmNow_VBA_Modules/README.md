# Adding the VBA Automation Layer — FarmNow ERP Broiler Management System

`FarmNow_ERP_System.xlsx` is a fully working, formula-driven workbook on its
own: normalized master/register tables, dropdown-validated data entry, a live
KPI dashboard with inventory/expiry alerts, and print-ready reports — open it
and it works with zero setup.

This folder adds the **VBA automation layer**: UserForm-based entry (so
nobody types into a register directly), automatic audit logging, and
one-click PDF report export. Excel's `.frm` UserForm files are binary and can
only be created inside the VBA editor itself, so instead of a black-box file,
everything here is plain, readable, importable code.

## Setup (about 35–45 minutes, one time — 14 forms now)

1. **Save the workbook as macro-enabled.** Open `FarmNow_ERP_System.xlsx`
   in Excel, then **File > Save As**, choose **Excel Macro-Enabled Workbook (*.xlsm)**.
2. **Open the VBA editor:** `Alt` + `F11`.
3. **Import the modules** (right-click the project name > **Import File...**), one at a time:
   - `modMain.bas`
   - `modUtilities.bas`
   - `modValidation.bas`
   - `modMasterData.bas`
   - `modEntryHandlers.bas`
   - `modReportBuilder.bas`
   - `modDashboard.bas`
   - `modSecurity.bas`
   - `clsAuditLogger.cls`
4. **Add the workbook-level event code:** double-click **ThisWorkbook** in the
   Project Explorer and paste in the contents of `ThisWorkbook.cls.txt`
   (don't import this one as a file — it has to live inside the existing
   ThisWorkbook object, not a new module).
5. **Build the UserForms** using `UserForm_Instructions.md` — for each form,
   `Insert > UserForm`, add the listed controls with the exact names given,
   then paste in the matching code. **14 forms** total, each about 5 minutes:
   `frmDailyMortality`, `frmFeedEntry`, `frmWeighIn`, `frmHealthVaccination`,
   `frmSalesDispatch`, `frmExpenseEntry`, `frmFlockSetup`, `frmDailyRoutine`,
   `frmFeedPurchase`, `frmMedicineStock`, `frmOtherIncome`, `frmReportGenerator`,
   and (optional) `frmUserLogin`.
6. **Wire up the Menu_Nav buttons / Dashboard buttons.** Draw a shape or
   button, right-click **Assign Macro**, and point it at, e.g.:
   - "New Flock Setup" → `frmFlockSetup.Show`
   - "Daily Mortality Entry" → `frmDailyMortality.Show`
   - "Daily Routine Checklist" → `frmDailyRoutine.Show`
   - "Feed Purchases Entry" → `frmFeedPurchase.Show`
   - "Medicine Stock Entry" → `frmMedicineStock.Show`
   - "Other Income Entry" → `frmOtherIncome.Show`
   - "Refresh Dashboard" → `modDashboard.RefreshDashboard`
   - "Generate Report" → `frmReportGenerator.Show`
   (The hyperlink-based navigation already built into `Menu_Nav` still works
   without any of this — the buttons are just a faster, more ERP-like way in.)
7. **Change the default password.** `modMain.bas` has a hardcoded sheet-protection
   password (`Farmnow2026!`) — change this before real deployment, and note that
   VBA project passwords and sheet-protection passwords are a deterrent, not
   strong security; anyone needing real access control should also lock down
   file-level permissions.
8. **Save**, then reopen the workbook — `Workbook_Open` will trigger the login
   prompt and land you on the Dashboard.

## What matches what

Every table/column name inside these modules matches the workbook exactly —
`reg_DailyMortality`, `reg_FeedConsumption`, `mst_Houses[HouseCode]`, and so
on — so nothing needs renaming as long as you don't rename sheets or tables
in the workbook itself. If you do add a **new register** (e.g. `reg_Culling`),
copy the pattern in `modEntryHandlers.SaveDailyMortality` — validate, get a
new ID from `modUtilities.NextEntryID`, unprotect, `ListRows.Add`, re-protect,
log — that's the whole pattern used everywhere.

## What this layer adds vs. the plain workbook

| | Plain workbook (.xlsx) | + VBA layer (.xlsm) |
|---|---|---|
| Data entry | Type into an unlocked cell using the column's dropdown | Pop-up form, Tab-through fields, one Save click |
| Duplicate/range checks | None (Excel's built-in Data Validation only) | Checked in code before the row is written |
| Register sheets | Hidden, but any user who unhides them can edit directly | Hidden **and** protected; only VBA can write, after login |
| Audit trail | None | Every Add logged to `Log_Audit` with user + timestamp |
| Reports | Open the `rpt_*` sheet, change the flock cell yourself | One form, optional one-click PDF export to `/Reports` |
| Login/roles | None | Simple name-based login gate; Entry Clerks can't open Masters |

## Known limitations of this starter layer

- **Login is name-based, not password-authenticated** — see the note at the
  bottom of `modSecurity.bas` for how to extend it.
- **No multi-user file locking** — this is a single-file Excel system; if two
  people have it open at once on a shared drive, normal Excel shared-workbook
  caveats apply. For real concurrent multi-user access, this ERP-style Excel
  approach should eventually graduate to a database-backed system.
- **Calculated columns are set explicitly by VBA, not auto-filled by Excel.**
  Real Excel rejected this workbook's Table `calculatedColumnFormula`
  metadata and deleted the affected rows on repair, so calculated columns
  (e.g. `CumulativeMortality`, `CostZMW`) are plain per-cell formulas, not
  registered Table calculated columns. Every `Save*` routine in
  `modEntryHandlers.bas` explicitly writes the formula into each calculated
  cell when adding a row — that's intentional and required; don't remove
  those lines assuming Excel will auto-fill them, it won't.
