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

export enum EventAction {
  APPLY = 'apply',
  LEAVE = 'leave',
  ACCEPT = 'accept',
  DECLINE = 'decline',
  KICK = 'kick'
}
