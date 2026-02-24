import { PaginatedRequest } from "@/types/api";

export type InquiryStatus = "NEW" | "READ" | "ARCHIVED";

export type InboxStatus = InquiryStatus | "ALL";

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
