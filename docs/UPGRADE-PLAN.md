# Upgrade Plan

## Current state

- Before this pass: **2/10** — Expo template scaffold with placeholder
  screens; CI masked every failure with `|| true`; lint failed; the app could
  not be bundled (missing `expo-asset`, `query-string`, outdated
  `expo-router`); `app.json` referenced icon files that do not exist.
- After this pass: **6/10** — real core feature, tested pure logic,
  honest CI, app bundles for Android.

## Backlog

### P0
- Add real app icons (`assets/icon.png`, `assets/adaptive-icon.png`) and
  reference them from `app.json` before any store build.

### P1
- Add component tests (jest-expo + @testing-library/react-native) for the
  main screen.
- Dark-mode palette (`userInterfaceStyle` is `automatic` but colors are
  hard-coded light).

### P2
- Sync with the web frontend's API once one exists.
- Upgrade Expo SDK (clears remaining `npm audit` findings in Expo tooling).

## Done in this pass

- Home tab is an AI art gallery with search, tag filter and favorites (favorites-only view).
- Pure logic in `lib/` with Vitest unit tests (`npm test`).
- CI now runs `npm ci`, lint, typecheck, tests and an Android bundle export
  with no failure masking; EAS preview build is owner-triggered only and
  `eas.json` is committed.
- Added `eslint.config.js`, `typecheck`/`test`/`validate` scripts and a
  committed `package-lock.json`.
- Fixed dependencies so Metro can bundle (SDK 53-aligned `expo-router`,
  `react-native`, `expo-constants`; added `expo-asset`, `expo-font`,
  `query-string`).
- `app.json`: removed references to missing icon files; Android package id
  no longer contains hyphens (invalid for Android application IDs).
- Removed the placeholder Explore tab.

## Done in this pass (pass 2)

Score: 7/10 (was 6/10) — favorites now survive restarts; still sample data and no icons.

- Favorites and the "Favorites only" toggle persist via AsyncStorage (`@react-native-async-storage/async-storage` 2.1.2) through `lib/usePersistentState.ts`; versioned, validated codec (`lib/persist.ts`) and `knownFavorites` drop stale ids.
- Accessibility: tag chips and profile links get descriptive labels/roles.
- Advisories: `overrides.postcss ^8.5.28` clears the high-severity PostCSS advisory in Expo metro-config (minor bump). Remaining `image-size` (metro, bundler-only), `uuid` (via `xcode`) and `decode-uri-component` (via `query-string@7`) need an Expo SDK major upgrade; deliberately not auto-fixed.
- Verified: typecheck, lint, 15 vitest tests, Android `expo export` bundle.

## Done in this pass (pass 3)

Score: 7.5/10 (was 7/10) — edge-case hunt in `lib/gallery.ts`.

- Bug: artworks were ordered by string comparison of `createdAt`, so timestamps with offsets sorted wrongly and an unparseable date jumped to the top. Sorting now uses the parsed instant (invalid dates last, title tie-break).
- Bug: tags differing only by zero-width space, BOM, spacing or case produced duplicate chips; tags and search now go through `normalizeText` (NFKC, invisible chars stripped, trimmed, lowercase), which also makes decomposed accents searchable.
- a11y: favourite toggle exposes `accessibilityState.selected`.
- Verified: typecheck, lint, 19 vitest tests, Android `expo export`.
