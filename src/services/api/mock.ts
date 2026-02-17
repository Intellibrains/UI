// Mock API implementations — returns fake data with simulated latency
// Replace with real apiRequest() calls when FastAPI backend is ready

import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Conversation,
  ChatMessage,
  ShareLinkResponse,
  Group,
  User,
} from "./types";

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

// ---------- Auth ----------

let currentUser: User | null = null;

export async function mockLogin(req: LoginRequest): Promise<AuthResponse> {
  await delay(600);
  const user: User = {
    id: "usr_" + Date.now(),
    name: req.email.split("@")[0],
    email: req.email,
    plan: "free",
  };
  currentUser = user;
  return { user, token: "mock_token_" + Date.now() };
}

export async function mockRegister(req: RegisterRequest): Promise<AuthResponse> {
  await delay(800);
  const user: User = {
    id: "usr_" + Date.now(),
    name: req.name,
    email: req.email,
    plan: "free",
  };
  currentUser = user;
  return { user, token: "mock_token_" + Date.now() };
}

export function mockGetCurrentUser(): User | null {
  return currentUser;
}

export function mockLogout() {
  currentUser = null;
}

// ---------- Conversations ----------

const storedConversations: Conversation[] = [];

export async function mockGetConversations(
  contextType: "document" | "video" | "test"
): Promise<Conversation[]> {
  await delay(300);
  return storedConversations.filter((c) => c.contextType === contextType);
}

export async function mockSaveConversation(
  conv: Omit<Conversation, "id" | "createdAt" | "updatedAt">
): Promise<Conversation> {
  await delay(400);
  const newConv: Conversation = {
    ...conv,
    id: "conv_" + Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  storedConversations.push(newConv);
  return newConv;
}

// ---------- Chat Messages ----------

const storedMessages: ChatMessage[] = [];

export async function mockGetMessages(conversationId: string): Promise<ChatMessage[]> {
  await delay(300);
  return storedMessages.filter((m) => m.conversationId === conversationId);
}

export async function mockSendMessage(
  conversationId: string,
  content: string,
  role: "user" | "assistant"
): Promise<ChatMessage> {
  await delay(200);
  const msg: ChatMessage = {
    id: "msg_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
    conversationId,
    content,
    role,
    timestamp: new Date().toISOString(),
  };
  storedMessages.push(msg);
  return msg;
}

// ---------- Share ----------

export async function mockCreateShareLink(
  conversationId: string
): Promise<ShareLinkResponse> {
  await delay(400);
  const shareId = "share_" + Math.random().toString(36).slice(2, 10);
  return {
    shareId,
    url: `${window.location.origin}/shared/${shareId}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

// ---------- Groups ----------

const storedGroups: Group[] = [];

export async function mockCreateGroup(name: string): Promise<Group> {
  await delay(500);
  const group: Group = {
    id: "grp_" + Date.now(),
    name,
    memberCount: 1,
    createdAt: new Date().toISOString(),
  };
  storedGroups.push(group);
  return group;
}

export async function mockGetGroups(): Promise<Group[]> {
  await delay(300);
  return [...storedGroups];
}

// ---------- Feedback ----------

export async function mockSendFeedback(message: string): Promise<{ success: boolean }> {
  await delay(600);
  console.log("[Mock API] Feedback received:", message);
  return { success: true };
}

// ---------- Invite ----------

export async function mockInviteFriends(emails: string[]): Promise<{ sent: number }> {
  await delay(500);
  console.log("[Mock API] Invites sent to:", emails);
  return { sent: emails.length };
}

// ---------- Plan Upgrade ----------

export async function mockUpgradePlan(
  plan: "pro" | "enterprise"
): Promise<{ success: boolean; plan: string }> {
  await delay(800);
  if (currentUser) {
    currentUser.plan = plan;
  }
  return { success: true, plan };
}
