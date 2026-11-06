import i18n from "@/i18n";
import { ApiError } from "@/lib/api-client";

export function getErrorMessage(
  error: unknown,
  fallbackMessage = "Something went wrong",
): string {
  if (error instanceof ApiError) {
    if (error.code) {
      const key = `errors.${error.code}`;

      if (i18n.exists(key)) {
        return i18n.t(key);
      }
    }

    return fallbackMessage;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}
