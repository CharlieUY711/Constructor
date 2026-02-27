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
import { rutas } from "./rutas.tsx";
import { etiquetas } from "./etiquetas.tsx";
import { roadmap } from "./roadmap.tsx";
import { ideasBoard } from "./ideas_board.tsx";
import { cargaMasiva } from "./carga_masiva.tsx";
import { ageVerification } from "./age_verification.tsx";
import { rrss } from "./rrss.tsx";
import { marketing } from "./marketing.tsx";
import { productos } from "./productos.tsx";
import { carrito } from "./carrito.tsx";
import { departamentos } from "./departamentos.tsx";
import { ordenes } from "./ordenes.tsx";
import { categorias } from "./categorias.tsx";
import { subcategorias } from "./subcategorias.tsx";
import { disputas } from "./disputas.tsx";
import { transportistas } from "./transportistas.tsx";
import { fulfillment } from "./fulfillment.tsx";
import { produccion } from "./produccion.tsx";
import { abastecimiento } from "./abastecimiento.tsx";
import { mapaEnvios } from "./mapa-envios.tsx";
import { tracking } from "./tracking.tsx";
import { integraciones } from "./integraciones.tsx";
import { envios } from "./envios.tsx";

const app = new Hono().basePath("/api");

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "apikey", "x-client-info"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Handle OPTIONS preflight explicitly
app.options('/*', (c) => c.text('', 204));

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// Personas, Organizaciones y Roles
app.route("/personas", personas);
app.route("/organizaciones", organizaciones);
app.route("/roles", roles);

// eCommerce
app.route("/pedidos", pedidos);
app.route("/metodos-pago", metodosPago);
app.route("/metodos-envio", metodosEnvio);
app.route("/envios", envios);
app.route("/rutas", rutas);

// Marketing
app.route("/etiquetas", etiquetas);

// Roadmap + archivos adjuntos
app.route("/roadmap", roadmap);

// Ideas Board
app.route("/ideas", ideasBoard);

// Carga Masiva de Archivos
app.route("/carga-masiva", cargaMasiva);

// Verificación de Edad + MetaMap
app.route("/age-verification", ageVerification);

// Redes Sociales — RRSS (Meta: Instagram + Facebook)
app.route("/rrss", rrss);

// Marketing — Campañas, Suscriptores, Fidelización, Sorteos
app.route("/marketing", marketing);

// ...después de los imports existentes:
app.route("/productos", productos);
app.route("/carrito", carrito);
app.route("/departamentos", departamentos);
app.route("/ordenes", ordenes);
app.route("/categorias", categorias);
app.route("/subcategorias", subcategorias);
app.route("/disputas", disputas);
app.route("/transportistas", transportistas);
app.route("/fulfillment", fulfillment);
app.route("/produccion", produccion);
app.route("/abastecimiento", abastecimiento);
app.route("/mapa-envios", mapaEnvios);
app.route("/tracking", tracking);
app.route("/integraciones", integraciones);

Deno.serve(app.fetch);





// redeploy

