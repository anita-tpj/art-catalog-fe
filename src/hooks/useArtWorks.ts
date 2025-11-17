"use client";

import { useQuery } from "@tanstack/react-query";

export function useArtworks() {
  return useQuery({
    queryKey: ["artworks"],
    queryFn: async () => {
      // TODO: ovde će kasnije ići pravi backend URL
      const res = await fetch("http://localhost:3000/api/artworks");
      if (!res.ok) throw new Error("Failed to fetch artworks");
      return res.json();
    },
  });
}
