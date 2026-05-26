import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneCall, PhoneOff, Mic, MicOff, Sparkles, Calendar, FileText } from 'lucide-react';
import { Badge, GlassCard } from '@/components/ui-kit/Card';
import { toast } from 'sonner';

const transcript = [
  { from: 'caller', text: 'Hi, I’m calling about your CRM integration pricing.' },
  { from: 'ai', text: 'Hi there! Happy to help. Are you on the Starter, Pro, or Enterprise plan?' },
  { from: 'caller', text: "We're a 50-person team — probably Pro." },
  { from: 'ai', text: 'Got it. Pro is $49 per user per month and includes WhatsApp, Instagram, and AI voice. Want me to book a 20-minute walkthrough?' },
  { from: 'caller', text: 'Yes, Thursday afternoon would be perfect.' },
  { from: 'ai', text: 'Done — Thursday at 3:00pm IST with Sara from sales. Calendar invite sent.' },
];

const recent = [
  { name: 'Priya Sharma', company: 'Vertex Retail', duration: '2m 14s', outcome: 'Demo booked', time: '10 min ago' },
  { name: 'Marcus Bauer', company: 'Helios Solar', duration: '4m 02s', outcome: 'Quote sent', time: '1h ago' },
  { name: 'Camila Rossi', company: 'Aurora Cosmetics', duration: '1m 38s', outcome: 'Voicemail', time: '2h ago' },
];

export function VoicePage() {
  const [incoming, setIncoming] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [step, setStep] = useState(0);
  const [muted, setMuted] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!inCall) return;
    const timer = window.setInterval(() => setSeconds((current) => current + 1), 1000);
    const transcriptTimer = window.setInterval(() => setStep((current) => Math.min(current + 1, transcript.length)), 2200);
    return () => {
      window.clearInterval(timer);
      window.clearInterval(transcriptTimer);
    };
  }, [inCall]);

  const accept = () => {
    setIncoming(false);
    setInCall(true);
    setStep(0);
    setSeconds(0);
  };

  const end = () => {
    setInCall(false);
    toast.success('Call ended', { description: 'AI summary saved · Demo booked for Thu 3pm' });
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">AI Voice Calls</h1>
          <p className="text-sm text-muted-foreground mt-1">Simulated voice assistant — picks up, qualifies, books.</p>
        </div>
        <button onClick={() => setIncoming(true)} className="h-10 px-4 rounded-xl grad-primary text-white text-sm font-semibold flex items-center gap-2">
          <PhoneCall className="w-4 h-4" /> Simulate incoming call
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
        <GlassCard className="min-h-[420px]">
          {!inCall ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="w-20 h-20 rounded-full grad-primary grid place-items-center ring-glow">
                <PhoneCall className="w-9 h-9 text-white" />
              </div>
              <h3 className="mt-5 font-semibold text-lg">No active call</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Click "Simulate incoming call" to see the AI assistant handle a sales conversation end-to-end.
              </p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full grad-primary grid place-items-center text-sm font-bold">PS</div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-card" />
                  </div>
                  <div>
                    <div className="font-semibold">Priya Sharma</div>
                    <div className="text-xs text-muted-foreground">Vertex Retail · +1 555 0192</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-lg font-semibold">{mm}:{ss}</div>
                  <Badge tone="success">Connected</Badge>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px] pr-2">
                {transcript.slice(0, step).map((item, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex ${item.from === 'ai' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${item.from === 'ai' ? 'grad-primary text-white' : 'glass'}`}>
                      <div className={`text-[10px] mb-1 ${item.from === 'ai' ? 'text-white/80' : 'text-muted-foreground'}`}>
                        {item.from === 'ai' ? 'AI Assistant' : 'Caller'}
                      </div>
                      {item.text}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-5 flex justify-center gap-3">
                <button onClick={() => setMuted((current) => !current)} className={`w-12 h-12 rounded-full glass hover:bg-white/10 grid place-items-center ${muted ? 'text-rose-300' : ''}`}>
                  {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button onClick={end} className="w-14 h-14 rounded-full bg-rose-500 hover:bg-rose-600 grid place-items-center">
                  <PhoneOff className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          )}
        </GlassCard>

        <div className="space-y-4">
          <GlassCard>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-accent" />
              <h3 className="font-semibold">AI call summary</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Caller asked about Pro pricing for a 50-person team. Intent: <b className="text-foreground">high</b>. Booked demo for Thu 3pm IST with Sara. Lead score: 92.
            </p>
            <div className="mt-3 flex gap-2 flex-wrap">
              <Badge tone="success">Demo booked</Badge>
              <Badge tone="primary">Pro plan</Badge>
              <Badge tone="info">Enterprise potential</Badge>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold mb-3">Recent calls</h3>
            <div className="divide-y divide-white/5">
              {recent.map((call, index) => (
                <div key={index} className="py-2.5 first:pt-0 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg glass-strong grid place-items-center">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{call.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{call.company} · {call.duration}</div>
                  </div>
                  <div className="text-right">
                    <Badge tone="success" className="text-[10px]">{call.outcome}</Badge>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{call.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-accent" />
              <h3 className="font-semibold">Today’s bookings</h3>
            </div>
            <div className="space-y-2 text-sm">
              <BookingRow time="2:00pm" name="Diego Alvarez" />
              <BookingRow time="3:00pm" name="Priya Sharma" hot />
              <BookingRow time="4:30pm" name="Sophia Chen" />
            </div>
            <button className="mt-3 w-full h-9 rounded-xl glass hover:bg-white/10 text-xs flex items-center justify-center gap-2">
              <FileText className="w-3.5 h-3.5" /> Open calendar
            </button>
          </GlassCard>
        </div>
      </div>

      <AnimatePresence>
        {incoming && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md grid place-items-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} className="glass-strong rounded-3xl p-8 max-w-sm w-full text-center ring-glow">
              <div className="text-xs uppercase tracking-widest text-accent">Incoming call</div>
              <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ repeat: Infinity, duration: 1.6 }} className="w-24 h-24 rounded-full grad-primary grid place-items-center mx-auto mt-5 text-2xl font-bold">
                PS
              </motion.div>
              <h3 className="text-xl font-bold mt-4">Priya Sharma</h3>
              <p className="text-sm text-muted-foreground">Vertex Retail · WhatsApp Business</p>
              <div className="flex justify-center gap-6 mt-8">
                <button onClick={() => setIncoming(false)} className="w-14 h-14 rounded-full bg-rose-500 hover:bg-rose-600 grid place-items-center">
                  <PhoneOff className="w-6 h-6 text-white" />
                </button>
                <button onClick={accept} className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 grid place-items-center">
                  <Phone className="w-6 h-6 text-white" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BookingRow({ time, name, hot }: { time: string; name: string; hot?: boolean }) {
  return (
    <div className="flex items-center gap-3 glass rounded-lg p-2.5">
      <div className="text-xs font-mono font-semibold w-14">{time}</div>
      <div className="flex-1 text-sm">{name}</div>
      {hot && <Badge tone="danger">hot</Badge>}
    </div>
  );
}
