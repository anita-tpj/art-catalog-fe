export function isPublicAdminRoute(pathname: string) {
  return (
    pathname === "/admin/login" ||
    pathname === "/admin/invitations/accept"
  );
}