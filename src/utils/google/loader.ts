/* =====================================================
   Google Maps API Loader
   Carga dinámicamente el script de Google Maps
   ===================================================== */
import { GOOGLE_MAPS_API_KEY } from './config';

let isLoaded = false;
let isLoading = false;
let loadPromise: Promise<void> | null = null;

/**
 * Carga el script de Google Maps API si no está ya cargado
 */
export function loadGoogleMapsScript(): Promise<void> {
  // Si ya está cargado, retornar inmediatamente
  if (isLoaded && typeof window !== 'undefined' && (window as any).google?.maps) {
    return Promise.resolve();
  }

  // Si ya está cargando, retornar la promesa existente
  if (isLoading && loadPromise) {
    return loadPromise;
  }

  // Verificar si el script ya existe en el DOM
  const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
  if (existingScript) {
    isLoading = true;
    loadPromise = waitForGoogleMaps();
    return loadPromise;
  }

  // Crear y cargar el script
  isLoading = true;
  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geocoding&language=es&region=UY`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      isLoaded = true;
      isLoading = false;
      // Esperar un momento para asegurar que Google Maps esté completamente inicializado
      setTimeout(() => {
        if ((window as any).google?.maps) {
          resolve();
        } else {
          reject(new Error('Google Maps API no se inicializó correctamente'));
        }
      }, 100);
    };
    
    script.onerror = () => {
      isLoading = false;
      loadPromise = null;
      reject(new Error('Error cargando Google Maps API. Verifica tu API key.'));
    };
    
    document.head.appendChild(script);
  });

  return loadPromise;
}

/**
 * Espera a que Google Maps esté disponible
 */
function waitForGoogleMaps(timeout = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).google?.maps) {
      resolve();
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if ((window as any).google?.maps) {
        clearInterval(checkInterval);
        isLoaded = true;
        resolve();
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        reject(new Error('Timeout esperando Google Maps API'));
      }
    }, 100);
  });
}
