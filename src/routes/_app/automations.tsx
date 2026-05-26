import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Plus, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { Badge, GlassCard } from '@/components/ui-kit/Card';
import { automations as seed, channelMeta, type Automation } from '@/lib/mockData';

export function AutomationsPage() {
  const [rules, setRules] = useState<Automation[]>(seed);

  const toggle = (id: string) => {
    setRules((current) => current.map((rule) => (rule.id === id ? { ...rule, active: !rule.active } : rule)));
    toast.success('Automation updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Automations</h1>
          <p className="text-sm text-muted-foreground mt-1">Rules that work 24/7 across every channel</p>
        </div>
        <button onClick={() => toast('Builder coming next sprint')} className="h-10 px-4 rounded-xl grad-primary text-white text-sm font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" /> New rule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard><div className="text-xs text-muted-foreground">Active rules</div><div className="text-3xl font-bold mt-2 font-display">{rules.filter((rule) => rule.active).length}</div></GlassCard>
        <GlassCard><div className="text-xs text-muted-foreground">Fired this month</div><div className="text-3xl font-bold mt-2 font-display">{rules.reduce((total, rule) => total + rule.fired, 0).toLocaleString()}</div></GlassCard>
        <GlassCard><div className="text-xs text-muted-foreground">Hours saved</div><div className="text-3xl font-bold mt-2 font-display">418h</div></GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {rules.map((rule, index) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="glass rounded-2xl p-5 group hover:bg-white/5 transition"
          >
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-xl grid place-items-center ${rule.active ? 'grad-primary' : 'glass-strong'}`}>
                <Bot className={`w-5 h-5 ${rule.active ? 'text-white' : 'text-muted-foreground'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{rule.name}</h3>
                  {rule.channel !== 'all' ? (
                    <Badge>{channelMeta[rule.channel].label}</Badge>
                  ) : (
                    <Badge tone="primary">All channels</Badge>
                  )}
                  <Badge tone={rule.active ? 'success' : 'default'}>{rule.active ? 'Active' : 'Paused'}</Badge>
                </div>
                <div className="mt-3 space-y-1.5 text-sm">
                  <div className="flex gap-2"><span className="text-muted-foreground text-xs uppercase tracking-widest w-16 mt-0.5">When</span><span>{rule.trigger}</span></div>
                  <div className="flex gap-2"><span className="text-muted-foreground text-xs uppercase tracking-widest w-16 mt-0.5">Then</span><span>{rule.action}</span></div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-accent" /> Fired {rule.fired.toLocaleString()} times
                  </div>
                  <button onClick={() => toggle(rule.id)} className={`relative w-11 h-6 rounded-full transition ${rule.active ? 'grad-primary' : 'bg-white/10'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition ${rule.active ? 'left-[22px]' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
