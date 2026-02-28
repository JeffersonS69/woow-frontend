import api from './api';
import type { User, UpdateProfileRequest } from '../types';

interface UpdateMeApiResponse {
  message: string;
  user: User;
}

interface UsersApiResponse {
  users: User[];
  total: number;
}

export const getMe = (): Promise<User> =>
  api.get<User>('/api/users/me').then((r) => r.data);

export const updateMe = async (data: UpdateProfileRequest): Promise<User> => {
  const r = await api.put<UpdateMeApiResponse>('/api/users/me', data);
  return r.data.user;
};

export const getUsers = async (): Promise<User[]> => {
  const r = await api.get<UsersApiResponse>('/api/users');
  return r.data.users;
};
