import { apiRequest } from "./client";

// 🔹 REAL Backend Register
export async function register(req: { name: string; email: string; password: string }) {
  return apiRequest("/signup", {
    method: "POST",
    body: JSON.stringify({
      full_name: req.name,
      email: req.email,
      password: req.password,
    }),
  });
}

// 🔹 REAL Backend Login
export async function login(req: { email: string; password: string }) {
  return apiRequest("/signin", {
    method: "POST",
    body: JSON.stringify({
      email: req.email,
      password: req.password,
    }),
  });
}

// 🔹 KEEP ALL OTHER MOCK EXPORTS
export {
  mockLogout as logout,
  mockGetCurrentUser as getCurrentUser,
  mockGetConversations as getConversations,
  mockSaveConversation as saveConversation,
  mockGetMessages as getMessages,
  mockSendMessage as sendMessage,
  mockCreateShareLink as createShareLink,
  mockCreateGroup as createGroup,
  mockGetGroups as getGroups,
  mockSendFeedback as sendFeedback,
  mockInviteFriends as inviteFriends,
  mockUpgradePlan as upgradePlan,
} from "./mock";

export { setAuthToken, getAuthToken } from "./client";
export type * from "./types";