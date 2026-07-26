Voici la stratégie consolidée, dans un ordre simple et opérationnel.

Stratégie de portage de Zod Engine vers TypeScript et Three.js

Objectif

Porter progressivement Zod Engine depuis son code C++ historique vers une architecture Web moderne en TypeScript et Three.js.

Le portage ne doit pas être une traduction mécanique du C++ ligne par ligne. Le code source de Zod Engine sert de référence fonctionnelle pour reconstruire les comportements du jeu dans une architecture adaptée au Web.

Le processus doit rester piloté par des outils simples :

* une moulinette d’inventaire ;
* un référentiel Markdown tabulaire ;
* une CLI de portage ;
* un socle technique TypeScript/Three.js défini avant le portage massif.

⸻

1. Construire le référentiel source

Principe

Le référentiel doit être très fin.

Une ligne ne représente pas un fichier ou une classe entière, mais un symbole précis :

* classe ;
* structure ;
* enum ;
* fonction libre ;
* méthode ;
* variable globale ou statique ;
* constante ;
* macro significative.

Cela permet de transformer même un fichier C++ de plusieurs centaines de kilo-octets en une multitude de petits éléments analysables et portables.

Format

Le référentiel principal est un fichier Markdown tabulaire, par exemple :

| ID | Type | Symbole | Fichier | Décision | Domaine cible | Statut | Notes |
|---:|---|---|---|---|---|---|---|
| 1 | Classe | `ZObject` | `zobject.h` | PORTER | Simulation | À analyser | |
| 2 | Méthode | `ZObject::Process` | `zobject.cpp` | PORTER | Simulation | À analyser | |
| 3 | Méthode | `ZObject::Render` | `zobject.cpp` | REPLACE | Rendering | À analyser | Remplacer SDL |
| 4 | Constante | `MAX_OBJECTS` | `zdefines.h` | PORTER | Data | À analyser | |
| 5 | Fonction | `WinMain` | `main.cpp` | IGNORE | — | Exclu | Spécifique Windows |

Colonnes minimales

* ID
* Type
* Symbole
* Fichier
* Décision
* Domaine cible
* Statut
* Notes

Décisions possibles

Chaque symbole doit être qualifié avec une décision explicite :

* PORTER : comportement métier à reproduire ;
* ADAPT : comportement utile mais nécessitant une adaptation Web ;
* REPLACE : remplacé par une technologie moderne ;
* IGNORE : aucun intérêt dans la version Web ;
* DEFER : pertinent, mais reporté après le premier périmètre jouable.

Exemples :

* rendu SDL → REPLACE par Three.js ;
* audio SDL → REPLACE par Web Audio ;
* entrée Windows → IGNORE ;
* serveur réseau natif → DEFER ;
* logique de déplacement → PORTER.

Toute décision IGNORE, REPLACE ou DEFER doit comporter une justification courte.

⸻

2. Créer la moulinette d’inventaire

La moulinette parcourt automatiquement le dépôt C++ et génère le référentiel initial.

Elle doit identifier :

* les fichiers .h, .hpp, .c, .cpp ;
* les classes et structures ;
* les héritages ;
* les fonctions ;
* les méthodes ;
* les enums ;
* les constantes ;
* les variables globales et statiques ;
* les macros importantes ;
* les plages de lignes de chaque symbole.

Le premier objectif n’est pas de comprendre parfaitement le code, mais de garantir qu’aucun symbole n’est oublié.

La moulinette peut utiliser un parseur C++ tel que Tree-sitter. Une analyse textuelle simple peut compléter les cas non reconnus.

Elle doit également pouvoir extraire le code exact d’un symbole sans transmettre tout son fichier à Codex.

⸻

3. Traiter les gros fichiers

Certains fichiers de Zod Engine atteignent 100 à 300 Ko. Ils ne doivent jamais être considérés comme une unité de portage.

Règle

Un gros fichier est une source de symboles, pas une tâche Codex.

La moulinette doit le découper virtuellement selon les fonctions, méthodes, constantes et variables qu’il contient.

Par exemple :

zobject.cpp
├── ZObject::Process
├── ZObject::Move
├── ZObject::AttackObject
├── ZObject::Render
├── ZObject::PlaySound
└── fonctions utilitaires

Une tâche Codex reçoit uniquement :

* le symbole principal ;
* sa déclaration ;
* les champs de classe qu’il utilise ;
* les constantes et enums nécessaires ;
* les quelques fonctions directement appelées ;
* les décisions architecturales déjà validées.

Elle ne reçoit pas automatiquement les 300 Ko du fichier.

Lots cohérents

Même si le référentiel est atomique, certaines fonctions doivent être portées ensemble.

Exemple :

ZObject::StartMove
ZObject::ProcessMove
ZObject::StopMove
MOVE_SPEED
movement_state

La CLI peut les regrouper dans un petit lot cohérent.

Le référentiel reste symbole par symbole, mais la tâche porte plusieurs lignes liées lorsque cela est nécessaire.

⸻

4. Définir le socle technique avant le portage

L’architecture cible doit être définie à partir d’une description fonctionnelle de Z, et non copiée depuis l’architecture C++ de Zod Engine.

Description fonctionnelle préalable

Avant de coder le socle, il faut décrire les grands domaines du jeu :

* carte et terrain ;
* zones et territoires ;
* drapeaux et capture ;
* robots et véhicules ;
* bâtiments ;
* production ;
* ordres ;
* déplacement ;
* collisions ;
* pathfinding ;
* combats ;
* armes et projectiles ;
* destructions ;
* intelligence artificielle ;
* rendu ;
* interface ;
* audio ;
* réseau, reporté dans un premier temps.

Architecture cible initiale

Elle doit rester simple :

src/
├── app/
│   ├── GameApplication.ts
│   ├── GameLoop.ts
│   └── GameState.ts
│
├── simulation/
│   ├── World.ts
│   ├── entities/
│   ├── systems/
│   └── events/
│
├── world/
│   ├── Map.ts
│   ├── Tile.ts
│   ├── Zone.ts
│   └── NavigationGrid.ts
│
├── rendering/
│   ├── ThreeRenderer.ts
│   ├── CameraController.ts
│   ├── TerrainView.ts
│   └── EntityView.ts
│
├── input/
├── assets/
├── audio/
├── ui/
└── data/

Règles structurantes

* la simulation ne dépend jamais de Three.js ;
* Three.js ne contient aucune règle de gameplay ;
* le rendu observe l’état de la simulation ;
* les données d’équilibrage sont séparées du code ;
* l’IA utilise les mêmes ordres que le joueur ;
* la boucle de simulation utilise un pas fixe ;
* aucune abstraction n’est créée pour un besoin hypothétique ;
* l’architecture peut évoluer lorsque le premier portage concret l’exige.

Socle technique

Technologies proposées :

* TypeScript strict ;
* Vite ;
* Three.js ;
* Vitest ;
* ESLint ;
* Web Audio API ;
* IndexedDB pour les sauvegardes ultérieures.

Le réseau n’est pas prioritaire.

⸻

5. Valider le socle avec une première tranche verticale

Avant le portage massif, une petite version jouable doit valider l’architecture.

Première tranche :

1. charger une carte ;
2. afficher le terrain dans Three.js ;
3. créer une entité robot ;
4. afficher le robot ;
5. sélectionner le robot ;
6. lui donner un ordre ;
7. calculer un chemin ;
8. déplacer le robot ;
9. synchroniser la simulation avec le rendu.

Cette tranche vérifie :

* la séparation simulation/rendu ;
* la boucle de jeu ;
* le modèle d’entité ;
* le chargement des données ;
* le pathfinding ;
* les interactions souris ;
* la synchronisation Three.js.

Une fois cette tranche fonctionnelle, l’architecture est ajustée si nécessaire, puis considérée comme suffisamment stable pour démarrer le portage régulier.

⸻

6. Construire un graphe de dépendances

Le graphe sert à déterminer l’ordre général du portage.

Il n’a pas besoin de représenter toutes les fonctions du projet, ce qui le rendrait illisible.

Il représente plutôt les grands domaines et familles de symboles :

graph TD
    Map --> Navigation
    Navigation --> Movement
    Entity --> Robot
    Entity --> Vehicle
    Robot --> Movement
    Vehicle --> Movement
    Movement --> Combat
    Territory --> Capture
    Flag --> Capture
    Building --> Production
    Production --> Robot
    Production --> Vehicle
    AI --> Movement
    AI --> Combat
    AI --> Production

Le référentiel reste atomique, mais le graphe donne l’ordre fonctionnel.

Pour un symbole précis, la CLI construit localement son petit graphe de dépendances directes.

⸻

7. Créer la CLI de portage

La CLI doit rester légère. Elle sert principalement à piloter Codex et à lui fournir un contexte réduit.

Commandes possibles :

zport scan
zport list
zport show <id>
zport qualify <id>
zport context <id>
zport next
zport start <id>
zport done <id>
zport ignore <id>
zport status

zport scan

* analyse le code C++ ;
* crée ou met à jour le tableau Markdown ;
* ajoute les nouveaux symboles ;
* conserve les statuts déjà renseignés.

zport show

Affiche :

* le symbole ;
* le fichier ;
* ses lignes ;
* son code ;
* sa déclaration ;
* son statut ;
* sa décision.

zport qualify

Demande à Codex de déterminer :

* le rôle du symbole ;
* s’il faut le porter, l’adapter, le remplacer, l’ignorer ou le reporter ;
* son domaine cible ;
* les symboles liés à inclure dans le lot.

zport context

Produit un contexte limité contenant :

* le code du symbole ;
* sa classe ou structure ;
* les champs utilisés ;
* les constantes et enums référencés ;
* les fonctions directement appelées ;
* les règles d’architecture ;
* les éléments TypeScript déjà portés et nécessaires.

C’est cette commande qui réduit fortement la consommation de tokens.

zport next

Propose le prochain symbole ou lot portables selon :

* le graphe de dépendances ;
* les éléments déjà terminés ;
* la tranche fonctionnelle en cours ;
* les dépendances réellement bloquantes.

zport done

* marque les symboles comme terminés ;
* ajoute les fichiers TypeScript créés ;
* consigne éventuellement une note ;
* met à jour l’avancement.

⸻

8. Cycle de portage d’un symbole

Pour chaque symbole ou petit lot :

1. la CLI extrait le contexte ;
2. Codex analyse son rôle ;
3. Codex vérifie sa décision ;
4. Codex identifie sa place dans l’architecture cible ;
5. Codex porte uniquement le comportement utile ;
6. Codex remplace les éléments natifs si nécessaire ;
7. Codex ajoute ou adapte les tests ;
8. Codex exécute compilation, lint et tests ;
9. la CLI met à jour le référentiel.

Consigne centrale donnée à Codex :

Porte uniquement les symboles indiqués.
Respecte l’architecture cible existante.
Ne crée pas d’abstraction pour un besoin futur.
Ne refactorise pas les modules hors périmètre.
Ne traduis pas mécaniquement le C++.
Reproduis le comportement utile dans la version Web.
Termine par les tests et la mise à jour du référentiel.

⸻

9. Ordre général du portage

Phase 1 — Socle

* projet TypeScript/Vite ;
* boucle de jeu ;
* simulation ;
* rendu Three.js ;
* caméra ;
* chargement des assets ;
* entrées souris et clavier.

Phase 2 — Première tranche jouable

Carte
→ terrain
→ entité de base
→ robot
→ sélection
→ ordre
→ navigation
→ déplacement
→ animation

Phase 3 — Boucle fondamentale de Z

Drapeau
→ territoire
→ capture
→ bâtiment
→ production
→ unité ennemie
→ combat
→ destruction

Phase 4 — Portage du contenu

* robots ;
* véhicules ;
* bâtiments ;
* armes ;
* projectiles ;
* effets ;
* cartes ;
* missions.

Phase 5 — IA

L’IA vient après la stabilisation des systèmes qu’elle utilise :

* navigation ;
* déplacement ;
* capture ;
* production ;
* combat.

Phase 6 — Fonctionnalités secondaires

* audio complet ;
* sauvegardes ;
* éditeur ;
* commandes tactiles ;
* multijoueur ;
* améliorations graphiques.

⸻

10. Principes de contrôle

Exhaustivité

Tous les symboles détectés sont présents dans le référentiel, y compris ceux qui seront ignorés ou remplacés.

Petites tâches

Une tâche Codex porte un symbole ou un petit lot cohérent, jamais un gros fichier complet.

Architecture stable mais non figée

Les grandes frontières sont définies dès le départ, mais les classes internes peuvent évoluer après la première tranche jouable.

Pas de portage inutile

Les composants SDL, Windows, réseau natif ou système ne sont pas portés mécaniquement. Ils sont remplacés, ignorés ou reportés.

Pas de sur-ingénierie

Une abstraction n’est créée que lorsqu’elle répond à un besoin actuel et concret.

CLI comme mémoire externe

Codex ne doit pas relire tout le dépôt à chaque étape. La CLI fournit uniquement le contexte pertinent et conserve l’état du projet dans le référentiel Markdown.

Le point clé de toute la méthode est : socle minimal validé par une tranche jouable, puis portage fin piloté par le référentiel et la CLI, sans jamais prendre les gros fichiers comme unités de travail.