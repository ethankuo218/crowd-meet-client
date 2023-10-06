export interface Review {
  reviewId: number;
  rating: number;
  comment: string;
  reviewDate: string;
  eventId: number;
  reviewer: {
    userId: number;
    name: string;
    profilePicture: string;
  };
  revieweeId: number;
  event: {
    eventId: number;
    title: string;
  };
}
