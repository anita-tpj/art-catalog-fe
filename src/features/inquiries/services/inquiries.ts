import { get, getById, post, put } from "@/lib/api-client";
import { PaginatedResult } from "@/types/api";
import {
  CreateInquiryDTO,
  Inquiry,
  InquiryListRequest,
  InquiryStats,
  InquiryStatus,
} from "../types";

export const inquiriesService = {
  getPaginated: ({ page, pageSize, status, search }: InquiryListRequest) => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });

    if (status) params.set("status", status);
    if (search?.trim()) params.set("search", search.trim());

    return get<PaginatedResult<Inquiry>>(`/api/inquiries?${params.toString()}`);
  },

  getOne: (id: number) => getById<Inquiry>("/api/inquiries", id),
  create: (data: CreateInquiryDTO) =>
    post<{ id: number }, CreateInquiryDTO>("/api/inquiries", data),

  update: (id: number, status: InquiryStatus) =>
    put<Inquiry, { status: InquiryStatus }>("/api/inquiries", id, { status }),
  getStats: () => get<InquiryStats>("/api/inquiries/stats"),
};
