import { create } from "zustand";

export type IssueType = "voice" | "data" | "sms";
export type IssueStatus = "submitted" | "in_progress" | "resolved";

export interface ReportedIssue {
  id: string;
  ref: string;
  type: IssueType;
  description: string;
  location: string;
  when: "now" | "earlier";
  callback: boolean;
  callbackNumber?: string;
  callbackSlot?: string;
  status: IssueStatus;
  createdAt: number;
}

interface IssuesState {
  issues: ReportedIssue[];
  addIssue: (i: Omit<ReportedIssue, "id" | "ref" | "status" | "createdAt">) => ReportedIssue;
}

function makeRef() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `SC-${n}`;
}

export const useIssues = create<IssuesState>((set, get) => ({
  issues: [
    {
      id: "seed-1",
      ref: "SC-481223",
      type: "data",
      description: "Slow browsing in the evenings",
      location: "Bole, Addis Ababa",
      when: "earlier",
      callback: false,
      status: "in_progress",
      createdAt: Date.now() - 1000 * 60 * 60 * 18,
    },
  ],
  addIssue: (i) => {
    const issue: ReportedIssue = {
      ...i,
      id: crypto.randomUUID(),
      ref: makeRef(),
      status: "submitted",
      createdAt: Date.now(),
    };
    set({ issues: [issue, ...get().issues] });
    return issue;
  },
}));

export const issueMeta: Record<IssueType, { label: string; emoji: string; tone: string }> = {
  voice: { label: "Voice Issue", emoji: "📞", tone: "bg-info/10 text-info" },
  data: { label: "Data Issue", emoji: "🌐", tone: "bg-primary/10 text-primary" },
  sms: { label: "SMS Issue", emoji: "💬", tone: "bg-warning/15 text-warning-foreground" },
};
