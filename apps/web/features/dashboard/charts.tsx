"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { FlockKpi } from "@farmnow/database";

export function DashboardCharts({ kpis, showCost = true }: { kpis: FlockKpi[]; showCost?: boolean }) {
  const data = kpis.map((k) => ({
    code: k.flock_code,
    fcr: Number(Number(k.fcr).toFixed(2)),
    livability: Number((Number(k.livability_pct) * 100).toFixed(1)),
    cost: Number(Number(k.cost_per_bird).toFixed(2)),
  }));

  return (
    <div className={`grid gap-4 ${showCost ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
      <ChartCard title="FCR by flock" data={data} dataKey="fcr" />
      <ChartCard title="Livability % by flock" data={data} dataKey="livability" />
      {showCost ? <ChartCard title="Cost per bird (ZMW)" data={data} dataKey="cost" /> : null}
    </div>
  );
}

function ChartCard({
  title,
  data,
  dataKey,
}: {
  title: string;
  data: Array<Record<string, string | number>>;
  dataKey: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h3 className="mb-3 font-serif text-base">{title}</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d9cdb6" />
            <XAxis dataKey="code" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey={dataKey} fill="#1f4d32" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
