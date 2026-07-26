# Décisions de portage

Ce fichier consigne les décisions qui dépassent un symbole isolé.

| Date | Domaine | Décision | Justification |
|---|---|---|---|
| 2026-07-26 | architecture | Séparer simulation et rendu | La simulation doit pouvoir être testée sans Three.js ni navigateur. |
| 2026-07-26 | rendering | Remplacer SDL/OpenGL par Three.js | Le portage cible le navigateur et WebGL/WebGPU via Three.js. |
| 2026-07-26 | network | Reporter le réseau natif | Le premier objectif est une tranche jouable locale. |
