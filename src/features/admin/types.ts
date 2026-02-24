export type AdminDashboardStats = {
  artworksCount: number;
  artistsCount: number;

  inquiriesNewCount: number;
  inquiriesAllCount: number;

  lastInquiryAt: string | null;

  lastArtworks: {
    id: number;
    title: string;
    createdAt: string;
    imageUrl: string | null;
    artistName: string;
  }[];

  lastArtists: {
    id: number;
    name: string;
    createdAt: string;
    avatarUrl: string | null;
  }[];

  latestNewInquiries: {
    id: number;
    name: string;
    createdAt: string;
    regarding: string;
    status: string;
  }[];
};
