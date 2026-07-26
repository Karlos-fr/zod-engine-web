# Règles de contexte Codex

Ces règles limitent la taille du contexte utilisé pendant le portage.

## Règles obligatoires

- Ne jamais fournir un gros fichier C++ complet à Codex si `zport context` peut
  extraire un symbole.
- Ne jamais coller le contenu brut des assets, DLL, archives, images ou maps
  dans un contexte de portage.
- Toujours travailler depuis un ID du `PORTING_LEDGER.md`.
- Vérifier `npm run zport -- deps <id>` avant de porter un symbole.
- Ne pas porter un symbole si `Blocked By` contient un ID, sauf décision
  explicite documentée dans `PORTING_DECISIONS.md`.
- Porter uniquement le symbole demandé. Le champ `Lot` est informatif et ne
  donne jamais l'autorisation de porter plusieurs symboles.
- Terminer une tâche par la mise à jour du ledger via `zport done`, `block` ou
  `ignore`.

## Contenu autorisé dans un contexte

- Ligne du ledger.
- Extrait exact du symbole demandé.
- Déclaration de classe ou structure propriétaire.
- Constantes, enums et signatures directement référencées.
- Règles d'architecture applicables.
- Chemins des fichiers TypeScript existants liés à la tâche.

## Contenu interdit dans un contexte

- Fichier C++ complet classé `large` ou `huge`.
- Répertoire upstream complet.
- Archive ou binaire.
- Listing massif d'assets.
- Dépendances vendoriées SDL sauf si le symbole demandé en dépend directement.

## Budget cible

Une tâche de portage standard doit rester sous 200 lignes de contexte utile,
hors tests et résumé final.
