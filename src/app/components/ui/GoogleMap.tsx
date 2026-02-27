/* =====================================================
   Google Map Component
   Mapa interactivo con marcadores y rutas
   ===================================================== */
import React, { useEffect, useRef, useState } from 'react';
import { waitForGoogleMaps, isGoogleMapsLoaded } from '../../../utils/google/config';
import { loadGoogleMapsScript } from '../../../utils/google/loader';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title?: string;
  label?: string;
  icon?: string;
  color?: string;
  onClick?: () => void;
}

export interface MapRoute {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  waypoints?: Array<{ lat: number; lng: number }>;
  color?: string;
}

export interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: MapMarker[];
  route?: MapRoute;
  height?: string;
  className?: string;
  onMapReady?: (map: any) => void;
  onMarkerClick?: (marker: MapMarker) => void;
}

const DEFAULT_CENTER = { lat: -34.9011, lng: -56.1645 }; // Montevideo, Uruguay
const DEFAULT_ZOOM = 13;

export function GoogleMap({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  markers = [],
  route,
  height = '400px',
  className = '',
  onMapReady,
  onMarkerClick,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const directionsServiceRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inicializar mapa
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      try {
        await loadGoogleMapsScript();
        await waitForGoogleMaps(10000);
        
        if (!isMounted || !mapRef.current) return;

        if (!isGoogleMapsLoaded()) {
          throw new Error('Google Maps API no está disponible');
        }

        const google = (window as any).google;
        
        // Crear instancia del mapa
        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          language: 'es',
          region: 'UY', // Uruguay
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
        });

        mapInstanceRef.current = map;
        setIsLoading(false);
        onMapReady?.(map);

        // Inicializar servicios de direcciones si hay ruta
        if (route) {
          directionsServiceRef.current = new google.maps.DirectionsService();
          directionsRendererRef.current = new google.maps.DirectionsRenderer({
            map,
            suppressMarkers: false,
          });
        }
      } catch (err) {
        console.error('[GoogleMap] Error inicializando mapa:', err);
        setError(err instanceof Error ? err.message : 'Error cargando el mapa');
        setIsLoading(false);
      }
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, []);

  // Actualizar centro y zoom
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(center);
      mapInstanceRef.current.setZoom(zoom);
    }
  }, [center.lat, center.lng, zoom]);

  // Actualizar marcadores
  useEffect(() => {
    if (!mapInstanceRef.current || !isGoogleMapsLoaded()) return;

    const google = (window as any).google;

    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Crear nuevos marcadores
    markers.forEach(markerData => {
      const marker = new google.maps.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map: mapInstanceRef.current,
        title: markerData.title,
        label: markerData.label,
        icon: markerData.icon || (markerData.color ? {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: markerData.color,
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
        } : undefined),
      });

      if (markerData.onClick || onMarkerClick) {
        marker.addListener('click', () => {
          markerData.onClick?.();
          onMarkerClick?.(markerData);
        });
      }

      markersRef.current.push(marker);
    });
  }, [markers, onMarkerClick]);

  // Actualizar ruta
  useEffect(() => {
    if (!route || !directionsServiceRef.current || !directionsRendererRef.current) return;

    const google = (window as any).google;

    const request: any = {
      origin: { lat: route.origin.lat, lng: route.origin.lng },
      destination: { lat: route.destination.lat, lng: route.destination.lng },
      travelMode: google.maps.TravelMode.DRIVING,
      language: 'es',
      region: 'AR',
    };

    if (route.waypoints && route.waypoints.length > 0) {
      request.waypoints = route.waypoints.map(wp => ({
        location: { lat: wp.lat, lng: wp.lng },
        stopover: true,
      }));
    }

    directionsServiceRef.current.route(request, (result: any, status: string) => {
      if (status === 'OK' && directionsRendererRef.current) {
        directionsRendererRef.current.setDirections(result);
        
        // Aplicar color personalizado si se especifica
        if (route.color) {
          const route = result.routes[0];
          if (route) {
            const polyline = new google.maps.Polyline({
              path: route.overview_path,
              strokeColor: route.color,
              strokeWeight: 4,
            });
            polyline.setMap(mapInstanceRef.current);
          }
        }
      } else {
        console.error('[GoogleMap] Error calculando ruta:', status);
      }
    });
  }, [route]);

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-md ${className}`}
        style={{ height }}
      >
        <div className="text-center text-gray-600">
          <p className="font-medium">Error cargando el mapa</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Cargando mapa...</p>
          </div>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-md"
        style={{ minHeight: '200px' }}
      />
    </div>
  );
}
