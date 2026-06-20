"use client";

import type { CSSProperties } from "react";
import type { GameState } from "@/lib/types";

interface VictoryViewProps {
  state: GameState;
  onRematch: () => void;
  onQuit: () => void;
}

const CONFETTI_COLORS = [
  "#38bdf8",
  "#f472b6",
  "#a3e635",
  "#fb923c",
  "#c084fc",
  "#facc15",
  "#34d399",
];

// Deterministic pseudo-random so server and client render identically.
function rand(i: number, seed: number): number {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function Confetti() {
  const pieces = Array.from({ length: 70 }, (_, i) => {
    const style: CSSProperties = {
      left: `${rand(i, 1) * 100}%`,
      width: 6 + rand(i, 5) * 7,
      height: 9 + rand(i, 6) * 8,
      backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      borderRadius: rand(i, 7) > 0.5 ? "9999px" : "2px",
      // Custom props consumed by the confetti-fall keyframes.
      ["--dx" as string]: `${(rand(i, 4) - 0.5) * 180}px`,
      ["--dur" as string]: `${2.6 + rand(i, 3) * 2.2}s`,
      ["--delay" as string]: `${rand(i, 2) * 1.2}s`,
    };
    return (
      <span
        key={i}
        className="confetti-piece absolute top-0 block"
        style={style}
      />
    );
  });

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {pieces}
    </div>
  );
}

export default function VictoryView({
  state,
  onRematch,
  onQuit,
}: VictoryViewProps) {
  const winner = state.players.find((p) => p.id === state.winnerId);
  const ranked = [...state.players].sort((a, b) => b.total - a.total);

  return (
    <div className="relative">
      <Confetti />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-8 pt-12">
        <div className="text-center">
          <div className="animate-bounce-in inline-block text-7xl drop-shadow">
            🏆
          </div>
          <h1 className="animate-rise mt-4 text-3xl font-black">Victoire !</h1>
          {winner && (
            <p
              className="animate-rise mt-2 text-2xl font-bold"
              style={{ color: winner.color, animationDelay: "60ms" }}
            >
              {winner.name}
            </p>
          )}
          <p
            className="animate-rise mt-1 text-sm text-muted"
            style={{ animationDelay: "120ms" }}
          >
            {winner?.total} points · objectif {state.targetScore}
          </p>
        </div>

        <ul className="mt-10 flex flex-1 flex-col gap-2.5">
          {ranked.map((p, rank) => (
            <li
              key={p.id}
              className={`animate-rise flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm ${
                p.id === state.winnerId
                  ? "border-accent bg-accent/10"
                  : "border-border bg-surface"
              }`}
              style={{ animationDelay: `${180 + rank * 70}ms` }}
            >
              <span className="w-6 text-center text-lg font-black text-muted">
                {rank + 1}
              </span>
              <span
                className="h-3.5 w-3.5 shrink-0 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <span className="min-w-0 flex-1 truncate font-semibold">
                {p.name}
              </span>
              <span className="text-xl font-black tabular-nums">{p.total}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={onRematch}
            className="w-full rounded-2xl bg-accent py-4 text-lg font-bold text-on-accent shadow-lg shadow-accent/20 transition-transform active:scale-[0.98]"
          >
            Revanche (mêmes joueurs)
          </button>
          <button
            onClick={onQuit}
            className="w-full rounded-2xl border border-border bg-surface py-4 text-base font-semibold text-foreground shadow-sm transition-transform active:scale-[0.98]"
          >
            Nouvelle partie
          </button>
        </div>
      </div>
    </div>
  );
}
