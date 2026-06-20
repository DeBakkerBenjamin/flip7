"use client";

import { useState } from "react";
import { useGame } from "@/lib/useGame";
import Setup from "@/components/Setup";
import Scoreboard from "@/components/Scoreboard";
import RoundView from "@/components/RoundView";
import RoundLive from "@/components/RoundLive";
import VictoryView from "@/components/VictoryView";

export default function Home() {
  const game = useGame();
  const [inRound, setInRound] = useState(false);

  // Avoid a hydration flash: render nothing until localStorage is read.
  if (!game.hydrated) return null;

  const { state } = game;

  if (state.status === "setup") {
    return (
      <Setup
        onStart={(names, target, mode) => {
          game.startGame(names, target, mode);
          setInRound(false);
        }}
      />
    );
  }

  if (state.status === "finished") {
    return (
      <VictoryView
        state={state}
        onRematch={() => {
          game.rematch();
          setInRound(false);
        }}
        onQuit={() => {
          game.resetToSetup();
          setInRound(false);
        }}
      />
    );
  }

  // status === "playing"
  if (inRound) {
    const commitProps = {
      state,
      onCommit: (scores: Record<string, number>) => {
        game.commitRound(scores);
        setInRound(false);
      },
      onCancel: () => setInRound(false),
    };
    return state.mode === "live" ? (
      <RoundLive {...commitProps} />
    ) : (
      <RoundView {...commitProps} />
    );
  }

  return (
    <Scoreboard
      state={state}
      onNewRound={() => setInRound(true)}
      onQuit={() => game.resetToSetup()}
    />
  );
}
