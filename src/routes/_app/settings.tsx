import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui-kit/Card';
import { channelMeta } from '@/lib/mockData';

export function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Workspace, channels, AI persona and integrations.</p>
      </div>

      <section className="glass rounded-3xl p-6">
        <h3 className="font-semibold mb-4">Workspace</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Workspace name" defaultValue="Acme Inc" />
          <Field label="Timezone" defaultValue="Asia/Kolkata (IST)" />
          <Field label="Business hours" defaultValue="9:00 — 19:00" />
          <Field label="Default language" defaultValue="English" />
        </div>
      </section>

      <section className="glass rounded-3xl p-6">
        <h3 className="font-semibold mb-1">Connected channels</h3>
        <p className="text-xs text-muted-foreground mb-4">Manage where OmniFlow listens and replies.</p>
        <div className="space-y-2">
          {Object.entries(channelMeta).map(([key, meta]) => (
            <div key={key} className="flex items-center gap-3 p-3 rounded-xl glass">
              <span className={`w-2.5 h-2.5 rounded-full ${meta.dot}`} />
              <div className="flex-1 font-medium text-sm">{meta.label}</div>
              <Badge tone="success"><Check className="w-3 h-3" /> Connected</Badge>
            </div>
          ))}
        </div>
      </section>

      <section className="glass rounded-3xl p-6">
        <h3 className="font-semibold mb-1">AI persona (Gemini)</h3>
        <p className="text-xs text-muted-foreground mb-4">How your AI introduces itself and responds.</p>
        <textarea
          defaultValue="You are Nova, the friendly AI assistant for Acme Inc. Be concise, warm and proactive. Always offer to book a demo when intent is high. Never invent pricing — defer to the catalog."
          rows={5}
          className="w-full rounded-xl bg-white/5 border border-border p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <div className="mt-3 flex gap-2 flex-wrap text-xs">
          <Badge tone="primary">Tone: Friendly</Badge>
          <Badge>Model: gemini-2.5-pro</Badge>
          <Badge>Fallback: canned</Badge>
        </div>
      </section>

      <section className="glass rounded-3xl p-6">
        <h3 className="font-semibold mb-4">Integrations</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {['HubSpot CRM', 'Google Sheets', 'Salesforce', 'Slack', 'Stripe', 'Calendly'].map((integration) => (
            <div key={integration} className="flex items-center justify-between p-3 rounded-xl glass">
              <span className="text-sm font-medium">{integration}</span>
              <button onClick={() => toast.success(`${integration} connected`)} className="text-xs px-3 py-1.5 rounded-lg grad-primary text-white">
                Connect
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <button onClick={() => toast.success('Settings saved')} className="h-11 px-6 rounded-xl grad-primary text-white font-semibold">
          Save changes
        </button>
      </div>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input
        defaultValue={defaultValue}
        className="mt-1.5 w-full h-10 rounded-xl bg-white/5 border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    </label>
  );
}
