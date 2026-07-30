# Tranche verticale initiale

Cette tranche ne prétend pas encore porter le gameplay de Zod Engine. Elle
valide les frontières techniques nécessaires au portage régulier.

## Ce qui existe

- `GameApplication` compose la simulation, le rendu, les entrées et la boucle.
- `GameLoop` utilise un pas fixe de simulation.
- `World` contient une `GameMap` et des entités.
- `GameMap.createFlat` crée une carte plate de validation.
- `GameEntity` accepte un ordre de déplacement et avance vers sa cible.
- `Canvas2DRenderer` observe l'état de `World`.
- `Canvas2DRenderer` affiche un terrain minimal et les entités.
- `InputController` envoie un ordre de déplacement de test au clic.

## Ce qui reste à porter depuis l'upstream

- Le vrai format `.map`.
- Les tuiles et terrains réels.
- Le pathfinding upstream.
- Les sprites et animations.
- La sélection précise par picking.
- Les ordres tactiques de Z.

## Critère de validation actuel

- `npm run build` doit compiler l'application.
- `npm test` doit valider la boucle de simulation et les utilitaires ledger.
- `npm run zport -- context <id>` doit fournir un contexte limité pour un
  symbole upstream.
