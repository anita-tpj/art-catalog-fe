import { post } from "@/lib/api-client";

export type CreateContactMessageDTO = {
  name: string;
  email: string;
  message: string;
};

export const contactService = {
  create: (data: CreateContactMessageDTO) =>
    post<{ message: string }, CreateContactMessageDTO>("/api/contact", data),
};
