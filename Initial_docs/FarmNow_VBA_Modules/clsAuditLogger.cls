VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
END
Attribute VB_Name = "clsAuditLogger"
Attribute VB_GlobalNamespace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit

' ============================================================
' clsAuditLogger - writes one row per Add/Edit/Delete/Generate
' to the very-hidden Log_Audit table.
' Import as a Class Module named exactly "clsAuditLogger" so
' the default-instance calls below (clsAuditLogger.LogEntry)
' work without an explicit New.
' ============================================================

Public Sub LogEntry(ByVal tableName As String, ByVal action As String, ByVal recordID As String, _
                     Optional ByVal fieldChanged As String = "", Optional ByVal oldValue As String = "", _
                     Optional ByVal newValue As String = "")
    On Error GoTo Fail
    Dim ws As Worksheet
    Set ws = ThisWorkbook.Sheets("Log_Audit")

    Dim wasVisible As XlSheetVisibility
    wasVisible = ws.Visible
    ws.Visible = xlSheetVisible   ' veryHidden sheets can still be written to directly; this line is optional

    Dim lo As ListObject
    Set lo = ws.ListObjects("Log_Audit")
    Dim r As ListRow
    Set r = lo.ListRows.Add

    r.Range(1, 1) = "LOG-" & Format(Now, "yyyymmddhhnnss") & "-" & Int(Rnd() * 100)
    r.Range(1, 2) = tableName
    r.Range(1, 3) = action
    r.Range(1, 4) = recordID
    r.Range(1, 5) = fieldChanged
    r.Range(1, 6) = oldValue
    r.Range(1, 7) = newValue
    r.Range(1, 8) = modMain.CurrentUserName
    r.Range(1, 9) = Now

    ws.Visible = wasVisible
    Exit Sub
Fail:
    ' Never let a logging failure block the user's actual save - fail silently.
    Resume Next
End Sub
