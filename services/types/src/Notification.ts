export type VapidSubscription = {
  endpoint: PushSubscription["endpoint"];
  expirationTime: PushSubscription["expirationTime"];
  keys: {
    auth: string;
    p256dh: string;
  };
};

export type NotificationRow = {
  id: string;
  created_at: string;
  updated_at: string;
  creator_id: string;
  owner_id: string;
  identifier: string;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  apns_id?: string;
  error_message?: string;
};

export type Notification = NotificationRow;
