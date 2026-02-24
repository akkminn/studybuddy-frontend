import type {
    UserCreate,
    UserLogin,
    LoginResponse,
    RefreshTokenResponse,
    PasswordResetRequest,
    PasswordResetConfirm,
    MessageResponse,
    DashboardResponse,
    SetRoleRequest,
    User,
} from "../types/type.ts";
import instance from "./instance";

const AuthService = {
    register: async (payload: UserCreate): Promise<LoginResponse> => {
        const {data} = await instance.post<LoginResponse>("/auth/register", payload);
        // Persist tokens on successful registration
        localStorage.setItem("access_token", data.tokens.access_token);
        localStorage.setItem("refresh_token", data.tokens.refresh_token);
        return data;
    },

    login: async (payload: UserLogin): Promise<LoginResponse> => {
        const {data} = await instance.post<LoginResponse>("/auth/login", payload);
        localStorage.setItem("access_token", data.tokens.access_token);
        localStorage.setItem("refresh_token", data.tokens.refresh_token);
        return data;
    },

    logout: async (): Promise<MessageResponse> => {
        const {data} = await instance.post<MessageResponse>("/auth/logout");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return data;
    },

    refreshToken: async (refresh_token: string): Promise<RefreshTokenResponse> => {
        const {data} = await instance.post<RefreshTokenResponse>("/auth/refresh", {refresh_token});
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        return data;
    },

    requestPasswordReset: async (payload: PasswordResetRequest): Promise<MessageResponse> => {
        const {data} = await instance.post<MessageResponse>("/auth/password-reset", payload);
        return data;
    },

    confirmPasswordReset: async (payload: PasswordResetConfirm): Promise<MessageResponse> => {
        const {data} = await instance.post<MessageResponse>("/auth/password-reset/confirm", payload);
        return data;
    },

    getCurrentUser: async (): Promise<User> => {
        const {data} = await instance.get<User>("/auth/me");
        return data;
    },

    updateUserRole: async (uid: string, payload: SetRoleRequest): Promise<MessageResponse> => {
        const {data} = await instance.put<MessageResponse>(`/auth/users/${uid}/role`, {role_data: payload});
        return data;
    },

    // --- Dashboards ---

    getAdminDashboard: async (): Promise<DashboardResponse> => {
        const {data} = await instance.get<DashboardResponse>("/auth/admin/dashboard");
        return data;
    },

    getTeacherDashboard: async (): Promise<DashboardResponse> => {
        const {data} = await instance.get<DashboardResponse>("/auth/teacher/dashboard");
        return data;
    },

    getStudentDashboard: async (): Promise<DashboardResponse> => {
        const {data} = await instance.get<DashboardResponse>("/auth/student/dashboard");
        return data;
    },
};

export default AuthService;