import api from "@/lib/api";

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const registerUser = async (data: RegisterRequest) => {
  const response = await api.post<ApiResponse<AuthResponse>>(
    "/auth/register",
    data
  );

  return response.data.data;
};

export const loginUser = async (data: LoginRequest) => {
  const response = await api.post<ApiResponse<AuthResponse>>(
    "/auth/login",
    data
  );

  return response.data.data;
};