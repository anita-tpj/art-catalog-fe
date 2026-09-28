import { useAdminMe } from "./useAdminMe";

export function useAdminHome() {
  const { data } = useAdminMe();

  const user = data?.user;
  const isArtistUser = user?.role !== "ADMIN" && !!user?.artistId;

  return {
    href: isArtistUser
      ? `/admin/artists/${user.artistId}/edit`
      : "/admin",
    label: isArtistUser ? "My Profile" : "Dashboard",
  };
}