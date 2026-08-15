Attribute VB_Name = "modReportBuilder"
Option Explicit

' ============================================================
' modReportBuilder - sets the report's flock selector, then
' displays it or exports it to PDF into a /Reports subfolder
' next to the workbook.
' ============================================================

Public Sub GenerateFlockPerformanceReport(ByVal flockID As String, Optional ByVal exportPDF As Boolean = False)
    Dim ws As Worksheet
    Set ws = ThisWorkbook.Sheets("rpt_FlockPerformance")
    ws.Range("B6").Value = flockID
    ws.Calculate
    ws.Visible = xlSheetVisible
    ws.Activate

    clsAuditLogger.LogEntry "rpt_FlockPerformance", "Generate", flockID, "", "", "Report viewed"

    If exportPDF Then
        ExportSheetToPDF ws, "FlockPerformance", flockID
    End If
End Sub

Public Sub GenerateMortalityReport(ByVal flockID As String, Optional ByVal exportPDF As Boolean = False)
    Dim ws As Worksheet
    Set ws = ThisWorkbook.Sheets("rpt_MortalityTrend")
    ws.Range("B6").Value = flockID
    ws.Calculate
    ws.Visible = xlSheetVisible
    ws.Activate

    clsAuditLogger.LogEntry "rpt_MortalityTrend", "Generate", flockID, "", "", "Report viewed"

    If exportPDF Then
        ExportSheetToPDF ws, "MortalityHealth", flockID
    End If
End Sub

Public Sub GenerateFinancialSummary(Optional ByVal exportPDF As Boolean = False)
    Dim ws As Worksheet
    Set ws = ThisWorkbook.Sheets("rpt_FinancialSummary")
    ws.Calculate
    ws.Visible = xlSheetVisible
    ws.Activate

    clsAuditLogger.LogEntry "rpt_FinancialSummary", "Generate", "ALL", "", "", "Report viewed"

    If exportPDF Then
        ExportSheetToPDF ws, "FinancialSummary", "ALL"
    End If
End Sub

Private Sub ExportSheetToPDF(ByVal ws As Worksheet, ByVal reportType As String, ByVal flockID As String)
    Dim folderPath As String, fileName As String
    folderPath = ThisWorkbook.Path & Application.PathSeparator & "Reports"
    If Dir(folderPath, vbDirectory) = "" Then MkDir folderPath

    fileName = folderPath & Application.PathSeparator & "RPT_" & reportType & "_" & flockID & "_" & _
               Format(Now, "yyyymmdd") & ".pdf"

    On Error GoTo Fail
    ws.ExportAsFixedFormat Type:=xlTypePDF, fileName:=fileName, Quality:=xlQualityStandard, _
                            IncludeDocProperties:=True, IgnorePrintAreas:=False, OpenAfterPublish:=False
    MsgBox "Report exported to:" & vbCrLf & fileName, vbInformation, modMain.APP_TITLE
    Exit Sub
Fail:
    MsgBox "PDF export failed: " & Err.Description, vbExclamation, modMain.APP_TITLE
End Sub
