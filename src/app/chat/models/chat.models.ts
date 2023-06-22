export interface ChatMessage {
  messageId?: string;
  senderId: string;
  content: string;
  timestamp: number;
}
