import axios, {type AxiosRequestConfig, type InternalAxiosRequestConfig} from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_PREFIX;

const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
});

// Request interceptor - Add token to requests
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: unknown) => {
        return Promise.reject(error);
    }
);

// Token refresh queue management
let isRefreshing = false;

interface QueueEntry {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}

let failedQueue: QueueEntry[] = [];

const processQueue = (error: unknown, token: string | null = null): void => {
    failedQueue.forEach(prom => (error ? prom.reject(error) : prom.resolve(token!)));
    failedQueue = [];
};

// Extend AxiosRequestConfig to support retry flag
interface RetryableRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
}

// Response interceptor - Handle token refresh
instance.interceptors.response.use(
    (res) => res,
    async (err: {
        response?: { status: number };
        config: InternalAxiosRequestConfig & RetryableRequestConfig;
    }) => {
        const originalRequest = err.config;

        // Handle 401 errors (unauthorized)
        if (
            err.response &&
            err.response.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/auth/login") &&
            !originalRequest.url?.includes("/auth/refresh")
        ) {
            originalRequest._retry = true;

            // If already refreshing, queue this request
            if (isRefreshing) {
                return new Promise<string>(function (resolve, reject) {
                    failedQueue.push({resolve, reject});
                })
                    .then((token) => {
                        originalRequest.headers!.Authorization = "Bearer " + token;
                        return instance(originalRequest);
                    })
                    .catch((e: unknown) => Promise.reject(e));
            }

            isRefreshing = true;
            const refresh = localStorage.getItem("refresh_token");

            if (!refresh) {
                isRefreshing = false;
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";
                return Promise.reject(err);
            }

            try {
                const resp = await axios.post<{ access: string; refresh?: string }>(
                    `${API_BASE_URL}/auth/refresh/`,
                    {refresh}
                );

                const newAccess = resp.data.access;

                // Update tokens
                localStorage.setItem("access_token", newAccess);
                if (resp.data.refresh) {
                    localStorage.setItem("refresh_token", resp.data.refresh);
                }

                // Update default header
                instance.defaults.headers.common.Authorization = "Bearer " + newAccess;

                // Process queued requests
                processQueue(null, newAccess);
                isRefreshing = false;

                // Retry original request with new token
                originalRequest.headers!.Authorization = "Bearer " + newAccess;
                return instance(originalRequest);

            } catch (refreshError: unknown) {
                processQueue(refreshError, null);
                isRefreshing = false;

                // Clear tokens and redirect to login
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(err);
    }
);

export default instance;