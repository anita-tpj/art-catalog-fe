import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { adminLogout } from "../services/admin-auth.api";

export function useAdminLogout() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: adminLogout,
    onSuccess: async () => {
      // clear cached admin state
      qc.removeQueries({ queryKey: ["adminMe"] });
      router.replace("/admin/login");
    },
    onError: async () => {
      // even if logout fails, treat as logged out client-side
      qc.removeQueries({ queryKey: ["adminMe"] });
      router.replace("/admin/login");
    },
  });
}