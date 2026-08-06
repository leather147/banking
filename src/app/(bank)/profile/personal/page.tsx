import { PageHeading } from "@/components/shared/page-heading";
import { ProfileForm } from "@/components/profile/profile-form";
import { ProfileShell } from "@/components/profile/profile-shell";
export default function PersonalPage() { return <><PageHeading title="Личные данные" description="Изменения сохраняются в cookie текущего браузера." /><ProfileShell><ProfileForm section="personal" /></ProfileShell></>; }
