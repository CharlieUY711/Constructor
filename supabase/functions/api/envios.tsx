/**
 * Envíos API — Gestión de envíos y tracking
 * Tabla: envios_75638143, envios_eventos_75638143
 */

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { createClient } from "npm:@supabase/supabase-js";

const envios = new Hono();

envios.use('/*', cors({
  origin: ['https://app.oddy.com.uy', 'https://web.oddy.com.uy'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'apikey', 'x-client-info'],
  maxAge: 86400,
}));

const getSupabase = () =>
  createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

// GET /envios — lista todos los envíos (con filtros opcionales) + eventos
envios.get("/", async (c) => {
  try {
    const { pedido_madre_id, estado, carrier, tramo } = c.req.query();
    const supabase = getSupabase();
    
    let query = supabase
      .from("envios_75638143")
      .select("*")
      .order("fecha_creacion", { ascending: false });
    
    if (pedido_madre_id) query = query.eq("pedido_madre_id", pedido_madre_id);
    if (estado) query = query.eq("estado", estado);
    if (carrier) query = query.eq("carrier", carrier);
    if (tramo) query = query.eq("tramo", tramo);
    
    const { data: envios, error } = await query;
    if (error) throw error;
    
    // Cargar eventos para todos los envíos en una sola query
    const envioIds = (envios ?? []).map(e => e.id);
    let eventos: any[] = [];
    
    if (envioIds.length > 0) {
      const { data: eventosData, error: eventosErr } = await supabase
        .from("envios_eventos_75638143")
        .select("*")
        .in("envio_id", envioIds)
        .order("fecha", { ascending: false });
      
      if (!eventosErr) {
        eventos = eventosData ?? [];
      }
    }
    
    return c.json({ 
      envios: envios ?? [], 
      eventos: eventos,
      count: envios?.length ?? 0 
    });
  } catch (err) {
    console.log(`[envios] GET / error: ${err}`);
    return c.json({ error: `Error cargando envíos: ${err}` }, 500);
  }
});

// GET /envios/:id — obtiene un envío con sus eventos
envios.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const supabase = getSupabase();
    
    const { data: envio, error: envioErr } = await supabase
      .from("envios_75638143")
      .select("*")
      .eq("id", id)
      .single();
    
    if (envioErr) throw envioErr;
    
    const { data: eventos, error: eventosErr } = await supabase
      .from("envios_eventos_75638143")
      .select("*")
      .eq("envio_id", id)
      .order("fecha", { ascending: false });
    
    if (eventosErr) throw eventosErr;
    
    return c.json({ envio, eventos: eventos ?? [] });
  } catch (err) {
    console.log(`[envios] GET /:id error: ${err}`);
    return c.json({ error: `Error cargando envío: ${err}` }, 500);
  }
});

// GET /envios/pedido/:pedidoId — envíos de un pedido madre
envios.get("/pedido/:pedidoId", async (c) => {
  try {
    const pedidoId = c.req.param("pedidoId");
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from("envios_75638143")
      .select("*")
      .eq("pedido_madre_id", pedidoId)
      .order("fecha_creacion", { ascending: false });
    
    if (error) throw error;
    
    return c.json({ envios: data ?? [] });
  } catch (err) {
    console.log(`[envios] GET /pedido/:pedidoId error: ${err}`);
    return c.json({ error: `Error cargando envíos del pedido: ${err}` }, 500);
  }
});

// POST /envios — crear nuevo envío
envios.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const supabase = getSupabase();
    
    // Generar número de envío si no viene
    if (!body.numero) {
      const { count } = await supabase
        .from("envios_75638143")
        .select("id", { count: "exact", head: true });
      body.numero = `ENV-${15000 + (count ?? 0)}-${String((count ?? 0) + 1).padStart(3, '0')}`;
    }
    
    const { data, error } = await supabase
      .from("envios_75638143")
      .insert({
        ...body,
        fecha_creacion: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Crear evento inicial
    await supabase.from("envios_eventos_75638143").insert({
      envio_id: data.id,
      estado: body.estado || "creado",
      descripcion: "Envío creado",
      ubicacion: "Sistema",
      origen: "sistema",
    });
    
    return c.json({ envio: data }, 201);
  } catch (err) {
    console.log(`[envios] POST / error: ${err}`);
    return c.json({ error: `Error creando envío: ${err}` }, 500);
  }
});

// PUT /envios/:id — actualizar envío
envios.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const supabase = getSupabase();
    
    // Si cambió el estado, crear evento
    if (body.estado) {
      const { data: existing } = await supabase
        .from("envios_75638143")
        .select("estado")
        .eq("id", id)
        .single();
      
      if (existing && existing.estado !== body.estado) {
        await supabase.from("envios_eventos_75638143").insert({
          envio_id: id,
          estado: body.estado,
          descripcion: body.descripcion_evento || `Estado cambiado a ${body.estado}`,
          ubicacion: body.ubicacion || "Sistema",
          origen: body.origen_evento || "manual",
        });
      }
    }
    
    const { data, error } = await supabase
      .from("envios_75638143")
      .update(body)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    return c.json({ envio: data });
  } catch (err) {
    console.log(`[envios] PUT /:id error: ${err}`);
    return c.json({ error: `Error actualizando envío: ${err}` }, 500);
  }
});

// POST /envios/:id/evento — agregar evento de tracking
envios.post("/:id/evento", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from("envios_eventos_75638143")
      .insert({
        envio_id: id,
        estado: body.estado,
        descripcion: body.descripcion,
        ubicacion: body.ubicacion,
        lat: body.lat,
        lng: body.lng,
        origen: body.origen || "manual",
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Si el evento cambia el estado, actualizar el envío
    if (body.estado) {
      await supabase
        .from("envios_75638143")
        .update({ estado: body.estado })
        .eq("id", id);
    }
    
    return c.json({ evento: data }, 201);
  } catch (err) {
    console.log(`[envios] POST /:id/evento error: ${err}`);
    return c.json({ error: `Error creando evento: ${err}` }, 500);
  }
});

// POST /envios/:id/acuse — registrar acuse de recibo
envios.post("/:id/acuse", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from("envios_75638143")
      .update({
        acuse_recibido: true,
        acuse_fecha: new Date().toISOString(),
        acuse_firmado_por: body.firmado_por,
        acuse_firma_url: body.firma_url,
        estado: "entregado",
      })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Crear evento de acuse
    await supabase.from("envios_eventos_75638143").insert({
      envio_id: id,
      estado: "entregado",
      descripcion: `Acuse de recibo firmado por ${body.firmado_por}`,
      ubicacion: body.ubicacion || "Destino",
      origen: "manual",
    });
    
    return c.json({ envio: data });
  } catch (err) {
    console.log(`[envios] POST /:id/acuse error: ${err}`);
    return c.json({ error: `Error registrando acuse: ${err}` }, 500);
  }
});

export { envios };
