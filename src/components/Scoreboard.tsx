"use client";

import type { GameState } from "@/lib/types";
import RulesButton from "./Rules";

interface ScoreboardProps {
  state: GameState;
  onNewRound: () => void;
  onQuit: () => void;
}

export default function Scoreboard({
  state,
  onNewRound,
  onQuit,
}: ScoreboardProps) {
  const ranked = [...state.players].sort((a, b) => b.total - a.total);
  const leaderTotal = ranked[0]?.total ?? 0;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-8 pt-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            Flip <span className="text-accent">7</span>
          </h1>
          <p className="text-sm text-muted">
            Manche {state.roundNumber} · objectif {state.targetScore}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RulesButton />
          <button
            onClick={onQuit}
            className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted shadow-sm transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            Quitter
          </button>
        </div>
      </header>

      <ul className="flex flex-1 flex-col gap-3">
        {ranked.map((p, rank) => {
          const pct = Math.min(100, (p.total / state.targetScore) * 100);
          const isLeader = p.total === leaderTotal && p.total > 0;
          return (
            <li
              key={p.id}
              className="animate-rise rounded-2xl border border-border bg-surface p-4 shadow-sm"
              style={{ animationDelay: `${rank * 60}ms` }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold text-black"
                  style={{ backgroundColor: p.color }}
                >
                  {rank + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-lg font-semibold">
                  {p.name}
                  {isLeader && <span className="ml-2">👑</span>}
                </span>
                <span
                  key={p.total}
                  className="animate-pop text-2xl font-black tabular-nums"
                >
                  {p.total}
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: p.color }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <button
        onClick={onNewRound}
        className="mt-6 w-full rounded-2xl bg-accent py-4 text-lg font-bold text-on-accent shadow-lg shadow-accent/20 transition-transform active:scale-[0.98]"
      >
        Nouvelle manche
      </button>
    </div>
  );
}
