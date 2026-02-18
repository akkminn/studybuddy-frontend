// --- Enums ---

export type UserRole = "admin" | "teacher" | "student";
export type DocumentStatus = "pending" | "processing" | "completed" | "failed";
export type DocumentType = "pdf" | "text" | "md";

// --- Auth ---

export interface UserCreate {
    email: string;
    password: string;
    display_name?: string | null;
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface UserResponse {
    uid: string;
    email: string;
    email_verified: boolean;
    display_name?: string | null;
    photo_url?: string | null;
    provider_id: string;
    created_at: string;
    role?: UserRole | null;
}

export interface User {
    uid: string;
    email: string;
    email_verified: boolean;
    display_name?: string | null;
    photo_url?: string | null;
    provider_id: string;
    created_at: string;
    last_sign_in_at?: string | null;
    role?: UserRole | null;
}

export interface LoginTokens {
    access_token: string;
    refresh_token: string;
    id_token?: string;
    expires_in?: number;
    token_type?: string;
}

export interface LoginResponse {
    user: UserResponse;
    tokens: LoginTokens;
}

export interface RefreshTokenRequest {
    refresh_token: string;
}

export interface RefreshTokenResponse {
    id_token: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}

export interface PasswordResetRequest {
    email: string;
}

export interface PasswordResetConfirm {
    oob_code: string;
    new_password: string;
}

export interface SetRoleRequest {
    role: UserRole;
}

export interface MessageResponse {
    message: string;
}

export interface DashboardResponse {
    message: string;
}

// --- Documents ---

export interface DocumentMetadata {
    id: string;
    user_id: string;
    filename: string;
    file_type: DocumentType;
    file_size: number;
    chunks_count: number;
    status: DocumentStatus;
    created_at: string;
    updated_at?: string | null;
    error_message?: string | null;
}

export interface DocumentResponse {
    id: string;
    message: string;
    document: DocumentMetadata;
}

export interface DocumentListResponse {
    documents: DocumentMetadata[];
    total: number;
}

export interface DocumentChunk {
    document_id: string;
    chunk_index: number;
    content: string;
    embedding?: number[] | null;
}

export interface DocumentChunksResponse {
    document_id: string;
    chunks: DocumentChunk[];
    total: number;
}

export interface UploadError {
    filename: string;
    error: string;
}

export interface BatchUploadResponse {
    successful: DocumentResponse[];
    failed: UploadError[];
}

export interface UploadOptions {
    chunk_size?: number;   // default: 500
    chunk_overlap?: number; // default: 50
}

export interface HealthCheckResponse {
    redis_connected: boolean;
    embedding_model_loaded: boolean;
}