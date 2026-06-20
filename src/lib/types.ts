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
  /** Player holds a Second Chance card (cancels one bust). */
  secondChance: boolean;
}

export type GameStatus = "setup" | "playing" | "finished";

export interface GameState {
  players: Player[];
  targetScore: number;
  status: GameStatus;
  roundNumber: number;
  winnerId: string | null;
}

export function emptyHand(): RoundHand {
  return { numbers: [], modifiers: [], busted: false, secondChance: false };
}
