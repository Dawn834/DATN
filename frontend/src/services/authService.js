import { apiClient } from "./apiClient";

export const authService = {
  async login(username, password) {
    const res = await apiClient.post("/auth/login", { username, password });
    return res.data;
  },

  async getCurrentUser() {
    const res = await apiClient.get("/auth/me");
    return res.data;
  },
};
