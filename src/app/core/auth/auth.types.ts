export type Role = 'USER' | 'ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface AuthUserResponse {
  user: AuthUser;
}