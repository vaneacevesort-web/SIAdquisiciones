export interface Role {
    id: number;
    name: string;
  }
  
  export interface UserRole {
    role_id: number;
    user_id: number;
    role?: Role;
  }
  
  export interface User {
    id?: number;
    email: string;
    password: string;
    rol_users?: UserRole;
  }
  