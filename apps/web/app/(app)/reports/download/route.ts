import { NextRequest, NextResponse } from "next/server";
import { hasPermission, reportTypeSchema } from "@farmnow/domain";
import { requirePermission } from "@/lib/supabase/server";
import { financialSummaryPdf, flockPerformancePdf, mortalityReportPdf } from "@/features/reports/pdf";
import { archiveGeneratedPdf } from "@/features/reports/archive";
import { writeAudit } from "@/lib/audit";

export async function GET(request: NextRequest) {
  try {
    const parsedType = reportTypeSchema.safeParse(request.nextUrl.searchParams.get("type"));
    if (!parsedType.success) {
      return NextResponse.json({ error: "Unknown report type." }, { status: 400 });
    }
    const type = parsedType.data;
    const flockId = request.nextUrl.searchParams.get("flockId");
    const generated = new Date().toISOString().slice(0, 10);

    if (type === "financial") {
      const { supabase, user } = await requirePermission("viewFinancialReports");
      const { data } = await supabase.from("v_flock_kpis").select("*").order("flock_code");
      const fileName = `RPT_FinancialSummary_ALL_${generated}.pdf`;
      const buf = Buffer.from(await financialSummaryPdf(data ?? [], generated));
      await archiveGeneratedPdf(supabase, user.id, "financial", fileName, buf);
      await writeAudit(supabase, user, { action: "generate", entityType: "rpt_FinancialSummary", entityId: "ALL" });
      return pdfResponse(buf, fileName);
    }

    if (!flockId) {
      return NextResponse.json({ error: "Select a flock." }, { status: 400 });
    }

    if (type === "flock") {
      const { supabase, user, profile } = await requirePermission("viewOperationalReports");
      const { data: kpi } = await supabase.from("v_flock_kpis").select("*").eq("flock_id", flockId).maybeSingle();
      if (!kpi) return NextResponse.json({ error: "Flock not found." }, { status: 404 });
      const fileName = `RPT_FlockPerformance_${kpi.flock_code}_${generated}.pdf`;
      const buf = Buffer.from(await flockPerformancePdf(kpi, generated, hasPermission(profile.role, "viewFinancials")));
      await archiveGeneratedPdf(supabase, user.id, "flock", fileName, buf, kpi.flock_id);
      await writeAudit(supabase, user, { action: "generate", entityType: "rpt_FlockPerformance", entityId: kpi.flock_code });
      return pdfResponse(buf, fileName);
    }

    if (type === "mortality") {
      const { supabase, user } = await requirePermission("viewOperationalReports");
      const { data: kpi } = await supabase.from("v_flock_kpis").select("*").eq("flock_id", flockId).maybeSingle();
      if (!kpi) return NextResponse.json({ error: "Flock not found." }, { status: 404 });
      const { data: mort } = await supabase
        .from("mortality_entries")
        .select("entry_date, mortality_count")
        .eq("flock_id", flockId)
        .eq("is_active", true);
      const placed = new Date(kpi.placed_date);
      const weeks = Array.from({ length: 8 }, (_, i) => {
        const start = new Date(placed);
        start.setDate(start.getDate() + i * 7);
        const end = new Date(placed);
        end.setDate(end.getDate() + i * 7 + 6);
        const week = (mort ?? [])
          .filter((m) => {
            const d = new Date(m.entry_date);
            return d >= start && d <= end;
          })
          .reduce((a, m) => a + m.mortality_count, 0);
        const cumulative = (mort ?? [])
          .filter((m) => new Date(m.entry_date) <= end)
          .reduce((a, m) => a + m.mortality_count, 0);
        return {
          label: `Week ${i + 1} ${start.toISOString().slice(5, 10)}–${end.toISOString().slice(5, 10)}`,
          week,
          cumulative,
        };
      });
      const fileName = `RPT_MortalityHealth_${kpi.flock_code}_${generated}.pdf`;
      const buf = Buffer.from(
        await mortalityReportPdf(kpi.flock_code, kpi.placed_date, kpi.total_mortality, Number(kpi.livability_pct), weeks, generated),
      );
      await archiveGeneratedPdf(supabase, user.id, "mortality", fileName, buf, kpi.flock_id);
      await writeAudit(supabase, user, { action: "generate", entityType: "rpt_MortalityTrend", entityId: kpi.flock_code });
      return pdfResponse(buf, fileName);
    }

    return NextResponse.json({ error: "Unknown report type." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/permission|Unauthorized|inactive/i.test(message)) {
      return NextResponse.json({ error: "You do not have permission to perform this action." }, { status: 403 });
    }
    return NextResponse.json({ error: "Unable to generate report." }, { status: 500 });
  }
}

function pdfResponse(buf: Buffer, filename: string) {
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
