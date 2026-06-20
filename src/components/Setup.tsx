"use client";

import { useState } from "react";
import { colorForIndex } from "@/lib/colors";
import { DEFAULT_TARGET } from "@/lib/useGame";
import type { GameMode } from "@/lib/types";
import RulesButton from "./Rules";

interface SetupProps {
  onStart: (names: string[], target: number, mode: GameMode) => void;
}

const MODES: { id: GameMode; label: string; desc: string }[] = [
  {
    id: "live",
    label: "🎴 Tour par tour",
    desc: "On tape les cartes en direct. Doublon = bust immédiat, Seconde Chance active.",
  },
  {
    id: "tally",
    label: "✍️ Fin de manche",
    desc: "On entre le résultat de chaque joueur à la fin de la manche. Plus rapide.",
  },
];

const MAX_PLAYERS = 8;
const PRESETS = [100, 150, 200];

export default function Setup({ onStart }: SetupProps) {
  const [names, setNames] = useState<string[]>(["", ""]);
  const [target, setTarget] = useState<number>(DEFAULT_TARGET);
  const [mode, setMode] = useState<GameMode>("live");

  const filled = names.map((n) => n.trim()).filter(Boolean);
  const canStart = filled.length >= 2;

  function updateName(index: number, value: string) {
    setNames((prev) => prev.map((n, i) => (i === index ? value : n)));
  }

  function addPlayer() {
    setNames((prev) =>
      prev.length >= MAX_PLAYERS ? prev : [...prev, ""],
    );
  }

  function removePlayer(index: number) {
    setNames((prev) =>
      prev.length <= 2 ? prev : prev.filter((_, i) => i !== index),
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-8 pt-10">
      <header className="animate-rise relative mb-8 text-center">
        <div className="absolute right-0 top-0">
          <RulesButton />
        </div>
        <h1 className="text-4xl font-black tracking-tight">
          Flip <span className="text-accent">7</span>
        </h1>
        <p className="mt-1 text-sm text-muted">Compteur de points</p>
      </header>

      <section className="flex-1">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Joueurs
          </h2>
          <span className="text-xs text-muted">
            {filled.length}/{MAX_PLAYERS}
          </span>
        </div>

        <ul className="flex flex-col gap-2.5">
          {names.map((name, i) => (
            <li
              key={i}
              className="animate-rise flex items-center gap-3 rounded-2xl border border-border bg-surface px-3.5 py-2.5 shadow-sm"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold text-black"
                style={{ backgroundColor: colorForIndex(i) }}
              >
                {i + 1}
              </span>
              <input
                value={name}
                onChange={(e) => updateName(i, e.target.value)}
                placeholder={`Joueur ${i + 1}`}
                maxLength={16}
                className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted/60"
              />
              {names.length > 2 && (
                <button
                  onClick={() => removePlayer(i)}
                  aria-label={`Supprimer le joueur ${i + 1}`}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </li>
          ))}
        </ul>

        {names.length < MAX_PLAYERS && (
          <button
            onClick={addPlayer}
            className="mt-3 w-full rounded-2xl border border-dashed border-border py-3 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent"
          >
            + Ajouter un joueur
          </button>
        )}

        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
            Score cible
          </h2>
          <div className="flex items-center gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => setTarget(preset)}
                className={`flex-1 rounded-2xl border py-3 text-base font-semibold transition-colors active:scale-95 ${
                  target === preset
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-surface text-foreground hover:border-accent/50"
                }`}
              >
                {preset}
              </button>
            ))}
            <input
              type="number"
              inputMode="numeric"
              min={1}
              value={PRESETS.includes(target) ? "" : target}
              onChange={(e) => setTarget(Number(e.target.value))}
              placeholder="Autre"
              aria-label="Score cible personnalisé"
              className={`w-20 rounded-2xl border py-3 text-center text-base font-semibold outline-none placeholder:text-muted/60 focus:border-accent ${
                PRESETS.includes(target)
                  ? "border-border bg-surface"
                  : "border-accent bg-accent/10 text-accent"
              }`}
            />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
            Déroulé
          </h2>
          <div className="flex flex-col gap-2.5">
            {MODES.map((m) => {
              const active = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`rounded-2xl border p-3.5 text-left transition-colors active:scale-[0.99] ${
                    active
                      ? "border-accent bg-accent/10"
                      : "border-border bg-surface hover:border-accent/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-base font-bold ${
                        active ? "text-accent" : "text-foreground"
                      }`}
                    >
                      {m.label}
                    </span>
                    <span
                      className={`grid h-5 w-5 place-items-center rounded-full border-2 ${
                        active
                          ? "border-accent bg-accent text-on-accent"
                          : "border-border"
                      }`}
                    >
                      {active && <span className="text-[10px]">✓</span>}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {m.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <button
        disabled={!canStart}
        onClick={() => onStart(filled, target, mode)}
        className="mt-8 w-full rounded-2xl bg-accent py-4 text-lg font-bold text-on-accent shadow-lg shadow-accent/20 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none"
      >
        Démarrer la partie
      </button>
      {!canStart && (
        <p className="mt-2 text-center text-xs text-muted">
          Ajoute au moins 2 joueurs pour commencer.
        </p>
      )}
    </div>
  );
}
