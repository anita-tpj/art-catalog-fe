import { get, post } from "@/lib/api-client";
import { AdminRole, AdminUserDto } from "./admin-auth.api";

export type AdminInvitationDto = {
  id: string;
  email: string;
  role: AdminRole;
  artistId: number;
  expiresAt: string;
  acceptedAt: string | null;
  artist: {
    name: string;
  };
};

export type AcceptAdminInvitationDto = {
  token: string;
  password: string;
};

export type AcceptAdminInvitationResponse = AdminUserDto;

export type GetAdminInvitationResponse = {
  invitation: AdminInvitationDto;
};

export function getAdminInvitation(token: string) {
  return get<GetAdminInvitationResponse>(
    `/api/admin-invitations/${encodeURIComponent(token)}`,
  );
}

export function acceptAdminInvitation(data: AcceptAdminInvitationDto) {
  return post<AcceptAdminInvitationResponse, AcceptAdminInvitationDto>(
    "/api/admin-invitations/accept",
    data,
  );
}
