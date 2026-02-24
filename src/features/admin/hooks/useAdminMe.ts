import { useQuery } from "@tanstack/react-query";
import { adminMe } from "../services/admin-auth.api";

export function useAdminMe() {
  return useQuery({
    queryKey: ["adminMe"],
    queryFn: adminMe,
    retry: false,
    staleTime: 60_000,
  });
}