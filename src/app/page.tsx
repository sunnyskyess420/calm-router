"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Zap,
  Brain,
  AlertTriangle,
  Heart,
  Sun,
  Star,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  History,
  Sparkles,
  Clock,
  TrendingUp,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { SKILLS, MOOD_TIER_MAP, type Skill } from "@/lib/skills-data";
import { useCopingStore } from "@/lib/store";

// ─── Types ───────────────────────────────────────────────────────────────
type View = "checkin" | "recommendations" | "skill-detail" | "breathing" | "grounding" | "rating" | "insights";

// ─── Constants ────────────────────────────────────────────────────────────
const MOODS = [
  { id: "overwhelmed", label: "Overwhelmed", emoji: "🌊", color: "bg-red-50 border-red-200 hover:bg-red-100 text-red-800", desc: "Too much — need immediate relief" },
  { id: "anxious", label: "Anxious", emoji: "⚡", color: "bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-800", desc: "Rising worry or panic" },
  { id: "scattered", label: "Scattered", emoji: "🌀", color: "bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-800", desc: "Unfocused, racing thoughts" },
  { id: "exhausted", label: "Exhausted", emoji: "🔋", color: "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800", desc: "Drained, low energy" },
  { id: "low", label: "Low / Sad", emoji: "🌧️", color: "bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-800", desc: "Down, need comfort" },
  { id: "fine", label: "Fine", emoji: "🌿", color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100 text-emerald-800", desc: "Okay, want to maintain" },
];

const TIER_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  QUICK_STARTERS: { label: "Quick Starters", icon: <Zap className="w-4 h-4" />, color: "text-amber-600", bgColor: "bg-amber-50" },
  MAIN_REGULATION: { label: "Main Regulation", icon: <Brain className="w-4 h-4" />, color: "text-violet-600", bgColor: "bg-violet-50" },
  EMERGENCY_RESET: { label: "Emergency Reset", icon: <AlertTriangle className="w-4 h-4" />, color: "text-red-600", bgColor: "bg-red-50" },
  COMFORT_PICKS: { label: "Comfort Picks", icon: <Heart className="w-4 h-4" />, color: "text-pink-600", bgColor: "bg-pink-50" },
  DAILY_MAINTENANCE: { label: "Daily Maintenance", icon: <Sun className="w-4 h-4" />, color: "text-emerald-600", bgColor: "bg-emerald-50" },
};

const MOOD_LABELS: Record<string, string> = {
  overwhelmed: "Overwhelmed", anxious: "Anxious", scattered: "Scattered",
  exhausted: "Exhausted", low: "Low / Sad", fine: "Fine",
};

// ─── Breathing Exercise ────────────────────────────────────────────────────
function BreathingExercise({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "holdEmpty">("inhale");
  const [count, setCount] = useState(4);
  const [cycles, setCycles] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useState(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          setPhase((p) => {
            if (p === "inhale") return "hold";
            if (p === "hold") return "exhale";
            if (p === "exhale") return "holdEmpty";
            return "inhale";
          });
          setPhase((currentPhase) => {
            if (currentPhase === "holdEmpty") {
              setCycles((c) => {
                if (c >= 3) { setIsRunning(false); return c; }
                return c + 1;
              });
            }
            return currentPhase;
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  });

  const phaseLabel = phase === "inhale" ? "Inhale" : phase === "hold" ? "Hold" : phase === "exhale" ? "Exhale" : "Hold";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground mb-1">Box Breathing</p>
        <p className="text-xs text-muted-foreground">Cycle {cycles + 1} of 4</p>
      </div>

      <motion.div
        animate={{ scale: phase === "inhale" ? 1.3 : phase === "exhale" ? 0.7 : 1 }}
        transition={{ duration: (phase === "inhale" || phase === "exhale") ? 4 : 0.5, ease: "easeInOut" }}
        className="w-40 h-40 rounded-full flex items-center justify-center"
        style={{
          background: phase === "inhale"
            ? "radial-gradient(circle, rgba(16,185,129,0.3), rgba(16,185,129,0.1))"
            : phase === "exhale"
            ? "radial-gradient(circle, rgba(16,185,129,0.1), rgba(16,185,129,0.05))"
            : "radial-gradient(circle, rgba(16,185,129,0.2), rgba(16,185,129,0.1))",
          border: "2px solid rgba(16,185,129,0.4)",
        }}
      >
        <div className="text-center">
          <motion.p key={phase} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold text-emerald-700">
            {phaseLabel}
          </motion.p>
          <p className="text-5xl font-bold text-emerald-600 mt-2">{count}</p>
        </div>
      </motion.div>

      <p className="text-sm text-muted-foreground text-center max-w-xs">
        {phase === "inhale" && "Breathe in slowly through your nose..."}
        {phase === "hold" && "Hold your breath gently..."}
        {phase === "exhale" && "Release slowly through your mouth..."}
        {phase === "holdEmpty" && "Rest before the next cycle..."}
      </p>

      {!isRunning && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Button onClick={onComplete} size="lg" className="rounded-full px-8">
            <CheckCircle2 className="w-5 h-5 mr-2" /> Done — I feel calmer
          </Button>
        </motion.div>
      )}

      {isRunning && (
        <Button variant="ghost" size="sm" onClick={() => setIsRunning(false)} className="text-muted-foreground">
          Skip exercise
        </Button>
      )}
    </div>
  );
}

// ─── 5-4-3-2-1 Grounding Exercise ─────────────────────────────────────────
function GroundingExercise({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [items, setItems] = useState<string[]>([]);

  const steps = [
    { sense: "5 things you can SEE", prompt: "Look around. Name 5 things you can see.", count: 5 },
    { sense: "4 things you can TOUCH", prompt: "Reach out. Name 4 things you can physically feel.", count: 4 },
    { sense: "3 things you can HEAR", prompt: "Listen. Name 3 things you can hear right now.", count: 3 },
    { sense: "2 things you can SMELL", prompt: "Breathe in. Name 2 things you can smell.", count: 2 },
    { sense: "1 thing you can TASTE", prompt: "Notice. Name 1 thing you can taste.", count: 1 },
  ];

  const currentStep = steps[step];
  const progress = (step / steps.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 max-w-md mx-auto">
      <div className="w-full">
        <Progress value={progress} className="h-2 mb-4" />
        <p className="text-xs text-muted-foreground text-center">Step {step + 1} of 5</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="text-center w-full">
          <Badge variant="outline" className="mb-4 text-xs">{currentStep.sense}</Badge>
          <h3 className="text-xl font-semibold mb-6">{currentStep.prompt}</h3>

          <div className="space-y-3 mb-6">
            {items.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 bg-muted/50 rounded-lg px-4 py-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-sm">{item}</span>
              </motion.div>
            ))}
            {items.length < currentStep.count && (
              <input
                autoFocus
                className="w-full bg-background border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                placeholder={`Name something... (${items.length + 1}/${currentStep.count})`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) {
                    setItems([...items, (e.target as HTMLInputElement).value.trim()]);
                    (e.target as HTMLInputElement).value = "";
                  }
                }}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-3">
        {step > 0 && (
          <Button variant="outline" onClick={() => { setStep(step - 1); setItems([]); }}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        )}
        {items.length >= currentStep.count && step < steps.length - 1 && (
          <Button onClick={() => { setStep(step + 1); setItems([]); }}>
            Next <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        )}
        {items.length >= currentStep.count && step === steps.length - 1 && (
          <Button onClick={onComplete}>
            <CheckCircle2 className="w-4 h-4 mr-1" /> Complete
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Main App Component ──────────────────────────────────────────────────
export default function CopingApp() {
  const [view, setView] = useState<View>("checkin");
  const [currentMood, setCurrentMood] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [rating, setRating] = useState(0);
  const [recommended, setRecommended] = useState<Skill[]>([]);

  const sessions = useCopingStore((s) => s.sessions);
  const addSession = useCopingStore((s) => s.addSession);
  const addSkillRecord = useCopingStore((s) => s.addSkillRecord);
  const rateSkill = useCopingStore((s) => s.rateSkill);

  // Compute top skills for the current mood based on history
  const topSkillsForMood = useMemo(() => {
    if (!currentMood) return null;
    const moodSessions = sessions.filter((s) => s.mood === currentMood);
    const skillRatings: Record<string, { name: string; tier: string; total: number; count: number }> = {};
    for (const session of moodSessions) {
      for (const sr of session.skillRecords) {
        if (sr.rating) {
          if (!skillRatings[sr.skillId]) {
            skillRatings[sr.skillId] = { name: sr.skillName, tier: sr.skillTier, total: 0, count: 0 };
          }
          skillRatings[sr.skillId].total += sr.rating;
          skillRatings[sr.skillId].count += 1;
        }
      }
    }
    const top = Object.entries(skillRatings)
      .map(([id, data]) => ({
        id,
        name: data.name,
        tier: data.tier,
        avgRating: Math.round((data.total / data.count) * 10) / 10,
        count: data.count,
      }))
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 3);
    return top.length > 0 ? top : null;
  }, [currentMood, sessions]);

  // Compute insights data
  const insights = useMemo(() => {
    const totalSessions = sessions.length;
    const moodCounts: Record<string, number> = {};
    const skillStats: Record<string, { name: string; tier: string; icon: string; totalRating: number; count: number }> = {};

    for (const session of sessions) {
      moodCounts[session.mood] = (moodCounts[session.mood] || 0) + 1;
      for (const sr of session.skillRecords) {
        if (sr.rating) {
          if (!skillStats[sr.skillId]) {
            const skill = SKILLS.find((s) => s.id === sr.skillId);
            skillStats[sr.skillId] = {
              name: sr.skillName,
              tier: sr.skillTier,
              icon: skill?.icon || "Sparkles",
              totalRating: 0,
              count: 0,
            };
          }
          skillStats[sr.skillId].totalRating += sr.rating;
          skillStats[sr.skillId].count += 1;
        }
      }
    }

    const topSkills = Object.entries(skillStats)
      .map(([id, data]) => ({
        id,
        name: data.name,
        tier: data.tier,
        icon: data.icon,
        avgRating: Math.round((data.totalRating / data.count) * 10) / 10,
        timesUsed: data.count,
      }))
      .sort((a, b) => b.avgRating - a.avgRating);

    // Best skill per mood
    const moodBestSkill: Record<string, { name: string; avgRating: number; tier: string }> = {};
    const moodSkillStats: Record<string, Record<string, { name: string; tier: string; total: number; count: number }>> = {};

    for (const session of sessions) {
      if (!moodSkillStats[session.mood]) moodSkillStats[session.mood] = {};
      for (const sr of session.skillRecords) {
        if (sr.rating) {
          if (!moodSkillStats[session.mood][sr.skillId]) {
            moodSkillStats[session.mood][sr.skillId] = { name: sr.skillName, tier: sr.skillTier, total: 0, count: 0 };
          }
          moodSkillStats[session.mood][sr.skillId].total += sr.rating;
          moodSkillStats[session.mood][sr.skillId].count += 1;
        }
      }
    }

    for (const [mood, skills] of Object.entries(moodSkillStats)) {
      const best = Object.entries(skills)
        .map(([, data]) => ({ name: data.name, avgRating: Math.round((data.total / data.count) * 10) / 10, tier: data.tier }))
        .sort((a, b) => b.avgRating - a.avgRating)[0];
      if (best) moodBestSkill[mood] = best;
    }

    const recentSessions = sessions.slice(0, 15).map((s) => ({
      id: s.id, mood: s.mood, date: s.createdAt,
      skills: s.skillRecords.map((sr) => ({ name: sr.skillName, tier: sr.skillTier, rating: sr.rating })),
    }));

    return { totalSessions, moodCounts, topSkills, moodBestSkill, recentSessions };
  }, [sessions]);

  const handleCheckin = useCallback((mood: string) => {
    setCurrentMood(mood);
    const tiers = MOOD_TIER_MAP[mood] || ["QUICK_STARTERS"];
    const eligible = SKILLS.filter((s) => tiers.includes(s.tier));
    const primary = eligible.filter((s) => s.tier === tiers[0]).sort(() => Math.random() - 0.5);
    const secondary = eligible.filter((s) => s.tier === tiers[1]).sort(() => Math.random() - 0.5);
    const picks = [...primary.slice(0, 2), ...secondary.slice(0, 1)];
    setRecommended(picks);
    const newSessionId = addSession(mood);
    setSessionId(newSessionId);
    setView("recommendations");
  }, [addSession]);

  const handleSkillSelect = useCallback((skill: Skill) => {
    setSelectedSkill(skill);
    addSkillRecord(sessionId, { skillId: skill.id, skillName: skill.name, skillTier: skill.tier, rating: null });
    if (skill.name === "Box Breathing" || skill.name === "Extended Exhale Breathing") {
      setView("breathing");
    } else if (skill.name === "5-4-3-2-1 Sensory Grounding" || skill.name === "Name 5 Things You See") {
      setView("grounding");
    } else {
      setView("skill-detail");
    }
  }, [sessionId, addSkillRecord]);

  const handleSkillComplete = useCallback((starRating: number) => {
    setRating(starRating);
    if (selectedSkill && starRating > 0) {
      rateSkill(sessionId, selectedSkill.id, starRating);
    }
    setView("rating");
  }, [sessionId, selectedSkill, rateSkill]);

  const handleDone = useCallback(() => {
    setView("checkin");
    setSelectedSkill(null);
    setRating(0);
    setSessionId("");
    setCurrentMood("");
    setRecommended([]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-stone-200/60">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            <h1 className="font-semibold text-stone-800">Calm Router</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setView("insights")} className="text-stone-500">
              <History className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        <AnimatePresence mode="wait">
          {/* ─── Check-In View ────────────────────────────── */}
          {view === "checkin" && (
            <motion.div key="checkin" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <div className="text-center pt-8 pb-4">
                <h2 className="text-2xl font-bold text-stone-800 mb-2">How are you right now?</h2>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                  Tap what matches your current state. We&apos;ll match you with the right coping skill from the menu.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MOODS.map((mood, i) => (
                  <motion.button
                    key={mood.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleCheckin(mood.id)}
                    className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 ${mood.color}`}
                  >
                    <span className="text-2xl mb-2 block">{mood.emoji}</span>
                    <p className="font-semibold text-base">{mood.label}</p>
                    <p className="text-xs mt-1 opacity-70">{mood.desc}</p>
                  </motion.button>
                ))}
              </div>
              <div className="text-center pt-4">
                <Button variant="outline" onClick={() => setView("insights")} className="text-stone-500">
                  <TrendingUp className="w-4 h-4 mr-2" /> View My Insights
                </Button>
              </div>
            </motion.div>
          )}

          {/* ─── Recommendations View ─────────────────────── */}
          {view === "recommendations" && (
            <motion.div key="recs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setView("checkin")}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <p className="text-sm text-muted-foreground">You&apos;re feeling</p>
                  <h2 className="text-xl font-bold text-stone-800">{MOOD_LABELS[currentMood]}</h2>
                </div>
              </div>

              {topSkillsForMood && (
                <Card className="border-emerald-200 bg-emerald-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" /> Skills that work for you
                    </CardTitle>
                    <CardDescription className="text-xs">Based on your past ratings when feeling {MOOD_LABELS[currentMood]?.toLowerCase()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {topSkillsForMood.map((s, i) => (
                        <Badge key={s.id} variant="secondary" className="text-xs bg-emerald-100 text-emerald-800">
                          {i + 1}. {s.name} <Star className="w-3 h-3 ml-1 fill-amber-400 text-amber-400" /> {s.avgRating}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div>
                <p className="text-sm font-medium text-stone-600 mb-3">Recommended for you</p>
                <div className="space-y-3">
                  {recommended.map((skill, i) => {
                    const tier = TIER_CONFIG[skill.tier];
                    return (
                      <motion.div key={skill.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className="cursor-pointer hover:shadow-md transition-shadow border-stone-200" onClick={() => handleSkillSelect(skill)}>
                          <CardContent className="flex items-start gap-4 p-4">
                            <div className={`w-10 h-10 rounded-lg ${tier.bgColor} flex items-center justify-center shrink-0`}>{tier.icon}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-sm text-stone-800">{skill.name}</p>
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">{tier.label}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">{skill.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{skill.duration}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-2" />
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Skill Detail View ───────────────────────── */}
          {view === "skill-detail" && selectedSkill && (
            <motion.div key="detail" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setView("recommendations")}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{TIER_CONFIG[selectedSkill.tier]?.label}</p>
                  <h2 className="text-xl font-bold text-stone-800">{selectedSkill.name}</h2>
                </div>
                <Badge variant="outline" className="text-xs"><Clock className="w-3 h-3 mr-1" /> {selectedSkill.duration}</Badge>
              </div>
              <Card className="border-stone-200">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-6">{selectedSkill.description}</p>
                  <Separator className="mb-6" />
                  <h3 className="font-semibold text-sm mb-4">How to do this:</h3>
                  <div className="space-y-3">
                    {selectedSkill.instructions.split("\n").map((step, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex gap-3 items-start">
                        <span className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-xs font-semibold text-stone-500 shrink-0 mt-0.5">{i + 1}</span>
                        <p className="text-sm text-stone-700 leading-relaxed">{step.replace(/^\d+\.\s*/, "")}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-center">
                <Button size="lg" onClick={() => setView("rating")} className="rounded-full px-8">
                  <CheckCircle2 className="w-5 h-5 mr-2" /> I did it — rate how you feel
                </Button>
              </div>
            </motion.div>
          )}

          {/* ─── Breathing Exercise View ──────────────────── */}
          {view === "breathing" && (
            <motion.div key="breathing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex items-center gap-3 mb-4">
                <Button variant="ghost" size="icon" onClick={() => setView("recommendations")}><ArrowLeft className="w-4 h-4" /></Button>
                <h2 className="text-lg font-bold text-stone-800">{selectedSkill?.name || "Breathing Exercise"}</h2>
              </div>
              <BreathingExercise onComplete={() => handleSkillComplete(0)} />
            </motion.div>
          )}

          {/* ─── Grounding Exercise View ──────────────────── */}
          {view === "grounding" && (
            <motion.div key="grounding" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex items-center gap-3 mb-4">
                <Button variant="ghost" size="icon" onClick={() => setView("recommendations")}><ArrowLeft className="w-4 h-4" /></Button>
                <h2 className="text-lg font-bold text-stone-800">{selectedSkill?.name || "Grounding Exercise"}</h2>
              </div>
              <GroundingExercise onComplete={() => handleSkillComplete(0)} />
            </motion.div>
          )}

          {/* ─── Rating View ──────────────────────────────── */}
          {view === "rating" && (
            <motion.div key="rating" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">You used</p>
                <h2 className="text-xl font-bold text-stone-800">{selectedSkill?.name}</h2>
              </div>
              <div className="text-center space-y-4">
                <p className="text-sm font-medium text-stone-600">{rating > 0 ? "How do you feel now?" : "How do you feel after this?"}</p>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button key={star} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => handleSkillComplete(star)} className="focus:outline-none">
                      <Star className={`w-10 h-10 transition-colors ${star <= (rating || 0) ? "fill-amber-400 text-amber-400" : "text-stone-300 hover:text-amber-300"}`} />
                    </motion.button>
                  ))}
                </div>
                {rating > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p className="text-sm text-muted-foreground">
                      {rating <= 2 ? "Hang in there. Another skill might help more." : rating <= 3 ? "Some improvement. Keep exploring what works." : rating <= 4 ? "Nice! This skill seems effective for you." : "Excellent! This is a go-to skill for you."}
                    </p>
                  </motion.div>
                )}
              </div>
              {rating > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                  <Button variant="outline" onClick={() => { setRating(0); setView("recommendations"); }}>Try another skill</Button>
                  <Button onClick={handleDone}>Done for now</Button>
                </motion.div>
              )}
              {rating === 0 && (
                <Button variant="ghost" onClick={handleDone} className="text-muted-foreground">Skip rating</Button>
              )}
            </motion.div>
          )}

          {/* ─── Insights View ────────────────────────────── */}
          {view === "insights" && (
            <motion.div key="insights" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setView("checkin")}><ArrowLeft className="w-4 h-4" /></Button>
                <div>
                  <h2 className="text-xl font-bold text-stone-800">Your Insights</h2>
                  <p className="text-sm text-muted-foreground">What&apos;s working for you</p>
                </div>
              </div>

              {insights.totalSessions === 0 ? (
                <Card className="border-stone-200">
                  <CardContent className="flex flex-col items-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4"><BarChart3 className="w-8 h-8 text-stone-400" /></div>
                    <h3 className="font-semibold text-stone-700 mb-2">No data yet</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">Complete a few check-ins and rate your skills to see personalized insights here.</p>
                    <Button className="mt-6" onClick={() => setView("checkin")}>Start a check-in</Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <Card className="border-stone-200"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-stone-800">{insights.totalSessions}</p><p className="text-xs text-muted-foreground">Sessions</p></CardContent></Card>
                    <Card className="border-stone-200"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-stone-800">{insights.topSkills.length}</p><p className="text-xs text-muted-foreground">Skills tried</p></CardContent></Card>
                    <Card className="border-stone-200"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-stone-800">{Object.keys(insights.moodCounts).length}</p><p className="text-xs text-muted-foreground">Moods tracked</p></CardContent></Card>
                  </div>

                  <Tabs defaultValue="top-skills" className="w-full">
                    <TabsList className="w-full bg-stone-100">
                      <TabsTrigger value="top-skills" className="flex-1 text-xs">Top Skills</TabsTrigger>
                      <TabsTrigger value="mood-map" className="flex-1 text-xs">Mood Map</TabsTrigger>
                      <TabsTrigger value="history" className="flex-1 text-xs">History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="top-skills" className="space-y-3 mt-4">
                      <p className="text-xs text-muted-foreground mb-2">Your highest-rated skills across all sessions</p>
                      {insights.topSkills.slice(0, 10).map((skill, i) => {
                        const tier = TIER_CONFIG[skill.tier];
                        return (
                          <motion.div key={skill.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                            <Card className="border-stone-200">
                              <CardContent className="flex items-center gap-3 p-3">
                                <span className="text-lg font-bold text-stone-300 w-6">#{i + 1}</span>
                                <div className={`w-8 h-8 rounded-lg ${tier.bgColor} flex items-center justify-center shrink-0`}>{tier.icon}</div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-stone-800 truncate">{skill.name}</p>
                                  <p className="text-xs text-muted-foreground">Used {skill.timesUsed}x</p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span className="text-sm font-semibold text-stone-700">{skill.avgRating}</span>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </TabsContent>

                    <TabsContent value="mood-map" className="space-y-3 mt-4">
                      <p className="text-xs text-muted-foreground mb-2">Your best skill for each mood</p>
                      {Object.entries(insights.moodBestSkill).map(([mood, data]) => {
                        const moodInfo = MOODS.find((m) => m.id === mood);
                        const tier = TIER_CONFIG[data.tier];
                        return (
                          <Card key={mood} className="border-stone-200">
                            <CardContent className="flex items-center gap-3 p-3">
                              <span className="text-xl">{moodInfo?.emoji}</span>
                              <div className="flex-1">
                                <p className="text-xs text-muted-foreground">{MOOD_LABELS[mood] || mood}</p>
                                <p className="text-sm font-medium text-stone-800">{data.name}</p>
                              </div>
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${tier.bgColor}`}>
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span className="text-xs font-semibold">{data.avgRating}</span>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </TabsContent>

                    <TabsContent value="history" className="space-y-3 mt-4">
                      <p className="text-xs text-muted-foreground mb-2">Recent sessions</p>
                      <ScrollArea className="h-[400px]">
                        {insights.recentSessions.map((session) => (
                          <Card key={session.id} className="border-stone-200 mb-2">
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{MOODS.find((m) => m.id === session.mood)?.emoji}</span>
                                  <span className="text-sm font-medium">{MOOD_LABELS[session.mood] || session.mood}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">{new Date(session.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {session.skills.map((s, i) => (
                                  <Badge key={i} variant="outline" className="text-[10px]">
                                    {s.name}
                                    {s.rating && <Star className="w-2 h-2 ml-1 fill-amber-400 text-amber-400" />}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </>
              )}

              <div className="text-center pt-4">
                <Button variant="outline" onClick={() => setView("checkin")}>Start a new check-in</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-auto py-4 text-center">
        <p className="text-xs text-stone-400">Based on the Coping Skills Menu — 25 skills across 5 tiers</p>
      </footer>
    </div>
  );
}
