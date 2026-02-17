// Shared API types for IntelliBrain backend integration
// These types mirror expected REST API request/response shapes

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: "free" | "pro" | "enterprise";
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  contextType: "document" | "video" | "test";
  createdAt: string;
  updatedAt: string;
}

export interface ShareLinkResponse {
  shareId: string;
  url: string;
  expiresAt: string;
}

export interface Group {
  id: string;
  name: string;
  memberCount: number;
  createdAt: string;
}

export interface FeedbackRequest {
  message: string;
  category?: string;
}

export interface UpgradePlanRequest {
  plan: "pro" | "enterprise";
}

export interface ApiError {
  message: string;
  code: string;
}
