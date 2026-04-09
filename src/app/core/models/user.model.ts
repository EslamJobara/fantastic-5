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
  role?: string;
  fullName: string;
  userName: string;
  age: number;
  phone: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}


export interface RegisterResponse {
  message: string;
  data: {
    role: string;
    fullName: string;
    userName: string;
    age: number;
    phone: string;
    email: string;
    password: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}
