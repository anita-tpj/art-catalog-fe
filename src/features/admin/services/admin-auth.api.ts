import { get, post } from "@/lib/api-client";

export type AdminRole = "ADMIN" | "EDITOR" | "VIEWER";

export type AdminUserDto = {
  id: string;
  email: string;
  role: AdminRole;
  artistId: number | null;
};

export type MeResponse = { user: AdminUserDto };
export type LoginResponse = { user: AdminUserDto };

export function adminMe() {
  return get<MeResponse>("/api/auth/me");
}

export function adminLogin(email: string, password: string) {
  return post<LoginResponse, { email: string; password: string }>(
    "/api/auth/login",
    {
      email,
      password,
    },
  );
}

export function adminLogout() {
  return post<void, {}>("/api/auth/logout", {});
}


export type ForgotPasswordResponse = {
  message: string;
};

export type ResetPasswordResponse = {
  message: string;
};

export function adminForgotPassword(email: string) {
  return post<ForgotPasswordResponse, { email: string }>(
    "/api/auth/forgot-password",
    { email },
  );
}

export function adminResetPassword(token: string, password: string) {
  return post<
    ResetPasswordResponse,
    { token: string; password: string }
  >("/api/auth/reset-password", {
    token,
    password,
  });
}
