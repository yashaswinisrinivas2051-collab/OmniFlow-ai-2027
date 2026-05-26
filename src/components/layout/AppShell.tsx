import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  MessagesSquare,
  Users,
  BarChart3,
  Bot,
  PhoneCall,
  Settings,
  Bell,
  Search,
  LogOut,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/inbox', label: 'Unified Inbox', icon: MessagesSquare },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/automations', label: 'Automations', icon: Bot },
  { to: '/voice', label: 'Voice Calls', icon: PhoneCall },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function AppShell() {

  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {

    if (typeof window === 'undefined') return;

    if (!localStorage.getItem('omniflow_auth')) {

      navigate('/login', { replace: true });

    }

  }, [navigate]);

  const logout = () => {

    localStorage.removeItem('omniflow_auth');

    navigate('/login');

  };

  return (

    <div className="min-h-screen flex text-foreground">

      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 shrink-0 flex-col glass-strong border-r border-border/60 p-4 sticky top-0 h-screen">

        <Brand />

        <NavList
          pathname={location.pathname}
          onNavigate={() => setMobileOpen(false)}
        />

        <UserCard onLogout={logout} />

      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>

        {mobileOpen && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          >

            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 24 }}
              className="w-72 h-full glass-strong p-4 flex flex-col"
              onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                e.stopPropagation()
              }
            >

              <div className="flex items-center justify-between mb-2">

                <Brand />

                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/5"
                >
                  <X className="w-4 h-4" />
                </button>

              </div>

              <NavList
                pathname={location.pathname}
                onNavigate={() => setMobileOpen(false)}
              />

              <UserCard onLogout={logout} />

            </motion.aside>

          </motion.div>

        )}

      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Header */}
        <header className="sticky top-0 z-30 glass border-b border-border/60 px-4 lg:px-8 h-16 flex items-center gap-3">

          {/* Mobile Menu */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white/5"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md relative">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            <input
              placeholder="Search conversations, leads, automations…"
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/5 border border-border/60 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />

          </div>

          {/* Notification Bell */}
          <button
            onClick={() => {

              alert(
                "🔔 Notifications\n\n" +
                "• 3 New Messages\n" +
                "• 2 AI Replies Generated\n" +
                "• 1 New Lead Added\n" +
                "• WhatsApp Response Pending"
              );

            }}
            className="relative p-2.5 rounded-xl glass hover:bg-white/10 transition"
          >

            <Bell className="w-4 h-4" />

            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-400 animate-pulse" />

          </button>

          {/* AI Status */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl glass">

            <Sparkles className="w-3.5 h-3.5 text-accent" />

            <span className="text-xs font-medium">
              AI Online
            </span>

            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />

          </div>

        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-[1600px] w-full mx-auto">

          <Outlet />

        </main>

      </div>

    </div>

  );
}

function Brand() {

  return (

    <NavLink
      to="/dashboard"
      className="flex items-center gap-2.5 px-2 py-3 mb-4"
    >

      <div className="w-9 h-9 rounded-xl grad-primary grid place-items-center ring-glow">

        <Sparkles className="w-4.5 h-4.5 text-white" />

      </div>

      <div>

        <div className="font-display font-bold text-lg leading-none grad-text">

          OmniFlow

        </div>

        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">

          AI Suite

        </div>

      </div>

    </NavLink>

  );
}

function NavList({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {

  return (

    <nav className="flex-1 flex flex-col gap-1">

      {nav.map((item) => {

        const Icon = item.icon;

        const active =
          pathname === item.to ||
          (item.to !== '/dashboard' &&
            pathname.startsWith(item.to));

        return (

          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `relative group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive || active
                  ? 'bg-white/10 text-white border border-white/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`
            }
          >

            <Icon className="w-4 h-4" />

            {item.label}

          </NavLink>

        );

      })}

    </nav>

  );
}

function UserCard({
  onLogout,
}: {
  onLogout: () => void;
}) {

  return (

    <div className="mt-4 p-3 rounded-xl glass flex items-center gap-3">

      <div className="w-9 h-9 rounded-full grad-primary grid place-items-center text-sm font-semibold">

        AM

      </div>

      <div className="flex-1 min-w-0">

        <div className="text-sm font-medium truncate">

          Alex Morgan

        </div>

        <div className="text-xs text-muted-foreground truncate">

          Pro · Acme Inc

        </div>

      </div>

      <button
        onClick={onLogout}
        className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground"
        title="Sign out"
      >

        <LogOut className="w-4 h-4" />

      </button>

    </div>

  );
} 