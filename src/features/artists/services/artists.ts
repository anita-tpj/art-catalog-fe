import { del, get, getById, patch, post, put } from "@/lib/api-client";
import { PaginatedRequest, PaginatedResult } from "@/types/api";
import {
  Artist,
  ArtistCmsAccess,
  ArtistCmsInvitation,
  CreateArtistCmsInvitationDTO,
  CreateArtistDTO,
  UpdateArtistDTO,
} from "../types";

function buildPaginatedParams({
  page,
  pageSize,
  search,
  primaryCategory,
}: PaginatedRequest) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  if (search && search.trim() !== "") {
    params.set("search", search.trim());
  }

  if (primaryCategory) {
    params.set("primaryCategory", primaryCategory);
  }

  return params;
}

export const artistsService = {
  // Admin
  getAll: () => get<Artist[]>("/api/artists/all"),

  getPaginated: (params: PaginatedRequest) => {
    const query = buildPaginatedParams(params);

    return get<PaginatedResult<Artist>>(`/api/artists?${query.toString()}`);
  },

  getOne: (id: number) => getById<Artist>("/api/artists", id),

  create: (data: CreateArtistDTO) =>
    post<Artist, CreateArtistDTO>("/api/artists", data),

update: (id: number, data: UpdateArtistDTO) =>
  put<Artist, UpdateArtistDTO>("/api/artists", id, data),

  remove: (id: number) => del<void>("/api/artists", id),

  getCmsAccess: (id: number) =>
    get<ArtistCmsAccess>(`/api/artists/${id}/cms-access`),

  createCmsInvitation: (id: number, data: CreateArtistCmsInvitationDTO) =>
    post<
      {
        invitation: ArtistCmsInvitation;
      },
      CreateArtistCmsInvitationDTO
    >(`/api/artists/${id}/cms-invitations`, data),

  revokeCmsInvitation: (artistId: number, invitationId: string) =>
    del<void>(`/api/artists/${artistId}/cms-invitations/${invitationId}`),

  deactivateCmsAccount: (userId: string) =>
    patch<void>(`/api/admin/users/${encodeURIComponent(userId)}/deactivate`),

  activateCmsAccount: (userId: string) =>
    patch<void>(`/api/admin/users/${encodeURIComponent(userId)}/activate`),

  deleteCmsAccount: (userId: string) =>
    del<void>(`/api/admin/users/${encodeURIComponent(userId)}`),

  // Public
  getAllPublished: () => get<Artist[]>("/api/artists/public/all"),

  getPaginatedPublished: (params: PaginatedRequest) => {
    const query = buildPaginatedParams(params);

    return get<PaginatedResult<Artist>>(
      `/api/artists/public?${query.toString()}`,
    );
  },

  getPublishedOne: (id: number) => getById<Artist>("/api/artists/public", id),

  getPublishedBySlug: (slug: string) =>
    get<Artist>(`/api/artists/public/profile/${encodeURIComponent(slug)}`),
};
