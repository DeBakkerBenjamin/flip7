// Domain types for the Flip 7 score counter.

/** Additive modifier cards (+2 … +10). */
export type AddModifier = 2 | 4 | 6 | 8 | 10;

/** All modifier cards: the additive ones plus the "×2" multiplier. */
export type Modifier = AddModifier | "x2";

export const ADD_MODIFIERS: AddModifier[] = [2, 4, 6, 8, 10];
export const NUMBER_CARDS: number[] = Array.from({ length: 13 }, (_, i) => i); // 0..12
export const FLIP7_BONUS = 15;
export const FLIP7_COUNT = 7;

/** A player as tracked across the whole game. */
export interface Player {
  id: string;
  name: string;
  color: string;
  total: number;
}

/** Draft of a single player's hand during one round. */
export interface RoundHand {
  /** Unique number cards collected (0..12). */
  numbers: number[];
  /** Modifier cards collected. "x2" may appear at most once. */
  modifiers: Modifier[];
  /** Player flipped a duplicate and busted → scores 0 this round. */
  busted: boolean;
  /** The duplicate number that caused the bust (for display). */
  bustOn?: number;
  /** Player holds a Second Chance card (cancels one bust). */
  secondChance: boolean;
}

export type GameStatus = "setup" | "playing" | "finished";

/**
 * How a round is entered:
 * - "live": cards are tapped as they're flipped — a duplicate busts on the
 *   spot and Second Chance is meaningful.
 * - "tally": only the final result of each player is entered at the end of the
 *   round — no live bust, no Second Chance.
 */
export type GameMode = "live" | "tally";

export interface GameState {
  players: Player[];
  targetScore: number;
  mode: GameMode;
  status: GameStatus;
  roundNumber: number;
  winnerId: string | null;
}

export function emptyHand(): RoundHand {
  return { numbers: [], modifiers: [], busted: false, secondChance: false };
}
