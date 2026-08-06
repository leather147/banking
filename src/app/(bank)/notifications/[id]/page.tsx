import { notFound } from "next/navigation";
import { NotificationDetailScreen } from "@/components/notifications/notifications-screen";
import { getNotification } from "@/lib/notifications";

export default async function NotificationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const notification = getNotification(id);
  if (!notification) notFound();
  return <NotificationDetailScreen notification={notification} />;
}
