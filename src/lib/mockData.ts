export type Channel = 'whatsapp' | 'instagram' | 'facebook' | 'linkedin' | 'web';
export type LeadPriority = 'hot' | 'warm' | 'cold';
export type LeadStatus = 'new' | 'qualified' | 'contacted' | 'converted' | 'lost';

export interface Message {
  id: string;
  from: 'user' | 'ai' | 'agent';
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  channel: Channel;
  lastMessage: string;
  time: string;
  unread: number;
  aiHandled: boolean;
  assignee?: string;
  messages: Message[];
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  channel: Channel;
  priority: LeadPriority;
  status: LeadStatus;
  value: number;
  createdAt: string;
  aiScore: number;
}

export interface Automation {
  id: string;
  name: string;
  trigger: string;
  action: string;
  channel: Channel | 'all';
  active: boolean;
  fired: number;
}

const names = [
  'Aarav Mehta', 'Priya Sharma', 'Diego Alvarez', 'Sophia Chen', "Liam O'Connor",
  'Aisha Khan', 'Noah Williams', 'Yuki Tanaka', 'Emma Johansson', 'Marcus Bauer',
  'Layla Hassan', 'Oliver Smith', 'Camila Rossi', 'Hiro Sato', 'Mia Dubois',
  'Ethan Park', 'Zara Ali', 'Lucas Silva', 'Nora Lindqvist', 'Ravi Iyer',
  'Chloe Martin', 'Omar Farouk', 'Isabella Romano', 'Kenji Watanabe', 'Ana Costa',
];

const companies = [
  'Nimbus Labs', 'Vertex Retail', 'Solace Health', 'Northwind Logistics',
  'Echo Studios', 'Pioneer Bank', 'Quantum EdTech', 'Helios Solar',
  'Aurora Cosmetics', 'BrightPath Realty', 'Polaris Travel', 'Cobalt Fitness',
];

const channels: Channel[] = ['whatsapp', 'instagram', 'facebook', 'linkedin', 'web'];
const sampleSnippets = [
  'Hi, do you ship internationally?',
  'Can I get a demo this week?',
  'What’s the pricing for the team plan?',
  'Still interested — when can we talk?',
  'Thanks! Just booked the appointment.',
  'Is the AI assistant included in the Pro tier?',
  'I haven’t received my order yet.',
  'Can someone from sales call me back?',
  'Loved the demo. Sending it to my CEO.',
  'Do you integrate with HubSpot?',
];

const aiReplies = [
  'Absolutely — we ship to 80+ countries with tracking included.',
  'I’ve blocked Thursday 3pm IST on the calendar. Confirming shortly.',
  'Our Team plan is $49/user/mo with unlimited AI replies.',
  'Pulled up your last order — it’s out for delivery today.',
  'Yes, native HubSpot, Salesforce and Pipedrive sync are included.',
];

function pick<T>(arr: T[], i: number) {
  return arr[i % arr.length];
}

function rand(seed: number) {
  return ((Math.sin(seed) + 1) / 2);
}

export const conversations: Conversation[] = Array.from({ length: 22 }, (_, i) => {
  const name = pick(names, i);
  const initials = name.split(' ').map((part) => part[0]).join('');
  const ch = pick(channels, i + 1);
  const snippet = pick(sampleSnippets, i);
  const aiReply = pick(aiReplies, i);
  const msgs: Message[] = [
    { id: `${i}-1`, from: 'user', text: snippet, time: '10:42' },
    { id: `${i}-2`, from: 'ai', text: aiReply, time: '10:42' },
    { id: `${i}-3`, from: 'user', text: "Perfect — let’s go ahead.", time: '10:44' },
  ];

  if (i % 3 === 0) {
    msgs.push({ id: `${i}-4`, from: 'agent', text: "Thanks! I’ll personally follow up.", time: '10:46' });
  }

  return {
    id: `conv-${i + 1}`,
    name,
    avatar: initials,
    channel: ch,
    lastMessage: msgs[msgs.length - 1].text,
    time: `${Math.floor(rand(i) * 11) + 1}m`,
    unread: i % 4 === 0 ? Math.floor(rand(i + 1) * 5) + 1 : 0,
    aiHandled: i % 2 === 0,
    assignee: i % 3 === 0 ? 'You' : i % 3 === 1 ? 'Sara' : undefined,
    messages: msgs,
  };
});

export const leads: Lead[] = Array.from({ length: 18 }, (_, i) => {
  const name = pick(names, i + 3);
  const priorities: LeadPriority[] = ['hot', 'warm', 'cold'];
  const statuses: LeadStatus[] = ['new', 'qualified', 'contacted', 'converted', 'lost'];
  const company = pick(companies, i);

  return {
    id: `lead-${i + 1}`,
    name,
    company,
    email: `${name.toLowerCase().replace(/[^a-z]/g, '.')}
      @${company.toLowerCase().replace(/\s/g, '')}.com`,
    phone: `+1 555 0${100 + i}`,
    channel: pick(channels, i),
    priority: pick(priorities, i),
    status: pick(statuses, i + 1),
    value: Math.floor(rand(i + 5) * 9000) + 500,
    createdAt: `${Math.floor(rand(i) * 28) + 1} Nov 2025`,
    aiScore: Math.floor(rand(i + 2) * 40) + 60,
  };
});

export const automations: Automation[] = [
  {
    id: 'a1',
    name: 'Welcome new WhatsApp leads',
    trigger: 'First message on WhatsApp',
    action: 'Send welcome + collect name',
    channel: 'whatsapp',
    active: true,
    fired: 1284,
  },
  {
    id: 'a2',
    name: 'Pricing intent → demo',
    trigger: "Message contains 'price' or 'cost'",
    action: 'Send pricing PDF + offer demo',
    channel: 'all',
    active: true,
    fired: 412,
  },
  {
    id: 'a3',
    name: 'After-hours auto reply',
    trigger: 'Outside 9am–7pm IST',
    action: 'Reply with hours + capture lead',
    channel: 'all',
    active: true,
    fired: 893,
  },
  {
    id: 'a4',
    name: 'Instagram DM triage',
    trigger: 'Story reply with emoji',
    action: 'Categorize + thank user',
    channel: 'instagram',
    active: true,
    fired: 220,
  },
  {
    id: 'a5',
    name: 'LinkedIn enterprise routing',
    trigger: 'Lead company > 500 employees',
    action: 'Assign to enterprise team',
    channel: 'linkedin',
    active: false,
    fired: 67,
  },
  {
    id: 'a6',
    name: 'Cart abandon nudge',
    trigger: 'No reply for 24h after quote',
    action: 'Send personalized follow-up',
    channel: 'web',
    active: true,
    fired: 156,
  },
];

export const messageVolume = [
  { day: 'Mon', whatsapp: 320, instagram: 180, web: 140, linkedin: 60 },
  { day: 'Tue', whatsapp: 410, instagram: 220, web: 190, linkedin: 80 },
  { day: 'Wed', whatsapp: 380, instagram: 260, web: 170, linkedin: 95 },
  { day: 'Thu', whatsapp: 520, instagram: 240, web: 220, linkedin: 110 },
  { day: 'Fri', whatsapp: 610, instagram: 310, web: 250, linkedin: 130 },
  { day: 'Sat', whatsapp: 480, instagram: 280, web: 200, linkedin: 70 },
  { day: 'Sun', whatsapp: 350, instagram: 210, web: 160, linkedin: 50 },
];

export const leadGrowth = [
  { week: 'W1', leads: 64, converted: 12 },
  { week: 'W2', leads: 92, converted: 21 },
  { week: 'W3', leads: 110, converted: 28 },
  { week: 'W4', leads: 138, converted: 41 },
  { week: 'W5', leads: 165, converted: 53 },
  { week: 'W6', leads: 198, converted: 68 },
];

export const channelShare = [
  { name: 'WhatsApp', value: 42, color: 'oklch(0.74 0.18 155)' },
  { name: 'Instagram', value: 24, color: 'oklch(0.7 0.2 340)' },
  { name: 'Web Chat', value: 18, color: 'oklch(0.74 0.18 195)' },
  { name: 'LinkedIn', value: 10, color: 'oklch(0.74 0.18 230)' },
  { name: 'Facebook', value: 6, color: 'oklch(0.72 0.19 265)' },
];

export const aiActivity = Array.from({ length: 24 }, (_, h) => ({
  hour: `${h}:00`, replies: Math.floor(40 + Math.sin(h / 3) * 30 + Math.random() * 20),
}));

export const channelMeta: Record<Channel, { label: string; color: string; dot: string }> = {
  whatsapp: { label: 'WhatsApp', color: 'text-emerald-300', dot: 'bg-emerald-400' },
  instagram: { label: 'Instagram', color: 'text-pink-300', dot: 'bg-pink-400' },
  facebook: { label: 'Facebook', color: 'text-blue-300', dot: 'bg-blue-400' },
  linkedin: { label: 'LinkedIn', color: 'text-sky-300', dot: 'bg-sky-400' },
  web: { label: 'Web Chat', color: 'text-cyan-300', dot: 'bg-cyan-400' },
};
