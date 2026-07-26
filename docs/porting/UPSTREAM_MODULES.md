# Modules upstream et ordre fonctionnel

Ce document donne une carte fonctionnelle courte du snapshot C++.

## Graphe général

```text
Map -> Navigation -> Movement -> Combat
Entity -> Robot -> Movement
Entity -> Vehicle -> Movement
Territory -> Capture
Building -> Production -> Units
AI -> Orders -> Movement/Combat/Production
Rendering observes Simulation
```

## Domaines initiaux

| Domaine | Upstream probable | Cible TypeScript |
|---|---|---|
| map-format | `src/zmap.*`, fichiers `.map` | `src/world/` |
| entity-core | `src/zobject.*` | `src/simulation/entities/` |
| robot-basic | `src/zrobot.*`, `src/r*.{h,cpp}` | `src/simulation/entities/` |
| navigation-basic | `src/zpath_finding*` | `src/world/NavigationGrid.ts` |
| movement-basic | `zobject`, `zvehicle`, `zrobot` | `src/simulation/systems/` |
| rendering-basic | `zsdl*`, render methods | `src/rendering/` |
| selection-orders | cursor, orders, player input | `src/input/`, `src/simulation/events/` |
| audio | `zsound_engine`, `zmusic_engine` | `src/audio/` |
| network | `zserver`, `zclient` | deferred |
