import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ChatMessage {
  id: string;
  from: "me" | "peer";
  text: string;
  ts: number;
}

export interface ChatPeer {
  id: string;
  name: string;
  phone: string;
  avatar: string; // emoji
  online: boolean;
}

export interface ChatThread {
  peerId: string;
  messages: ChatMessage[];
  lastReadByMe: number;
}

interface ChatState {
  peers: ChatPeer[];
  threads: Record<string, ChatThread>;
  sendMessage: (peerId: string, text: string) => void;
  markRead: (peerId: string) => void;
  ensureThread: (peerId: string) => void;
  addPeer: (input: { name: string; phone: string; avatar?: string }) => string;
}

const avatarPool = ["🧑🏽", "👩🏽", "🧑🏾", "👩🏾", "🧑🏿", "👨🏽", "👩🏽‍🦱", "🧑🏽‍💼"];

const seedPeers: ChatPeer[] = [
  { id: "p1", name: "Hanna T.", phone: "+251 7•• ••• 221", avatar: "👩🏽", online: true },
  { id: "p2", name: "Dawit M.", phone: "+251 7•• ••• 884", avatar: "🧑🏾", online: false },
  { id: "p3", name: "Mom", phone: "+251 7•• ••• 100", avatar: "👩🏽‍🦱", online: true },
  { id: "p4", name: "Yonas (Work)", phone: "+251 7•• ••• 442", avatar: "🧑🏽‍💻", online: false },
  { id: "p5", name: "Sara A.", phone: "+251 7•• ••• 309", avatar: "👩🏾‍🎓", online: true },
];

const now = Date.now();
const min = 60 * 1000;

const seedThreads: Record<string, ChatThread> = {
  p1: {
    peerId: "p1",
    lastReadByMe: 0,
    messages: [
      { id: "m1", from: "peer", text: "Selam! Did you top up yet?", ts: now - 35 * min },
      { id: "m2", from: "me", text: "Yes, just bought the Weekly Pro 🙌", ts: now - 33 * min },
      { id: "m3", from: "peer", text: "Send me 20 ETB airtime please 🙏", ts: now - 4 * min },
    ],
  },
  p3: {
    peerId: "p3",
    lastReadByMe: now,
    messages: [
      { id: "m1", from: "peer", text: "Call me when free", ts: now - 3 * 60 * min },
      { id: "m2", from: "me", text: "Will do mom ❤️", ts: now - 3 * 60 * min + 30_000 },
    ],
  },
};

export const useChat = create<ChatState>()(
  persist(
    (set, get) => ({
      peers: seedPeers,
      threads: seedThreads,
      addPeer: ({ name, phone, avatar }) => {
        const existing = get().peers.find(
          (p) => p.phone.replace(/\D/g, "").slice(-10) === phone.replace(/\D/g, "").slice(-10),
        );
        if (existing) return existing.id;
        const id = `p${Date.now()}`;
        const newPeer: ChatPeer = {
          id,
          name,
          phone,
          avatar: avatar ?? avatarPool[Math.floor(Math.random() * avatarPool.length)],
          online: false,
        };
        set((s) => ({ peers: [...s.peers, newPeer] }));
        return id;
      },
      ensureThread: (peerId) => {
        if (get().threads[peerId]) return;
        set((s) => ({
          threads: { ...s.threads, [peerId]: { peerId, messages: [], lastReadByMe: Date.now() } },
        }));
      },
      sendMessage: (peerId, text) => {
        const t = text.trim();
        if (!t) return;
        const msg: ChatMessage = {
          id: `m${Date.now()}`,
          from: "me",
          text: t,
          ts: Date.now(),
        };
        set((s) => {
          const existing = s.threads[peerId] ?? { peerId, messages: [], lastReadByMe: Date.now() };
          return {
            threads: {
              ...s.threads,
              [peerId]: { ...existing, messages: [...existing.messages, msg], lastReadByMe: Date.now() },
            },
          };
        });
        // Simulated auto-reply
        setTimeout(() => {
          const replies = [
            "Got it, thanks!",
            "Ok 👍",
            "Sounds good.",
            "Let me check and get back to you.",
            "Amesegenalehu!",
          ];
          const reply: ChatMessage = {
            id: `m${Date.now()}r`,
            from: "peer",
            text: replies[Math.floor(Math.random() * replies.length)],
            ts: Date.now(),
          };
          set((s) => {
            const existing = s.threads[peerId];
            if (!existing) return s;
            return {
              threads: {
                ...s.threads,
                [peerId]: { ...existing, messages: [...existing.messages, reply] },
              },
            };
          });
        }, 1400 + Math.random() * 1200);
      },
      markRead: (peerId) =>
        set((s) => {
          const t = s.threads[peerId];
          if (!t) return s;
          return { threads: { ...s.threads, [peerId]: { ...t, lastReadByMe: Date.now() } } };
        }),
    }),
    { name: "saf-chat-v1" },
  ),
);

export function formatChatTime(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "now";
  if (diff < 60 * 60_000) return `${Math.floor(diff / 60_000)}m`;
  if (diff < 24 * 60 * 60_000) return `${Math.floor(diff / (60 * 60_000))}h`;
  return new Date(ts).toLocaleDateString();
}
