import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Filter, Search, X, Phone, Mail, Building2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Badge, GlassCard } from '@/components/ui-kit/Card';
import { channelMeta, leads as seed, type Lead } from '@/lib/mockData';

export function LeadsPage() {
  const [q, setQ] = useState('');
  const [priority, setPriority] = useState<string>('all');
  const [active, setActive] = useState<Lead | null>(null);

  const filtered = useMemo(
    () =>
      seed.filter(
        (lead) =>
          (priority === 'all' || lead.priority === priority) &&
          (q === '' || lead.name.toLowerCase().includes(q.toLowerCase()) || lead.company.toLowerCase().includes(q.toLowerCase())),
      ),
    [priority, q],
  );

  const exportCSV = () => {
    const csv = [
      ['Name', 'Company', 'Email', 'Phone', 'Channel', 'Priority', 'Status', 'Value', 'AI Score'].join(','),
      ...filtered.map((lead) =>
        [lead.name, lead.company, lead.email, lead.phone, lead.channel, lead.priority, lead.status, lead.value.toString(), lead.aiScore.toString()].join(','),
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'leads.csv';
    link.click();
    URL.revokeObjectURL(url);

    toast.success('Exported leads.csv');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-sm text-muted-foreground mt-1">Auto-captured from every conversation · {filtered.length} of {seed.length}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => toast('Google Sheets sync queued')} className="h-10 px-4 rounded-xl glass hover:bg-white/10 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" /> Sync to Sheets
          </button>
          <button onClick={exportCSV} className="h-10 px-4 rounded-xl grad-primary text-white text-sm font-semibold flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <GlassCard className="p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Search by name or company…"
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/5 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
          <div className="flex gap-1.5">
            {['all', 'hot', 'warm', 'cold'].map((option) => (
              <button
                key={option}
                onClick={() => setPriority(option)}
                className={`px-3 h-10 rounded-xl text-xs font-medium capitalize transition ${
                  priority === option ? 'grad-primary text-white' : 'glass hover:bg-white/10'
                }`}
              >
                {option === 'all' ? <><Filter className="w-3.5 h-3.5 inline mr-1" /> All</> : option}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-3">Lead</th>
                <th className="text-left px-5 py-3">Channel</th>
                <th className="text-left px-5 py-3">Priority</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">AI Score</th>
                <th className="text-right px-5 py-3">Value</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, index) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => setActive(lead)}
                  className="border-t border-white/5 hover:bg-white/3 cursor-pointer transition"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl glass-strong grid place-items-center text-xs font-semibold">
                        {lead.name.split(' ').map((part) => part[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-xs text-muted-foreground">{lead.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs ${channelMeta[lead.channel].color}`}>● {channelMeta[lead.channel].label}</span>
                  </td>
                  <td className="px-5 py-3">
                    <Badge tone={lead.priority === 'hot' ? 'danger' : lead.priority === 'warm' ? 'warning' : 'info'}>
                      {lead.priority}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Badge>{lead.status}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full grad-primary" style={{ width: `${lead.aiScore}%` }} />
                      </div>
                      <span className="text-xs font-medium">{lead.aiScore}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold">${lead.value.toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <AnimatePresence>
        {active && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setActive(null)}>
            <motion.aside
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: 'spring', damping: 26 }}
              onClick={(event: React.MouseEvent<HTMLDivElement>) => event.stopPropagation()}
              className="absolute right-0 top-0 h-full w-full max-w-md glass-strong p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="w-14 h-14 rounded-2xl grad-primary grid place-items-center text-lg font-bold">{active.name.split(' ').map((part) => part[0]).join('')}</div>
                  <h2 className="text-xl font-bold mt-3">{active.name}</h2>
                  <div className="text-sm text-muted-foreground">{active.company}</div>
                </div>
                <button onClick={() => setActive(null)} className="p-2 rounded-lg hover:bg-white/10">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Stat label="AI Score" value={`${active.aiScore}`} />
                <Stat label="Deal value" value={`$${active.value.toLocaleString()}`} />
                <Stat label="Priority" value={active.priority} />
                <Stat label="Status" value={active.status} />
              </div>
              <div className="mt-6 space-y-2 text-sm">
                <InfoRow icon={<Mail className="w-4 h-4" />} text={active.email} />
                <InfoRow icon={<Phone className="w-4 h-4" />} text={active.phone} />
                <InfoRow icon={<Building2 className="w-4 h-4" />} text={active.company} />
              </div>
              <div className="mt-6">
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">AI summary</div>
                <p className="text-sm leading-relaxed glass rounded-xl p-4">
                  {active.name} engaged via {channelMeta[active.channel].label} {active.createdAt}, asking about enterprise pricing. Strong purchase intent — Gemini classified as <b>{active.priority}</b>. Suggested next step: book a 20-min discovery call.
                </p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-2">
                <button onClick={() => toast.success('Email drafted by AI')} className="h-10 rounded-xl glass hover:bg-white/10 text-sm">
                  Draft email
                </button>
                <button onClick={() => toast.success('Call scheduled')} className="h-10 rounded-xl grad-primary text-white text-sm font-semibold">
                  Book call
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold capitalize mt-0.5">{value}</div>
    </div>
  );
}

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <span className="text-accent">{icon}</span>
      <span className="text-foreground truncate">{text}</span>
    </div>
  );
}
