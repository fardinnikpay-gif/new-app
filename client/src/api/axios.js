import axios from "axios";

export const AUTH_EXPIRED_EVENT = "auth:expired";

const REQUEST_TIMEOUT_MS = 15000;

// A 401 on these paths is an expected answer (not logged in / wrong credentials), not an expired session.
const AUTH_PROBE_PATHS = ["/auth/me", "/auth/login"];

if (!import.meta.env.VITE_API_URL) {
  console.warn("VITE_API_URL is not set. Copy .env.example to .env and restart the dev server.");
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: REQUEST_TIMEOUT_MS,
});

function isAuthProbe(url = "") {
  return AUTH_PROBE_PATHS.some((path) => url.endsWith(path));
}

function getMessage(error) {
  const serverMessage = error.response?.data?.message;
  if (typeof serverMessage === "string" && serverMessage) return serverMessage;
  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    return "The request timed out. Please try again.";
  }
  if (!error.response) return "Network error. Check your connection and try again.";
  return "Something went wrong. Please try again.";
}

// toAppError(error) | in: axios error | out: { message, status, canceled }
function toAppError(error) {
  if (axios.isCancel(error)) {
    return { message: "Request canceled.", status: 0, canceled: true };
  }
  return { message: getMessage(error), status: error.response?.status ?? 0, canceled: false };
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const appError = toAppError(error);

    if (appError.status === 401 && !isAuthProbe(error.config?.url)) {
      window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
    }

    return Promise.reject(appError);
  }
);

export default api;