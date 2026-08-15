Attribute VB_Name = "modEntryHandlers"
Option Explicit

' ============================================================
' modEntryHandlers - one Save routine per register.
' Each: validates -> unprotects sheet -> writes one Table row
' -> re-protects -> logs to Log_Audit -> returns True/False.
' Wire each frmXxx's "Save" button Click event to call these.
' ============================================================

Public Function SaveDailyMortality(ByVal flockID As String, ByVal entryDate As Date, _
                                    ByVal mortalityCount As Long, ByVal cause As String) As Boolean
    On Error GoTo Fail
    If Not modValidation.IsNonBlank(flockID) Then GoTo Invalid
    If Not modValidation.FlockIsActive(flockID) Then
        MsgBox "That flock is not Active.", vbExclamation, modMain.APP_TITLE: Exit Function
    End If
    If Not modValidation.IsDateNotFuture(entryDate) Then
        MsgBox "Date cannot be in the future.", vbExclamation, modMain.APP_TITLE: Exit Function
    End If
    If modValidation.IsDuplicateFlockDate("reg_DailyMortality", flockID, entryDate) Then
        MsgBox "A mortality entry for this flock and date already exists.", vbExclamation, modMain.APP_TITLE
        Exit Function
    End If
    If modValidation.MortalityExceedsRemaining(flockID, mortalityCount) Then
        MsgBox "Mortality count exceeds the number of birds remaining in this flock.", vbExclamation, modMain.APP_TITLE
        Exit Function
    End If

    Dim newID As String
    newID = modUtilities.NextEntryID("reg_DailyMortality", "MORT")

    modMain.SetSheetProtection "reg_DailyMortality", False
    Dim lo As ListObject, r As ListRow
    Set lo = modUtilities.GetListObject("reg_DailyMortality")
    Set r = lo.ListRows.Add
    Dim rr As Long: rr = r.Range(1, 1).Row
    r.Range(1, lo.ListColumns("EntryID").Index) = newID
    r.Range(1, lo.ListColumns("FlockID").Index) = flockID
    r.Range(1, lo.ListColumns("Date").Index) = entryDate
    r.Range(1, lo.ListColumns("MortalityCount").Index) = mortalityCount
    r.Range(1, lo.ListColumns("Cause").Index) = cause
    r.Range(1, lo.ListColumns("EnteredBy").Index) = modMain.CurrentUserName
    r.Range(1, lo.ListColumns("IsActive").Index) = "Yes"
    ' Plain same-row cell references (B<row>, C<row>) - NOT [@Column] structured
    ' self-references. Those looked correct but broke real Excel in testing;
    ' this pattern is the same one proven safe in the workbook itself.
    r.Range(1, lo.ListColumns("CumulativeMortality").Index).Formula = _
        "=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],B" & rr & ",reg_DailyMortality[Date],""<=""&C" & rr & ")"
    modMain.SetSheetProtection "reg_DailyMortality", True

    clsAuditLogger.LogEntry "reg_DailyMortality", "Add", newID, "", "", CStr(mortalityCount)
    SaveDailyMortality = True
    Exit Function

Invalid:
    MsgBox "Please select a flock.", vbExclamation, modMain.APP_TITLE
    Exit Function
Fail:
    modMain.SetSheetProtection "reg_DailyMortality", True
    MsgBox "Save failed: " & Err.Description, vbCritical, modMain.APP_TITLE
End Function

Public Function SaveFeedConsumption(ByVal flockID As String, ByVal entryDate As Date, _
                                     ByVal feedID As Long, ByVal kgUsed As Double) As Boolean
    On Error GoTo Fail
    If Not modValidation.FlockIsActive(flockID) Then
        MsgBox "That flock is not Active.", vbExclamation, modMain.APP_TITLE: Exit Function
    End If
    If Not modValidation.IsWithinRange(kgUsed, 0.1, 100000) Then
        MsgBox "Kg used must be a positive number.", vbExclamation, modMain.APP_TITLE: Exit Function
    End If

    Dim newID As String
    newID = modUtilities.NextEntryID("reg_FeedConsumption", "FEED")

    modMain.SetSheetProtection "reg_FeedConsumption", False
    Dim lo As ListObject, r As ListRow
    Set lo = modUtilities.GetListObject("reg_FeedConsumption")
    Set r = lo.ListRows.Add
    Dim rr As Long: rr = r.Range(1, 1).Row
    r.Range(1, lo.ListColumns("EntryID").Index) = newID
    r.Range(1, lo.ListColumns("FlockID").Index) = flockID
    r.Range(1, lo.ListColumns("Date").Index) = entryDate
    r.Range(1, lo.ListColumns("FeedID").Index) = feedID
    r.Range(1, lo.ListColumns("KgUsed").Index) = kgUsed
    r.Range(1, lo.ListColumns("EnteredBy").Index) = modMain.CurrentUserName
    r.Range(1, lo.ListColumns("IsActive").Index) = "Yes"
    r.Range(1, lo.ListColumns("CostZMW").Index).Formula = _
        "=ROUND(E" & rr & "*INDEX(mst_FeedTypes[UnitCostPerKg_ZMW],MATCH(D" & rr & ",mst_FeedTypes[FeedID],0)),2)"
    r.Range(1, lo.ListColumns("RunningTotalKg").Index).Formula = _
        "=SUMIFS(reg_FeedConsumption[KgUsed],reg_FeedConsumption[FlockID],B" & rr & ",reg_FeedConsumption[Date],""<=""&C" & rr & ")"
    modMain.SetSheetProtection "reg_FeedConsumption", True

    clsAuditLogger.LogEntry "reg_FeedConsumption", "Add", newID, "", "", CStr(kgUsed)
    SaveFeedConsumption = True
    Exit Function
Fail:
    modMain.SetSheetProtection "reg_FeedConsumption", True
    MsgBox "Save failed: " & Err.Description, vbCritical, modMain.APP_TITLE
End Function

Public Function SaveWeeklyWeight(ByVal flockID As String, ByVal entryDate As Date, _
                                  ByVal weekNo As Integer, ByVal sampleSize As Long, _
                                  ByVal avgWeightG As Double) As Boolean
    On Error GoTo Fail
    If Not modValidation.IsWithinRange(avgWeightG, 10, 6000) Then
        MsgBox "Average body weight looks out of range.", vbExclamation, modMain.APP_TITLE: Exit Function
    End If

    Dim newID As String
    newID = modUtilities.NextEntryID("reg_WeeklyWeights", "WGT")

    modMain.SetSheetProtection "reg_WeeklyWeights", False
    Dim lo As ListObject, r As ListRow
    Set lo = modUtilities.GetListObject("reg_WeeklyWeights")
    Set r = lo.ListRows.Add
    Dim rr As Long: rr = r.Range(1, 1).Row
    r.Range(1, lo.ListColumns("EntryID").Index) = newID
    r.Range(1, lo.ListColumns("FlockID").Index) = flockID
    r.Range(1, lo.ListColumns("Date").Index) = entryDate
    r.Range(1, lo.ListColumns("WeekNo").Index) = weekNo
    r.Range(1, lo.ListColumns("SampleSize").Index) = sampleSize
    r.Range(1, lo.ListColumns("AvgBodyWeightG").Index) = avgWeightG
    r.Range(1, lo.ListColumns("EnteredBy").Index) = modMain.CurrentUserName
    r.Range(1, lo.ListColumns("IsActive").Index) = "Yes"
    r.Range(1, lo.ListColumns("AgeDays").Index).Formula = _
        "=C" & rr & "-INDEX(reg_Flocks[PlacedDate],MATCH(B" & rr & ",reg_Flocks[FlockID],0))"
    r.Range(1, lo.ListColumns("ADG_g").Index).Formula = "=IFERROR(F" & rr & "/G" & rr & ",0)"
    modMain.SetSheetProtection "reg_WeeklyWeights", True

    clsAuditLogger.LogEntry "reg_WeeklyWeights", "Add", newID, "", "", CStr(avgWeightG)
    SaveWeeklyWeight = True
    Exit Function
Fail:
    modMain.SetSheetProtection "reg_WeeklyWeights", True
    MsgBox "Save failed: " & Err.Description, vbCritical, modMain.APP_TITLE
End Function

Public Function SaveHealthEntry(ByVal flockID As String, ByVal entryDate As Date, _
                                 ByVal productID As Long, ByVal dosage As String, ByVal route As String) As Boolean
    On Error GoTo Fail
    Dim newID As String
    newID = modUtilities.NextEntryID("reg_Vaccination_Health", "HLTH")

    modMain.SetSheetProtection "reg_Vaccination_Health", False
    Dim lo As ListObject, r As ListRow
    Set lo = modUtilities.GetListObject("reg_Vaccination_Health")
    Set r = lo.ListRows.Add
    Dim rr As Long: rr = r.Range(1, 1).Row
    r.Range(1, lo.ListColumns("EntryID").Index) = newID
    r.Range(1, lo.ListColumns("FlockID").Index) = flockID
    r.Range(1, lo.ListColumns("Date").Index) = entryDate
    r.Range(1, lo.ListColumns("ProductID").Index) = productID
    r.Range(1, lo.ListColumns("DosageGiven").Index) = dosage
    r.Range(1, lo.ListColumns("Route").Index) = route
    r.Range(1, lo.ListColumns("AdministeredBy").Index) = modMain.CurrentUserName
    r.Range(1, lo.ListColumns("IsActive").Index) = "Yes"
    r.Range(1, lo.ListColumns("RankInFlock").Index).Formula = _
        "=COUNTIFS(reg_Vaccination_Health[FlockID],B" & rr & ",reg_Vaccination_Health[EntryID],""<=""&A" & rr & ")"
    r.Range(1, lo.ListColumns("CompositeKey").Index).Formula = "=B" & rr & "&""-""&I" & rr
    modMain.SetSheetProtection "reg_Vaccination_Health", True

    clsAuditLogger.LogEntry "reg_Vaccination_Health", "Add", newID, "", "", dosage
    SaveHealthEntry = True
    Exit Function
Fail:
    modMain.SetSheetProtection "reg_Vaccination_Health", True
    MsgBox "Save failed: " & Err.Description, vbCritical, modMain.APP_TITLE
End Function

Public Function SaveSalesDispatch(ByVal flockID As String, ByVal entryDate As Date, ByVal customerID As Long, _
                                   ByVal birdsDispatched As Long, ByVal liveWeightKg As Double, _
                                   ByVal pricePerKg As Double, ByVal pricePerBird As Double, ByVal transportCost As Double, _
                                   ByVal amountPaid As Double, ByVal invoiceNo As String) As Boolean
    On Error GoTo Fail
    Dim newID As String
    newID = modUtilities.NextEntryID("reg_Sales_Dispatch", "SALE")

    modMain.SetSheetProtection "reg_Sales_Dispatch", False
    Dim lo As ListObject, r As ListRow
    Set lo = modUtilities.GetListObject("reg_Sales_Dispatch")
    Set r = lo.ListRows.Add
    Dim rr As Long: rr = r.Range(1, 1).Row
    r.Range(1, lo.ListColumns("EntryID").Index) = newID
    r.Range(1, lo.ListColumns("FlockID").Index) = flockID
    r.Range(1, lo.ListColumns("Date").Index) = entryDate
    r.Range(1, lo.ListColumns("CustomerID").Index) = customerID
    r.Range(1, lo.ListColumns("BirdsDispatched").Index) = birdsDispatched
    r.Range(1, lo.ListColumns("TotalLiveWeightKg").Index) = liveWeightKg
    r.Range(1, lo.ListColumns("PricePerKg_ZMW").Index) = pricePerKg
    r.Range(1, lo.ListColumns("PricePerBird_ZMW").Index) = pricePerBird   ' 0 if pricing by weight instead
    r.Range(1, lo.ListColumns("TransportCost_ZMW").Index) = transportCost
    r.Range(1, lo.ListColumns("AmountPaid_ZMW").Index) = amountPaid
    r.Range(1, lo.ListColumns("InvoiceNo").Index) = invoiceNo
    r.Range(1, lo.ListColumns("EnteredBy").Index) = modMain.CurrentUserName
    r.Range(1, lo.ListColumns("IsActive").Index) = "Yes"
    r.Range(1, lo.ListColumns("TotalValue_ZMW").Index).Formula = _
        "=ROUND(IF(H" & rr & ">0,E" & rr & "*H" & rr & ",F" & rr & "*G" & rr & ")+I" & rr & ",2)"
    r.Range(1, lo.ListColumns("OutstandingBalance_ZMW").Index).Formula = "=J" & rr & "-K" & rr
    modMain.SetSheetProtection "reg_Sales_Dispatch", True

    clsAuditLogger.LogEntry "reg_Sales_Dispatch", "Add", newID, "", "", invoiceNo
    SaveSalesDispatch = True
    Exit Function
Fail:
    modMain.SetSheetProtection "reg_Sales_Dispatch", True
    MsgBox "Save failed: " & Err.Description, vbCritical, modMain.APP_TITLE
End Function

Public Function SaveExpense(ByVal flockID As String, ByVal entryDate As Date, ByVal category As String, _
                             ByVal supplierID As Variant, ByVal quantity As Double, ByVal unitCost As Double, _
                             ByVal paymentMethod As String, ByVal paymentRef As String, ByVal approvedBy As String) As Boolean
    On Error GoTo Fail
    Dim newID As String
    newID = modUtilities.NextEntryID("reg_Expenses", "EXP")

    modMain.SetSheetProtection "reg_Expenses", False
    Dim lo As ListObject, r As ListRow
    Set lo = modUtilities.GetListObject("reg_Expenses")
    Set r = lo.ListRows.Add
    Dim rr As Long: rr = r.Range(1, 1).Row
    r.Range(1, lo.ListColumns("EntryID").Index) = newID
    r.Range(1, lo.ListColumns("FlockID").Index) = flockID
    r.Range(1, lo.ListColumns("Date").Index) = entryDate
    r.Range(1, lo.ListColumns("ExpenseCategory").Index) = category
    If Not IsEmpty(supplierID) Then r.Range(1, lo.ListColumns("SupplierID").Index) = supplierID
    r.Range(1, lo.ListColumns("Quantity").Index) = quantity
    r.Range(1, lo.ListColumns("UnitCost_ZMW").Index) = unitCost
    r.Range(1, lo.ListColumns("PaymentMethod").Index) = paymentMethod
    r.Range(1, lo.ListColumns("PaymentRef").Index) = paymentRef
    r.Range(1, lo.ListColumns("ApprovedBy").Index) = approvedBy
    r.Range(1, lo.ListColumns("EnteredBy").Index) = modMain.CurrentUserName
    r.Range(1, lo.ListColumns("IsActive").Index) = "Yes"
    r.Range(1, lo.ListColumns("Amount_ZMW").Index).Formula = "=ROUND(F" & rr & "*G" & rr & ",2)"
    modMain.SetSheetProtection "reg_Expenses", True

    clsAuditLogger.LogEntry "reg_Expenses", "Add", newID, "", "", CStr(quantity * unitCost)
    SaveExpense = True
    Exit Function
Fail:
    modMain.SetSheetProtection "reg_Expenses", True
    MsgBox "Save failed: " & Err.Description, vbCritical, modMain.APP_TITLE
End Function

Public Function SaveDailyRoutine(ByVal flockID As String, ByVal entryDate As Date, ByVal temperatureC As Double, _
                                  ByVal humidityPct As Double, ByVal waterAvailable As String, ByVal feedAvailable As String, _
                                  ByVal drinkersCleaned As String, ByVal litterCondition As String, ByVal ventilation As String, _
                                  ByVal sickBirdsObserved As Long, ByVal employeeID As Variant, ByVal notes As String) As Boolean
    On Error GoTo Fail
    Dim newID As String
    newID = modUtilities.NextEntryID("reg_DailyRoutine", "RTN")

    modMain.SetSheetProtection "reg_DailyRoutine", False
    Dim lo As ListObject, r As ListRow
    Set lo = modUtilities.GetListObject("reg_DailyRoutine")
    Set r = lo.ListRows.Add
    r.Range(1, lo.ListColumns("EntryID").Index) = newID
    r.Range(1, lo.ListColumns("FlockID").Index) = flockID
    r.Range(1, lo.ListColumns("Date").Index) = entryDate
    r.Range(1, lo.ListColumns("TemperatureC").Index) = temperatureC
    r.Range(1, lo.ListColumns("HumidityPct").Index) = humidityPct
    r.Range(1, lo.ListColumns("WaterAvailable").Index) = waterAvailable
    r.Range(1, lo.ListColumns("FeedAvailable").Index) = feedAvailable
    r.Range(1, lo.ListColumns("DrinkersCleaned").Index) = drinkersCleaned
    r.Range(1, lo.ListColumns("LitterCondition").Index) = litterCondition
    r.Range(1, lo.ListColumns("Ventilation").Index) = ventilation
    r.Range(1, lo.ListColumns("SickBirdsObserved").Index) = sickBirdsObserved
    If Not IsEmpty(employeeID) Then r.Range(1, lo.ListColumns("EmployeeID").Index) = employeeID
    r.Range(1, lo.ListColumns("Notes").Index) = notes
    r.Range(1, lo.ListColumns("IsActive").Index) = "Yes"
    modMain.SetSheetProtection "reg_DailyRoutine", True

    clsAuditLogger.LogEntry "reg_DailyRoutine", "Add", newID, "", "", notes
    SaveDailyRoutine = True
    Exit Function
Fail:
    modMain.SetSheetProtection "reg_DailyRoutine", True
    MsgBox "Save failed: " & Err.Description, vbCritical, modMain.APP_TITLE
End Function

Public Function SaveFeedPurchase(ByVal purchaseDate As Date, ByVal supplierID As Long, ByVal feedID As Long, _
                                  ByVal numberOfBags As Long, ByVal bagWeightKg As Double, ByVal unitCostPerBag As Double, _
                                  ByVal invoiceNo As String, ByVal paymentMethod As String) As Boolean
    On Error GoTo Fail
    If Not modValidation.IsWithinRange(numberOfBags, 1, 100000) Then
        MsgBox "Enter a valid number of bags.", vbExclamation, modMain.APP_TITLE: Exit Function
    End If

    Dim newID As String
    newID = modUtilities.NextEntryID("reg_FeedPurchases", "FPO")

    modMain.SetSheetProtection "reg_FeedPurchases", False
    Dim lo As ListObject, r As ListRow
    Set lo = modUtilities.GetListObject("reg_FeedPurchases")
    Set r = lo.ListRows.Add
    Dim rr As Long: rr = r.Range(1, 1).Row
    r.Range(1, lo.ListColumns("EntryID").Index) = newID
    r.Range(1, lo.ListColumns("Date").Index) = purchaseDate
    r.Range(1, lo.ListColumns("SupplierID").Index) = supplierID
    r.Range(1, lo.ListColumns("FeedID").Index) = feedID
    r.Range(1, lo.ListColumns("NumberOfBags").Index) = numberOfBags
    r.Range(1, lo.ListColumns("BagWeightKg").Index) = bagWeightKg
    r.Range(1, lo.ListColumns("UnitCostPerBag_ZMW").Index) = unitCostPerBag
    r.Range(1, lo.ListColumns("InvoiceNo").Index) = invoiceNo
    r.Range(1, lo.ListColumns("PaymentMethod").Index) = paymentMethod
    r.Range(1, lo.ListColumns("EnteredBy").Index) = modMain.CurrentUserName
    r.Range(1, lo.ListColumns("IsActive").Index) = "Yes"
    r.Range(1, lo.ListColumns("TotalWeightKg").Index).Formula = "=E" & rr & "*F" & rr
    r.Range(1, lo.ListColumns("TotalCost_ZMW").Index).Formula = "=ROUND(E" & rr & "*G" & rr & ",2)"
    modMain.SetSheetProtection "reg_FeedPurchases", True

    clsAuditLogger.LogEntry "reg_FeedPurchases", "Add", newID, "", "", invoiceNo
    SaveFeedPurchase = True
    Exit Function
Fail:
    modMain.SetSheetProtection "reg_FeedPurchases", True
    MsgBox "Save failed: " & Err.Description, vbCritical, modMain.APP_TITLE
End Function

Public Function SaveMedicineStock(ByVal flockID As String, ByVal productID As Long, ByVal supplierID As Long, _
                                   ByVal lotNumber As String, ByVal expiryDate As Date, ByVal quantityReceived As Long, _
                                   ByVal quantityUsed As Long, ByVal unitCost As Double) As Boolean
    On Error GoTo Fail
    If quantityUsed > quantityReceived Then
        MsgBox "Quantity used cannot exceed quantity received.", vbExclamation, modMain.APP_TITLE: Exit Function
    End If

    Dim newID As String
    newID = modUtilities.NextEntryID("reg_MedicineStock", "MED")

    modMain.SetSheetProtection "reg_MedicineStock", False
    Dim lo As ListObject, r As ListRow
    Set lo = modUtilities.GetListObject("reg_MedicineStock")
    Set r = lo.ListRows.Add
    Dim rr As Long: rr = r.Range(1, 1).Row
    r.Range(1, lo.ListColumns("EntryID").Index) = newID
    r.Range(1, lo.ListColumns("FlockID").Index) = flockID
    r.Range(1, lo.ListColumns("ProductID").Index) = productID
    r.Range(1, lo.ListColumns("SupplierID").Index) = supplierID
    r.Range(1, lo.ListColumns("LotNumber").Index) = lotNumber
    r.Range(1, lo.ListColumns("ExpiryDate").Index) = expiryDate
    r.Range(1, lo.ListColumns("QuantityReceived").Index) = quantityReceived
    r.Range(1, lo.ListColumns("QuantityUsed").Index) = quantityUsed
    r.Range(1, lo.ListColumns("UnitCost_ZMW").Index) = unitCost
    r.Range(1, lo.ListColumns("EnteredBy").Index) = modMain.CurrentUserName
    r.Range(1, lo.ListColumns("IsActive").Index) = "Yes"
    r.Range(1, lo.ListColumns("Balance").Index).Formula = "=G" & rr & "-H" & rr
    r.Range(1, lo.ListColumns("TotalCost_ZMW").Index).Formula = "=ROUND(G" & rr & "*J" & rr & ",2)"
    r.Range(1, lo.ListColumns("Status").Index).Formula = _
        "=IF(TODAY()>F" & rr & ",""EXPIRED"",IF(F" & rr & "-TODAY()<=INDEX(mst_Settings[Value],MATCH(""MedicineExpiryWarningDays"",mst_Settings[Parameter],0)),""EXPIRING SOON"",""OK""))"
    modMain.SetSheetProtection "reg_MedicineStock", True

    clsAuditLogger.LogEntry "reg_MedicineStock", "Add", newID, "", "", lotNumber
    SaveMedicineStock = True
    Exit Function
Fail:
    modMain.SetSheetProtection "reg_MedicineStock", True
    MsgBox "Save failed: " & Err.Description, vbCritical, modMain.APP_TITLE
End Function

Public Function SaveOtherIncome(ByVal incomeDate As Date, ByVal source As String, ByVal description As String, _
                                 ByVal amount As Double, ByVal paymentMethod As String, ByVal receivedBy As String) As Boolean
    On Error GoTo Fail
    If Not modValidation.IsWithinRange(amount, 0.01, 10000000) Then
        MsgBox "Enter a valid amount.", vbExclamation, modMain.APP_TITLE: Exit Function
    End If

    Dim newID As String
    newID = modUtilities.NextEntryID("reg_OtherIncome", "INC")

    modMain.SetSheetProtection "reg_OtherIncome", False
    Dim lo As ListObject, r As ListRow
    Set lo = modUtilities.GetListObject("reg_OtherIncome")
    Set r = lo.ListRows.Add
    r.Range(1, lo.ListColumns("EntryID").Index) = newID
    r.Range(1, lo.ListColumns("Date").Index) = incomeDate
    r.Range(1, lo.ListColumns("Source").Index) = source
    r.Range(1, lo.ListColumns("Description").Index) = description
    r.Range(1, lo.ListColumns("Amount_ZMW").Index) = amount
    r.Range(1, lo.ListColumns("PaymentMethod").Index) = paymentMethod
    r.Range(1, lo.ListColumns("ReceivedBy").Index) = receivedBy
    r.Range(1, lo.ListColumns("IsActive").Index) = "Yes"
    modMain.SetSheetProtection "reg_OtherIncome", True

    clsAuditLogger.LogEntry "reg_OtherIncome", "Add", newID, "", "", CStr(amount)
    SaveOtherIncome = True
    Exit Function
Fail:
    modMain.SetSheetProtection "reg_OtherIncome", True
    MsgBox "Save failed: " & Err.Description, vbCritical, modMain.APP_TITLE
End Function

Public Function SaveFlockSetup(ByVal flockID As String, ByVal houseID As Long, ByVal breedID As Long, _
                                ByVal placedDate As Date, ByVal initialBirdCount As Long, ByVal supplierID As Long, _
                                ByVal expectedDispatchDate As Date) As Boolean
    On Error GoTo Fail
    If Not modValidation.IsWithinRange(initialBirdCount, 1, 1000000) Then
        MsgBox "Enter a valid initial bird count.", vbExclamation, modMain.APP_TITLE: Exit Function
    End If

    modMain.SetSheetProtection "reg_Flocks", False
    Dim lo As ListObject, r As ListRow
    Set lo = modUtilities.GetListObject("reg_Flocks")
    Set r = lo.ListRows.Add
    r.Range(1, lo.ListColumns("FlockID").Index) = flockID
    r.Range(1, lo.ListColumns("HouseID").Index) = houseID
    r.Range(1, lo.ListColumns("BreedID").Index) = breedID
    r.Range(1, lo.ListColumns("PlacedDate").Index) = placedDate
    r.Range(1, lo.ListColumns("InitialBirdCount").Index) = initialBirdCount
    r.Range(1, lo.ListColumns("SupplierID").Index) = supplierID
    r.Range(1, lo.ListColumns("ExpectedDispatchDate").Index) = expectedDispatchDate
    r.Range(1, lo.ListColumns("Status").Index) = "Active"
    modMain.SetSheetProtection "reg_Flocks", True

    clsAuditLogger.LogEntry "reg_Flocks", "Add", flockID, "", "", "New flock"
    SaveFlockSetup = True
    Exit Function
Fail:
    modMain.SetSheetProtection "reg_Flocks", True
    MsgBox "Save failed: " & Err.Description, vbCritical, modMain.APP_TITLE
End Function
