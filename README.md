# Flip 7 — Compteur de points

Application web responsive (mobile-first) pour compter les points au jeu **Flip 7**.
Next.js + TypeScript + Tailwind CSS, 100 % côté client (sauvegarde dans le `localStorage`).

## Lancer en dev

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Build de production

```bash
npm run build && npm start
```

## Déploiement (GitHub Actions → Vercel)

Le workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) fait :

- **CI** (lint + type-check) sur chaque push et PR ;
- **Preview** Vercel sur chaque pull request (l'URL est postée en commentaire) ;
- **Production** Vercel sur push vers `main`.

### Configuration (une fois)

1. Pousser le repo sur GitHub.
2. Lier le projet à Vercel en local : `npx vercel link` → crée `.vercel/project.json` contenant `orgId` et `projectId`.
3. Créer un token Vercel : dashboard Vercel → *Account Settings → Tokens*.
4. Ajouter 3 secrets dans GitHub (*Settings → Secrets and variables → Actions*) :
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID` (= `orgId`)
   - `VERCEL_PROJECT_ID` (= `projectId`)
5. Pour éviter un double déploiement, désactiver l'auto-deploy Git côté Vercel (*Project Settings → Git*) — c'est ce workflow qui déploie.

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
