/**
 * Rutas API — Gestión de rutas de distribución
 * Tabla: rutas
 */

import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js";

const rutas = new Hono();

const getSupabase = () =>
  createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

const errMsg = (e: unknown): string =>
  e instanceof Error
    ? e.message
    : typeof e === "object" && e !== null && "message" in e
    ? String((e as { message: unknown }).message)
    : JSON.stringify(e);

// GET /rutas — lista todas las rutas (con filtros opcionales: activo, carrier)
rutas.get("/", async (c) => {
  try {
    const supabase = getSupabase();
    const { activo, carrier } = c.req.query();

    let query = supabase
      .from("rutas")
      .select("*")
      .order("created_at", { ascending: false });

    if (activo !== undefined) {
      // Si activo es "true", buscar rutas con estado 'activa'
      if (activo === "true") {
        query = query.eq("estado", "activa");
      } else {
        query = query.neq("estado", "activa");
      }
    }
    if (carrier) query = query.eq("carrier", carrier);

    const { data, error } = await query;
    if (error) throw error;
    return c.json({ data });
  } catch (error) {
    console.log("Error listando rutas:", JSON.stringify(error));
    return c.json({ error: `Error listando rutas: ${errMsg(error)}` }, 500);
  }
});

// GET /rutas/:id — obtiene una ruta
rutas.get("/:id", async (c) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("rutas")
      .select("*")
      .eq("id", c.req.param("id"))
      .single();

    if (error) throw error;
    if (!data) return c.json({ error: "Ruta no encontrada" }, 404);
    return c.json({ data });
  } catch (error) {
    console.log("Error obteniendo ruta:", JSON.stringify(error));
    return c.json({ error: `Error obteniendo ruta: ${errMsg(error)}` }, 500);
  }
});

// POST /rutas — crear ruta
rutas.post("/", async (c) => {
  try {
    const supabase = getSupabase();
    const body = await c.req.json();

    if (!body.nombre) return c.json({ error: "El nombre es requerido" }, 400);
    if (!body.carrier) return c.json({ error: "El carrier es requerido" }, 400);
    if (!body.zona) return c.json({ error: "La zona es requerida" }, 400);

    const payload = {
      ...body,
      estado: body.estado ?? "planificada",
      tipo: body.tipo ?? "standard",
      paradas: body.paradas ?? [],
      enviosTotales: body.enviosTotales ?? 0,
      kmsEstimados: body.kmsEstimados ?? 0,
      tiempoEstimado: body.tiempoEstimado ?? "",
    };

    const { data, error } = await supabase
      .from("rutas")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return c.json({ data }, 201);
  } catch (error) {
    console.log("Error creando ruta:", JSON.stringify(error));
    return c.json({ error: `Error creando ruta: ${errMsg(error)}` }, 500);
  }
});

// PUT /rutas/:id — actualizar ruta
rutas.put("/:id", async (c) => {
  try {
    const supabase = getSupabase();
    const body = await c.req.json();

    const { data, error } = await supabase
      .from("rutas")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", c.req.param("id"))
      .select()
      .single();

    if (error) throw error;
    return c.json({ data });
  } catch (error) {
    console.log("Error actualizando ruta:", JSON.stringify(error));
    return c.json({ error: `Error actualizando ruta: ${errMsg(error)}` }, 500);
  }
});

// DELETE /rutas/:id — eliminar ruta
rutas.delete("/:id", async (c) => {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("rutas")
      .delete()
      .eq("id", c.req.param("id"));

    if (error) throw error;
    return c.json({ success: true });
  } catch (error) {
    console.log("Error eliminando ruta:", JSON.stringify(error));
    return c.json({ error: `Error eliminando ruta: ${errMsg(error)}` }, 500);
  }
});

export { rutas };
