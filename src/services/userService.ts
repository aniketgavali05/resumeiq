import api from '@/lib/api';

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profileImage: string | null;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
}

export interface UserSettingsResponse {
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  theme: 'light' | 'dark';
}

export interface UpdateSettingsRequest {
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  theme: 'light' | 'dark';
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function getCurrentUser(): Promise<UserResponse> {
  const response =
    await api.get<ApiResponse<UserResponse>>(
      '/users/me'
    );

  return response.data.data;
}

export async function updateCurrentUser(
  data: UpdateProfileRequest
): Promise<UserResponse> {

  const response =
    await api.put<ApiResponse<UserResponse>>(
      '/users/me',
      data
    );

  return response.data.data;
}

export async function uploadProfileImage(
  file: File
): Promise<UserResponse> {

  const formData = new FormData();

  formData.append('file', file);

  const response =
    await api.post<ApiResponse<UserResponse>>(
      '/users/me/profile-image',
      formData
    );

  return response.data.data;
}

export async function removeProfileImage(): Promise<void> {

  await api.delete(
    '/users/me/profile-image'
  );
}

export async function getUserSettings(): Promise<UserSettingsResponse> {

  const response =
    await api.get<ApiResponse<UserSettingsResponse>>(
      '/users/settings'
    );

  return response.data.data;
}

export async function updateUserSettings(
  data: UpdateSettingsRequest
): Promise<UserSettingsResponse> {

  const response =
    await api.put<ApiResponse<UserSettingsResponse>>(
      '/users/settings',
      data
    );

  return response.data.data;
}

export async function changePassword(
  data: ChangePasswordRequest
): Promise<void> {

  await api.put(
    '/users/password',
    data
  );
}