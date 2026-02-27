# Configuración de Google Maps API

Este proyecto utiliza Google Maps API para geolocalización, autocompletado de direcciones y visualización de mapas.

## Pasos para configurar

### 1. Obtener API Key de Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita las siguientes APIs:
   - **Maps JavaScript API** (requerida)
   - **Geocoding API** (requerida)
   - **Places API** (requerida)
   - **Distance Matrix API** (opcional, para calcular distancias)
   - **Directions API** (opcional, para rutas)

4. Ve a **"APIs y servicios" > "Credenciales"**
5. Haz clic en **"Crear credenciales" > "Clave de API"**
6. Copia la API key generada

### 2. Configurar la API Key en el proyecto

Crea un archivo `.env` en la raíz del proyecto (`Constructor/.env`) con el siguiente contenido:

```env
VITE_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

**⚠️ IMPORTANTE:**
- No subas el archivo `.env` al repositorio (ya está en `.gitignore`)
- Para producción, configura la variable de entorno en tu plataforma de hosting (Vercel, Netlify, etc.)

### 3. Restringir la API Key (Recomendado para producción)

Para mayor seguridad, restringe tu API key:

1. En Google Cloud Console, ve a **"APIs y servicios" > "Credenciales"**
2. Haz clic en tu API key
3. En **"Restricciones de aplicación"**, selecciona:
   - **"Restringir clave"**
   - **"Sitios web HTTP"** (para desarrollo local y producción)
   - Agrega los dominios permitidos:
     - `http://localhost:*` (para desarrollo)
     - `https://tu-dominio.com` (para producción)

4. En **"Restricciones de API"**, selecciona:
   - **"Restringir clave"**
   - Selecciona solo las APIs que necesitas (Maps JavaScript, Geocoding, Places, etc.)

## Uso en el código

### Autocompletado de direcciones

```tsx
import { GoogleAddressAutocomplete } from '@/app/components/ui/GoogleAddressAutocomplete';

<GoogleAddressAutocomplete
  value={address}
  onSelect={(result) => {
    console.log('Dirección seleccionada:', result.address);
    console.log('Coordenadas:', result.lat, result.lng);
  }}
  onChange={(value) => setAddress(value)}
/>
```

### Mapa interactivo

```tsx
import { GoogleMap } from '@/app/components/ui/GoogleMap';

<GoogleMap
  center={{ lat: -34.6037, lng: -58.3816 }}
  zoom={13}
  markers={[
    {
      id: '1',
      lat: -34.6037,
      lng: -58.3816,
      title: 'Buenos Aires',
      color: '#FF6835',
    },
  ]}
  route={{
    origin: { lat: -34.6037, lng: -58.3816 },
    destination: { lat: -34.6118, lng: -58.3960 },
  }}
/>
```

### Geocodificación programática

```tsx
import { geocodeAddress, reverseGeocode } from '@/utils/google/geocoding';

// Convertir dirección a coordenadas
const result = await geocodeAddress('Av. Corrientes 1234, Buenos Aires');
if (result) {
  console.log('Lat:', result.lat);
  console.log('Lng:', result.lng);
}

// Convertir coordenadas a dirección
const address = await reverseGeocode(-34.6037, -58.3816);
if (address) {
  console.log('Dirección:', address.formatted_address);
}
```

## Servicios disponibles

- **`geocoding.ts`**: Geocodificación (dirección → coordenadas) y geocodificación inversa
- **`places.ts`**: Autocompletado de direcciones y búsqueda de lugares
- **`config.ts`**: Configuración y utilidades para verificar carga de Google Maps
- **`loader.ts`**: Carga dinámica del script de Google Maps

## Componentes disponibles

- **`GoogleAddressAutocomplete`**: Input con autocompletado de direcciones
- **`GoogleMap`**: Mapa interactivo con marcadores y rutas

## Troubleshooting

### Error: "Google Maps API no está disponible"
- Verifica que la API key esté configurada correctamente en `.env`
- Asegúrate de que las APIs estén habilitadas en Google Cloud Console
- Verifica que no haya restricciones de dominio que bloqueen tu sitio

### Error: "This API project is not authorized to use this API"
- Ve a Google Cloud Console y habilita las APIs necesarias
- Espera unos minutos después de habilitar las APIs

### El mapa no se carga
- Verifica la consola del navegador para ver errores específicos
- Asegúrate de que la API key tenga permisos para Maps JavaScript API
- Verifica que no haya errores de CORS o restricciones de dominio
