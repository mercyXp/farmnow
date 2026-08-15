import { hasPermission } from "@farmnow/domain";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataRows } from "@/components/data-rows";
import { requireUser } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { formatNumber } from "@/lib/utils";
import { medicineExpiryStatus } from "@farmnow/domain";

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
          <DataRows
        headers={["Lot", "Flock", "Product", "Balance", "Expiry", "Status"]}
        rows={(lots ?? []).map((r) => {
          const row = r as {
            lot_number: string;
            expiry_date: string;
            quantity_received: number;
            quantity_used: number;
            products?: { name: string } | null;
            flocks?: { code: string } | null;
          };
          return [
            row.lot_number,
            row.flocks?.code ?? "",
            row.products?.name ?? "",
            String(row.quantity_received - row.quantity_used),
            row.expiry_date,
            medicineExpiryStatus(new Date(row.expiry_date), today, warningDays),
          ];
        })}
      />
        </>
      ) : null}
    </div>
  );
}
