export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  isVerified?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name?: string;
}
