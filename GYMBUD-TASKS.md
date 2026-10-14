# GymBud Tasks

How to use: give Copilot ONE task at a time. Start in Plan mode (Shift+Tab), approve the plan,
then let it edit. Run `npx tsc --noEmit` and `npx jest` before finishing. One branch per task.

Suggested order: 1, 6, 2, 4, 7, 5, 3

---

## 1. Can't track an exercise twice in one workout (bug)

Repro: add Lateral Raises, log it, add other exercises, then add Lateral Raises again later in
the same workout. The second entry can't be tracked.

Task: find why the second instance of the same exercise can't be logged (likely something keyed
by exercise id/name that collides). Each added instance must be independent, with its own sets.

Done when:
- the same exercise can be added 2+ times in one workout, each with separate sets
- both instances are saved in history and counted by the ranking engine
- the 45s pre-exhaustion superset detection still works with repeated exercises
- a test covers a workout containing the same exercise twice

---

## 2. Rest timer end alert (feature)

Task: when the rest timer hits zero, alert the user.

Done when:
- a sound plays and the phone vibrates when the timer ends, with the app in the foreground
- if the app is backgrounded or the screen is locked, a local notification fires at the end time
  (schedule it when the timer starts, cancel it if the timer is skipped or reset)
- a setting toggles sound / vibration / notification independently
- works in Expo Go on iOS if possible. If it needs a dev build, say so before implementing

---

## 4. Better finished-workout preview (feature)

Current: a finished workout is shown in the same cramped UI as the active workout.

Task: build a read-only summary screen, tree style:

```
Push Day                     Oct 12 · 54 min
|- Dumbbell Flyes (Isolation)
|    |- Set 1   12 kg x 14
|- Dumbbell Bench Press (Compound)       [superset]
|    |- Set 1   24 kg x 9
|    |- Set 2   24 kg x 7
```

Done when:
- each exercise is a node, each set a child row (weight x reps)
- exercises that triggered the pre-exhaustion superset bonus show a small badge
- per-muscle score gained is shown if the engine exposes it
- the screen is read-only and opens from history and right after finishing a workout
- uses theme colors, no hardcoded hex

---

## 6. Delete folders (feature)

Task: let users delete a folder.

Behavior: if the folder is empty, delete immediately. If it contains items, show a confirmation
that says how many items will be affected and offers two choices:
- "Delete folder and everything inside"
- "Delete folder, move contents to root"
(plus Cancel)

Done when:
- both choices work and persist
- templates are never lost when "move to root" is chosen
- a test covers deleting a non-empty folder both ways

---

## 7. Move "Save as workout" to the finished-workout preview (change)

Do this after task 4, since the button lives on that screen.

Task:
- remove the save-as-workout prompt that appears when a workout finishes
- remove the matching button from Settings
- add a "Save as workout" button to the finished-workout preview screen, so it works for any
  finished workout, not just the latest one

Done when:
- finishing a workout no longer shows the prompt
- Settings no longer has the button
- the preview screen button saves the workout as a template and confirms with a short message
- saving the same finished workout twice doesn't create duplicates (or asks first)

---

## 5. Food search doesn't work properly (bug)

Symptom: searching "pizza" returns an unrelated product (some Arabic yogurt). This happens for
every query that isn't one of the app's own hardcoded recipes (e.g. shaorma, which works).

Relevant files: `src/utils/foodApi.ts` (`searchFoodByText`, uses OpenFoodFacts `cgi/search.pl`),
`src/components/IngredientPickerModal.tsx` (search UI and debounce) and `src/screens/CaloriesScreen.tsx`.

Step 1, diagnose before changing anything. Log the raw request URL and the first 10 product
names returned for "pizza", then report which of these is the cause:
- A. The legacy `search.pl` endpoint ranks poorly when unscoped (global, all languages, no
  sort). Possible fixes: add `sort_by=unique_scans_n` (popular products first), restrict by
  country with `tagtype_0=countries&tag_contains_0=contains&tag_0=romania` and fall back to
  worldwide if empty, or switch to OpenFoodFacts' newer search service
  (`https://search.openfoodfacts.org/search?q=...`). Check the official docs for the
  parameters before using it.
- B. Stale responses: the 600ms debounce delays the request but never cancels it, so a slow
  response for an older query (like "pi") can arrive after the newer one and overwrite it.
  Fix: AbortController, or ignore any response whose query no longer matches the input.
- C. Errors are swallowed: `searchFoodByText` returns `[]` on failure, so a network error looks
  like "no results".

Step 2, fix the cause, and order results sensibly: the app's own foods and the user's recent
foods first, OpenFoodFacts results after.

Done when:
- "pizza", "chicken", "rice" and "yogurt" each return relevant products first
- typing quickly never shows results for an older query
- loading, empty and error states are all visible and look different from each other
- "Can't find it? Add manually" is always reachable
- a test covers the stale-response case

Related but separate, later: points / reward animations when logging food.

---

## 3. Vitals (heart rate) during and after workouts (big feature, do last)

Heads up: on iPhone, heart rate comes from HealthKit (usually via Apple Watch). That needs
native code, so it will NOT work in Expo Go and requires an Expo dev build. Android needs
Health Connect instead.

Task: first write a short plan covering which library to use, which permissions are needed, and
whether it works without a dev build. Do not implement until the plan is approved.

Done when (after approval):
- the user grants health read permission
- live heart rate shows on the active workout screen when available
- average and max heart rate show on the finished-workout preview
- everything degrades gracefully when no watch or permission is present


---

## 8. Drop set detection in the ranking engine (feature, low priority)

Do this after tasks 1 and 4. It changes scoring, so it needs tests and the user should
re-run "recalculate from history" afterward.

Background: the engine already scores a lighter extra set lower and shrinks it with the
diminishing-returns bonus `0.15 * 0.4^n`, so stacked drops cannot inflate a rank. This task only
decides how much credit a real drop set deserves.

Task: detect drop sets in `src/utils/rankingEngine.ts` and give them a small, capped bonus.

A set is a drop set when ALL of these hold:
- same exercise as the previous set (same exercise name, adjacent sets, either as extra sets
  inside one exercise entry or as back-to-back entries of the same exercise)
- it starts within about 30 seconds of the previous set ending
- its weight is lower than the previous set's weight

Scoring:
- a drop set still counts as an extra set under the existing diminishing-returns formula
- add a small flat bonus, similar in size to the existing superset add-on (about +0.05 x
  the set's score), for at most 3 drops per exercise instance; further drops get no bonus
- the best (heaviest, top) set is never treated as a drop set
- do not change the isolation-to-compound pre-exhaustion rule, which still applies only
  between different exercise names

Done when:
- tests cover: a normal 3-drop sequence, a weight increase (not a drop), a gap longer than
  30s (not a drop), 5 drops (bonus stops after 3), and drops logged as separate entries
- a table of before/after scores for a sample drop-set workout is printed in the PR notes
- existing ranking tests still pass unchanged
