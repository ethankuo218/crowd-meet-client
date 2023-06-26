export interface LoginResponse {
  isNewUser: boolean;
  userId: number;
}

export interface FileResponse {
  fileName: string;
}

export interface ProfilePictureResponse {
  userId: number;
  profilePicture: string | null;
}

export interface EventImageResponse {
  eventId: number;
  imageUrl: string;
}
