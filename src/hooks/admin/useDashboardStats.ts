import { useQuery } from "@tanstack/react-query";
import { adminDashboardService } from "@/services/adminDashboard";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: () => adminDashboardService.getStats(),
  });
}
