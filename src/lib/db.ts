// ─── Optional Supabase bridge ───────────────────────────────────────────────
// When VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set (see .env.example and
// supabase/schema.sql), the app can push orders to a real Postgres database.
// Without them, everything runs on localStorage — zero config needed.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Order } from "./store";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null =
  url && anon ? createClient(url, anon) : null;

export const dbMode = supabase ? "supabase" : "local";

export async function pushOrder(order: Order): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: true };
  try {
    const { error } = await supabase.from("orders").insert({
      code: order.code,
      customer: order.customer,
      phone: order.phone,
      order_type: order.type,
      total: order.total,
      status: order.status,
      created_at: order.createdAt,
      items: order.lines,
    });
    return error ? { ok: false, error: error.message } : { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
