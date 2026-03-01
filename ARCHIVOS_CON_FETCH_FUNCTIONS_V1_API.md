# Archivos que usan fetch() apuntando a /functions/v1/api/

Este documento lista todos los archivos en el proyecto que usan `fetch()` apuntando a Edge Functions (`/functions/v1/api/`).

## Archivos corregidos (ahora usan supabase.from())

✅ **src/app/services/syncManifest.ts** - Ya usaba `supabase.from('roadmap_modules')` directamente
✅ **src/app/components/admin/views/HealthMonitorView.tsx** - Corregido para usar `supabase.from('roadmap_modules')`
✅ **src/app/components/admin/ConnectionStatusIcon.tsx** - Corregido para usar `supabase.from('roadmap_modules')`

## Archivos que aún usan fetch() con /functions/v1/api/

### Servicios API (usando BASE que apunta a /functions/v1/api/)

1. **src/app/services/roadmapApi.ts**
   - Usa `BASE = ${apiUrl}/roadmap` donde `apiUrl = ${supabaseUrl}/functions/v1/api`
   - Endpoints: `/modules`, `/modules-bulk`, `/tasks/*`, `/historial/*`, `/audit/*`, `/ideas-promovidas/*`

2. **src/app/services/vehiculosApi.ts**
   - Usa `BASE` que apunta a `/functions/v1/api/vehiculos`

3. **src/app/services/trackingApi.ts**
   - Usa `BASE` que apunta a `/functions/v1/api/tracking`

4. **src/app/services/productosSecondhandApi.ts**
   - Usa `BASE` que apunta a `/functions/v1/api/productos-secondhand`

5. **src/app/services/produccionApi.ts**
   - Usa `BASE` que apunta a `/functions/v1/api/produccion`
   - Endpoints: `/articulos/*`, `/ordenes/*`

6. **src/app/services/subcategoriasApi.ts**
   - Usa `BASE` que apunta a `/functions/v1/api/subcategorias`

7. **src/app/services/rolesApi.ts**
   - Usa `BASE` que apunta a `/functions/v1/api/roles`

8. **src/app/services/rrssApi.ts**
   - Usa `BASE` que apunta a `/functions/v1/api/rrss`

9. **src/app/services/personasApi.ts**
   - Usa `BASE` que apunta a `/functions/v1/api/personas`

10. **src/app/services/pedidosApi.ts**
    - Usa `BASE` que apunta a `/functions/v1/api/pedidos`

11. **src/app/services/organizacionesApi.ts**
    - Usa `BASE` que apunta a `/functions/v1/api/organizaciones`

12. **src/app/services/metodosEnvioApi.ts**
    - Usa `BASE` que apunta a `/functions/v1/api/metodos-envio`

13. **src/app/services/marketingApi.ts**
    - Usa `BASE` que apunta a `/functions/v1/api/marketing`

14. **src/app/services/mapaEnviosApi.ts**
    - Usa `BASE` que apunta a `/functions/v1/api/mapa-envios`

15. **src/app/services/integracionesApi.ts**
    - Usa `BASE` que apunta a `/functions/v1/api/integraciones`
    - Endpoints: `/api-keys/*`, `/webhooks/*`, `/logs/*`, `/ping`

16. **src/app/services/metodosPagoApi.ts**
    - Usa `BASE` que apunta a `/functions/v1/api/metodos-pago`

17. **src/app/services/etiquetasApi.ts**
    - Usa `BASE` que apunta a `/functions/v1/api/etiquetas`

18. **src/app/services/disputasApi.ts**
    - Usa `BASE` que apunta a `/functions/v1/api/disputas`

19. **src/app/services/fulfillmentApi.ts**
    - Usa `BASE` que apunta a `/functions/v1/api/fulfillment`
    - Endpoints: `/ordenes/*`, `/waves/*`

20. **src/app/services/departamentosApi.ts**
    - Usa `BASE` que apunta a `/functions/v1/api/departamentos`

21. **src/app/services/categoriasApi.ts**
    - Usa `BASE` que apunta a `/functions/v1/api/categorias`

22. **src/app/services/abastecimientoApi.ts**
    - Usa `BASE` que apunta a `/functions/v1/api/abastecimiento`
    - Endpoints: `/alertas/*`, `/ordenes-compra/*`, `/mrp/*`

### Componentes de vistas

23. **src/app/components/admin/views/ERPInventarioView.tsx**
    - `BASE = https://${projectId}.supabase.co/functions/v1/api`
    - Endpoints: `/productos/market/*`

24. **src/app/components/admin/views/IdeasBoardView.tsx**
    - `API = https://${projectId}.supabase.co/functions/v1/api/ideas`
    - Endpoints: `/canvases/*`, `/ideas/*`

25. **src/app/components/admin/IdeaQuickModal.tsx**
    - `API = https://${projectId}.supabase.co/functions/v1/api/ideas`
    - Endpoints: `/ideas/*`

26. **src/app/components/admin/views/CargaMasivaView.tsx**
    - `API = https://${projectId}.supabase.co/functions/v1/api/carga-masiva`
    - Endpoints: `/upload`, `/files`

27. **src/app/components/admin/views/MetaMapView.tsx**
    - `WEBHOOK_URL = https://${projectId}.supabase.co/functions/v1/api/age-verification/metamap-webhook`

28. **src/app/components/admin/views/AuthRegistroView.tsx**
    - `https://${projectId}.supabase.co/functions/v1/api/auth/signup`

29. **src/app/components/admin/views/PagosView.tsx**
    - `API = https://${projectId}.supabase.co/functions/v1/api`

30. **src/app/components/admin/ModuleFilesPanel.tsx**
    - `API = https://${projectId}.supabase.co/functions/v1/api`
    - Endpoints: `/roadmap/files/*`

31. **src/app/public/MensajePage.tsx**
    - `API = https://${projectId}.supabase.co/functions/v1/api`

## Nota

Estos archivos usan Edge Functions que requieren lógica del servidor o procesamiento especial que no se puede hacer directamente con `supabase.from()`. Solo se corrigieron los archivos que llamaban a `/roadmap/modules` para usar `supabase.from('roadmap_modules')` directamente, ya que esa tabla existe en Supabase y no requiere lógica de Edge Function.
