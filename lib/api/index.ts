import { apiClient } from './client';
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  PaginatedResponse,
  Category,
  Tag,
  Comment,
  CreateCommentRequest,
  Media,
} from '../types';

// Auth API
export const authApi = {
  login: (data: LoginRequest) => apiClient.post<AuthResponse>('/auth/login', data),
  register: (data: RegisterRequest) => apiClient.post<AuthResponse>('/auth/register', data),
  logout: () => apiClient.post('/auth/logout'),
  refreshToken: (refreshToken: string) =>
    apiClient.post<AuthResponse>('/auth/refresh', { refresh_token: refreshToken }),
  verifyEmail: (token: string) => apiClient.post('/auth/verify', { token }),
  me: () => apiClient.get<User>('/auth/me'),
};

// Posts API
export const postsApi = {
  list: (params?: { page?: number; size?: number; status?: string }) =>
    apiClient.get<PaginatedResponse<Post>>('/posts', params),
  get: (id: number) => apiClient.get<Post>(`/posts/${id}`),
  getBySlug: (slug: string) => apiClient.get<Post>(`/posts/slug/${slug}`),
  create: (data: CreatePostRequest) => apiClient.post<Post>('/posts', data),
  update: (id: number, data: UpdatePostRequest) => apiClient.put<Post>(`/posts/${id}`, data),
  delete: (id: number) => apiClient.delete<void>(`/posts/${id}`),
};

// Comments API
export const commentsApi = {
  list: (postId: number) => apiClient.get<Comment[]>(`/posts/${postId}/comments`),
  create: (data: CreateCommentRequest) => apiClient.post<Comment>('/comments', data),
  delete: (id: number) => apiClient.delete<void>(`/comments/${id}`),
};

// Categories API
export const categoriesApi = {
  list: () => apiClient.get<Category[]>('/categories'),
  get: (id: number) => apiClient.get<Category>(`/categories/${id}`),
  create: (data: { name: string; description?: string }) =>
    apiClient.post<Category>('/categories', data),
  update: (id: number, data: { name?: string; description?: string }) =>
    apiClient.put<Category>(`/categories/${id}`, data),
  delete: (id: number) => apiClient.delete<void>(`/categories/${id}`),
};

// Tags API
export const tagsApi = {
  list: () => apiClient.get<Tag[]>('/tags'),
  get: (id: number) => apiClient.get<Tag>(`/tags/${id}`),
  create: (data: { name: string }) => apiClient.post<Tag>('/tags', data),
  update: (id: number, data: { name?: string }) => apiClient.put<Tag>(`/tags/${id}`, data),
  delete: (id: number) => apiClient.delete<void>(`/tags/${id}`),
};

// Media API
export const mediaApi = {
  list: (params?: { page?: number; size?: number }) =>
    apiClient.get<PaginatedResponse<Media>>('/media/list', params),
  upload: (file: File, onProgress?: (progress: number) => void) =>
    apiClient.upload<Media>('/media/upload', file, onProgress),
  delete: (id: number) => apiClient.delete<void>(`/media/${id}`),
};
