import { Category } from 'src/app/core/states/reference-state/reference.model';
import { User } from 'src/app/core/states/user-state/user.model';

export interface EventSetting {
  title: string;
  description: string;
  startTime: string; // dateTime 2023-05-29T17:27:39.299Z
  endTime: string; // dateTime 2023-05-29T17:27:39.299Z
  maxParticipants: number;
  locationName: string;
  price: number;
  categories: Category[];
}

export interface Event {
  imageUrl: string;
  videoUrl: string;
  title: string;
  description: string;
  startTime: string; // 2023-06-02T14:46:08.312Z
  endTime: string; // 2023-06-02T14:46:08.313Z
  maxParticipants: number;
  locationName: string;
  price: number;
  categories: Category[];
  creator: User;
  eventId: number;
  lat: number;
  lng: number;
  formattedAddress: string;
  placeId: string;
  participants: Participant[];
  isOnline: boolean;
}

interface Participant {
  userId: number;
  registeredAt: string;
  status: string;
  leftAt: string;
}
