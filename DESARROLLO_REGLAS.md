# Reglas de Desarrollo — ODDY / Charlie Platform

## Problema documentado: Cursor no escribe cambios al disco

### ¿Qué pasó?
Cursor reportaba que había migrado `abastecimientoApi.ts` a `supabase.from()` 
pero en realidad nunca escribió los cambios en disco. Cuando verificábamos con 
`Get-Content` el archivo mostraba el contenido correcto (Cursor lo leía desde 
su contexto interno), pero `Select-String` (que lee el archivo real) mostraba 
los `fetch()` originales. El build tomaba el archivo real del disco y el bundle 
en producción nunca cambiaba.

### ¿Cómo se detectó?
Comparando el hash del bundle en producción. Si el hash no cambia entre deployments,
el archivo fuente no cambió en disco.

### ¿Cómo se resolvió?
Reescribir el archivo completo con contenido explícito y controlado, no pedirle 
a Cursor que "lo migre igual que otro archivo".

---

## Reglas obligatorias

### Regla 1 — Verificar escritura en disco después de toda migración
```powershell
Select-String -Path "src\app\services\*.ts" -Pattern "fetch|BASE|apiUrl|functions/v1"
```
Si devuelve resultados, el cambio NO se aplicó. Repetir con contenido explícito.

### Regla 2 — Verificar en el bundle después del build
```powershell
Select-String -Path "dist\assets\NombreArchivo*" -Pattern "functions/v1/api"
```
Si aparece en el bundle, está en el código fuente. El build no mintió.

### Regla 3 — Para migraciones, siempre dar el contenido completo
No decir "reescribilo igual que depositosApi.ts". Dar el código exacto a escribir.
Cursor interpreta y esa interpretación puede quedarse en su contexto sin tocar el disco.

### Regla 4 — Confirmar que el hash del bundle cambia
Entre deployments, el nombre del archivo JS debe cambiar (Vite usa hash del contenido).
Si el hash es igual, el contenido del archivo fuente no cambió.

### Regla 5 — Todos los comandos git desde el subdirectorio correcto
NUNCA ejecutar git desde `C:\Carlos\Marketplace\ODDY` (raíz).
SIEMPRE especificar el directorio en cada prompt:
- Constructor → `C:\Carlos\Marketplace\ODDY\Constructor`
- ODDY Front → `C:\Carlos\Marketplace\ODDY\ODDY_Front2`

Los commits en el repo raíz NO llegan a GitHub ni a Vercel.

### Regla 6 — Nombres de tablas: código vs Supabase
Antes de crear un service, verificar que el nombre de tabla en el código 
coincida exactamente con el nombre en Supabase.

Query de verificación:
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
```

Comparar contra los `supabase.from('...')` del proyecto:
```powershell
Select-String -Path "src\**\*.ts" -Pattern "supabase\.from\(" -Recurse | 
  Select-Object -ExpandProperty Line | Sort-Object | Get-Unique
```

### Regla 7 — RLS: toda tabla nueva necesita política
Después de crear una tabla en Supabase, siempre ejecutar:
```sql
ALTER TABLE nombre_tabla ENABLE ROW LEVEL SECURITY;
CREATE POLICY "nombre_tabla_all" ON nombre_tabla FOR ALL USING (true) WITH CHECK (true);
```
Sin política, RLS activo bloquea todo con error 403.

---

## Mapeo de tablas: código → Supabase (verificado)

| Código | Supabase | Estado |
|--------|----------|--------|
| `abastecimiento_alertas` | `abastecimiento_alertas` | ✅ |
| `abastecimiento_mrp` | `abastecimiento_mrp` | ✅ |
| `abastecimiento_ordenes_compra` | `abastecimiento_ordenes_compra` | ✅ |
| `produccion_articulos` | `produccion_articulos` | ✅ |
| `produccion_ordenes_armado` | `produccion_ordenes_armado` | ✅ |
| `fulfillment_ordenes` | `fulfillment_ordenes` | ✅ |
| `fulfillment_waves` | `fulfillment_waves` | ✅ |
| `roles_contextuales` | `roles_contextuales` | ✅ |
| `depositos` | `depositos` | ✅ |
| `inventario` | `inventario` | ✅ |
| `entregas` | `entregas` | ✅ |
| `envios` | `envios` | ✅ |
| `transportistas` | `transportistas` | ✅ |
| `vehiculos` | `vehiculos` | ✅ |
| `routes` | `routes` | ✅ |

---

## Arquitectura: dónde va cada cosa

- **Edge Functions** → solo para lógica de servidor (auth, webhooks, uploads, cálculos complejos)
- **supabase.from()** → todo CRUD simple de tablas
- **Constructor** → código fuente del dashboard admin (Charlie)
- **ODDY_Front2** → frontend del cliente ODDY
