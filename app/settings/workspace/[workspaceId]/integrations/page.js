import { SettingsIntegrationsScreen } from "@/components/settings-integrations-screen";

export default async function WorkspaceIntegrationsPage({ params }) {
  const { workspaceId } = await params;
  return <SettingsIntegrationsScreen workspaceId={workspaceId} />;
}
