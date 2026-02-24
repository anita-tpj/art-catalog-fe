import { get, post } from "@/lib/api-client";

export type AdminRole = "ADMIN" | "EDITOR" | "VIEWER";

export type AdminUserDto = {
  id: string;
  email: string;
  role: AdminRole;
};

export type MeResponse = { user: AdminUserDto };
export type LoginResponse = { user: AdminUserDto };

export function adminMe() {
  return get<MeResponse>("/api/auth/me");
}

export function adminLogin(email: string, password: string) {
  return post<LoginResponse, { email: string; password: string }>("/api/auth/login", {
    email,
    password,
  });
}

export function adminLogout() {
  return post<void, {}>("/api/auth/logout", {});
}