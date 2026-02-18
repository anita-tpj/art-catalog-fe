import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inquiriesService, type InquiryStatus } from "@/services/inquiries";

const INQUIRIES_QUERY_KEY = "inquiries";

export function useUpdateInquiryStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: InquiryStatus }) =>
      inquiriesService.update(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [INQUIRIES_QUERY_KEY] });
    },
  });
}
