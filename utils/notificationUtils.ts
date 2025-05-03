import { Notification, NotificationSection } from '@/types/alerts';

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function formatFull(date: Date): string {
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${date.getFullYear()} ${formatTime(date)}`;
}

export function groupNotifications(notifications: Notification[]): NotificationSection[] {
  const today: Notification[] = [];
  const earlier: Notification[] = [];
  const now = new Date();

  for (const notif of notifications) {
    const notifDate = new Date(notif.timestamp);
    const formattedTime = isSameDay(notifDate, now)
      ? formatTime(notifDate)
      : formatFull(notifDate);

    const enrichedNotif = {
      ...notif,
      timestamp: formattedTime,
    };

    if (isSameDay(notifDate, now)) {
      today.push(enrichedNotif);
    } else {
      earlier.push(enrichedNotif);
    }
  }

  const sections: NotificationSection[] = [];
  if (today.length > 0) sections.push({ title: 'Today', data: today });
  if (earlier.length > 0) sections.push({ title: 'Earlier', data: earlier });

  return sections;
}
