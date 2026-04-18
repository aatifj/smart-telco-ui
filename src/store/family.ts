import { create } from "zustand";

export interface FamilyMember {
  id: string;
  nickname: string;
  phone: string;
  avatarColor: string;
  dataUsedGb: number;
  dataLimitGb: number;
  voiceUsedMin: number;
  voiceLimitMin: number;
  smsUsed: number;
  smsLimit: number;
  lastActive: string;
}

const palette = [
  "bg-primary/15 text-primary",
  "bg-info/15 text-info",
  "bg-warning/20 text-warning-foreground",
  "bg-accent text-accent-foreground",
  "bg-destructive/15 text-destructive",
];

const seed: FamilyMember[] = [
  { id: "m1", nickname: "Sara (Wife)", phone: "+251 9•• ••• 220", avatarColor: palette[0], dataUsedGb: 3.2, dataLimitGb: 5, voiceUsedMin: 42, voiceLimitMin: 100, smsUsed: 12, smsLimit: 50, lastActive: "2h ago" },
  { id: "m2", nickname: "Ali (Son)", phone: "+251 9•• ••• 318", avatarColor: palette[1], dataUsedGb: 4.6, dataLimitGb: 5, voiceUsedMin: 18, voiceLimitMin: 60, smsUsed: 4, smsLimit: 30, lastActive: "12m ago" },
  { id: "m3", nickname: "Fatima (Daughter)", phone: "+251 9•• ••• 904", avatarColor: palette[2], dataUsedGb: 0.8, dataLimitGb: 3, voiceUsedMin: 6, voiceLimitMin: 40, smsUsed: 0, smsLimit: 20, lastActive: "Yesterday" },
  { id: "m4", nickname: "Dad", phone: "+251 9•• ••• 071", avatarColor: palette[3], dataUsedGb: 1.1, dataLimitGb: 4, voiceUsedMin: 88, voiceLimitMin: 120, smsUsed: 22, smsLimit: 60, lastActive: "5h ago" },
];

interface FamilyState {
  created: boolean;
  familyName: string;
  members: FamilyMember[];
  createFamily: (name?: string) => void;
  addMember: (m: { nickname: string; phone: string }) => void;
  removeMember: (id: string) => void;
  topUpMember: (id: string, dataGb: number, voiceMin: number) => void;
}

export const useFamily = create<FamilyState>((set) => ({
  created: true, // pre-seeded for demo
  familyName: "Tesfaye Family",
  members: seed,
  createFamily: (name) => set({ created: true, familyName: name?.trim() || "My Family", members: [] }),
  addMember: ({ nickname, phone }) =>
    set((s) => ({
      members: [
        ...s.members,
        {
          id: `m${Date.now()}`,
          nickname: nickname.trim() || "Member",
          phone,
          avatarColor: palette[s.members.length % palette.length],
          dataUsedGb: 0,
          dataLimitGb: 0,
          voiceUsedMin: 0,
          voiceLimitMin: 0,
          smsUsed: 0,
          smsLimit: 0,
          lastActive: "Just now",
        },
      ],
    })),
  removeMember: (id) => set((s) => ({ members: s.members.filter((m) => m.id !== id) })),
  topUpMember: (id, dataGb, voiceMin) =>
    set((s) => ({
      members: s.members.map((m) =>
        m.id === id
          ? { ...m, dataLimitGb: m.dataLimitGb + dataGb, voiceLimitMin: m.voiceLimitMin + voiceMin }
          : m,
      ),
    })),
}));

export function memberInitials(name: string) {
  return name
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
