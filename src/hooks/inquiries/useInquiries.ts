import { useQuery } from "@tanstack/react-query";
import {
  inquiriesService,
  type InquiryListRequest,
} from "@/services/inquiries";

const INQUIRIES_QUERY_KEY = "inquiries";

export function usePaginatedInquiries(params: InquiryListRequest) {
  return useQuery({
    queryKey: [INQUIRIES_QUERY_KEY, params],
    queryFn: () => inquiriesService.getPaginated(params),
    placeholderData: (prev) => prev,
  });
}
