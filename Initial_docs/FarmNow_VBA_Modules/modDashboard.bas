Attribute VB_Name = "modDashboard"
Option Explicit

' ============================================================
' modDashboard - forces a full recalculation and repaints
' charts/conditional formatting. Wire to the Dashboard's
' "Refresh" button.
' ============================================================

Public Sub RefreshDashboard()
    Application.ScreenUpdating = False
    Application.Calculation = xlCalculationAutomatic
    ThisWorkbook.Sheets("calc_KPI_Engine").Calculate
    ThisWorkbook.Sheets("Dashboard").Calculate
    ThisWorkbook.Sheets("Dashboard").Activate
    Application.ScreenUpdating = True
End Sub
