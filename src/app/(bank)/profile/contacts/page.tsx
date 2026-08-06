import { PageHeading } from "@/components/shared/page-heading";
import { ProfileForm } from "@/components/profile/profile-form";
import { ProfileShell } from "@/components/profile/profile-shell";
export default function ContactsPage() { return <><PageHeading title="Контакты" description="Управляйте каналами связи демонстрационной учётной записи." /><ProfileShell><ProfileForm section="contacts" /></ProfileShell></>; }
