import axiosInstance from './axiosInstance';
import { AuthResponse } from '@/types/api';

export const authApi = {
  login: async (credentials: Record<string, string>): Promise<AuthResponse> => {
    console.log('Logging in with:', credentials);
    const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  },

  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  },

  changePassword: async (passwords: Record<string, string>): Promise<void> => {
    await axiosInstance.post('/auth/change-password', passwords);
  },

  getUsers: async (): Promise<unknown[]> => {
    const response = await axiosInstance.get('/auth/users');
    return response.data;
  },

  updateOtherUserPassword: async (userId: string, newPassword: string): Promise<void> => {
    await axiosInstance.patch(`/auth/users/${userId}/password`, { newPassword });
  }
};
