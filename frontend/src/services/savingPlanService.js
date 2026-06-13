import { apiClient } from "./apiClient";

export const savingPlanService = {
  async getPlans() {
    const res = await apiClient.get("/saving-plan");
    return res.data;
  },

  async getPlanById(id) {
    const res = await apiClient.get(`/saving-plan/${id}`);
    return res.data;
  },

  async createPlan(planData) {
    const res = await apiClient.post("/saving-plan", planData);
    return res.data;
  },

  async optimizePlan(planData) {
    const res = await apiClient.post("/saving-plan/optimize", planData);
    return res.data;
  },

  async planByTerm(planData) {
    const res = await apiClient.post("/saving-plan/plan-by-term", planData);
    return res.data;
  },

  async updatePlan(id, planData) {
    const res = await apiClient.put(`/saving-plan/${id}`, planData);
    return res.data;
  },

  async deletePlan(id) {
    const res = await apiClient.delete(`/saving-plan/${id}`);
    return res.data;
  },
};
