import { ShareShell } from "@/components/layout/ShareShell";
import { requireShareAccess } from "@/lib/shares/access";

export default async function ShareLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const share = await requireShareAccess(token);

  return (
    <ShareShell
      token={token}
      viewerName={share.viewer_name}
      companies={share.companies}
    >
      {children}
    </ShareShell>
  );
}
