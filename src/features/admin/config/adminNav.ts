type AdminNavUser = {
  role: string;
  artistId: number | null;
};

export function getAdminNav(user?: AdminNavUser) {
  if (!user) return [];

  if (user.role === "ADMIN") {
    return [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/artworks", label: "Artworks" },
      { href: "/admin/artists", label: "Artists" },
      { href: "/admin/inquiries", label: "Inbox" },
    ] as const;
  }

  if (user.artistId) {
    return [
      {
        href: `/admin/artists/${user.artistId}/edit`,
        label: "My Profile",
      },
      { href: "/admin/artworks", label: "Artworks" },
      { href: "/admin/inquiries", label: "Inbox" },
    ] as const;
  }

  return [];
}