export type CreateNotificationSubscriptionRequest = {
  isbn: string;
  libraryId: number;
};

export type NotificationSubscriptionItem = {
  subscriptionId: number;
  isbn: string;
  title: string;
  author: string;
  coverImageUrl: string;
  libraryId: number;
  libraryName: string;
  lastStableAvailability: string;
  lastCheckOutcome: string;
  lastCheckedAt: string | null;
  lastNotifiedAt: string | null;
};

export type NotificationItem = {
  notificationId: number;
  notificationType: string;
  isbn: string;
  bookTitle: string;
  libraryId: number;
  libraryName: string;
  title: string;
  message: string;
  notificationDate: string;
  createdAt: string;
};

export type NotificationCountResponse = {
  count: number;
};

export type NotificationsResponse = {
  hasNext: boolean;
  nextCursor: string | null;
  items: NotificationItem[];
};
