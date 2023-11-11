export interface LoginResponse {
  isNewUser: boolean;
  userId: number;
}

export interface ProfilePictureResponse {
  images: ProfilePictures;
}

export interface ProfilePictures {
  [firebaseUid: string]:
    | {
        userId: number;
        profilePicture: string | null;
      }
    | undefined;
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
  adsWatchedForEventJoining: number; // event join not limit ad watching times
  kickAllowance: number;
  adsWatchedForKickIncrease: number;
  checkParticipantsAllowance: number;
  adsWatchedForCheckParticipants: number;
}

export enum AllowanceType {
  CREATE_EVENT = 'eventsCreationAllowance',
  CREATE_EVENT_AD_WATCH = 'adsWatchedForEventCreation',
  JOIN_EVENT = 'eventsJoiningAllowance',
  JOIN_EVENT_AD_WATCH = 'adsWatchedForEventJoining',
  KICK_PARTICIPANT = 'kickAllowance',
  KICK_PARTICIPANT_AD_WATCH = 'adsWatchedForKickIncrease',
  VIEW_PARTICIPANT = 'checkParticipantsAllowance',
  VIEW_PARTICIPANT_AD_WATCH = 'adsWatchedForCheckParticipants'
}

export interface MegaBoost {
  duration: number;
  boostId: number;
  revenueCatId: string;
}
