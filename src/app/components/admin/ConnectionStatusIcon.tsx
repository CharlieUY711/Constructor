/**
 * ConnectionStatusIcon — Icono de estado de conexión con backend
 * Muestra un rayo que indica si hay conexión con Supabase
 * - Rojo desconectado = sin conexión
 * - Verde con círculo verde = conectado
 */
import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { supabase } from '../../../utils/supabase/client';

interface Props {
  size?: number;
  style?: React.CSSProperties;
}

export function ConnectionStatusIcon({ size = 17, style }: Props) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    // Verificar conexión usando supabase.from() directamente
    const checkConnection = async () => {
      try {
        const { error } = await supabase
          .from('roadmap_modules')
          .select('id')
          .limit(1);
        setIsConnected(!error);
      } catch {
        setIsConnected(false);
      }
    };

    checkConnection();
    // Verificar cada 30 segundos
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  // Si aún no se ha verificado, mostrar estado neutral
  if (isConnected === null) {
    return (
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          border: '2px solid #9CA3AF40',
          backgroundColor: '#9CA3AF08',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          ...style,
        }}
        title="Verificando conexión..."
      >
        <Zap size={size} color="#9CA3AF" strokeWidth={2.2} />
      </div>
    );
  }

  if (isConnected) {
    // Conectado: rayo verde con círculo verde
    return (
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          border: '2px solid #10B981',
          backgroundColor: '#10B98108',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          ...style,
        }}
        title="Conectado al backend"
      >
        <Zap size={size} color="#10B981" strokeWidth={2.2} fill="#10B981" />
      </div>
    );
  }

  // Desconectado: rayo rojo
  return (
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: '50%',
        border: '2px solid #EF444440',
        backgroundColor: '#EF444408',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...style,
      }}
      title="Sin conexión al backend"
    >
      <Zap size={size} color="#EF4444" strokeWidth={2.2} />
    </div>
  );
}
