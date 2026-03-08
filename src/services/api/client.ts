// Base API client — connected to FastAPI backend

// 👉 FastAPI backend URL
const BASE_URL = "";

let authToken: string | null = localStorage.getItem("auth_token");

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem("auth_token", token);
  } else {
    localStorage.removeItem("auth_token");
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

/* ===============================
    Chat API functions
================================ */

// 1. Updated: Send both username AND roomName to the backend
export async function createRoom(username: string, roomName: string) {
  return apiRequest<{ room_code: string; room_name: string }>("/chat/create-room", {
    method: "POST",
    body: JSON.stringify({ 
      username, 
      room_name: roomName // Added this line
    }),
  });
}

// 2. Updated: Request room_name in the return type so TypeScript is happy
export async function joinRoom(roomCode: string, username: string) {
  return apiRequest<{ room_code: string; room_name: string }>("/chat/join-room", {
    method: "POST",
    body: JSON.stringify({
      room_code: roomCode,
      username: username 
    })
  });
}

// 3. This remains the same
export async function getTwilioToken(username: string) {
  return apiRequest<{ token: string }>(`/chat/twilio-token/${username}`, {
    method: "GET",
  });
}