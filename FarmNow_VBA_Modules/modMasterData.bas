Attribute VB_Name = "modMasterData"
Option Explicit

' ============================================================
' modMasterData - fills UserForm ComboBoxes from mst_/reg_ tables
' Call these from each form's UserForm_Initialize event.
' ============================================================

' Generic loader: fills a 2-column ComboBox (ID bound, Name shown) from any table.
Public Sub LoadComboFromTable(ByVal cbo As MSForms.ComboBox, ByVal tableName As String, _
                               ByVal idColumn As String, ByVal nameColumn As String, _
                               Optional ByVal statusColumn As String = "", _
                               Optional ByVal statusValue As String = "Active")
    Dim lo As ListObject
    Dim rr As Range
    Dim idIdx As Long, nameIdx As Long, statIdx As Long

    Set lo = modUtilities.GetListObject(tableName)
    cbo.Clear
    cbo.ColumnCount = 2
    cbo.ColumnWidths = "0 pt;120 pt"   ' hide the ID column, show the name

    If lo Is Nothing Then Exit Sub
    If lo.DataBodyRange Is Nothing Then Exit Sub

    idIdx = lo.ListColumns(idColumn).Index
    nameIdx = lo.ListColumns(nameColumn).Index
    If Len(statusColumn) > 0 Then statIdx = lo.ListColumns(statusColumn).Index

    For Each rr In lo.DataBodyRange.Rows
        If Len(statusColumn) = 0 Or rr.Cells(1, statIdx).Value = statusValue Then
            cbo.AddItem rr.Cells(1, idIdx).Value
            cbo.List(cbo.ListCount - 1, 1) = rr.Cells(1, nameIdx).Value
        End If
    Next rr
End Sub

Public Sub LoadHouseCombo(ByVal cbo As MSForms.ComboBox)
    LoadComboFromTable cbo, "mst_Houses", "HouseID", "HouseCode", "Status", "Active"
End Sub

Public Sub LoadBreedCombo(ByVal cbo As MSForms.ComboBox)
    LoadComboFromTable cbo, "mst_Breeds", "BreedID", "BreedName"
End Sub

Public Sub LoadFeedCombo(ByVal cbo As MSForms.ComboBox)
    LoadComboFromTable cbo, "mst_FeedTypes", "FeedID", "FeedName"
End Sub

Public Sub LoadSupplierCombo(ByVal cbo As MSForms.ComboBox)
    LoadComboFromTable cbo, "mst_Suppliers", "SupplierID", "SupplierName"
End Sub

Public Sub LoadCustomerCombo(ByVal cbo As MSForms.ComboBox)
    LoadComboFromTable cbo, "mst_Customers", "CustomerID", "CustomerName"
End Sub

Public Sub LoadProductCombo(ByVal cbo As MSForms.ComboBox)
    LoadComboFromTable cbo, "mst_Vaccines_Meds", "ProductID", "ProductName"
End Sub

' Active-flock selector: FlockID is both bound value and display text.
Public Sub LoadActiveFlockCombo(ByVal cbo As MSForms.ComboBox)
    Dim lo As ListObject
    Dim rr As Range
    Set lo = modUtilities.GetListObject("reg_Flocks")
    cbo.Clear
    cbo.ColumnCount = 1
    If lo Is Nothing Then Exit Sub
    If lo.DataBodyRange Is Nothing Then Exit Sub
    For Each rr In lo.DataBodyRange.Rows
        If rr.Cells(1, lo.ListColumns("Status").Index).Value = "Active" Then
            cbo.AddItem rr.Cells(1, lo.ListColumns("FlockID").Index).Value
        End If
    Next rr
End Sub

Public Sub LoadEmployeeCombo(ByVal cbo As MSForms.ComboBox)
    LoadComboFromTable cbo, "mst_Employees", "EmployeeID", "EmployeeName", "Status", "Active"
End Sub
