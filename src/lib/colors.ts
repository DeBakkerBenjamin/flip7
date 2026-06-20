// A distinct, accessible palette assigned to players in order.

export const PLAYER_COLORS: string[] = [
  "#38bdf8", // sky
  "#f472b6", // pink
  "#a3e635", // lime
  "#fb923c", // orange
  "#c084fc", // violet
  "#2dd4bf", // teal
  "#facc15", // yellow
  "#f87171", // red
];

export function colorForIndex(index: number): string {
  return PLAYER_COLORS[index % PLAYER_COLORS.length];
}
