// eventService.js - chỉ sửa phần getAll
import apiClient from "./apiClient";

const eventService = {
  getAll: ({ page = 1, pageSize = 10, search = "", status = "" } = {}) =>
    apiClient.get(
      `/events?page=${page}&pageSize=${pageSize}&search=${search}&status=${status}`
    ).then(res => ({
      items:      res.items      ?? [],
      total:      res.total      ?? 0,
      totalPages: res.totalPages ?? 1,
      page:       res.page       ?? 1,
    })),

  getById: (id) => apiClient.get(`/events/${id}`),

  create: (data) => apiClient.post("/events", data),

  update: (id, data) => apiClient.put(`/events/${id}`, data),

  delete: (id) => apiClient.delete(`/events/${id}`),

  getBooths: (id) => apiClient.get(`/events/${id}/booths`),
};

export default eventService;