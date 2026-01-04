import { api } from "./api";

export const CartService = {
  create: async () => {
    const { data } = await api.post("/carts");
    return data;
  },

  getAll: async () => {
    const res = await api.get("/carts");
    return res.data;
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/carts/${id}`);
    return data;
  },

  addItem: async (
    cartId: number,
    payload: { productId: number; quantity: number }
  ) => {
    const { data } = await api.post(`/carts/${cartId}/items`, payload);
    return data;
  },

  removeItem: async (cartId: number, itemId: number) => {
    const { data } = await api.delete(`/carts/${cartId}/items/${itemId}`);
    return data;
  },

  checkout: async (cartId: number) => {
    const { data } = await api.post(`/carts/${cartId}/checkout`);
    return data;
  },
};
