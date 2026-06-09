import { redirect } from "next/navigation";
import { requireDoctor } from "@/lib/portal-auth";
import { PortalShell } from "@/components/portal/PortalShell";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const doctor = await requireDoctor();
  if (!doctor) {
    redirect("/portal/login");
  }

  return <PortalShell doctorName={doctor.name}>{children}</PortalShell>;
}
