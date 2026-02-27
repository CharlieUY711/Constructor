import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { personas } from "./personas.tsx";
import { organizaciones } from "./organizaciones.tsx";
import { roles } from "./roles.tsx";
import { pedidos } from "./pedidos.tsx";
import { metodosPago } from "./metodos_pago.tsx";
import { metodosEnvio } from "./metodos_envio.tsx";
import { etiquetas } from "./etiquetas.tsx";
import { roadmap } from "./roadmap.tsx";
import { ideasBoard } from "./ideas_board.tsx";
import { cargaMasiva } from "./carga_masiva.tsx";
import { ageVerification } from "./age_verification.tsx";
import { rrss } from "./rrss.tsx";
import { productos } from "./productos.tsx";
import { carrito } from "./carrito.tsx";
import { departamentos } from "./departamentos.tsx";
import { ordenes } from "./ordenes.tsx";

const app = new Hono().basePath("/api");

app.use("*", logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/personas", personas);
app.route("/organizaciones", organizaciones);
app.route("/roles", roles);
app.route("/pedidos", pedidos);
app.route("/metodos-pago", metodosPago);
app.route("/metodos-envio", metodosEnvio);
app.route("/etiquetas", etiquetas);
app.route("/roadmap", roadmap);
app.route("/ideas", ideasBoard);
app.route("/carga-masiva", cargaMasiva);
app.route("/age-verification", ageVerification);
app.route("/rrss", rrss);
app.route("/productos", productos);
app.route("/carrito", carrito);
app.route("/departamentos", departamentos);
app.route("/ordenes", ordenes);

Deno.serve(app.fetch);
