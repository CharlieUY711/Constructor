/**
 * App.tsx — DashboardShell v2.0
 *
 * Jerarquía de providers:
 *   OrchestratorProvider  → carga config remota + inyecta tokens CSS
 *     ThemeProvider       → aplica tema base del shell (fallback/defaults)
 *       RouterProvider    → navegación
 */
import React from 'react';
import { RouterProvider } from 'react-router';
import { OrchestratorProvider } from './providers/OrchestratorProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { router } from '../../../app/routes';

export default function App() {
  return (
    <OrchestratorProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </OrchestratorProvider>
  );
}
