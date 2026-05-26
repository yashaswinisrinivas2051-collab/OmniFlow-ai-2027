import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessagesSquare,
  TrendingUp,
  Users,
  Sparkles,
  ArrowUpRight,
  Bot,
  PhoneCall,
  Zap,
} from 'lucide-react';

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

import { GlassCard, Badge } from '@/components/ui-kit/Card';

import {
  conversations,
  leads,
  messageVolume,
  channelShare,
  aiActivity,
  channelMeta,
} from '@/lib/mockData';

const metrics = [
  {
    label: 'Total Conversations',
    value: '12,847',
    delta: '+18.2%',
    icon: MessagesSquare,
    tone: 'from-violet-500/30 to-fuchsia-500/10',
  },

  {
    label: 'AI Replies Sent',
    value: '9,432',
    delta: '+24.7%',
    icon: Bot,
    tone: 'from-cyan-500/30 to-sky-500/10',
  },

  {
    label: 'Active Leads',
    value: '1,284',
    delta: '+11.4%',
    icon: Users,
    tone: 'from-emerald-500/30 to-teal-500/10',
  },

  {
    label: 'Conversion Rate',
    value: '32.6%',
    delta: '+4.1%',
    icon: TrendingUp,
    tone: 'from-amber-500/30 to-rose-500/10',
  },
];

export function DashboardPage() {

  const recentConvos = conversations.slice(0, 5);

  const recentLeads = leads.slice(0, 5);

  return (

    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">

        <div>

          <div className="flex items-center gap-2 text-xs text-accent uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Live workspace
          </div>

          <h1 className="text-3xl font-bold mt-1">
            Welcome back, Alex
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Your AI handled 412 conversations in the last 24 hours.
          </p>

        </div>

        <div className="flex gap-2">

          <Link
            to="/inbox"
            className="px-4 h-10 inline-flex items-center gap-2 rounded-xl glass text-sm font-medium hover:bg-white/10 transition"
          >
            Open inbox
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <Link
            to="/automations"
            className="px-4 h-10 inline-flex items-center gap-2 rounded-xl grad-primary text-sm font-semibold text-white hover:opacity-95 transition"
          >
            <Zap className="w-4 h-4" />
            New automation
          </Link>

        </div>

      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {metrics.map((metric, index) => {

          const Icon = metric.icon;

          return (

            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative glass rounded-2xl p-5 overflow-hidden"
            >

              <div
                className={`absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${metric.tone} blur-2xl`}
              />

              <div className="relative flex items-start justify-between">

                <div>

                  <div className="text-xs text-muted-foreground">
                    {metric.label}
                  </div>

                  <div className="text-3xl font-bold mt-2 font-display">
                    {metric.value}
                  </div>

                  <div className="text-xs text-emerald-300 mt-1">
                    {metric.delta} vs last week
                  </div>

                </div>

                <div className="w-10 h-10 rounded-xl glass-strong grid place-items-center">
                  <Icon className="w-4.5 h-4.5 text-foreground" />
                </div>

              </div>

            </motion.div>

          );
        })}

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        <GlassCard className="xl:col-span-2">

          <div className="flex items-center justify-between mb-4">

            <div>
              <h3 className="font-semibold">
                Message volume
              </h3>

              <p className="text-xs text-muted-foreground">
                Last 7 days · across all channels
              </p>
            </div>

            <Badge tone="primary">
              Realtime
            </Badge>

          </div>

          <div className="h-64">

            <ResponsiveContainer>

              <AreaChart data={messageVolume}>

                <defs>

                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.19 295)" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="oklch(0.72 0.19 295)" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.74 0.18 195)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.74 0.18 195)" stopOpacity={0} />
                  </linearGradient>

                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(1 0 0 / 0.06)"
                />

                <XAxis
                  dataKey="day"
                  stroke="oklch(0.7 0.03 270)"
                  fontSize={12}
                />

                <YAxis
                  stroke="oklch(0.7 0.03 270)"
                  fontSize={12}
                />

                <Tooltip
                  contentStyle={{
                    background: 'oklch(0.21 0.03 270)',
                    border: '1px solid oklch(1 0 0 / 0.1)',
                    borderRadius: 12,
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="whatsapp"
                  stroke="oklch(0.72 0.19 295)"
                  fill="url(#g1)"
                  strokeWidth={2}
                />

                <Area
                  type="monotone"
                  dataKey="instagram"
                  stroke="oklch(0.74 0.18 195)"
                  fill="url(#g2)"
                  strokeWidth={2}
                />

                <Area
                  type="monotone"
                  dataKey="web"
                  stroke="oklch(0.78 0.17 50)"
                  fill="transparent"
                  strokeWidth={2}
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </GlassCard>

        {/* Channel Performance */}
        <GlassCard>

          <div className="mb-4">

            <h3 className="font-semibold">
              Channel performance
            </h3>

            <p className="text-xs text-muted-foreground">
              Share of conversations
            </p>

          </div>

          <div className="h-48">

            <ResponsiveContainer>

              <PieChart>

                <Pie
                  data={channelShare}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                >

                  {channelShare.map((channel) => (

                    <Cell
                      key={channel.name}
                      fill={channel.color}
                      stroke="transparent"
                    />

                  ))}

                </Pie>

              </PieChart>

            </ResponsiveContainer>

          </div>

        </GlassCard>

      </div>

      {/* AI Voice */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        <GlassCard className="xl:col-span-2">

          <div className="flex items-center justify-between mb-4">

            <h3 className="font-semibold">
              AI response activity
            </h3>

            <Badge tone="success">
              +24% today
            </Badge>

          </div>

          <div className="h-48">

            <ResponsiveContainer>

              <BarChart data={aiActivity}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(1 0 0 / 0.06)"
                />

                <XAxis
                  dataKey="hour"
                  stroke="oklch(0.7 0.03 270)"
                  fontSize={10}
                />

                <YAxis
                  stroke="oklch(0.7 0.03 270)"
                  fontSize={10}
                />

                <Tooltip />

                <Bar
                  dataKey="replies"
                  fill="oklch(0.72 0.19 295)"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </GlassCard>

        <GlassCard>

          <div className="flex items-center justify-between mb-4">

            <h3 className="font-semibold">
              AI Voice Assistant
            </h3>

            <Badge tone="info">
              Live
            </Badge>

          </div>

          <div className="rounded-xl p-4 grad-primary text-white relative overflow-hidden">

            <PhoneCall className="absolute -right-2 -bottom-2 w-24 h-24 opacity-20" />

            <div className="text-xs uppercase tracking-widest opacity-80">
              Today
            </div>

            <div className="text-4xl font-bold font-display mt-1">
              38
            </div>

            <div className="text-sm opacity-90">
              calls handled · avg 2m 14s
            </div>

          </div>

        </GlassCard>

      </div>

      {/* AI Insights */}
      <GlassCard>

        <div className="flex items-center justify-between mb-4">

          <h3 className="font-semibold">
            🤖 AI Insights
          </h3>

          <Badge tone="primary">
            Smart Analytics
          </Badge>

        </div>

        <div className="space-y-4 text-sm text-muted-foreground">

          <div className="glass rounded-xl p-4">
            • 73% leads responded automatically
          </div>

          <div className="glass rounded-xl p-4">
            • Peak customer activity detected at 7 PM
          </div>

          <div className="glass rounded-xl p-4">
            • Instagram conversions increased by 24%
          </div>

          <div className="glass rounded-xl p-4">
            • AI reduced response time by 81%
          </div>

          <div className="glass rounded-xl p-4">
            • WhatsApp engagement improved this week
          </div>

        </div>

      </GlassCard>

    </div>

  );
}