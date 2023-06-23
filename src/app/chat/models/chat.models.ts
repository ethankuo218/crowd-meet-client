// the chat data sturcture is like below:
// chats (collection)
// |--- chat1 (document)
// |    |--- chatId: "chat1"
// |    |--- type: "private"
// |    |--- members: ["user1FirebaseUid", "user2FirebaseUid"]
// |    |--- readInfos: {
// |           |--- user1FirebaseUid: {
// |               |--- readTimestamp: 1664430182024
// |           },
// |           |--- user2FirebaseUid: {
// |               |--- readTimestamp: 1664430182024
// |           }
// |       }
// |    |--- latestMessage: {
// |        |--- messageId: "message1"
// |        |--- senderId: "user1FirebaseUid"
// |        |--- content: "Hello"
// |        |--- timestamp: 1664430182024
// |    }
// |    |--- messages (sub-collection)
// |        |--- message1 (document)
// |            |--- messageId: "message1"
// |            |--- senderId: "user1FirebaseUid"
// |            |--- content: "Hello"
// |            |--- timestamp: 1664430182024

export interface ChatMessage {
  messageId?: string;
  senderId: string;
  content: string;
  timestamp: number;
}

interface UserReadInfo {
  readTimestamp: number;
}

export type ReadInfo = { [userId: string]: UserReadInfo };
