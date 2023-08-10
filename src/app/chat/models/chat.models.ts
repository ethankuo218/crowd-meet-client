// the chat data sturcture is like below:
// chats (collection)
// |--- chat1 (document)
// |    |--- chatId: "chat1"
// |    |--- type: "private"
// |    |--- members: ["user1FirebaseUid", "user2FirebaseUid"]
// |    |--- memberNames: ["user1Name", "user2Name"] // if room type is private
// |    |--- eventInfo: { // if room type is event
// |           |--- eventTitle: "eventTitle"
// |           |--- eventPicture: "eventPictureUrl"
// |           }
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

export interface Chat {
  members: string[];
  createdAt: number;
  memberInfos: { [firebaseUid: string]: MemberInfo };
  latestMessage: {
    timestamp: number;
    senderId?: string;
    content?: string;
  };
  eventInfo?: { eventId: number; eventTitle: string };
  type: string; // event / private
  readInfos: {
    [memberId: string]: {
      readTimestamp: number;
    };
  };
  chatId: string;
}

export interface MemberInfo {
  serverUid: number;
  name: string;
}

export interface SendMessageDto {
  chatId: string;
  senderId: string;
  content: string;
  sentTimeStamp: number;
}
