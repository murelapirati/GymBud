# Task 9: Active workout screen redesign

Read AGENTS.md first. This task has four phases (A, B, C, D). Do ONE phase per session, on its
own branch, then stop and report. Start each phase in Plan mode and wait for approval.
Phase B replaces task 2, so skip task 2 in GYMBUD-TASKS.md.

The Expo Go rules from task 2 apply everywhere: the app runs in Expo Go on a physical iPhone
(Expo SDK 57), the developer is on Linux and cannot make iOS dev builds. Install packages with
`npx expo install`. If something cannot work in Expo Go, stop and say so before building.

## Files involved (found by reading the repo)

- `src/screens/ActiveWorkoutScreen.tsx` (1602 lines): the current workout screen
- `src/context/ActiveWorkoutContext.tsx`: workout state, `logSet`, `updateSet`, `deleteSet`,
  `toggleSetWarmup`, `moveExercise`, `startRestTimer`, `addExtraRestTime`, `cancelRestTimer`
- `src/screens/RestTimerScreen.tsx` and its routing in `App.tsx`: the full-screen circle timer
- `src/components/RestTimerStatusBar.tsx`: the green banner (already global, in `App.tsx`)
- `src/components/workout/ActiveWorkoutModal.tsx`: older workout UI. Do not redesign it. Report
  whether anything can still open it; if it is dead code, say so and leave it alone.

## Visual direction (from the approved mockup)

Dark cards, compact density, red accent. Use `theme.*` colors, not the hex values below, which
only show intent. No emojis anywhere. Sizes in dp.

```
Header:   [<]  Push Day                    [Finish]
               0:14 - Strength
Rest bar (only while resting, under the header):
          REST  1:12            [+30s] [Skip]
          ===----------------------
Card per exercise:
 +----------------------------------------------+
 | (grip)  Barbell Incline Bench Press  [Barbell]  (...) |
 |         Compound - Last: 60 kg x 10    [Warm-up]       |
 |   W   40 kg x 12            <- logged sets, plain lines |
 |   W   50 kg x 8                                         |
 |   1   60 kg x 10                                        |
 |  [ KG  50 ] [ REPS  8 ]   [ Log ]   <- entry row        |
 +----------------------------------------------+
        ( Superset )        <- red connector, shown only when linked
 +----------------------------------------------+
 ...
[ + Add exercise ]    <- pinned at the bottom
```

Sizes: card padding about 10, gap between cards 8, name 15 bold, logged set line 32 high with
15 bold text, entry inputs and Log button 38 high, Warm-up pill 28 high, bottom Add button 48.

## Phase A: workout card

Rebuild the exercise card in `ActiveWorkoutScreen.tsx` for strength exercises.

- Remove the per-card up, down, collapse and delete buttons, the big red "Log Set" button, the
  "Mark as Warm-up" checkbox, the "Add Exercise or Activity" card at the top and the
  "Rendering N exercises..." debug text.
- Header row: grip handle (visual only in this phase), exercise name, equipment badge (colors as
  in the exercise picker), and a "..." button (menu comes in phase C; for now it opens a menu
  with only "Delete exercise", with a confirmation if the exercise has logged sets).
- Sub line: mechanic label and "Last: 60 kg x 10", then the Warm-up pill on the right. "Last" is
  the top working set of this exercise in the most recent earlier workout from history; hide
  "Last:" when there is no history. Weights display in the user's unit (`measurementSystem`),
  stored values stay as they are now.
- Logged sets are plain lines: label, then "weight unit x reps". Warm-up sets are labeled `W`
  in amber and do not use up the numbering (two warm-ups then the first working set is `1`).
- Tapping a logged set expands it in place into an editor: weight input, reps input, Save and a
  delete icon. Only one set is in edit mode at a time. Use `updateSet`, `deleteSet`.
- Entry row: weight and reps inputs plus one Log button. Pre-fill from the last set logged in
  this exercise in this session, else the last session's top set, else empty. The Warm-up pill
  toggles whether the next logged set is a warm-up and turns off after logging.
- "Add exercise" moves to a button pinned at the bottom; the header "X" (cancel) must no longer
  sit next to the finish button. Put discard workout in a menu or behind a confirmation.
- Keep working: finish flow, save as template, cardio and stretching sections (not redesigned),
  and calisthenics-style sets if they still exist in the data.

Tests: pure helper tests for set numbering with warm-ups, and for the "last time" lookup.

## Phase B: rest flow and alerts (replaces task 2)

New flow after tapping Log:

1. The set is logged immediately when Log is tapped (today it is only logged after the picker
   closes; tapping outside the sheet must never lose the set).
2. A bottom sheet "Rest for" appears with six one-tap choices: 1:00, 1:30, 2:00, 3:00, 5:00,
   7:00, plus "Custom time" and "Skip rest". Tapping a choice closes the sheet and starts the
   timer. "Skip rest" or tapping outside closes the sheet with no timer.
3. "Custom time" switches the sheet to a custom view: minutes (0 to 30, step 1) and seconds
   (0, 15, 30, 45), minus and plus buttons for each, Back, and a "Start m:ss" button.
4. While resting, a slim bar shows the remaining time with "+30s" and "Skip". Rework
   `RestTimerStatusBar.tsx` for this and keep it global so it also shows on other tabs. Tapping
   the bar navigates to the active workout; it no longer opens a full-screen timer.
5. Delete `RestTimerScreen.tsx` and its `showRestTimer` routing in `App.tsx`. Remove the "Rest
   Complete! Let's Go" popup (find it by searching for `restTimerCompleted`). When the rest ends,
   the bar switches to a "Rest over" state and goes away when the next set is logged or the
   user dismisses it.
6. Remove the `@react-native-picker/picker` wheel UI for rest if nothing else uses it. Keep the
   package if other screens use it.

Alerts, silent mode and the three settings toggles: implement exactly as described in
`task2-rest-timer-alert-prompt.md` (sections A, B, C, D). Read that file now. Two adjustments:
the timer state in `ActiveWorkoutContext` already stores an end time; reuse it. And the
notification is scheduled when the rest starts (step 2 or 3 above), not when Log is tapped.

Tests: the timer logic tests from the task 2 file, plus a test that logging a set and then
dismissing the rest sheet leaves the set logged with no timer.

## Phase C: superset link

Data model:
- Add an optional field to `WorkoutExercise`: `supersetWithNext?: boolean`. It means "this
  exercise is linked to the exercise directly after it". Old saved workouts have no field and
  must keep loading and working.
- Persist it wherever workouts are saved to history.

UI:
- The "..." menu on each card becomes a bottom sheet titled with the exercise name. Items:
  "Superset with next exercise" (or "Unlink from next exercise"), "Superset with previous
  exercise" (or "Unlink from previous exercise"), "Delete exercise" (red, last). The first card
  has no "previous" item and the last card has no "next" item.
- A linked pair shows a small red "Superset" pill between the two cards. It is display only
  (not tappable), so it cannot be hit by accident.
- Only adjacent exercises can be linked. If exercises are moved or deleted so a linked pair is no
  longer adjacent, clear that link.

Ranking (this is the one place in task 9 that may change `rankingEngine.ts`):
- First read how the pre-exhaustion bonus is detected today (isolation exercise followed by a
  compound exercise sharing a muscle, within 45 seconds) and report it before changing code.
- If the workout has any `supersetWithNext` links, use the links to decide which exercises are a
  pair, and keep every other rule unchanged: the first exercise must be an isolation, the second a
  compound, they must share a muscle, and the bonus stays at its current size and scope.
- Workouts with no links at all keep using the 45-second timing exactly as now.
- Add tests: linked pair with a slow gap (bonus applies), linked compound then isolation (no
  bonus), unlinked pair close in time inside a workout that has other links (no bonus), and an
  old workout without the field (unchanged result).
- After this phase the user will re-run "recalculate scores from history", so mention it in the
  report.

## Phase D: drag to reorder and dismiss behavior

Drag and drop:
- The grip handle starts a drag after a long press. While dragging, every card collapses to one
  line (name and set count) so a long workout fits on screen, the dragged card is lifted with a
  shadow, and a dashed "Drop here" slot shows the landing spot. Releasing drops it; the cards
  expand again.
- Add `reorderExercises(fromIndex, toIndex)` to `ActiveWorkoutContext` and keep `moveExercise`
  working if anything else calls it. Apply the link-clearing rule from phase C after a reorder.
- First check whether drag and drop can work in Expo Go with Expo SDK 57 and React Native 0.86
  (candidates need `react-native-reanimated` and `react-native-gesture-handler`; check the
  current Expo docs for the right versions and any babel or worklets setup). Report what you
  found before installing anything. If it cannot work in Expo Go, stop and report, and propose
  the fallback of a reorder mode with long-press then up/down arrows.

Dismiss behavior across the app:
- Tapping outside any bottom sheet or modal closes it (rest sheet, "..." menu, exercise picker,
  finish modal and similar). Android back and swipe-down gestures close them where the platform
  supports it.
- Search bars (exercise picker and anywhere else) clear and hide their keyboard when the user
  picks a result or taps outside; a search should never stay stuck open.
- Tapping outside the number inputs dismisses the numeric keyboard.

Tests: reorder helper tests (move up, move down, move to the same index, links cleared).

## Done when (every phase)

- `npm test` and `npx tsc --noEmit` pass
- the phase's behavior is manually tested on the iPhone, and you report a short manual test list
- anything not done or skipped (and why) is listed in the report
- no changes outside the files the phase needs
