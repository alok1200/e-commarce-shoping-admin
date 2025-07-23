import axios, { AxiosRequestConfig } from "axios";

// Define base URL using environment variable
const baseURL: string = process.env.REACT_APP_BACKEND_API_BASE_URL || "";

// Function to extract access token from persisted localStorage state
function getAccessToken(): string | null {
  const storage = localStorage.getItem("persist:root");
  if (!storage) return null;

  try {
    const parsed = JSON.parse(storage);
    const currentUser = parsed?.currentUser
      ? JSON.parse(parsed.currentUser)
      : null;
    return currentUser?.accessToken || null;
  } catch (error) {
    console.error("Failed to parse localStorage token:", error);
    return null;
  }
}

// Axios instances
export const req = axios.create({ baseURL });
export const publicreq = axios.create({ baseURL });

// Request interceptor to add Bearer token
req.interceptors.request.use((config: AxiosRequestConfig) => {
  const newToken = getAccessToken();
  if (newToken && config.headers) {
    config.headers.token = `Bearer ${newToken}`;
  }
  return config;
});
