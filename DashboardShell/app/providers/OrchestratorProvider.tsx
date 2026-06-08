import React, { createContext, useContext } from 'react';
import type { RemoteConfig } from '../../config/configLoader';

interface OrchestratorContextValue {
  config: RemoteConfig | null;
  isReady: boolean;
  clienteNombre: string;
}

const OrchestratorContext = createContext<OrchestratorContextValue>({
  config: null,
  isReady: true,
  clienteNombre: 'Charlie Platform',
});

export const useOrchestrator = () => useContext(OrchestratorContext);

export function OrchestratorProvider({ children }: { children: React.ReactNode }) {
  return (
    <OrchestratorContext.Provider value={{ config: null, isReady: true, clienteNombre: 'Charlie Platform' }}>
      {children}
    </OrchestratorContext.Provider>
  );
}
