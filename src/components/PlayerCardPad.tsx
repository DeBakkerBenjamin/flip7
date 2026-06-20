"use client";

import {
  ADD_MODIFIERS,
  NUMBER_CARDS,
  type AddModifier,
  type GameMode,
  type Player,
  type RoundHand,
} from "@/lib/types";
import { isFlip7, scoreHand } from "@/lib/scoring";

interface PlayerCardPadProps {
  player: Player;
  hand: RoundHand;
  mode: GameMode;
  onChange: (hand: RoundHand) => void;
}

export default function PlayerCardPad({
  player,
  hand,
  mode,
  onChange,
}: PlayerCardPadProps) {
  const live = mode === "live";
  const flip7 = isFlip7(hand);
  const score = scoreHand(hand);

  // Live mode: a tap on an existing number is a duplicate flip → bust.
  function tapNumberLive(n: number) {
    if (hand.busted) return;
    if (hand.numbers.includes(n)) {
      if (hand.secondChance) {
        onChange({ ...hand, secondChance: false }); // discard duplicate + card
      } else {
        onChange({ ...hand, busted: true, bustOn: n });
      }
      return;
    }
    if (hand.numbers.length >= 7) return; // Flip 7 caps the hand
    onChange({ ...hand, numbers: [...hand.numbers, n] });
  }

  // Tally mode: a number simply toggles on/off (free correction).
  function toggleNumberTally(n: number) {
    if (hand.busted) return;
    const has = hand.numbers.includes(n);
    if (!has && hand.numbers.length >= 7) return;
    const numbers = has
      ? hand.numbers.filter((x) => x !== n)
      : [...hand.numbers, n];
    onChange({ ...hand, numbers });
  }

  function undoLast() {
    if (hand.numbers.length === 0) return;
    onChange({ ...hand, numbers: hand.numbers.slice(0, -1) });
  }

  function recoverFromBust() {
    onChange({ ...hand, busted: false, bustOn: undefined });
  }

  function toggleBust() {
    onChange({ ...hand, busted: !hand.busted, bustOn: undefined });
  }

  function toggleAddModifier(m: AddModifier) {
    if (hand.busted) return;
    const has = hand.modifiers.includes(m);
    const modifiers = has
      ? hand.modifiers.filter((x) => x !== m)
      : [...hand.modifiers, m];
    onChange({ ...hand, modifiers });
  }

  function toggleX2() {
    if (hand.busted) return;
    const has = hand.modifiers.includes("x2");
    const modifiers: typeof hand.modifiers = has
      ? hand.modifiers.filter((x) => x !== "x2")
      : [...hand.modifiers, "x2"];
    onChange({ ...hand, modifiers });
  }

  function toggleSecondChance() {
    if (hand.busted) return;
    onChange({ ...hand, secondChance: !hand.secondChance });
  }

  const hasX2 = hand.modifiers.includes("x2");
  const dimmed = hand.busted ? "opacity-40 pointer-events-none" : "";

  return (
    <div className="animate-rise rounded-3xl border border-border bg-surface p-4 shadow-sm">
      {/* Player header + live score */}
      <div className="mb-4 flex items-center gap-3">
        <span
          className="h-4 w-4 shrink-0 rounded-full"
          style={{ backgroundColor: player.color }}
        />
        <span className="min-w-0 flex-1 truncate text-lg font-semibold">
          {player.name}
        </span>
        <div className="text-right">
          <div
            key={hand.busted ? "bust" : score}
            className={`animate-score text-3xl font-black tabular-nums ${
              hand.busted ? "text-red-500" : "text-foreground"
            }`}
          >
            {hand.busted ? "0" : score}
          </div>
          {flip7 && !hand.busted && (
            <div className="text-xs font-bold text-accent">FLIP 7 ! +15</div>
          )}
        </div>
      </div>

      {/* Number grid 0..12 */}
      <div className="grid grid-cols-5 gap-2">
        {NUMBER_CARDS.map((n) => {
          const active = hand.numbers.includes(n);
          const isBustCard = hand.busted && hand.bustOn === n;
          return (
            <button
              key={n}
              onClick={() => (live ? tapNumberLive(n) : toggleNumberTally(n))}
              className={`aspect-square rounded-xl border text-lg font-bold tabular-nums transition-transform active:scale-90 ${
                isBustCard
                  ? "animate-pop border-transparent bg-red-500 text-white shadow-md shadow-red-500/30"
                  : active
                    ? "animate-pop border-transparent bg-accent text-on-accent shadow-md shadow-accent/30"
                    : `border-border bg-surface-2 text-foreground ${dimmed}`
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>

      {/* Modifiers */}
      <div className={`mt-3 grid grid-cols-6 gap-2 ${dimmed}`}>
        {ADD_MODIFIERS.map((m) => {
          const active = hand.modifiers.includes(m);
          return (
            <button
              key={m}
              onClick={() => toggleAddModifier(m)}
              className={`rounded-xl border py-2.5 text-sm font-bold transition-transform active:scale-90 ${
                active
                  ? "border-transparent bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                  : "border-border bg-surface-2 text-emerald-700"
              }`}
            >
              +{m}
            </button>
          );
        })}
        <button
          onClick={toggleX2}
          className={`rounded-xl border py-2.5 text-sm font-bold transition-transform active:scale-90 ${
            hasX2
              ? "border-transparent bg-amber-400 text-black shadow-md shadow-amber-400/40"
              : "border-border bg-surface-2 text-amber-600"
          }`}
        >
          ×2
        </button>
      </div>

      {/* Bottom controls */}
      {live ? (
        hand.busted ? (
          <div className="animate-rise mt-3 flex items-center gap-3 rounded-xl border border-red-300 bg-red-50 px-4 py-3">
            <span className="text-2xl">💥</span>
            <span className="flex-1 text-sm font-bold text-red-600">
              Busté ! Doublon du {hand.bustOn} → 0 point
            </span>
            <button
              onClick={recoverFromBust}
              className="rounded-lg bg-red-500 px-3 py-2 text-sm font-bold text-white transition-transform active:scale-95"
            >
              ↩︎ Annuler
            </button>
          </div>
        ) : (
          <>
            <div className="mt-3 flex gap-2">
              <button
                onClick={undoLast}
                disabled={hand.numbers.length === 0}
                className="flex-1 rounded-xl border border-border bg-surface-2 py-3 text-sm font-bold text-foreground transition-transform active:scale-95 disabled:opacity-40"
              >
                ↩︎ Annuler la carte
              </button>
              <button
                onClick={toggleSecondChance}
                className={`flex-1 rounded-xl border py-3 text-sm font-bold transition-transform active:scale-95 ${
                  hand.secondChance
                    ? "border-transparent bg-sky-500 text-white shadow-md shadow-sky-500/30"
                    : "border-border bg-surface-2 text-sky-700"
                }`}
              >
                🛡 Seconde chance
              </button>
            </div>
            {hand.secondChance && (
              <p className="mt-2 text-center text-xs text-sky-700">
                Le prochain doublon sera annulé au lieu de buster.
              </p>
            )}
          </>
        )
      ) : (
        // Tally mode: a single explicit Bust toggle.
        <button
          onClick={toggleBust}
          className={`mt-3 w-full rounded-xl border py-3 text-sm font-bold transition-transform active:scale-95 ${
            hand.busted
              ? "border-transparent bg-red-500 text-white shadow-md shadow-red-500/30"
              : "border-border bg-surface-2 text-red-600"
          }`}
        >
          💥 {hand.busted ? "Busté — 0 point (annuler)" : "Marquer comme busté"}
        </button>
      )}
    </div>
  );
}
