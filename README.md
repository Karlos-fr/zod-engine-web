# zod-engine-web

Portage progressif de Zod Engine vers une application navigateur en
TypeScript, Vite et Three.js.

Le projet ne vise pas une traduction mécanique du C++ historique. Le snapshot
upstream sert de référence fonctionnelle pour reconstruire le jeu avec une
architecture Web maintenable.

## État actuel

- Snapshot SourceForge Mercurial récupéré dans `download/`.
- Sources upstream extraites dans
  `download/zod-zod_engine-6f2d1f82a95c7e2bcbb8338770d03e2b70b3e0b5/`.
- Socle Vite/TypeScript/Three.js en place.
- Boucle de jeu à pas fixe.
- Simulation séparée du rendu.
- Scène Three.js minimale avec terrain, entité et ordre de déplacement au clic.
- CLI de portage `zport`.
- Référentiel Markdown de portage généré.
- Gestion bloquante des dépendances entre symboles.
- Premier symbole porté : `map_basics` vers `src/world/MapBasics.ts`.

## Installation

```sh
npm install
```

## Commandes

```sh
npm run dev
npm run build
npm test
npm run lint
```

CLI de portage :

```sh
npm run zport -- scan
npm run zport -- status
npm run zport -- next
npm run zport -- deps <id>
npm run zport -- context <id>
npm run zport -- show <id>
npm run zport -- start <id>
npm run zport -- done <id> --target <path>
npm run zport -- block <id> --note "reason"
npm run zport -- ignore <id> --note "reason"
```

## Workflow de portage

Le portage se fait strictement **un symbole à la fois**.

1. Trouver le prochain symbole portable :
   ```sh
   npm run zport -- next
   ```
2. Vérifier ses dépendances :
   ```sh
   npm run zport -- deps <id>
   ```
3. Si `blocked_by` contient des IDs, porter d'abord ces dépendances.
4. Extraire le contexte réduit :
   ```sh
   npm run zport -- context <id>
   ```
5. Porter uniquement ce symbole.
6. Ajouter ou adapter les tests.
7. Valider :
   ```sh
   npm run lint
   npm test
   npm run build
   ```
8. Marquer le symbole :
   ```sh
   npm run zport -- done <id> --target <path>
   ```

Le champ `Lot` du référentiel est seulement un indicateur de tri. Il ne donne
jamais l'autorisation de porter plusieurs symboles dans une même tâche.

## Référentiel de portage

Le fichier principal est :

```text
docs/porting/PORTING_LEDGER.md
```

Il contient une ligne par symbole upstream détecté :

- classe ;
- structure ;
- enum ;
- fonction ;
- méthode ;
- constante ;
- macro ;
- variable globale.

Colonnes importantes :

- `ID` : identifiant stable utilisé par la CLI ;
- `Décision` : `PORTER`, `ADAPT`, `REPLACE`, `IGNORE`, `DEFER` ;
- `Statut` : `todo`, `in_progress`, `ported`, `verified`, `blocked`, `ignored` ;
- `Depends On` : dépendances détectées ;
- `Blocked By` : dépendances non encore portées ou non justifiées.

État courant du ledger :

```text
total=2913
ported=1
todo=2912
```

## Documentation de portage

- `docs/porting/PORTING_IMPLEMENTATION_PLAN.md` : plan de construction du
  dispositif de portage.
- `docs/porting/PORTING_CONTEXT_RULES.md` : règles de contexte pour limiter la
  consommation de tokens.
- `docs/porting/PORTING_DECISIONS.md` : décisions d'architecture.
- `docs/porting/UPSTREAM_MODULES.md` : carte fonctionnelle des modules
  upstream.
- `docs/porting/VERTICAL_SLICE.md` : tranche verticale initiale.

## Architecture cible

```text
src/
  app/          composition, boucle, état applicatif
  simulation/   monde, entités, systèmes, événements
  world/        carte, tuiles, zones, navigation
  rendering/    Three.js, caméra, vues terrain/entités
  input/        entrées joueur
  assets/       manifests et chargement assets
  audio/        audio Web
  ui/           interface
  data/         données typées
```

Règles :

- `simulation`, `world` et `data` ne dépendent pas de Three.js.
- Le rendu observe l'état de simulation.
- SDL/OpenGL/Windows sont remplacés ou ignorés selon les cas.
- Le réseau natif est reporté.
- Les gros fichiers C++ ne sont jamais utilisés comme unité de portage.

## Upstream

Le snapshot upstream conservé provient du dépôt Mercurial SourceForge :

```text
https://sourceforge.net/p/zod/zod_engine/ci/default/tree/
```

Révision :

```text
6f2d1f82a95c7e2bcbb8338770d03e2b70b3e0b5
```

L'archive ZIP du snapshot est suivie via Git LFS.
