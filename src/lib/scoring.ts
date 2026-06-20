// Pure scoring logic for Flip 7. No React, no side effects — easy to test.

import {
  FLIP7_BONUS,
  FLIP7_COUNT,
  type Modifier,
  type RoundHand,
} from "./types";

/** Sum of the unique number cards (before any multiplier). */
export function sumNumbers(numbers: number[]): number {
  const unique = new Set(numbers);
  let sum = 0;
  for (const n of unique) sum += n;
  return sum;
}

/** Sum of the additive (+N) modifiers, ignoring "x2". */
export function sumAddModifiers(modifiers: Modifier[]): number {
  return modifiers.reduce<number>(
    (acc, m) => (m === "x2" ? acc : acc + m),
    0,
  );
}

/** True when the player has the 7 unique-number bonus. */
export function isFlip7(hand: RoundHand): boolean {
  return new Set(hand.numbers).size >= FLIP7_COUNT;
}

/**
 * Final round score for a hand.
 *
 * Rule: a busted hand scores 0. Otherwise the unique number cards are summed,
 * doubled if an "x2" card is present, then the additive modifiers are added,
 * and finally a +15 bonus is granted for collecting 7 unique numbers.
 */
export function scoreHand(hand: RoundHand): number {
  if (hand.busted) return 0;

  let base = sumNumbers(hand.numbers);
  if (hand.modifiers.includes("x2")) base *= 2;

  let total = base + sumAddModifiers(hand.modifiers);
  if (isFlip7(hand)) total += FLIP7_BONUS;

  return total;
}
