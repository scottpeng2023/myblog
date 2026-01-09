// User Types
export type UserRole = 'user' | 'author' | 'admin';

export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

// Post Types
export type PostStatus = 'draft' | 'published';

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: PostStatus;
  author_id: number;
  author?: User;
  categories?: Category[];
  tags?: Tag[];
  created_at: string;
  updated_at: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  status: PostStatus;
  category_ids?: number[];
  tag_ids?: number[];
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id: number;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

// Tag Types
export interface Tag {
  id: number;
  name: string;
  slug: string;
}

// Comment Types
export interface Comment {
  id: number;
  post_id: number;
  user_id?: number;
  user?: User;
  content: string;
  parent_id?: number;
  replies?: Comment[];
  created_at: string;
}

export interface CreateCommentRequest {
  post_id: number;
  content: string;
  parent_id?: number;
}

// Media Types
export interface Media {
  id: number;
  filename: string;
  filepath: string;
  mimetype: string;
  size: number;
  user_id: number;
  created_at: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface ApiError {
  detail: string;
  code?: string;
}
