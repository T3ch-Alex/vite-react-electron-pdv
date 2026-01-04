import { api } from "./api";

export const ProductService = {
  getAll: async () => {
    const { data } = await api.get("/products");
    return data;
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  create: async (payload: any) => {
    const { data } = await api.post("/products", payload);
    return data;
  },

  update: async (id: number, payload: any) => {
    const { data } = await api.patch(`/products/${id}`, payload);
    return data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },
};
