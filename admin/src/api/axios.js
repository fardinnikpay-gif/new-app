import axios from "axios";

export const AUTH_EXPIRED_EVENT = "auth:expired";

// 401 on these paths is expected (wrong password / not signed in yet).
const AUTH_ENTRY_PATHS = ["/auth/login", "/auth/me"];
const NETWORK_ERROR_MESSAGE = "Cannot reach the server. Check your connection and try again.";
const UNKNOWN_ERROR_MESSAGE = "Something went wrong. Please try again.";

if (import.meta.env.DEV && !import.meta.env.VITE_API_URL) {
  console.error("VITE_API_URL is not set. Copy .env.example to .env and restart the dev server.");
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Normalizes every failure into an Error with { message, status }.
const toApiError = (error) => {
  const { response } = error;
  const fallback = error.request ? NETWORK_ERROR_MESSAGE : UNKNOWN_ERROR_MESSAGE;
  const apiError = new Error(response?.data?.message || fallback);
  apiError.status = response?.status ?? 0;
  return apiError;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aborted requests are not failures; useAsync ignores them.
    if (axios.isCancel(error)) return Promise.reject(error);

    const apiError = toApiError(error);
    const url = error.config?.url ?? "";

    if (apiError.status === 401 && !AUTH_ENTRY_PATHS.includes(url)) {
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    return Promise.reject(apiError);
  }
);

export default api;