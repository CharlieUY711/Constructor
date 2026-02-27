/* =====================================================
   Google Maps Test View
   Página de prueba para los componentes de Google Maps
   ===================================================== */
import React, { useState } from 'react';
import { GoogleAddressAutocomplete } from '../../ui/GoogleAddressAutocomplete';
import { GoogleMap, type MapMarker } from '../../ui/GoogleMap';
import { geocodeAddress, reverseGeocode } from '../../../../utils/google/geocoding';
import { toast } from 'sonner';
import { MapPin, Navigation, Search, Loader2 } from 'lucide-react';

export function GoogleMapsTestView() {
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<{
    address: string;
    lat: number;
    lng: number;
  } | null>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeResult, setGeocodeResult] = useState<string>('');

  const handleAddressSelect = (result: {
    address: string;
    lat: number;
    lng: number;
    place_id?: string;
    formatted_address: string;
  }) => {
    setSelectedAddress(result);
    setMarkers([
      {
        id: 'selected',
        lat: result.lat,
        lng: result.lng,
        title: result.address,
        color: '#FF6835',
      },
    ]);
    toast.success('Dirección seleccionada');
  };

  const handleGeocode = async () => {
    if (!address2.trim()) {
      toast.error('Ingresá una dirección para geocodificar');
      return;
    }

    setIsGeocoding(true);
    setGeocodeResult('');
    try {
      const result = await geocodeAddress(address2);
      if (result) {
        setGeocodeResult(
          `✅ Dirección encontrada:\n` +
          `📍 ${result.formatted_address}\n` +
          `🌐 Lat: ${result.lat.toFixed(6)}\n` +
          `🌐 Lng: ${result.lng.toFixed(6)}\n` +
          `🆔 Place ID: ${result.place_id || 'N/A'}`
        );
        setMarkers([
          {
            id: 'geocoded',
            lat: result.lat,
            lng: result.lng,
            title: result.formatted_address,
            color: '#10B981',
          },
        ]);
        toast.success('Geocodificación exitosa');
      } else {
        setGeocodeResult('❌ No se encontró la dirección');
        toast.error('Dirección no encontrada');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      setGeocodeResult(`❌ Error: ${errorMsg}`);
      toast.error('Error en geocodificación');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleReverseGeocode = async () => {
    if (!selectedAddress) {
      toast.error('Seleccioná una dirección primero');
      return;
    }

    setIsGeocoding(true);
    try {
      const result = await reverseGeocode(selectedAddress.lat, selectedAddress.lng);
      if (result) {
        toast.success('Geocodificación inversa exitosa');
        setGeocodeResult(
          `✅ Coordenadas → Dirección:\n` +
          `📍 ${result.formatted_address}\n` +
          `🌐 Lat: ${result.lat.toFixed(6)}\n` +
          `🌐 Lng: ${result.lng.toFixed(6)}`
        );
      } else {
        setGeocodeResult('❌ No se encontró dirección para esas coordenadas');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      setGeocodeResult(`❌ Error: ${errorMsg}`);
      toast.error('Error en geocodificación inversa');
    } finally {
      setIsGeocoding(false);
    }
  };

  const center = selectedAddress
    ? { lat: selectedAddress.lat, lng: selectedAddress.lng }
    : { lat: -34.9011, lng: -56.1645 }; // Montevideo, Uruguay por defecto

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
          🗺️ Prueba de Google Maps API
        </h1>
        <p style={{ color: '#6B7280', fontSize: '16px' }}>
          Probá los componentes de geolocalización de Google Maps
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Autocompletado de direcciones */}
        <div style={{ 
          background: 'white', 
          padding: '24px', 
          borderRadius: '8px', 
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search className="w-5 h-5" />
            Autocompletado de Direcciones
          </h2>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              Buscar dirección (con autocompletado)
            </label>
            <GoogleAddressAutocomplete
              value={address1}
              onChange={setAddress1}
              onSelect={handleAddressSelect}
              placeholder="Ej: Av. 18 de Julio 1234, Montevideo"
            />
          </div>
          {selectedAddress && (
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              background: '#F3F4F6', 
              borderRadius: '6px',
              fontSize: '14px'
            }}>
              <div style={{ fontWeight: '600', marginBottom: '8px' }}>Dirección seleccionada:</div>
              <div style={{ color: '#6B7280' }}>{selectedAddress.address}</div>
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#9CA3AF' }}>
                Lat: {selectedAddress.lat.toFixed(6)}, Lng: {selectedAddress.lng.toFixed(6)}
              </div>
            </div>
          )}
        </div>

        {/* Geocodificación manual */}
        <div style={{ 
          background: 'white', 
          padding: '24px', 
          borderRadius: '8px', 
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Navigation className="w-5 h-5" />
            Geocodificación Manual
          </h2>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              Dirección a geocodificar
            </label>
            <input
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              placeholder="Ej: Plaza Independencia, Montevideo"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>
          <button
            onClick={handleGeocode}
            disabled={isGeocoding || !address2.trim()}
            style={{
              width: '100%',
              padding: '10px',
              background: isGeocoding ? '#9CA3AF' : '#FF6835',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: isGeocoding ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {isGeocoding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Geocodificando...
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4" />
                Obtener Coordenadas
              </>
            )}
          </button>
          {selectedAddress && (
            <button
              onClick={handleReverseGeocode}
              disabled={isGeocoding}
              style={{
                width: '100%',
                marginTop: '8px',
                padding: '10px',
                background: isGeocoding ? '#9CA3AF' : '#10B981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isGeocoding ? 'not-allowed' : 'pointer',
              }}
            >
              Geocodificación Inversa (Coordenadas → Dirección)
            </button>
          )}
        </div>
      </div>

      {/* Resultado de geocodificación */}
      {geocodeResult && (
        <div style={{ 
          marginBottom: '24px', 
          padding: '16px', 
          background: '#F3F4F6', 
          borderRadius: '8px',
          whiteSpace: 'pre-line',
          fontSize: '14px',
          fontFamily: 'monospace'
        }}>
          {geocodeResult}
        </div>
      )}

      {/* Mapa */}
      <div style={{ 
        background: 'white', 
        padding: '24px', 
        borderRadius: '8px', 
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin className="w-5 h-5" />
          Mapa Interactivo
        </h2>
        <GoogleMap
          center={center}
          zoom={selectedAddress ? 15 : 13}
          markers={markers}
          height="500px"
          onMarkerClick={(marker) => {
            toast.info(`Marcador: ${marker.title}`);
          }}
        />
      </div>

      {/* Instrucciones */}
      <div style={{ 
        marginTop: '24px', 
        padding: '16px', 
        background: '#EFF6FF', 
        borderRadius: '8px',
        border: '1px solid #BFDBFE'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
          📝 Instrucciones de prueba:
        </h3>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#1E40AF' }}>
          <li>Usá el autocompletado para buscar una dirección (aparecerán sugerencias mientras escribís)</li>
          <li>Seleccioná una dirección y verás el marcador en el mapa</li>
          <li>Probá la geocodificación manual ingresando una dirección y haciendo clic en "Obtener Coordenadas"</li>
          <li>Si hay una dirección seleccionada, podés probar la geocodificación inversa</li>
          <li>El mapa se centrará automáticamente en la dirección seleccionada</li>
        </ul>
      </div>
    </div>
  );
}
