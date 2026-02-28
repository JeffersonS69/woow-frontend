import api from './api';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types';

export const login = (data: LoginRequest): Promise<AuthResponse> =>
  api.post<AuthResponse>('/api/auth/login', data).then((r) => r.data);

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  await api.post('/api/auth/register', data); // returns { message, user } — no token
  return login({ email: data.email, password: data.password });
};
