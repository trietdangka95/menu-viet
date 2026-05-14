import axiosInstance from './axiosInstance';
import { Category, Product } from '@/types/api';

export const menuApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get<Category[]>('/categories');
    return response.data;
  },

  getProducts: async (): Promise<Product[]> => {
    const response = await axiosInstance.get<Product[]>('/products');
    return response.data;
  },

  createProduct: async (productData: Partial<Product>): Promise<Product> => {
    const response = await axiosInstance.post<Product>('/products', productData);
    return response.data;
  },

  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    const response = await axiosInstance.patch<Product>(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/products/${id}`);
  },
  
  createCategory: async (name: string): Promise<Category> => {
    const response = await axiosInstance.post<Category>('/categories', { name });
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/categories/${id}`);
  },
};
