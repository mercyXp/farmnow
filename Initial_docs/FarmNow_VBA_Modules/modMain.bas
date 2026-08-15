Attribute VB_Name = "modMain"
Option Explicit

' ============================================================
' modMain - Farmnow Limited Broiler Management System
' Central constants + navigation. Import this module FIRST.
' ============================================================

Public Const APP_TITLE As String = "Farmnow Broiler Management System"

' Sheet name constants (must match the workbook exactly)
Public Const SH_DASHBOARD As String = "Dashboard"
Public Const SH_NAV As String = "Menu_Nav"
Public Const SH_LOG As String = "Log_Audit"

Public CurrentUserName As String
Public CurrentUserRole As String

' Call this from ThisWorkbook.Workbook_Open (see ThisWorkbook.cls.txt)
Public Sub InitializeSystem()
    Application.ScreenUpdating = False
    On Error GoTo CleanFail

    modSecurity.Login   ' sets CurrentUserName / CurrentUserRole, or ends the app if login fails

    ThisWorkbook.Sheets(SH_DASHBOARD).Activate
    modDashboard.RefreshDashboard

    Application.ScreenUpdating = True
    Exit Sub
CleanFail:
    Application.ScreenUpdating = True
    MsgBox "Startup error: " & Err.Description, vbCritical, APP_TITLE
End Sub

' Generic navigation handler - assign to a button/shape as: =Nav_GoTo("reg_DailyMortality")
Public Sub Nav_GoTo(ByVal sheetName As String)
    On Error GoTo Fail
    If Not modSecurity.UserCanAccessSheet(sheetName) Then
        MsgBox "You do not have permission to open '" & sheetName & "'.", vbExclamation, APP_TITLE
        Exit Sub
    End If
    With ThisWorkbook.Sheets(sheetName)
        .Visible = xlSheetVisible
        .Activate
    End With
    Exit Sub
Fail:
    MsgBox "Could not open sheet '" & sheetName & "': " & Err.Description, vbExclamation, APP_TITLE
End Sub

' Re-hides a register/master sheet after use (called from a form's Close event, or a Nav button)
Public Sub Nav_RehideAndReturn(ByVal sheetName As String)
    On Error Resume Next
    ThisWorkbook.Sheets(sheetName).Visible = xlSheetHidden
    ThisWorkbook.Sheets(SH_DASHBOARD).Activate
    On Error GoTo 0
End Sub

' Toggles sheet protection off (True) / on (False) - password centralised here.
' NOTE: change PROTECT_PW before deployment.
Private Const PROTECT_PW As String = "Farmnow2026!"

Public Sub SetSheetProtection(ByVal sheetName As String, ByVal protect As Boolean)
    With ThisWorkbook.Sheets(sheetName)
        If protect Then
            .Protect Password:=PROTECT_PW, DrawingObjects:=True, Contents:=True, Scenarios:=True, _
                     AllowFiltering:=True, AllowSorting:=False
        Else
            .Unprotect Password:=PROTECT_PW
        End If
    End With
End Sub
