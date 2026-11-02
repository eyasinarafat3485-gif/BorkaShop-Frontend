import { redirect } from "next/navigation";

export default function DashboardNotificationsRedirect() {
  redirect("/admin?tab=notifications");
}
