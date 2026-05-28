import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  BellRing,
  ChevronRight,
  Clock3,
  CreditCard,
  Database,
  FolderKanban,
  Globe,
  Lock,
  MessagesSquare,
  PlugZap,
  ShieldCheck,
  Sparkles,
  Webhook,
} from "lucide-react";
import { HomeSidebar } from "@/components/home-sidebar";

const connectedIntegrations = [
  {
    name: "Slack",
    category: "Communication",
    description: "Push renders, approvals, and team updates into shared channels in real time.",
    detail: "2 channels linked",
    action: "Manage",
    logo: "S",
    icon: MessagesSquare,
    tone: "is-blue",
  },
  {
    name: "Google Drive",
    category: "Storage",
    description: "Sync exports and media handoff folders so every deliverable lands in the right place.",
    detail: "12 synced folders",
    action: "Review sync",
    logo: "G",
    icon: FolderKanban,
    tone: "is-green",
  },
  {
    name: "Stripe",
    category: "Billing",
    description: "Keep workspace billing, invoice history, and premium usage tied to one source of truth.",
    detail: "Healthy billing sync",
    action: "Open billing",
    logo: "S",
    icon: CreditCard,
    tone: "is-violet",
  },
];

const discoverIntegrations = [
  {
    name: "Zapier",
    category: "Automation",
    description: "Connect Videoo workflows to thousands of downstream tools without custom code.",
    logo: "Z",
    icon: PlugZap,
    tone: "is-amber",
  },
  {
    name: "Notion",
    category: "Docs",
    description: "Turn approved videos into documented launch assets and campaign updates automatically.",
    logo: "N",
    icon: Database,
    tone: "is-neutral",
  },
  {
    name: "Webhooks",
    category: "Developers",
    description: "Trigger internal systems when exports finish, approvals land, or automations complete.",
    logo: "W",
    icon: Webhook,
    tone: "is-pink",
  },
  {
    name: "Meta Ads",
    category: "Distribution",
    description: "Send launch-ready variants into campaign pipelines faster with fewer manual handoffs.",
    logo: "M",
    icon: Globe,
    tone: "is-blue",
  },
];

const activityItems = [
  { label: "Last sync", value: "2 min ago", icon: Clock3 },
  { label: "Security", value: "Enterprise ready", icon: ShieldCheck },
  { label: "Alerts", value: "0 critical issues", icon: BellRing },
];

export function SettingsIntegrationsScreen({ workspaceId }) {
  return (
    <div className="home-shell">
      <HomeSidebar activePath="/settings" />

      <main className="si-main">
        <div className="si-main-inner">
          <header className="si-hero">
            <div className="si-hero-copy">
              <div className="si-eyebrow">
                <ShieldCheck />
                <span>Workspace Settings</span>
              </div>
              <h1 className="si-title">Integrations</h1>
              <p className="si-subtitle">
                Connect the tools your team already uses and keep publishing, approvals, billing, and delivery in sync.
              </p>
            </div>

            <div className="si-hero-actions">
              <button type="button" className="si-secondary-button">Audit log</button>
              <button type="button" className="si-primary-button">
                <Sparkles />
                <span>Request integration</span>
              </button>
            </div>
          </header>

          <section className="si-overview-grid">
            <article className="si-overview-card si-overview-card--feature">
              <div className="si-overview-header">
                <div className="si-overview-icon">
                  <PlugZap />
                </div>
                <span className="si-overview-badge">Premium setup</span>
              </div>
              <div className="si-overview-metric">18</div>
              <div className="si-overview-label">Available integrations</div>
              <p className="si-overview-copy">
                A clean mix of communication, storage, automation, and delivery tools ready for production workflows.
              </p>
            </article>

            <article className="si-overview-card">
              <div className="si-overview-metric">3</div>
              <div className="si-overview-label">Connected</div>
              <p className="si-overview-copy">Slack, Google Drive, and Stripe are already active in this workspace.</p>
            </article>

            <article className="si-overview-card">
              <div className="si-overview-metric">99.98%</div>
              <div className="si-overview-label">Sync health</div>
              <p className="si-overview-copy">No blocked automations, no failed deliveries, and no billing issues detected.</p>
            </article>
          </section>

          <div className="si-layout">
            <aside className="si-sidebar">
              <section className="si-side-card">
                <div className="si-side-title">Workspace</div>
                <div className="si-workspace-id">{workspaceId}</div>
                <p className="si-side-copy">
                  Manage the integrations, credentials, and delivery pathways attached to this workspace.
                </p>
              </section>

              <section className="si-side-card">
                <div className="si-side-title">Status at a glance</div>
                <div className="si-activity-list">
                  {activityItems.map((item) => (
                    <div key={item.label} className="si-activity-item">
                      <span className="si-activity-icon">
                        <item.icon />
                      </span>
                      <div>
                        <div className="si-activity-label">{item.label}</div>
                        <div className="si-activity-value">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="si-side-card">
                <div className="si-side-title">Security</div>
                <p className="si-side-copy">
                  OAuth tokens are encrypted at rest, access is scoped by workspace, and connection history is tracked.
                </p>
                <div className="si-security-pill">
                  <Lock />
                  <span>Protected credentials</span>
                </div>
              </section>
            </aside>

            <section className="si-content">
              <div className="si-section">
                <div className="si-section-header">
                  <div>
                    <h2>Connected integrations</h2>
                    <p>Production-ready tools already powering this workspace.</p>
                  </div>
                  <Link href="/tools" className="si-inline-link">
                    <span>Explore tools</span>
                    <ChevronRight />
                  </Link>
                </div>

                <div className="si-card-grid">
                  {connectedIntegrations.map((item) => (
                    <article key={item.name} className={`si-integration-card ${item.tone}`}>
                      <div className="si-integration-top">
                        <div className="si-integration-brand">
                          <span className="si-integration-logo">{item.logo}</span>
                          <div>
                            <div className="si-integration-name">{item.name}</div>
                            <div className="si-integration-category">{item.category}</div>
                          </div>
                        </div>
                        <span className="si-status-pill">
                          <BadgeCheck />
                          <span>Connected</span>
                        </span>
                      </div>

                      <p className="si-integration-description">{item.description}</p>

                      <div className="si-integration-footer">
                        <div className="si-integration-detail">{item.detail}</div>
                        <button type="button" className="si-card-button">
                          <item.icon />
                          <span>{item.action}</span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="si-section">
                <div className="si-section-header">
                  <div>
                    <h2>Discover more</h2>
                    <p>Expand your workflow with standard integrations your team will recognize immediately.</p>
                  </div>
                </div>

                <div className="si-card-grid si-card-grid--discover">
                  {discoverIntegrations.map((item) => (
                    <article key={item.name} className={`si-integration-card ${item.tone}`}>
                      <div className="si-integration-top">
                        <div className="si-integration-brand">
                          <span className="si-integration-logo">{item.logo}</span>
                          <div>
                            <div className="si-integration-name">{item.name}</div>
                            <div className="si-integration-category">{item.category}</div>
                          </div>
                        </div>
                      </div>

                      <p className="si-integration-description">{item.description}</p>

                      <div className="si-integration-footer">
                        <div className="si-integration-detail">Ready to connect</div>
                        <button type="button" className="si-card-button si-card-button--ghost">
                          <span>Connect</span>
                          <ArrowUpRight />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
