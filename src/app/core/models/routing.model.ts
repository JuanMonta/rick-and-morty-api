import { Route } from '@angular/router';

// Definimos estrictamente qué puede ir dentro de "data"
export interface RouteMetadata {
  title?: string;
  browserTitle?: string;
  requiresAuth?: boolean;
  allowedRoles?: string[];
  preload?: boolean
}

// Extendemos el Route de Angular para sobreescribir la propiedad data
export interface AppRoute extends Route {
  data?: RouteMetadata;
  children?: AppRoute[]; // Soporte para rutas hijas recursivas
}

// Un alias para el array de rutas
export type AppRoutes = AppRoute[];
