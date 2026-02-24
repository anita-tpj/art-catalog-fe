import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inquiriesService } from "../services/inquiries";
import { InquiryStatus } from "../types";

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
