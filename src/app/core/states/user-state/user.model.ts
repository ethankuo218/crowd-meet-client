import { Category } from '../reference-state/reference.model';

export interface User {
  userId: number;
  email: string;
  name: string;
  profilePictureUrl: string;
  bio: string;
  interests: Category[];
}

