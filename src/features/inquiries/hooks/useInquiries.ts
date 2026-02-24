import { useQuery } from "@tanstack/react-query";
import { inquiriesService } from "../services/inquiries";
import { InquiryListRequest } from "../types";

const INQUIRIES_QUERY_KEY = "inquiries";

export function usePaginatedInquiries(params: InquiryListRequest) {
  return useQuery({
    queryKey: [INQUIRIES_QUERY_KEY, params],
    queryFn: () => inquiriesService.getPaginated(params),
    placeholderData: (prev) => prev,
  });
}
