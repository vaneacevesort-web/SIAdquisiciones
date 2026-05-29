export interface DatosUser {
  id?: number;
  nombre?: string;
  apaterno?: string;
  amaterno?: string;
  direccion?: string;
  dependencia?: string;
  departamento?: string;
  cargo?: string;
  user_id?: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface UserRole {
  role_id: number;
  user_id: string;
  role?: Role;
}

export interface User {
  id?: string;
  name?: string;
  email: string;
  password: string;
  rol_users?: UserRole;
  datos_user?: DatosUser;
}
