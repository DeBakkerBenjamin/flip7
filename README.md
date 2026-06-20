# Flip 7 — Compteur de points

Application web responsive (mobile-first) pour compter les points au jeu **Flip 7**.
Next.js + TypeScript + Tailwind CSS, 100 % côté client (sauvegarde dans le `localStorage`).

## Lancer en dev

```bash
pnpm install
pnpm dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Build de production

```bash
pnpm build && pnpm start
```

## Scripts

| Script | Rôle |
| --- | --- |
| `pnpm dev` | Serveur de dev |
| `pnpm build` | Build de production |
| `pnpm typecheck` | Vérification TypeScript (`tsc --noEmit`) |
| `pnpm lint` | ESLint |

## CI & Déploiement

**CI** — le workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) lance
**typecheck · lint · build** sur chaque push et pull request. C'est la barrière qualité ;
il ne déploie pas.

**Déploiement** — géré nativement par **Vercel** (intégration Git), sans GitHub Actions :

- **Preview** automatique sur chaque branche / pull request ;
- **Production** automatique au merge sur `main`.

### Configuration (une fois)

1. Importer le repo GitHub dans Vercel (*Add New… → Project*).
2. Vercel détecte Next.js et configure tout seul ; chaque PR génère sa preview, chaque
   merge sur `main` déploie en production.

Aucun secret n'est nécessaire côté GitHub : la CI ne fait que vérifier le code.

## Fonctionnalités

- Ajout / suppression de joueurs (2 à 8), couleurs automatiques.
- Score cible configurable (100 / 150 / 200 ou personnalisé).
- **Pavé de cartes** par joueur pour chaque manche :
  - chiffres 0–12, modificateurs `+2 … +10` et `×2`, bouton **Bust** et **Second Chance** ;
  - bonus **Flip 7** (+15) détecté automatiquement à 7 chiffres uniques ;
  - score de la manche calculé en direct.
- Tableau de scores classé avec barres de progression, écran de victoire et revanche.
- La partie en cours est sauvegardée et survit à un rafraîchissement.

## Règle de calcul d'une manche

```
score = (somme des chiffres uniques × 2 si ×2) + somme des modificateurs + 15 si Flip 7
score = 0 si Bust
```

## Structure

| Fichier | Rôle |
| --- | --- |
| `src/lib/scoring.ts` | Logique de score pure (testable indépendamment) |
| `src/lib/types.ts` | Types du domaine |
| `src/lib/useGame.ts` | État de la partie + persistance `localStorage` |
| `src/components/Setup.tsx` | Écran de configuration |
| `src/components/Scoreboard.tsx` | Tableau de scores |
| `src/components/PlayerCardPad.tsx` | Pavé de cartes d'un joueur |
| `src/components/RoundView.tsx` | Déroulé d'une manche (wizard + récap) |
| `src/components/VictoryView.tsx` | Écran de victoire |
| `src/app/page.tsx` | Orchestration des écrans |
