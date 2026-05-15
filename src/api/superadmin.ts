import axiosInstance from "./axiosInstance";

export interface Store {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  themeColor: string;
  currency: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateStoreData {
  name: string;
  slug: string;
  adminUsername: string;
  adminPassword: string;
  themeColor?: string;
  currency?: string;
}

export const superAdminApi = {
  getStores: async (): Promise<Store[]> => {
    const { data } = await axiosInstance.get("/superadmin/stores");
    return data;
  },
  
  createStore: async (storeData: CreateStoreData): Promise<any> => {
    const { data } = await axiosInstance.post("/superadmin/stores", storeData);
    return data;
  },
  
  updateStore: async (id: string, storeData: Partial<Store>): Promise<Store> => {
    const { data } = await axiosInstance.patch(`/superadmin/stores/${id}`, storeData);
    return data;
  },
  
  deleteStore: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/superadmin/stores/${id}`);
  },
};
