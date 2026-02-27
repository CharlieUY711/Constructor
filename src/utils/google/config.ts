/* =====================================================
   Google Maps API Configuration
   ===================================================== */

// API Key de Google Maps
// IMPORTANTE: Configura la variable de entorno VITE_GOOGLE_MAPS_API_KEY
// Obtén tu API key en: https://console.cloud.google.com/google/maps-apis
// 
// Para desarrollo local, crea un archivo .env en la raíz del proyecto con:
// VITE_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY';

// URLs base de las APIs de Google
export const GOOGLE_MAPS_CONFIG = {
  apiKey: GOOGLE_MAPS_API_KEY,
  libraries: ['places', 'geocoding'] as const,
  language: 'es',
  region: 'UY', // Uruguay
};

// Verificar si Google Maps está cargado
export function isGoogleMapsLoaded(): boolean {
  return typeof window !== 'undefined' && 
         typeof (window as any).google !== 'undefined' && 
         typeof (window as any).google.maps !== 'undefined';
}

// Esperar a que Google Maps se cargue
export function waitForGoogleMaps(timeout = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isGoogleMapsLoaded()) {
      resolve();
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (isGoogleMapsLoaded()) {
        clearInterval(checkInterval);
        resolve();
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        reject(new Error('Timeout esperando Google Maps API'));
      }
    }, 100);
  });
}
