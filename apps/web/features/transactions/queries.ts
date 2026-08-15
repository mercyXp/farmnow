import { createClient } from "@/lib/supabase/server";

export async function activeFlocks() {
  const supabase = await createClient();
  const { data } = await supabase.from("flocks").select("id, code").eq("status", "Active").order("code");
  return data ?? [];
}

export async function lookup(listName: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("lookup_options").select("value").eq("list_name", listName).order("sort_order");
  return (data ?? []).map((d) => d.value);
}

export async function masters() {
  const supabase = await createClient();
  const [feed, products, suppliers, customers, houses, employees] = await Promise.all([
    supabase.from("feed_types").select("id, name").order("name"),
    supabase.from("products").select("id, name").order("name"),
    supabase.from("suppliers").select("id, name").order("name"),
    supabase.from("customers").select("id, name").order("name"),
    supabase.from("houses").select("id, code").order("code"),
    supabase.from("employees").select("id, name").eq("status", "Active").order("name"),
  ]);
  return {
    feed: feed.data ?? [],
    products: products.data ?? [],
    suppliers: suppliers.data ?? [],
    customers: customers.data ?? [],
    houses: houses.data ?? [],
    employees: employees.data ?? [],
  };
}
