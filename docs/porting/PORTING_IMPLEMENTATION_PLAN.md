# Plan de construction du dispositif de portage

Ce plan transforme la stratégie de `ChatGPT.md` en livrables concrets pour
piloter le portage TypeScript de Zod Engine. L'objectif est de créer un socle
technique et une CLI capables de maintenir un référentiel Markdown atomique,
d'extraire un contexte réduit depuis les sources C++ et de guider Codex sans
relire les gros fichiers à chaque tâche.

## Objectifs

- Conserver le snapshot upstream dans `download/` comme référence immuable.
- Construire un référentiel Markdown exhaustif, ligne par ligne de symbole.
- Fournir une CLI `zport` pour scanner, qualifier, sélectionner, contextualiser
  et marquer les éléments portés.
- Gérer les gros fichiers C++ par extraction ciblée de symboles et dépendances,
  jamais par lecture complète comme unité de travail.
- Mettre en place le socle TypeScript/Vite/Three.js avant le portage massif.
- Valider l'architecture par une tranche verticale minimale : carte, rendu,
  entité, sélection, ordre, navigation et déplacement.

## Arborescence cible

```text
docs/
  porting/
    PORTING_IMPLEMENTATION_PLAN.md
    PORTING_LEDGER.md
    PORTING_DECISIONS.md
    PORTING_CONTEXT_RULES.md
    UPSTREAM_MODULES.md

tools/
  zport/
    cli.ts
    config.ts
    ledger.ts
    markdown-table.ts
    scan-upstream.ts
    symbol-extractor.ts
    context-builder.ts
    dependency-graph.ts
    task-selector.ts
    large-file-policy.ts

src/
  app/
    GameApplication.ts
    GameLoop.ts
    GameState.ts
  simulation/
    World.ts
    entities/
    systems/
    events/
  world/
    GameMap.ts
    Tile.ts
    Zone.ts
    NavigationGrid.ts
  rendering/
    ThreeRenderer.ts
    CameraController.ts
    TerrainView.ts
    EntityView.ts
  input/
  assets/
  audio/
  ui/
  data/
```

## Phase 1 - Normaliser les chemins et la configuration

Créer une configuration unique pour éviter de recopier les chemins longs du
snapshot.

Livrables :

- `tools/zport/config.ts`
- `docs/porting/PORTING_CONTEXT_RULES.md`

Configuration minimale :

```ts
export const upstreamRoot =
  "download/zod-zod_engine-6f2d1f82a95c7e2bcbb8338770d03e2b70b3e0b5";

export const upstreamSourceRoot = `${upstreamRoot}/src`;
export const ledgerPath = "docs/porting/PORTING_LEDGER.md";
export const decisionsPath = "docs/porting/PORTING_DECISIONS.md";
```

Critères de validation :

- La CLI peut résoudre `upstreamRoot` depuis n'importe quelle commande.
- Le chemin complet du snapshot n'est pas dupliqué dans les modules.
- Les règles de contexte décrivent clairement ce qui peut être donné à Codex.

## Phase 2 - Créer le référentiel Markdown

Le référentiel principal est `docs/porting/PORTING_LEDGER.md`.

Chaque ligne représente un symbole portable ou explicitement non portable, pas
un fichier complet.

Colonnes obligatoires :

| Colonne | Rôle |
|---|---|
| ID | Identifiant stable, par exemple `ZOBJ-0001` |
| Type | `class`, `struct`, `enum`, `method`, `function`, `constant`, `macro`, `global` |
| Symbole | Nom qualifié du symbole |
| Fichier | Chemin relatif upstream |
| Lignes | Plage `start-end` dans le fichier upstream |
| Décision | `PORTER`, `ADAPT`, `REPLACE`, `IGNORE`, `DEFER` |
| Domaine cible | `world`, `simulation`, `rendering`, `input`, `assets`, `audio`, `ui`, `network`, `data`, `tooling` |
| Statut | `todo`, `qualified`, `in_progress`, `ported`, `verified`, `blocked`, `ignored` |
| Lot | Identifiant optionnel de lot cohérent |
| Cible TS | Fichier ou module TypeScript cible |
| Notes | Justification courte, obligatoire pour `IGNORE`, `REPLACE`, `DEFER`, `blocked` |

Exemple :

```md
| ID | Type | Symbole | Fichier | Lignes | Décision | Domaine cible | Statut | Lot | Cible TS | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| ZOBJ-0001 | class | `ZObject` | `src/zobject.h` | `32-210` | PORTER | simulation | todo | entity-core | `src/simulation/entities/GameEntity.ts` | Base comportementale des objets |
| ZSDL-0001 | method | `ZSDL::Render` | `src/zsdl.cpp` | `80-155` | REPLACE | rendering | ignored | rendering-web | `src/rendering/ThreeRenderer.ts` | Remplacé par Three.js |
```

Règles :

- Une ligne supprimée du C++ upstream ne doit pas être effacée du ledger sans
  note ; elle passe en `ignored` ou `blocked`.
- `zport scan` peut ajouter ou mettre à jour les métadonnées, mais doit
  préserver les statuts, décisions, lots, cibles TS et notes existants.
- Le Markdown est la source de vérité lisible ; la CLI peut générer un cache
  JSON temporaire, mais il ne remplace pas le ledger.

## Phase 3 - Construire la moulinette de scan

Commande :

```sh
npm run zport -- scan
```

Responsabilités :

- Parcourir `download/.../src`.
- Inclure `.h`, `.hpp`, `.c`, `.cpp`.
- Exclure les dossiers de dépendances vendoriées lorsque pertinent :
  `src/vsproj/**/libs/**`, archives imbriquées, binaires, docs HTML SDL.
- Détecter classes, structures, enums, fonctions, méthodes, constantes,
  macros significatives, variables globales et statiques.
- Capturer fichier, lignes, type, symbole, conteneur de classe, signature.
- Générer des IDs stables.

Approche technique :

- Première version pragmatique : analyse textuelle robuste par expressions
  régulières et pile d'accolades.
- Version améliorée : Tree-sitter C++ si la dépendance est acceptable.
- Le scanner doit signaler les cas ambigus au lieu d'inventer un symbole.

Sorties :

- Mise à jour de `PORTING_LEDGER.md`.
- Rapport court dans la console :
  - fichiers scannés ;
  - symboles ajoutés ;
  - symboles inchangés ;
  - symboles ambigus ;
  - gros fichiers détectés.

Critères de validation :

- Relancer `scan` deux fois sans changement ne modifie pas le ledger.
- Les symboles déjà qualifiés conservent leurs décisions et statuts.
- Les gros fichiers comme `zobject.cpp`, `zplayer.cpp`, `zserver.cpp` sont
  découpés en symboles, pas en tâches globales.

## Phase 4 - Politique gros fichiers

Créer `tools/zport/large-file-policy.ts`.

Seuils proposés :

- `large`: plus de 80 Ko ou plus de 1200 lignes.
- `huge`: plus de 200 Ko ou plus de 3000 lignes.
- `binary`: tout fichier non texte ou impossible à décoder en UTF-8.

Règles :

- Un fichier `large` ou `huge` ne peut jamais être envoyé complet dans
  `zport context`.
- La CLI extrait seulement :
  - le symbole demandé ;
  - sa déclaration ;
  - les champs de la classe utilisés ;
  - les enums/constantes référencées ;
  - les signatures des appels directs ;
  - un extrait court autour des dépendances directes.
- Les assets, DLL, archives, images et maps ne sont jamais inclus dans un
  contexte Codex brut. Ils sont référencés par chemin, taille et type.

Commande :

```sh
npm run zport -- inspect-file src/zobject.cpp
```

Sortie attendue :

```text
src/zobject.cpp
size: 312 KiB
lines: 8450
policy: huge
symbols: 143
context mode: symbol-only
```

## Phase 5 - Construire la CLI `zport`

Entrée package :

```json
{
  "scripts": {
    "zport": "tsx tools/zport/cli.ts"
  }
}
```

Commandes initiales :

```sh
npm run zport -- scan
npm run zport -- list
npm run zport -- status
npm run zport -- show ZOBJ-0001
npm run zport -- context ZOBJ-0001
npm run zport -- next
npm run zport -- start ZOBJ-0001
npm run zport -- done ZOBJ-0001 --target src/simulation/entities/GameEntity.ts
npm run zport -- block ZOBJ-0001 --note "format dependency missing"
npm run zport -- ignore ZSDL-0001 --note "SDL rendering replaced by Three.js"
```

Comportement attendu :

- `list` filtre par statut, décision, domaine, fichier et lot.
- `show` affiche le symbole et son extrait exact.
- `context` produit un Markdown compact utilisable directement par Codex.
- `next` choisit une tâche compatible avec la phase en cours.
- `start`, `done`, `block`, `ignore` modifient uniquement les lignes concernées
  du ledger.
- `done` exige une cible TS ou une note.
- `ignore`, `replace`, `defer` exigent une justification.

Format de `context` :

```md
# Porting context: ZOBJ-0001

## Ledger row
...

## Architecture rules
...

## Upstream declaration
...

## Upstream implementation
...

## Direct dependencies
...

## Existing TypeScript targets
...

## Required action
Port only this symbol or lot. Update tests and ledger.
```

## Phase 6 - Graphe de dépendances et sélection des lots

Créer :

- `tools/zport/dependency-graph.ts`
- `docs/porting/UPSTREAM_MODULES.md`

Le graphe global reste fonctionnel, pas exhaustif ligne par ligne :

```text
Map -> Navigation -> Movement -> Combat
Entity -> Robot -> Movement
Entity -> Vehicle -> Movement
Territory -> Capture
Building -> Production -> Units
AI -> Orders -> Movement/Combat/Production
Rendering observes Simulation
```

La CLI construit un graphe local pour un symbole :

- includes du fichier ;
- classe propriétaire ;
- appels directs ;
- constantes/enums référencées ;
- symboles du même lot.

`zport next` doit favoriser cet ordre :

1. formats de données et constantes ;
2. map et terrain ;
3. entité de base ;
4. navigation ;
5. mouvement ;
6. rendu observateur ;
7. sélection et ordres ;
8. combat et production ;
9. IA ;
10. réseau et éditeur.

## Phase 7 - Socle technique TypeScript

Créer un projet web minimal avant tout portage massif.

Stack :

- TypeScript strict.
- Vite.
- Three.js.
- Vitest.
- ESLint.
- Web Audio API plus tard.

Modules de base :

- `GameApplication` : composition des services.
- `GameLoop` : pas fixe de simulation, rendu interpolé.
- `GameState` : état de session.
- `World` : conteneur simulation sans dépendance Three.js.
- `GameMap`, `Tile`, `Zone`, `NavigationGrid`.
- `ThreeRenderer`, `TerrainView`, `EntityView`, `CameraController`.
- `AssetManifest`, `AssetLoader`.
- `InputController`.

Règles d'architecture :

- `simulation`, `world` et `data` ne dépendent jamais de Three.js.
- Le rendu observe l'état, il ne possède pas les règles de gameplay.
- Les assets sont référencés via manifests, pas par chemins éparpillés.
- La simulation utilise un pas fixe.
- L'IA utilise les mêmes ordres que le joueur.
- Le réseau natif C++ est `DEFER` au départ.

Critères de validation :

- `npm run build` passe.
- `npm test` passe.
- Une page Vite affiche un canvas Three.js non vide.
- La simulation peut tourner sans renderer dans un test Vitest.

## Phase 8 - Tranche verticale de validation

Objectif : prouver que l'architecture peut porter le jeu avant de multiplier les
symboles.

Périmètre :

1. Charger une carte upstream.
2. Construire un `GameMap`.
3. Afficher un terrain minimal dans Three.js.
4. Créer une entité robot.
5. Afficher le robot.
6. Sélectionner le robot à la souris.
7. Donner un ordre de déplacement.
8. Calculer un chemin.
9. Déplacer le robot avec un pas fixe.
10. Synchroniser rendu et simulation.

Lots probables dans le ledger :

- `map-format`
- `map-core`
- `entity-core`
- `robot-basic`
- `navigation-basic`
- `movement-basic`
- `rendering-basic`
- `selection-orders`

Critère de fin :

- Une carte upstream est visible dans le navigateur.
- Un robot peut être sélectionné et déplacé.
- Les symboles portés sont marqués `ported` ou `verified`.
- Les décisions `REPLACE`, `IGNORE`, `DEFER` de la tranche ont une note.

## Phase 9 - Cycle de travail Codex

Cycle obligatoire pour chaque tâche :

1. `npm run zport -- next`
2. `npm run zport -- context <id>`
3. Lire uniquement les fichiers mentionnés par le contexte.
4. Porter le symbole ou le lot indiqué.
5. Ajouter ou adapter les tests.
6. Lancer build/tests ciblés.
7. `npm run zport -- done <id> --target <path>` ou `block/ignore`.
8. Résumer les décisions dans `PORTING_DECISIONS.md` si elles changent
   l'architecture.

Consigne permanente :

```text
Porter uniquement le symbole ou lot demandé.
Respecter l'architecture cible.
Ne pas traduire mécaniquement le C++.
Remplacer les dépendances SDL/Windows/OpenGL natives par les modules web.
Ne pas lire ni coller un gros fichier complet si zport context peut extraire le symbole.
Terminer par tests + mise à jour du ledger.
```

## Phase 10 - Ordre d'exécution recommandé

1. Ajouter `package.json`, TypeScript, Vite, Vitest et ESLint.
2. Créer `tools/zport/config.ts` et la CLI vide.
3. Créer le writer/reader de tables Markdown.
4. Implémenter `zport scan` en version textuelle.
5. Générer `PORTING_LEDGER.md`.
6. Implémenter `zport show`.
7. Implémenter `large-file-policy`.
8. Implémenter `zport context`.
9. Créer les fichiers d'architecture `src/`.
10. Implémenter build/test minimal.
11. Qualifier les premiers lots `map-format`, `entity-core`, `rendering-basic`.
12. Démarrer la tranche verticale.

## Risques et garde-fous

| Risque | Garde-fou |
|---|---|
| Ledger Markdown corrompu | Parser strict + test snapshot sur table |
| IDs instables après rescan | ID basé sur domaine, fichier, symbole et hash court |
| Trop de contexte envoyé à Codex | `large-file-policy` obligatoire dans `context` |
| Portage mécanique C++ | Décision par symbole + domaine cible web |
| Architecture figée trop tôt | Tranche verticale avant portage massif |
| Assets trop lourds dans Git ou contexte | LFS pour archives, manifests pour runtime, chemins au lieu de contenu |
| Dépendances vendoriées SDL polluent le ledger | Exclusions configurables + statut `IGNORE/REPLACE` groupé |

## Definition of Done du dispositif

Le dispositif est prêt pour le portage régulier lorsque :

- `PORTING_LEDGER.md` existe et couvre les symboles upstream pertinents.
- `zport scan` est idempotent.
- `zport show`, `context`, `next`, `start`, `done`, `block`, `ignore` existent.
- Les gros fichiers sont signalés et jamais exportés complets par `context`.
- Le socle Vite/TypeScript/Three.js compile.
- Vitest vérifie au moins la CLI ledger et une simulation minimale.
- La première tâche Codex peut être exécutée avec moins de 200 lignes de
  contexte utile hors tests.
