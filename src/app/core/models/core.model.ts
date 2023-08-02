export interface LoginResponse {
  isNewUser: boolean;
  userId: number;
}

export interface ProfilePictureResponse {
  images: ProfilePictures;
}

export interface ProfilePictures {
  [firebaseUid: string]: {
    userId: number;
    profilePicture: string | null;
  };
}

export interface EventImageResponse {
  eventId: number;
  imageUrl: string;
}

export interface EventActionResponse {
  id: number;
  eventId: number;
  userId: number;
  registeredAt: string;
  status: string;
}

export interface FcmToken {
  id: number;
  token: string;
  userId: number;
}

export interface UserAllowance {
  eventsCreationAllowance: number;
  adsWatchedForEventCreation: number;
  eventsJoiningAllowance: number;
  kickAllowance: number;
  adsWatchedForKickIncrease: number;
  checkParticipantsAllowance: number;
  adsWatchedForCheckParticipants: number;
}

export enum AllowanceType {
  EVENT_CREATE = 'eventsCreationAllowance',
  EVENT_CREATE_AD_WATCH = 'adsWatchedForEventCreation',
  EVENT_JOIN = 'eventsJoiningAllowance',
  KICK = 'kickAllowance',
  KICK_AD_WATCH = 'adsWatchedForKickIncrease',
  CHECK_PARTICIPANT = 'checkParticipantsAllowance',
  CHECK_PARTICIPANT_AD_WATCH = 'adsWatchedForCheckParticipants'
}
