import { PageHeading } from "@/components/shared/page-heading";
import { ProfileForm } from "@/components/profile/profile-form";
import { ProfileShell } from "@/components/profile/profile-shell";
export default function DocumentsPage() { return <><PageHeading title="Документы" description="Не используйте настоящие документы — это локальная демонстрация." /><ProfileShell><ProfileForm section="documents" /></ProfileShell></>; }
