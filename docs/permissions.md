# FarmNow ERP permissions

Single-company RBAC. Canonical database values are lowercase. UI labels use the friendly names below.

| Database value | UI label |
|---|---|
| `superadmin` | Superadmin |
| `admin` | Admin |
| `manager` | Manager |
| `supervisor` | Supervisor |
| `accountant` | Accountant |
| `entry_clerk` | Entry Clerk |

The first Auth user (when no Superadmin exists) is assigned `superadmin`. Later users start as `entry_clerk` until an authorised administrator assigns a role. Role is never taken from client-supplied Auth metadata.

## Matrix

| Feature | Superadmin | Admin | Manager | Supervisor | Accountant | Entry Clerk |
|---|---:|---:|---:|---:|---:|---:|
| Dashboard | Executive | Operations | Management | Farm ops | Financial | Data entry |
| View flocks | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create / close flock | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Mortality | ✓ | ✓ | View | ✓ | ✗ | ✓ |
| Feed usage | ✓ | ✓ | View | ✓ | ✗ | ✓ |
| Feed purchases | ✓ | ✓ | View | ✗ | ✓ | ✓ |
| Medicine | ✓ | ✓ | View | ✓ | ✗ | ✓ |
| Inventory | ✓ | ✓ | View | ✓ | Limited | ✓ |
| Sales | ✓ | ✓ | View | ✗ | ✓ | ✓ |
| Expenses | ✓ | ✓ | View | ✗ | ✓ | ✓ |
| Purchases | ✓ | ✓ | View | ✗ | ✓ | ✓ |
| Other income | ✓ | ✓ | View | ✗ | ✓ | ✗ |
| Financial reports / profit | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ |
| Operational reports | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Master data | ✓ | ✓ | View | View (ops) | Customers/suppliers | View (dropdowns) |
| Company settings | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Excel import | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| User management | ✓ | Lower roles only | ✗ | ✗ | ✗ | ✗ |
| Audit logs | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Edit / delete historical transactions | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |

Manager is read-only on transactions. Entry Clerk can create daily entries but cannot change or deactivate historical transactions. Admin cannot change company KPI/settings keys, cannot assign `superadmin` or `admin`, and cannot edit Superadmin accounts. Reports are the three Excel PDFs only (flock performance, mortality & health, financial summary) with no date filter.

## Superadmin protection

- The last active Superadmin cannot be deactivated.
- The last Superadmin cannot have their role changed.
- A Superadmin cannot deactivate or demote themselves.
- Admin cannot delete, deactivate, or change a Superadmin.

## Enforcement

1. Sidebar hides modules the role cannot use (UX).
2. Middleware blocks unauthorized paths.
3. Server Actions and the PDF route call `requirePermission`.
4. RLS denies table access for roles that should not see that data.
5. Inactive profiles cannot use the app even with a valid Auth session.
