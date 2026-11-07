import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type OrderItem = { dishId: string; name: string; price: number; qty: number };

const orderSchema = z.object({
  restaurantId: z.string(),
  restaurantName: z.string(),
  items: z
    .array(z.object({ dishId: z.string(), name: z.string(), price: z.number(), qty: z.number().int().min(1) }))
    .min(1),
  subtotal: z.number().int().min(0),
  fee: z.number().int().min(0),
  total: z.number().int().min(0),
  areaId: z.string(),
  street: z.string().min(1),
  etaMinutes: z.number().int().min(1),
  mode: z.enum(["now", "later"]),
  scheduledAt: z.string().nullable(),
});

export const saveOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => orderSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("orders").insert({
      user_id: context.userId,
      restaurant_id: data.restaurantId,
      restaurant_name: data.restaurantName,
      items: data.items,
      subtotal: data.subtotal,
      fee: data.fee,
      total: data.total,
      area_id: data.areaId,
      street: data.street,
      eta_minutes: data.etaMinutes,
      mode: data.mode,
      scheduled_at: data.scheduledAt,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const listOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const addressSchema = z.object({
  label: z.string().min(1).max(40),
  areaId: z.string().min(1),
  street: z.string().min(1).max(120),
  name: z.string().min(1).max(80),
  phone: z.string().min(5).max(30),
  isDefault: z.boolean(),
});

export const listAddresses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("addresses")
      .select("*")
      .eq("user_id", context.userId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const addAddress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => addressSchema.parse(d))
  .handler(async ({ data, context }) => {
    if (data.isDefault) {
      await context.supabase.from("addresses").update({ is_default: false }).eq("user_id", context.userId);
    }
    const { data: row, error } = await context.supabase
      .from("addresses")
      .insert({
        user_id: context.userId,
        label: data.label,
        area_id: data.areaId,
        street: data.street,
        name: data.name,
        phone: data.phone,
        is_default: data.isDefault,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const makeAddressDefault = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await context.supabase.from("addresses").update({ is_default: false }).eq("user_id", context.userId);
    const { error } = await context.supabase
      .from("addresses")
      .update({ is_default: true })
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteAddress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("addresses").delete().eq("id", data.id).eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
