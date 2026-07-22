import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (user) redirect("/");

  return <>{children}</>;
}
