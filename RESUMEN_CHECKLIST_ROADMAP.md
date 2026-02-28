# Resumen del Módulo Checklist & Roadmap

## 📋 Descripción General

El módulo **Checklist & Roadmap** es un sistema de gestión y seguimiento del estado de desarrollo de todos los módulos del proyecto Charlie Marketplace Builder. Permite visualizar el progreso, gestionar prioridades, colas de ejecución y realizar auditorías automáticas.

## 🏗️ Arquitectura

### Componentes Principales

1. **Frontend (`ChecklistRoadmap.tsx`)**
   - Componente React principal que renderiza el roadmap
   - 4 vistas: Lista, Kanban, Estadísticas, Cola de Ejecución
   - Gestión de estados, prioridades, submódulos y tareas

2. **Backend API (`supabase/functions/api/roadmap.tsx`)**
   - Edge Function de Supabase que maneja todas las operaciones
   - Endpoints REST para módulos, tasks, historial, auditoría e ideas promovidas

3. **Base de Datos (SQL)**
   - `roadmap_modules`: Estado dinámico de cada módulo
   - `roadmap_tasks`: Tareas granulares por módulo/submódulo
   - `roadmap_historial`: Historial de cambios de estado
   - `ideas_promovidas`: Ideas convertidas a módulos

4. **Servicio Frontend (`roadmapApi.ts`)**
   - Cliente API que comunica frontend con backend
   - Funciones para obtener, guardar y actualizar datos

## 🔄 Flujo de Datos

### Carga de Módulos

```
Frontend (loadModules)
  ↓
roadmapApi.getModules()
  ↓
GET /api/roadmap/modules
  ↓
Backend: SELECT * FROM roadmap_modules
  ↓
Retorna: RoadmapModule[] (solo estado, prioridad, etc.)
  ↓
Frontend: Aplica applyBuiltStatus() y setModules()
```

### Estructura de Datos Esperada

El frontend espera objetos `Module` con:
- `id`: string
- `name`: string ⚠️ **FALTA EN LA API**
- `category`: ModuleCategory ⚠️ **FALTA EN LA API**
- `description`: string ⚠️ **FALTA EN LA API**
- `status`: ModuleStatus
- `priority`: ModulePriority
- `estimatedHours`: number
- `submodules`: SubModule[]
- `execOrder`: number
- `notas`: string

## ⚠️ PROBLEMA IDENTIFICADO: Módulo Vacío

### Síntoma
El checklist aparece completamente vacío, sin módulos visibles.

### Causa Raíz

**El endpoint GET /modules solo devuelve datos de estado desde SQL, pero NO incluye los datos base (name, category, description).**

1. **Tabla SQL vacía**: Si `roadmap_modules` está vacía, la API devuelve `[]`
2. **Datos base faltantes**: La API no combina los datos base (name, category, description) con los datos de estado
3. **Frontend espera datos completos**: El componente espera `Module[]` con todos los campos, pero recibe `RoadmapModule[]` incompleto

### Código Problemático

**Backend (`roadmap.tsx` líneas 58-88):**
```typescript
roadmap.get("/modules", async (c) => {
  const { data } = await supabase
    .from("roadmap_modules")
    .select("*")
    .order("exec_order", { ascending: true, nullsFirst: false });
  
  // ❌ Solo devuelve datos de estado, NO incluye name, category, description
  const modules = (data ?? []).map((row: any) => ({
    id: row.id,
    status: row.status,
    priority: row.priority,
    // ... otros campos de estado
  }));
  
  return c.json({ modules, count: modules.length });
});
```

**Frontend (`ChecklistRoadmap.tsx` líneas 258-277):**
```typescript
const loadModules = async () => {
  const savedModules = await roadmapApi.getModules();
  
  if (savedModules && savedModules.length > 0) {
    // ❌ savedModules NO tiene name, category, description
    const processed = savedModules.map((m) => applyBuiltStatus(m as Module));
    setModules(processed);
  } else {
    // ❌ Si SQL está vacío, muestra lista vacía
    setModules([]);
  }
};
```

### Referencias a MODULES_DATA

El código menciona `MODULES_DATA` en varios lugares:
- `AuditPanel.tsx`: "IDs en MODULES_DATA cubiertos por vistas reales"
- `moduleManifest.ts`: "IDs exactos en MODULES_DATA que esta vista cubre"
- `roadmap_migration.sql`: "mismo id que MODULES_DATA (ej: 'erp-inventory')"

**Pero `MODULES_DATA` NO está definido en ningún archivo del código actual.**

## 🔍 Análisis Detallado

### ¿Dónde deberían estar los datos base?

Los datos base (name, category, description) deberían venir de:
1. **Una fuente estática** (archivo TypeScript con MODULES_DATA)
2. **El backend** (combinando datos base con estado de SQL)
3. **Una inicialización** (seed de la tabla SQL con datos base)

### Estado Actual

- ✅ Tabla SQL existe y funciona
- ✅ Backend API funciona para estado
- ✅ Frontend funciona cuando hay datos
- ❌ **Falta combinación de datos base + estado**
- ❌ **Falta inicialización cuando SQL está vacío**

## 🛠️ Soluciones Posibles

### Opción 1: Backend combina datos base + estado (RECOMENDADA)

Modificar el endpoint GET /modules para:
1. Obtener datos base desde una fuente estática (archivo JSON/TS en el backend)
2. Combinar con datos de estado de SQL
3. Devolver módulos completos

### Opción 2: Frontend combina datos

1. Definir MODULES_DATA en el frontend
2. En `loadModules()`, combinar MODULES_DATA con datos de la API
3. Si SQL está vacío, usar solo MODULES_DATA con estados por defecto

### Opción 3: Inicialización automática

1. Crear endpoint POST /modules/init que seed la tabla SQL
2. Llamar automáticamente cuando SQL está vacío
3. Usar datos base desde una fuente estática

## 📊 Estadísticas del Módulo

- **Líneas de código**: ~1,430 (ChecklistRoadmap.tsx)
- **Vistas**: 4 (Lista, Kanban, Stats, Queue)
- **Estados**: 7 (not-started, spec-ready, progress-10/50/80, ui-only, completed)
- **Categorías**: 17 (ecommerce, logistics, marketing, rrss, tools, erp, crm, etc.)
- **Funcionalidades**:
  - Gestión de estados y prioridades
  - Cola de ejecución ordenada
  - Tasks granulares por módulo
  - Auditoría automática
  - Ideas promovidas
  - Archivos adjuntos por módulo
  - Historial de cambios

## ✅ Solución Implementada

### Opción 1: Backend combina datos base + estado (IMPLEMENTADA)

**Archivos creados/modificados:**

1. **`supabase/functions/api/modulesData.ts`** (NUEVO)
   - Contiene `MODULES_DATA` con todos los datos base de módulos
   - Incluye: id, name, category, description, estimatedHours, submodules
   - 60+ módulos definidos con sus categorías y descripciones

2. **`supabase/functions/api/roadmap.tsx`** (MODIFICADO)
   - Endpoint GET /modules ahora combina datos base + estado de SQL
   - Si SQL está vacío, devuelve datos base con estados por defecto ("not-started", "medium")
   - Si hay datos en SQL, combina manteniendo los estados guardados

**Flujo actualizado:**
```
GET /modules
  ↓
1. Cargar estado desde roadmap_modules (SQL)
  ↓
2. Cargar datos base desde MODULES_DATA
  ↓
3. Combinar: datos base + estado (o valores por defecto si no hay estado)
  ↓
4. Devolver módulos completos con name, category, description, status, priority, etc.
```

**Resultado:**
- ✅ Frontend recibe módulos completos incluso si SQL está vacío
- ✅ Los módulos tienen name, category, description
- ✅ Los estados se mantienen si existen en SQL, o usan valores por defecto
- ✅ Submódulos incluidos cuando corresponden

## 🎯 Próximos Pasos

1. ✅ **Identificar fuente de MODULES_DATA** → CREADA
2. ✅ **Implementar combinación de datos** → IMPLEMENTADA
3. ✅ **Agregar inicialización automática** → IMPLEMENTADA (usa valores por defecto)
4. ⏳ **Probar carga de módulos** → PENDIENTE DE PRUEBA

## 📝 Notas Técnicas

- El módulo usa `BUILT_MODULE_IDS` y `SUPABASE_MODULE_IDS` del `moduleRegistry.ts` para aplicar estados automáticamente
- La función `applyBuiltStatus()` sobrescribe estados manuales basándose en el manifest
- El botón "Resync manifest" limpia SQL y recarga, pero no inicializa si está vacío

## 🔎 Evidencia del Problema

### IDs de Módulos Referenciados

El código hace referencia a IDs específicos de módulos:
- `ecommerce-pedidos` (en `AUDIT_MAP` y `moduleManifest`)
- `erp-inventory` (en comentarios SQL)
- `marketplace-productos` (en `AUDIT_MAP`)

Estos IDs sugieren que debería existir un mapeo de:
- **ID del módulo** → **name, category, description**

### Referencias en el Código

1. **`AUDIT_MAP` en ChecklistRoadmap.tsx** (líneas 214-223):
   - Mapea IDs de módulos a endpoints y tablas
   - Ejemplo: `"ecommerce-pedidos"` → `/api/pedidos` y tabla `pedidos`

2. **`moduleManifest.ts`**:
   - Define `checklistIds` que apuntan a estos IDs
   - Ejemplo: `checklistIds: ['ecommerce-pedidos']`

3. **`AUDITORIA_MODULOS.md`**:
   - Lista módulos con sus IDs, estados y vistas asociadas
   - Confirma que los módulos deberían tener datos base

### Conclusión

**El sistema fue diseñado para tener datos base de módulos, pero la implementación actual no los incluye en la API. La tabla SQL solo almacena estado dinámico, no los datos base estáticos.**
