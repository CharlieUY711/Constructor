import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js";

const categorias = new Hono();

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

// GET /categorias
categorias.get("/", async (c) => {
  try {
    const supabase = getSupabase();
    const { departamento_id, activo } = c.req.query();
    let query = supabase
      .from("categorias")
      .select("*, subcategorias(*)")
      .order("orden", { ascending: true });
    if (departamento_id) query = query.eq("departamento_id", departamento_id);
    if (activo !== undefined) query = query.eq("activo", activo === "true");
    const { data, error } = await query;
    if (error) throw error;
    return c.json({ data });
  } catch (error) {
    console.log("Error listando categorías:", JSON.stringify(error));
    return c.json({ error: `Error listando categorías: ${errMsg(error)}` }, 500);
  }
});

// GET /categorias/:id
categorias.get("/:id", async (c) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("categorias")
      .select("*, subcategorias(*)")
      .eq("id", c.req.param("id"))
      .single();

    if (error) throw error;
    if (!data) return c.json({ error: "Categoría no encontrada" }, 404);
    return c.json({ data });
  } catch (error) {
    console.log("Error obteniendo categoría:", JSON.stringify(error));
    return c.json({ error: `Error obteniendo categoría: ${errMsg(error)}` }, 500);
  }
});

// POST /categorias
categorias.post("/", async (c) => {
  try {
    const supabase = getSupabase();
    const body = await c.req.json();

    if (!body.nombre) {
      return c.json({ error: "nombre es requerido" }, 400);
    }
    if (!body.departamento_id) {
      return c.json({ error: "departamento_id es requerido" }, 400);
    }

    const { data, error } = await supabase
      .from("categorias")
      .insert({ ...body, activo: body.activo ?? true })
      .select()
      .single();

    if (error) throw error;
    return c.json({ data }, 201);
  } catch (error) {
    console.log("Error creando categoría:", JSON.stringify(error));
    return c.json({ error: `Error creando categoría: ${errMsg(error)}` }, 500);
  }
});

// PUT /categorias/:id
categorias.put("/:id", async (c) => {
  try {
    const supabase = getSupabase();
    const body = await c.req.json();

    const { data, error } = await supabase
      .from("categorias")
      .update(body)
      .eq("id", c.req.param("id"))
      .select()
      .single();

    if (error) throw error;
    return c.json({ data });
  } catch (error) {
    console.log("Error actualizando categoría:", JSON.stringify(error));
    return c.json({ error: `Error actualizando categoría: ${errMsg(error)}` }, 500);
  }
});

// DELETE /categorias/:id
categorias.delete("/:id", async (c) => {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("categorias")
      .delete()
      .eq("id", c.req.param("id"));

    if (error) throw error;
    return c.json({ success: true });
  } catch (error) {
    console.log("Error eliminando categoría:", JSON.stringify(error));
    return c.json({ error: `Error eliminando categoría: ${errMsg(error)}` }, 500);
  }
});

export { categorias };
