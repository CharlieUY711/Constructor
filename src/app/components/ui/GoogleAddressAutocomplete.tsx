/* =====================================================
   Google Address Autocomplete Component
   Input con autocompletado de direcciones usando Google Places
   ===================================================== */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { getPlacePredictions, getPlaceDetails, type PlacePrediction } from '../../../utils/google/places';
import { type GeocodeResult } from '../../../utils/google/geocoding';

export interface AddressAutocompleteProps {
  value?: string;
  placeholder?: string;
  onSelect?: (result: {
    address: string;
    lat: number;
    lng: number;
    place_id?: string;
    formatted_address: string;
  }) => void;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export function GoogleAddressAutocomplete({
  value = '',
  placeholder = 'Ingresá una dirección...',
  onSelect,
  onChange,
  className = '',
  disabled = false,
  required = false,
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sincronizar value externo
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Buscar predicciones con debounce
  const searchPredictions = useCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setPredictions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await getPlacePredictions(query);
      setPredictions(results);
      setShowSuggestions(results.length > 0);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('[GoogleAddressAutocomplete] Error buscando predicciones:', error);
      setPredictions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
    setShowSuggestions(false);

    // Debounce de búsqueda
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      searchPredictions(newValue);
    }, 300);
  };

  const handleSelectPrediction = async (prediction: PlacePrediction) => {
    setInputValue(prediction.description);
    setShowSuggestions(false);
    setPredictions([]);
    onChange?.(prediction.description);

    // Obtener detalles completos del lugar
    try {
      const details = await getPlaceDetails(prediction.place_id);
      if (details && onSelect) {
        onSelect({
          address: prediction.description,
          lat: details.geometry.location.lat,
          lng: details.geometry.location.lng,
          place_id: prediction.place_id,
          formatted_address: details.formatted_address,
        });
      }
    } catch (error) {
      console.error('[GoogleAddressAutocomplete] Error obteniendo detalles:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || predictions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < predictions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < predictions.length) {
          handleSelectPrediction(predictions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (predictions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
        )}
      </div>

      {/* Lista de sugerencias */}
      {showSuggestions && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {predictions.map((prediction, index) => (
            <button
              key={prediction.place_id}
              type="button"
              onClick={() => handleSelectPrediction(prediction)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${
                index === selectedIndex ? 'bg-gray-50' : ''
              }`}
            >
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900">
                    {prediction.structured_formatting.main_text}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {prediction.structured_formatting.secondary_text}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
