import { Category } from '../reference-state/reference.model';

export interface User {
  userId: number;
  email: string;
  name: string;
  profilePictureUrl: string;
  bio: string;
  interests: Category[];
  images: Image[];
}

export interface Image {
  id: number;
  order: number;
  url: string;
}
