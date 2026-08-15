import { Document, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import type { FlockKpi } from "@farmnow/database";

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, fontFamily: "Helvetica" },
  h1: { fontSize: 16, marginBottom: 4 },
  h2: { fontSize: 12, marginTop: 12, marginBottom: 6 },
  muted: { color: "#555", marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3, borderBottomWidth: 0.5, borderBottomColor: "#ddd" },
  label: { width: "55%" },
  value: { width: "45%", textAlign: "right" },
});

function money(n: number) {
  return `K ${n.toLocaleString("en-ZM", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export async function flockPerformancePdf(kpi: FlockKpi, generated: string) {
  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>FarmNow Limited</Text>
        <Text style={styles.h2}>Flock Performance Report</Text>
        <Text style={styles.muted}>Generated: {generated}  |  Prepared by FarmNow ERP</Text>
        <Text>Flock: {kpi.flock_code}</Text>
        {[
          ["House", kpi.house_code],
          ["Breed", kpi.breed_name],
          ["Placed date", kpi.placed_date],
          ["Status", kpi.status],
          ["Days on farm", String(kpi.days_on_farm)],
          ["Initial birds", String(kpi.initial_birds)],
          ["Total mortality", String(kpi.total_mortality)],
          ["Current birds (Excel)", String(kpi.current_birds)],
          ["Livability", `${(Number(kpi.livability_pct) * 100).toFixed(1)}%`],
          ["Total feed kg", String(kpi.total_feed_kg)],
          ["Latest avg weight g", String(kpi.latest_avg_weight_g)],
          ["FCR", Number(kpi.fcr).toFixed(2)],
          ["ADG g", Number(kpi.adg_g).toFixed(1)],
          ["Feed cost", money(Number(kpi.total_feed_cost))],
          ["Medicine cost", money(Number(kpi.medicine_cost))],
          ["Other expenses", money(Number(kpi.total_expenses))],
          ["Cost / bird", money(Number(kpi.cost_per_bird))],
          ["Cost / kg", money(Number(kpi.cost_per_kg))],
          ["Break-even / bird", money(Number(kpi.breakeven_price_per_bird))],
          ["Sales value", money(Number(kpi.total_sales_value))],
          ["Estimated profit", money(Number(kpi.estimated_profit))],
          ["Breed standard FCR", Number(kpi.standard_fcr).toFixed(2)],
        ].map(([label, value]) => (
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
  const doc = (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.h1}>FarmNow Limited</Text>
        <Text style={styles.h2}>Financial Summary Report — All Flocks</Text>
        <Text style={styles.muted}>Generated: {generated}</Text>
        {kpis.map((k) => (
          <View key={k.flock_id} style={styles.row}>
            <Text>
              {k.flock_code} ({k.status}) feed {money(Number(k.total_feed_cost))} · med {money(Number(k.medicine_cost))} · exp {money(Number(k.total_expenses))} · sales {money(Number(k.total_sales_value))} · profit {money(Number(k.estimated_profit))}
            </Text>
          </View>
        ))}
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
        <Text style={styles.h1}>FarmNow Limited</Text>
        <Text style={styles.h2}>Mortality & Health Report</Text>
        <Text style={styles.muted}>Generated: {generated}</Text>
        <Text>Flock: {flockCode}</Text>
        <Text>Placed: {placed}</Text>
        <Text>Total mortality: {totalMort}</Text>
        <Text>Livability: {(livability * 100).toFixed(1)}%</Text>
        {weeks.map((w) => (
          <View key={w.label} style={styles.row}>
            <Text style={styles.label}>{w.label}</Text>
            <Text style={styles.value}>
              {w.week} this week / {w.cumulative} cumulative
            </Text>
          </View>
        ))}
      </Page>
    </Document>
  );
  return renderToBuffer(doc);
}
