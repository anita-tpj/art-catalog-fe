import { useQuery } from "@tanstack/react-query";
import { inquiriesService } from "@/services/inquiries";

export function useInquiryStats() {
  return useQuery({
    queryKey: ["inquiries-stats"],
    queryFn: () => inquiriesService.getStats(),
    refetchInterval: 15_000,
  });
}
