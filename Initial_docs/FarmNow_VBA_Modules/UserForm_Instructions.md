# Building the UserForms

Excel UserForms are stored as a binary layout file (`.frm`/`.frx`) that only the VBA
editor itself can create — they can't be generated outside Excel. So instead of a
form you can't inspect, here is the exact control list and code-behind for each
form. Each takes about 5 minutes to build: **Insert > UserForm**, drop the controls
listed, name them exactly as shown, then paste the code block.

All forms should have a "Save" CommandButton and a "Cancel" CommandButton, and
should call `Unload Me` after a successful save.

---

## frmDailyMortality

**Controls:** `cboFlock` (ComboBox), `txtDate` (TextBox, default = Date), `txtCount`
(TextBox), `cboCause` (ComboBox), `cmdSave` (CommandButton), `cmdCancel` (CommandButton)

```vb
Private Sub UserForm_Initialize()
    modMasterData.LoadActiveFlockCombo cboFlock
    txtDate.Value = Format(Date, "yyyy-mm-dd")
    cboCause.List = Array("Normal Culling", "Heat Stress", "Disease", "Predator", "Cold Stress", "Other")
End Sub

Private Sub cmdSave_Click()
    If cboFlock.ListIndex = -1 Then MsgBox "Select a flock.": Exit Sub
    If Not IsDate(txtDate.Value) Then MsgBox "Enter a valid date.": Exit Sub
    If Not IsNumeric(txtCount.Value) Then MsgBox "Enter a numeric mortality count.": Exit Sub

    If modEntryHandlers.SaveDailyMortality(cboFlock.Value, CDate(txtDate.Value), CLng(txtCount.Value), cboCause.Value) Then
        MsgBox "Saved.", vbInformation
        txtCount.Value = "": cboCause.ListIndex = -1: txtCount.SetFocus
    End If
End Sub

Private Sub cmdCancel_Click()
    Unload Me
End Sub
```

---

## frmFeedEntry

**Controls:** `cboFlock`, `txtDate`, `cboFeed`, `txtKgUsed`, `cmdSave`, `cmdCancel`

```vb
Private Sub UserForm_Initialize()
    modMasterData.LoadActiveFlockCombo cboFlock
    modMasterData.LoadFeedCombo cboFeed
    txtDate.Value = Format(Date, "yyyy-mm-dd")
End Sub

Private Sub cmdSave_Click()
    If cboFlock.ListIndex = -1 Or cboFeed.ListIndex = -1 Then MsgBox "Select flock and feed type.": Exit Sub
    If Not IsNumeric(txtKgUsed.Value) Then MsgBox "Enter Kg used.": Exit Sub

    If modEntryHandlers.SaveFeedConsumption(cboFlock.Value, CDate(txtDate.Value), CLng(cboFeed.Value), CDbl(txtKgUsed.Value)) Then
        MsgBox "Saved.", vbInformation
        txtKgUsed.Value = "": txtKgUsed.SetFocus
    End If
End Sub

Private Sub cmdCancel_Click()
    Unload Me
End Sub
```

---

## frmWeighIn

**Controls:** `cboFlock`, `txtDate`, `txtWeekNo`, `txtSampleSize`, `txtAvgWeightG`, `cmdSave`, `cmdCancel`

```vb
Private Sub UserForm_Initialize()
    modMasterData.LoadActiveFlockCombo cboFlock
    txtDate.Value = Format(Date, "yyyy-mm-dd")
End Sub

Private Sub cmdSave_Click()
    If cboFlock.ListIndex = -1 Then MsgBox "Select a flock.": Exit Sub
    If Not IsNumeric(txtAvgWeightG.Value) Then MsgBox "Enter average weight in grams.": Exit Sub

    If modEntryHandlers.SaveWeeklyWeight(cboFlock.Value, CDate(txtDate.Value), CInt(txtWeekNo.Value), _
                                          CLng(txtSampleSize.Value), CDbl(txtAvgWeightG.Value)) Then
        MsgBox "Saved.", vbInformation
        Unload Me
    End If
End Sub

Private Sub cmdCancel_Click()
    Unload Me
End Sub
```

---

## frmHealthVaccination

**Controls:** `cboFlock`, `txtDate`, `cboProduct`, `txtDosage`, `cboRoute`, `cmdSave`, `cmdCancel`

```vb
Private Sub UserForm_Initialize()
    modMasterData.LoadActiveFlockCombo cboFlock
    modMasterData.LoadProductCombo cboProduct
    cboRoute.List = Array("Eye Drop", "Drinking Water", "Injection", "Spray")
    txtDate.Value = Format(Date, "yyyy-mm-dd")
End Sub

Private Sub cmdSave_Click()
    If cboFlock.ListIndex = -1 Or cboProduct.ListIndex = -1 Then MsgBox "Select flock and product.": Exit Sub

    If modEntryHandlers.SaveHealthEntry(cboFlock.Value, CDate(txtDate.Value), CLng(cboProduct.Value), _
                                         txtDosage.Value, cboRoute.Value) Then
        MsgBox "Saved.", vbInformation
        Unload Me
    End If
End Sub

Private Sub cmdCancel_Click()
    Unload Me
End Sub
```

---

## frmSalesDispatch

**Controls:** `cboFlock`, `txtDate`, `cboCustomer`, `txtBirds`, `txtLiveWeightKg`,
`txtPricePerKg`, `txtPricePerBird` (leave 0 if pricing by weight instead of per-bird),
`txtTransportCost`, `txtAmountPaid`, `txtInvoiceNo`, `cmdSave`, `cmdCancel`

```vb
Private Sub UserForm_Initialize()
    modMasterData.LoadActiveFlockCombo cboFlock
    modMasterData.LoadCustomerCombo cboCustomer
    txtDate.Value = Format(Date, "yyyy-mm-dd")
    txtPricePerBird.Value = "0"
    txtTransportCost.Value = "0"
    txtAmountPaid.Value = "0"
End Sub

Private Sub cmdSave_Click()
    If cboFlock.ListIndex = -1 Or cboCustomer.ListIndex = -1 Then MsgBox "Select flock and customer.": Exit Sub

    If modEntryHandlers.SaveSalesDispatch(cboFlock.Value, CDate(txtDate.Value), CLng(cboCustomer.Value), _
                                           CLng(txtBirds.Value), CDbl(txtLiveWeightKg.Value), _
                                           CDbl(txtPricePerKg.Value), CDbl(txtPricePerBird.Value), _
                                           CDbl(txtTransportCost.Value), CDbl(txtAmountPaid.Value), _
                                           txtInvoiceNo.Value) Then
        MsgBox "Saved. Outstanding balance calculates automatically on the register.", vbInformation
        Unload Me
    End If
End Sub

Private Sub cmdCancel_Click()
    Unload Me
End Sub
```

---

## frmExpenseEntry

**Controls:** `cboFlock` (include "Overhead" as a manual list item alongside flocks),
`txtDate`, `cboCategory`, `cboSupplier`, `txtQuantity` (default "1"), `txtUnitCost`,
`cboPaymentMethod`, `txtPaymentRef`, `txtApprovedBy`, `cmdSave`, `cmdCancel`

```vb
Private Sub UserForm_Initialize()
    modMasterData.LoadActiveFlockCombo cboFlock
    cboFlock.AddItem "Overhead"
    modMasterData.LoadSupplierCombo cboSupplier
    cboCategory.RowSource = ""   ' cleared - loaded from the workbook's centralised list below
    Dim ws As Worksheet: Set ws = ThisWorkbook.Sheets("mst_Lists")
    Dim rng As Range: Set rng = ws.Range("List_ExpenseCategory")
    cboCategory.List = Application.WorksheetFunction.Transpose(rng.Value)
    Dim rng2 As Range: Set rng2 = ws.Range("List_PaymentMethod")
    cboPaymentMethod.List = Application.WorksheetFunction.Transpose(rng2.Value)
    txtDate.Value = Format(Date, "yyyy-mm-dd")
    txtQuantity.Value = "1"
End Sub

Private Sub cmdSave_Click()
    If cboFlock.ListIndex = -1 Then MsgBox "Select a flock or Overhead.": Exit Sub
    If Not IsNumeric(txtUnitCost.Value) Then MsgBox "Enter a unit cost.": Exit Sub

    Dim supplierVal As Variant
    If cboSupplier.ListIndex = -1 Then supplierVal = Empty Else supplierVal = cboSupplier.Value

    If modEntryHandlers.SaveExpense(cboFlock.Value, CDate(txtDate.Value), cboCategory.Value, _
                                     supplierVal, CDbl(txtQuantity.Value), CDbl(txtUnitCost.Value), _
                                     cboPaymentMethod.Value, txtPaymentRef.Value, txtApprovedBy.Value) Then
        MsgBox "Saved.", vbInformation
        Unload Me
    End If
End Sub

Private Sub cmdCancel_Click()
    Unload Me
End Sub
```

*Note on `mst_Lists`:* it's marked hidden, not veryHidden, so `ThisWorkbook.Sheets("mst_Lists")`
can read from it without unhiding. If you'd rather not touch a hidden sheet from a form, just
hardcode `cboCategory.List = Array("Day-Old Chicks", "Bedding/Litter", ...)` matching the values
in `mst_Lists` column A instead — either approach works.

---

## frmFlockSetup (new flock/batch)

**Controls:** `txtFlockID` (auto-filled, locked), `cboHouse`, `cboBreed`, `txtPlacedDate`,
`txtInitialBirds`, `cboSupplier`, `txtExpectedDispatch`, `cmdSave`, `cmdCancel`

```vb
Private Sub UserForm_Initialize()
    modMasterData.LoadHouseCombo cboHouse
    modMasterData.LoadBreedCombo cboBreed
    modMasterData.LoadSupplierCombo cboSupplier
    txtFlockID.Value = modUtilities.NextEntryID("reg_Flocks", "FLK")
    txtFlockID.Locked = True
    txtPlacedDate.Value = Format(Date, "yyyy-mm-dd")
End Sub

Private Sub cmdSave_Click()
    If cboHouse.ListIndex = -1 Or cboBreed.ListIndex = -1 Or cboSupplier.ListIndex = -1 Then
        MsgBox "Select house, breed and supplier.": Exit Sub
    End If
    If modEntryHandlers.SaveFlockSetup(txtFlockID.Value, CLng(cboHouse.Value), CLng(cboBreed.Value), _
                                        CDate(txtPlacedDate.Value), CLng(txtInitialBirds.Value), _
                                        CLng(cboSupplier.Value), CDate(txtExpectedDispatch.Value)) Then
        MsgBox "Flock " & txtFlockID.Value & " created.", vbInformation
        Unload Me
    End If
End Sub

Private Sub cmdCancel_Click()
    Unload Me
End Sub
```

---

## frmDailyRoutine

**Controls:** `cboFlock`, `txtDate`, `txtTemperature`, `txtHumidity`, `cboWaterAvailable`,
`cboFeedAvailable`, `cboDrinkersCleaned` (all three Yes/No), `cboLitterCondition`,
`cboVentilation`, `txtSickBirds` (default "0"), `cboEmployee`, `txtNotes`, `cmdSave`, `cmdCancel`

```vb
Private Sub UserForm_Initialize()
    modMasterData.LoadActiveFlockCombo cboFlock
    modMasterData.LoadEmployeeCombo cboEmployee
    cboWaterAvailable.List = Array("Yes", "No")
    cboFeedAvailable.List = Array("Yes", "No")
    cboDrinkersCleaned.List = Array("Yes", "No")
    cboLitterCondition.List = Array("Dry", "Damp", "Wet", "Needs Changing")
    cboVentilation.List = Array("Good", "Fair", "Poor")
    txtDate.Value = Format(Date, "yyyy-mm-dd")
    txtSickBirds.Value = "0"
End Sub

Private Sub cmdSave_Click()
    If cboFlock.ListIndex = -1 Then MsgBox "Select a flock.": Exit Sub
    If Not IsNumeric(txtTemperature.Value) Then MsgBox "Enter temperature.": Exit Sub

    Dim empVal As Variant
    If cboEmployee.ListIndex = -1 Then empVal = Empty Else empVal = cboEmployee.Value

    If modEntryHandlers.SaveDailyRoutine(cboFlock.Value, CDate(txtDate.Value), CDbl(txtTemperature.Value), _
                                          CDbl(txtHumidity.Value), cboWaterAvailable.Value, cboFeedAvailable.Value, _
                                          cboDrinkersCleaned.Value, cboLitterCondition.Value, cboVentilation.Value, _
                                          CLng(txtSickBirds.Value), empVal, txtNotes.Value) Then
        MsgBox "Saved.", vbInformation
        txtNotes.Value = "": txtSickBirds.Value = "0": txtTemperature.SetFocus
    End If
End Sub

Private Sub cmdCancel_Click()
    Unload Me
End Sub
```

---

## frmFeedPurchase

**Controls:** `txtDate`, `cboSupplier`, `cboFeed`, `txtNumberOfBags`, `txtBagWeightKg` (default "50"),
`txtUnitCostPerBag`, `txtInvoiceNo`, `cboPaymentMethod`, `cmdSave`, `cmdCancel`

```vb
Private Sub UserForm_Initialize()
    modMasterData.LoadSupplierCombo cboSupplier
    modMasterData.LoadFeedCombo cboFeed
    cboPaymentMethod.List = Array("Cash", "Mobile Money", "Bank Transfer", "Cheque", "Credit")
    txtDate.Value = Format(Date, "yyyy-mm-dd")
    txtBagWeightKg.Value = "50"
End Sub

Private Sub cmdSave_Click()
    If cboSupplier.ListIndex = -1 Or cboFeed.ListIndex = -1 Then MsgBox "Select supplier and feed type.": Exit Sub
    If Not IsNumeric(txtNumberOfBags.Value) Then MsgBox "Enter number of bags.": Exit Sub

    If modEntryHandlers.SaveFeedPurchase(CDate(txtDate.Value), CLng(cboSupplier.Value), CLng(cboFeed.Value), _
                                          CLng(txtNumberOfBags.Value), CDbl(txtBagWeightKg.Value), _
                                          CDbl(txtUnitCostPerBag.Value), txtInvoiceNo.Value, cboPaymentMethod.Value) Then
        MsgBox "Saved. Feed Stock Summary balance updates automatically.", vbInformation
        Unload Me
    End If
End Sub

Private Sub cmdCancel_Click()
    Unload Me
End Sub
```

---

## frmMedicineStock

**Controls:** `cboFlock`, `cboProduct`, `cboSupplier`, `txtLotNumber`, `txtExpiryDate`,
`txtQuantityReceived`, `txtQuantityUsed` (default "0"), `txtUnitCost`, `cmdSave`, `cmdCancel`

```vb
Private Sub UserForm_Initialize()
    modMasterData.LoadActiveFlockCombo cboFlock
    modMasterData.LoadProductCombo cboProduct
    modMasterData.LoadSupplierCombo cboSupplier
    txtQuantityUsed.Value = "0"
End Sub

Private Sub cmdSave_Click()
    If cboFlock.ListIndex = -1 Or cboProduct.ListIndex = -1 Or cboSupplier.ListIndex = -1 Then
        MsgBox "Select flock, product and supplier.": Exit Sub
    End If
    If Not IsDate(txtExpiryDate.Value) Then MsgBox "Enter a valid expiry date.": Exit Sub

    If modEntryHandlers.SaveMedicineStock(cboFlock.Value, CLng(cboProduct.Value), CLng(cboSupplier.Value), _
                                           txtLotNumber.Value, CDate(txtExpiryDate.Value), _
                                           CLng(txtQuantityReceived.Value), CLng(txtQuantityUsed.Value), _
                                           CDbl(txtUnitCost.Value)) Then
        MsgBox "Saved. Expiry status calculates automatically on the register.", vbInformation
        Unload Me
    End If
End Sub

Private Sub cmdCancel_Click()
    Unload Me
End Sub
```

---

## frmOtherIncome

**Controls:** `txtDate`, `cboSource`, `txtDescription`, `txtAmount`, `cboPaymentMethod`,
`txtReceivedBy`, `cmdSave`, `cmdCancel`

```vb
Private Sub UserForm_Initialize()
    cboSource.List = Array("Manure Sales", "Empty Bag Sales", "Equipment Rental", "Other")
    cboPaymentMethod.List = Array("Cash", "Mobile Money", "Bank Transfer", "Cheque", "Credit")
    txtDate.Value = Format(Date, "yyyy-mm-dd")
End Sub

Private Sub cmdSave_Click()
    If Not IsNumeric(txtAmount.Value) Then MsgBox "Enter an amount.": Exit Sub

    If modEntryHandlers.SaveOtherIncome(CDate(txtDate.Value), cboSource.Value, txtDescription.Value, _
                                         CDbl(txtAmount.Value), cboPaymentMethod.Value, txtReceivedBy.Value) Then
        MsgBox "Saved.", vbInformation
        Unload Me
    End If
End Sub

Private Sub cmdCancel_Click()
    Unload Me
End Sub
```

---

## frmReportGenerator

**Controls:** `cboReportType` (list: "Flock Performance", "Financial Summary", "Mortality & Health"),
`cboFlock`, `chkExportPDF` (CheckBox), `cmdGenerate`, `cmdCancel`

```vb
Private Sub UserForm_Initialize()
    cboReportType.List = Array("Flock Performance", "Financial Summary", "Mortality & Health")
    modMasterData.LoadActiveFlockCombo cboFlock
End Sub

Private Sub cmdGenerate_Click()
    Select Case cboReportType.Value
        Case "Flock Performance"
            modReportBuilder.GenerateFlockPerformanceReport cboFlock.Value, CBool(chkExportPDF.Value)
        Case "Mortality & Health"
            modReportBuilder.GenerateMortalityReport cboFlock.Value, CBool(chkExportPDF.Value)
        Case "Financial Summary"
            modReportBuilder.GenerateFinancialSummary CBool(chkExportPDF.Value)
    End Select
    Unload Me
End Sub

Private Sub cmdCancel_Click()
    Unload Me
End Sub
```

---

## frmUserLogin (optional GUI version of modSecurity.Login)

The shipped `modSecurity.Login` uses a simple `InputBox`, which needs no form at
all. If you'd rather have a proper login screen, build `frmUserLogin` with
`txtUserName`, `cmdLogin`, and replace the body of `modSecurity.Login` with
`frmUserLogin.Show` and set `modMain.CurrentUserName` from the form instead.
