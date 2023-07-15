import { Category } from '../reference-state/reference.model';

export interface User {
  userId: number;
  email: string;
  name: string;
  profilePictureUrl: string;
  bio: string;
  interests: Category[];
  images: Image[];
  birthDate: string;
  gender: string;
}

export interface Image {
  id: number;
  order: number;
  url: string;
}

export interface UserEvent {
  eventId: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  imageUrl: string;
  creatorId: number;
}
