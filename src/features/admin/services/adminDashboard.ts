import { get } from "@/lib/api-client";
import { AdminDashboardStats } from "../types";

export const adminDashboardService = {
  getStats: () => get<AdminDashboardStats>("/api/admin/dashboard"),
};
