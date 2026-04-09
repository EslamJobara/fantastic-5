export interface User {
  _id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  data: {
    token: string;
    user: User;
  };
}
