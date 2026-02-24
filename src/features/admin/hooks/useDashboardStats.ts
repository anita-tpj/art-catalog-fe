import { adminDashboardService } from "@/features/admin/services/adminDashboard";
import { useQuery } from "@tanstack/react-query";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: () => adminDashboardService.getStats(),
  });
}
