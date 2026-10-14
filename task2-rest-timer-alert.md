# Task 2: Rest timer alert (works in Expo Go, fixes iOS silent mode)

Read AGENTS.md first. Do this task only. Start in Plan mode and wait for approval.

## Constraints

- The app runs in Expo Go on a physical iPhone (Expo SDK 57). The developer is on Linux and
  cannot make local iOS dev builds. Do NOT add any package that is not bundled in Expo Go.
  Install with `npx expo install <pkg>` so versions match the SDK.
- If any part of this task cannot work in Expo Go, stop and tell me which part and why. Build
  the rest and leave that part out. Do not work around it with native code.
- Do not touch `rankingEngine.ts` or any scoring code.

## Current behavior (a bug to fix)

The rest timer already vibrates when it ends, but on iPhone the vibration is muted when the
silent switch is on. It must still alert in silent mode.

## Step 1: investigate before changing anything

1. Find the rest timer code and the existing vibration call. Report which API it uses
   (probably React Native's `Vibration`).
2. Report which of expo-haptics, expo-audio, expo-av and expo-notifications are already in
   package.json.
3. Check the Expo SDK 57 docs for these packages and report the exact names of the options
   you will use. In particular, confirm how expo-audio lets playback continue in iOS silent
   mode (I expect an audio mode option like `playsInSilentMode`), and whether expo-haptics
   respects the silent switch. Do not guess these from memory.

My expectation, to be verified: React Native's `Vibration` on iOS follows the "Vibrate on
Silent" system setting, while expo-haptics (Taptic Engine) does not follow the silent switch
but needs "System Haptics" enabled in iOS settings.

## Step 2: implement

### A. End-of-timer alert while the app is open

- Haptics: replace the existing `Vibration` call with expo-haptics (success notification
  feedback, repeated 3 times about 300ms apart). Respect the vibration toggle below.
- Sound: play a short beep with expo-audio. Configure the audio mode so it plays even when
  the silent switch is on, and so it lowers other audio (for example music) instead of
  stopping it. Respect the sound toggle below.
- Sound asset: generate a short (under 1 second) sine-wave beep as a WAV file with a small
  Node script, so there are no licensing issues. Commit the asset, not the script, to
  `assets/sounds/`.
- Load the sound once and reuse it. Unload it when the timer screen unmounts.

### B. End-of-timer alert while the app is in the background or the screen is locked

- When the timer starts, schedule a local notification (expo-notifications) for the end time.
  Title "Rest over", body "Time for your next set".
- Cancel the scheduled notification when the timer is skipped, reset, finished early, or the
  workout ends. When the duration is adjusted (for example +15s), cancel and reschedule.
- Ask for notification permission the first time a timer starts, not at app launch. If the
  user denies it, the in-app alert still works and nothing crashes.
- Set the notification handler so a notification arriving while the app is in the foreground
  does not show a banner (the in-app alert already covers it).
- Known iOS limit, document it in a code comment and in the settings screen text: a
  notification's sound follows the silent switch, so in silent mode the background alert may
  be silent. Do not try to work around this.

### C. Timer accuracy

- Store the timer as an absolute end timestamp (`Date.now() + duration`), not a tick counter,
  so it stays correct when the app is backgrounded.
- When the app returns to the foreground, recompute the remaining time. If the timer ended
  while the app was in the background, show the finished state without playing the sound and
  haptics a second time (the notification already alerted the user).

### D. Settings

- Three independent toggles on the settings screen: Sound, Vibration, Notification. All
  default to on. Persist them in AsyncStorage under new keys. A missing key means the default,
  so existing users need no migration.
- Short helper text under the toggles about the silent mode note from B.

## Done when

- `npm test` and `npx tsc --noEmit` pass.
- A Jest test covers the pure timer logic: remaining time from an end timestamp, a timer that
  ended while backgrounded, and reschedule on a +15s adjustment.
- Report back a manual test list for a physical iPhone, with the expected result for each:
  1. app open, silent switch off: beep and haptics
  2. app open, silent switch ON: beep and haptics still happen
  3. app minimized: notification appears at the end time
  4. screen locked: notification appears at the end time
  5. skipping the timer: no notification arrives later
  6. each toggle off disables only its own alert
  7. notification permission denied: in-app alert still works
- Report anything you left out because of Expo Go limits.
