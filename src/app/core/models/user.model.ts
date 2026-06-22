// Tipado estricto para los Roles Empresariales autorizados
export type UserRole = 'ADMIN' | 'SCIENTIST' | 'GUEST';
export const Role = {
  ADMIN: 'ADMIN',
  SCIENTIST: 'SCIENTIST',
  GUEST: 'GUEST'
} as const;

// Estructura del objeto de usuario que gobernará las sesiones
export interface User {
  id: string | number;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}
