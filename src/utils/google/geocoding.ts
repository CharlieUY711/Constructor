/* =====================================================
   Google Geocoding Service
   Convierte direcciones en coordenadas y viceversa
   ===================================================== */
import { waitForGoogleMaps, isGoogleMapsLoaded } from './config';
import { loadGoogleMapsScript } from './loader';

export interface GeocodeResult {
  address: string;
  lat: number;
  lng: number;
  formatted_address: string;
  place_id?: string;
  types?: string[];
  components?: {
    street_number?: string;
    route?: string;
    locality?: string;
    administrative_area_level_1?: string;
    administrative_area_level_2?: string;
    country?: string;
    postal_code?: string;
  };
}

export interface ReverseGeocodeResult {
  lat: number;
  lng: number;
  address: string;
  formatted_address: string;
  place_id?: string;
  components?: {
    street_number?: string;
    route?: string;
    locality?: string;
    administrative_area_level_1?: string;
    administrative_area_level_2?: string;
    country?: string;
    postal_code?: string;
  };
}

/**
 * Geocodifica una dirección (convierte dirección → coordenadas)
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  try {
    await loadGoogleMapsScript();
    await waitForGoogleMaps();
    
    if (!isGoogleMapsLoaded()) {
      throw new Error('Google Maps API no está disponible');
    }

    const geocoder = new (window as any).google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
      geocoder.geocode(
        { address, region: 'AR', language: 'es' },
        (results: any[], status: string) => {
          if (status === 'OK' && results && results.length > 0) {
            const result = results[0];
            const location = result.geometry.location;
            
            // Extraer componentes de la dirección
            const components: any = {};
            result.address_components.forEach((comp: any) => {
              const types = comp.types;
              if (types.includes('street_number')) components.street_number = comp.long_name;
              if (types.includes('route')) components.route = comp.long_name;
              if (types.includes('locality')) components.locality = comp.long_name;
              if (types.includes('administrative_area_level_1')) components.administrative_area_level_1 = comp.short_name;
              if (types.includes('administrative_area_level_2')) components.administrative_area_level_2 = comp.long_name;
              if (types.includes('country')) components.country = comp.short_name;
              if (types.includes('postal_code')) components.postal_code = comp.long_name;
            });

            resolve({
              address,
              lat: location.lat(),
              lng: location.lng(),
              formatted_address: result.formatted_address,
              place_id: result.place_id,
              types: result.types,
              components,
            });
          } else if (status === 'ZERO_RESULTS') {
            resolve(null);
          } else {
            reject(new Error(`Error en geocodificación: ${status}`));
          }
        }
      );
    });
  } catch (error) {
    console.error('[geocoding] Error geocodificando dirección:', error);
    throw error;
  }
}

/**
 * Geocodificación inversa (convierte coordenadas → dirección)
 */
export async function reverseGeocode(lat: number, lng: number): Promise<ReverseGeocodeResult | null> {
  try {
    await loadGoogleMapsScript();
    await waitForGoogleMaps();
    
    if (!isGoogleMapsLoaded()) {
      throw new Error('Google Maps API no está disponible');
    }

    const geocoder = new (window as any).google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
      geocoder.geocode(
        { location: { lat, lng }, region: 'AR', language: 'es' },
        (results: any[], status: string) => {
          if (status === 'OK' && results && results.length > 0) {
            const result = results[0];
            
            // Extraer componentes de la dirección
            const components: any = {};
            result.address_components.forEach((comp: any) => {
              const types = comp.types;
              if (types.includes('street_number')) components.street_number = comp.long_name;
              if (types.includes('route')) components.route = comp.long_name;
              if (types.includes('locality')) components.locality = comp.long_name;
              if (types.includes('administrative_area_level_1')) components.administrative_area_level_1 = comp.short_name;
              if (types.includes('administrative_area_level_2')) components.administrative_area_level_2 = comp.long_name;
              if (types.includes('country')) components.country = comp.short_name;
              if (types.includes('postal_code')) components.postal_code = comp.long_name;
            });

            resolve({
              lat,
              lng,
              address: result.formatted_address,
              formatted_address: result.formatted_address,
              place_id: result.place_id,
              components,
            });
          } else if (status === 'ZERO_RESULTS') {
            resolve(null);
          } else {
            reject(new Error(`Error en geocodificación inversa: ${status}`));
          }
        }
      );
    });
  } catch (error) {
    console.error('[geocoding] Error en geocodificación inversa:', error);
    throw error;
  }
}

/**
 * Geocodifica múltiples direcciones en paralelo
 */
export async function geocodeAddresses(addresses: string[]): Promise<(GeocodeResult | null)[]> {
  return Promise.all(addresses.map(addr => geocodeAddress(addr)));
}
