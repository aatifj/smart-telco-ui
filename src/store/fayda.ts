import { create } from "zustand";

export type FaydaStatus =
  | "not_started"
  | "submitted"
  | "under_review"
  | "verified"
  | "rejected";

export interface FaydaProfile {
  faydaId: string;
  fullName: string;
  dob: string;
  phone: string;
  email?: string;
  altPhone?: string;
  address?: string;
  /** Mock document upload flag */
  idScanned: boolean;
  selfieDone: boolean;
}

export interface FaydaSubmission {
  ref: string;
  status: FaydaStatus;
  submittedAt: number;
  rejectionReason?: string;
  profile: FaydaProfile;
}

interface FaydaState {
  submission: FaydaSubmission | null;
  submit: (profile: FaydaProfile) => FaydaSubmission;
  reset: () => void;
  /** Demo helper to flip status */
  setStatus: (s: FaydaStatus, reason?: string) => void;
}

function makeRef() {
  return `FYD-${Math.floor(100000 + Math.random() * 900000)}`;
}

export const useFayda = create<FaydaState>((set) => ({
  submission: null,
  submit: (profile) => {
    const sub: FaydaSubmission = {
      ref: makeRef(),
      status: "submitted",
      submittedAt: Date.now(),
      profile,
    };
    set({ submission: sub });
    return sub;
  },
  reset: () => set({ submission: null }),
  setStatus: (s, reason) =>
    set((st) =>
      st.submission
        ? { submission: { ...st.submission, status: s, rejectionReason: reason } }
        : st,
    ),
}));

export const faydaStatusMeta: Record<
  FaydaStatus,
  { label: string; tone: string; emoji: string }
> = {
  not_started: { label: "Not started", tone: "bg-muted text-muted-foreground", emoji: "○" },
  submitted: { label: "Submitted", tone: "bg-info/10 text-info", emoji: "📨" },
  under_review: { label: "Under review", tone: "bg-warning/15 text-warning-foreground", emoji: "🔍" },
  verified: { label: "Verified", tone: "bg-success/15 text-success", emoji: "✅" },
  rejected: { label: "Needs correction", tone: "bg-destructive/10 text-destructive", emoji: "⚠️" },
};
