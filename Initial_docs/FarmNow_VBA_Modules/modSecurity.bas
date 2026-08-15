Attribute VB_Name = "modSecurity"
Option Explicit

' ============================================================
' modSecurity - login gate + role-based sheet access.
' Pairs with frmUserLogin (see UserForm_Instructions.md).
' This starter version checks the name against mst_Users only
' (no password hashing) - see the note at the bottom for how
' to extend it before real deployment.
' ============================================================

Private Const MAX_ATTEMPTS As Integer = 3

Public Sub Login()
    Dim attempts As Integer
    Dim uname As String
    Dim lo As ListObject, rr As Range

    Set lo = modUtilities.GetListObject("mst_Users")

    Do While attempts < MAX_ATTEMPTS
        uname = Trim$(InputBox("Enter your user name to open " & modMain.APP_TITLE & ":", modMain.APP_TITLE))
        If Len(uname) = 0 Then
            attempts = MAX_ATTEMPTS
            Exit Do
        End If
        If Not lo Is Nothing Then
            If Not lo.DataBodyRange Is Nothing Then
                For Each rr In lo.DataBodyRange.Rows
                    If StrComp(rr.Cells(1, lo.ListColumns("UserName").Index).Value, uname, vbTextCompare) = 0 Then
                        modMain.CurrentUserName = rr.Cells(1, lo.ListColumns("UserName").Index).Value
                        modMain.CurrentUserRole = rr.Cells(1, lo.ListColumns("Role").Index).Value
                        Exit Sub
                    End If
                Next rr
            End If
        End If
        attempts = attempts + 1
        MsgBox "User not recognised (" & attempts & "/" & MAX_ATTEMPTS & ").", vbExclamation, modMain.APP_TITLE
    Loop

    MsgBox "Login failed. Closing workbook.", vbCritical, modMain.APP_TITLE
    ThisWorkbook.Close SaveChanges:=False
End Sub

' Role gate for the hidden master/setting sheets - Entry Clerks cannot open these.
Public Function UserCanAccessSheet(ByVal sheetName As String) As Boolean
    Dim restricted As Boolean
    restricted = (Left$(sheetName, 4) = "mst_") Or sheetName = "Log_Audit"

    If Not restricted Then
        UserCanAccessSheet = True
    Else
        UserCanAccessSheet = (modMain.CurrentUserRole = "Admin" Or modMain.CurrentUserRole = "Supervisor")
    End If
End Function

' ------------------------------------------------------------
' DEPLOYMENT NOTE: this starter checks user name only, so it is
' a light access-control layer, not real authentication. Before
' relying on it, add a PasswordHash column check (e.g. a salted
' hash compared with a hash of the InputBox value) or replace
' Login() with your organisation's SSO/AD check.
' ------------------------------------------------------------
