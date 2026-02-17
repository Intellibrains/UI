// API service — single entry point for all backend calls
// Currently uses mock implementations; swap to real apiRequest() calls when FastAPI is ready

export {
  mockLogin as login,
  mockRegister as register,
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
