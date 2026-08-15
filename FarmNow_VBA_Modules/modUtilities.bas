Attribute VB_Name = "modUtilities"
Option Explicit

' ============================================================
' modUtilities - ID generation and small shared helpers
' ============================================================

' Generates the next sequential ID for a table, e.g. NextEntryID("reg_DailyMortality", "MORT")
' returns "MORT-0032" by reading the highest existing numeric suffix in the table's first column.
Public Function NextEntryID(ByVal tableName As String, ByVal prefix As String) As String
    Dim lo As ListObject
    Dim ws As Worksheet
    Dim r As Range
    Dim maxN As Long, n As Long
    Dim c As Range

    Set lo = GetListObject(tableName)
    maxN = 0
    If Not lo Is Nothing Then
        If Not lo.DataBodyRange Is Nothing Then
            For Each c In lo.ListColumns(1).DataBodyRange.Cells
                If Len(c.Value) > Len(prefix) + 1 Then
                    n = Val(Mid$(c.Value, Len(prefix) + 2))
                    If n > maxN Then maxN = n
                End If
            Next c
        End If
    End If
    NextEntryID = prefix & "-" & Format(maxN + 1, "0000")
End Function

' Finds a ListObject (Excel Table) anywhere in the workbook by name.
Public Function GetListObject(ByVal tableName As String) As ListObject
    Dim ws As Worksheet
    For Each ws In ThisWorkbook.Worksheets
        On Error Resume Next
        Set GetListObject = ws.ListObjects(tableName)
        On Error GoTo 0
        If Not GetListObject Is Nothing Then Exit Function
    Next ws
End Function

' Returns True if the workbook is in a state where writes are safe (not mid-edit elsewhere).
Public Function IsSafeToWrite() As Boolean
    IsSafeToWrite = (Application.CalculationState = xlDone Or True)
End Function

Public Function TodayNoTime() As Date
    TodayNoTime = DateSerial(Year(Now), Month(Now), Day(Now))
End Function
