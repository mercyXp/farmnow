import { hasPermission, medicineExpiryStatus } from "@farmnow/domain";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { requireUser } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { formatNumber } from "@/lib/utils";

export default async function InventoryPage() {
  const { profile } = await requireUser();
  const canMedicine = hasPermission(profile.role, "viewMedicine");
  const supabase = await createClient();
  const [{ data: feed }, { data: lots }, { data: settings }] = await Promise.all([
    supabase.from("v_feed_stock").select("*"),
    supabase.from("medicine_lots").select("*, products(name), flocks(code)").eq("is_active", true),
    supabase.from("settings").select("key, value").eq("key", "MedicineExpiryWarningDays"),
  ]);
  const warningDays = Number(settings?.[0]?.value ?? 30);
  const today = new Date();
  const lotRows = (lots ?? []).map((r) => ({
    id: r.id,
    lotNumber: r.lot_number,
    flock: (r.flocks as { code: string } | null)?.code ?? "",
    product: (r.products as { name: string } | null)?.name ?? "",
    balance: Number(r.quantity_received) - Number(r.quantity_used),
    expiryDate: r.expiry_date,
    status: medicineExpiryStatus(new Date(r.expiry_date), today, warningDays),
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Inventory"
        description="Excel has no generic SKU register. Stock is feed (purchases − usage) plus medicine lots."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {(feed ?? []).map((f) => (
          <Card key={f.feed_type_id}>
            <CardHeader>
              <CardTitle>{f.feed_name}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="font-serif text-3xl">{formatNumber(Number(f.balance_kg))} kg</p>
                <p className="text-xs text-muted-foreground">
                  Purchased {formatNumber(Number(f.purchased_kg))} · Used {formatNumber(Number(f.used_kg))} · Min {formatNumber(Number(f.min_stock_kg))}
                </p>
              </div>
              <Badge variant={f.alert === "LOW STOCK" ? "warn" : "ok"}>{f.alert}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      {canMedicine ? (
        <>
          <h2 className="font-serif text-xl">Medicine lots</h2>
          <DataTable
            rowKeyField="id"
            rows={lotRows}
            emptyTitle="No medicine lots."
            emptyDescription="Receive a lot on the Medicine page."
            columns={[
              { id: "lotNumber", header: "Lot", field: "lotNumber" },
              { id: "flock", header: "Flock", field: "flock" },
              { id: "product", header: "Product", field: "product" },
              { id: "balance", header: "Balance", field: "balance" },
              { id: "expiryDate", header: "Expiry", field: "expiryDate" },
              { id: "status", header: "Status", field: "status" },
            ]}
          />
        </>
      ) : null}
    </div>
  );
}
