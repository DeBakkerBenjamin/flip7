"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { colorForIndex } from "./colors";
import type { GameState, Player } from "./types";

const STORAGE_KEY = "flip7:game:v1";
export const DEFAULT_TARGET = 200;

function initialState(): GameState {
  return {
    players: [],
    targetScore: DEFAULT_TARGET,
    status: "setup",
    roundNumber: 0,
    winnerId: null,
  };
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 10);
}

/** Build fresh Player objects from a list of names. */
function buildPlayers(names: string[]): Player[] {
  return names.map((name, i) => ({
    id: makeId(),
    name: name.trim(),
    color: colorForIndex(i),
    total: 0,
  }));
}

export interface UseGame {
  state: GameState;
  hydrated: boolean;
  startGame: (names: string[], targetScore: number) => void;
  commitRound: (roundScores: Record<string, number>) => void;
  resetToSetup: () => void;
  rematch: () => void;
}

export function useGame(): UseGame {
  const [state, setState] = useState<GameState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const skipNextSave = useRef(true);

  // Load any saved game once on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        // Restoring persisted state on mount is the canonical hydration pattern.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState(JSON.parse(raw) as GameState);
      }
    } catch {
      // Corrupted storage — ignore and start fresh.
    }
    setHydrated(true);
  }, []);

  // Persist on every change (but not before hydration).
  useEffect(() => {
    if (!hydrated) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage full or unavailable — non-fatal.
    }
  }, [state, hydrated]);

  const startGame = useCallback((names: string[], targetScore: number) => {
    const clean = names.map((n) => n.trim()).filter(Boolean);
    if (clean.length === 0) return;
    setState({
      players: buildPlayers(clean),
      targetScore: Math.max(1, Math.round(targetScore) || DEFAULT_TARGET),
      status: "playing",
      roundNumber: 1,
      winnerId: null,
    });
  }, []);

  const commitRound = useCallback((roundScores: Record<string, number>) => {
    setState((prev) => {
      const players = prev.players.map((p) => ({
        ...p,
        total: p.total + (roundScores[p.id] ?? 0),
      }));

      // Winner = highest total once at least one player reaches the target.
      const reached = players.filter((p) => p.total >= prev.targetScore);
      let winnerId: string | null = null;
      if (reached.length > 0) {
        winnerId = reached.reduce((best, p) =>
          p.total > best.total ? p : best,
        ).id;
      }

      return {
        ...prev,
        players,
        roundNumber: prev.roundNumber + (winnerId ? 0 : 1),
        status: winnerId ? "finished" : "playing",
        winnerId,
      };
    });
  }, []);

  const resetToSetup = useCallback(() => {
    setState(initialState());
  }, []);

  const rematch = useCallback(() => {
    setState((prev) => ({
      ...prev,
      players: prev.players.map((p) => ({ ...p, total: 0 })),
      status: "playing",
      roundNumber: 1,
      winnerId: null,
    }));
  }, []);

  return { state, hydrated, startGame, commitRound, resetToSetup, rematch };
}
