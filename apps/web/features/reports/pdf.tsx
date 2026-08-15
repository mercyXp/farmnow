import path from "node:path";
import { Document, Image, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import type { FlockKpi } from "@farmnow/database";

const LOGO = path.join(process.cwd(), "public", "farmnow_logo.png");

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 9, fontFamily: "Helvetica" },
  logo: { width: 72, height: 48, marginBottom: 8 },
  h1: { fontSize: 16, marginBottom: 4 },
  h2: { fontSize: 12, marginTop: 12, marginBottom: 8 },
  muted: { color: "#555", marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3, borderBottomWidth: 0.5, borderBottomColor: "#ddd" },
  label: { width: "55%" },
  value: { width: "45%", textAlign: "right" },
  table: { marginTop: 8, borderWidth: 0.5, borderColor: "#999" },
  thead: { flexDirection: "row", backgroundColor: "#1f3d2b", color: "#fff", paddingVertical: 4, paddingHorizontal: 4 },
  trow: { flexDirection: "row", paddingVertical: 3, paddingHorizontal: 4, borderTopWidth: 0.5, borderTopColor: "#ccc" },
  total: { flexDirection: "row", paddingVertical: 4, paddingHorizontal: 4, borderTopWidth: 1, borderTopColor: "#333", backgroundColor: "#f3f3f3" },
  c1: { width: "14%" },
  c2: { width: "12%" },
  cMoney: { width: "14.8%", textAlign: "right" },
  w1: { width: "50%" },
  w2: { width: "25%", textAlign: "right" },
  w3: { width: "25%", textAlign: "right" },
});

function money(n: number) {
  return `K ${n.toLocaleString("en-ZM", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export async function flockPerformancePdf(kpi: FlockKpi, generated: string, includeFinancials: boolean) {
  const operational: [string, string][] = [
    ["House", kpi.house_code],
    ["Breed", kpi.breed_name],
    ["Placed date", kpi.placed_date],
    ["Status", kpi.status],
    ["Days on farm", String(kpi.days_on_farm)],
    ["Initial birds", String(kpi.initial_birds)],
    ["Total mortality", String(kpi.total_mortality)],
    ["Current birds (Excel KPI)", String(kpi.current_birds)],
    ["Remaining birds (after sales)", String(kpi.remaining_birds)],
    ["Livability", `${(Number(kpi.livability_pct) * 100).toFixed(1)}%`],
    ["Total feed kg", String(kpi.total_feed_kg)],
    ["Latest avg weight g", String(kpi.latest_avg_weight_g)],
    ["FCR", Number(kpi.fcr).toFixed(2)],
    ["ADG g", Number(kpi.adg_g).toFixed(1)],
    ["Breed standard FCR", Number(kpi.standard_fcr).toFixed(2)],
  ];
  const financial: [string, string][] = includeFinancials
    ? [
        ["Feed cost", money(Number(kpi.total_feed_cost))],
        ["Medicine cost", money(Number(kpi.medicine_cost))],
        ["Other expenses", money(Number(kpi.total_expenses))],
        ["Cost / bird", money(Number(kpi.cost_per_bird))],
        ["Cost / kg", money(Number(kpi.cost_per_kg))],
        ["Break-even / bird", money(Number(kpi.breakeven_price_per_bird))],
        ["Sales value", money(Number(kpi.total_sales_value))],
        ["Estimated profit", money(Number(kpi.estimated_profit))],
      ]
    : [];
  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src={LOGO} style={styles.logo} />
        <Text style={styles.h1}>FarmNow Limited</Text>
        <Text style={styles.h2}>Flock Performance Report</Text>
        <Text style={styles.muted}>Generated: {generated}  |  Prepared by FarmNow ERP</Text>
        <Text>Flock: {kpi.flock_code}</Text>
        {[...operational, ...financial].map(([label, value]) => (
          <View key={label} style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
  return renderToBuffer(doc);
}

export async function financialSummaryPdf(kpis: FlockKpi[], generated: string) {
  const totals = kpis.reduce(
    (a, k) => ({
      feed: a.feed + Number(k.total_feed_cost),
      med: a.med + Number(k.medicine_cost),
      exp: a.exp + Number(k.total_expenses),
      sales: a.sales + Number(k.total_sales_value),
      profit: a.profit + Number(k.estimated_profit),
    }),
    { feed: 0, med: 0, exp: 0, sales: 0, profit: 0 },
  );
  const doc = (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Image src={LOGO} style={styles.logo} />
        <Text style={styles.h1}>FarmNow Limited</Text>
        <Text style={styles.h2}>Financial Summary Report — All Flocks</Text>
        <Text style={styles.muted}>Generated: {generated}  |  No date filter (full flock history, matching Excel)</Text>
        <View style={styles.table}>
          <View style={styles.thead}>
            <Text style={styles.c1}>Flock</Text>
            <Text style={styles.c2}>Status</Text>
            <Text style={styles.cMoney}>Feed cost</Text>
            <Text style={styles.cMoney}>Medicine</Text>
            <Text style={styles.cMoney}>Expenses</Text>
            <Text style={styles.cMoney}>Sales</Text>
            <Text style={styles.cMoney}>Est. profit</Text>
          </View>
          {kpis.map((k) => (
            <View key={k.flock_id} style={styles.trow}>
              <Text style={styles.c1}>{k.flock_code}</Text>
              <Text style={styles.c2}>{k.status}</Text>
              <Text style={styles.cMoney}>{money(Number(k.total_feed_cost))}</Text>
              <Text style={styles.cMoney}>{money(Number(k.medicine_cost))}</Text>
              <Text style={styles.cMoney}>{money(Number(k.total_expenses))}</Text>
              <Text style={styles.cMoney}>{money(Number(k.total_sales_value))}</Text>
              <Text style={styles.cMoney}>{money(Number(k.estimated_profit))}</Text>
            </View>
          ))}
          <View style={styles.total}>
            <Text style={styles.c1}>Total</Text>
            <Text style={styles.c2}>{kpis.length} flocks</Text>
            <Text style={styles.cMoney}>{money(totals.feed)}</Text>
            <Text style={styles.cMoney}>{money(totals.med)}</Text>
            <Text style={styles.cMoney}>{money(totals.exp)}</Text>
            <Text style={styles.cMoney}>{money(totals.sales)}</Text>
            <Text style={styles.cMoney}>{money(totals.profit)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
  return renderToBuffer(doc);
}

export async function mortalityReportPdf(
  flockCode: string,
  placed: string,
  totalMort: number,
  livability: number,
  weeks: { label: string; week: number; cumulative: number }[],
  generated: string,
) {
  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src={LOGO} style={styles.logo} />
        <Text style={styles.h1}>FarmNow Limited</Text>
        <Text style={styles.h2}>Mortality & Health Report</Text>
        <Text style={styles.muted}>Generated: {generated}  |  Weekly buckets from placement date</Text>
        <Text>Flock: {flockCode}</Text>
        <Text>Placed: {placed}</Text>
        <Text>Total mortality: {totalMort}</Text>
        <Text>Livability: {(livability * 100).toFixed(1)}%</Text>
        <View style={styles.table}>
          <View style={styles.thead}>
            <Text style={styles.w1}>Week</Text>
            <Text style={styles.w2}>This week</Text>
            <Text style={styles.w3}>Cumulative</Text>
          </View>
          {weeks.map((w) => (
            <View key={w.label} style={styles.trow}>
              <Text style={styles.w1}>{w.label}</Text>
              <Text style={styles.w2}>{w.week}</Text>
              <Text style={styles.w3}>{w.cumulative}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
  return renderToBuffer(doc);
}
