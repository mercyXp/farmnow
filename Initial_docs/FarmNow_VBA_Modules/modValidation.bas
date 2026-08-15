Attribute VB_Name = "modValidation"
Option Explicit

' ============================================================
' modValidation - reusable checks used by every entry form
' ============================================================

' True if a FlockID + Date combination already exists in the given table
' (used to stop duplicate daily-log entries).
Public Function IsDuplicateFlockDate(ByVal tableName As String, ByVal flockID As String, ByVal entryDate As Date) As Boolean
    Dim lo As ListObject
    Dim r As ListRow
    Dim flockCol As Long, dateCol As Long

    Set lo = modUtilities.GetListObject(tableName)
    If lo Is Nothing Then Exit Function
    If lo.DataBodyRange Is Nothing Then Exit Function

    flockCol = lo.ListColumns("FlockID").Index
    dateCol = lo.ListColumns("Date").Index

    Dim rr As Range
    For Each rr In lo.DataBodyRange.Rows
        If rr.Cells(1, flockCol).Value = flockID And CDate(rr.Cells(1, dateCol).Value) = entryDate Then
            IsDuplicateFlockDate = True
            Exit Function
        End If
    Next rr
End Function

Public Function IsWithinRange(ByVal v As Variant, ByVal lo_ As Double, ByVal hi_ As Double) As Boolean
    IsWithinRange = (IsNumeric(v) And v >= lo_ And v <= hi_)
End Function

Public Function IsNonBlank(ByVal v As Variant) As Boolean
    IsNonBlank = (Len(Trim$(v & "")) > 0)
End Function

Public Function IsDateNotFuture(ByVal d As Variant) As Boolean
    If Not IsDate(d) Then
        IsDateNotFuture = False
    Else
        IsDateNotFuture = (CDate(d) <= modUtilities.TodayNoTime())
    End If
End Function

' Checks that MortalityCount does not exceed the birds currently remaining in the flock.
Public Function MortalityExceedsRemaining(ByVal flockID As String, ByVal newCount As Long) As Boolean
    Dim initBirds As Double, deadSoFar As Double
    On Error Resume Next
    initBirds = Application.WorksheetFunction.Index( _
                    modUtilities.GetListObject("reg_Flocks").ListColumns("InitialBirdCount").DataBodyRange, _
                    Application.WorksheetFunction.Match(flockID, modUtilities.GetListObject("reg_Flocks").ListColumns("FlockID").DataBodyRange, 0))
    deadSoFar = Application.WorksheetFunction.SumIf( _
                    modUtilities.GetListObject("reg_DailyMortality").ListColumns("FlockID").DataBodyRange, _
                    flockID, _
                    modUtilities.GetListObject("reg_DailyMortality").ListColumns("MortalityCount").DataBodyRange)
    On Error GoTo 0
    MortalityExceedsRemaining = (deadSoFar + newCount) > initBirds
End Function

' Confirms a FlockID actually exists (and is Active) in reg_Flocks before allowing an entry.
Public Function FlockIsActive(ByVal flockID As String) As Boolean
    Dim lo As ListObject
    Dim rr As Range
    Set lo = modUtilities.GetListObject("reg_Flocks")
    If lo Is Nothing Or lo.DataBodyRange Is Nothing Then Exit Function
    For Each rr In lo.DataBodyRange.Rows
        If rr.Cells(1, lo.ListColumns("FlockID").Index).Value = flockID Then
            FlockIsActive = (rr.Cells(1, lo.ListColumns("Status").Index).Value = "Active")
            Exit Function
        End If
    Next rr
End Function
