import { PaginatedResult } from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inquiriesService } from "../services/inquiries";
import { Inquiry, InquiryListRequest } from "../types";

const INQUIRIES_QUERY_KEY = "inquiries";

export function usePaginatedInquiries(params: InquiryListRequest) {
  return useQuery({
    queryKey: [INQUIRIES_QUERY_KEY, params],
    queryFn: () => inquiriesService.getPaginated(params),
    placeholderData: (prev) => prev,
  });
}

export function useDeleteInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => inquiriesService.remove(id),

    onSuccess: async (_, deletedId) => {
      queryClient.setQueriesData<PaginatedResult<Inquiry>>(
        { queryKey: [INQUIRIES_QUERY_KEY] },
        (oldData) => {
          if (!oldData) return oldData;

          const items = oldData.items.filter(
            (inquiry) => inquiry.id !== deletedId,
          );

          if (items.length === oldData.items.length) {
            return oldData;
          }

          return {
            ...oldData,
            items,
            meta: {
              ...oldData.meta,
              total: Math.max(0, oldData.meta.total - 1),
            },
          };
        },
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [INQUIRIES_QUERY_KEY],
        }),
        queryClient.invalidateQueries({
          queryKey: ["inquiries-stats"],
        }),
      ]);
    },
  });
}
