/** Standard backend response wrapper */
export interface BackendResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// ──── Auth ────

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  first_name: string;
  last_name?: string;
}

export interface AuthUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
}

export interface ForgotPasswordRequest {
  username: string;
}

export interface ForgotPasswordResponse {
  message: string;
  reset_token?: string;
  expires_at?: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}
