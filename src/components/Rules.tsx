"use client";

import { useEffect, useState } from "react";

interface Section {
  title: string;
  body: string;
}

const SECTIONS: Section[] = [
  {
    title: "🎯 But du jeu",
    body: "Être le premier à atteindre le score cible (200 par défaut), en accumulant les points manche après manche.",
  },
  {
    title: "🔄 Une manche",
    body: "Chaque joueur retourne des cartes une à une. On peut s'arrêter pour sécuriser ses points… ou continuer au risque de buster.",
  },
  {
    title: "🔢 Cartes chiffres (0–12)",
    body: "On additionne les chiffres uniques. Retourner un chiffre déjà obtenu = Bust → 0 point pour la manche.",
  },
  {
    title: "✨ Flip 7",
    body: "Réunir 7 chiffres différents met fin au tour et rapporte un bonus de +15 points.",
  },
  {
    title: "➕ Modificateurs",
    body: "Les cartes +2 à +10 s'ajoutent au total. La carte ×2 double la somme des chiffres (avant les +).",
  },
  {
    title: "🃏 Cartes action",
    body: "Second Chance annule un bust (on défausse le doublon). Freeze force un joueur à s'arrêter. Flip Three force à retourner 3 cartes.",
  },
  {
    title: "🧮 Calcul d'une manche",
    body: "(chiffres uniques × 2 si ×2) + modificateurs + 15 si Flip 7 — ou 0 en cas de bust.",
  },
];

export default function RulesButton() {
  const [open, setOpen] = useState(false);

  // Lock body scroll while the sheet is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Afficher les règles"
        className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface text-base font-bold text-accent shadow-sm transition-transform active:scale-90"
      >
        ?
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Règles du jeu"
        >
          <div
            className="animate-fade absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="animate-sheet relative flex max-h-[85dvh] w-full max-w-md flex-col rounded-t-3xl border border-border bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-xl font-black">
                Règles · Flip <span className="text-accent">7</span>
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-4">
              <ul className="flex flex-col gap-4">
                {SECTIONS.map((s, i) => (
                  <li
                    key={s.title}
                    className="animate-rise"
                    style={{ animationDelay: `${i * 45}ms` }}
                  >
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {s.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border p-4">
              <button
                onClick={() => setOpen(false)}
                className="w-full rounded-2xl bg-accent py-3.5 text-base font-bold text-on-accent transition-transform active:scale-[0.98]"
              >
                Compris !
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
