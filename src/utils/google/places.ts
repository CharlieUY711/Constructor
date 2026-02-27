/* =====================================================
   Google Places API Service
   Autocompletado de direcciones y búsqueda de lugares
   ===================================================== */
import { waitForGoogleMaps, isGoogleMapsLoaded } from './config';
import { loadGoogleMapsScript } from './loader';

export interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types?: string[];
}

export interface PlaceDetails {
  place_id: string;
  formatted_address: string;
  name?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  types?: string[];
  international_phone_number?: string;
  website?: string;
}

/**
 * Obtiene predicciones de autocompletado para una dirección
 */
export async function getPlacePredictions(
  input: string,
  options?: {
    location?: { lat: number; lng: number };
    radius?: number;
    types?: string[];
  }
): Promise<PlacePrediction[]> {
  try {
    await loadGoogleMapsScript();
    await waitForGoogleMaps();
    
    if (!isGoogleMapsLoaded()) {
      throw new Error('Google Maps API no está disponible');
    }

    const service = new (window as any).google.maps.places.AutocompleteService();
    
    return new Promise((resolve, reject) => {
      const request: any = {
        input,
        componentRestrictions: { country: 'ar' },
        language: 'es',
      };

      if (options?.location) {
        request.location = new (window as any).google.maps.LatLng(
          options.location.lat,
          options.location.lng
        );
        if (options.radius) {
          request.radius = options.radius;
        }
      }

      if (options?.types && options.types.length > 0) {
        request.types = options.types;
      }

      service.getPlacePredictions(request, (predictions: any[], status: string) => {
        if (status === 'OK' && predictions) {
          const results: PlacePrediction[] = predictions.map(pred => ({
            place_id: pred.place_id,
            description: pred.description,
            structured_formatting: {
              main_text: pred.structured_formatting.main_text,
              secondary_text: pred.structured_formatting.secondary_text,
            },
            types: pred.types,
          }));
          resolve(results);
        } else if (status === 'ZERO_RESULTS') {
          resolve([]);
        } else {
          reject(new Error(`Error obteniendo predicciones: ${status}`));
        }
      });
    });
  } catch (error) {
    console.error('[places] Error obteniendo predicciones:', error);
    throw error;
  }
}

/**
 * Obtiene detalles completos de un lugar por su place_id
 */
export async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  try {
    await loadGoogleMapsScript();
    await waitForGoogleMaps();
    
    if (!isGoogleMapsLoaded()) {
      throw new Error('Google Maps API no está disponible');
    }

    const service = new (window as any).google.maps.places.PlacesService(
      document.createElement('div')
    );
    
    return new Promise((resolve, reject) => {
      service.getDetails(
        {
          placeId,
          fields: [
            'place_id',
            'formatted_address',
            'name',
            'geometry',
            'address_components',
            'types',
            'international_phone_number',
            'website',
          ],
          language: 'es',
        },
        (place: any, status: string) => {
          if (status === 'OK' && place) {
            resolve({
              place_id: place.place_id,
              formatted_address: place.formatted_address,
              name: place.name,
              geometry: {
                location: {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                },
              },
              address_components: place.address_components || [],
              types: place.types,
              international_phone_number: place.international_phone_number,
              website: place.website,
            });
          } else if (status === 'ZERO_RESULTS') {
            resolve(null);
          } else {
            reject(new Error(`Error obteniendo detalles del lugar: ${status}`));
          }
        }
      );
    });
  } catch (error) {
    console.error('[places] Error obteniendo detalles del lugar:', error);
    throw error;
  }
}
