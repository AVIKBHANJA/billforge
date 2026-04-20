"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@/components/providers";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { EmptyState } from "@/components/ui/empty-state";
import { TextField } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Square } from "lucide-react";
import { toast } from "sonner";

interface TimeEntry {
  id: string;
  description: string | null;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  billable: boolean;
  project: { name: string; client: { name: string } };
}

interface Project {
  id: string;
  name: string;
  client: { name: string };
}

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const formatHours = (seconds: number) => {
  const h = seconds / 3600;
  return `${h.toFixed(1)}h`;
};

export default function TimePage() {
  const { user, loading: authLoading } = useUser();
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [timerProject, setTimerProject] = useState("");
  const [timerDesc, setTimerDesc] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  useEffect(() => {
    if (user) {
      fetchEntries();
      fetch("/api/projects")
        .then((r) => r.json())
        .then((d) => setProjects(d.projects || []))
        .catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/time");
      const data = await res.json();
      setEntries(data.entries || []);
    } catch {
      toast.error("Failed to load entries");
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    startTimeRef.current = new Date();
    setTimerRunning(true);
    setElapsed(0);
    intervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        setElapsed(Math.floor((Date.now() - startTimeRef.current.getTime()) / 1000));
      }
    }, 1000);
  };

  const stopTimer = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerRunning(false);

    if (!startTimeRef.current || !timerProject) {
      toast.error("Pick a project before stopping");
      return;
    }

    try {
      const res = await fetch("/api/time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: timerProject,
          description: timerDesc,
          startTime: startTimeRef.current.toISOString(),
          endTime: new Date().toISOString(),
          duration: elapsed,
          billable: true,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Time logged");
      setElapsed(0);
      setTimerDesc("");
      startTimeRef.current = null;
      fetchEntries();
    } catch {
      toast.error("Couldn't save");
    }
  };

  const totalSeconds = entries.reduce((s, e) => s + (e.duration || 0), 0);
  const billableSeconds = entries
    .filter((e) => e.billable)
    .reduce((s, e) => s + (e.duration || 0), 0);

  if (authLoading) return null;

  return (
    <div className="bg-[var(--color-paper)] min-h-screen">
      <div className="container mx-auto px-6 py-12 max-w-[1200px]">
        <PageHeader
          eyebrow="The studio clock"
          title={<>Time</>}
          description="Hours kept honestly. Bill them when ready."
        />

        {/* Timer */}
        <Panel className={`p-8 mb-8 transition-colors ${timerRunning ? "border-[var(--color-accent)]" : ""}`}>
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6">
            {/* Big clock */}
            <div className="flex items-center gap-5 lg:flex-shrink-0">
              <button
                onClick={timerRunning ? stopTimer : startTimer}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  timerRunning
                    ? "bg-[var(--color-danger)] text-white animate-pulse-ring"
                    : "btn-accent"
                }`}
                aria-label={timerRunning ? "Stop" : "Start"}
              >
                {timerRunning ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
              </button>
              <div>
                <div className="eyebrow !text-[10px]">{timerRunning ? "Recording" : "Timer"}</div>
                <div className={`numeral text-[40px] leading-none mt-1 tabular-nums ${timerRunning ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]"}`}>
                  {formatDuration(elapsed)}
                </div>
              </div>
            </div>

            <div className="hidden lg:block w-px h-14 bg-[var(--color-hairline)]" />

            {/* Inputs */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextField
                placeholder="What's the work?"
                value={timerDesc}
                onChange={(e) => setTimerDesc(e.target.value)}
              />
              <Select value={timerProject} onValueChange={setTimerProject}>
                <SelectTrigger className="field !h-11 !w-full">
                  <SelectValue placeholder={projects.length ? "Project" : "No projects yet"} />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {projects.length === 0 && (
            <div className="mt-4 pt-4 border-t border-[var(--color-hairline)] text-[12px] text-[var(--color-ink-muted)]">
              You&apos;ll need a project before you can log time. Projects are managed under each client.
            </div>
          )}
        </Panel>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <Panel className="p-6">
            <div className="eyebrow">Logged total</div>
            <div className="numeral text-[36px] leading-none mt-3">{formatHours(totalSeconds)}</div>
            <div className="text-[12px] text-[var(--color-ink-subtle)] mt-1">{entries.length} entries</div>
          </Panel>
          <Panel className="p-6">
            <div className="eyebrow">Billable</div>
            <div className="numeral text-[36px] leading-none mt-3">{formatHours(billableSeconds)}</div>
            <div className="text-[12px] text-[var(--color-ink-subtle)] mt-1">Ready to invoice</div>
          </Panel>
          <Panel className="p-6 panel-deep">
            <div className="eyebrow !text-[var(--color-paper)]/60">Non-billable</div>
            <div className="numeral text-[36px] leading-none mt-3 text-[var(--color-paper)]">{formatHours(totalSeconds - billableSeconds)}</div>
            <div className="text-[12px] text-[var(--color-paper)]/50 mt-1">Internal & admin</div>
          </Panel>
        </div>

        {/* Entries */}
        <div>
          <div className="flex items-end justify-between mb-4 pb-4 border-b border-[var(--color-hairline)]">
            <div>
              <div className="eyebrow">Recent</div>
              <h2 className="font-display text-[22px] mt-1">Logged entries</h2>
            </div>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => <div key={i} className="h-16 skeleton rounded-[12px]" />)}
            </div>
          ) : entries.length === 0 ? (
            <EmptyState
              title="No entries yet"
              description="Hit play above to start the clock — or add a manual entry."
            />
          ) : (
            <div className="space-y-2">
              {entries.map((entry) => (
                <Panel
                  key={entry.id}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[var(--color-hairline-strong)]"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className={`w-1.5 h-10 rounded-full ${entry.billable ? "bg-[var(--color-accent)]" : "bg-[var(--color-hairline-strong)]"}`} />
                    <div className="min-w-0">
                      <div className="font-medium text-[14px] truncate">{entry.description || "Untitled work"}</div>
                      <div className="text-[12px] text-[var(--color-ink-subtle)] truncate">
                        {entry.project.client.name} · {entry.project.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 shrink-0">
                    <div className="text-right">
                      <div className="numeral text-[18px] leading-none tabular-nums">
                        {entry.duration ? formatDuration(entry.duration) : "--:--:--"}
                      </div>
                      <div className="text-[11px] text-[var(--color-ink-subtle)] mt-1 tabular-nums">
                        {new Date(entry.startTime).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                      </div>
                    </div>
                    <span className={`pill ${entry.billable ? "pill-paid" : "pill-cancelled"}`}>
                      {entry.billable ? "Billable" : "Internal"}
                    </span>
                  </div>
                </Panel>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
