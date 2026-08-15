import { createClient } from "@/lib/supabase/server";
import type { FlockKpi } from "@farmnow/database";

export async function listFlockKpis() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("v_flock_kpis").select("*").order("flock_code");
  if (error) throw error;
  return (data ?? []) as FlockKpi[];
}

export async function getFlockDetail(id: string) {
  const supabase = await createClient();
  const { data: kpi } = await supabase.from("v_flock_kpis").select("*").eq("flock_id", id).maybeSingle();
  const { data: flock } = await supabase.from("flocks").select("*").eq("id", id).maybeSingle();
  if (!flock || !kpi) return null;
  const [mortality, feed, weights, health, sales, expenses, routines, lots] = await Promise.all([
    supabase.from("mortality_entries").select("*").eq("flock_id", id).eq("is_active", true).order("entry_date"),
    supabase.from("feed_consumption").select("*, feed_types(name)").eq("flock_id", id).eq("is_active", true).order("entry_date"),
    supabase.from("weekly_weights").select("*").eq("flock_id", id).eq("is_active", true).order("entry_date"),
    supabase.from("health_entries").select("*, products(name)").eq("flock_id", id).eq("is_active", true).order("entry_date"),
    supabase.from("sales").select("*, customers(name)").eq("flock_id", id).eq("is_active", true).order("entry_date"),
    supabase.from("expenses").select("*").eq("flock_id", id).eq("is_active", true).order("entry_date"),
    supabase.from("daily_routines").select("*").eq("flock_id", id).eq("is_active", true).order("entry_date", { ascending: false }).limit(20),
    supabase.from("v_medicine_lots").select("*").eq("flock_id", id).eq("is_active", true),
  ]);
  return {
    flock,
    kpi: kpi as FlockKpi,
    mortality: mortality.data ?? [],
    feed: feed.data ?? [],
    weights: weights.data ?? [],
    health: health.data ?? [],
    sales: sales.data ?? [],
    expenses: expenses.data ?? [],
    routines: routines.data ?? [],
    lots: lots.data ?? [],
  };
}

export async function getFlockFormOptions() {
  const supabase = await createClient();
  const [houses, breeds, suppliers] = await Promise.all([
    supabase.from("houses").select("id, code").eq("status", "Active").order("code"),
    supabase.from("breeds").select("id, name").order("name"),
    supabase.from("suppliers").select("id, name").order("name"),
  ]);
  return {
    houses: houses.data ?? [],
    breeds: breeds.data ?? [],
    suppliers: suppliers.data ?? [],
  };
}
