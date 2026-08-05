import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SessionRecord {
  id: string;
  mood: string;
  createdAt: string;
  skillRecords: SkillRecord[];
}

export interface SkillRecord {
  skillId: string;
  skillName: string;
  skillTier: string;
  rating: number | null;
}

interface CopingStore {
  sessions: SessionRecord[];
  addSession: (mood: string) => string;
  addSkillRecord: (sessionId: string, record: SkillRecord) => void;
  rateSkill: (sessionId: string, skillId: string, rating: number) => void;
  clearAll: () => void;
}

export const useCopingStore = create<CopingStore>()(
  persist(
    (set, get) => ({
      sessions: [],

      addSession: (mood: string) => {
        const id = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const newSession: SessionRecord = {
          id,
          mood,
          createdAt: new Date().toISOString(),
          skillRecords: [],
        };
        set((state) => ({ sessions: [newSession, ...state.sessions] }));
        return id;
      },

      addSkillRecord: (sessionId: string, record: SkillRecord) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId ? { ...s, skillRecords: [...s.skillRecords, record] } : s
          ),
        }));
      },

      rateSkill: (sessionId: string, skillId: string, rating: number) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  skillRecords: s.skillRecords.map((sr) =>
                    sr.skillId === skillId ? { ...sr, rating } : sr
                  ),
                }
              : s
          ),
        }));
      },

      clearAll: () => set({ sessions: [] }),
    }),
    {
      name: "calm-router-storage",
    }
  )
);
