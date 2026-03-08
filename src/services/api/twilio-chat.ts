import { Client, Conversation } from "@twilio/conversations";

let client: Client | null = null;

export async function initializeTwilio(token: string) {
  client = await Client.create(token);
  console.log("Twilio client initialized");
  return client;
}

export async function joinOrCreateConversation(roomCode: string): Promise<Conversation> {
  if (!client) {
    throw new Error("Twilio client not initialized");
  }

  try {
    const conversation = await client.getConversationByUniqueName(roomCode);

    try {
      await conversation.join();
    } catch {}

    console.log("Joined existing conversation:", roomCode);
    return conversation;

  } catch {

    const conversation = await client.createConversation({
      uniqueName: roomCode,
      friendlyName: roomCode
    });

    await conversation.join();

    console.log("Created new conversation:", roomCode);
    return conversation;
  }
}

export async function sendMessage(conversation: Conversation, message: string) {
  if (!conversation) {
    console.log("No conversation available");
    return;
  }

  await conversation.sendMessage(message);
  console.log("Message sent:", message);
}