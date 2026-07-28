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
npm run zport -- batch constants --limit 10
npm run zport -- batch constants --limit 10 --apply-plan
npm run zport -- deps <id>
npm run zport -- brief <id>
npm run zport -- context <id>
npm run zport -- show <id>
npm run zport -- start <id>
npm run zport -- done <id> --target <path>
npm run zport -- done-batch constants --target <path> <id>...
npm run zport -- audit-comments
npm run zport -- block <id> --note "reason"
npm run zport -- ignore <id> --note "reason"
```

Si un ID apparaît plusieurs fois dans le référentiel, la CLI le signale. Quand
les lignes correspondent au même symbole upstream dans le même fichier, `done`
marque toutes les occurrences équivalentes ensemble. Si les lignes ne sont pas
équivalentes, la CLI refuse l'action pour éviter de masquer une collision d'ID.

Pour réduire le contexte consommé pendant le portage, `brief <id>` doit être
préféré à `context <id>` lorsque l'extrait upstream suffit. `brief` ajoute aussi
une recherche courte dans `src` pour repérer un symbole déjà porté ou un
équivalent local.

## Workflow de portage

Par défaut, le portage se fait strictement **un symbole à la fois**.

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

### Lots de constantes simples

Exception : les constantes et macros scalaires indépendantes peuvent être
portées par petits lots homogènes pour réduire le coût du cycle de portage.

Un lot est autorisé uniquement si tous les symboles respectent ces règles :

- type `constant` ou `macro` ;
- extrait upstream sur une seule ligne ;
- pas de macro-fonction ;
- même fichier upstream ;
- même domaine cible ;
- `blocked_by` vide pour chaque ID ;
- même fichier TypeScript cible ;
- test de parité ajouté pour chaque constante ;
- commentaire d'entité ajouté pour chaque constante.

Taille recommandée : 5 à 15 constantes maximum. Utiliser une taille plus
petite si les constantes sont conditionnelles, calculées, renommées fortement ou
liées à des règles métier sensibles.

La CLI peut proposer un lot sûr :

```sh
npm run zport -- batch constants --limit 10
```

Pour obtenir un plan compact avec les lignes upstream et les correspondances
déjà présentes dans `src` :

```sh
npm run zport -- batch constants --limit 10 --apply-plan
```

Options utiles :

```sh
npm run zport -- batch constants --limit 8 --file constants.h --domain simulation
```

Workflow pour un lot de constantes :

1. Proposer le lot :
   ```sh
   npm run zport -- batch constants --limit 10 --apply-plan
   ```
2. Vérifier chaque ID du lot :
   ```sh
   npm run zport -- deps <id>
   npm run zport -- brief <id>
   ```
3. Porter uniquement ces constantes dans le même fichier cible.
4. Ajouter les commentaires d'entité et les tests de parité.
5. Valider :
   ```sh
   npm run lint
   npm test
   npm run build
   ```
6. Marquer le lot :
   ```sh
   npm run zport -- done-batch constants --target <path> <id>...
   ```

Les enums, structures, classes, fonctions et méthodes restent à porter un
symbole à la fois. Les macros conditionnelles, calculées ou dépendantes doivent
être traitées comme des éléments sensibles, donc hors lot sauf justification
explicite dans les notes du ledger.

## Norme de commentaires de portage

Les commentaires dans le code porté doivent rester utiles au lecteur du code.
Ils doivent expliquer ce qu'est l'entité et d'où elle vient, pas raconter le
travail de portage ni son voisinage technique. Le contexte de portage reste
dans le référentiel et dans la CLI : dépendances, includes upstream, liste
d'appels, statut, décision, blocages, justification de sélection, ordre de
traitement et notes de lot ne doivent pas apparaître dans les commentaires du
code.

Chaque fichier contenant du code porté doit commencer par un en-tête court qui
donne seulement l'origine upstream du module. L'en-tête ne doit pas contenir de
dépendances, includes, liste de symboles, statut, décision, lot de portage ou
IDs de ledger. Ces informations restent dans `PORTING_LEDGER.md` et dans la
CLI.

```ts
/**
 * Upstream: zmap.h / zmap.cpp
 */
```

Chaque entité portée doit aussi avoir son propre en-tête : classe, structure,
type, interface, enum, fonction, méthode, constante, macro adaptée ou variable
globale. Le rôle fonctionnel est obligatoire, mais il doit rester concis.

Format minimal :

```ts
/**
 * Port of upstream `<symbol>`.
 * Role: <short description of the entity and its responsibility in the game>.
 * Upstream: <file>:<lines>
 */
```

La ligne `Role` doit décrire seulement le rôle métier ou technique immédiat de
l'entité, en une phrase courte. Elle doit répondre à "à quoi sert cette entité ?"
sans décrire le graphe autour d'elle.

La ligne `Role` ne doit jamais lister les dépendances, les utilisateurs, les
appelants, les appelés, les includes upstream, les raisons de sélection par la
CLI, les IDs de ledger, ni l'ordre de portage. Elle ne doit pas non plus
décrire les transformations ordinaires du portage : changement de nom
TypeScript, injection de dépendance, remplacement d'un état global, conversion
d'un pointeur ou adaptation d'une API navigateur.

Formulations à éviter dans le code :

- `Depends on ...`
- `Uses ...`
- `Called by ...`
- `Required before ...`
- `Selected by zport ...`
- `Ported with ...`
- `Ledger: ...`

Ces informations appartiennent au ledger, aux tests ou à la sortie de la CLI,
pas au code applicatif.

La ligne `Adaptation` est exceptionnelle. Elle n'est autorisée que si le code
serait ambigu sans elle, par exemple une différence volontaire de comportement
ou une transformation non évidente. Les conversions ordinaires du portage
(`struct` vers `type`, macro vers constante, méthode C++ vers fonction
TypeScript, état global vers objet explicite) ne doivent pas être commentées
dans le code ; elles peuvent être notées dans le ledger si nécessaire.

```ts
/**
 * Port of upstream `pf_point`.
 * Role: Tile-space coordinate used by the A* pathfinding queue.
 * Upstream: zpath_finding_astar.h:18-27
 */
export type PathfindingPoint = {
  x: number;
  y: number;
};
```

Les commentaires en ligne sont réservés aux écarts importants avec l'upstream ou
aux points de parité comportementale. Ils ne doivent pas paraphraser le code.

La norme peut être contrôlée automatiquement :

```sh
npm run zport -- audit-comments
```

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
