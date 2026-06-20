"use client";

import { useState } from "react";
import { emptyHand, type GameState, type RoundHand } from "@/lib/types";
import { scoreHand } from "@/lib/scoring";
import PlayerCardPad from "./PlayerCardPad";

interface RoundViewProps {
  state: GameState;
  onCommit: (roundScores: Record<string, number>) => void;
  onCancel: () => void;
}

export default function RoundView({
  state,
  onCommit,
  onCancel,
}: RoundViewProps) {
  const [hands, setHands] = useState<RoundHand[]>(() =>
    state.players.map(() => emptyHand()),
  );
  const [index, setIndex] = useState(0);
  const [review, setReview] = useState(false);

  const players = state.players;
  const isLast = index === players.length - 1;

  function setHand(hand: RoundHand) {
    setHands((prev) => prev.map((h, i) => (i === index ? hand : h)));
  }

  function commit() {
    const scores: Record<string, number> = {};
    players.forEach((p, i) => {
      scores[p.id] = scoreHand(hands[i]);
    });
    onCommit(scores);
  }

  // ---- Review screen ------------------------------------------------------
  if (review) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-8 pt-8">
        <header className="mb-6">
          <h1 className="text-2xl font-black">Récapitulatif</h1>
          <p className="text-sm text-muted">Manche {state.roundNumber}</p>
        </header>

        <ul className="flex flex-1 flex-col gap-2.5">
          {players.map((p, i) => {
            const s = scoreHand(hands[i]);
            return (
              <li
                key={p.id}
                className="animate-rise flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm"
                style={{ animationDelay: `${i * 55}ms` }}
              >
                <span
                  className="h-3.5 w-3.5 shrink-0 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                <span className="min-w-0 flex-1 truncate font-semibold">
                  {p.name}
                </span>
                <span className="text-sm text-muted">
                  {p.total} → {p.total + s}
                </span>
                <span
                  className={`w-12 text-right text-xl font-black tabular-nums ${
                    hands[i].busted ? "text-red-500" : "text-accent"
                  }`}
                >
                  {hands[i].busted ? "0" : `+${s}`}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setReview(false)}
            className="flex-1 rounded-2xl border border-border py-4 text-base font-semibold text-foreground"
          >
            Modifier
          </button>
          <button
            onClick={commit}
            className="flex-[2] rounded-2xl bg-accent py-4 text-base font-bold text-on-accent shadow-lg shadow-accent/20 transition-transform active:scale-[0.98]"
          >
            Valider la manche
          </button>
        </div>
      </div>
    );
  }

  // ---- Per-player entry screen -------------------------------------------
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-8 pt-8">
      <header className="mb-5 flex items-center justify-between">
        <button
          onClick={onCancel}
          className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
        >
          Annuler
        </button>
        <span className="text-sm font-medium text-muted">
          Manche {state.roundNumber}
        </span>
        <span className="text-sm font-semibold tabular-nums">
          {index + 1}/{players.length}
        </span>
      </header>

      {/* Progress dots */}
      <div className="mb-5 flex justify-center gap-1.5">
        {players.map((p, i) => (
          <span
            key={p.id}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === index ? 24 : 8,
              backgroundColor: i === index ? p.color : "var(--border)",
            }}
          />
        ))}
      </div>

      <div className="flex-1">
        <PlayerCardPad
          key={players[index].id}
          player={players[index]}
          hand={hands[index]}
          mode={state.mode}
          onChange={setHand}
        />
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="rounded-2xl border border-border px-6 py-4 text-base font-semibold text-foreground disabled:opacity-30"
        >
          ←
        </button>
        {isLast ? (
          <button
            onClick={() => setReview(true)}
            className="flex-1 rounded-2xl bg-accent py-4 text-base font-bold text-on-accent shadow-lg shadow-accent/20 transition-transform active:scale-[0.98]"
          >
            Voir le récap
          </button>
        ) : (
          <button
            onClick={() => setIndex((i) => Math.min(players.length - 1, i + 1))}
            className="flex-1 rounded-2xl bg-accent py-4 text-base font-bold text-on-accent shadow-lg shadow-accent/20 transition-transform active:scale-[0.98]"
          >
            Joueur suivant →
          </button>
        )}
      </div>
    </div>
  );
}
