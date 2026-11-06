import { getErrorMessage } from "@/lib/getErrorMessage";
import toast from "react-hot-toast";

export function showErrorToast(
  error: unknown,
  fallbackMessage = "Something went wrong",
) {
  toast.error(getErrorMessage(error, fallbackMessage));
}
