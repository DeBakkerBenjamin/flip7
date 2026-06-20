"use client";

import { useState } from "react";
import { emptyHand, type GameState, type RoundHand } from "@/lib/types";
import { isFlip7, scoreHand } from "@/lib/scoring";
import PlayerCardPad from "./PlayerCardPad";

interface RoundLiveProps {
  state: GameState;
  onCommit: (roundScores: Record<string, number>) => void;
  onCancel: () => void;
}

/** A player is done for the round when busted, stayed/frozen, or at Flip 7. */
function isResolved(h: RoundHand): boolean {
  return !!h.busted || !!h.stayed || isFlip7(h);
}

export default function RoundLive({
  state,
  onCommit,
  onCancel,
}: RoundLiveProps) {
  const players = state.players;
  const [hands, setHands] = useState<RoundHand[]>(() =>
    players.map(() => emptyHand()),
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const inPlay = hands.filter((h) => !isResolved(h)).length;

  /** Index of the next still-playing player after `from` (cycling). */
  function nextActive(arr: RoundHand[], from: number): number {
    for (let k = 1; k <= arr.length; k++) {
      const j = (from + k) % arr.length;
      if (!isResolved(arr[j])) return j;
    }
    return from;
  }

  function handlePad(i: number, newHand: RoundHand) {
    const arr = hands.map((h, idx) => (idx === i ? newHand : h));
    setHands(arr);
    // Auto-advance to the next player once this one busts or hits Flip 7.
    if (!isResolved(hands[i]) && isResolved(newHand)) {
      setActiveIndex(nextActive(arr, i));
    }
  }

  function stay(i: number) {
    const arr = hands.map((h, idx) =>
      idx === i ? { ...h, stayed: true } : h,
    );
    setHands(arr);
    setActiveIndex(nextActive(arr, i));
  }

  function resume(i: number) {
    setHands((prev) =>
      prev.map((h, idx) =>
        idx === i
          ? { ...h, stayed: false, busted: false, bustOn: undefined }
          : h,
      ),
    );
    setActiveIndex(i);
  }

  function commit() {
    const scores: Record<string, number> = {};
    players.forEach((p, i) => {
      scores[p.id] = scoreHand(hands[i]);
    });
    onCommit(scores);
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-8 pt-8">
      <header className="mb-4 flex items-center justify-between">
        <button
          onClick={onCancel}
          className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted shadow-sm transition-colors hover:text-foreground"
        >
          Annuler
        </button>
        <span className="text-sm font-medium text-muted">
          Manche {state.roundNumber}
        </span>
        <span className="text-sm font-semibold tabular-nums">
          {inPlay > 0 ? `${inPlay} en jeu` : "terminé"}
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-3">
        {players.map((p, i) => {
          const h = hands[i];
          const flip7 = isFlip7(h);
          const score = scoreHand(h);
          const expanded = i === activeIndex && !h.busted && !h.stayed;

          // ── Expanded: full card pad for the active player ──────────────
          if (expanded) {
            return (
              <div key={p.id}>
                <PlayerCardPad
                  player={p}
                  hand={h}
                  mode="live"
                  onChange={(nh) => handlePad(i, nh)}
                />
                {!flip7 && (
                  <button
                    onClick={() => stay(i)}
                    className="mt-2 w-full rounded-2xl border border-emerald-300 bg-emerald-50 py-3 text-sm font-bold text-emerald-700 transition-transform active:scale-[0.98]"
                  >
                    ✋ Rester · garder {score} {score > 1 ? "points" : "point"}
                  </button>
                )}
              </div>
            );
          }

          // ── Collapsed: compact status row ──────────────────────────────
          const status = h.busted
            ? { label: "💥 Busté", cls: "text-red-600" }
            : h.stayed
              ? { label: "✓ Resté", cls: "text-emerald-600" }
              : flip7
                ? { label: "✨ Flip 7", cls: "text-accent" }
                : { label: "En jeu", cls: "text-muted" };

          return (
            <div
              key={p.id}
              className="animate-rise rounded-2xl border border-border bg-surface p-3.5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3.5 w-3.5 shrink-0 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                <span className="min-w-0 flex-1 truncate font-semibold">
                  {p.name}
                </span>
                <span className={`text-xs font-bold ${status.cls}`}>
                  {status.label}
                </span>
                <span
                  className={`w-10 text-right text-xl font-black tabular-nums ${
                    h.busted ? "text-red-500" : "text-foreground"
                  }`}
                >
                  {h.busted ? "0" : score}
                </span>
              </div>

              {/* Collected cards preview */}
              {h.numbers.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {[...h.numbers].sort((a, b) => a - b).map((n) => (
                    <span
                      key={n}
                      className="grid h-6 w-6 place-items-center rounded-md bg-surface-2 text-xs font-bold tabular-nums"
                    >
                      {n}
                    </span>
                  ))}
                  {h.modifiers.map((m) => (
                    <span
                      key={String(m)}
                      className="grid h-6 place-items-center rounded-md bg-surface-2 px-1.5 text-xs font-bold text-emerald-700"
                    >
                      {m === "x2" ? "×2" : `+${m}`}
                    </span>
                  ))}
                </div>
              )}

              {/* Per-status action */}
              <div className="mt-2.5">
                {h.busted ? (
                  <button
                    onClick={() => resume(i)}
                    className="w-full rounded-xl border border-border bg-surface-2 py-2 text-xs font-bold text-foreground transition-transform active:scale-95"
                  >
                    ↩︎ Annuler le bust
                  </button>
                ) : h.stayed ? (
                  <button
                    onClick={() => resume(i)}
                    className="w-full rounded-xl border border-border bg-surface-2 py-2 text-xs font-bold text-foreground transition-transform active:scale-95"
                  >
                    ↩︎ Reprendre
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveIndex(i)}
                      className="flex-1 rounded-xl bg-accent py-2 text-xs font-bold text-on-accent transition-transform active:scale-95"
                    >
                      🎴 Son tour
                    </button>
                    <button
                      onClick={() => stay(i)}
                      className="flex-1 rounded-xl border border-border bg-surface-2 py-2 text-xs font-bold text-sky-700 transition-transform active:scale-95"
                    >
                      ✋ Stopper
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={commit}
        className="mt-5 w-full rounded-2xl bg-accent py-4 text-lg font-bold text-on-accent shadow-lg shadow-accent/20 transition-transform active:scale-[0.98]"
      >
        Valider la manche
      </button>
      {inPlay > 0 && (
        <p className="mt-2 text-center text-xs text-muted">
          {inPlay} joueur{inPlay > 1 ? "s" : ""} encore en jeu — ils garderont
          leurs points actuels.
        </p>
      )}
    </div>
  );
}
