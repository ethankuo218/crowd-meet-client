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
  APPLY = 'applied',
  LEAVE = 'left',
  ACCEPT = 'accepted',
  DECLINE = 'declined',
  KICK = 'kicked'
}
