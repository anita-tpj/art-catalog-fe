import toast from "react-hot-toast";

export function showErrorToast(
  error: unknown,
  fallbackMessage = "Something went wrong"
) {
  if (error instanceof Error && error.message) {
    toast.error(error.message);
    return;
  }

  if (typeof error === "object" && error !== null) {
    const maybeMessage = (error as { message?: unknown }).message;

    if (typeof maybeMessage === "string") {
      toast.error(maybeMessage);
      return;
    }
  }

  toast.error(fallbackMessage);
}
