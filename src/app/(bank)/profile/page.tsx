import type { Metadata } from "next";
import { ProfileOverview } from "@/components/profile/profile-overview";

export const metadata: Metadata = { title: "Профиль" };

export default function ProfilePage() {
  return <ProfileOverview />;
}
