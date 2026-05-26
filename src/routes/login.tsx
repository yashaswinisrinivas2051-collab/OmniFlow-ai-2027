import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, ArrowRight, Zap } from 'lucide-react';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('alex@acme.com');
  const [password, setPassword] = useState('demo1234');
  const [loading, setLoading] = useState(false);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('omniflow_auth', '1');
      toast.success('Welcome back, Alex');
      navigate('/dashboard');
    }, 700);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-accent/20 blur-3xl" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl grad-primary grid place-items-center ring-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-xl grad-text">OmniFlow</div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">AI Suite</div>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-md">
          <h1 className="text-5xl font-bold leading-tight">
            One inbox.<br />
            <span className="grad-text">Every channel.</span><br />
            Zero waiting.
          </h1>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Gemini-powered conversations across WhatsApp, Instagram, Facebook, LinkedIn,
            web chat, and AI voice — closing leads while you sleep.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {['WhatsApp', 'Instagram', 'LinkedIn', 'Voice AI', 'Web Chat', 'Auto Lead Capture'].map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-full glass text-xs">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
        <div className="text-xs text-muted-foreground">© 2025 OmniFlow AI · Built for hackathon demo</div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md glass-strong rounded-3xl p-8 ring-glow"
        >
          <div className="flex items-center gap-2 text-xs text-accent mb-3">
            <Zap className="w-3.5 h-3.5" /> Demo mode — any credentials work
          </div>
          <h2 className="text-2xl font-bold">Sign in to OmniFlow</h2>
          <p className="text-sm text-muted-foreground mt-1">Run your entire conversational stack from one place.</p>
          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Email</span>
              <div className="mt-1.5 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Password</span>
              <div className="mt-1.5 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full h-11 rounded-xl grad-primary font-semibold text-white flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-60 transition"
          >
            {loading ? 'Signing in…' : (
              <>
                Continue <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          <div className="mt-5 text-center text-xs text-muted-foreground">
            Protected by Firebase Auth · SOC2 in progress
          </div>
        </motion.form>
      </div>
    </div>
  );
}
