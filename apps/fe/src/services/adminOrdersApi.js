import axiosClient from "./axiosClient";

export const adminOrdersApi = {
  /**
   * params: { q, status, from, to, page, limit }
   */
  async getOrders(params = {}) {
    return axiosClient.get("/admin/orders", { params });
  },

  async getOrderDetail(id) {
    return axiosClient.get(`/admin/orders/${id}`);
  },
};
