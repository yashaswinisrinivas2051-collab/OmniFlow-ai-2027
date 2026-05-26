import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Paperclip, Smile, MoreVertical, Phone, CheckCheck } from 'lucide-react';
import { Badge } from '@/components/ui-kit/Card';
import { toast } from 'sonner';
import { channelMeta, conversations as seed, type Conversation, type Message } from '@/lib/mockData';

const quickReplies = [
  'Thanks for reaching out — can you share more details?',
  'Let me check on that and get right back to you.',
  'Would Thursday 3pm work for a quick call?',
];

export function InboxPage() {
  const [convos, setConvos] = useState<Conversation[]>(seed);
  const [activeId, setActiveId] = useState(seed[0]?.id ?? '');
  const [filter, setFilter] = useState<string>('all');
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = convos.find((c) => c.id === activeId) ?? convos[0]!;
  const filtered = filter === 'all' ? convos : convos.filter((c) => c.channel === filter);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [active.messages.length, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: `m-${Date.now()}`, from: 'agent', text, time: 'now' };
    setConvos((prev) =>
      prev.map((conversation) =>
        conversation.id === activeId
          ? { ...conversation, messages: [...conversation.messages, userMsg], lastMessage: text }
          : conversation,
      ),
    );

    setDraft('');
    setTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: `m-${Date.now() + 1}`,
        from: 'ai',
        text: "Got it — I've drafted a follow-up and tagged this as qualified. Want me to send it?",
        time: 'now',
      };

      setConvos((prev) =>
        prev.map((conversation) =>
          conversation.id === activeId
            ? {
                ...conversation,
                messages: [...conversation.messages, aiMsg],
                lastMessage: aiMsg.text,
                aiHandled: true,
              }
            : conversation,
        ),
      );
      setTyping(false);
      toast.success('AI reply suggested', { description: 'Confidence 94% · Gemini Pro' });
    }, 1400);
  };

  return (
    <div className="h-[calc(100vh-8rem)] grid grid-cols-1 lg:grid-cols-[320px_1fr] xl:grid-cols-[320px_1fr_320px] gap-4">
      <div className="glass rounded-2xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border/60">
          <h2 className="font-semibold">Inbox</h2>
          <p className="text-xs text-muted-foreground">{filtered.length} conversations</p>
          <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
            {(['all', 'whatsapp', 'instagram', 'facebook', 'linkedin', 'web'] as const).map((value) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  filter === value ? 'grad-primary text-white' : 'glass hover:bg-white/10 text-muted-foreground'
                }`}
              >
                {value === 'all' ? 'All' : channelMeta[value].label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map((conversation) => {
            const meta = channelMeta[conversation.channel];
            const isActive = conversation.id === activeId;
            return (
              <button
                key={conversation.id}
                onClick={() => setActiveId(conversation.id)}
                className={`w-full text-left px-4 py-3 flex gap-3 border-l-2 transition ${
                  isActive ? 'bg-white/5 border-primary' : 'border-transparent hover:bg-white/3'
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full grad-primary grid place-items-center text-sm font-semibold">
                    {conversation.avatar}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${meta.dot} ring-2 ring-card`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <div className="font-medium text-sm truncate">{conversation.name}</div>
                    <div className="text-[10px] text-muted-foreground shrink-0">{conversation.time}</div>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{conversation.lastMessage}</div>
                  <div className="flex items-center gap-2 mt-1">
                    {conversation.aiHandled && <Badge tone="primary">AI</Badge>}
                    {conversation.assignee && <Badge>{conversation.assignee}</Badge>}
                    {conversation.unread > 0 && (
                      <span className="ml-auto w-4 h-4 rounded-full grad-primary text-[10px] grid place-items-center font-bold text-white">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="glass rounded-2xl flex flex-col overflow-hidden min-w-0">
        <div className="px-5 py-3.5 border-b border-border/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full grad-primary grid place-items-center text-sm font-semibold">
            {active.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">{active.name}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${channelMeta[active.channel].dot}`} />
              {channelMeta[active.channel].label} · online
            </div>
          </div>
          <button className="p-2 rounded-lg hover:bg-white/10">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3">
          {active.messages.map((message) => (
            <Bubble key={message.id} message={message} />
          ))}
          <AnimatePresence>
            {typing && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="w-3 h-3 text-accent" /> AI is composing
                <span className="flex gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-accent animate-bounce" />
                  <span className="w-1 h-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="w-1 h-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.3s' }} />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-4 border-t border-border/60 space-y-3">
        <div className="flex gap-3 mb-3">

  <button
    onClick={() => {
      toast.success("🎤 AI Voice Assistant Activated");
    }}
    className="bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-xl text-sm"
  >
    🎤 Voice AI
  </button>

  <button
    onClick={() => {
      toast.success("📞 AI Call Started");
    }}
    className="bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-xl text-sm"
  >
    📞 AI Call
  </button>

</div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => send(reply)}
                className="shrink-0 px-3 py-1.5 rounded-full glass hover:bg-white/10 text-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-accent" /> {reply.length > 38 ? `${reply.slice(0, 38)}…` : reply}
              </button>
            ))}
          </div>
          <div className="flex items-end gap-2">
            <button className="p-2.5 rounded-xl glass hover:bg-white/10">
              <Paperclip className="w-4 h-4" />
            </button>
            <button className="p-2.5 rounded-xl glass hover:bg-white/10">
              <Smile className="w-4 h-4" />
            </button>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  send(draft);
                }
              }}
              rows={1}
              placeholder="Type a reply… or press / for AI suggestions"
              className="flex-1 resize-none rounded-xl bg-white/5 border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 max-h-32"
            />
            <button onClick={() => send(draft)} className="h-11 px-4 rounded-xl grad-primary text-white font-medium flex items-center gap-2">
              <Send className="w-4 h-4" /> Send
            </button>
          </div>
        </div>
      </div>

      <div className="hidden xl:flex glass rounded-2xl flex-col overflow-hidden">
        <div className="p-5 border-b border-border/60">
          <div className="w-16 h-16 rounded-2xl grad-primary grid place-items-center text-xl font-bold mx-auto">{active.avatar}</div>
          <div className="text-center mt-3 font-semibold">{active.name}</div>
          <div className="text-xs text-muted-foreground text-center">{channelMeta[active.channel].label} contact</div>
        </div>
        <div className="p-5 space-y-4 text-sm">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">AI insights</div>
            <div className="glass rounded-xl p-3 space-y-2">
              <div className="flex justify-between"><span className="text-muted-foreground text-xs">Intent</span><Badge tone="primary">Purchase</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground text-xs">Sentiment</span><Badge tone="success">Positive</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground text-xs">Confidence</span><span className="text-xs font-medium">94%</span></div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="h-full grad-primary" style={{ width: '94%' }} /></div>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Customer</div>
            <div className="space-y-1.5 text-xs">
              <Row label="Email" value={`${active.name.toLowerCase().replace(/\s/g, '.')}@gmail.com`} />
              <Row label="Phone" value="+1 555 0192" />
              <Row label="Lifetime value" value="$2,840" />
              <Row label="Last order" value="3 days ago" />
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Suggested actions</div>
            <div className="space-y-2">
              <button onClick={() => toast.success('Lead created')} className="w-full text-left text-xs glass hover:bg-white/10 rounded-lg p-2.5">+ Create lead</button>
              <button onClick={() => toast.success('Appointment booked for Thu 3pm')} className="w-full text-left text-xs glass hover:bg-white/10 rounded-lg p-2.5">📅 Book appointment</button>
              <button onClick={() => toast.success('Synced to CRM')} className="w-full text-left text-xs glass hover:bg-white/10 rounded-lg p-2.5">↗ Send to HubSpot</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bubble({ message }: { message: Message }) {
  const isMe = message.from === 'agent';
  const isAI = message.from === 'ai';

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
          isMe ? 'grad-primary text-white rounded-br-sm' : isAI ? 'glass-strong border-accent/30 rounded-bl-sm' : 'glass rounded-bl-sm'
        }`}
      >
        {isAI && (
          <div className="flex items-center gap-1 text-[10px] text-accent mb-1">
            <Sparkles className="w-3 h-3" /> AI · Gemini
          </div>
        )}
        <div className="leading-relaxed">{message.text}</div>
        <div className={`text-[10px] mt-1 flex items-center gap-1 ${isMe ? 'text-white/70 justify-end' : 'text-muted-foreground'}`}>
          {message.time} {isMe && <CheckCheck className="w-3 h-3" />}
        </div>
      </div>
    </motion.div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium truncate">{value}</span>
    </div>
  );
}
