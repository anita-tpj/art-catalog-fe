import { get, getById, post, put } from "@/lib/api-client";
import { PaginatedRequest, PaginatedResult } from "@/types/api";

export type InquiryStatus = "NEW" | "READ" | "ARCHIVED";

export type InquiryStats = {
  allCount: number;
  newCount: number;
  readCount: number;
  archivedCount: number;
};

export type Inquiry = {
  id: number;
  name: string;
  email: string;
  message: string;
  status: InquiryStatus;

  artistId: number | null;
  artworkId: number | null;

  artist?: { id: number; name: string } | null;
  artwork?: { id: number; title: string } | null;

  createdAt: string;
};

export type InquiryListRequest = PaginatedRequest & {
  status?: InquiryStatus;
};

export type CreateInquiryDTO = {
  name: string;
  email: string;
  message: string;
  artistId?: number;
  artworkId?: number;
};

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
