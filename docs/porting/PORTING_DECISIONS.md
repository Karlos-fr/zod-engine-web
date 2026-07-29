# Décisions de portage

Ce fichier consigne les décisions qui dépassent un symbole isolé.

| Date | Domaine | Décision | Justification |
|---|---|---|---|
| 2026-07-26 | architecture | Séparer simulation et rendu | La simulation doit pouvoir être testée sans Three.js ni navigateur. |
| 2026-07-26 | rendering | Remplacer SDL/OpenGL par Three.js | Le portage cible le navigateur et WebGL/WebGPU via Three.js. |
| 2026-07-26 | network | Reporter le réseau natif | Le premier objectif est une tranche jouable locale. |
| 2026-07-28 | simulation | Marquer ensemble `p_info::clear` et `p_info::logout` | Ces deux méthodes de `zcore.h` forment une paire de reset circulaire pour l'extracteur (`clear` appelle `logout`, tandis que l'extrait de `logout` contient des appels `clear` génériques). Le port TypeScript les couvre dans `PlayerInfo` avec des tests ciblés; le `clear` de `zmysql.h` reste rattaché à la persistance native différée. |
| 2026-07-28 | ui | Remplacer les flags d'action globaux de `zgui_window.h` par des états UI dédiés | Les fenêtres Web n'utilisent pas le conteneur C++ `gui_flags` pour transporter login, création utilisateur et commandes de production; chaque module UI expose son état explicite et testable. |
| 2026-07-28 | ui | Ignorer les no-op virtuels de base `ZGuiWindow` | Les méthodes de base qui retournent seulement `false` dans la fenêtre SDL native ne portent pas de comportement; les widgets Web portés exposent leurs propres gestionnaires d'entrée testés. |
| 2026-07-28 | rendering | Remplacer le cycle `SDL_RotoZoomSurface` / `SDL_ZoomSurface` / `SDL_RotateSurface` par les caches `SurfaceLifecycle` | Ces classes SDL spécialisées ne sont pas conservées comme objets runtime; le navigateur utilise des états typés et les fonctions `ImageScaling` / `SurfaceLifecycle` déjà testées pour charger la base image et produire les surfaces transformées à la demande. |
