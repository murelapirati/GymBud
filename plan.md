# GymBud implementation status

## Completed
- Library folder system and Default folder bootstrap
- Hybrid food search with local catalog + OpenFoodFacts fallback
- Body Map recalibration, rank fixes, Platinum/Diamond progress, and gender-aware thresholds
- Default template seeding and migration scaffolding
- Related tests and validation for core app features

## Still pending from newChanges.md / newOtherChanges.md
1. Workout type migration: replace legacy `gym`/`calisthenics` values with `strength` and migrate stored data/UI labels.
2. Custom exercise form revamp: equipment/mechanic/category/muscle selection, derived multiplier, and saved metadata updates.
3. 1RM formula upgrade: weighted ensemble estimate + per-muscle half-life decay in the ranking engine.
4. Food-search expansion: complete the remaining provider/catalog work and validation for the hybrid food layer.

## Next step
Finish the four pending tasks in dependency order, then re-run the smallest relevant TypeScript/Jest validation before any final PR or push.
