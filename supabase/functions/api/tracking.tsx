import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js";

const tracking = new Hono();

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

// GET /tracking/envios
tracking.get("/envios", async (c) => {
  try {
    const supabase = getSupabase();
    const { codigo, estado, search } = c.req.query();

    let query = supabase
      .from("tracking_envios")
      .select("*")
      .order("created_at", { ascending: false });

    if (codigo) query = query.eq("codigo", codigo);
    if (estado) query = query.eq("estado", estado);
    if (search) {
      query = query.or(`codigo.ilike.%${search}%,numero.ilike.%${search}%,tracking_externo.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return c.json({ data });
  } catch (error) {
    console.log("Error listando envíos de tracking:", JSON.stringify(error));
    return c.json({ error: `Error listando envíos: ${errMsg(error)}` }, 500);
  }
});

// GET /tracking/envios/:id
tracking.get("/envios/:id", async (c) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("tracking_envios")
      .select("*")
      .eq("id", c.req.param("id"))
      .single();

    if (error) throw error;
    if (!data) return c.json({ error: "Envío no encontrado" }, 404);
    return c.json({ data });
  } catch (error) {
    console.log("Error obteniendo envío:", JSON.stringify(error));
    return c.json({ error: `Error obteniendo envío: ${errMsg(error)}` }, 500);
  }
});

// GET /tracking/envios/codigo/:codigo
tracking.get("/envios/codigo/:codigo", async (c) => {
  try {
    const supabase = getSupabase();
    const codigo = c.req.param("codigo");
    
    // Buscar por codigo o tracking_externo
    const { data, error } = await supabase
      .from("tracking_envios")
      .select("*")
      .or(`codigo.eq.${codigo},tracking_externo.eq.${codigo}`)
      .single();

    if (error || !data) {
      return c.json({ error: "Envío no encontrado" }, 404);
    }

    // Obtener eventos asociados
    const { data: eventos, error: eventosError } = await supabase
      .from("tracking_eventos")
      .select("*")
      .eq("tracking_id", data.id)
      .order("fecha", { ascending: false });

    return c.json({ data: { ...data, eventos: eventos || [] } });
  } catch (error) {
    console.log("Error obteniendo envío por código:", JSON.stringify(error));
    return c.json({ error: `Error obteniendo envío: ${errMsg(error)}` }, 500);
  }
});

// POST /tracking/envios
tracking.post("/envios", async (c) => {
  try {
    const supabase = getSupabase();
    const body = await c.req.json();

    if (!body.codigo) {
      return c.json({ error: "codigo es requerido" }, 400);
    }

    const { data, error } = await supabase
      .from("tracking_envios")
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return c.json({ data }, 201);
  } catch (error) {
    console.log("Error creando envío:", JSON.stringify(error));
    return c.json({ error: `Error creando envío: ${errMsg(error)}` }, 500);
  }
});

// PUT /tracking/envios/:id
tracking.put("/envios/:id", async (c) => {
  try {
    const supabase = getSupabase();
    const body = await c.req.json();

    const { data, error } = await supabase
      .from("tracking_envios")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", c.req.param("id"))
      .select()
      .single();

    if (error) throw error;
    return c.json({ data });
  } catch (error) {
    console.log("Error actualizando envío:", JSON.stringify(error));
    return c.json({ error: `Error actualizando envío: ${errMsg(error)}` }, 500);
  }
});

// DELETE /tracking/envios/:id
tracking.delete("/envios/:id", async (c) => {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("tracking_envios")
      .delete()
      .eq("id", c.req.param("id"));

    if (error) throw error;
    return c.json({ success: true });
  } catch (error) {
    console.log("Error eliminando envío:", JSON.stringify(error));
    return c.json({ error: `Error eliminando envío: ${errMsg(error)}` }, 500);
  }
});

// GET /tracking/eventos/:tracking_id
tracking.get("/eventos/:tracking_id", async (c) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("tracking_eventos")
      .select("*")
      .eq("tracking_id", c.req.param("tracking_id"))
      .order("fecha", { ascending: false });

    if (error) throw error;
    return c.json({ data });
  } catch (error) {
    console.log("Error listando eventos:", JSON.stringify(error));
    return c.json({ error: `Error listando eventos: ${errMsg(error)}` }, 500);
  }
});

// POST /tracking/eventos
tracking.post("/eventos", async (c) => {
  try {
    const supabase = getSupabase();
    const body = await c.req.json();

    if (!body.tracking_id || !body.descripcion) {
      return c.json({ error: "tracking_id y descripcion son requeridos" }, 400);
    }

    const { data, error } = await supabase
      .from("tracking_eventos")
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return c.json({ data }, 201);
  } catch (error) {
    console.log("Error creando evento:", JSON.stringify(error));
    return c.json({ error: `Error creando evento: ${errMsg(error)}` }, 500);
  }
});

// PUT /tracking/eventos/:id
tracking.put("/eventos/:id", async (c) => {
  try {
    const supabase = getSupabase();
    const body = await c.req.json();

    const { data, error } = await supabase
      .from("tracking_eventos")
      .update(body)
      .eq("id", c.req.param("id"))
      .select()
      .single();

    if (error) throw error;
    return c.json({ data });
  } catch (error) {
    console.log("Error actualizando evento:", JSON.stringify(error));
    return c.json({ error: `Error actualizando evento: ${errMsg(error)}` }, 500);
  }
});

// DELETE /tracking/eventos/:id
tracking.delete("/eventos/:id", async (c) => {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("tracking_eventos")
      .delete()
      .eq("id", c.req.param("id"));

    if (error) throw error;
    return c.json({ success: true });
  } catch (error) {
    console.log("Error eliminando evento:", JSON.stringify(error));
    return c.json({ error: `Error eliminando evento: ${errMsg(error)}` }, 500);
  }
});

export { tracking };
